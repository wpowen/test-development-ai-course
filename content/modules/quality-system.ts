import type { TutorialPage } from "../course.ts";
import { qualitySystemDeepBlocks } from "./quality-system-deep.ts";
import { composeDeepPage } from "./deep-layer.ts";

export type QualityBenchmarkSpec = {
  id: string;
  moduleId: "TD-M05" | "TD-M06" | "TD-M07";
  title: string;
  type: TutorialPage["type"];
  duration: string;
  prerequisites: string[];
  summary: string;
  why: string;
  outcomes: string[];
  artifact: string;
  failure: string;
  mechanism: string;
  mechanismBullets: string[];
  decision: string;
  decisionBullets: string[];
  metric: string;
  metricBullets: string[];
  faultSignal: string;
  practice: string[];
  completion: string[];
  sources: string[];
  boundary: string;
  architecture: string[];
};

const WORKING_DIRECTORY = "materials/ai-quality-benchmark";

export const buildQualityBenchmarkPage = (spec: QualityBenchmarkSpec): TutorialPage => {
  const manifestPath = `${WORKING_DIRECTORY}/manifests/${spec.id}.json`;
  const reportRoot = `${WORKING_DIRECTORY}/reports/${spec.id}`;
  return {
    id: spec.id,
    moduleId: spec.moduleId,
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
        title: `${spec.title}：先定位这一个专业失败`,
        body: [spec.failure, `对 ${spec.id} 先冻结输入、版本和原始观察，再沿架构图寻找首个断点；仍存在的 blocker 不接受平均分、阈值放宽或模型自评抵消。`],
        warning: "任何缺少当前版本、独立 Oracle、具名 owner 或可重放报告的结论都保持 UNKNOWN/BLOCKED；本页不授权发布。",
      },
      {
        title: `${spec.title}：把结论拆回可观察组件`,
        body: [spec.mechanism],
        bullets: spec.mechanismBullets,
        technical: {
          kind: "diagram",
          content: spec.architecture.join(" → "),
          verification: "逐节点核对输入、版本、观察点、失败出口和决策 owner；任一关键节点缺证据时停止晋级。",
        },
      },
      {
        title: `${spec.title}：Prompt、Input、Schema、Eval 与 Mutation 同版本`,
        body: [spec.decision, "Prompt 只能把固定 Fixture 整理成候选判定；它不能发明政策、阈值、权限或生产结论。manifest 将 provider 固定为 none、model 固定为 NOT_RUN。"],
        bullets: spec.decisionBullets,
        technical: {
          kind: "prompt",
          content: `读取 ${spec.id} 的固定 Fixture 和版本合同；逐字段输出 observed、expected、source_ref、status 与 unknowns。证据缺失、冲突或 blocker 必须 fail-closed；禁止批准发布。`,
          version: "1.0.0",
          promptPath: `${WORKING_DIRECTORY}/prompt-package/quality-benchmark-contract.prompt.md`,
          manifestPath: `${WORKING_DIRECTORY}/prompt-package/manifest.json`,
          inputFixturePath: `${WORKING_DIRECTORY}/fixtures/cases.json`,
          outputSchemaPath: `${WORKING_DIRECTORY}/prompt-package/output.schema.json`,
          evaluationPath: `${WORKING_DIRECTORY}/prompt-package/eval.json`,
        },
        expected: "Prompt 包可静态审计且 model_execution=NOT_RUN；只有固定 Schema/Eval/Mutation 合同获得证据，没有模型能力结论。",
      },
      {
        title: `${spec.title}：用分母、切片和失败动作定义 Gate`,
        body: [spec.metric, "配置文件为每页固定三个独立期望字段和一个后果明确的 mutation；Fixture 的唯一目标是证明该 mutation 会被杀死。"],
        bullets: spec.metricBullets,
        technical: {
          kind: "config",
          content: `topic_id: ${spec.id}\ncontract: configs/topic-contracts.json\nevidence_level: offline-deterministic-fixture\nmodel_execution: NOT_RUN\nrelease_authority: none`,
          sourcePath: `${WORKING_DIRECTORY}/configs/topic-contracts.json`,
          format: "JSON",
          consumer: "scripts/run_lab.py",
        },
        expected: "指标同时声明单位、分母、切片、聚合、阈值依据和失败动作；Fixture 阈值不外推为企业默认值。",
      },
      {
        title: `${spec.title}：运行并解释 0 → 1 → 0`,
        body: [
          `在 ${WORKING_DIRECTORY} 按 Manifest 运行三个阶段；${spec.id} 的 expected contract 始终不变，fault 只修改一个被声明的 observation。`,
          `首个 0 表示 Fixture 基线满足合同；1 必须显示 ${spec.faultSignal}；末尾 0 只表示 observation 恢复。它不是模型质量曲线，修复也不能改 expected、删 blocker 或吞掉退出码。`,
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
        expected: `${reportRoot}/baseline.json 为 PASS；fault 为 FAIL；repair 恢复 PASS。三份报告均保留 model_execution=NOT_RUN。`,
      },
    ],
    practice: spec.practice,
    completion: spec.completion,
    sourceIds: spec.sources,
    evidenceBoundary: spec.boundary,
    architecture: {
      title: `${spec.title} 的证据链与人工决策边界`,
      caption: "这张图分开版本化输入、运行系统、独立 Oracle、报告、Waiver/回滚和人工 Gate；离线 Fixture 不能替代模型、企业集成、从业者评审或生产运行。",
      nodes: spec.architecture,
    },
    materials: [
      { title: `${spec.id} 可执行 Manifest`, description: "固定三阶段命令、预期退出码、必需文件和报告路径。", href: manifestPath, kind: "config", validation: "fixture-tested" },
      { title: "离线质量合同检查器", description: "无凭证 Python 标准库脚本，逐字段检查并保存 mutation 证据。", href: `${WORKING_DIRECTORY}/scripts/run_lab.py`, kind: "script", validation: "fixture-tested" },
      { title: `${spec.id} Fault 报告`, description: "展示 expected/actual、故障字段、退出结论和剩余未知。", href: `${reportRoot}/fault.json`, kind: "evidence", validation: "fixture-tested" },
      { title: "Prompt/Schema/Eval/Mutation 版本包", description: "模型未运行；用于审计完整 Prompt 合同与权限边界。", href: `${WORKING_DIRECTORY}/prompt-package/manifest.json`, kind: "config", validation: "static-reviewed" },
      { title: "Bundle owner 与哈希闭包", description: "列出十二页 owner、公开文件 SHA-256 与 ZIP member 一致性。", href: `${WORKING_DIRECTORY}/ARTIFACT-CLOSURE.json`, kind: "evidence", validation: "fixture-tested" },
      { title: "下载质量系统与 Benchmark 完整实验包", description: "十二页共享但逐页可审计的 Fixture、报告、收据与闭包清单。", href: "materials/ai-quality-benchmark.zip", kind: "archive", validation: "fixture-tested" },
    ],
  };
};

const specs: QualityBenchmarkSpec[] = [
  {
    id: "TD-T20", moduleId: "TD-M05", title: "CI 分层门禁：让坏 AI 版本真的停下来", type: "项目", duration: "60 分钟", prerequisites: ["TD-T12", "TD-T14"],
    summary: "把 Schema、权限、风险切片、语义评测和完整发布评测分层接入 CI，并用非零退出码阻止危险变更。",
    why: "只上传报告却不传播退出码、只看总平均或给评测 job 配 continue-on-error，都会制造 CI 假绿。",
    outcomes: ["设计 PR smoke、nightly regression 与 release candidate 三层 Gate", "把确定性 blocker 和统计性退化分开", "证明故障注入会令 CI exit 1"], artifact: "分层 AI Quality CI Workflow 与红绿证据包",
    failure: "退款知识库改错后，API 契约仍绿、总体 Judge 分仍高，但 high-risk-refund slice 已产生错误自动退款承诺；CI 只保存报告，没有让 job 失败。",
    mechanism: "PR 层运行小而快的 Schema、权限、已知事故 blocker；nightly 扩大切片和重复运行；release candidate 锁定完整版本 Manifest、Holdout、性能与人工审批。下层失败时上层不运行。",
    mechanismBullets: ["L0 静态 Schema/安全规则，秒级", "L1 高风险 smoke 与历史事故集，PR 阻断", "L2 nightly 切片、重复运行与漂移", "L3 release candidate 全量评测和人工批准", "报告上传与 job exit code 是两个独立合同"],
    decision: "Gate 先处理 blocker，再处理分片阈值，最后才展示总体分。任何 waiver 必须有 owner、原因、补偿控制和到期时间。",
    decisionBullets: ["固定 candidate、dataset、scorer 与 Prompt hash", "失败样例和逐条结果进入 artifact", "不允许关键 job continue-on-error", "旧报告不得覆盖当前 SHA 结论"],
    metric: "主指标是 blocker count、high-risk pass rate 与 Gate latency。每项都绑定 page/run/SHA、分母和风险切片；总体平均不能抵消一个禁止行为。",
    metricBullets: ["单位：case-run 与 blocker", "聚合：先风险切片后总体", "阈值：来自合成风险合同，不是行业默认", "失败动作：exit 1、保存报告、停止 promotion"], faultSignal: "`blocking_exit_propagated=false` 导致 FAIL",
    practice: ["画出三层 CI 与依赖顺序", "查找一个会吞 exit 1 的假绿配置", "运行 0→1→0 并比较三份报告"], completion: ["三层 Gate 有不同输入和时限", "blocker 不被平均分覆盖", "fault 阶段稳定 exit 1"],
    sources: ["S03", "S05", "S23", "S24"], boundary: "本地仅运行确定性 Fixture；没有云 CI、模型 Provider、企业审批或发布系统，因此只有 PASS-FIXTURE。", architecture: ["PR/候选版本", "L0 确定性 Gate", "L1 高风险 Smoke", "L2 Nightly 回归", "L3 RC/Holdout", "Artifact/退出码", "人工发布 Gate"],
  },
  {
    id: "TD-T21", moduleId: "TD-M05", title: "Lineage：每个分数都能回到当时的版本", type: "参考", duration: "50 分钟", prerequisites: ["TD-T20"],
    summary: "为 Dataset、Prompt、模型、知识库、工具、Scorer 与运行环境建立可回放的版本账本。",
    why: "只记模型名和总分无法解释差异；浮动别名、被覆盖的 Prompt 或更新后的索引会让历史比较失效。",
    outcomes: ["设计完整 run manifest", "用 hash 和 snapshot 固定比较条件", "识别单变量实验与 confounded comparison"], artifact: "AI 评测 Version Lineage 账本与可比性检查器",
    failure: "报告称候选 B 提升 6%，但 A/B 同时改变模型、知识库、Prompt 与 Judge；没有 lineage 就无法把提升归因给任何组件。",
    mechanism: "一次运行是版本图而不是一个模型名：代码 commit 连接 Prompt、Input、Schema、Dataset、Knowledge snapshot、Tool schema、Model snapshot、Scorer 和 Runtime。比较前先 diff 图。",
    mechanismBullets: ["内容资产用不可变版本和 SHA-256", "外部模型记录 snapshot/region/parameters", "知识库记录语料版本与 index build", "工具记录 schema、权限策略和 sandbox", "无法固定的依赖明确标不可重放"],
    decision: "除被比较变量外的锁定字段发生变化时，结论应为 INVALID_COMPARISON/CONFOUNDED，而不是 winner。组合实验必须预先声明。",
    decisionBullets: ["先 manifest diff 后看分数", "旧版本不可回放则降级历史结论", "raw result 不覆盖，使用 run_id", "任何状态晋级都引用精确 manifest"],
    metric: "用 lineage completeness、replayability 与 confounded-field count 评价证据质量；这些指标不等于模型业务质量。",
    metricBullets: ["分母：必需版本字段", "切片：模型/数据/知识/工具/Scorer", "聚合：逐 run，不跨 manifest 平均", "失败动作：INVALID_COMPARISON"], faultSignal: "`lineage_complete=false` 导致 FAIL",
    practice: ["为一次历史评测补 run manifest", "对两次运行做锁定字段 diff", "把浮动模型别名标成不可重放"], completion: ["所有关键资产有版本或 unknown", "混杂比较不会生成 winner", "报告能回链到 raw run"],
    sources: ["S05", "S24", "S36", "S40"], boundary: "版本账本已在合成 Fixture 中检查；没有真实 Provider snapshot、数据平台或企业制品库集成。", architecture: ["代码 Commit", "Prompt/Input/Schema", "Dataset/Split", "Knowledge/Tool", "Model/Runtime", "Scorer/聚合", "Run Manifest/决策"],
  },
  {
    id: "TD-T22", moduleId: "TD-M05", title: "Trace-to-Regression：把生产失败变成不会复发的用例", type: "项目", duration: "65 分钟", prerequisites: ["TD-T21"],
    summary: "从脱敏 Trace 重建故障路径，抽取最小回归样例，并把来源、审批、版本与 CI Gate 连成闭环。",
    why: "事故只留在复盘文档中，下一次模型、Prompt、知识库或工具更新仍会让同类问题逃逸。",
    outcomes: ["从 Trace 定位模型、检索、工具和状态故障", "在保留触发机制的同时脱敏", "建立失败→回归→修复→发布 Gate 的追踪"], artifact: "Trace-to-Regression 转换记录与最小失败用例",
    failure: "Agent 错误调用 refund_order。Trace 含 PII、检索文档、工具参数、重试和最终答复；直接复制会泄露数据，过度脱敏又会删掉触发条件。",
    mechanism: "原始 Trace 先进入受控调查区；用字段级分类和 source_trace_hash 保留来源，再抽取最小触发条件、领域 Oracle、风险级别和 owner，最后进入版本化 regression set。",
    mechanismBullets: ["先隔离并限制原始 Trace 访问", "保留模型/检索/工具/业务终态关联", "PII、凭证和无关上下文不可进入教学集", "业务与安全 owner 审批 expected behavior", "修复必须先让坏版本重现失败"],
    decision: "不能稳定重放的事件仍可作为调查线索，但不能记为 regression asset；缺少隐私批准或 Oracle 时保持 BLOCKED。",
    decisionBullets: ["每个 case 引用 source_trace_hash", "expected_tool_policy 单独建 blocker", "外部状态用 snapshot 或 safe replay", "新增用例进入 CI 且保留首次红灯"],
    metric: "跟踪 trace conversion rate、redaction defect count、replayability 和 escaped-regression recurrence；分母分别是合格事故、字段、批准样例与后续发布。",
    metricBullets: ["不得以 conversion rate 鼓励复制敏感日志", "逐风险切片看回归覆盖", "脱敏正确性需要独立审查", "失败动作：隔离、BLOCKED、补 owner/证据"], faultSignal: "`source_trace_linked=false` 导致 FAIL",
    practice: ["从合成 Trace 提取最小失败输入", "列出必须保留与必须删除字段", "将回归 case 连到 CI blocker"], completion: ["样例无敏感原文", "故障触发机制仍可重放", "source、owner、risk 和 first-red 证据齐全"],
    sources: ["S10", "S28", "S49", "S70"], boundary: "仅使用合成 Trace；没有生产日志、隐私审批、真实工具副作用或现场事故演练。", architecture: ["生产 Trace 隔离区", "字段分类/脱敏", "最小失败抽取", "业务/安全 Oracle", "Regression Dataset", "CI 重放", "修复与事件 Closure"],
  },
  {
    id: "TD-T23", moduleId: "TD-M05", title: "质量、延迟与成本：联合 Gate 而不是一个综合分", type: "参考", duration: "55 分钟", prerequisites: ["TD-T20", "TD-T21"],
    summary: "在固定 workload 上联合比较风险质量、TTFT/TPOT/尾延迟、Token 与单位成功成本，并识别 Pareto 候选。",
    why: "更快、更便宜或平均质量更高，都可能以高风险切片、p99 或失败请求成本恶化为代价。",
    outcomes: ["定义带分布和风险切片的 workload", "计算质量/延迟/成本三类硬门禁", "在合格候选中解释 Pareto 前沿"], artifact: "质量—延迟—成本 Pareto 与路由决策报告",
    failure: "候选 B 平均延迟低 20%，却在长输入退款任务下降、p99 TTFT 上升、工具重试翻倍；只看均值会把退化写成优化。",
    mechanism: "先固定输入/输出长度、并发、缓存、工具和风险分布；分别测 blocker、任务成功、TTFT、TPOT、端到端延迟、Token 与 cost-per-success；突破硬底线者先淘汰。",
    mechanismBullets: ["质量：blocker 与风险切片先行", "延迟：p50/p95/p99，区分排队/首 token/生成/工具", "成本：失败请求和重试也进分母", "环境：缓存、并发和区域必须可比", "Pareto 只在通过硬门禁的候选中选择"],
    decision: "不要压成一个任意权重综合分。可按风险路由：低风险用便宜候选，高风险保留高质量候选；适用流量、回退条件和 owner 必须写入决策。",
    decisionBullets: ["先过 safety/quality/SLO/budget 硬线", "展示非支配候选与权衡", "价格、workload 或版本变化即重新评测", "路由策略也进入版本 lineage"],
    metric: "核心是 high-risk pass rate、p95/p99 TTFT/端到端延迟和 cost-per-success。每个值都声明测量点、分母、窗口与缺失处理。",
    metricBullets: ["超时不能从延迟分母删除", "失败请求成本不能归零", "尾部和切片不被均值替代", "阈值来自真实 SLO/预算 owner；课程仅给结构"], faultSignal: "`joint_gate_complete=false` 导致 FAIL",
    practice: ["为两个候选画三维 Gate 表", "找出平均值掩盖的尾部退化", "写出一个风险路由和回退条件"], completion: ["workload 条件已固定", "三类指标均有分母和测量点", "决策不依赖模糊综合分"],
    sources: ["S24", "S29", "S31", "S70"], boundary: "Fixture 不产生真实模型延迟、Token 或费用；任何性能/价格阈值均为 NOT_RUN/UNKNOWN。", architecture: ["版本化 Workload", "模型/路由候选", "质量 Scorer", "Trace/延迟分解", "Token/成本账本", "硬门禁/Pareto", "容量与产品 Owner"],
  },
  {
    id: "TD-T24", moduleId: "TD-M05", title: "漂移、Waiver 与回滚：质量系统的恢复闭环", type: "诊断", duration: "60 分钟", prerequisites: ["TD-T21", "TD-T22", "TD-T23"],
    summary: "区分输入、行为、Judge、质量、性能与成本漂移，设计有到期时间的 Waiver 和经过演练的整包回滚。",
    why: "AI 系统会随流量、知识、模型和依赖变化；静默换 Judge 或放宽阈值只会隐藏问题。",
    outcomes: ["建立按风险切片的多信号基线", "区分告警、调查、waiver 和阻断", "演练 Prompt/模型/知识库/工具整包回滚"], artifact: "AI 质量事故、Waiver 与 Rollback Runbook",
    failure: "退款正确率缓慢下降，Judge 分却保持稳定；原因可能是输入分布、知识库、模型或 Judge 自身漂移。只调模型或放宽阈值都可能修错层。",
    mechanism: "版本冻结后按诊断树分别检查输入分布、已校准确定性 Oracle、Judge 对齐、检索、工具、延迟和成本。无法单独归因时先恢复完整已知良好 Manifest，再逐个前滚。",
    mechanismBullets: ["告警使用切片、持续窗口和最小样本条件", "Judge 漂移用固定黄金集和人类复核", "waiver 必须 owner/reason/compensating control/expiry", "到期自动失效并重新阻断", "回滚覆盖模型、Prompt、索引、工具和路由"],
    decision: "阻断风险先回滚再调查。只有具名 owner 可以批准临时 waiver；本地脚本只能验证 waiver 字段和到期规则，不能批准例外。",
    decisionBullets: ["保存 known-good manifest", "演练 rollback 与 regression replay", "回滚后验证业务终态而非只看配置", "事故 Closure 新增 regression case"],
    metric: "信号包括 drift magnitude、持续窗口、MTTD/MTTR、waiver age 与 rollback recovery rate。阈值依赖业务分布和风险容忍度。",
    metricBullets: ["单点波动不直接触发复杂归因", "blocker 可立即触发回滚", "waiver 到期是硬 Gate", "恢复需回到基线并通过回归"], faultSignal: "`waiver_has_expiry=false` 导致 FAIL",
    practice: ["为一次知识库漂移画诊断树", "写一个 24h 自动失效 waiver", "用完整 manifest 演练回滚和复跑"], completion: ["漂移信号按组件拆分", "waiver 有 owner/补偿/到期", "回滚验证包含业务与回归证据"],
    sources: ["S07", "S23", "S24", "S70"], boundary: "本页只验证合成 Runbook 合同；没有生产基线、告警系统、审批或真实回滚演练。", architecture: ["版本化基线", "多信号监测", "漂移诊断树", "版本冻结", "Waiver/到期 Gate", "整包回滚", "Regression/事故 Closure"],
  },
];

export const qualitySystemPages: TutorialPage[] = (specs.map(buildQualityBenchmarkPage) satisfies TutorialPage[]).map((page): TutorialPage => ({
  ...page,
  blocks: composeDeepPage(page.blocks, qualitySystemDeepBlocks(page.id)),
}));
