import type { TutorialPage } from "../course.ts";
import { promptBody } from "../prompt-bodies.ts";
import { composeDeepPage } from "./deep-layer.ts";
import { agentArchitectureSupplement } from "./agent-architecture-supplement.ts";
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

const sourceArchitectureVisual = (pageId: string) => {
  if (pageId === "TD-AG-00") return { src: `${WORKDIR}/visuals/AG-DIM-ARCHITECTURE.svg`, alt: "D0-D7、四证据环、运行时护栏、决策与失败回灌组成的 Agent 测试总架构图。", kind: "architecture" as const };
  if (pageId === "TD-AG-09") return { src: `${WORKDIR}/visuals/AG-DIM-FOUR-RINGS.svg`, alt: "离线 fixture、受控沙箱、影子灰度和在线持续评估的四证据环；课程当前只执行第一环。", kind: "architecture" as const };
  return null;
};

const specs: AgentArchitectureSpec[] = [
  {
    id: "TD-AG-00", moduleId: "TD-M12", title: "Agent 测试架构总览：D0–D7 与四证据环", type: "概念", prerequisites: ["TD-F04", "TD-T01"],
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
    id: "TD-AG-01", moduleId: "TD-M12", title: "D0 评估可信度：Judge 校准", type: "跟做", prerequisites: ["TD-AG-00", "TD-T03", "TD-T14"],
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
    id: "TD-AG-02", moduleId: "TD-M12", title: "D1 轨迹 Span 归因", type: "跟做", prerequisites: ["TD-AG-00", "TD-T15", "TD-T16"],
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
    id: "TD-AG-03", moduleId: "TD-M12", title: "D2 编排：交接、隔离、级联与熔断", type: "跟做", prerequisites: ["TD-AG-02", "TD-W01", "TD-W02"],
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
    id: "TD-AG-09", moduleId: "TD-M12", title: "四证据环与三段门禁", type: "项目", prerequisites: ["TD-AG-05", "TD-AG-06", "TD-AG-08", "TD-T20", "TD-X805"],
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

const wave4Expansion: Record<string, string[]> = {
  "TD-AG-01": [
    "D0 专属 fixture：准备 12 条客服答复，四条只交换候选顺序，四条加入冗余礼貌话术，四条故意引用过期退款政策；金标由两名人工按事实、依据、完整性逐项标注。Oracle 先检查顺序不应改变事实判断，再检查过期政策必须变红，记录 gold_ref、rubric_version、Judge 版本和分歧位置。",
    "红灯与修复：若 Judge 对顺序交换给出不同胜负，先冻结自动评分并输出 position_bias；若流畅但事实错误被判高分，补充政策有效期与证据支持字段。修复只能改 rubric、采样和校准集，不能改 expected 或删除争议样本；重跑后保留 baseline/fault/repair 三份卡片。",
    "四环决策：离线环只证明 Judge fixture 能发现已知偏差，沙箱环需要真实标注流程和权限，影子环需要真实候选分布，在线环还需要抽检与回滚。当前后三环 NOT_RUN，不能把 κ、Spearman 或位置一致率写成线上质量保证；每一环都要具名 owner、停用条件和回退版本。",
    "迁移任务：换到 RAG 或 Agent 评测时，保留顺序盲化、长度探针和事实 blocker，但重建 domain gold、风险切片、人工培训和样本量。评审者应能从一条分歧回到原文、标注理由和 Judge prompt；缺任何链路就写 UNKNOWN，不能让 Judge 自评通过。",
    "小白交付：复制 Judge Card、gold_set、bias_probe、disagreement_matrix 四个工件，先回答“谁标、标什么、何时停、谁接管”。一个可复用结果必须包含失败收据、版本 hash、复评日期和适用范围；课程 fixture 只证明检测力，provider/model/integration/practitioner/learner/live/production/publication 均 NOT_RUN。",
  ],
  "TD-AG-02": [
    "D1 专属 fixture：构造查询政策、读取订单、调用 refund_order、转人工四类 span；最终文本保持正确，但在第三步偷偷调用写工具。step Oracle 检查工具名、参数、权限和副作用，trajectory Oracle 检查首错位置、后续恢复与循环，outcome Oracle 只作为终态参考，三层结果必须分开记录。",
    "注入与修复：分别注入错误参数、过期观测、重复调用和无限重试。第一条非法 span 必须触发红灯，修复优先恢复 allowlist、状态快照和幂等键，再重放同一输入；不能因为最后转人工就把越权写操作标成安全。报告保留 span_id、trace_hash、failed_oracle_ids 和 stop_reason。",
    "四环决策：离线环可用固定轨迹验证 span 标签，沙箱环验证真实工具副作用隔离，影子环观察真实策略分布，在线环才讨论持续首错率。后续环当前 NOT_RUN；任何“最终答案正确”都不能跳过 D1 过程门禁，owner 必须明确谁批准继续、谁拥有回滚。",
    "迁移任务：换到浏览器、MCP 或异步 Worker 时，重写安全路径集合和不可接受副作用，不复制 refund_order 的阈值。学习者要交 trajectory-ledger、首错归因和修复后重放命令，让同伴只看原始 trace 复算首错；无法定位时保持 UNKNOWN。",
    "小白交付：先问测什么（outcome/step/trajectory）、谁判断（独立 Oracle）、哪里停（副作用或循环）、交给谁（工具 owner/人工 owner）。fixture 仅证明轨迹门禁逻辑，真实模型、integration、practitioner、learner、live、production、publication 均 NOT_RUN。",
  ],
  "TD-AG-03": [
    "D2 专属 fixture：研究 Agent 将身份、政策版本和任务预算交给执行 Agent，再由执行 Agent 调工具。故意删除一个必传字段、污染一条上下文、让下游超时并重复 handoff；Oracle 同时检查 schema 完整性、最小可见权限、信息保真和三重预算熔断，最终答复不能掩盖交接错误。",
    "红灯与修复：缺少身份版本先在 handoff 层变红，越权字段在隔离层变红，重复副作用在幂等账本变红，超时循环在步数/时间/成本任一预算变红。修复顺序是补 schema、checkpoint、scope 和 circuit breaker，再用原 mutation 重放；增加 retry 次数不是修复。",
    "四环决策：离线环验证合同与故障注入，沙箱环验证真实子 Agent 隔离，影子环观察多跳信息衰减，在线环才观察租户和业务风险。未运行的环必须写 NOT_RUN，不能用离线 handoff 结果批准生产委托；每个交接边都要登记 owner 和 rollback。",
    "迁移任务：将示例改成代码审查或报销流程时，重新填写必传字段、敏感字段、权限 scope、失败成本和人工升级条件。交付 handoff-contract、context-diff、cascade report 与 stop receipt；若无法证明字段来源或下游状态，结论保持 UNKNOWN 并阻断发布。",
    "小白交付：画出 A→B 的字段、权限、失败出口和谁能停止；再运行 baseline/fault/repair，检查信息是否保真、是否隔离、是否有唯一终态。课程 runner 只覆盖 fixture，provider/model/integration/practitioner/learner/live/production/publication 均 NOT_RUN。",
  ],
  "TD-AG-04": [
    "D3 专属 fixture：退款 Agent 在授权前后各执行一次写动作，分别注入用户中断、人工接管、修改金额后交回和恢复旧计划。Oracle 检查中断响应步数、脏状态清理、回滚、接管上下文与新 owner；出现确认按钮不等于控制权有效，必须验证人工可以拒绝。",
    "红灯与修复：授权前仍产生副作用、接管后看不到人工修改、恢复时继续旧计划或取消后残留脏状态，任一即红。修复需把授权移到工具边界、写入状态版本、清理临时对象并建立回滚；不能靠增加弹窗或解释文本换绿，重放保存状态快照。",
    "四环决策：离线环检查状态机，沙箱环检查真实中断和回滚，影子环测确认疲劳与人工响应分布，在线环才评估高风险业务的持续接管率。后三环未运行必须 NOT_RUN；人工 owner、回滚 owner 和停止按钮不能由模型自我声明。",
    "迁移任务：迁移到发布、支付或数据删除流程时，重填高危动作、授权人、可逆窗口、通知和审计字段。输出 human-control-checklist 与 takeover trace，让另一人按 request_id 验证副作用和最终 owner；证据缺失时标 BLOCKED。",
    "小白交付：回答“我能否马上停、停后谁接手、旧计划是否失效、如何证明没写脏数据”。fixture 只验证控制合同，不代表真实用户行为、模型、集成、practitioner、learner、live、production、publication。",
  ],
  "TD-AG-05": [
    "D4 专属 fixture：四个任务各重复五次，分别产生至少一次成功与每次成功的差异，再按短、中、长 horizon 注入循环。Oracle 按 task 聚合 pass@k 与 pass^k，核对状态重置、失败位置和成本，不允许把 run 数直接当独立样本或删掉失败尝试。",
    "红灯与修复：pass@5 很高但 pass^5 很低时，稳定性门禁必须红；长时程任务在第三级出现循环时，horizon gate 先停而不是提高预算。修复可调整幂等、计划上限和降级路径，重放必须保留原始失败；修改统计公式求绿属于违规。",
    "四环决策：离线环只证明重复运行计算正确，沙箱环需验证真实状态清理，影子环需观察工作负载分布，在线环才可讨论可靠性 SLO。后三环 NOT_RUN；Metric Card 必须声明 task/run 分母、k、区间方法、owner 和回退版本。",
    "迁移任务：换成 RAG 或 Agent 任务时重建 task slice、状态 reset、风险成本和 horizon 桶，不复制退款数字。交付 raw runs、clustered interval、horizon curve 与 decision card；样本不足或缺失字段时保持 EVIDENCE-INSUFFICIENT。",
    "小白交付：能解释“至少成功一次”和“每次成功”分别支持什么决定，并指出不能证明生产稳定。fixture 只证明度量与故障检测，真实模型/provider/integration/practitioner/learner/live/production/publication 均 NOT_RUN。",
  ],
  "TD-AG-06": [
    "D5 专属 fixture：不可信文档要求导出全量订单，MCP manifest 在运行中被替换，记忆里残留另一租户授权。Oracle 在输入、manifest、memory、delegate、tool scope 和副作用六层检查直接/间接注入、跨租户读取、秘密泄露与写操作；模型说拒绝不等于工具层阻断。",
    "红灯与修复：任一攻击到达跨租户数据或不可逆工具即红，记录 manifest_hash、tenant、scope、阻断层和爆炸半径。修复恢复签名 manifest、短时凭证、最小权限、额度和 Kill Switch，再运行同一攻击集；不能删除恶意样本或只改提示词。",
    "四环决策：离线环验证攻击套件和策略 Oracle，沙箱环验证真实权限与回滚，影子环测真实攻击暴露量，在线环才可讨论持续 ASR。后三环保持 NOT_RUN；安全 owner 必须单独批准风险接受，任何模型自评不能签 waiver。",
    "迁移任务：换到浏览器、代码仓库或飞书 MCP 时，重填信任边界、租户、秘密类型、工具 manifest、生效时间和人工升级。交付 security-suite、阻断 trace、修复重放与残余未知项；缺少真实权限证据就禁止外推。",
    "小白交付：先问输入是否可信、工具是否可变、记忆是否隔离、谁拥有 Kill Switch、哪里记录副作用。课程 fixture 仅证明已知攻击能被阻断，真实模型、integration、practitioner、learner、live、production、publication 均 NOT_RUN。",
  ],
  "TD-AG-07": [
    "D6 专属 fixture：把客服查询拆成 task→step→tool，混入短问答、长上下文和写操作；逐级提高 open-loop 到达率并注入重试循环。Oracle 同时核对 queue、TTFT、TPOT、P95/P99、goodput、Token、成本尾部和四类硬预算，不能用平均 QPS 覆盖高危长尾。",
    "红灯与修复：P99 超预算、goodput 下降、单位成功成本上升或副作用预算越界，任一即红。修复先限制 retry、恢复幂等、设置 deadline、按风险降级，再重跑同 workload hash；提高时间或金钱预算不应成为默认修复，所有失败尝试仍进成本分母。",
    "四环决策：离线环检查账本守恒，沙箱环验证真实资源和预算截断，影子环观察流量人口，在线环才可讨论容量与成本策略。后三环 NOT_RUN；Metric Card 必须带价格时间、模型版本、workload、owner 和停止动作。",
    "迁移任务：迁移到真实服务时重新锁定 Token 分布、缓存、并发、价格、GPU/队列和质量门禁。交付 raw trace、cost card、budget receipt 与 goodput 分母审计；如果费用账单或质量判定缺失，结论保持 UNKNOWN。",
    "小白交付：能说明吞吐、成功吞吐、尾延迟和单位成功成本的区别，并指出哪个数字支持哪个决策。fixture 只证明经济性账本与截断逻辑，provider/model/integration/practitioner/learner/live/production/publication 均 NOT_RUN。",
  ],
  "TD-AG-08": [
    "D7 专属 fixture：同时变更模型版本、Prompt、工具清单和 Memory 快照，平均分上升但退款政策切片出现过期承诺。Oracle 检查四维 lineage、业务硬规则、审计链、风险 owner 和回滚目标；模型自评或总体分都不能抵消业务 blocker。",
    "红灯与修复：政策过期、审批缺失、审计字段断链或风险接受无具名 owner，任一即红。修复恢复 policy source、版本 manifest、人工基线、expiry 和 rollback，再重放高风险切片；不得改业务 Oracle 让平均分继续通过。",
    "四环决策：离线环验证规则和 lineage 闭合，沙箱环验证真实审批与回滚，影子环观察版本组合，在线环才讨论 ROI 与持续治理。后三环 NOT_RUN；风险接受必须记录范围、补偿控制、到期日和 owner。",
    "迁移任务：换到客服、内容或金融系统时重填业务规则、失败成本、法规来源、用户 delegation、工具动作和人工基线。交付 lineage card、risk-acceptance、audit sample 与回滚演练；缺 policy 证据就保持 INTERNAL-UNKNOWN。",
    "小白交付：从一条业务动作回链谁提出、哪个 Agent 决策、哪个工具执行、依据哪条规则、谁审批、如何撤销。课程 fixture 只证明治理链路可审计，真实模型/provider/integration/practitioner/learner/live/production/publication 均 NOT_RUN。",
  ],
  "TD-AG-09": [
    "四环 fixture：同一 Agent 风险先在离线 CI 运行 0/1/0，再进入受控沙箱验证副作用隔离；影子环和在线环只登记 entry/exit/hard-block/owner/rollback，不伪造真实流量。三段门禁分别检查硬政策、统计证据和具名风险接受，任何一段失败都停止升级。",
    "红灯与修复：离线通过但沙箱没有状态回滚、影子没有真实 population 或在线缺自动撤回，均标 EVIDENCE-INSUFFICIENT。修复补齐输入人口、版本 hash、统计方法、采样和回滚演练，再从失败环重跑；不能用上一环 receipt 代替下一环证据。",
    "案例决策：D5 跨租户写操作是硬 blocker，不能被平均成功率抵消；pass^k 区间不足是统计 blocker，不能被人工口头接受；风险接受只在明确 owner、范围和到期日后成立。学习者要把三类失败放在不同列，避免综合分掩盖红线。",
    "迁移任务：将四环计划改到自己的浏览器或飞书 Agent 时，替换 population、工具、回滚、采样、审批和 publication gate。交付 ring-plan、gate-receipt、未运行清单与下一环入口；没有真实集成、practitioner 或 live 证据时继续 NOT_RUN。",
    "小白交付：能解释“离线通过能证明什么、不能证明什么”，并说清下一环需要谁、哪份输入和何种停止条件。课程 fixture 只证明升级合同和三段门禁结构，真实模型/provider/integration/practitioner/learner/live/production/publication 均 NOT_RUN。",
  ],
  "TD-AG-10": [
    "高风险适配器 fixture：金融 Agent 读取行情、生成建议、请求下单，故意把过期时间戳、建议文本和执行工具混在一起。Oracle 分开检查数据 freshness、建议/执行边界、仓位硬限额、双人审批、幂等键和回滚；任何过期行情或越权下单都必须在执行前变红。",
    "红灯与修复：时间戳超过有效窗口、建议缺依据、订单超过额度、审批人与执行人相同或重试产生重复订单，任一即红。修复恢复时间窗、硬限额、双人授权、幂等状态查询和 kill switch，再重放同一市场快照；不能用“模型很谨慎”的语言替代策略控制。",
    "四环决策：离线环只用合成行情验证 adapter，沙箱环验证模拟账户和回滚，影子环观察真实报价但不下单，在线环才可能讨论受控额度。后三环当前 NOT_RUN；publication 也不能把 fixture receipt 写成交易合规或收益证明。",
    "迁移任务：换到保险理赔、采购或支付系统时，重填数据新鲜度、不可逆动作、额度、审批、法规来源、人工接管和回滚窗口。交付 high-risk adapter card、拒绝样例、审计 trace 与 expiry；没有业务 owner 和监管/组织 policy 就保持 BLOCKED。",
    "小白交付：先画“数据→建议→审批→执行→撤销”五段，给每段指定 Oracle、停止权和证据。课程 fixture 只证明高风险 adapter 的边界与门禁，真实模型/provider/integration/practitioner/learner/live/production/publication 均 NOT_RUN。",
  ],
};

const wave5AgentExpansion: Record<string, string[]> = {
  "TD-AG-02": [
    "worked decision：把一次最终答复正确的轨迹拆成 outcome、step、trajectory 三层。fixture 让 Agent 先读政策、再查订单、最后误调用 refund_order；step Oracle 必须在写工具 span 变红，trajectory Oracle 记录首错、后续重试和副作用，outcome 只说明用户看到什么，三者不允许合并成一个总分。",
    "故障诊断：先检查 trace 是否包含 span_id、tool_name、参数、权限、观测快照、状态版本和 request_id；缺字段不能默认为安全。按首错顺序排查错误参数、过期观测、权限越界、重复调用和循环，修复只改一个变量，重放相同输入并保留 failed_oracle_ids 与 stop_reason，避免用终态文本掩盖过程风险。",
    "D1 迁移工件：交付 trajectory-ledger.jsonl、span-oracle.yaml、first-error-report.md、mutation-replay.json 和 owner-handoff.md。每个工具调用都要声明允许副作用、幂等键、取消动作与回滚 owner；换到浏览器、MCP、异步 Worker 时重建安全路径集合，不复制 refund_order 的结论或阈值。",
    "四环决策：离线环验证固定轨迹，沙箱环验证真实工具隔离，影子环观察真实步骤分布，在线环才讨论持续首错率。未运行环必须写 NOT_RUN；模型、provider、integration、practitioner、learner、live、production、publication 不能继承离线 receipt。硬副作用红线优先于 outcome 成功率。",
    "小白复盘：回答“哪一步错、谁能证明、哪里停止、失败交给谁”。同伴只看原始 trace 复算首错，若无法定位就输出 UNKNOWN/BLOCKED；不得通过删掉 span、扩大 allowlist、增加重试或修改 expected 让 cycle 变绿。",
  ],
  "TD-AG-05": [
    "worked decision：四个任务各运行五次，分别演示 pass@5 高但 pass^5 低，以及短任务通过、长 horizon 循环。Oracle 按 task 聚合而非按 run 直接平均，明确状态重置、k、失败位置、成本与风险切片；重复运行成功一次不能替代连续每次成功的可靠性决定。",
    "故障诊断：先查任务是否独立、fixture 是否重置、重试是否计入成本、失败是否被过滤，再查区间方法和 horizon 桶。若 pass@k 与 pass^k 方向冲突，保持 EVIDENCE-INSUFFICIENT 并补 clustered interval；不能改分母、删除失败 run 或提升预算来消除红灯。",
    "D4 迁移工件：交付 reliability-metric-card.json、raw-runs.jsonl、horizon-curve.csv、clustered-interval.md 和 rollback-decision.md。换到 RAG、Agent 规划或工具链时重建 task population、状态 reset、失败成本与最长轨迹，明确哪些指标支持扩容、回退或人工升级。",
    "四环决策：离线环证明计算和已知 mutation，沙箱环验证状态清理，影子环验证真实 workload 分布，在线环才可能讨论可靠性 SLO。后三环未运行，所有 production、live、practitioner、learner、provider/model、integration、publication 结论均 NOT_RUN。",
    "小白复盘：用一句话区分“至少一次成功”和“每次都成功”，再写一个导致 horizon 衰减的故障和一个可回滚修复。若只能报一个百分比，补齐分母、k、样本量、时间窗、owner 与 stop action 后再决策。",
  ],
  "TD-AG-07": [
    "worked decision：把一次客服任务展开成 task→step→tool，混入短问答、长上下文和高风险写操作；固定 workload hash 后逐级增加 open-loop 到达率。Oracle 同时消费 planned/completed/failed/dropped/queued、TTFT、TPOT、P95/P99、goodput、Token、成本尾部和预算截断，平均 QPS 不能覆盖失败质量。",
    "故障诊断：先验证到达守恒，再区分排队、模型生成、工具等待、重试放大和资源尾部。P99 超限、goodput 下降、单位成功成本上升或副作用预算越界任一变红；修复按 deadline、幂等、retry 上限、风险降级顺序执行，不可只提高 timeout 或金钱预算。",
    "D6 迁移工件：交付 workload-manifest.json、task-step-tool-trace.jsonl、cost-card.md、budget-receipt.json 和 capacity-decision.md。重填 Token 分布、缓存命中、并发、价格时间、模型版本、质量门禁和 owner；账单或质量字段缺失时，cost_per_success 与 goodput 保持 UNKNOWN。",
    "四环决策：离线环验证账本和预算逻辑，沙箱环验证资源隔离，影子环观察真实人口，在线环才可讨论容量策略。未运行环不可写成生产 SLO；provider、model、integration、practitioner、learner、live、production、publication 均 NOT_RUN，失败收据仍需保留。",
    "小白复盘：解释裸吞吐、质量约束 goodput、P95/P99 与单位成功成本分别回答什么问题；让同伴从 raw trace 重算一个切片。任何分母对不上、失败被删除或长尾被均值隐藏，结论降级为 BLOCKED。",
  ],
  "TD-AG-08": [
    "worked decision：同时变更模型、Prompt、工具清单与 Memory 快照，平均分上升但退款切片引用过期政策。D7 Oracle 先检查四维 lineage，再检查业务硬规则、审计链、风险 owner、补偿控制和 rollback；总体分不得抵消政策 blocker，模型也不能批准自己的 waiver。",
    "故障诊断：逐条回链 user、Agent、tool、evidence、policy version、审批人和时间戳；缺一项即审计断链。若规则过期、owner 缺失、expiry 缺失或风险接受范围过宽，修复补 source_ref、版本、人工 baseline、到期日与回滚目标，再重放高风险 slice。",
    "D7 迁移工件：交付 lineage-card.json、business-rule-ledger.md、risk-acceptance.json、audit-sample.jsonl 和 rollback-rehearsal.md。换到客服、内容或金融业务时重建失败成本、法规来源、人工基线与 delegation；没有组织 policy 就保持 INTERNAL-UNKNOWN，不复制示例批准。",
    "四环决策：离线环验证规则和版本闭合，沙箱环验证审批与回滚，影子环观察版本组合，在线环才讨论 ROI。后三环未运行，live/production/practitioner/learner/provider/model/integration/publication 均 NOT_RUN；风险接受必须有具名 owner、范围、补偿控制和到期日。",
    "小白复盘：从一条业务动作回答谁提出、谁决策、谁执行、依据哪条规则、谁批准、如何撤销；只要其中一项依赖猜测就写 UNKNOWN。不要用平均质量、节省工时或模型解释替代治理证据。",
  ],
  "TD-AG-09": [
    "worked decision：同一高风险 Agent 依次进入 offline CI、sandbox、shadow、online 四环，但只为已运行环生成证据。三段门禁分开记录硬政策 blocker、统计证据不足和具名风险接受；上一环的 PASS 不能替下一环填补真实 population、回滚和 owner 缺口。",
    "故障诊断：若离线通过而沙箱无法清理状态，红点归 sandbox；若影子没有真实流量样本，红点归 evidence-insufficient；若在线无自动撤回，红点归 release hard-block。修复必须补对应环的输入、trace、统计方法或回滚演练，不能复制旧 receipt 或调整阈值求绿。",
    "四环迁移工件：交付 ring-plan.json、gate-receipts.jsonl、population-manifest.md、rollback-matrix.md 和 not-run-register.md。换到浏览器、飞书或交易 Agent 时重填工具、风险切片、采样、审批、回滚和 publication gate，保持环间边界清晰。",
    "小白复盘：说清离线能证明什么、不能证明什么；下一环需要谁、哪份输入、哪种停止条件。任何 provider/model/integration/practitioner/learner/live/production/publication 未运行，页面必须显式 NOT_RUN；硬红线不能被综合分抵消。",
    "决策练习：构造一个硬安全失败、一个统计区间不足、一个风险接受过期的案例，分别给出 BLOCKED、EVIDENCE-INSUFFICIENT、EXPIRED 三种状态和下一动作。这样学习者能把成熟度门变成可执行发布合同，而不是流程装饰。",
  ],
  "TD-AG-10": [
    "worked decision：金融 Agent 读取带时间戳行情，生成建议，经双人批准后才可下单；fixture 注入过期行情、建议与执行混淆、超额度、审批人与执行人相同和重复提交。Oracle 分开检查 freshness、evidence、hard limit、dual approval、idempotency 与 rollback，任何越权在执行前红灯。",
    "故障诊断：先查报价时间窗和来源，再查建议/执行 API 是否隔离，随后核对仓位额度、审批人、幂等状态和 kill switch。修复只补一个控制并重放同一 market snapshot；不能用模型谨慎措辞、提高限额或删除订单失败来换绿，审计 trace 必须保留。",
    "高风险适配器工件：交付 high-risk-adapter.yaml、freshness-card.json、approval-ledger.jsonl、execution-blocker.md 和 rollback-drill.md。迁移到支付、采购或理赔时重填不可逆动作、额度、法规 source_ref、人工接管和回滚窗口；缺业务 owner 或 policy 时保持 BLOCKED。",
    "四环决策：离线环只验证合成行情和策略门禁，沙箱环验证模拟账户，影子环观察真实报价但禁止下单，在线环才可能讨论受控额度。后三环未运行，生产交易、收益、合规、live、practitioner、learner、provider/model、integration、publication 均 NOT_RUN。",
    "小白复盘：画出数据→建议→审批→执行→撤销五段，逐段写独立 Oracle、停止权、证据和 owner。若建议文本能绕过审批直达工具，立即标红；若撤销窗口不明，保持 UNKNOWN，不得把 fixture 结果写成真实金融保证。",
  ],
};

const wave6AgentOverview: Record<string, string[]> = {
  "TD-AG-00": [
    "AG00 专属总览决策：先把 Agent 拆成输入、模型、状态、工具、Worker、Judge、人工和业务结果八类节点，再为每个节点登记 D0–D7 风险。D0 问评估器是否可信，D1 问单步和轨迹是否安全，D2 问交接是否隔离，D3 问人能否中断，D4 问重复运行是否稳定，D5 问攻击是否被硬控制阻断，D6 问预算是否守恒，D7 问业务责任是否可追溯。",
    "架构图工作法：每条箭头都标注输入格式、状态持有者、信任边界、可逆性和失败出口；没有箭头 owner 的节点不算完成。将最终文本与副作用分开画，避免把“回答正确”误认为“写操作安全”。",
    "D0 到 D7 不是八个孤立章节：一个过期 Judge 会污染 D4 的可靠性趋势，一个 D2 handoff 泄漏会升级为 D5 租户风险，一个 D6 无限重试会制造 D3 人工接管疲劳。学习者必须在图上画出至少两条跨维度级联边，并为每条边指定首个 Oracle。",
    "四环决策：离线环只验证确定性 fixture 和架构字段，沙箱环验证真实工具隔离与回滚，影子环验证真实人口分布，在线环才讨论持续 SLO。任何环没有 entry、exit、hard blocker、owner、rollback 和 not-run reason，都只能标 EVIDENCE-INSUFFICIENT。",
    "总览工件：交付 agent-boundary-map.svg、d0-d7-risk-ledger.json、four-ring-entry-exit.md、owner-escalation.csv 和 unknown-register.md。迁移到代码、客服或金融 Agent 时只复用字段，不复用风险结论、阈值或 receipt。",
    "故障诊断：若图上所有风险都连接到模型输出，先检查是否遗漏工具参数、状态快照、权限、队列和人工决定；若四环都显示 PASS，检查是否把 fixture-only 写成 live。修复是补节点和边，再重跑最小 mutation，不是增加页面或综合分。",
    "小白复盘：用四句话解释测什么、谁判断、哪里停、下一份证据交给谁；再指出哪些结论只属于离线环。回答不了时写 UNKNOWN，并将下一步交给架构 owner、工具 owner 或业务 owner，而不是让模型自行批准。",
    "架构评审演练：从客服 Agent 的一次退款请求开始，先在系统边界标出用户身份、会话状态、检索索引、模型推理、工具授权、队列 Worker、Judge 和业务账本；随后沿每条边写数据格式、权限、超时、幂等键与回滚。若输出文本正确但工具账本出现第二次退款，D1 结果和 D5 副作用门禁必须同时变红，D0 的 Judge 分不能抵消它。",
    "总览验收不是背诵八个域，而是提交一张可复核的 cross-domain decision sheet：每个 D0–D7 域至少连接一个风险、一个观察点、一个独立 Oracle、一个 mutation、一个 stop state 和一个 owner。缺少真实工具、企业身份或线上人口时，相应节点保留 NOT_RUN；不得用离线 fixture 的箭头替代沙箱、影子或在线环证据。",
  ],
  "TD-AG-05": [
    "D4 可靠性加深练习：准备四个风险不同的任务，每个任务在完整状态重置后运行五次，逐次保存 trajectory_id、seed/temperature、工具响应 hash、最终状态、首错位置、步数、耗时与成本。先从 raw ledger 计算单次成功率，再分别计算 pass@5 与 pass^5；两者分母和支持的发布决定必须写在 Metric Card 上，不能只呈现较好看的数值。",
    "长时程曲线不能用一个平均成功率代替。将任务按短、中、长 horizon 分桶，记录在何处进入循环、预算耗尽、状态污染或错误恢复；对仍运行的任务保留删失状态，并把最大步骤、时间、Token、费用和人工接管条件写成 autonomy envelope。若长任务样本太少，结论为 EVIDENCE-INSUFFICIENT，而不是沿用短任务通过率。",
    "可靠性故障修复必须保持任务、状态重置与 Oracle 不变。幂等缺陷用唯一 effect ledger 验证，循环缺陷用 stop_reason 与 checkpoint 验证，恢复缺陷用故障前后状态 diff 验证；repair 后重新运行同一风险切片，并在 decision card 说明哪些回归只属于 deterministic fixture。真实 provider/model、工具集成、影子人口和生产 SLO 仍分别 NOT_RUN。",
  ],
  "TD-AG-03": [
    "AG03 D2 handoff 决策：研究 Agent 只能交出经过签名的身份、政策版本、任务目标和预算；执行 Agent 只能看到完成任务所需的最小字段。任何额外记忆、未经验证的客户身份或旧政策都必须在 handoff Oracle 变红。",
    "交接故障诊断：先按 schema、来源、权限、版本、幂等键和 stop_reason 六列检查；缺字段不是空值，而是 UNKNOWN/BLOCKED。再注入乱序消息、重复 handoff、空结果、超时和错误 recipient，确认 D2 的首错位置而非只看最终业务文本。",
    "三重预算决策：每次交接同时拥有 step、time、cost 上限；下游超时不能让上游无限重试。repair 依次补 checkpoint、幂等 receipt、隔离 scope 和 circuit breaker，并使用同一 handoff_id 重放，保留级联失败证据。",
    "跨维度影响：handoff 泄漏会成为 D5 租户越权，错误恢复会成为 D4 重复副作用，预算耗尽会触发 D3 人工接管。报告必须把首个 D2 错误与后续影响分开，不能把所有失败归因给模型“不会做”。",
    "迁移工件：handoff-contract.json、context-diff.jsonl、cascade-budget-card.md、owner-escalation.md 和 rollback-checklist.md 必须随系统版本、工具权限和业务错误成本重新生成。换到浏览器、MCP 或飞书时重建字段，不复制退款示例。",
    "小白复盘：能说清 A 交给 B 什么、B 不该看到什么、谁可以停止、重复执行如何证明只发生一次。课程 fixture 只证明交接合同和熔断逻辑，真实模型、integration、practitioner、learner、live、production、publication 仍 NOT_RUN。",
  ],
};

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
      ...(wave4Expansion[spec.id] ? [{ title: `${spec.id} 专属 D0-D7 / 四环案例`, body: wave4Expansion[spec.id] }] : []),
      ...(wave5AgentExpansion[spec.id] ? [{ title: `${spec.id} Wave5 worked decision 与迁移`, body: wave5AgentExpansion[spec.id] }] : []),
      ...(wave6AgentOverview[spec.id] ? [{ title: `${spec.id} Wave6 架构专属决策`, body: wave6AgentOverview[spec.id] }] : []),
      { title: `${spec.id} 专属案例推演与迁移`, body: [
        `${spec.id} 的练习从这个具体故障开始：${spec.problem}。先把它写成 Evidence（输入、trace、状态快照和版本），再写 Inference（为什么只能定位到 ${spec.title} 的风险），最后列出 Unknown（哪些真实条件没有运行）。`,
        `对 ${spec.id}，学员必须在 ${spec.nodes.join("、")} 中选出首个可观察断点，明确由谁拥有 Oracle、谁拥有停止权，以及故障从哪里开始影响用户或业务；只看最终文本不能替代过程证据。`,
        `职业实验要求先预测 ${spec.id} 的 fault：${spec.failure}；再运行同一个 fixture 的 baseline、fault、repair，保留 failed_oracle_ids、退出码、输入 hash 和 reviewer，而不是修改 expected 或删掉失败样本。`,
        `迁移 ${spec.id} 时，保留“${spec.title}”的风险主线，但必须替换数据、权限、工具、业务错误成本、owner、回滚和适用范围。新系统中的模型、集成、从业者复核、学习者迁移、live 与 production 证据不能继承本页 receipt。`,
        `完成标准是能用小白语言回答四问：测什么、谁判断、哪里停、下一份证据交给谁；答不出时写 UNKNOWN，并把 ${spec.repair} 拆成下一条可执行任务。`,
      ] },
      { title: "按证据顺序执行", body: [spec.scenario], bullets: spec.workflow, technical: { kind: "diagram", content: spec.nodes.join(" → "), verification: `逐项核对 ${spec.nodes.join("、")} 的输入、观察点、Oracle、owner 和 stop state。` } },
      { title: "Metric Card 与独立 Oracle", body: [spec.metric, "Prompt 只能整理候选证据，不能制定业务规则、批准 waiver 或替代人工 owner。"], technical: { kind: "prompt", content: promptBody(`${promptBase}/task.md`), version: "1.0.0", promptPath: `${promptBase}/task.md`, manifestPath: `${promptBase}/manifest.json`, inputFixturePath: `${promptBase}/input.json`, outputSchemaPath: `${promptBase}/schema.json`, evaluationPath: `${promptBase}/eval.json` }, expected: "输出必须保留 Evidence、Inference、Unknown 与证据边界。" },
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
      visual: sourceArchitectureVisual(spec.id) ?? {
        src: `${WORKDIR}/visuals/${spec.id}.svg`,
        alt: `${spec.title}的专业 Agent 测试架构图，展示风险输入、证据路径、失败分支、停止门禁和责任边界。`,
        kind: "architecture",
      },
    },
    materials: [
      ...(spec.id === "TD-AG-00" ? [
        { title: "来源专属 Agent 测试总架构图", description: "在选方法前定位系统、信任、副作用、证据与责任边界。", href: `${WORKDIR}/visuals/AG-DIM-ARCHITECTURE.svg`, kind: "guide" as const, validation: "static-reviewed" as const },
        { title: "Agent 来源视觉 Manifest", description: "总架构、四环、三段门禁与 36 维全景的来源定位、关系、alt 与哈希。", href: `${WORKDIR}/source-visual-manifest.json`, kind: "config" as const, validation: "static-reviewed" as const },
      ] : []),
      ...(spec.id === "TD-AG-09" ? [
        { title: "四证据环来源专图", description: "逐环声明 entry、exit、hard blocker、owner 和 rollback；环二至环四 NOT_RUN。", href: `${WORKDIR}/visuals/AG-DIM-FOUR-RINGS.svg`, kind: "guide" as const, validation: "static-reviewed" as const },
        { title: "三段式门禁来源专图", description: "硬政策、统计证据与具名风险接受不能互相抵消；阈值来自场景 Metric Card。", href: `${WORKDIR}/visuals/AG-DIM-GATE.svg`, kind: "guide" as const, validation: "static-reviewed" as const },
      ] : []),
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

export const agentArchitectureSystemPages = specs.map(makePage).map((page) => ({
  ...page,
  blocks: composeDeepPage(page.blocks, agentArchitectureSupplement(page.id)),
}));
