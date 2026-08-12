import type { TutorialPage } from "../course.ts";

type FoundationSpec = {
  id: string;
  title: string;
  type: TutorialPage["type"];
  duration: string;
  prerequisites: string[];
  summary: string;
  why: string;
  outcomes: string[];
  artifact: string;
  failureTitle: string;
  failureBody: string[];
  mechanismTitle: string;
  mechanismBody: string[];
  mechanismBullets: string[];
  decisionTitle: string;
  decisionBody: string[];
  decisionBullets: string[];
  metricTitle: string;
  metricBody: string[];
  metricBullets: string[];
  faultExpected: string;
  practice: string[];
  completion: string[];
  sources: string[];
  boundary: string;
  architecture: string[];
};

const WORKING_DIRECTORY = "materials/ai-foundations-eval";

const makePage = (spec: FoundationSpec): TutorialPage => {
  const manifestPath = `${WORKING_DIRECTORY}/manifests/${spec.id}.json`;
  const reportRoot = `${WORKING_DIRECTORY}/reports/${spec.id}`;
  return {
    id: spec.id,
    moduleId: spec.id.startsWith("TD-F") || /^TD-T0[1-4]$/.test(spec.id) ? "TD-M01" : "TD-M03",
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
        title: spec.failureTitle,
        body: spec.failureBody,
        warning: `${spec.title} 的诊断从症状、版本和原始证据开始；在定位层级前改 Prompt 会破坏可比较基线。`,
      },
      {
        title: spec.mechanismTitle,
        body: spec.mechanismBody,
        bullets: spec.mechanismBullets,
        technical: {
          kind: "diagram",
          content: spec.architecture.join(" → "),
          verification: "逐节点检查输入、版本、观察点、失败路径和决策 owner；图示不是可执行命令。",
        },
      },
      {
        title: spec.decisionTitle,
        body: spec.decisionBody,
        bullets: spec.decisionBullets,
        technical: {
          kind: "config",
          content: `topic_id: ${spec.id}\ncontract: configs/topic-contracts.json\nmodel_execution: NOT_RUN\nevidence: offline-deterministic-fixture`,
          sourcePath: `${WORKING_DIRECTORY}/configs/topic-contracts.json`,
          format: "JSON",
          consumer: "scripts/run_lab.py",
        },
      },
      {
        title: `${spec.title} 的 Prompt 只生成候选，Oracle 独立判定`,
        body: [
          `固定输入先经过版本化 Prompt 与 Schema；Eval 再按 ${spec.decisionTitle} 的规则读取 observed、expected、source_ref、status 和 unknowns。`,
          `Mutation 只改变 ${spec.faultExpected} 对应的一个合同字段。provider=none、model=NOT_RUN，因此 Prompt 包可审计但没有模型运行结论。`,
        ],
        technical: {
          kind: "prompt",
          content: `读取 ${spec.id} 的固定 Fixture；逐字段输出 observed、expected、source_ref、status 与 unknowns。遇到缺失、冲突或 blocker 必须 fail-closed，不得批准发布。`,
          version: "1.0.0",
          promptPath: `${WORKING_DIRECTORY}/prompt-package/contract-classifier.prompt.md`,
          manifestPath: `${WORKING_DIRECTORY}/prompt-package/manifest.json`,
          inputFixturePath: `${WORKING_DIRECTORY}/fixtures/cases.json`,
          outputSchemaPath: `${WORKING_DIRECTORY}/prompt-package/output.schema.json`,
          evaluationPath: `${WORKING_DIRECTORY}/prompt-package/eval.json`,
        },
        expected: `${spec.id} Prompt/Input/Schema/Eval/Mutation 版本可静态追踪；实际模型输出保持 NOT_RUN。`,
      },
      {
        title: spec.metricTitle,
        body: spec.metricBody,
        bullets: spec.metricBullets,
        expected: "指标必须带分母、切片、版本、聚合、阈值依据和失败动作；本地三项检查只验证 mutation detection，不估计生产质量。",
      },
      {
        title: `${spec.title}：解释 baseline → fault → repair`,
        body: [
          `在 ${WORKING_DIRECTORY} 运行三个 Manifest 步骤；它们共用 expected contract，fault 只修改 ${spec.id} 声明的 observation。`,
          `0 表示合成基线满足合同，1 表示 ${spec.faultExpected} 被独立 Oracle 捕获，最后的 0 表示 observation 恢复而 expected 未改。若中段不红，依次检查 manifest、topic ID、mutation 字段和退出码传播。`,
        ],
        technical: {
          kind: "command",
          content: `python3 scripts/run_lab.py --topic ${spec.id} --phase baseline`,
          manifestPath,
          stepId: "baseline",
          workingDirectory: WORKING_DIRECTORY,
          expectedExitCode: 0,
          expectedArtifacts: [`reports/${spec.id}/baseline.json`],
        },
        expected: `生成 ${reportRoot}/baseline.json，verdict=PASS、model_execution=NOT_RUN；随后 fault/repair 形成 0→1→0 的 Fixture 证据链。`,
      },
    ],
    practice: spec.practice,
    completion: spec.completion,
    sourceIds: spec.sources,
    evidenceBoundary: spec.boundary,
    architecture: {
      title: `${spec.title} 的证据与决策边界`,
      caption: "这张图把合成输入、版本化合同、候选行为、独立 Oracle、红绿报告与人工 Gate 分开；模型、企业集成和生产状态没有被本地 Fixture 代替。",
      nodes: spec.architecture,
    },
    materials: [
      { title: `${spec.id} 实验 Manifest`, description: "精确固定工作目录、命令、预期退出码和报告路径。", href: manifestPath, kind: "config", validation: "fixture-tested" },
      { title: "离线合同检查器", description: "标准库脚本；读取 topic contract，注入故障并保存逐字段证据。", href: `${WORKING_DIRECTORY}/scripts/run_lab.py`, kind: "script", validation: "fixture-tested" },
      { title: `${spec.id} 红灯报告`, description: "保存故障字段、expected/actual、退出结论与剩余未知。", href: `${reportRoot}/fault.json`, kind: "evidence", validation: "fixture-tested" },
      { title: "Prompt/Eval/Mutation 包", description: "绑定 Prompt、Schema、eval、mutation 和 provider=none 的版本 Manifest。", href: `${WORKING_DIRECTORY}/prompt-package/manifest.json`, kind: "config", validation: "static-reviewed" },
      { title: "下载完整 AI 基础与 Eval 实验包", description: "十一页共用的公开 Fixture、全部 Manifest、报告和运行收据。", href: "materials/ai-foundations-eval.zip", kind: "archive", validation: "fixture-tested" },
    ],
  };
};

const specs: FoundationSpec[] = [
  {
    id: "TD-F02", title: "模型生命周期：一次错误究竟来自哪里", type: "概念", duration: "45 分钟", prerequisites: ["TD-F01"],
    summary: "从数据、预训练、后训练、评测、部署、推理到监控，建立测试开发能够使用的责任图和版本 Manifest。",
    why: "回答错误不等于基础模型错误。模型快照、Prompt、上下文、工具、索引或部署任一变化都可能产生同一症状；归因错误会让修复既昂贵又不可验证。",
    outcomes: ["区分训练期能力与本次推理配置", "为模型、Prompt、数据、工具和环境固定版本", "根据 Trace 把失败定位到可行动的生命周期层"],
    artifact: "模型生命周期—测试责任图与版本 Manifest",
    failureTitle: "同一个退款问题昨天对、今天错，先别怪模型",
    failureBody: ["团队调用的是浮动模型别名，Prompt 仓库也覆盖了旧版本；报告只保存最终回答。没有 model snapshot、Prompt hash 和完整上下文，任何根因判断都只是猜测。", "测试开发的第一步是冻结可见依赖并承认不可见依赖。基础模型训练数据与后训练细节没有公开时，应标 `UNKNOWN`，而不是用故事补齐。"],
    mechanismTitle: "把七阶段映射成七种证据", mechanismBody: ["数据和训练阶段决定能力边界，部署与推理阶段决定这次调用的条件，监控阶段把新失败送回回归集。应用团队通常不能重训基础模型，但可以控制输入、版本、适配器和 Gate。"],
    mechanismBullets: ["数据：来源、许可、偏差、污染与删除", "训练/后训练：能力与拒答边界，只记录可公开快照", "部署：端点、量化、区域、限流和 fallback", "推理：Prompt、Context、采样、工具和解析器", "监控：Trace、质量切片、延迟、成本与新失败"],
    decisionTitle: "Manifest 是回归的共同分母", decisionBody: ["每份报告引用 model、prompt、dataset、knowledge、tool schema、scorer、runtime 和时间。不可固定的动态别名必须单列限制，并通过录制回放或重复运行降低误判。"],
    decisionBullets: ["版本变化先做 manifest diff", "一轮实验只改变一个主变量", "未保存原始上下文时不做确定归因", "高风险发布结论由具名 owner 批准"],
    metricTitle: "用可重放率评价证据，不评价模型智商", metricBody: ["本页检查 Manifest 完整率和可重放率：报告中的每个结论能否定位到当时的模型、Prompt、数据、工具和环境。分母是本轮要求的依赖字段，缺失字段不能记作通过。"],
    metricBullets: ["字段来源：运行 Manifest", "聚合：逐运行，不跨版本平均", "阈值：高风险依赖缺一即阻断", "失败动作：保持 NOT_RUN/UNKNOWN 并补证据"],
    faultExpected: "`model_version_pinned=false` 导致 FAIL，证明浮动别名不能支撑可重复回归",
    practice: ["为熟悉的 AI 功能画七阶段责任图", "给一次历史失败补齐可见版本字段并标出仍未知项", "设计只更换 Prompt、不更换模型和数据的单变量比较"],
    completion: ["能区分训练阶段与本次推理条件", "Manifest 覆盖模型、Prompt、数据、工具和 Scorer", "无法固定的依赖被明确写入限制"],
    sources: ["S33", "S24", "S65", "S66"], boundary: "页面与 Fixture 只证明生命周期字段和版本 Gate 可检查；没有访问基础模型训练过程、真实 Provider、企业监控或从业者发布评审。",
    architecture: ["来源与训练边界", "模型快照", "Prompt·Context", "应用编排", "工具·检索", "Trace 报告", "人工发布 Gate"],
  },
  {
    id: "TD-F03", title: "Token、Context 与非确定性：为什么一次 PASS 不够", type: "概念", duration: "50 分钟", prerequisites: ["TD-F02"],
    summary: "把 Token 预算、上下文位置、解码配置与运行波动转成边界用例、单变量实验和重复运行报告。",
    why: "字符数不等于 Token 数，完整输入不等于模型同等利用，温度为零也不保证跨后端完全确定；一次成功无法支撑稳定性结论。",
    outcomes: ["解释 Token、Context 与逐 Token 生成的测试含义", "区分确定性 Gate 与概率性重复运行", "设计只改变一个 Context 或解码变量的实验"], artifact: "推理变量—测试设计矩阵与重复运行计划",
    failureTitle: "温度为零跑一次就上线，问题出在证据而非运气", failureBody: ["某个长对话只验证一次，回复恰好正确。生产批处理改变后，同一输入偶发截断关键政策。报告既没有 Token 预算，也没有最终送入模型的 Context，更没有重复运行分布。", "测试不能承诺消除概率性，但可以固定变量、保留 raw output、按风险切片重复并报告波动。"],
    mechanismTitle: "逐 Token 生成把哪些变量带进测试", mechanismBody: ["Tokenizer 将输入映射为 Token；模型依据当前 Context 产生下一 Token 的分数，解码策略再选择结果。位置、噪声、冲突材料、截断和服务端实现都会改变条件。"], mechanismBullets: ["边界：短/长输入、中文/英文、JSON 与特殊符号", "位置：关键规则位于开头、中间与结尾", "干扰：无关文档、冲突指令和过期证据", "采样：temperature、top_p、seed 与重试", "输出：截断、拒答、Schema、延迟与 Token 成本"],
    decisionTitle: "先确定性，再统计性", decisionBody: ["Schema、工具参数、权限、引用集合和禁止副作用优先用稳定断言；语义正确性、帮助程度与表达差异采用切片、重复和校准 Oracle。每次实验只改变一个主要变量。"], decisionBullets: ["保存最终 Context 而非只保存用户问题", "相同 case 记录每次 raw output", "blocker 与平均语义分开", "报告运行次数，不宣称一次 PASS 稳定"],
    metricTitle: "运行次数不是魔法数字", metricBody: ["每 case 五次只用于本课演示分布意识。真实次数来自估计目标、失败稀有度、允许区间宽度和成本；必须报告分母、逐次结果与未覆盖尾部。"], metricBullets: ["单位：case-run", "切片：长度、语言、位置、风险", "聚合：逐切片通过分布", "失败动作：扩大样本或阻断，不挑最好一次"], faultExpected: "`repeat_count=1` 触发 FAIL，阻止把单次成功写成稳定证据",
    practice: ["比较同一政策放在 Context 开头和结尾的五次结果", "为长输入定义截断、Schema 和拒答检查", "将一个语义指标与一个权限 blocker 分开报告"], completion: ["能说明字符数与 Token 预算不同", "实验只改变一个主变量", "报告包含运行次数、逐次结果和切片"],
    sources: ["S33", "S40", "S65", "S66"], boundary: "离线 Fixture 没有执行 Tokenizer 或模型推理；它只证明重复运行字段不能被省略。具体确定性、Context 行为和解码差异必须针对当前 Provider 实测。", architecture: ["原始输入", "Tokenizer", "有限 Context", "模型 Logits", "解码策略", "多次 Raw outputs", "分布与人工 Gate"],
  },
  {
    id: "TD-F04", title: "从 LLM 到 RAG、Agent 与 Workflow：被测边界如何扩张", type: "概念", duration: "50 分钟", prerequisites: ["TD-F03"],
    summary: "按控制权、状态与副作用区分 LLM、RAG、Agent、Worker 和固定 Workflow，并为新增层补齐 Trace 和 Gate。",
    why: "把所有 AI 应用都叫 Agent 会漏掉检索、队列、状态机、Handoff 和补偿；只看最终回答还会错过危险工具副作用。",
    outcomes: ["按谁决定下一步区分 Agent 与 Workflow", "为检索、工具、状态和 Handoff 定义证据", "在不可逆动作前设置权限与人工 Gate"], artifact: "AI 应用结构、信任边界与证据分层图",
    failureTitle: "回复说“没有退款”，工具 Trace 却显示调用已经发出", failureBody: ["最终文本并不是系统终态。RAG 可能检索错，Agent 可能选错工具，Worker 可能重复投递，Workflow 可能补偿失败。必须同时观察输出、步骤、轨迹和业务状态。", "分类依据是控制权和状态：代码预先决定路径的是 Workflow；模型动态选择步骤和工具的是 Agent；边界任务执行单元可称 Worker。"],
    mechanismTitle: "每新增一层，就新增一组失败与证据", mechanismBody: ["LLM 保存输入、Prompt、模型和输出；RAG 增加 query、文档、排序和 Context；Agent 增加 tool call、参数、权限和终止；Workflow 增加节点、分支、重试、补偿和终态。"], mechanismBullets: ["LLM：结构、事实、拒答与成本", "RAG：召回、排序、污染、引用与忠实性", "Agent：工具、权限、循环、终止与副作用", "Worker：契约、超时、重试、幂等与 Handoff", "Workflow：状态转换、并发、补偿与业务不变量"],
    decisionTitle: "用独立 Verifier 检查业务终态", decisionBody: ["模型可以提出动作，不能自行批准不可逆动作。工具边界执行权限，业务状态由独立 Verifier 读取；失败时保留轨迹并进入补偿或人工升级。"], decisionBullets: ["输出正确不抵消危险步骤", "允许多条安全路径但禁止特定副作用", "终止条件与最大步数显式化", "Handoff 传递必要状态与责任"],
    metricTitle: "Trace 覆盖率先于总分", metricBody: ["检查关键节点是否有输入、输出、版本、拒绝原因和 owner。高风险动作的人工 Gate 前置率必须逐动作计算，不能由最终任务成功率抵消。"], metricBullets: ["分母：所有高风险动作尝试", "分子：执行前通过批准或策略拒绝", "维度：工具、身份、状态、重试", "失败动作：隔离副作用并升级"], faultExpected: "`human_gate_before_side_effect=false` 触发 FAIL，即使最终文本可接受也不能放行",
    practice: ["把一个客服功能分别画成 LLM、RAG、Agent 和 Workflow", "给每层补三项 Trace 字段", "为退款动作设计权限、人工确认与幂等补偿"], completion: ["不再按营销名称识别 Agent", "图中包含状态、工具、Handoff 与终态", "不可逆动作有独立 Gate"],
    sources: ["S34", "S35", "S39", "S65"], boundary: "结构模型来自公开论文与工程综合；本页 Fixture 没有连接真实工具、队列或业务数据库，不能证明任何框架的副作用防护已生效。", architecture: ["用户目标", "检索·Context", "模型决策", "工具策略 Gate", "Worker·队列", "业务状态 Verifier", "人工升级·补偿"],
  },
  {
    id: "TD-T01", title: "Eval Contract：先写发布问题，再选指标", type: "参考", duration: "55 分钟", prerequisites: ["TD-F04"],
    summary: "把被测对象、业务风险、数据分布、Oracle、阈值、版本、owner 和 stop state 写成可审计的评测合同。",
    why: "先挑指标再找问题会产生漂亮但不可行动的分数；Eval 的价值是让一个具体发布决定获得边界清楚的证据。",
    outcomes: ["定义 Eval 的唯一决策问题", "写出风险切片、Oracle 和 blocker", "让 owner、版本与 stop state 进入合同"], artifact: "版本化 Eval Contract 与发布决策表",
    failureTitle: "平均 0.92 分，仍然不能回答能否发布", failureBody: ["如果报告没写测哪个模型/Prompt/索引、覆盖什么流量、谁承担退款错误、0.92 的分母和阈值依据是什么，数字无法支持决定。", "合同应先声明 decision 和 failure cost，再选择能观察该风险的数据与 Oracle。缺 owner、来源或权限时进入 UNKNOWN/BLOCKED。"],
    mechanismTitle: "Eval Contract 的八个不可缺字段", mechanismBody: ["合同连接系统版本、场景、数据、Oracle、指标、门禁、负责人和证据。每个字段都有下游消费者，任何关键缺失都停止晋级。"], mechanismBullets: ["system_under_test 与 manifest", "decision、risk、failure_cost", "dataset、slice、holdout", "oracle、grader、human review", "metric、aggregation、threshold rationale", "stop state、waiver、rollback、owner"],
    decisionTitle: "Prompt 只是合同中的候选生成器", decisionBody: ["版本化 Prompt 必须绑定固定输入、输出 Schema、eval、mutation 和 model manifest；它可以提取候选合同字段，却不能发明政策、批准阈值或把 BLOCKED 改成 PASS。"], decisionBullets: ["输出结构与业务真相分开", "模型自评不是独立 Oracle", "拒答、缺失、冲突保留状态", "发布批准必须来自具名 owner"],
    metricTitle: "合同完整率不能替代质量结论", metricBody: ["本页的本地检查只验证 risk owner、stop state 和 threshold rationale 三个字段存在。真实评测还需证明字段内容正确、数据代表场景且 Oracle 已校准。"], metricBullets: ["完整率分母：合同必填字段", "blocker：owner/stop state 缺失", "聚合：逐合同版本", "失败动作：BLOCKED，不自动补默认值"], faultExpected: "移除 `risk_owner_present` 后 exit 1，防止无责任人的阈值进入发布 Gate",
    practice: ["把一个现有 AI 质量报表反写成 Eval Contract", "为高风险行为增加独立 blocker 与 owner", "用 Prompt package 的 Schema 检查缺失和冲突状态"], completion: ["合同能回答测谁、为什么、谁决定", "指标有分母、聚合和阈值依据", "缺失、冲突和 NOT_RUN 不被归一成 PASS"],
    sources: ["S05", "S23", "S24", "S65"], boundary: "Prompt package 已版本化但 provider=none、model=NOT_RUN；Fixture 只杀死合同字段 mutation，不证明模型能可靠生成合同，也不批准真实业务阈值。", architecture: ["发布问题", "风险与 owner", "数据与切片", "Composite Oracle", "指标与阈值", "报告与 stop state", "人工发布决定"],
  },
  {
    id: "TD-T02", title: "Dataset、Slice 与 Holdout：让评测不会越调越假", type: "概念", duration: "55 分钟", prerequisites: ["TD-T01"],
    summary: "从失败成本设计样例与风险切片，管理来源、标签、去重、时间边界和封存 Holdout。",
    why: "开发者反复查看同一最终集并针对失败调 Prompt，会把回归集磨成训练材料；总分上升不再代表对新问题有效。",
    outcomes: ["从业务风险构造 Eval case 和 slice", "分开 development、validation 与 sealed holdout", "检测重复、污染和标签分歧"], artifact: "Eval dataset、数据卡、切片矩阵与 Holdout 清单",
    failureTitle: "黄金集越跑越高，真实新问题却越来越差", failureBody: ["一批 40 条退款问题被团队反复查看、修改参考答案并针对性调 Prompt；它已变成开发集，却仍被当最终回归集。", "数据治理要保存 source、owner、label rationale、slice、created_at、last_reviewed 和访问记录。Holdout 不是永远有效，重复使用也会耗损。"],
    mechanismTitle: "样例不是一行 Prompt，而是一份风险记录", mechanismBody: ["每条 case 包含输入、场景、风险 slice、允许/禁止行为、证据引用、Oracle、严重度、owner 与争议。按业务分布和失败代价设计切片，而不是平均抽取容易问题。"], mechanismBullets: ["正常已知与边界条件", "无答案和证据不足", "高风险政策与安全", "多语言、长上下文和噪声", "权限、注入与工具副作用", "新鲜失败与时间漂移"],
    decisionTitle: "开发集可见，Holdout 受控", decisionBody: ["开发集用于快速迭代；验证集用于阶段比较；sealed holdout 只在候选冻结后由受控流程运行。重复或近重复样例跨集合出现时先修分割。"], decisionBullets: ["先按用户/文档/时间分组再拆分", "记录 Holdout 访问与修改", "标签冲突进入人工 adjudication", "生产新失败先脱敏再入回归"],
    metricTitle: "总样例数不是覆盖率", metricBody: ["切片覆盖率按风险切片计算，重复率按语义/来源近重复计算，标签分歧率按独立标注比较。没有生产分布时，不能把合成比例解释为真实发生率。"], metricBullets: ["分母：声明的风险切片", "维度：用户、时间、语言、权限", "blocker：Holdout 泄漏或高风险空切片", "失败动作：重建 split 并作废旧比较"], faultExpected: "`holdout_sealed=false` 触发 FAIL，阻止用被反复查看的集合做最终证明",
    practice: ["把 12 条样例分成至少 5 个风险切片", "用 source/group/time 规则去重后再划分", "让第二位标注者独立判断高风险 case"], completion: ["每条 case 有来源、slice、Oracle 和 owner", "development 与 holdout 权限分离", "重复和分歧有机器记录"],
    sources: ["S23", "S24", "S37", "S65"], boundary: "数据拆分原则来自公开资料；课程数据完全合成，未证明与任何生产流量同分布，也没有测量真实领域标注一致性。", architecture: ["失败与风险池", "采样/去重", "Development set", "Validation set", "Sealed Holdout", "切片报告", "Owner adjudication"],
  },
  {
    id: "TD-T03", title: "Composite Oracle：规则、语义 Judge 与人工如何组合", type: "概念", duration: "60 分钟", prerequisites: ["TD-T02"],
    summary: "用确定性 Gate、业务规则、语义评分与人工复核组成分层 Oracle，让高风险失败不能被平均分抵消。",
    why: "自然语言允许多种正确表达，但工具权限、引用来源和禁止副作用不能靠“看起来不错”判断；未校准 Judge 也会产生偏差。",
    outcomes: ["为不同风险选择主 Oracle", "将 blocker 与连续分数分开", "设计 Judge 校准和人工升级"], artifact: "风险—Oracle 决策表与分歧升级记录",
    failureTitle: "语义 9 分也不能覆盖一次越权工具调用", failureBody: ["模型回答礼貌且政策解释大体正确，但在身份未验证时调用 refund_order。若把权限检查和语义分数加权求平均，严重失败会被高分冲掉。", "Composite Oracle 的顺序是：确定性 blocker 先执行；语义评价补充连续质量；新颖、高风险或分歧样例进入人工。"],
    mechanismTitle: "四层 Oracle 各自负责什么", mechanismBody: ["独立 Oracle 必须来自业务不变量、Schema、权限策略、证据或人工标签，不能由被测生成器自己定义。Judge 是依赖，也需要版本、rubric、盲评和反例。"], mechanismBullets: ["Schema/类型：结构和必填字段", "规则/状态机：禁止声明与业务不变量", "语义 Judge：正确、相关、忠实与表达", "人工复核：政策、安全、分歧与风险接受"],
    decisionTitle: "先写失败动作，再写阈值", decisionBody: ["每个 Oracle 记录失败后是阻断、抽检、转人工还是仅观察。高风险权限和副作用失败直接阻断；低风险风格可用连续分数和趋势。"], decisionBullets: ["blocker 不参与平均抵消", "Judge 与人工双标集比较", "位置、长度和风格反例进入校准", "更换 Judge/Rubric 后重做校准"],
    metricTitle: "分歧是证据，不是噪声", metricBody: ["报告 schema/permission blocker 数、Judge 与人工分歧矩阵、人人分歧和升级关闭率。没有人人基线时，不能把所有人机分歧都算 Judge 错误。"], metricBullets: ["单位：case-oracle decision", "维度：风险、语言、长度、位置", "阈值：由 owner 针对场景批准", "失败动作：保留 raw judgment 并升级"], faultExpected: "`independent_oracle=false` 触发 FAIL，防止生成器兼任权限批准者",
    practice: ["为 PII、引用错误和语气问题各选主 Oracle", "设计一个高分但必须阻断的反例", "用两名人工标注者建立 Judge 校准表"], completion: ["每项风险有主 Oracle 和失败动作", "blocker 与语义分数分开", "Judge 版本、rubric 与分歧被保存"],
    sources: ["S04", "S10", "S23", "S65"], boundary: "本页 Composite Oracle 为工程设计；Fixture 没有运行 Judge 或权限系统，也没有领域人工双标，因此只能证明独立 Oracle 字段不可缺。", architecture: ["Eval case", "Schema Gate", "业务规则 Gate", "权限·副作用 Gate", "语义 Judge", "人工校准", "发布/升级决定"],
  },
  {
    id: "TD-T04", title: "重复运行与统计：从一次结果到可解释分布", type: "参考", duration: "60 分钟", prerequisites: ["TD-T03"],
    summary: "区分固定 Benchmark 表现与更广泛任务表现，保存重复运行分布、配对差异和 blocker。",
    why: "一次输出同时受样例、模型、解码和运行环境影响；只报均值会隐藏高风险切片和不确定性，也无法说明结论适用于哪些任务。",
    outcomes: ["声明要估计的 performance target", "为概率 case 设计重复与配对比较", "报告分布、区间和 blocker 而非单点分数"], artifact: "重复运行报告与发布解释模板",
    failureTitle: "候选高 2 分，不代表它对真实任务更好", failureBody: ["固定 20 条样例上只跑一次，候选 B 平均高 2 分，但退款切片有两个 blocker。报告既没有配对差异，也没有说明分数仅适用于这 20 条题。", "先声明 estimand：是描述固定集合，还是推断相似任务总体。两者需要不同假设和不确定性表达。"],
    mechanismTitle: "波动来自 case，也来自 run", mechanismBody: ["同一 case 多次运行可以观察系统内波动；更多 case 可以观察任务分布差异。重复同一个简单 case 不能替代覆盖更多风险场景。"], mechanismBullets: ["逐 case 保存所有 raw outputs", "同一版本做配对 A/B", "切片内报告分布和分母", "罕见 blocker 单独计数", "说明缓存、重试与失败请求处理"],
    decisionTitle: "次数由决策问题决定", decisionBody: ["课程使用五次只为演示。生产次数依赖事件稀有度、可接受误差、成本和切片；没有这些输入时，把次数写成 UNKNOWN。"], decisionBullets: ["固定样例准确率不外推总体", "报告区间假设", "A/B 锁定非比较变量", "高风险 blocker 无需等待均值显著"],
    metricTitle: "分布报告必须能回到原始运行", metricBody: ["保存 run_id、case_id、版本、seed/参数、raw output hash、grader 与判定。任何 p 值、区间或通过率都能追踪到分母和原始观察。"], metricBullets: ["单位：case-run", "聚合：case→slice→overall", "维度：风险、长度、语言、版本", "失败动作：混杂则 INVALID_COMPARISON"], faultExpected: "`blocker_separate=false` 触发 FAIL，阻止平均分吞掉高风险事件",
    practice: ["对五条 case 各运行五次并保存逐次结果", "用配对方式比较只更换 Prompt 的 A/B", "分别写固定集合结论与总体外推限制"], completion: ["报告声明估计目标和分母", "每个汇总可回链到 raw run", "blocker 不被连续分数抵消"],
    sources: ["S37", "S40", "S24", "S65"], boundary: "课程没有运行随机模型；五次是教学设计而非样本量建议。任何总体结论、显著性或生产阈值都需要真实数据与统计假设。", architecture: ["版本化 cases", "重复采样", "Raw run ledger", "独立 Scorer", "Slice aggregation", "不确定性说明", "Owner decision"],
  },
  {
    id: "TD-T09", title: "RAG 语料治理：来源、版本、分块与权限", type: "诊断", duration: "60 分钟", prerequisites: ["TD-T04"],
    summary: "在索引前检查文档权威、版本、生效期、chunk lineage、ACL 和删除传播，让检索证据可追溯。",
    why: "检索器可能准确召回一份已经过期或无权访问的文档；如果 corpus 本身不可信，调 Prompt 或 reranker 都无法修复答案。",
    outcomes: ["设计带 lineage 与 ACL 的 chunk schema", "阻止过期和冲突来源进入当前索引", "记录索引版本与删除传播"], artifact: "RAG corpus manifest、chunk schema 与准入报告",
    failureTitle: "最相似的文档，恰好是已经失效的旧政策", failureBody: ["退款政策 v2 和 v3 同时存在，旧文档措辞更接近用户问题，因此排名第一。生成层忠实引用旧文档仍然给出错误业务结论。", "修复顺序应从 source authority、effective date、冲突和 ACL 开始，而不是先调整生成 Prompt。"],
    mechanismTitle: "文档到 chunk 的 lineage 不能丢", mechanismBody: ["每个 chunk 保留 source_id、document_version、effective_from/to、content_hash、section pointer、tenant/ACL、ingested_at 和 supersedes。索引 Manifest 固定分块器、embedding、过滤和文档集合。"], mechanismBullets: ["来源权威与 owner", "版本、生效期与 supersession", "chunk 边界与 parent document", "租户、角色与 ACL", "删除/撤销在索引中的传播", "冲突来源的 BLOCKED 状态"],
    decisionTitle: "准入 Gate 发生在 embedding 之前", decisionBody: ["没有 owner、版本或权限的文档不进入当前索引；冲突政策等待权威决定；过期文档可保留审计但不进入 current view。"], decisionBullets: ["source conflict 不由模型裁决", "ACL 随 chunk 进入检索过滤", "索引版本能重建文档集合", "删除需要可验证 tombstone/重建"],
    metricTitle: "语料质量需要可行动指标", metricBody: ["报告来源覆盖率、过期 chunk 数、孤儿 chunk、ACL 缺失、冲突未决和删除传播延迟。平均 chunk 长度只描述实现，不代表业务正确。"], metricBullets: ["分母：声明进入 current index 的文档/chunk", "维度：来源、版本、租户、时间", "blocker：过期/冲突/ACL 缺失", "失败动作：隔离并重建索引"], faultExpected: "`effective_date_checked=false` 触发 FAIL，对应旧政策进入索引的准入缺陷",
    practice: ["为三份合成政策建立 source authority 表", "把文档分块并保留 section pointer 与 ACL", "注入过期文档并证明准入 Gate 变红"], completion: ["chunk 可回链到版本化原文", "current index 不含过期/冲突来源", "ACL 与删除规则可验证"],
    sources: ["S34", "S09", "S65", "S24"], boundary: "Fixture 只检查语料准入字段；未连接文档库、OCR、embedding、向量数据库或企业 ACL，不能证明真实索引治理已完成。", architecture: ["权威文档源", "版本/冲突 Gate", "分块与 metadata", "ACL 过滤", "版本化索引", "检索 Trace", "语料 owner"],
  },
  {
    id: "TD-T10", title: "检索评测：Recall、Ranking 与查询切片", type: "诊断", duration: "65 分钟", prerequisites: ["TD-T09"],
    summary: "用 gold document、top-k、Recall@k、Precision@k、MRR 和 miss reason 把检索故障与生成故障分开。",
    why: "模型可能凭参数记忆碰巧答对，即使检索漏掉最新政策；只看最终回答会把脆弱系统误判为可靠。",
    outcomes: ["建立 query—gold document 映射", "按查询切片评价召回与排序", "用检索 Trace 诊断过滤、改写和索引故障"], artifact: "检索 query set、gold 映射与 miss diagnosis 报告",
    failureTitle: "答案碰巧正确，检索却完全没找到正确政策", failureBody: ["当基础模型记得类似规则时，最终回答可能掩盖 retrieval miss。政策一更新，系统立即失效，因为新知识只存在于外部语料。", "必须单独检查相关文档是否进入 top-k、位次、过滤条件和 query rewrite；生成分数不能借给检索层。"],
    mechanismTitle: "先测 candidate generation，再测 ranking", mechanismBody: ["Recall@k 问相关文档是否进入候选；Precision@k 问候选中有多少相关；MRR 关注第一个相关结果位置。每个指标都需要 gold/relevance judgement 和 query slice。"], mechanismBullets: ["精确业务术语与同义表达", "短查询与长对话", "多语言、拼写和省略", "过滤/ACL/时间条件", "无答案 query", "需要多文档组合的 query"],
    decisionTitle: "Miss reason 决定修哪一层", decisionBody: ["未召回可能来自语料缺失、chunk、embedding、query rewrite、过滤或 top-k；相关文档已召回但位次低则检查 ranking；文档在 Context 中仍答错才进入生成层。"], decisionBullets: ["保存 raw query 与 rewritten query", "保存 doc IDs、scores 与 filters", "索引版本进入报告", "无 gold 或标注争议单独列出"],
    metricTitle: "指标必须按业务切片解读", metricBody: ["普通 FAQ 的高 Recall 不能替代高风险退款切片。阈值来自漏检成本、Context 预算和人工升级，不应把某个公开 Benchmark 阈值直接复制。"], metricBullets: ["Recall@k：相关文档进入 top-k 的比例", "Precision@k：top-k 中相关比例", "MRR：首个相关结果倒数排名", "失败动作：定位 miss reason 后重建/改写/重排"], faultExpected: "`relevant_doc_recalled=false` 触发 FAIL，即使最终答案可能看起来正确",
    practice: ["为 10 条 query 标注 gold document 与 slice", "计算 Recall@3、Precision@3 和 MRR", "为三条 miss 写出可证伪的层级假设"], completion: ["检索报告独立于生成报告", "每条 query 保存 top-k Trace", "失败能定位到语料、改写、过滤或排序"],
    sources: ["S34", "S09", "S24", "S37"], boundary: "页面定义检索评测语义；离线 Fixture 没有运行 embedding、向量库或 reranker，合成查询不能估计线上 Recall。", architecture: ["Query slices", "Query rewrite", "ACL/metadata filter", "Retriever", "Top-k ranking", "Gold comparison", "Miss reason/owner"],
  },
  {
    id: "TD-T11", title: "Faithfulness 与 Citation：回答真的被证据支持吗", type: "诊断", duration: "65 分钟", prerequisites: ["TD-T10"],
    summary: "把回答拆成可核查声明，建立 claim—evidence 矩阵，区分 citation 存在、citation 对齐和语义忠实。",
    why: "引用一个真实文档 ID 不代表文档支持回答；模型可以在正确引用旁捏造关键政策，仍让表面 citation 检查通过。",
    outcomes: ["拆分关键声明并映射证据 span", "区分引用可解析与语义支持", "处理来源冲突、缺证据和自动 Scorer 分歧"], artifact: "声明—证据矩阵、Citation 报告与反例集",
    failureTitle: "引用是真的，退款承诺却是文档里没有的", failureBody: ["回答引用 policy-refund-v3，但原文只说“进入人工复核”，输出却写“已自动退款”。citation_id 合法检查会绿，claim-level faithfulness 必须红。", "将回答拆成原子声明，逐条定位 supporting span、contradicting span 或 no evidence。关键声明无证据直接阻断。"],
    mechanismTitle: "三个容易混淆的质量问题", mechanismBody: ["Retrieval relevance 评价拿到的 Context 是否有用；faithfulness 评价回答是否受 Context 支持；answer correctness 还可能需要外部黄金真值。三者不能互相借分。"], mechanismBullets: ["citation resolve：ID/URL 能否解析", "citation alignment：引用是否对应声明", "faithfulness：声明是否由 Context 支持", "completeness：关键问题是否遗漏", "conflict：来源之间是否矛盾", "correctness：相对权威答案是否正确"],
    decisionTitle: "自动 Scorer 负责筛查，owner 负责后果", decisionBody: ["LLM Judge 或 NLI Scorer 可以处理规模，但需人工校准、反例和版本。政策冲突、权限和高风险声明不能由单一自动分数批准。"], decisionBullets: ["保存 scorer prompt/model/version", "保留 claim 与 evidence span", "冲突输出 SOURCE_CONFLICT", "关键 unsupported claim 独立 blocker"],
    metricTitle: "Supported-claim ratio 的分母要诚实", metricBody: ["分母是可核查声明，不是句子数；关键声明可加严重度但不能被非关键陈述稀释。citation precision 也需要人工或独立规则定义哪些引用真正支持。"], metricBullets: ["单位：atomic claim", "维度：政策、安全、解释性", "聚合：关键 blocker + 切片比例", "失败动作：拒答/转人工/修检索或生成"], faultExpected: "`claims_supported=false` 触发 FAIL，杀死“有引用但无证据”的自动退款承诺",
    practice: ["把一段回答拆成原子声明", "为每条声明标 supporting/contradicting/no-evidence", "设计一个 citation 合法但 faithfulness 失败的反例"], completion: ["引用存在与语义支持分开", "关键声明可回链到证据 span", "冲突和无证据不会被强制评分为 PASS"],
    sources: ["S09", "S34", "S10", "S65"], boundary: "Fixture 只检查 `claims_supported` 合同字段；没有运行生成模型或自动 faithfulness scorer，也没有领域人工校准，不能声明真实准确率。", architecture: ["Retrieved Context", "Generated answer", "Atomic claims", "Evidence spans", "Faithfulness scorer", "Conflict/blocker", "Human policy owner"],
  },
  {
    id: "TD-T12", title: "无答案、权限与端到端 RAG Gate", type: "项目", duration: "90 分钟", prerequisites: ["TD-T09", "TD-T10", "TD-T11"],
    summary: "把语料准入、检索、faithfulness、无答案、租户权限和人工 Handoff 组合成端到端发布 Gate。",
    why: "真实 RAG 风险常出现在组件交界：没有证据时强答、跨租户检索、Prompt injection 绕过策略，或失败后仍产生工具副作用。",
    outcomes: ["为 no-answer 定义正确拒答与升级", "验证 tenant ACL 和零副作用", "用同一 Fixture 完成 baseline/fault/repair 项目证据"], artifact: "RAG 端到端 Gate、权限攻击集与人工升级 Runbook",
    failureTitle: "没有本租户证据时，系统从别的租户拼出一个流畅答案", failureBody: ["系统把“无结果”当作检索失败并扩大搜索范围，最终取到其他租户的退款记录。答案语义合理，却同时违反证据与权限。", "正确行为是保留 no-answer、拒答或 Handoff；任何跨租户读取和写入副作用独立阻断。"],
    mechanismTitle: "端到端 Gate 不等于一个总分", mechanismBody: ["语料权威、ACL、retrieval recall、faithfulness、citation、no-answer 和工具副作用分别产出证据。只有所有 blocker 关闭，才把候选交给人工发布决定。"], mechanismBullets: ["Corpus：当前、可引用、ACL 完整", "Retrieval：正确文档或明确 no result", "Generation：忠实、引用、不过度承诺", "Security：tenant、PII、injection 与权限", "Action：无未授权副作用", "Handoff：原因、证据和责任人完整"],
    decisionTitle: "停止是一种正确结果", decisionBody: ["SOURCE_CONFLICT、SEMANTIC_UNKNOWN、权限不明和证据不足不应被归一成空成功。系统明确拒答或升级，比生成一个无法支持的答案更符合质量合同。"], decisionBullets: ["no-answer case 单独标注", "拒答也要检查帮助性与 Handoff", "工具权限在模型之外执行", "waiver 有 owner、范围、到期和补偿控制"],
    metricTitle: "项目评分先看 blocker，再看连续质量", metricBody: ["正确拒答率、ACL deny、zero side-effect 和 Handoff 完整率是独立 Gate。只有 blocker 为零后，才比较回答完整性、延迟与成本。"], metricBullets: ["blocker：跨租户、泄露、未授权写入", "切片：known/no-answer/conflict/injection", "证据：Trace、doc IDs、policy reason、state", "失败动作：隔离、转人工、回滚 manifest"], faultExpected: "`acl_denied=false` 触发 FAIL，证明无答案不能通过扩大权限来“修复”",
    practice: ["运行 TD-T09 至 TD-T12 的四组故障链", "增加一个间接 Prompt injection 合成 case", "把退款场景迁移到内部事故助手并替换证据/权限模型"], completion: ["known 与 no-answer 都有明确期望", "跨租户与副作用 blocker 被杀死", "项目报告保留 0/1/0、unknown 和人工 Gate"],
    sources: ["S07", "S08", "S09", "S65"], boundary: "项目只运行无凭证的合成 Fixture；没有真实租户身份、向量库、模型、工具副作用、人工 SLA 或安全渗透测试，不能标 live/practitioner/production。", architecture: ["Versioned corpus", "Tenant ACL", "Retriever/no-result", "Generator", "Faithfulness·Citation", "Side-effect policy", "Handoff·Human Gate"],
  },
];

export const aiQualityFoundationPages: TutorialPage[] = specs.map(makePage);
