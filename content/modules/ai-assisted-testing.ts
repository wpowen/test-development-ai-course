import type { TutorialPage } from "../course.ts";

type AssistedSpec = {
  id: "TD-T05" | "TD-T06" | "TD-T07" | "TD-T08";
  title: string;
  type: "项目" | "诊断";
  duration: string;
  prerequisites: string[];
  summary: string;
  why: string;
  outcomes: string[];
  artifact: string;
  problem: string[];
  mechanism: string[];
  nodes: string[];
  decisionRows: string[][];
  prompt: string;
  faultCode: 1 | 2;
  faultMeaning: string;
  baselineExpected: string;
  faultExpected: string;
  repairExpected: string;
  practice: string[];
  completion: string[];
  sources: string[];
  boundary: string;
};

const WORKING_DIRECTORY = "materials/ai-assisted-testing";

const assistedActions: Record<AssistedSpec["id"], string> = {
  "TD-T05": "把 PRD、设计、Diff 与 Oracle 分开解读",
  "TD-T06": "用独立 Mutation 证明候选测试能杀错",
  "TD-T07": "从失败模型选择边界、组合、属性或 Fuzz",
  "TD-T08": "保留原始失败，再提出候选簇",
};

const makePage = (spec: AssistedSpec): TutorialPage => {
  const action = assistedActions[spec.id];
  const topic = spec.id.toLowerCase();
  const manifestPath = `${WORKING_DIRECTORY}/page-manifests/${spec.id}.json`;
  const promptRoot = `${WORKING_DIRECTORY}/page-prompts/${spec.id}`;
  const reportRoot = `reports/${topic}`;
  return {
    id: spec.id,
    moduleId: "TD-M02",
    order: 0,
    title: spec.title,
    type: spec.type,
    status: "fixture-tested",
    duration: spec.duration,
    summary: spec.summary,
    why: spec.why,
    prerequisites: spec.prerequisites,
    outcomes: spec.outcomes,
    artifact: spec.artifact,
    blocks: [
      {
        title: action,
        body: spec.problem,
        warning: "AI 输出始终是候选。需求、Oracle、权限、因果结论与发布决定必须来自独立证据和具名 owner；缺证据时保留 UNKNOWN/BLOCKED。",
      },
      {
        title: `${action}：证据如何流转与停止`,
        body: spec.mechanism,
        technical: {
          kind: "diagram",
          content: spec.nodes.join(" → "),
          verification: "逐节点核对输入版本、原始引用、独立 Oracle、失败状态和审批 owner；此图是解释性架构，不是运行证据。",
        },
      },
      {
        title: `${action}：选择方法而不补全未知`,
        body: ["选择依据是失败模型、证据质量和可逆性。表中任一停止条件出现，都不得以模型置信度或流畅解释覆盖。"],
        table: {
          headers: ["输入/现象", "采用动作", "停止条件"],
          rows: spec.decisionRows,
          caption: `${spec.id} 的 fail-closed 决策表`,
        },
      },
      {
        title: `${action}：Prompt 生成候选，Critic 查缺口`,
        body: [
          "Manifest 将 Prompt、Input、Schema、Eval、Mutation、Critic 和 model-config 固定为 1.0.0。八类 eval 覆盖正常、边界、冲突、缺失、越权、拒答、截断与同义改写。",
          "独立 Oracle 位于生成器包之外；当前 model_evidence=NOT_RUN。复制 Prompt 只能复用合同，不能复用本页 fixture 的业务规则或通过结论。",
        ],
        technical: {
          kind: "prompt",
          content: spec.prompt,
          version: "1.0.0",
          promptPath: `${promptRoot}/prompt-v1.md`,
          manifestPath: `${promptRoot}/manifest.json`,
          inputFixturePath: `${promptRoot}/input.json`,
          outputSchemaPath: `${promptRoot}/schema.json`,
          evaluationPath: `${promptRoot}/eval.json`,
        },
        expected: "Prompt 输出保持 CANDIDATE 或明确 stop state；不得自建 Oracle、自批根因或把缺失字段补成事实。",
      },
      {
        title: `${action}：先锁定批准 Baseline`,
        body: [
          "从公开材料目录运行命令。报告同时保存 basis、Oracle 与 Prompt manifest 哈希，避免用更新后的规则解释旧结果。",
          "如果 baseline 失败，先修输入、fixture 或候选合同；不要继续故障注入，也不要放宽 expected。",
        ],
        technical: {
          kind: "command",
          content: `python3 ai_assisted_lab.py run --topic ${spec.id} --phase baseline --report ${reportRoot}-baseline.json`,
          manifestPath,
          stepId: `${topic}-baseline`,
          workingDirectory: WORKING_DIRECTORY,
          expectedExitCode: 0,
          expectedArtifacts: [`${reportRoot}-baseline.json`],
        },
        expected: spec.baselineExpected,
      },
      {
        title: `${action}：Fault 预期退出 ${spec.faultCode}`,
        body: [
          spec.faultMeaning,
          "Fault 命令的非零退出码是预期证据，不得用 `|| true`、改 expected 或吞异常伪造绿色。若实际退出 0，说明检测链失效。",
        ],
        technical: {
          kind: "command",
          content: `python3 ai_assisted_lab.py run --topic ${spec.id} --phase fault --report ${reportRoot}-fault.json`,
          manifestPath,
          stepId: `${topic}-fault`,
          workingDirectory: WORKING_DIRECTORY,
          expectedExitCode: spec.faultCode,
          expectedArtifacts: [`${reportRoot}-fault.json`],
        },
        expected: spec.faultExpected,
      },
      {
        title: `${action}：恢复权威输入后重放`,
        body: [
          "修复必须针对故障来源：恢复引用、恢复批准实现、恢复幂等约束或恢复 Trace/版本一致性。不能修改 Oracle 来迎合错误。",
          "重放沿用相同 fixture 和版本合同；若结果仍不稳定，保留 UNKNOWN 并补充环境证据。",
        ],
        technical: {
          kind: "command",
          content: `python3 ai_assisted_lab.py run --topic ${spec.id} --phase repair --report ${reportRoot}-repair.json`,
          manifestPath,
          stepId: `${topic}-repair`,
          workingDirectory: WORKING_DIRECTORY,
          expectedExitCode: 0,
          expectedArtifacts: [`${reportRoot}-repair.json`],
        },
        expected: spec.repairExpected,
      },
      {
        title: `${action}：fixture 边界与项目迁移`,
        body: [
          "本页命令运行标准库合成 fixture，不调用模型、不访问真实仓库/遥测/生产服务。它证明的是合同、故障注入与退出码传播可执行。",
          "迁移到团队项目时，必须重新冻结 basis/Oracle、补真实集成运行、独立评审、性能与安全证据；这些门禁未完成前不得提升为 live 或 practitioner。",
        ],
      },
    ],
    practice: spec.practice,
    completion: spec.completion,
    sourceIds: spec.sources,
    evidenceBoundary: spec.boundary,
    architecture: {
      title: `${spec.title} 的完整证据链`,
      caption: "架构将候选生成、确定性校验、独立 Oracle、故障反证和人工决策分开，避免同一模型批准自己的输出。",
      nodes: spec.nodes,
    },
    materials: [
      { title: "完整 AI 辅助传统测试实验包", description: "包含四页 runner、fixtures、Prompt/Eval/Mutation、精确 manifest 与红绿报告。", href: "materials/ai-assisted-testing.zip", kind: "archive", validation: "fixture-tested" },
      { title: "离线标准库 Runner", description: "执行 TD-T05 至 TD-T08 的 baseline、fault、repair，不调用模型。", href: `${WORKING_DIRECTORY}/ai_assisted_lab.py`, kind: "script", validation: "fixture-tested" },
      { title: `${spec.id} 精确执行 Manifest`, description: "固定工作目录、三条命令、预期退出码与报告路径。", href: manifestPath, kind: "config", validation: "fixture-tested" },
      { title: `${spec.id} Prompt/Eval/Mutation Manifest`, description: "绑定候选生成权限、独立 Oracle 路径、八类 eval 和 stop states。", href: `${promptRoot}/manifest.json`, kind: "config", validation: "static-reviewed" },
      { title: `${spec.id} Fault 报告`, description: "保存被拒绝的变异、原始引用、expected/actual 与证据边界。", href: `${WORKING_DIRECTORY}/${reportRoot}-fault.json`, kind: "evidence", validation: "fixture-tested" },
      { title: `${spec.id} Repair 报告`, description: "相同合同下恢复后的可重放证据；不代表真实集成。", href: `${WORKING_DIRECTORY}/${reportRoot}-repair.json`, kind: "evidence", validation: "fixture-tested" },
    ],
  };
};

const specs: AssistedSpec[] = [
  {
    id: "TD-T05",
    title: "从冻结 Basis 与代码 Diff 提取可追溯风险",
    type: "项目",
    duration: "75 分钟",
    prerequisites: ["TD-T04"],
    summary: "区分需求、设计、Oracle 与直接代码变化，让 AI 只生成带引用的风险候选；缺引用或虚构政策立即阻断。",
    why: "diff 不是完整影响面，模型也不是需求权威。若不冻结输入和审批边界，生成清单会把猜测包装成高优先级事实。",
    outcomes: ["冻结并分型需求、设计、Oracle 与 diff", "输出 requirement/diff/oracle/owner 引用闭合的候选", "用缺引用与虚构 SLA mutation 验证 fail-closed"],
    artifact: "版本化 PRD-Diff 风险候选包、引用门禁与 0→2→0 报告",
    problem: ["退款 PRD 规定已激活数字商品转人工复核，同时代码变更资格判断和审计事件。模型可以连接两者，但不知道团队未提供的 SLA、依赖和损失权重。", "测试开发要保留 source type、版本、hash 与 owner。代码行数、摘要长度或模型置信度都不是风险；无法连接 requirement、diff 和独立 Oracle 的条目停在 BLOCKED。"],
    mechanism: ["先冻结 PRD、设计约束、Oracle 注册表与 commit；diff parser 只提取 rename、状态和 hunk，不补业务含义。", "生成器输出 CANDIDATE；schema 检查形态，独立 allowlist 检查 Oracle，业务 owner 才能接受。依赖图和历史故障只能作为新证据 lane 附加。"],
    nodes: ["冻结需求与设计", "独立 Oracle 注册表", "版本化代码 Diff", "风险候选生成", "引用与冲突门禁", "业务 Owner 复核", "测试设计 Backlog"],
    decisionRows: [["引用完整且版本一致", "进入 CANDIDATE_FOR_REVIEW", "owner 未批准"], ["缺 requirement/diff/oracle/owner", "BLOCKED 并请求证据", "禁止合理补全"], ["需求与设计冲突", "保留双方版本", "SOURCE_CONFLICT"], ["依赖影响未证实", "追加静态/运行证据", "UNKNOWN"]],
    prompt: "读取冻结 basis 与当前 diff，仅输出带 requirement_ref、diff_ref、oracle_id、owner 的风险候选；不得发明 SLA、政策或 Oracle。冲突、缺失与越权输入必须返回明确 stop_state。",
    faultCode: 2,
    faultMeaning: "故障删除审计风险的 diff_ref，并注入不存在的 SLA/Oracle。结构看似合理，但独立引用门禁必须 BLOCKED。",
    baselineExpected: "报告状态 PASS，两个风险均带批准 requirement、diff、Oracle 与 owner；仍需人工复核。",
    faultExpected: "报告列出 missing_evidence 与 invalid_oracle_refs，decision=STOP_AND_REVIEW，退出 2。",
    repairExpected: "删除虚构 SLA、恢复真实 diff 引用后 PASS/0；不声称风险召回完整。",
    practice: ["为一个小变更建立四类冻结输入与哈希", "运行 0→2→0 并解释为何 fault 必须非零", "补一条来源冲突，验证输出保留双方而非自动合并"],
    completion: ["每条候选能回到 requirement/diff/oracle/owner", "缺证据与冲突不会被模型补成事实", "能区分直接 diff 与完整影响面"],
    sources: ["S14", "S32", "S41"],
    boundary: "12 个打开来源与两次独立研究 run 支持方法边界；确定性 fixture 已通过 0→2→0。真实模型、企业仓库影响召回、从业者复核和生产发布均 NOT_RUN。",
  },
  {
    id: "TD-T06",
    title: "AI 生成测试候选，用 Mutation 证明检测力",
    type: "项目",
    duration: "80 分钟",
    prerequisites: ["TD-T05"],
    summary: "生成测试始终保持候选；先跑批准 baseline，再用独立 mutation 观察 killed、survived 与 no coverage。",
    why: "测试数量、绿色结果和行覆盖都不能证明能检测错误；同一模型写 expected 又自评会复制同一偏差。",
    outcomes: ["把候选测试绑定批准 basis 与独立 Oracle", "区分 killed、survived、no coverage 与工具错误", "用业务守卫反转形成 0→1→0 检测证据"],
    artifact: "AI 测试候选包、独立 Oracle 与 Mutation 处置报告",
    problem: ["模型常生成 happy path 与状态码断言，却遗漏已激活数字商品不得自动退款的业务阻断。即使代码覆盖为绿，断言仍可能看不见错误。", "可靠链路先冻结 Oracle，再让生成器写候选；mutation 由独立配置注入，reviewer 检查失败是否命中目标行为，而不是无关超时。"],
    mechanism: ["候选经过 schema/静态门禁后，在批准实现上跑 baseline；baseline 不通过就停止。", "独立 mutation runner 改变一个行为，结果分类为 killed、survived、no coverage 或 UNKNOWN；只有处置完成的候选才可进入回归。"],
    nodes: ["批准 Basis", "独立行为 Oracle", "AI 测试候选", "Schema 与静态门禁", "Baseline Runner", "Mutation Runner", "Reviewer 处置", "回归套件"],
    decisionRows: [["baseline 失败", "修候选或 fixture", "禁止继续 mutation"], ["目标 mutation 被相关断言杀死", "记录 detection evidence", "仍需检查无关失败"], ["survived/no coverage", "分析覆盖、断言、可达性", "不得改 Oracle 求绿"], ["等价性或工具错误未定", "独立复核", "UNKNOWN"]],
    prompt: "依据已批准风险与外部 Oracle 生成可执行测试候选，逐条引用 basis；不得复制实现当前输出为 expected，不得批准 Oracle 或 mutation 处置。",
    faultCode: 1,
    faultMeaning: "故障反转 activated digital refund 守卫。同一组独立期望必须至少打红一个用例并把 mutation 标为 KILLED。",
    baselineExpected: "报告中每个 case 的 expected 来自 fixtures/oracles.json，批准实现全部 PASS/0。",
    faultExpected: "目标用例 actual 与 independent expected 不同，mutation_outcome=KILLED，退出 1。",
    repairExpected: "恢复批准实现而非修改 expected 后 PASS/0；真实仓库 mutation score 仍未知。",
    practice: ["检查候选 expected 是否独立于实现", "运行 0→1→0 并定位 killed 的具体 Oracle", "为一个 survived 情况写出 no coverage/弱断言/等价三种处置"],
    completion: ["不把生成代码或覆盖率等同检测力", "fault 非零且失败命中目标 Oracle", "不会通过更新 expected 迎合错误实现"],
    sources: ["S01", "S21", "S23", "S41"],
    boundary: "12 个打开来源与双 run 支持 mutation 方法；fixture 杀死一个守卫反转并通过 0→1→0。真实模型生成、等价 mutant、CI 成本、从业者复核和生产效果均 NOT_RUN。",
  },
  {
    id: "TD-T07",
    title: "按失败模型选择 Boundary、Combination、Property 与 Fuzz",
    type: "项目",
    duration: "85 分钟",
    prerequisites: ["TD-T06"],
    summary: "先识别阈值、离散交互、不变量或未知输入面，再选择数据方法并保存约束、seed、最小反例和回放环境。",
    why: "无约束随机生成既可能产生大量无效样例，也可能无授权触碰副作用；固定 seed 也不能冻结时间、依赖和并发。",
    outcomes: ["从 failure model 选择最小充分数据方法", "为生成定义合法域、约束、Oracle、预算与权限", "保存并收缩可重放的幂等性反例"],
    artifact: "数据方法决策矩阵、版本化生成合同与最小反例回归",
    problem: ["金额阈值、订单状态、币种与幂等键属于不同结构。用同一个随机提示生成千条数据，没有覆盖口径，也可能全部无效。", "AI 可建议边界、因子和属性，但 invariant 与合法域必须来自批准 basis。fuzz 只有在隔离沙箱、明确授权和副作用门禁下才可运行。"],
    mechanism: ["failure-model registry 将问题分为阈值、离散交互、全称不变量和未知语法面；selector 再路由方法。", "运行保存原始失败、seed、工具/系统版本和环境；shrinker 产生最小反例后必须重新验证同一 invariant，再转固定回归。"],
    nodes: ["批准 Failure Model", "合法域与约束", "方法选择器", "确定性生成", "独立 Invariant", "原始失败存储", "Shrink 与 Replay", "固定回归"],
    decisionRows: [["有序阈值/off-by-one", "Boundary value", "合法域未知"], ["有限离散规则交互", "Constrained combination", "约束冲突"], ["跨合法输入成立的不变量", "Property + shrink", "Oracle 不独立"], ["未知语法/字节攻击面", "授权沙箱 Fuzz", "权限或预算缺失"]],
    prompt: "根据 failure model 推荐 boundary、combination、property 或 fuzz，并输出 domain、constraints、Oracle、seed/budget 与 replay 计划；不得自行定义业务合法域或建议无授权生产 fuzz。",
    faultCode: 1,
    faultMeaning: "故障破坏退款幂等保护；固定 seed 生成合法重复请求，属性 refund_count<=1 必须失败并收缩反例。",
    baselineExpected: "报告选择 boundary/decision/property，明确拒绝无约束 fuzz，属性在批准实现上 PASS/0。",
    faultExpected: "报告保存 seed、fixture 版本、失败数和最小 counterexample，退出 1。",
    repairExpected: "相同 seed、域与 invariant 下恢复幂等逻辑并 PASS/0；不声称代表生产流量。",
    practice: ["为四类 failure model 各写一条方法选择理由", "运行 0→1→0 并用最小反例复述缺陷", "列出 seed 之外必须冻结的时间、依赖和环境"],
    completion: ["方法由失败模型而非工具热度选择", "生成合同包含域、约束、Oracle、预算和权限", "失败输入可收缩、重放并转为固定回归"],
    sources: ["S01", "S23", "S32", "S41"],
    boundary: "12 个打开来源与双 run 支持方法矩阵；fixture 重放并收缩幂等故障。真实 property/fuzz 工具、服务授权、生产数据代表性、模型和从业者复核均 NOT_RUN。",
  },
  {
    id: "TD-T08",
    title: "AI 聚类失败，但原始证据和 UNKNOWN 不能丢",
    type: "诊断",
    duration: "80 分钟",
    prerequisites: ["TD-T07"],
    summary: "用 trace、版本与原始工件建立只追加证据层，让 AI 只提出候选簇和假设；没有控制实验就不升级为根因。",
    why: "相似异常文本不等于相同原因。聚类若覆盖原始日志或混合 commit/environment，会把降噪工具变成错误 RCA 生成器。",
    outcomes: ["建立原始事件与派生 cluster 的双向引用", "区分 observation、cluster、hypothesis、experiment、verified cause", "在 trace 缺失和版本混合时稳定保留 UNKNOWN"],
    artifact: "证据链接式失败聚类、假设实验账本与 UNKNOWN 门禁报告",
    problem: ["UI timeout、API 502 与数据库等待可能共享上游原因，也可能只是相似症状。模型擅长摘要，却无法仅凭文本确定因果。", "采集先于摘要：run/test/trace、commit、环境、依赖、日志和工件哈希必须先进入只追加存储；异常值也不能删除。"],
    mechanism: ["normalizer 建立只读标准字段并保留 raw refs；cluster engine 保存成员、算法/Prompt 版本、冲突和未归组事件。", "假设通过控制变量、修复/回滚重放才可升级；trace 缺失、采样洞或版本混合时 cause gate 锁定 UNKNOWN。"],
    nodes: ["只追加原始事件", "Trace 与版本关联", "标准化只读视图", "候选 Failure Cluster", "诊断 Hypothesis", "控制变量实验", "Cause Gate", "修复与回放"],
    decisionRows: [["raw refs/trace/版本闭合", "形成候选 cluster", "仍不是根因"], ["缺 trace 或工件", "请求重新采集", "UNKNOWN"], ["commit/environment 混合", "先分层再比较", "VERSION_MIXED"], ["实验稳定翻转症状", "owner 复核 cause", "未经复核不发布"]],
    prompt: "基于不可变 raw_event_refs 生成候选 cluster、symptom、hypothesis、confounders 与 next_experiment；禁止删除异常值，禁止把相似性、置信度或单次结果写成 verified cause。",
    faultCode: 2,
    faultMeaning: "故障清空 trace_id 并混合 commit。即使症状相同，证据链也不闭合，必须 UNKNOWN 而非自动根因。",
    baselineExpected: "报告保留 raw refs、单一 commit/environment 与下一实验，合成证据状态 PASS/0。",
    faultExpected: "cause_status=UNKNOWN、next_experiment=NOT_RUN、raw_evidence_preserved=false，退出 2。",
    repairExpected: "恢复 trace 与版本一致性后 PASS/0；真实系统仍需控制实验和 incident owner 审批。",
    practice: ["为三条失败事件补 run/trace/commit/environment/raw refs", "运行 0→2→0 并解释为何相似症状不能越过 UNKNOWN", "设计一个只改变连接池参数的控制实验与回滚验证"],
    completion: ["派生 cluster 不覆盖原始事件", "缺 trace 或混合版本时保持 UNKNOWN", "只有独立实验与 owner 能升级 verified cause"],
    sources: ["S14", "S22", "S49", "S41"],
    boundary: "12 个打开来源与双 run 支持证据保全和因果门禁；fixture 在缺 trace/混合版本时返回 UNKNOWN/2。真实遥测、AI 聚类准确率、生产 RCA、从业者和发布验证均 NOT_RUN。",
  },
];

export const aiAssistedTestingPages = specs.map(makePage);
