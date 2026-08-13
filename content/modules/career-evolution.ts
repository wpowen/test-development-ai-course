import type { TutorialBlock, TutorialPage } from "../course.ts";
import { careerEvolutionDeepBlocks } from "./career-evolution-deep.ts";
import { composeDeepPage } from "./deep-layer.ts";

type CareerPageId = "TD-C02" | "TD-C03" | "TD-C04" | "TD-F05" | "TD-T26" | "TD-R01";

const bundle = "materials/career-evolution";

type CareerContract = {
  id: CareerPageId;
  title: string;
  type: TutorialPage["type"];
  duration: string;
  summary: string;
  why: string;
  prerequisites: string[];
  outcomes: string[];
  artifact: string;
  control: string;
  definitions: string[];
  workedExample: string;
  counterexample: string;
  action: string;
  expected: string;
  failure: string;
  repair: string;
  boundary: string;
  practice: string[];
  completion: string[];
  sourceIds: string[];
  nodes: string[];
  diagram: string;
};

const contracts: CareerContract[] = [
  {
    id: "TD-C02",
    title: "责任证据梯：从跟做测试到质量治理",
    type: "概念",
    duration: "50 分钟",
    summary: "把职业成长从年限和头衔改写为四种可观察的责任状态，并为每个状态绑定决策权、工件、故障和复评者。",
    why: "小白最容易把“会工具”“工作几年”误当成能力。测试开发的成长真正体现在：能否解释风险、独立选择 Oracle、让别人复用控制，最后承担治理和带教责任。",
    prerequisites: ["TD-F01"],
    outcomes: ["区分 guided-execution、independent-scoped-ownership、system-cross-team-leverage、strategy-governance-mentoring", "为当前能力填写可追溯证据而不是自我感觉", "设计一次 baseline→fault→repair 的责任证明"],
    artifact: "responsibility-map.json、四状态证据梯和责任边界图",
    control: "我现在承担的是哪一种责任，哪些决定可以做，哪些决定必须升级给具名 owner？",
    definitions: ["责任状态：一个人对工作结果、风险和交接承担到什么范围。", "Oracle：判断结果是否正确的独立依据，不能由生成测试的同一个模型自我宣布。", "证据引用：能打开并复核的输入、命令、原始结果、报告或 reviewer 记录。"],
    workedExample: "学员先在批准的退款 fixture 上执行测试并解释报告，这是 guided-execution；随后自己补一条权限切片、写 Oracle、注入坏版本并让它变红，才有 independent-scoped-ownership 的证据。",
    counterexample: "“我用了 Playwright 两年，所以是高级工程师”没有说明决策权、失败代价、可复用工件或独立复评，不能升级责任状态。",
    action: "为一个测试主题填写 responsibility-map：当前状态、允许的决定、禁止的决定、证据路径、故障变异和 reviewer。",
    expected: "每个状态都有一个真实文件引用；没有证据的字段明确写 UNKNOWN，并能指出下一份应交付的工件。",
    failure: "把工作年限或证书数量填入能力等级，且 evidence_refs 为空；门禁必须失败。",
    repair: "删除年限结论，补上 artifact、decision_rights、failure_cost、evidence_refs 和 reviewer；缺失项保持 UNKNOWN。",
    boundary: "责任证据梯是跨组织可迁移的学习合同；P5–P9、年限和晋升规则必须由组织适配器配置，当前不构成职级结论。",
    practice: ["把一次普通 API 测试分别写成四种责任状态", "为每种状态补一个禁止动作和升级 owner", "用一个 seeded fault 验证证据梯不是自我评价"],
    completion: ["能说清四个责任状态的区别", "每个能力主张有 evidence_ref 或 UNKNOWN", "责任地图包含决策权、失败代价、工件和 reviewer"],
    sourceIds: ["S23", "S60", "S62"],
    nodes: ["工作任务", "责任状态", "决策权", "风险与失败代价", "可复用工件", "故障/变异", "Reviewer", "升级或复评"],
    diagram: "flowchart LR\n  A[工作任务] --> B[责任状态]\n  B --> C[决策权]\n  B --> D[失败代价]\n  C --> E[可复用工件]\n  D --> F[故障/变异]\n  E --> G[独立 Reviewer]\n  F --> G\n  G --> H[升级或复评]",
  },
  {
    id: "TD-C03",
    title: "能力自评与 30/60/90 天证据计划",
    type: "跟做",
    duration: "60 分钟",
    summary: "把自评表变成可复验的 JSON：每个能力主张都绑定证据、缺口路由、下一件工件和复评日期。",
    why: "只有“我会/我不会”的问卷不能告诉学习者下一步做什么，也不能让导师判断是否真的完成。自评必须把缺口直接路由到课程页和项目工件。",
    prerequisites: ["TD-C02"],
    outcomes: ["填写 evidence-bound self-assessment", "把缺口路由到具体页面、练习和 reviewer", "生成不承诺就业或晋升的 30/60/90 天计划"],
    artifact: "capability-self-assessment.json、90-day-evidence-plan.md、gap-routing.json",
    control: "怎样把“我想学 AI 测试”转换成可在 30、60、90 天检查的工件，而不是一张愿望清单？",
    definitions: ["证据边界：这份结果只证明到哪个成熟度，不能推断什么。", "缺口路由：把未满足的能力条件连接到一页课、一次练习或一个真实验证任务。", "复评：在新版本、切片或 reviewer 下重新执行同一证据合同。"],
    workedExample: "UI 自动化工程师把“想转 AI Eval”拆成：30 天完成 Dataset/Metric Card，60 天完成 RAG retrieval fault，90 天完成独立 Oracle 和复评；每一项都附脚本、报告和未运行边界。",
    counterexample: "“三个月掌握大模型并拿到 P6”没有输入基线、责任 owner、验证工件或组织证据，是不可落地的承诺。",
    action: "为至少五个维度填写 claim、responsibility_state、evidence_refs、gap_route、next_artifact、reviewer 和 maturity。",
    expected: "没有 evidence_ref 的项自动成为 UNKNOWN；计划每 30 天有一个 baseline/fault/repair 或人工复评收据。",
    failure: "把空 evidence_refs 的能力项标为 PASS，或在计划中写就业/晋升保证；fixture 门禁必须打红。",
    repair: "将无证据项改成 UNKNOWN，删除结果承诺，补页面路由、工件路径、复评日期和失败动作。",
    boundary: "本页只运行确定性 fixture-tested 自评；真实模型/在线 live、practitioner 复核和 production 学习效果均 NOT_RUN，不证明招聘、薪资、晋升或个体适配。",
    practice: ["为测试背景和开发背景各写一条路线", "把一个能力缺口连接到本课程中的页面 ID", "为 90 天计划写一条失败后的降级或升级动作"],
    completion: ["每项能力有 evidence_ref 或 UNKNOWN", "每个缺口有页面/工件路由", "30/60/90 计划没有就业、晋升或薪资承诺"],
    sourceIds: ["S60", "S62", "S64"],
    nodes: ["当前证据", "能力主张", "缺口诊断", "页面/项目路由", "30 天工件", "60 天故障证据", "90 天复评", "边界声明"],
    diagram: "flowchart TD\n  A[当前证据] --> B[能力主张]\n  B --> C{有 evidence_ref?}\n  C -->|否| D[UNKNOWN + 缺口]\n  C -->|是| E[成熟度边界]\n  D --> F[页面/项目路由]\n  E --> F\n  F --> G[30 天工件]\n  G --> H[60 天故障证据]\n  H --> I[90 天复评]\n  I --> J[边界声明]",
  },
  {
    id: "TD-C04",
    title: "组织职级适配器：P5–P9 不能由 Skill 猜",
    type: "参考",
    duration: "40 分钟",
    summary: "学习如何把公共责任状态映射到具体组织的 band、岗位名称和阈值；没有组织来源时保持 INTERNAL-UNKNOWN。",
    why: "不同公司对 P5/P6、工作年限、晋升和 KPI 的定义不同。课程可以教映射方法，但不能替组织决定学员当前级别。",
    prerequisites: ["TD-C03"],
    outcomes: ["解释公共责任梯与组织 band 的边界", "填写带 owner、版本和生效日期的 organization adapter", "在未配置组织证据时安全返回 INTERNAL-UNKNOWN"],
    artifact: "organization-level-adapter.yaml、mapping-review.json、threshold-owner table",
    control: "哪些组织来源、owner 和生效版本足以把公共责任状态映射到内部岗位？",
    definitions: ["组织适配器：把通用责任状态映射到某个组织内部名称的配置文件。", "生效版本：该映射从哪一天、哪个 policy 版本开始有效。", "INTERNAL-UNKNOWN：没有组织内部证据，系统拒绝猜测。"],
    workedExample: "公共状态 independent-scoped-ownership 可以映射到某公司的 QA2，但只有 HR/Engineering owner 提供 policy URL、版本和生效日期后才可配置；课程不会自己填 P6。",
    counterexample: "看到学员完成三页实验就自动写“你已达到 P6”，这是把 fixture 结果冒充组织晋升结论。",
    action: "编辑 organization-level-adapter.yaml：组织、source_ref、owner、version、effective_from、四状态映射和阈值 owner。",
    expected: "未配置 source_ref/owner/version 时，输出保持 INTERNAL-UNKNOWN 且 failure_action=BLOCK。",
    failure: "仅凭课程页完成数填写 P5/P6，或阈值没有分母、版本和 owner；门禁必须失败。",
    repair: "清空猜测字段，补组织内部来源与审批 owner；无法补齐则保留 UNKNOWN/BLOCKED。",
    boundary: "当前适配器是 fixture-tested 可配置模板，不含任何真实公司 policy；live policy、practitioner 复核和 production 结果均 NOT_RUN，不产生职级、晋升或薪资结论。",
    practice: ["为同一责任状态设计两家组织的不同映射", "给一个过期 policy 写 superseded 处理", "为一个指标补 denominator、version、owner 和 failure_action"],
    completion: ["知道何时必须 INTERNAL-UNKNOWN", "组织映射包含 source、owner、version、effective_from", "阈值不再是无范围的通用数字"],
    sourceIds: ["S23", "S60", "S62"],
    nodes: ["公共责任状态", "组织来源", "Owner 审批", "生效版本", "岗位映射", "Metric Card", "UNKNOWN/BLOCK", "复审周期"],
    diagram: "flowchart LR\n  A[公共责任状态] --> B{组织来源存在?}\n  B -->|否| C[INTERNAL-UNKNOWN / BLOCK]\n  B -->|是| D[Owner 审批]\n  D --> E[生效版本]\n  E --> F[岗位映射]\n  F --> G[Metric Card]\n  G --> H[复审周期]",
  },
  {
    id: "TD-F05",
    title: "AI 任务族与指标选择：先问任务，再选 F1 或 QPS",
    type: "参考",
    duration: "55 分钟",
    summary: "用任务、人口、失败成本和 Oracle 选择指标；避免把 F1、Recall@k、ROUGE、延迟或 QPS 当成万能答案。",
    why: "同样叫“质量”，分类、排序、生成、RAG 和 Agent 的错误含义完全不同。指标必须支持一个明确决策，并说明分母、切片、不确定性和失败动作。",
    prerequisites: ["TD-F04", "TD-T01"],
    outcomes: ["识别分类/回归/排序/生成/RAG/Agent 任务族", "为指标填写 Metric Card", "用反例解释一个指标不能推出什么"],
    artifact: "task-metric-card.yaml、任务→Oracle→指标决策树、错误成本矩阵",
    control: "被测任务是什么、错误损失谁承担、哪个 Oracle 能观察到它，最后哪个指标支持哪个决定？",
    definitions: ["任务族：被测系统要完成的行为类别，例如分类、检索或多步 Agent 任务。", "切片：按风险、用户、语言、长度或场景分组后分别观察结果。", "Metric Card：记录指标定义、人口、分母、版本、不确定性、owner 和失败动作的卡片。"],
    workedExample: "退款意图分类先定义正类和高风险切片，再看 confusion matrix、precision/recall/F1；不能用总体 accuracy 掩盖少数高风险类别。",
    counterexample: "RAG 回答 ROUGE 高就宣布事实正确，或 Agent QPS 高就宣布任务成功，都是把辅助信号当成业务 Oracle。",
    action: "为一个分类、一个 RAG、一个 Agent 任务各填写 task/population、failure_cost、definition、slices、statistic、threshold owner、uncertainty 和 failure_action。",
    expected: "每张卡都能回答“这个数字支持什么决策”和“它不能证明什么”，且有可追溯输入版本。",
    failure: "指标卡缺分母、切片、owner 或把 QPS/ROUGE 当最终正确性；门禁必须失败。",
    repair: "补齐任务人口、错误成本、独立 Oracle、版本和失败动作；必要时将指标降为辅助信号。",
    boundary: "示例数字只属于 fixture-tested 离线夹具；真实 live 流量、practitioner 复核和 production 阈值均 NOT_RUN，没有业务或法规批准。",
    practice: ["为不平衡分类画 confusion matrix", "为 RAG 分开检索、证据支持和端到端结果", "为 Agent 把 outcome、step、trajectory 和副作用分开"],
    completion: ["能按任务选择指标而不是按工具选择", "每张 Metric Card 有分母、切片、版本和 owner", "能写出指标的限制和失败动作"],
    sourceIds: ["S23", "S51", "S62"],
    nodes: ["业务任务", "错误成本", "数据人口", "风险切片", "独立 Oracle", "指标公式", "不确定性", "发布/调查动作"],
    diagram: "flowchart TD\n  A[业务任务] --> B[错误成本]\n  B --> C[数据人口与切片]\n  C --> D[独立 Oracle]\n  D --> E[指标公式]\n  E --> F[不确定性]\n  F --> G[Owner 与阈值]\n  G --> H[发布/调查动作]",
  },
  {
    id: "TD-T26",
    title: "AI 生成测试用例提效：用 Mutation 证明不是批量幻觉",
    type: "项目",
    duration: "75 分钟",
    summary: "建立 baseline/control 与 AI candidate 对照，用编译、运行、Mutation、人工接受率、时间、成本和缺陷产出来验证真正提效。",
    why: "生成数量和演示速度不等于可用测试。专业提效必须同时证明检测力、维护成本、人工修复量和发布决策影响。",
    prerequisites: ["TD-P05", "TD-T06", "TD-F05"],
    outcomes: ["为 AI 生成用例准备 Basis、风险、Oracle 和 Schema", "运行 baseline→fault→repair 并记录 Mutation kill", "比较 accepted-test、time-to-accepted、cost-per-kill 和 defect yield"],
    artifact: "Productivity Experiment Manifest、Prompt/Eval/Mutation 包、baseline-vs-AI 报告",
    control: "相对于人工或规则 baseline，AI 生成测试是否在相同任务、风险和完成定义下提高了可接受检测力，而不是只增加候选数量？",
    definitions: ["Baseline：在没有 AI 候选的条件下，用同一任务和完成定义得到的对照结果。", "Mutation：人为注入一个已知缺陷，检查测试是否能把它打红。", "Accepted test：经过编译、运行、Oracle 审查且被具名 reviewer 接受的测试，不是生成出来的文本。"],
    workedExample: "同一份退款需求和风险集分别让人工 baseline 与 AI 生成候选；两边都必须通过 schema、运行和相同 mutation，报告 accepted-test 时间和 mutation kill，而不是报告“AI 生成了 200 条”。",
    counterexample: "AI 生成 500 条重复用例、删除弱断言后全部通过，再称效率提升 10 倍；没有检测力和质量分母，结论无效。",
    action: "运行 productivity experiment manifest，保存 baseline、AI candidate、critic、accepted、mutation 和 reviewer receipt。",
    expected: "报告能分开候选数量、可接受数量、mutation kill、重复率、人工修复时间、成本和 unique defect yield。",
    failure: "让 AI 自己当 Oracle，或只统计生成数量/响应速度；提效门禁必须失败。",
    repair: "恢复独立 Oracle、固定完成定义和 mutation 集，补人工 reviewer 与同任务 baseline/control 对照。",
    boundary: "本页只证明 fixture-tested 离线实验设计和门禁；真实 live 模型、practitioner 团队复核和 production 缺陷/ROI 结论均 NOT_RUN。",
    practice: ["为一个需求写 Basis/风险/Oracle 输入合同", "设计三个正向和三个负向 mutation", "计算 time-to-accepted-test 和 cost-per-killed-mutation"],
    completion: ["Prompt 绑定 Input/Schema/Eval/Mutation", "baseline 与 AI 使用同一完成定义", "报告同时有质量、效率、成本和未知边界"],
    sourceIds: ["S23", "S60", "S64"],
    nodes: ["需求 Basis", "风险与方法", "独立 Oracle", "Baseline/AI Candidate", "编译与运行", "Mutation Kill", "Reviewer", "提效决策"],
    diagram: "flowchart LR\n  A[需求 Basis] --> B[风险与方法]\n  B --> C[独立 Oracle]\n  C --> D[Baseline / AI Candidate]\n  D --> E[编译与运行]\n  E --> F[Mutation Kill]\n  F --> G[Reviewer]\n  G --> H[提效决策]",
  },
  {
    id: "TD-R01",
    title: "资源与学习路线：会更新的索引，不是盲目书单",
    type: "参考",
    duration: "35 分钟",
    summary: "把书籍、课程、平台、框架和论文整理成带版本、检查日期、用途、限制与替代路径的资源索引。",
    why: "用户材料中的资源很丰富，但链接、版本、维护状态和适用人群会变化。小白需要知道先学什么、为什么学、过期了怎么办。",
    prerequisites: ["TD-C03"],
    outcomes: ["按当前能力缺口选择资源", "记录 URL/path、checked_at、version、purpose 和 limits", "在资源过期或不适用时切换 fallback"],
    artifact: "resource-index.json、背景分路图和资源复核记录",
    control: "这个资源解决哪个学习缺口，当前版本是否可访问，学完要交什么工件，过期后用什么替代？",
    definitions: ["资源索引：面向一个学习目标的、带维护元数据的资源记录，不是无条件推荐。", "检查日期：最近一次确认链接、版本和适用范围的时间。", "Fallback：主资源不可用、过时或不适合当前背景时的替代路径。"],
    workedExample: "零基础学员先用 Python/测试基础资源，再进入 AI 任务指标页；每个资源都指向一个小工件，例如运行一个 pytest 或完成一张 Metric Card。",
    counterexample: "把“推荐五星”“热门”“读完即可就业”当成有效性证据，没有版本、目标、练习或替代路径。",
    action: "为自己的一个能力缺口填写 resource-index：resource、version、checked_at、level、purpose、limits、fallback、exit_artifact。",
    expected: "索引能生成按背景分路的学习顺序；过期资源被标记并能回退到另一条路径。",
    failure: "资源没有检查日期、用途或 fallback，却被标为必学；门禁必须失败。",
    repair: "补版本/检查日期/适用 level/限制/出口工件；不确定的资源标 BLOCKED，不写成最佳实践。",
    boundary: "资源索引只证明 fixture-tested 整理和维护方法；live 链接可达性、practitioner 复用和 production 学习效果均 NOT_RUN，仍需独立验证。",
    practice: ["为测试背景、开发背景、零基础各选一条入口", "给一个过期链接写替代路径", "把一个资源连接到可运行课程工件"],
    completion: ["每个资源有用途、版本和检查日期", "有 fallback 和限制说明", "学习路线以出口工件而不是书单长度结束"],
    sourceIds: ["S23", "S60", "S62"],
    nodes: ["能力缺口", "学习背景", "资源记录", "版本/检查日期", "限制", "Fallback", "出口工件", "复核更新"],
    diagram: "flowchart TD\n  A[能力缺口] --> B[学习背景]\n  B --> C[资源记录]\n  C --> D[版本/检查日期]\n  D --> E{适用?}\n  E -->|否| F[Fallback]\n  E -->|是| G[出口工件]\n  F --> G\n  G --> H[复核更新]",
  },
];

const technicalBlocks = (page: CareerContract): TutorialBlock[] => [
  { title: `${page.action}：先用白话建立模型`, body: [...page.definitions, page.workedExample, page.counterexample], expected: page.expected },
  { title: `${page.action}：把决策写成可检查模型`, body: [page.control, "不要把年限、工具名称或生成数量当作能力/质量的替代证据。"], technical: { kind: "diagram", content: page.diagram, verification: `图中每个节点必须能回链到 ${page.id} 的输入、工件、Oracle 或 reviewer；缺失回链时保持 BLOCKED。`, implementationPath: `${bundle}/diagrams/${page.id}.mmd` } },
  { title: `${page.action}：版本化 Prompt/Eval/Mutation`, body: [`本页 Prompt 只生成 ${page.id} 的结构化候选，不替代 owner、Oracle 或组织政策。`, `输出必须保留 UNKNOWN、NOT_RUN、BLOCKED 和适用范围。`], technical: { kind: "prompt", content: `读取 ${page.id} 的批准 fixture，输出符合 Schema 的候选工件；不得猜测职级、阈值、就业或生产结论。`, version: "1.0.0", promptPath: `${bundle}/prompts/${page.id}/task-v1.md`, manifestPath: `${bundle}/prompts/${page.id}/manifest.json`, inputFixturePath: `${bundle}/fixtures/${page.id}-input.json`, outputSchemaPath: `${bundle}/schemas/${page.id}-output.schema.json`, evaluationPath: `${bundle}/evals/${page.id}-eval.json` }, expected: "Prompt 结果必须可回链；模型执行状态保持 NOT_RUN。" },
  { title: `${page.action}：重放 0 → 1 → 0`, body: [page.failure, page.repair, page.boundary], technical: { kind: "command", content: `python3 scripts/career_evolution_lab.py --manifest manifests/${page.id}.json --mode cycle`, manifestPath: `${bundle}/manifests/${page.id}.json`, stepId: "cycle", workingDirectory: bundle, expectedExitCode: 0, expectedArtifacts: [`evidence/${page.id}/baseline.json`, `evidence/${page.id}/fault.json`, `evidence/${page.id}/repair.json`, `evidence/${page.id}/cycle.json`] }, expected: "cycle 退出 0，内部步骤严格为 0/1/0；fault 失败是检测力证据。" },
  { title: `${page.action}：迁移到新场景`, body: ["复制工件时只修改明确的 editable_fields；输入、版本、owner、Oracle、失败动作和限制必须重新审查。", page.boundary], warning: page.boundary },
];

export const careerEvolutionPages = (contracts.map((page) => ({
  id: page.id,
  moduleId: "TD-M10",
  order: 0,
  title: page.title,
  type: page.type,
  status: "fixture-tested",
  duration: page.duration,
  summary: page.summary,
  why: page.why,
  prerequisites: page.prerequisites,
  outcomes: page.outcomes,
  artifact: page.artifact,
  blocks: technicalBlocks(page),
  practice: page.practice,
  completion: page.completion,
  sourceIds: page.sourceIds,
  evidenceBoundary: page.boundary,
  architecture: { title: `${page.title} 学习证据链`, caption: `${page.control} 任一关键证据缺失时保持 UNKNOWN/BLOCKED。`, nodes: page.nodes },
  materials: [
    { title: `${page.id} 确定性 Runner`, description: "实际运行本页 baseline/fault/repair 的标准库脚本，内部退出码严格为 0/1/0。", href: `${bundle}/scripts/career_evolution_lab.py`, kind: "script", validation: "fixture-tested" },
    { title: `${page.id} 输入夹具`, description: "版本化、可脱敏、fixture-only 的学习输入。", href: `${bundle}/fixtures/${page.id}-input.json`, kind: "fixture", validation: "fixture-tested" },
    { title: `${page.id} 运行 Manifest`, description: "声明 owner、Oracle、故障变异和 0/1/0 步骤。", href: `${bundle}/manifests/${page.id}.json`, kind: "config", validation: "fixture-tested" },
    { title: "职业演进完整材料包", description: "六页 Prompt/Input/Schema/Eval/Mutation、Runner、证据和可复用工件。", href: `${bundle}.zip`, kind: "archive", validation: "fixture-tested" },
    { title: "责任/自评/组织/指标可复用工件", description: "复制到新业务前必须填写 editable_fields、owner、版本和限制。", href: `${bundle}/artifacts/README.md`, kind: "guide", validation: "static-reviewed" },
  ],
})) satisfies TutorialPage[]).map((page): TutorialPage => ({
  ...page,
  blocks: composeDeepPage(page.blocks, careerEvolutionDeepBlocks(page.id)),
}));

export const careerEvolutionPageIds = new Set(careerEvolutionPages.map((page) => page.id));
