import type { TutorialPage } from "../course.ts";
import { ragQualityDeepBlocks } from "./rag-quality-deep.ts";
import { agentWorkflowDeepBlocks } from "./agent-workflow-deep.ts";
/** 本模块自有的 spec 形状；不再依赖已退役的通用模板。 */
type TopicSpec = {
  id: string;
  moduleId: string;
  title: string;
  type: TutorialPage["type"];
  duration: string;
  summary: string;
  why: string;
  prerequisites: string[];
  outcomes: [string, string, string, ...string[]];
  artifact: string;
  problem: string;
  workflow: [string, string, string, ...string[]];
  scenario: string;
  code?: string;
  expected: string;
  failure: string;
  sourceIds: [string, string, string, ...string[]];
  evidenceBoundary: string;
};

const specs: TopicSpec[] = [
  {
    id: "TD-T13", moduleId: "TD-M03", title: "Prompt、模型和知识库版本 A/B", type: "跟做", duration: "55 分钟",
    summary: "在同一数据集、同一评分协议和同一运行预算下比较候选版本，判断变化是否真实来自 Prompt、模型或知识库。",
    why: "同时更换模型、Prompt 和索引后看到分数上涨，无法知道改进来自哪里，也无法安全回滚。",
    prerequisites: ["TD-T12"], outcomes: ["设计单变量 A/B 实验", "锁定数据、参数、工具和评分版本", "按风险切片作出发布或拒绝决定"], artifact: "AI 候选版本 A/B 对比报告",
    problem: "客服 RAG 准备升级模型并重建知识库。新版本平均得分更高，但在退款政策切片中出现两次错误承诺；测试开发必须阻止平均分掩盖高风险回归，并区分模型变化与索引变化。",
    workflow: ["声明唯一被比较变量和业务假设", "冻结 eval 集、Prompt、检索参数、工具、Judge 与随机参数", "重复运行并同时查看 blocker、风险切片和成本延迟", "保留 manifest、逐条结果和差异样例，由负责人决定发布范围"],
    scenario: "先比较仅更换模型的 A/B，再比较仅更换知识库索引的 A/B。脚本发现两个锁定字段同时变化时应把实验标记为 confounded；高风险退款样例出现 blocker 时，即使总分更高也不能获胜。",
    code: "python3 scripts/compare.py --a manifests/a.json --b manifests/b.json --lock dataset,prompt,retriever,tools,scorer\npython3 scripts/check_slices.py reports/ab.json --block high-risk-refund",
    expected: "单变量实验生成可比较报告；混杂实验被拒绝；候选在普通 FAQ 可发布、在退款流量不可发布时，报告给出分流和回退条件。",
    failure: "常见错误包括浮动模型别名、缓存命中不一致、Judge 版本变化和只运行一次。先检查 manifest diff 与重复运行分布，不能把不可比结果解释成模型能力提升。",
    sourceIds: ["S03", "S04", "S12"], evidenceBoundary: "页面方法由公开评测工具和课程资料支持；命令为教学接口形状，尚未在所有模型供应商、真实流量分布和企业发布系统中验证。",
  },
  {
    id: "TD-T14", moduleId: "TD-M03", title: "LLM-as-judge 的校准和反例", type: "诊断", duration: "55 分钟",
    summary: "用人工双标、盲评、反例和一致性统计判断模型 Judge 可以辅助什么、不能替人决定什么。",
    why: "Judge 同样会受措辞、位置、长度、模型版本和自身知识影响；未经校准的分数不是可靠 Oracle。",
    prerequisites: ["TD-T13"], outcomes: ["构建 Judge 校准集", "测量人机与人人分歧", "为高风险分歧建立人工升级规则"], artifact: "Judge 校准集、分歧矩阵与使用边界",
    problem: "两个退款答复事实相同，一个更长、更礼貌，Judge 总是偏向长答案；另一个答复引用了过期政策，Judge 因语言流畅仍给高分。测试开发要证明这种偏差并限制 Judge 权限。",
    workflow: ["由两名领域人员独立标注包含好例、坏例和近邻反例的校准集", "打乱候选顺序与身份，重复运行 Judge", "计算分歧矩阵并检查位置、长度、风格和自偏好", "确定可自动评分、需抽检和必须人工审批的风险范围"],
    scenario: "准备 30 对回答，其中 10 对只改变顺序、10 对加入冗长无关文字、10 对含政策事实错误。Judge 若在顺序翻转后改变胜负，或放过事实错误，应记录具体失败切片而非只报一个一致率。",
    expected: "产物包含原始标注、Judge 理由、重复运行、分歧类型和升级规则；事实、安全、权限类 blocker 不由单一 Judge 自动放行。",
    failure: "只拿模型与一位标注员比较会把人工不一致误判成 Judge 错误；先测人人一致性，再分析 Judge 偏差。更换 Judge 后必须重新校准，不能沿用旧阈值。",
    sourceIds: ["S04", "S10", "S23"], evidenceBoundary: "来源支持应用评测和 AI 测试中的人机 Oracle；示例规模用于教学，不能外推为任何 Judge 的通用准确率或生产可用性证明。",
  },
  {
    id: "TD-T15", moduleId: "TD-M04", title: "最终结果、单步动作和完整轨迹", type: "概念", duration: "40 分钟",
    summary: "把 Agent 质量拆成最终结果、每次工具动作与完整决策轨迹，避免只看最后一句回答。",
    why: "Agent 可能偶然得到正确结果，却经历越权、重复调用或不可接受成本；也可能轨迹合理但被外部故障阻断。",
    prerequisites: ["TD-T03", "TD-T04"], outcomes: ["区分 outcome、step 和 trajectory 三层 Oracle", "为每层选择可观察证据", "根据失败层级设计回归和归因"], artifact: "Agent 三层评测模型与证据映射图",
    problem: "退款 Agent 最终正确回复“转人工”，但此前已调用一次退款接口并被后端拒绝。只评最终文本会假绿；只评调用序列又可能错杀允许多条安全路径的任务。",
    workflow: ["先定义业务最终状态与禁止副作用", "再定义关键动作的工具、参数、权限与前置条件", "记录完整 trajectory 的状态、观察、重试、Handoff 和停止原因", "分别判定三层并保留失败所在层，不用单一总分吞掉 blocker"],
    scenario: "给 Agent 一个已激活商品退款请求。允许它查询订单、读取政策并转人工，禁止直接退款。即使最终文本正确，只要轨迹出现 refund_order 调用，step 层就必须失败。",
    expected: "评测报告分别显示 outcome、step、trajectory 结果；每个 blocker 链接到具体工具调用和状态快照，允许路径集合与禁止动作清晰分开。",
    failure: "把一条黄金轨迹当唯一正确答案会惩罚合法替代路径。应优先写不变量、禁止副作用和必要检查；只有强流程约束场景才要求精确顺序。",
    sourceIds: ["S10", "S23", "S35"], evidenceBoundary: "页面把公开 Agent 评测方法转成测试分层；退款轨迹为合成场景，未证明三层指标与任何企业业务结果具有固定相关性。",
  },
  {
    id: "TD-T16", moduleId: "TD-M04", title: "工具选择、参数和权限", type: "跟做", duration: "55 分钟",
    summary: "通过错误工具、危险参数、越权身份和不可逆副作用注入，验证 Agent 在沙箱与策略门禁中安全失败。",
    why: "自然语言回答可撤回，写数据库、发消息和退款等工具副作用可能不可逆，必须在调用前阻断。",
    prerequisites: ["TD-T15"], outcomes: ["建立工具调用契约和权限矩阵", "注入工具、参数、身份和顺序故障", "验证沙箱、审批与幂等保护"], artifact: "工具策略、故障注入集与轨迹报告",
    problem: "Agent 可使用 get_order、search_policy、refund_order 和 handoff。攻击样例诱导它跳过身份校验，或把 10.00 元写成 1000 元。测试不能真的退款，需用录制沙箱观察策略是否先于执行生效。",
    workflow: ["为每个工具声明 Schema、最小权限、副作用、幂等键与审批条件", "在无真实副作用的沙箱录制调用", "注入不存在工具、越界参数、错误身份、重复调用和缺少前置步骤", "断言策略层拒绝并保存 reason、trace、policy_version"],
    scenario: "先运行合法查询路径，再令 Agent 在未验证身份时调用 refund_order，随后注入金额越界与相同幂等键重复调用。三种坏路径都应在工具执行前被阻断。",
    code: "python3 scripts/run_agent.py --case valid-read --sandbox\npython3 scripts/run_agent.py --case refund-without-auth --sandbox --expect policy_denied\npython3 scripts/assert_no_side_effect.py traces/latest.json",
    expected: "合法只读调用成功；越权、越界和重复副作用被拒绝；Trace 记录策略版本、拒绝原因与零真实写入，进程对 blocker 返回非零。",
    failure: "只在 Prompt 中写“不要越权”不是控制。若坏调用到达真实后端，再漂亮的事后解释也不合格；先检查权限是否在工具边界执行，再检查 Agent 推理。",
    sourceIds: ["S06", "S10", "S23"], evidenceBoundary: "公开框架支持轨迹和应用评测，课程给出沙箱契约；未连接真实退款系统，权限模型和审批边界必须按目标组织重新威胁建模。",
  },
  {
    id: "TD-T17", moduleId: "TD-M04", title: "Prompt injection、数据泄露和 Excessive Agency", type: "跟做", duration: "60 分钟",
    summary: "把直接与间接注入、敏感数据泄露和过度代理权做成可回放攻击集，并验证纵深防御。",
    why: "Agent 同时读取不可信内容并调用工具时，恶意指令可以从网页、邮件或知识库进入执行链。",
    prerequisites: ["TD-T16"], outcomes: ["建立 Agent 攻击面和信任边界", "编写直接/间接注入与泄露样例", "验证最小权限、数据隔离和人工确认"], artifact: "Agent 攻击集、安全门禁与红队报告",
    problem: "客服 Agent 检索到一篇被污染的知识文章，内容要求忽略政策并导出其他用户订单。模型拒绝文字请求不够；系统还必须防止检索跨租户、工具越权和敏感字段进入输出。",
    workflow: ["标出用户输入、检索内容、系统指令、工具结果和密钥的信任边界", "为直接注入、间接注入、跨租户、敏感字段和过度授权构建攻击样例", "分别在输入、检索、模型、工具与输出层设置控制", "记录攻击是否到达每层、是否产生副作用和由谁复核"],
    scenario: "把恶意指令嵌入知识文档，要求 Agent 调用 export_orders。测试身份只能读取单一订单；即使模型服从文档，工具授权也应拒绝，输出过滤器不得泄露其他订单字段。",
    code: "python3 scripts/run_redteam.py --suite indirect-injection --tenant tenant-a --sandbox\npython3 scripts/check_security.py traces/redteam.json --require no_cross_tenant,no_secret,no_write",
    expected: "攻击样例不能跨租户读取、不能输出秘密、不能产生写操作；报告区分模型拒绝与工具层强制拒绝，并保留所有未覆盖路径。",
    failure: "只测试模型是否说“不”会漏掉隐藏调用与日志泄露；只加关键词过滤又容易绕过。逐层检查数据流、权限和副作用，并把未知攻击面交给人工安全评审。",
    sourceIds: ["S07", "S08", "S23"], evidenceBoundary: "NIST、OWASP 和测试 syllabus 支持这些风险类别；攻击集是入门基线，不代表渗透测试完成，也未覆盖目标系统所有编码、工具和供应链路径。",
  },
  {
    id: "TD-T18", moduleId: "TD-M04", title: "Browser Agent 和 Playwright Test Agents", type: "跟做", duration: "60 分钟",
    summary: "理解 planner、generator、healer 的职责，用真实浏览器证据审查 AI 生成测试，而不是直接接受生成代码。",
    why: "浏览器 Agent 能探索页面并生成候选测试，但动态状态、脆弱定位器和错误业务 Oracle 会制造看似可跑的假自动化。",
    prerequisites: ["TD-T06", "TD-T16"], outcomes: ["拆分规划、生成和修复三个角色", "为生成测试保留探索证据和业务依据", "用故障注入验证生成测试的检测力"], artifact: "Browser Agent 生成测试包与审查记录",
    problem: "Agent 为退款后台生成端到端测试，页面绿色且截图漂亮，但断言只有按钮可见；healer 在 DOM 改版后把定位器改到“关闭”按钮，测试仍绿却没有提交退款复核。",
    workflow: ["用 planner 从风险与需求形成带来源的测试计划", "让 generator 在隔离账户生成代码、Trace 和截图", "人工审查定位器、业务 Oracle、测试数据和副作用", "注入 UI 与业务缺陷，只有能稳定变红的测试才合并"],
    scenario: "给 planner 一条“已激活商品必须进入人工复核”的风险。generator 生成测试后，先运行基线，再把后端状态错误改成 auto_refunded。测试必须因业务状态而失败，不能只验证页面提示。",
    code: "npx playwright test generated/refund-review.spec.ts --trace on\npython3 scripts/inject_backend_fault.py --state auto_refunded\nnpx playwright test generated/refund-review.spec.ts --trace on",
    expected: "基线通过，业务故障后测试失败；代码引用风险 ID，Trace 能看到真实动作和状态；无证据或只含表面断言的候选被拒绝。",
    failure: "浏览器可访问并不等于 Oracle 正确。若测试只因超时变红，先稳定环境和定位器；若坏业务状态仍绿，回到风险与断言，不允许 healer 自动改期望。",
    sourceIds: ["S01", "S02", "S18"], evidenceBoundary: "Playwright 文档和公开实践支持测试 Agent 工作流；示例命令需目标项目和页面夹具，课程尚未对多个复杂企业 UI 测量生成成功率。",
  },
  {
    id: "TD-T19", moduleId: "TD-M04", title: "自愈测试为什么会误修绿", type: "诊断", duration: "45 分钟",
    summary: "建立 healer 可改、不可改和必须审批的边界，防止删除断言、改变 Oracle 或绕过业务步骤。",
    why: "自动修复降低定位器维护成本的同时，也可能悄悄把真实回归改成绿色。",
    prerequisites: ["TD-T18"], outcomes: ["区分结构变化与业务变化", "审计 healer 的差异和证据", "用变异回归验证修复未削弱检测力"], artifact: "Healer 变更策略、反作弊检查与审计报告",
    problem: "退款按钮重命名后测试失败。healer 发现另一个可点击按钮并修改定位器，同时删除状态断言。执行通过，但实际走的是取消流程。测试负责人需要把这种“修绿”当质量事故。",
    workflow: ["定义允许自动改的定位器属性与禁止改的业务 Oracle", "要求每次修复保存 DOM/截图/Trace、代码 diff 和理由", "对删除断言、扩大等待、跳过步骤和改变期望设置阻断", "在修复后重新运行原始业务故障注入"],
    scenario: "制造纯 DOM 改名和业务按钮交换两类失败。纯 DOM 改名可提出候选定位器但需证据；按钮交换必须拒绝自动修复。任何候选都要在 auto_refunded 变异下保持失败。",
    expected: "报告明确哪些变更自动接受、哪些待审、哪些拒绝；被接受修复保留原始断言，并继续杀死已知业务变异。",
    failure: "把历史通过率当修复正确性的依据会放大假绿。先比较业务动作与 Oracle，再看定位器；无法证明语义等价时，healer 只能给建议，不能直接提交。",
    sourceIds: ["S01", "S21", "S22"], evidenceBoundary: "公开文档与实践讨论支持生成和浏览器验证边界；反作弊策略为课程设计，未对特定商业自愈工具做全面功能或准确率评测。",
  },
  {
    id: "TD-W01", moduleId: "TD-M04", title: "先区分 Agent、Worker 和固定 Workflow", type: "概念", duration: "35 分钟",
    summary: "按路径由谁决定、状态存在哪里、工具如何调用和何时终止，识别真正的被测系统。",
    why: "营销名称并不能说明系统是否自主；分类错误会让团队漏测分支、状态和副作用。",
    prerequisites: ["TD-T15"], outcomes: ["用控制权识别固定 workflow 与 Agent", "描述 worker 的输入输出和生命周期", "为不同结构选择测试策略"], artifact: "Agent、Worker、Workflow 控制权对照图",
    problem: "同一个“智能客服”产品中，入口是固定路由 workflow，知识查询由 Agent 自主选工具，退款审批由异步 worker 执行。若把它整体叫 Agent，就会漏掉队列重试和确定性分支。",
    workflow: ["画出节点、边、状态存储、队列、工具和外部副作用", "标记每个下一步由代码、模型还是人工决定", "为固定路径写分支覆盖，为自主路径写不变量和攻击集", "为 worker 增加重复投递、并发、超时和幂等检查"],
    scenario: "拆解退款处理：规则引擎决定是否进入 Agent，Agent 查询政策并提出动作，worker 异步写入审计，人工最终批准。分别列出每层的输入、Oracle、失败和责任人。",
    expected: "对照图能定位控制权和状态，不依赖产品命名；每种组件都映射到可执行的测试类型和可观察证据。",
    failure: "只按同步/异步或是否使用大模型分类不够。关键是路径选择、状态与副作用由谁控制；边界不清时先观察 Trace 和代码，不凭界面文案猜测。",
    sourceIds: ["S10", "S23", "S35"], evidenceBoundary: "分类来自公开 Agent 模式与测试方法的综合；行业对 worker 等术语没有唯一标准，应以目标系统架构和运行证据重新命名。",
  },
  {
    id: "TD-W02", moduleId: "TD-M04", title: "测试状态、循环、重试、Handoff 和终止条件", type: "跟做", duration: "60 分钟",
    summary: "对长流程注入丢状态、重复执行、错误交接和不终止故障，验证恢复、幂等和预算边界。",
    why: "单步都正确不代表流程可靠；状态与重试错误会造成重复副作用、死循环和责任丢失。",
    prerequisites: ["TD-W01", "TD-T16"], outcomes: ["建立 workflow 状态机与不变量", "设计重试、恢复、Handoff 和终止故障", "验证副作用幂等与可观测性"], artifact: "Workflow 状态模型与故障注入报告",
    problem: "退款审批在 Agent、人工和异步 worker 间交接。网络超时后消息重复投递，worker 写了两次审计；Agent 因看不到人工状态持续重试，最终耗尽 Token。",
    workflow: ["列出状态、合法转移、owner、checkpoint 与副作用", "为每个循环设置次数、时间、Token 和成本上限", "注入消息重复、checkpoint 丢失、Handoff 目标错误和外部超时", "断言幂等、恢复位置、停止原因、告警和人工接管"],
    scenario: "让 worker 在写审计后、确认消息前崩溃，队列随后重复投递。系统应通过幂等键避免第二次写入，并从 checkpoint 恢复；再移除终止信号，验证预算门禁停止 Agent。",
    code: "python3 scripts/run_workflow.py --fault crash-after-write --message msg-42\npython3 scripts/run_workflow.py --replay msg-42\npython3 scripts/assert_workflow.py --writes 1 --stop-reason budget_guard",
    expected: "重复投递只产生一次业务副作用；恢复点和 owner 可见；错误 Handoff 与死循环在预算内停止并产生告警，而不是静默成功。",
    failure: "只在 happy path 验证最终状态会漏掉中间重复写和孤儿任务。检查事件时间线、幂等键、checkpoint 与停止原因；无限增加重试次数不是可靠性修复。",
    sourceIds: ["S06", "S10", "S48"], evidenceBoundary: "来源支持应用评测和级联失败控制；故障注入脚本为教学形状，队列语义、事务边界和恢复机制需按目标平台验证。",
  },
  {
    id: "TD-W03", moduleId: "TD-M04", title: "单 Agent 与多 Agent 的公平对照", type: "诊断", duration: "50 分钟",
    summary: "固定模型、工具、任务、Token、时间和成功标准，判断多 Agent 是否带来可重复收益而非额外复杂度。",
    why: "多角色能提高覆盖，也会增加通信、冲突、成本和失败面；不做同预算对照无法知道是否值得。",
    prerequisites: ["TD-W02"], outcomes: ["设计同预算系统对照", "测量结果、轨迹、协作失败和成本", "识别真正需要角色分离的任务"], artifact: "单 Agent/多 Agent 同预算实验报告",
    problem: "团队把一个测试生成 Agent 拆成 planner、generator、reviewer，成功率看似提高，但 Token 和时间翻倍，且 reviewer 常重复 planner 的内容。需要在相同预算与任务集上比较。",
    workflow: ["固定模型版本、工具、数据、任务集、最大 Token、时间和重试", "分别运行单 Agent 与多 Agent 多次", "比较任务成功、blocker、轨迹长度、协作冲突、延迟和单位成功成本", "检查收益是否集中在特定风险切片，再决定保留哪些角色"],
    scenario: "用 20 个 API 测试设计任务做对照。多 Agent 必须共享与单 Agent 相同总 Token 和工具权限；若只在复杂跨服务任务提升，则仅对该切片启用编排。",
    expected: "报告给出重复运行分布和单位成功成本，不以一次演示下结论；角色分离有明确适用条件、失败模式和回退到单 Agent 的规则。",
    failure: "给多 Agent 更多预算、不同 Prompt 或人工干预会破坏公平性。先锁定实验变量；结果差异落在噪声范围时，应报告无结论而非宣布架构优胜。",
    sourceIds: ["S10", "S24", "S35"], evidenceBoundary: "公开资料支持 Agent 轨迹与生产成熟度评估；20 个任务是教学实验设计，未实际证明多 Agent 在目标组织更优或更便宜。",
  },
];

type PageControl = {
  metric: string;
  securityGate: string;
  oracle: string;
  rollback: string;
  transfer: string;
  nodes: string[];
};

const controls: Record<string, PageControl> = {
  "TD-T13": { metric: "按风险切片比较 blocker rate、重复运行 win-rate 分布、p95 latency 和 unit-success cost；实验 owner 决定是否只对低风险切片放量。", securityGate: "A/B 两组使用相同数据权限和只读工具；任何可写 adapter 均关闭。", oracle: "manifest diff 必须只出现一个候选变量；退款 blocker 优先于平均分。", rollback: "恢复 A 的模型/Prompt/索引完整 manifest，不只改一个别名；保留 B 的逐条失败证据。", transfer: "迁移到文档问答时保持单变量、风险切片和重复运行，改动任务数据与 blocker 定义。", nodes: ["Versioned A/B manifests", "Frozen eval set", "Repeated runner", "Slice/Blocker Oracle", "Cost/Latency ledger", "Human release gate"] },
  "TD-T14": { metric: "先算人人一致与分歧矩阵，再算 Judge-human agreement、position consistency、fact-blocker recall；阈值由评测 owner 按风险切片制定。", securityGate: "Judge 只读脱敏回答；不能调用业务工具，也不能批准自己生成的 reference 或期望。", oracle: "顺序翻转、长度扰动、事实错误和近邻反例必须分别保留结果；安全/权限 blocker 交人工。", rollback: "冻结该 Judge 版本，回到上一校准包并对受影响结论重新抽检。", transfer: "迁移到代码评审时替换 rubric 与人工专家，仍保留盲评、顺序翻转和独立 Oracle。", nodes: ["Double human labels", "Blind pair shuffle", "Versioned Judge", "Bias probes", "Disagreement matrix", "Human escalation"] },
  "TD-T15": { metric: "分别报告 outcome pass、prohibited-step rate、trajectory completion、budget breach 和 trace completeness，禁止用一个总分吞掉 blocker。", securityGate: "先定义禁止副作用和授权边界，再允许 Agent 规划；最终文本正确不能覆盖越权调用。", oracle: "Outcome、Step、Trajectory 三层独立判定，允许安全替代路径但拒绝任何 prohibited tool call。", rollback: "撤销待执行动作、冻结当前 policy/agent 版本，并从最后安全 checkpoint 重放。", transfer: "迁移到采购 Agent 时保留三层结构，改写禁止动作、审批金额和合法替代路径。", nodes: ["Business outcome", "Tool step ledger", "State snapshots", "Trajectory graph", "Policy blockers", "Human decision"] },
  "TD-T16": { metric: "统计 auth-before-action、wrong-tool、parameter-boundary、policy-denied、duplicate-effect 和 zero-write proof，按 tool/scope/tenant 分层。", securityGate: "用户身份、tenant、最小 scope、参数界限、幂等键与人类批准全部在 refund 写入之前执行。", oracle: "沙箱中越权、越界和重复调用必须被 policy 层拒绝；Prompt 拒绝不是权限控制。", rollback: "冻结写工具、撤销未提交 proposal、轮换受影响凭据并回放 policy receipt。", transfer: "迁移到发邮件 Agent 时保持 auth/least-privilege/idempotency/human-confirm，修改 recipient 与内容策略。", nodes: ["Identity verifier", "Tool registry", "Policy engine", "Sandbox adapter", "Idempotency store", "Human approval"] },
  "TD-T17": { metric: "统计 injection reach rate、cross-tenant attempts、secret exposure、write attempts 与 layer-block rate；任何泄露/写入均为 blocker。", securityGate: "不可信网页/邮件/知识内容只作为数据；tenant enforcement 和工具授权在模型之外完整中介。", oracle: "即使模型服从恶意文档，工具仍须拒绝跨租户、秘密读取和写动作；输出过滤不能替代授权。", rollback: "停用受污染来源和写工具、撤销 token、隔离 trace，并由安全 owner 复核暴露范围。", transfer: "迁移到代码 Agent 时保持信任分区与最小权限，替换攻击载体、secret 类型和工具 allowlist。", nodes: ["Untrusted content", "Retrieval isolation", "Model boundary", "Tool authorization", "Output DLP", "Security review"] },
  "TD-T18": { metric: "统计 risk-to-test trace、business-oracle coverage、known-mutation kill、flaky retry 和 trace completeness；UI 可见性不等于业务通过。", securityGate: "Browser Agent 只使用隔离账户和无写权限环境；生成代码进入人工 review 后才能合并。", oracle: "后端 auto_refunded 变异必须令 manual_review Oracle 变红；超时或 locator 错误不是业务检测力。", rollback: "拒绝生成候选、恢复 seed/fixture 和上一个测试版本，保留 Trace 与失败截图。", transfer: "迁移到订单审核页时保持风险 ID、业务状态 Oracle 与 mutation，修改页面 fixture 和状态机。", nodes: ["Risk/PRD", "Planner", "Generator", "Sandbox browser", "Business mutation", "Human test review"] },
  "TD-T19": { metric: "统计 healer patch 类型、Oracle preservation、expected-value change、mutation survival 与 human reject rate。", securityGate: "healer 无代码合并和业务期望修改权限；写入候选 patch 前保存原 Trace、DOM、截图和 diff。", oracle: "locator-only 候选仍须杀死原业务变异；删除断言、跳步、改期望或无限等待立即拒绝。", rollback: "撤销 healer patch、恢复原测试与已知失败，冻结自动提交并升级人工诊断。", transfer: "迁移到 API schema 自愈时保持不可改 Oracle 与 mutation 回归，替换允许调整的非语义字段。", nodes: ["Failing test", "Evidence capture", "Healer candidate", "Anti-cheat diff", "Mutation rerun", "Human merge gate"] },
  "TD-W01": { metric: "按组件统计 deterministic branch coverage、agent policy violations、worker redelivery/idempotency 和 orphan-state；术语不作为指标。", securityGate: "先按状态和副作用 owner 切分权限；Agent 不继承 Worker 或 Workflow 的写权限。", oracle: "下一步由代码、模型或队列决定，状态归谁持有，副作用在哪里提交，这三项共同决定测试类型。", rollback: "回到明确组件边界和独立身份，停止跨组件共享高权限 token。", transfer: "迁移到内容发布系统时保持控制权分类，替换 router、writer worker 与生成 Agent。", nodes: ["Deterministic router", "Autonomous agent loop", "Async queue", "Worker", "State stores", "Human owner"] },
  "TD-W02": { metric: "统计 duplicate-effect rate、checkpoint recovery、handoff errors、orphan tasks、iteration/token/time budget breach 和 stop-reason completeness。", securityGate: "每次重试先校验身份、current state 和幂等 receipt；错误 handoff 不得扩大下游权限。", oracle: "重复 msg-42 只能产生一次 audit write；循环必须在 max_iterations 内留下 stop reason 和 owner。", rollback: "暂停消费者、恢复 checkpoint、按 idempotency ledger 对账并把孤儿任务交人工。", transfer: "迁移到订单履约流程时保持状态/重试/handoff/终止不变量，替换消息与补偿动作。", nodes: ["Workflow state", "Checkpoint", "Queue delivery", "Idempotent worker", "Budget guard", "Human handoff"] },
  "TD-W03": { metric: "同模型、总 Token、工具、任务、重试和人工干预下比较成功率分布、blocker、延迟、coordination failure 与 unit-success cost。", securityGate: "两组都只给同一只读 scope；多 Agent 不因角色增加获得隐式权限或额外人工救场。", oracle: "任一预算、工具或干预不一致即 confounded；差异落在重复运行噪声内时输出 UNKNOWN。", rollback: "对无收益切片退回单 Agent，保留多 Agent 只在证据支持的复杂任务，并冻结实验 manifest。", transfer: "迁移到研究任务时保持公平预算与分布报告，替换任务集、成功 Oracle 和成本模型。", nodes: ["Frozen task set", "Single-agent arm", "Multi-agent arm", "Shared budget", "Repeated trials", "Architecture decision"] },
};

const architectures: Record<string, { title: string; caption: string }> = {
  "TD-T13": {
    title: "单变量 A/B 的可比性与发布证据链",
    caption: "A/B manifest 先冻结数据、Prompt、检索、工具、Judge 与预算，重复运行后由风险切片 Oracle 和人工发布负责人决定候选是否可放量。",
  },
  "TD-T14": {
    title: "Judge 校准、偏差探针与人工升级链",
    caption: "双人标签先建立人工基准，盲化候选再做顺序与事实反例；分歧矩阵只辅助定位，事实和安全 blocker 最终交独立人工裁决。",
  },
  "TD-T15": {
    title: "Outcome、Step、Trajectory 三层 Oracle",
    caption: "业务最终状态、每次工具动作与完整轨迹分别判定；任一禁止副作用在 Step 层出现，都不能被正确的最终文本或轨迹解释抵消。",
  },
  "TD-T16": {
    title: "工具调用的写前授权与幂等链",
    caption: "身份、tenant、最小 scope、参数 Schema、幂等键与人工批准必须在工具执行前形成 receipt；模型只能提出候选调用，不能自行授予权限。",
  },
  "TD-T17": {
    title: "不可信内容到模型外授权的安全边界",
    caption: "网页、邮件和检索文本只进入数据通道，模型输出继续按不可信候选处理；tenant enforcement、工具授权与 DLP 在模型之外独立阻断泄露和写入。",
  },
  "TD-T18": {
    title: "风险驱动的 Browser Agent 测试生成链",
    caption: "需求风险先转成 Planner 场景与 Generator 候选，再在隔离浏览器执行；后端业务状态和已知 mutation 决定测试是否具有真实检测力。",
  },
  "TD-T19": {
    title: "Healer 候选修复的反作弊审查链",
    caption: "失败 Trace、DOM 与截图先固化，候选 diff 只能修改非语义表面；原业务 Oracle 与 mutation 回归共同阻止删断言、改 expected 或无限等待制造假绿。",
  },
  "TD-W01": {
    title: "Agent、Worker、Workflow 控制权分类图",
    caption: "下一步由代码、模型还是队列决定，状态由谁持有，副作用在哪里提交；这三项运行证据共同决定组件类别、测试 Oracle 和最小权限。",
  },
  "TD-W02": {
    title: "可恢复 Workflow 的状态、重试与终止链",
    caption: "每次投递从 checkpoint 与身份校验开始，幂等 Worker 只提交一次副作用；handoff 不扩权，预算守卫必须留下 stop reason 或转交人工。",
  },
  "TD-W03": {
    title: "单 Agent 与多 Agent 的同预算对照链",
    caption: "两组共享同一任务、模型、工具、总 Token、时间、重试和人工干预预算；重复运行的 blocker、成本与成功分布才交给架构负责人裁决。",
  },
};

const ownerIds = specs.map((spec) => spec.id);

const buildLlmAgentPage = (spec: TopicSpec, index: number): TutorialPage => {
  const control = controls[spec.id];
  const reportDir = `reports/${spec.id.toLowerCase()}`;
  const command = `python3 scripts/agent_quality_lab.py --topic ${spec.id} --phase cycle --report-dir ${reportDir}`;
  const promptBase = `materials/llm-agent-quality/learner-materials/prompts/${spec.id}`;
  return {
    id: spec.id, moduleId: spec.moduleId, order: index + 1, title: spec.title, type: spec.type,
    status: "fixture-tested", duration: spec.duration, summary: spec.summary, why: spec.why,
    prerequisites: spec.prerequisites, outcomes: spec.outcomes, artifact: spec.artifact,
    blocks: [
      { title: "专业问题、失败成本与决策权", body: [spec.problem, control.securityGate], warning: "安全、身份和权限检查必须先于任何可写副作用；被测模型、Judge 或 healer 不能批准自己的期望。" },
      { title: "架构、输入契约与可观察证据", body: [spec.scenario, control.metric], bullets: spec.workflow, expected: `固定 input、Schema、eval 和 mutation 已绑定；模型执行仍为 NOT_RUN。`, technical: { kind: "prompt", content: `按 ${spec.id} 证据契约评价固定输入；缺少权限、版本、独立 Oracle 或人工权力时 fail-closed。`, version: "1.0.0", promptPath: `${promptBase}/task.md`, manifestPath: `${promptBase}/manifest.json`, inputFixturePath: `${promptBase}/input.json`, outputSchemaPath: `${promptBase}/output.schema.json`, evaluationPath: `${promptBase}/eval.json` } },
      { title: "运行 baseline、故障与修复", body: [control.oracle, "命令依次保存 baseline、fault、repair 和 cycle-summary；只有内部退出语义精确为 0/1/0 时 cycle 才通过。"], expected: `${reportDir} 中四份 JSON；fault 有命名 failed_oracle_ids，repair 不覆盖 fault。`, technical: { kind: "command", content: command, manifestPath: `materials/llm-agent-quality/learner-materials/manifests/${spec.id}.json`, stepId: "cycle", workingDirectory: "materials/llm-agent-quality/learner-materials", expectedExitCode: 0, expectedArtifacts: [`${reportDir}/baseline.json`, `${reportDir}/fault.json`, `${reportDir}/repair.json`, `${reportDir}/cycle-summary.json`] } },
      { title: "从症状定位到安全修复", body: [spec.failure, `回滚：${control.rollback}`], warning: "删除 Oracle、改变 expected、扩大权限、增加预算或无限重试都属于制造假绿。" },
      { title: "人工门禁与迁移", body: [`决策 owner 检查原始输入、版本、failed Oracle、权限 receipt、成本和 residual risk；模型只能提供候选解释。`, control.transfer], bullets: ["来源上下文与目标上下文分开记录", "保持不变量，显式修改至少两项配置", "以故障仍能变红和零越权副作用作为成功标准"] },
    ],
    practice: [`运行 ${spec.id} 的 0/1/0 fixture 并解释命名 Oracle`, "检查 Prompt/Input/Schema/Eval/Mutation 的版本闭包", "写出一个不同业务对象的权限、故障和 rollback"],
    completion: ["安全和权限先于可写副作用", "fault 稳定变红且 repair 重新变绿", "模型不批准自己的期望，人工 owner 和 NOT_RUN 边界明确"],
    sourceIds: spec.sourceIds,
    evidenceBoundary: `${spec.evidenceBoundary} 本页新增证据仅为确定性离线 fixture；真实模型、浏览器、工具、队列、组织审批和从业者评审均 NOT_RUN。`,
    architecture: { title: architectures[spec.id].title, caption: architectures[spec.id].caption, nodes: control.nodes },
    materials: [
      { title: `${spec.id} 实验脚本`, description: "标准库确定性 runner，生成独立 baseline/fault/repair 报告。", href: "materials/llm-agent-quality/learner-materials/scripts/agent_quality_lab.py", kind: "script", validation: "fixture-tested" },
      { title: `${spec.id} Lab Manifest`, description: "精确工作目录、命令、退出码、工件与 required files。", href: `materials/llm-agent-quality/learner-materials/manifests/${spec.id}.json`, kind: "config", validation: "fixture-tested" },
      { title: `${spec.id} Prompt Manifest`, description: "system/task/critic、Input、Schema、Eval、Mutation 与 NOT_RUN 模型策略。", href: `${promptBase}/manifest.json`, kind: "config", validation: "static-reviewed" },
      { title: `${spec.id} Mutation`, description: "主故障、缺引用、自批准与先写后授权负例。", href: `${promptBase}/mutation.json`, kind: "fixture", validation: "fixture-tested" },
      { title: "共享 bundle 精确 Owners", description: `仅归属 ${ownerIds.join("、")}，禁止前缀继承。`, href: "materials/llm-agent-quality/learner-materials/owners.json", kind: "config", validation: "fixture-tested" },
      { title: "LLM/Agent 质量完整离线包", description: "十页 Prompt、manifest、runner、测试和报告。", href: "materials/llm-agent-quality.zip", kind: "archive", validation: "fixture-tested" },
    ],
  };
};

export const llmAgentPages = specs.map(buildLlmAgentPage).map((page): TutorialPage => ({
  ...page,
  blocks: [...page.blocks, ...agentWorkflowDeepBlocks(page.id), ...ragQualityDeepBlocks(page.id)],
}));
