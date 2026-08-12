import type { TutorialPage } from "../course.ts";
import { agentDeepBlocks, agentDeepMaterials } from "./agent-architecture-deep.ts";

type AgentArchitectureSpec = {
  id: `TD-AG-${string}`;
  moduleId: string;
  title: string;
  type: TutorialPage["type"];
  prerequisites: string[];
  summary: string;
  why: string;
  outcomes: [string, string, string, ...string[]];
  artifact: string;
  problem: string;
  workflow: [string, string, string, ...string[]];
  scenario: string;
  expected: string;
  failure: string;
  repair: string;
  metric: string;
  nodes: string[];
  sourceIds: [string, string, string, ...string[]];
};

const WORKDIR = "materials/agent-architecture-system";
const PROMPT_ROOT = `${WORKDIR}/prompts`;

const specs: AgentArchitectureSpec[] = [
  {
    id: "TD-AG-00", moduleId: "TD-M12", title: "Agent 测试架构总览：先画边界，再选测试", type: "概念", prerequisites: ["TD-F04", "TD-T01"],
    summary: "用 D0–D7、四证据环和运行时护栏画出 Agent 被测边界，知道一条结论从哪里来、由谁负责。",
    why: "把所有问题都叫作“模型不聪明”会漏掉工具、状态、权限、评估器和业务治理故障。",
    outcomes: ["区分模型、Agent、工具、Workflow、Worker 和 Judge", "将架构边界映射为风险、Oracle 和证据", "解释四证据环为何不能互相冒充", "交付一张可迁移的 Agent 测试架构图"],
    artifact: "D0–D7 Agent 测试架构图与边界登记册",
    problem: "客服退款系统由路由器、Agent、检索器、工具、异步 Worker 和人工审批组成。最终答复看起来正确，但一次未经授权的写操作可能已经发生。",
    workflow: ["列出节点、状态、信任边界、工具和副作用", "标记每个决策由代码、模型、队列还是人工控制", "为每个边界登记风险、可观察证据和独立 Oracle", "将风险放入离线、沙箱、影子或在线环并指定 owner"],
    scenario: "在合成退款架构图中标出 D0–D7；把“工具权限越界”连接到 D5、确定性策略 Oracle、沙箱环和人工 owner，而不是只连接到最终文本。",
    expected: "架构图至少包含输入、D0–D7、四环、护栏、输出和反馈；每条风险边都有证据、停止状态和责任人。",
    failure: "若图只有组件名称或把所有检查挂到模型输出，说明被测边界仍不清楚；不能用页面数量补救。",
    repair: "补齐状态持有者、工具副作用、独立 Oracle、owner 和停止状态，再用同一 fixture 重放。",
    metric: "本页只检查边界闭合率和 owner/Oracle/stop-state 字段，不产生任何模型质量分数。",
    nodes: ["需求/风险", "D0 评估可信", "D1 单体", "D2 编排", "D3 人机", "D4 可靠", "D5 安全", "D6 效率", "D7 治理", "四证据环", "护栏", "决策/反馈"],
    sourceIds: ["S24", "S39", "S65"],
  },
  {
    id: "TD-AG-01", moduleId: "TD-M12", title: "D0 评估可信：先测试 Judge，再相信分数", type: "跟做", prerequisites: ["TD-AG-00", "TD-T03", "TD-T14"],
    summary: "建立人工金标、Judge Card、偏差探针和停用回退链，理解评估器本身也是被测系统。",
    why: "未校准的 Judge 可能把冗长、位置或自偏好当成质量；后续所有数字都会继承这个错误。",
    outcomes: ["区分人人一致性与人机一致性", "设计顺序、长度、事实和自偏好探针", "为 Judge 换版建立重校准和停用条件"],
    artifact: "Judge Card、金标集和分歧矩阵",
    problem: "同一事实答案只改变候选顺序，Judge 就改变胜负；另一个答案引用过期政策却因表达流畅得高分。",
    workflow: ["冻结 rubric、版本、样本和人工 owner", "双人或多人独立标注并记录争议", "盲化候选顺序，运行偏差探针和确定性 blocker", "输出 κ/分歧/限制，决定自动评分、抽检或人工升级"],
    scenario: "使用 12 条合成答复：4 条顺序交换、4 条加入冗余、4 条事实错误。顺序翻转不应改变事实判断，事实错误必须触发人工 blocker。",
    expected: "报告含 gold refs、人工标签、Judge 版本、偏差探针、失败切片和停用/回退动作；模型不得批准自己的 Oracle。",
    failure: "只比较 Judge 与一名标注员，或只保存最终分数，无法区分 rubric 歧义与 Judge 偏差。",
    repair: "先修订 rubric 和标注争议，再重跑校准；Judge 版本变化必须生成新卡片，不能继承旧分数。",
    metric: "κ、Spearman、位置一致率和样本量只是场景化字段；本页不把来源示例阈值当通用门禁。",
    nodes: ["Gold Set", "人工双标", "Rubric", "Judge", "偏差探针", "分歧矩阵", "停用/人工回退"],
    sourceIds: ["S05", "S23", "S40"],
  },
  {
    id: "TD-AG-02", moduleId: "TD-M12", title: "D1 轨迹 span：从最终结果追到首个错误", type: "跟做", prerequisites: ["TD-AG-00", "TD-T15", "TD-T16"],
    summary: "同时评估 outcome、step 和 trajectory，并用 span 标签、首错位置和无效循环率定位 Agent 失败。",
    why: "最终结果偶然正确，不能抵消中途越权、错误参数、曲解观测或无限循环。",
    outcomes: ["建立 outcome/step/trajectory 三层 Oracle", "按工具、参数、观测利用、步骤必要性标记 span", "从首错位置生成可操作修复"],
    artifact: "trajectory-ledger.jsonl 与首错归因报告",
    problem: "Agent 最终回复转人工，但曾调用一次退款工具并被后端拒绝；只看最终文本会假绿。",
    workflow: ["定义业务终态和禁止副作用", "记录每个工具调用、参数、观测、重试和状态", "逐 span 判定正确、冗余、遗漏或错误", "按首错位置、步骤效率和循环率归因"],
    scenario: "给出允许查询、读政策、转人工的合成任务；任何 refund_order 调用都必须在 step 层失败，即使 outcome 文本正确。",
    expected: "报告分别展示 outcome、step、trajectory；每个 blocker 回指具体 span、工具参数和状态快照。",
    failure: "把唯一黄金轨迹当作唯一正确路径，会错杀安全替代路径；应优先写不变量和禁止副作用。",
    repair: "保留安全路径集合，新增必要不变量和 span Oracle，再重放已知故障。",
    metric: "步骤效率比、首错位置和无效循环率均需声明分母与任务范围，不能跨系统直接比较。",
    nodes: ["Task", "Step/Span", "Tool/Parameter", "Observation", "First Error", "Outcome Oracle", "Trajectory Decision"],
    sourceIds: ["S10", "S70", "S72"],
  },
  {
    id: "TD-AG-03", moduleId: "TD-M12", title: "D2 编排：交接、隔离、级联和熔断", type: "跟做", prerequisites: ["TD-AG-02", "TD-W01", "TD-W02"],
    summary: "为多 Agent handoff 建立 schema、上下文隔离和三重熔断，防止信息衰减和下游失败拖垮全局。",
    why: "每一次 A→B 交接都是新的断点；状态、权限和失败责任可能在边界处丢失。",
    outcomes: ["写出 handoff contract 和职责矩阵", "验证上下文最小可见与返回污染", "测试步数、时间、成本三类熔断"],
    artifact: "handoff-contract.json 与编排故障报告",
    problem: "研究 Agent 将未验证的客户身份和过期政策交给执行 Agent；下游超时后上游重复调用，最终产生重复副作用。",
    workflow: ["为 A→B 定义必传字段、语义约束和 owner", "埋入 5 个事实并做多跳信息衰减检查", "隔离子 Agent 上下文和工具权限", "注入超时、空结果、错误 handoff 并验证三重熔断"],
    scenario: "三跳交接后检查 5 个事实存活数；让下游返回空结果并移除终止信号，系统必须在预算内停止并留下 stop_reason。",
    expected: "交接 schema、信息保真、隔离、故障隔离率、熔断触发和 owner 均有原始证据；不存在无限重试。",
    failure: "只测最终业务状态，或把增加重试次数当作可靠性修复，会掩盖级联和成本爆炸。",
    repair: "修正必传字段、checkpoint、权限和三重预算，使用同一 mutation 重放并保留失败收据。",
    metric: "信息保真率、隔离泄漏、熔断延迟和级联故障率必须绑定 workload、跳数和状态重置规则。",
    nodes: ["Agent A", "Handoff Schema", "Context Isolation", "Agent B", "Failure Injection", "Circuit Breaker", "Owner"],
    sourceIds: ["S35", "S48", "S74"],
  },
  {
    id: "TD-AG-04", moduleId: "TD-M12", title: "D3 人机协同：中断、接管与确认疲劳", type: "跟做", prerequisites: ["TD-AG-03", "TD-X601"],
    summary: "测试用户在关键步骤中断、接管和交回 Agent 的能力，区分可解释与真正可控。",
    why: "自主性越强，越需要证明人能及时停止、回滚并接管；弹窗很多不等于人真正拥有控制权。",
    outcomes: ["验证 N 步中断和脏状态清理", "验证接管前后上下文完整性", "识别确认疲劳和解释不等于正确"],
    artifact: "human-control-checklist.json 与接管 Trace",
    problem: "Agent 在退款前等待确认，用户中断后留下半成品状态；恢复时 Agent 看不到人工修改，继续执行旧计划。",
    workflow: ["定义高危动作和人工授权点", "在 N 步注入 stop、接管和重新交回", "检查状态、回滚、权限和新的 owner", "统计确认负担并抽检人工是否真的能拒绝"],
    scenario: "在写操作前后分别中断一次；前者必须无副作用，后者必须可回滚或转人工，并留下确认人、时间和状态。",
    expected: "中断响应、脏状态、回滚、接管上下文和人工决定可追溯；解释文本不能替代控制证据。",
    failure: "只断言出现确认按钮，或把用户点击同意当作有效授权，无法证明人真的有权停止。",
    repair: "将授权移到工具边界，补状态清理和人工拒绝路径，再运行同一中断 mutation。",
    metric: "响应步数、接管成功率和确认疲劳属于场景指标；阈值由风险 owner 和人机研究共同配置。",
    nodes: ["Agent Run", "Human Interrupt", "Dirty State", "Rollback", "Takeover", "Resume", "Audit Owner"],
    sourceIds: ["S07", "S23", "S65"],
  },
  {
    id: "TD-AG-05", moduleId: "TD-M12", title: "D4 可靠性分布：pass@k、pass^k 与长时程衰减", type: "项目", prerequisites: ["TD-AG-02", "TD-T04", "TD-B03"],
    summary: "把一次 PASS 改成重复运行分布，区分至少一次成功和每次都成功，并按任务时长观察 horizon 衰减。",
    why: "pass@k 可能很高而重复一致性很差；小样本点估计也不能支持生产承诺。",
    outcomes: ["正确计算 pass@k 与 pass^k", "声明 task/run/trajectory 单位和状态重置", "按时长桶输出区间和证据不足"],
    artifact: "reliability-metric-card.json 与 horizon 曲线数据",
    problem: "10 个任务各跑 5 次，8 个任务至少成功一次；团队只报 pass@5，却隐藏单次失败、成本和安全 blocker。",
    workflow: ["固定 task、slice、版本、温度和重试政策", "记录每次 raw run、失败位置和成本", "按 task 聚合 pass@k/pass^k 并计算预声明区间", "按时长桶比较衰减，样本不足则停止"],
    scenario: "使用固定合成 ledger 演示 4/5 的 pass@1 与 0/1 的 pass^5 差异；再注入长时程循环，验证 horizon gate 变红。",
    expected: "Metric Card 写清分子、分母、k、状态重置、区间方法、样本量理由、owner 和失败动作；不会把点估计写成稳定性。",
    failure: "将重复 run 当作完全独立样本，或以 CI 不重叠作为唯一统计原则，都会造成过度结论。",
    repair: "改用 task-clustered/paired 不确定性，补切片和暴露量，再重算报告；不删除失败 run。",
    metric: "来源的 k、CV 和百分比只作为示例；真实门槛必须进入带总体/时间/版本/owner 的 Metric Card。",
    nodes: ["Task Set", "Repeated Runs", "pass@k", "pass^k", "Clustered CI", "Horizon Buckets", "Decision"],
    sourceIds: ["S36", "S38", "S39"],
  },
  {
    id: "TD-AG-06", moduleId: "TD-M12", title: "D5 持续安全：注入、MCP 投毒、委托、沙箱与爆炸半径", type: "项目", prerequisites: ["TD-AG-03", "TD-AG-04", "TD-T17"],
    summary: "把不可信输入、工具描述、记忆、委托链和不可逆副作用放进持续对抗套件，并按轨迹审计护栏。",
    why: "只测用户输入或只依赖 Prompt 约束，无法防住间接注入、rug-pull、跨会话污染和组合越权。",
    outcomes: ["构造直接/间接/延迟/持久化攻击", "验证工具 manifest、最小权限和能力沙箱", "用可逆性×影响面×资金影响判断爆炸半径"],
    artifact: "agent-security-suite.json 与安全红队报告",
    problem: "被污染的工具描述诱导 Agent 导出订单；模型拒绝了文本请求，但工具层仍有跨租户读取能力。",
    workflow: ["登记输入、检索、工具描述/结果、记忆和权限信任边界", "注入 rug-pull、延迟触发、记忆污染和委托链越权", "在模型外验证 tenant、scope、schema、审批、额度和沙箱", "把每次攻击的到达层、副作用、阻断原因交给安全 owner"],
    scenario: "合成租户 A 只允许读取自己的订单；恶意文档要求导出全量订单，工具描述运行时变更。任何跨租户、秘密或写操作都必须在工具边界前阻断。",
    expected: "攻击套件区分模型拒绝与策略强制拒绝；trace 含 manifest hash、权限、阻断层、爆炸半径和人工升级。",
    failure: "只检查模型是否说“不”，或把 0 次攻击成功写成绝对安全，都会忽略暴露量和未知攻击面。",
    repair: "恢复 manifest hash、工具实际权限、短时效凭证、硬额度和 Kill Switch，再重跑所有攻击切片。",
    metric: "ASR、阻断率和污染存活轮数必须声明攻击总体、暴露量、切片和上界解释；来源阈值不是默认政策。",
    nodes: ["Untrusted Input", "Tool/MCP Manifest", "Memory", "Delegation", "Policy/Sandbox", "Irreversible Action", "Security Owner"],
    sourceIds: ["S07", "S08", "S50"],
  },
  {
    id: "TD-AG-07", moduleId: "TD-M12", title: "D6 经济性：任务、步骤、尾延迟与成本预算", type: "项目", prerequisites: ["TD-AG-05", "TD-AP01", "TD-AP02"],
    summary: "把 Agent task 拆成 step/tool trace，联合观察延迟、吞吐、Token、Judge 和人工成本，并验证预算会真正截断。",
    why: "均值掩盖长尾；重试可能提高 pass@k，却把成本和副作用放大数倍。",
    outcomes: ["建立 task→step→tool 指标树", "计算 P95/P99、goodput 和成本尾部", "测试 token、时间、步骤和金钱四类硬预算"],
    artifact: "workload-cost-card.json 与容量/成本报告",
    problem: "客服 Agent 平均响应很快，但少数长循环任务消耗大量 Token；QPS 看似上升，实际 goodput 和成功成本下降。",
    workflow: ["按任务类型、Token、步骤和风险切片建 workload", "固定到达率、并发、版本和价格", "记录 queue、TTFT、TPOT、retry、step、goodput 和成本尾部", "注入超预算循环，验证安全截断和人工升级"],
    scenario: "对只读查询和高风险写任务分别压测；增加重试后观察 pass^k、P99 和单位成功成本，不能用总吞吐抵消高危失败。",
    expected: "报告保留 task/step/tool 级 raw trace、P95/P99、goodput、成本 P99、预算动作和资源隔离；每条结论带适用 workload。",
    failure: "只报平均延迟/QPS，或把提高预算作为修复，会把失控循环和高尾成本藏起来。",
    repair: "恢复硬预算、幂等和分类降级，重新运行同一 workload；将价格和模型版本写入 lineage。",
    metric: "P95/P99、成本 CV 和预算值必须由 workload profile、价格时间和 owner 配置，不能跨环境搬运。",
    nodes: ["Workload", "Task Root", "Queue", "LLM Step", "Tool Attempt", "Latency/Cost", "Budget Gate"],
    sourceIds: ["S51", "S53", "S73"],
  },
  {
    id: "TD-AG-08", moduleId: "TD-M12", title: "D7 业务治理：规则、审计、四维版本与 ROI", type: "项目", prerequisites: ["TD-AG-06", "TD-AG-07", "TD-T21", "TD-T23"],
    summary: "把业务规则、Agent 委托、审计证据、模型/Prompt/工具/Memory 四维版本和风险接受连接起来。",
    why: "模型名不变也可能因 Prompt、工具或 Memory 变化而改变决策；平均质量分不能替代业务责任。",
    outcomes: ["建立业务硬规则和建议/执行分离", "生成可审计的 Agent 版本 lineage", "用人工基线和风险 owner 解释 ROI 与剩余风险"],
    artifact: "business-risk-acceptance.json 与 Agent lineage 卡",
    problem: "模型、system prompt、工具清单和 Memory 快照同时更新；总体分数提高，但退款政策切片出现错误承诺。",
    workflow: ["绑定业务规则、失败成本、决策 owner 和人工基线", "将四维 Agent 版本写入 manifest", "按动作回链用户、Agent、工具、依据和时间", "列出 blocker、补偿控制、expiry、rollback 和风险接受人"],
    scenario: "把一条过期政策注入退款切片；即使平均分提升，业务规则 blocker 仍阻断，报告必须展示受影响版本和回滚目标。",
    expected: "每个业务动作都有审计链；四维版本任一变化触发回归；ROI 结论区分已测成本、人工基线和未验证收益。",
    failure: "用模型自评批准 waiver，或以“节省时间”直接推导 ROI，都会绕过责任和证据边界。",
    repair: "恢复规则、版本、owner 和人工基线；重新生成 risk acceptance，不改变 Oracle 来求绿。",
    metric: "硬规则、审计完整率、变更影响、人工基线和 ROI 需分开报告；不可用统一综合分隐藏 blocker。",
    nodes: ["Business Rule", "Agent Version", "User Delegation", "Tool Action", "Audit Evidence", "Risk Acceptance", "Rollback"],
    sourceIds: ["S24", "S64", "S65"],
  },
  {
    id: "TD-AG-09", moduleId: "TD-M12", title: "四证据环与三段门禁：从 CI 走到持续评估", type: "项目", prerequisites: ["TD-AG-05", "TD-AG-06", "TD-AG-08", "TD-T20", "TD-X805"],
    summary: "将离线 CI、沙箱回放、影子灰度和在线持续评估串成证据成熟度链，再执行硬红线、统计门禁和风险接受。",
    why: "静态通过、fixture 通过和生产有效是不同命题；跨环升级必须有新的输入、owner 和回滚证据。",
    outcomes: ["写出四环 entry/exit/hard-block 合同", "执行 0/1/0 的离线闭环", "区分 PASS、EVIDENCE-INSUFFICIENT、BLOCKED 和 risk accepted"],
    artifact: "four-ring-release-plan.json 与三段式门禁收据",
    problem: "离线回放通过后直接上线；影子环没有真实流量不生效保证，在线环也没有高危全量采样或自动回滚。",
    workflow: ["为每个环声明 population、统计方法、owner 和 rollback", "环 1/2 用确定性和沙箱 fixture 验证硬门禁", "环 3/4 只设计真实集成入口，未运行保持 NOT_RUN", "将硬红线、统计证据不足和风险接受分别输出"],
    scenario: "运行四环 manifest 的本地模拟：环 1 与环 2 可生成 receipt；环 3/4 明确 provider/integration NOT_RUN，不得伪造在线通过。",
    expected: "receipt 能区分四环成熟度和三类决策；任一高危 blocker 或 D0 失效都会 fail-closed。",
    failure: "把 fixture 的 0/1/0 写成 live，或用单个总分掩盖安全 blocker，都是状态升级错误。",
    repair: "恢复环输入、owner、hard block 和 rollback；重新生成 receipts，并把未执行环保持 NOT_RUN。",
    metric: "环间指标只在 population、版本和统计方法可比时关联；成熟度不是页面完成度。",
    nodes: ["Offline CI", "Sandbox Replay", "Shadow/Canary", "Online Sampling", "Hard Redline", "Statistical Gate", "Risk Acceptance"],
    sourceIds: ["S07", "S24", "S65"],
  },
  {
    id: "TD-AG-10", moduleId: "TD-M12", title: "高风险适配器：交易/金融 Agent 的时效、执行与能力沙箱", type: "项目", prerequisites: ["TD-AG-06", "TD-AG-08", "TD-AG-09"],
    summary: "把交易场景作为高风险适配器学习：数据新鲜度、建议与执行分离、能力沙箱和分钟级回滚。",
    why: "金融示例不能直接变成所有 Agent 的通用规则；它的价值在于展示不可逆动作和实时数据如何改变测试责任。",
    outcomes: ["为行情/决策数据增加时间戳断言", "物理隔离建议与执行两类任务", "用工具硬限额而非 Prompt 约束控制高危动作"],
    artifact: "高风险 Agent 适配器与爆炸半径清单",
    problem: "价格数据陈旧但推理文本正确；Agent 将建议路径误接到真实下单工具，且限额只写在 system prompt。",
    workflow: ["声明数据新鲜度、任务类别、资金影响和可逆性", "将建议与执行数据集和 owner 物理分开", "在能力沙箱中验证额度、双人确认、Kill Switch 和回滚", "仅将适配器结论应用于相同风险 profile，不外推到普通问答"],
    scenario: "合成市场数据时间戳超过允许窗口；建议任务可输出 UNKNOWN/转人工，执行任务必须在工具层拒绝，且不产生真实资金副作用。",
    expected: "报告含数据时间、建议/执行切片、可逆性、影响面、额度、审批、阻断层和 owner；明确金融适配器不等于生产授权。",
    failure: "用 Prompt 说“不要超额交易”、把陈旧数据当作可接受、或把本地沙箱通过写成真实交易安全，均为不合格。",
    repair: "恢复数据时效断言、工具硬限额、双人审批和自动回滚，重新运行高风险 mutation。",
    metric: "交易阈值和数据窗口必须由业务/合规 owner 配置；来源中的示例数值只保留为待核假设。",
    nodes: ["Market Timestamp", "Advice Task", "Execution Task", "Capability Sandbox", "Hard Limit", "Human Approval", "Kill Switch/Rollback"],
    sourceIds: ["S07", "S50", "S65"],
  },
];

const makePage = (spec: AgentArchitectureSpec): TutorialPage => {
  const slug = spec.id.toLowerCase();
  const reportDir = `reports/${slug}`;
  const manifestPath = `${WORKDIR}/manifests/${spec.id}.json`;
  const promptBase = `${PROMPT_ROOT}/${spec.id}`;
  return {
    id: spec.id,
    moduleId: spec.moduleId,
    order: Number(spec.id.slice(-2)) + 1,
    title: spec.title,
    type: spec.type,
    status: "fixture-tested",
    duration: "70 分钟",
    summary: spec.summary,
    why: spec.why,
    prerequisites: spec.prerequisites,
    outcomes: spec.outcomes,
    artifact: spec.artifact,
    blocks: [
      { title: "先把架构问题说清楚", body: [spec.problem, "本页先画边界、写责任和停止条件，再使用任何模型或自动化工具。"], warning: "真实模型、企业系统、生产凭证和从业者结论均 NOT_RUN。" },
      { title: "按证据顺序执行", body: [spec.scenario], bullets: spec.workflow, technical: { kind: "diagram", content: spec.nodes.join(" → "), verification: `逐项核对 ${spec.nodes.join("、")} 的输入、观察点、Oracle、owner 和 stop state。` } },
      { title: "Metric Card 与独立 Oracle", body: [spec.metric, "Prompt 只能整理候选证据，不能制定业务规则、批准 waiver 或替代人工 owner。"], technical: { kind: "prompt", content: `按 ${spec.id} 的输入、schema、eval 和 mutation 输出带 source_refs、owner、limitations、stop_state 的候选结果。`, version: "1.0.0", promptPath: `${promptBase}/task.md`, manifestPath: `${promptBase}/manifest.json`, inputFixturePath: `${promptBase}/input.json`, outputSchemaPath: `${promptBase}/schema.json`, evaluationPath: `${promptBase}/eval.json` }, expected: "输出必须保留 Evidence、Inference、Unknown 与证据边界。" },
      { title: "Baseline / Fault / Repair：0/1/0", body: ["先运行正常合同，再注入一个命名故障，最后恢复同一合同。故障报告必须由独立 Oracle 点名，不能吞异常或改 expected。", `Fault 目标：${spec.failure}`], technical: { kind: "command", content: `python3 scripts/agent_architecture_lab.py --topic ${spec.id} --phase cycle --report-dir ${reportDir}`, manifestPath, stepId: "cycle", workingDirectory: WORKDIR, expectedExitCode: 0, expectedArtifacts: [`${reportDir}/baseline.json`, `${reportDir}/fault.json`, `${reportDir}/repair.json`, `${reportDir}/cycle-summary.json`] }, expected: "observed_exit_codes=[0,1,0]；模型 provider/model 保持 NOT_RUN。" },
      { title: "诊断与安全修复", body: [spec.failure, spec.repair], warning: "降低阈值、删除 Oracle、扩大权限、增加预算或无限重试都可能制造假绿。" },
      ...agentDeepBlocks(spec.id),
      { title: "迁移到自己的项目", body: ["先替换脱敏输入、系统版本、风险切片和 owner，再重新设定场景化阈值；不要把 fixture 结果外推为 production。", spec.expected], bullets: ["保留可审计 manifest、raw evidence 和版本 hash", "为新场景补充人工 owner、回滚和失败动作", "真实模型/集成/从业者/学习者证据单独运行"] },
    ],
    practice: [`运行 ${spec.id} 的 0/1/0 fixture 并解释 failed_oracle_ids`, "检查 Prompt/Input/Schema/Eval/Mutation 版本闭包", `将 ${spec.artifact} 迁移到一个低权限、可回滚的合成业务对象`],
    completion: ["术语、架构边界和独立 Oracle 能复述", "baseline/fault/repair 证据可重放且退出码精确", "知道 fixture-tested、NOT_RUN、BLOCKED 和 production 的差异"],
    // User-input adjudication is tracked in the package source ledger. The
    // learner-facing source list contains registered, directly openable
    // references; internal adjudication IDs must not masquerade as URLs.
    sourceIds: spec.sourceIds,
    evidenceBoundary: "本页新增证据仅为标准库确定性离线 fixture；真实模型、真实 Agent、MCP/浏览器/队列/交易后端、从业者评审、学习者迁移和线上效果均 NOT_RUN。",
    architecture: {
      title: `${spec.id} 专业测试架构图`,
      caption: `${spec.nodes.join(" → ")}；用于定位风险、证据、门禁和责任边界，不代表真实模型、企业集成或生产效果已经验证。`,
      nodes: spec.nodes,
      visual: {
        src: `${WORKDIR}/visuals/${spec.id}.svg`,
        alt: `${spec.title}的专业 Agent 测试架构图，展示风险输入、证据路径、失败分支、停止门禁和责任边界。`,
        kind: "architecture",
      },
    },
    materials: [
      { title: `${spec.id} 确定性 Runner`, description: "标准库离线执行 baseline/fault/repair，输出 0/1/0 receipt。", href: `${WORKDIR}/scripts/agent_architecture_lab.py`, kind: "script", validation: "fixture-tested" },
      { title: `${spec.id} 执行 Manifest`, description: "固定工作目录、命令、报告和预期退出码。", href: manifestPath, kind: "config", validation: "fixture-tested" },
      { title: `${spec.id} Prompt 包`, description: "绑定输入、Schema、Eval、Mutation 与 NOT_RUN 模型策略。", href: `${promptBase}/manifest.json`, kind: "config", validation: "static-reviewed" },
      { title: `${spec.id} Fixture 报告`, description: "独立 Oracle 的 baseline/fault/repair 收据，不是生产证明。", href: `${WORKDIR}/${reportDir}/cycle-summary.json`, kind: "evidence", validation: "fixture-tested" },
      { title: `${spec.id} 专业架构图（SVG）`, description: "页面直接展示的完整架构图，包含主路径、失败路径、停止状态、证据环和责任边界。", href: `${WORKDIR}/visuals/${spec.id}.svg`, kind: "guide", validation: "static-reviewed" },
      { title: `${spec.id} 架构图源文件（Mermaid）`, description: "可复制修改的图源；迁移时必须保留节点语义、失败分支、来源和 NOT_RUN 边界。", href: `${WORKDIR}/visuals/${spec.id}.mmd`, kind: "guide", validation: "static-reviewed" },
      { title: "Agent 架构 11 页完整包", description: "D0–D7、四证据环、Metric Card 和高风险适配器。", href: "materials/agent-architecture-system.zip", kind: "archive", validation: "fixture-tested" },
      ...agentDeepMaterials(spec.id),
    ],
  };
};

export const agentArchitectureSystemPages = specs.map(makePage);
