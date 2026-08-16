import type { TutorialBlock, TutorialPage } from "../course.ts";
import { promptBody } from "../prompt-bodies.ts";
import { ragQualityDeepBlocks } from "./rag-quality-deep.ts";
import { composeDeepPage } from "./deep-layer.ts";
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
    id: "TD-T13", moduleId: "TD-M03", title: "版本化 A/B：Prompt、模型与知识库", type: "跟做", duration: "55 分钟",
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
    id: "TD-T14", moduleId: "TD-M03", title: "LLM-as-Judge 校准与反例集", type: "诊断", duration: "55 分钟",
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
    id: "TD-T15", moduleId: "TD-M04", title: "Agent 结果、步骤与轨迹评估", type: "概念", duration: "40 分钟",
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
    id: "TD-T16", moduleId: "TD-M04", title: "Agent 工具调用：选择、参数与权限", type: "跟做", duration: "55 分钟",
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
    id: "TD-T17", moduleId: "TD-M04", title: "Agent 安全：Prompt Injection、数据泄露与 Excessive Agency", type: "跟做", duration: "60 分钟",
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
    id: "TD-T18", moduleId: "TD-M04", title: "Browser Agent 与 Playwright Test Agents", type: "跟做", duration: "60 分钟",
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
    id: "TD-T19", moduleId: "TD-M04", title: "自愈测试的误修绿风险", type: "诊断", duration: "45 分钟",
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
    id: "TD-W01", moduleId: "TD-M04", title: "Agent、Worker 与固定 Workflow 的边界", type: "概念", duration: "35 分钟",
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
    id: "TD-W02", moduleId: "TD-M04", title: "Workflow 状态、循环、重试、Handoff 与终止条件", type: "跟做", duration: "60 分钟",
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
    id: "TD-W03", moduleId: "TD-M04", title: "单 Agent 与多 Agent 对照评估", type: "诊断", duration: "50 分钟",
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

const wave2Expansions: Record<string, TutorialBlock> = {
  "TD-T13": { title: "A/B 复盘工作台：把归因写成可审计决定", body: ["先把一次候选升级拆成三个问题：变量是否唯一、差异是否能在同一任务上重放、风险切片是否改变了发布边界。变量唯一不等于结果可信；同一个 Prompt 在缓存命中、上下文截断或工具超时不同的运行里仍可能产生伪差异。因此每条结论都要回链到 candidate_sha、dataset_sha、retriever_sha、scorer_sha 和 run_id。", "一个可复用的交付顺序是：先导出 manifest diff，再按任务 ID 配对，最后按退款、权限、引用正确性等风险切片聚合。若普通 FAQ 提升而退款事实错误增加，正确的产物不是‘平均提升 8%’，而是‘低风险切片候选、退款切片回退’，并把回退所需的完整 A manifest 交给 owner。迁移到别的业务时只替换风险目录和独立 Oracle，不改变单变量与分母规则。"], table: { headers: ["观察到的症状", "首先定位的层", "下一步检查与修复"], rows: [["总分上涨但退款切片下降", "切片 Oracle/分母", "核对高风险样本是否被纳入，保存逐题 flip；blocker 存在则分流或回退"], ["两组结果无法复现", "版本与运行环境", "比较模型快照、Prompt、缓存、随机参数和工具响应；不完整则标 UNKNOWN"], ["模型与索引同时变化", "实验设计", "拒绝该 run，恢复 A/B manifest，只保留一个自变量再重跑"], ["重复运行胜负反转", "方差与预算", "增加预先约定的重复次数并报告区间；样本不足不宣布 winner"]], caption: "诊断顺序固定为可比性 → 逐题结果 → 风险切片 → 发布决定。" } },
  "TD-T14": { title: "Judge 校准工作台：先证明 Oracle，再谈自动化", body: ["Judge 的分数只能成为测量仪器，不能直接成为业务真相。校准集至少要同时包含事实正确/错误、权限越界、冗长但无关、顺序翻转和近邻答案；每条样例保存人工理由、政策版本和风险标签。先算两位人工标注者的分歧，再算 Judge 与共识标签的分歧，才能判断问题来自 rubric、人工争议还是模型偏差。", "可复用的升级规则应按风险分层：风格和格式可由 Judge 自动筛选，事实、隐私、权限和安全必须进入人工队列。更换 Judge、system rubric 或候选输出格式都视为新仪器，旧阈值和旧校准 receipt 立即失效。迁移到代码评审时替换领域 Oracle，但保留盲评、位置扰动、反例和人工升级四个控制点。"], table: { headers: ["症状", "疑似层", "下一步检查与修复"], rows: [["交换 A/B 顺序就改变胜负", "Judge 位置偏差", "盲化并多次反转顺序；偏差未消除则禁用自动放行"], ["长答案总被偏爱", "rubric/长度偏差", "加入同事实不同长度配对，独立标注事实分；重写 rubric"], ["过期政策仍得高分", "事实 Oracle", "将政策版本与引用证据注入校准集，事实 blocker 交人工"], ["人工彼此不一致", "人工基准", "先做 adjudication 和标注指南；未形成共识时结论保持 UNKNOWN"]], caption: "Judge 的可信范围由校准证据决定，而不是由单次 agreement 数字决定。" } },
  "TD-T16": { title: "工具调用审查：从候选动作到零副作用证明", body: ["工具测试的关键不是让模型说出正确 JSON，而是证明错误动作没有越过执行边界。对每个工具建立 action contract：调用者身份、tenant、scope、参数范围、幂等键、审批条件、可逆性和审计字段。测试顺序应先验证 policy receipt，再验证 adapter 是否真的没有写入；否则只看模型拒答会错过后端直达路径。", "迁移时保留‘写前授权、最小权限、零副作用’三条不变量。例如把退款换成发邮件，参数边界变成收件人和附件策略，审批人变成业务 owner，但不能因为动作看似可撤回就删除 tenant 校验和幂等记录。任何真实凭据、真实写端点和组织审批都必须另开集成门禁。"], table: { headers: ["症状", "疑似层", "下一步检查与修复"], rows: [["模型拒绝了但仍发生写入", "工具 adapter/权限边界", "查 trace 与后端审计；在 policy 之外加写前强制拒绝并证明 zero-write"], ["金额 10 变 1000 仍通过", "Schema/参数边界", "用边界与类型变异重跑，固定拒绝 reason 和 policy version"], ["重试产生两次退款", "幂等存储", "按 request_id 对账，恢复唯一 receipt；重复投递必须不产生第二次副作用"], ["跨租户读取成功", "身份与 tenant", "检查 token scope 和服务端 tenant enforcement；撤销凭据并隔离受影响数据"]], caption: "先查模型外的执行边界，再查模型为何提出该动作。" } },
  "TD-T17": { title: "注入与泄露复盘：验证每一道独立防线", body: ["把攻击链画成不可信输入→检索→模型候选→工具授权→输出/日志五段，而不是只检查最终文本。间接注入应在知识文档、网页和邮件中分别出现，并携带跨租户读取、secret 外带、越权写入三类后果。每次攻击保存到达层、被哪道控制阻断、是否留下敏感 trace；‘模型说不’只能算一条弱证据。", "可复用的安全报告要把事实和未知分开：已证明工具拒绝的是 fixture evidence，未覆盖的编码、供应链、插件和真实密钥路径仍是 UNKNOWN。迁移到代码 Agent 时，替换攻击载体和 allowlist，但保持数据分区、最小权限、DLP 与人工复核四层控制，不能把关键词过滤当成授权系统。"], table: { headers: ["症状", "疑似层", "下一步检查与修复"], rows: [["模型拒绝但 secret 出现在日志", "日志/输出 DLP", "扫描 trace、错误和 telemetry；脱敏并轮换暴露凭据"], ["恶意文档触发 export 工具", "检索信任边界/工具授权", "标记文档为数据，服务端重新校验 tenant 与 scope，阻断写调用"], ["只拦截已知关键词", "输入防护", "加入改写、编码和多语言变体；把授权控制移到模型外"], ["攻击样例跨租户可见", "数据隔离", "检查检索过滤和缓存 key；隔离索引并对跨租户尝试一票否决"]], caption: "安全判断看攻击是否产生到达和副作用，不看模型口头承诺。" } },
  "TD-T18": { title: "Browser Agent 复盘：业务 Oracle 必须能杀死变异", body: ["生成式浏览器测试的最小闭环是风险 ID→可观察业务状态→候选动作→后端变异→失败证据。截图、按钮可见和页面无报错只是表面信号；只有把 auto_refunded 改成 manual_review_required 后测试稳定变红，才能证明断言覆盖了业务风险。planner、generator、healer 的每次输出都应留 trace、账户和 fixture 版本。", "迁移到订单、支付或后台审批时，改的是状态机和副作用，不是‘让 Agent 更聪明’。先建立隔离账户和无写权限沙箱，再把一个已知事故做成 mutation；任何 healer 让变异重新变绿，都必须退回人工审查。真实浏览器兼容性、生产数据和跨团队维护仍需独立验证。"], table: { headers: ["症状", "疑似层", "下一步检查与修复"], rows: [["页面绿但错误订单状态未被发现", "业务 Oracle", "注入后端状态 mutation；补充状态断言与 risk ID"], ["healer 改到相邻按钮", "定位器语义", "比较 Trace 中真实动作和预期副作用；拒绝自动合并"], ["测试偶发超时变红", "环境/同步", "先固定数据、等待和网络；区分基础设施失败与业务失败"], ["生成代码无风险来源", "planner/需求映射", "回链 PRD 风险和验收条件；无来源候选不进入 review"]], caption: "业务变异是判断生成测试是否有检测力的独立 Oracle。" } },
  "TD-W02": { title: "Workflow 恢复演练：状态不是日志的附属品", body: ["长流程测试必须把状态转移、checkpoint、队列投递和副作用写成同一条时间线。‘最终状态正确’不能证明中间没有重复写；要在写入后、确认前制造崩溃，再重复投递同一 message，检查幂等 receipt、恢复 owner 和 stop reason。若 Agent 看不到人工状态而持续重试，预算守卫必须先于 token 耗尽留下可解释的终止。", "迁移到履约或发布流程时，替换业务状态和补偿动作，但保持四个不变量：重放不重复副作用、handoff 不扩权、checkpoint 可定位、预算可终止。真实队列和事务语义尚未运行时，只能说 fixture 证明合同，不得把一次离线循环写成生产可靠性。"], table: { headers: ["症状", "疑似层", "下一步检查与修复"], rows: [["重复消息造成两次写入", "幂等 worker", "按业务 key 对账并恢复唯一 receipt；重放后写入数必须为 1"], ["恢复后从头再次执行", "checkpoint", "检查 checkpoint 原子性和版本；从最后安全状态恢复"], ["Agent 无限重试", "终止/预算守卫", "设置 iteration、time、token 上限并保留 stop reason 与 owner"], ["handoff 后权限扩大", "身份与状态转移", "重新计算目标 scope；错误交接阻断而非静默转发"]], caption: "每个恢复结论都要同时回答状态、权限和副作用三个问题。" } },
  "TD-W03": { title: "公平对照复盘：多 Agent 的收益必须可归因", body: ["多 Agent 实验最容易把额外角色、更多 token 和人工救场误当成架构收益。先生成共享 manifest，锁定任务集、模型快照、工具 scope、总 token、时间、重试和人工干预；然后分别多次运行单 Agent 与多 Agent，保存每题成功、协作冲突、轨迹长度、成本和 blocker。只有同预算的配对结果才有资格进入决策。", "迁移到研究或测试生成时，若收益只出现在跨服务切片，就只在那里启用编排；简单任务继续用单 Agent。若区间重叠、失败归因不清或多 Agent 依靠额外人工才成功，结论应为 UNKNOWN/不值得复杂化，而不是用一次演示宣布升级。"], table: { headers: ["症状", "疑似层", "下一步检查与修复"], rows: [["多 Agent 成功率更高但 token 翻倍", "预算公平性", "核对总预算和单位成功成本；按同预算重跑"], ["reviewer 重复 planner 输出", "协作协议", "比较消息与任务增量；合并冗余角色或限定交接 schema"], ["只在一个复杂样例提升", "风险切片", "扩大同类任务并报告区间；不要外推全局 winner"], ["人工频繁救场", "独立性/owner", "记录干预次数和原因；将人工支持纳入两组相同预算"]], caption: "复杂度只有在可重复、同预算、特定切片的收益成立时才值得保留。" } },
};

wave2Expansions["TD-T13"] = { title: "版本升级工作单", body: ["案例：候选 B 将模型快照从 m-17 换成 m-18，退款切片 48 条中有 3 条引用旧政策而 FAQ 提升 6%。学员填写自变量、冻结字段、逐题 flip、风险分母、回退 manifest 和 owner 签名，下一位工程师可以据此复跑。", "迁移工件是一份带 hash 的 A/B ledger，包含失败样例、缓存状态、成本和 p95 延迟；浮动模型别名必须标 UNKNOWN 并阻止比较。"], table: { headers: ["工件", "验收", "复测"], rows: [["A/B ledger", "逐题可配对", "按 case_id 重放"], ["风险卡", "高风险独立", "计算 blocker 分母"], ["回退 manifest", "能恢复 A", "sandbox 复原 hash"], ["owner receipt", "权限明确", "确认签名到期"]], caption: "实验必须成为可交接工件。" } };
wave2Expansions["TD-T16"] = { title: "退款工具案例：证明拒绝先于写入", body: ["攻击输入把退款金额从 10 元改成 1000 元并重复 request_id。正确流程先由身份、tenant、scope、Schema、幂等和人工审批生成 policy receipt，再允许 sandbox adapter 接收动作；学员提交 trace、zero-write 证明和 repair 前后策略版本。", "迁移到邮件工具时替换收件人域、附件和群发边界，保留写前授权与幂等。真实凭据、写端点和补偿事务未接入时只能是 fixture/static。"], table: { headers: ["工件", "Oracle", "修复"], rows: [["policy receipt", "字段齐全", "缺字段 exit 1"], ["zero-write trace", "写入数为 0", "隔离工具"], ["idempotency ledger", "同 key 一笔", "暂停重试"], ["repair diff", "expected 不变", "人工复核"]], caption: "工具安全的成功标准是副作用可证明为零。" } };
wave2Expansions["TD-T18"] = { title: "退款后台案例：用业务变异审查生成测试", body: ["planner 抽出‘已激活商品必须进入人工复核’，generator 生成脚本；基线通过后将后端状态改成 auto_refund，若脚本仍绿，说明只断言按钮可见。学员提交 risk-to-test 映射、Trace、mutation 报告和拒绝 healer 的理由。", "迁移到审批或支付页替换状态机、账户夹具和副作用 Oracle，保留隔离账户、人工合并和业务变异；真实浏览器矩阵、认证和生产数据另行验证。"], table: { headers: ["审查", "证据", "动作"], rows: [["风险来源", "需求 ID", "无来源退回"], ["业务 Oracle", "mutation 杀死", "补状态断言"], ["定位器", "Trace 语义", "拒绝相邻 patch"], ["副作用", "sandbox 无写", "人工 review"]], caption: "生成速度不能替代业务 Oracle。" } };
wave2Expansions["TD-T13"] = { title: "版本升级工作单", body: ["案例：候选 B 换模型快照后退款切片出现旧政策引用而 FAQ 提升。学员提交自变量、冻结字段、逐题 flip、风险分母、回退 manifest 和 owner 签名，下一位工程师可以据此复跑。", "迁移工件是带 hash 的 A/B ledger，包含失败样例、缓存状态、成本和 p95 延迟；浮动模型别名必须 UNKNOWN。"], table: { headers: ["工件", "验收", "复测"], rows: [["ledger", "逐题可配对", "按 case_id 重放"], ["风险卡", "高风险独立", "算 blocker 分母"], ["回退 manifest", "能恢复 A", "复原 hash"], ["owner receipt", "权限明确", "确认到期"]], caption: "实验必须成为可交接工件。" } };
wave2Expansions["TD-T16"] = { title: "退款工具案例", body: ["攻击输入把金额从 10 元改成 1000 元并重复 request_id。正确流程先由身份、tenant、scope、Schema、幂等和人工审批生成 policy receipt，再允许 sandbox adapter 接收动作；提交 trace、zero-write 证明和 repair diff。", "迁移到邮件工具替换收件人域和附件边界，保留写前授权与幂等；真实凭据、写端点和补偿事务未接入时只能 fixture/static。"], table: { headers: ["工件", "Oracle", "修复"], rows: [["policy receipt", "字段齐全", "缺字段阻断"], ["zero-write trace", "写入为 0", "隔离工具"], ["idempotency ledger", "同 key 一笔", "暂停重试"], ["repair diff", "expected 不变", "人工复核"]], caption: "工具安全的成功标准是副作用为零。" } };
wave2Expansions["TD-T18"] = { title: "退款后台案例", body: ["planner 抽出‘已激活商品进入人工复核’，generator 生成脚本；后端状态改成 auto_refund 后若仍绿，说明只断言按钮可见。提交 risk-to-test 映射、Trace、mutation 报告和 healer 拒绝理由。", "迁移到审批或支付页替换状态机、账户夹具和副作用 Oracle，保留隔离账户、人工合并和业务变异；真实浏览器矩阵和生产数据另行验证。"], table: { headers: ["审查", "证据", "动作"], rows: [["风险来源", "需求 ID", "无来源退回"], ["业务 Oracle", "mutation 杀死", "补状态断言"], ["定位器", "Trace 语义", "拒绝 patch"], ["副作用", "sandbox 无写", "人工 review"]], caption: "生成速度不能替代业务 Oracle。" } };
wave2Expansions["TD-T13"] = { title: "T13 完整跟做：从 manifest 到可回退 A/B 决策", body: ["先复制 A 的 manifest 作为基线，再只替换一个字段，例如 model_sha 从 m-17 改成 m-18；dataset_sha、prompt_sha、retriever_sha、tool_scope、judge_sha、temperature、seed、timeout 和预算都必须保持一致。学员把改变前后 hash 写入 diff，不允许用 latest、default 或浮动别名代替版本。接着按 case_id 做配对运行，保存每次 raw output、引用、blocker、延迟和成本，而不是只保存平均分。", "用退款政策、普通 FAQ 和转人工三类切片演练。若 FAQ 提升、退款切片出现两条旧政策引用，发布决定应写成“仅允许低风险分流，退款继续使用 A”，并交付 A 的完整回退 manifest。若两次运行胜负相反，先检查缓存、重试和模型服务状态；证据不足时输出 UNKNOWN，不能把最好的一次当 winner。", "迁移到另一个知识库时，保持单变量、配对、风险切片和回退四个不变量，重新定义 gold 文档、风险 owner、阈值依据和停机动作。学员提交 manifest diff、逐题 flip 表、切片分母、cost/latency ledger、failed blocker 和 owner receipt；这些工件必须让下一位工程师在没有口头解释时复跑相同判断。"], table: { headers: ["步骤", "观察工件", "判定"], rows: [["冻结基线", "A manifest/hash", "字段闭合才能开始"], ["单变量运行", "配对 raw output", "混杂即 INVALID"], ["风险聚合", "slice ledger/blocker", "高风险不被均值抵消"], ["决策回退", "B report+A rollback", "分流或回退并留 owner"]], caption: "A/B 的结果必须能复跑、能否决、能回退。" } };
wave2Expansions["TD-T16"] = { title: "T16 完整跟做：工具写前门禁与故障回放", body: ["先为 get_order、search_policy、refund_order、handoff 各写 action contract：调用者身份、tenant、最小 scope、参数类型和范围、approval_id、idempotency_key、可逆性、审计字段。合法只读路径先通过；再用未认证、金额越界、跨租户和重复 request_id 四个 case 回放。每个 fault 都要在 adapter 执行前生成 policy_denied receipt，沙箱写入计数保持为零。", "诊断时先查模型外的边界：如果模型说拒绝但后端出现写入，说明策略没有在工具注册表或服务端执行；如果金额 10 变 1000 仍通过，查 schema 类型、单位和上限；如果重复调用写两次，查 request_id 是否进入持久化幂等账本。修复时只改根因字段，保留同一攻击输入与 expected，再运行 baseline→fault→repair。", "迁移到发邮件工具时，把 order_id/amount 换成 recipient/attachment/recipient-domain，保留身份、tenant、scope、approval、幂等和人工升级。真实凭据、真实写端点、补偿事务、组织审批和 learner 是否能安全操作都不能由沙箱推断；交接材料必须逐项列出 NOT_RUN 和下一门禁。"], table: { headers: ["故障", "诊断证据", "修复与复跑"], rows: [["未认证退款", "identity/approval receipt", "补写前策略并重跑"], ["金额越界", "schema/units/policy version", "修参数边界，expected 不变"], ["跨租户读取", "token scope/server audit", "撤销凭据并复测"], ["重复写入", "request_id/idempotency ledger", "恢复唯一 receipt"]], caption: "工具测试的绿灯是零未授权副作用，不是模型输出像 JSON。" } };
wave2Expansions["TD-T18"] = { title: "T18 完整跟做：从风险到 Browser Agent 业务变异", body: ["先给 planner 一条有来源的风险：已激活商品必须进入人工复核；再让 generator 在隔离账户和固定 seed 下生成 Playwright 测试。审查 risk ID、测试数据、定位器、等待条件、业务状态 Oracle 和禁止副作用，不能因为截图漂亮就合并。基线通过后，把后端状态从 manual_review_required 变为 auto_refunded，测试必须稳定变红。", "如果变异后仍绿，按层诊断：先查是否真的执行了变异和同一账户，再查 Trace 中真实点击的是哪个按钮，最后查断言是否读取后端状态而不是页面文本。若只是 timeout 变红，先修环境和同步；若 healer 删除断言或改 expected，拒绝自动修复并保留 diff。修复后重跑原始变异，证明检测力没有下降。", "迁移到支付、审批或订单页面时，替换状态机、账户 fixture、风险 ID 和后端 Oracle，保留隔离执行、Trace、mutation、人工 review 四项控制。真实浏览器兼容矩阵、认证、生产数据、跨团队维护和 learner 观察必须独立取证；课程只证明给定 fixture 下生成候选可被业务 Oracle 审查。"], table: { headers: ["阶段", "可观察工件", "通过条件"], rows: [["Planner", "risk-to-test map", "每条测试有来源"], ["Generator", "spec、code、Trace", "定位器与 Oracle 可审查"], ["Mutation", "auto_refunded report", "业务故障退出 1"], ["Healer/Repair", "patch diff、重跑报告", "不删断言且仍杀变异"]], caption: "Browser Agent 的质量由业务状态变异决定，而不是页面截图数量。" } };
wave2Expansions["TD-W02"] = { title: "W02 完整跟做：可恢复状态机的故障回放", body: ["先画 msg-42 从 received、validated、approved、written、handoff、completed 到 stopped 的合法状态转移，并为每个状态标 owner、checkpoint、权限和副作用。制造“写审计后、确认消息前崩溃”，随后重复投递同一消息；正确结果是第二次只读幂等账本并恢复 checkpoint，业务写入总数仍为 1。", "再分别移除终止信号、发送错误 handoff、缩短 timeout。诊断看事件时间线、checkpoint hash、attempt、idempotency receipt、当前 scope 和 stop reason，而不是只看最终 completed。修复只能增加缺失的状态/幂等/预算保护，不能无限增加重试或把 stopped 改为 success；每个 fault 都要留下独立报告并重跑。", "迁移到订单履约或发布审批时，替换业务状态、队列和补偿动作，保持四个不变量：重放不重复副作用，handoff 不扩权，checkpoint 可定位，iteration/token/time 预算可终止。真实队列事务、跨服务一致性、人工 SLA 和生产恢复仍需集成演练，不能把离线 runner 的一次 0→1→0 写成生产可靠性。"], table: { headers: ["故障", "下一检查", "修复/重跑"], rows: [["重复消息", "idempotency ledger/业务写入数", "恢复唯一 receipt 后重放"], ["从头执行", "checkpoint 原子性/hash", "从最后安全状态恢复"], ["无限循环", "iteration/token/time budget", "预算守卫并记录 stop reason"], ["handoff 扩权", "目标身份/scope/owner", "拒绝交接并人工接管"]], caption: "Workflow 的完成必须同时满足状态、权限和副作用不变量。" } };

const wave5Depth: Record<string, TutorialBlock> = {
  "TD-T13": { title: "T13 学员复盘与迁移清单", body: ["复盘时先把发布问题写成一句可否决的话：候选 B 是否只在批准的低风险切片替换 A。然后逐字段读取 manifest，确认每个 hash、时间窗、缓存策略、重试策略和工具权限都属于同一实验。只要发现两个自变量变化，就把结果标记 INVALID_COMPARISON，不继续计算胜负。对于每条退款失败，学员要保存输入、候选回答、证据引用、人工标签和风险严重度，让 reviewer 能判断它是模型回归、索引过期还是评测器变化。", "迁移时不能把 FAQ 的阈值、退款的 gold 文档或原实验的样本比例照搬到新的业务。先列出保持不变的实验不变量，再列出必须由业务 owner 重新批准的字段。若新领域没有独立 Oracle，正确交付是 UNKNOWN 和待补证据清单。最终工件包括 manifest diff、逐题配对表、风险切片 ledger、成本延迟卡、rollback manifest 和 owner receipt。"], table: { headers: ["复盘问题", "证据", "结论"], rows: [["是否唯一变量", "manifest diff", "否定则 INVALID"], ["是否覆盖风险", "slice ledger", "缺 blocker 则不放量"], ["是否可回退", "A hash/restore log", "不可恢复则暂停"], ["是否可迁移", "invariant/owner map", "未知项保持 UNKNOWN"]] } },
  "TD-T16": { title: "T16 学员复盘与迁移清单", body: ["复盘工具调用时按写前顺序检查，而不是按模型回答顺序检查：身份验证、tenant 匹配、scope 最小化、参数 Schema、审批、幂等键、policy receipt、adapter 执行和后端审计。任一层缺失都应在执行前停止。学员要把四类 fault 的 trace 与 zero-write 计数放在同一报告中，证明“没有真正写入”不是一句口头保证。", "迁移到发邮件、发通知或创建工单时，明确哪些动作可撤回、哪些会产生外部承诺，并为每类动作指定审批 owner 和补偿路径。测试脚本只能在 sandbox 运行；真实凭据、真实 endpoint、组织审批和数据删除必须是后续 integration gate。修复后重跑相同 fault，expected 不得因修复方便而改变。"], table: { headers: ["复盘问题", "证据", "结论"], rows: [["策略先于动作吗", "policy receipt/trace", "否定即阻断"], ["参数可证明安全吗", "schema/boundary report", "越界必须红"], ["重复是否幂等", "request ledger", "写入次数为 1"], ["迁移是否越权", "scope/owner map", "真实集成另行取证"]] } },
  "TD-T18": { title: "T18 学员复盘与迁移清单", body: ["复盘 Browser Agent 生成测试，依次读取需求风险、planner 场景、generator 代码、浏览器 Trace、后端状态和 mutation 报告。截图和页面文本只能证明界面观察；业务 Oracle 必须读到独立状态。若 auto_refunded mutation 后仍绿，先确认后端故障确实作用于同一隔离账户，再检查断言是否落在 manual_review_required 状态。healer 的每个 patch 都要显示 diff、理由和是否改变断言。", "迁移到支付或审批时，重新设计状态机、认证夹具、测试数据和副作用限制，并让人工 reviewer 在合并前确认风险 ID 与业务断言。不能因为 Playwright 命令可执行就推断跨浏览器、生产数据或真实用户任务已覆盖；这些均需另行建立证据。交付包括 risk-to-test map、seed manifest、Trace、mutation 结果、healer diff 和人工批准记录。"], table: { headers: ["复盘问题", "证据", "结论"], rows: [["测试来自真实风险吗", "risk ID/PRD locator", "无来源退回"], ["断言读业务状态吗", "backend Oracle", "仅 UI 不足"], ["变异能杀死吗", "fault report", "不变红即失败"], ["自愈保留语义吗", "patch diff/review", "不确定则人工"]] } },
  "TD-W02": { title: "W02 学员复盘与迁移清单", body: ["复盘 Workflow 时把事件时间线和状态机并排阅读：每次投递的 message_id、attempt、checkpoint hash、当前 owner、scope、幂等 receipt、写入结果和 stop reason 都要能对应。制造写入后崩溃时，第二次消费只能读取已存在 receipt；如果从头执行，说明 checkpoint 不具备恢复语义。制造无限循环时，预算守卫必须先于资源耗尽写出停止原因。", "迁移到订单履约、发布审批或告警处置时，重新定义合法状态、补偿动作、handoff owner 和人工 SLA，但保留重放不重复、交接不扩权、checkpoint 可定位、预算可终止四个不变量。真实事务隔离、跨服务一致性、队列重试语义和生产恢复必须通过 integration exercise 验证，不能用离线报告代替。"], table: { headers: ["复盘问题", "证据", "结论"], rows: [["能从 checkpoint 恢复吗", "state/event timeline", "否则阻断"], ["重放会副作用吗", "idempotency ledger", "写入必须一次"], ["循环会终止吗", "budget/stop receipt", "无 stop 即失败"], ["handoff 会扩权吗", "scope transition", "越权交人工"]] } },
};

for (const [id, block] of Object.entries(wave5Depth)) {
  wave2Expansions[id] = { ...wave2Expansions[id], body: [...wave2Expansions[id].body, ...block.body], table: block.table };
}
const wave5ExtraDepth: Record<string, TutorialBlock> = {
  "TD-T13": { title: "T13 交付演练：把 winner 变成可撤销决定", body: ["现在把一次‘候选 B 胜出’改写成评审会议可以直接使用的决策卡。第一行写范围：只覆盖退款政策、普通 FAQ、转人工三类 fixture；第二行写排除项：真实用户、在线检索、生产流量和组织审批均未运行。第三行列出证据链接，要求 reviewer 能从结论跳到 manifest、逐题输出、失败引用和人工 adjudication。若任何链接打不开，结论降级为待补证据，不得用总分填空。", "再做一次逆向演练：假设发布后退款错误增加，值班工程师只能拿到回退 manifest、风险切片 ledger 和最近一次 run_id。学员要在五分钟内指出回退版本、暂停范围、需要通知的 owner，以及哪一个实验假设需要重审。若工件缺少缓存状态、模型快照或数据集 hash，应把事故标为不可归因，先冻结发布再补齐审计字段。", "迁移条件必须逐项签字：新业务有独立 gold/Oracle；风险 owner 接受 blocker 阈值；A 与 B 的成本、延迟和重试预算可比；回退在隔离环境成功；报告明确哪些是真实集成、哪些仍是 fixture。只有条件全部满足，才可申请下一阶段 provider 或 practitioner gate。"], table: { headers: ["交付检查", "必须看到的工件", "缺失时动作"], rows: [["可追溯", "run_id→manifest→case output", "标记 UNKNOWN"], ["可回退", "A hash 与 restore log", "暂停放量"], ["可归因", "单变量与分母", "INVALID 重做"], ["可迁移", "Oracle/owner/阈值签字", "停在 fixture"]] } },
  "TD-T16": { title: "T16 交付演练：拒绝不是安全证明", body: ["用同一个退款 fixture 做四次对照：模型拒绝但 adapter 被绕过、adapter 拒绝但审计缺失、审计完整但幂等账本丢失、所有门禁齐全。学员逐次查看 trace 的 caller、tenant、scope、approval_id、参数单位、policy_version、write_count 和 request_id，判断哪一层真正承担了阻断责任。‘模型说不’只能记录为候选信号，服务端 write_count=0 与审计 receipt 才能成为副作用证据。", "故障修复要保留输入和预期，不能把 1000 元改回 10 元来制造绿灯。修复后先跑未认证、跨租户、金额越界、重复请求四个 fault，再跑合法只读和合法审批两个 baseline。比较 repair 前后 schema、policy、adapter 与 ledger 的 diff；若修复顺带扩大权限、取消人工审批或改变错误码，必须拆成新变更并重新评审。", "迁移到发邮件或建工单时，先写清不可逆后果：外发域名、附件、收件人数量、外部承诺和撤回窗口。为每个动作指定最小 scope、审批 owner、幂等键和补偿方案；如果 provider、真实凭据、网络出口或组织审批没有证据，就只提交静态合同和 sandbox report，不宣称可上线。"], table: { headers: ["证据层", "判断", "下一步"], rows: [["模型拒绝", "弱信号", "继续查服务端"], ["服务端 zero-write", "副作用受控", "核对审计"], ["幂等 receipt", "重试可控", "做重复投递"], ["真实 endpoint", "集成边界", "另开门禁"]] } },
  "TD-T18": { title: "T18 交付演练：从截图验收升级为业务验收", body: ["选一个‘已激活商品必须人工复核’的需求，把验收分成界面、网络、后端状态三层。界面层只记录按钮和文本；网络层记录请求参数、账户和响应；后端层记录 order_state、audit_event 和副作用计数。只有三层关联同一 seed、同一 risk_id、同一 mutation_run_id，测试才具有归因能力。缺后端证据时，报告只能说页面观察通过。", "故障回放要求先确认变异真的生效，再分析脚本。若 manual_review_required 被改成 auto_refunded 后仍通过，检查是否使用了旧账户、缓存响应、错误环境或只断言 URL；若变异杀死但 healer 删除状态断言，修复结果必须拒绝并交人工。重跑时保留原始脚本、patch diff、Trace 和 mutation 结果，证明修复没有把 Oracle 弱化。", "迁移到支付或审批流程时，业务 owner 重新定义不可接受状态、赔付风险和人工接管点；测试开发只迁移执行骨架，不复制订单 fixture。跨浏览器、认证刷新、真实外部系统和生产数据都要建立独立矩阵与证据 receipt，不能把 Playwright 在本机跑通等同于用户可用。"], table: { headers: ["验收层", "证据", "失败解释"], rows: [["界面", "截图/DOM", "只能说明可见"], ["网络", "request/response trace", "可查参数与环境"], ["业务", "state/audit/mutation", "决定检测力"], ["自愈", "patch 与人工记录", "不能静默改 expected"]] } },
  "TD-W02": { title: "W02 交付演练：故障恢复要有人能接手", body: ["把 msg-42 的恢复报告写成值班人员可以照着执行的 runbook：先读取最后 checkpoint，再核对 idempotency receipt 和当前 scope，随后判断是继续、回滚、暂停还是 handoff。每个动作必须写 owner、输入、预期事件和停止条件。恢复不是‘再试一次’，而是证明重放不会新增副作用，并且下一位接手者能知道系统为何停在当前状态。", "制造三种不同故障：写入后崩溃、checkpoint 损坏、人工审批超时。第一种只能重放为一次写入；第二种应进入安全 stopped 并请求人工重建 checkpoint；第三种应触发有预算的 handoff，不得绕过审批自动完成。将 event timeline、attempt、budget、scope、stop_reason 与修复前后状态放进同一 receipt，缺字段就拒绝宣称 recovered。", "迁移到发布审批或履约时，业务团队重新确认补偿动作、SLA、值班 owner 和可接受重复。保留状态转移的版本、事件幂等键、权限收缩和预算守卫；真实队列事务、跨服务一致性、断电恢复和生产告警需要 integration exercise。课程完成条件只是 fixture 中的恢复合同可解释、可复跑、可交接。"], table: { headers: ["故障", "安全动作", "不可接受动作"], rows: [["写后崩溃", "查 receipt 后幂等重放", "再次写入"], ["checkpoint 损坏", "stopped+人工重建", "从头盲跑"], ["审批超时", "预算内 handoff", "绕过审批"], ["权限变化", "重新计算 scope", "沿用旧 token"]] } },
};
const wave5FinalDepth: Record<string, TutorialBlock> = {
  "TD-T13": { title: "T13 最终检查：让评审者可以否决", body: ["评审者逐项回答：这个结论覆盖谁、排除了谁、失败由哪条独立 Oracle 判定、回退是否已经在 sandbox 复原、成本与延迟是否同预算可比。任何一项只能依赖口头说明时，评审者应直接选择否决并开补证任务。学员把否决理由写入 ledger，再由 owner 决定补样本、重跑、分流或回退；不能以‘整体看起来更好’替代风险切片证据。"], table: { headers: ["否决点", "最小证据"], rows: [["范围不清", "include/exclude 清单"], ["Oracle 不独立", "人工或规则基准"], ["回退未演练", "restore receipt"], ["预算不公平", "同预算 ledger"]] } },
  "TD-T16": { title: "T16 最终检查：把副作用证据交给审计", body: ["审计者不接受模型文本作为安全证明，只接受可查询的 identity、tenant、scope、policy、approval、idempotency 和 write_count。学员将合法与恶意请求放进同一对照表，标出每个请求在哪一层被拒绝、留下什么 receipt、是否触达真实 adapter。若无法证明后端未写入，就保持阻断状态并把凭据、endpoint、网络出口列为后续门禁，而不是补一句‘已安全’。"], table: { headers: ["审计问题", "可接受证据"], rows: [["谁发起", "caller identity"], ["能写什么", "scope/approval"], ["写了几次", "backend ledger"], ["如何复现", "request_id/trace"]] } },
  "TD-T18": { title: "T18 最终检查：把检测力写进验收单", body: ["验收单必须包含一个会被业务变异杀死的负例，以及一个不应被误报的正常例。学员先提交 baseline，再提交 mutation 后的 failed_oracle_ids，最后提交 repair 重跑；三份报告的 risk_id、seed、账户和状态版本必须闭合。若只有截图、DOM 或生成代码，没有业务状态变化与失败证据，结果只能标为候选脚本，不能进入回归套件。"], table: { headers: ["验收项", "通过证据"], rows: [["有风险来源", "risk-to-test map"], ["能发现故障", "mutation 变红"], ["修复未降级", "原 mutation 再次变红"], ["可交接", "Trace+owner receipt"]] } },
  "TD-W02": { title: "W02 最终检查：恢复结论必须可交接", body: ["交接前由第二位工程师只阅读 receipt，不听第一位工程师口述，尝试复现恢复路径。若他无法判断最后安全 checkpoint、当前权限、重复写入风险或停止原因，课程练习不算完成。学员把可继续、必须暂停、必须回滚、必须人工接管四种结论分别绑定状态、证据和 owner，避免把 stopped、failed 和 completed 混成一个成功字段。"], table: { headers: ["交接结论", "必须绑定"], rows: [["继续", "checkpoint+预算"], ["暂停", "stop_reason+owner"], ["回滚", "restore receipt"], ["接管", "scope+人工 SLA"]] } },
};
const wave5Closing: Record<string, TutorialBlock> = {
  "TD-T13": { title: "T13 练习提交说明", body: ["提交时不要只交一张分数截图。请同时交 A/B manifest、逐题配对结果、风险切片分母、失败案例原文、回退命令和 owner 决策。把一个会推翻候选 B 的反例写出来，并说明为什么它不能被 FAQ 平均分掩盖；再写一条迁移前提，说明新业务必须补哪一个 Oracle 或审批人。" ] },
  "TD-T16": { title: "T16 练习提交说明", body: ["提交时把合法请求、未认证请求、越界参数、跨租户请求和重复请求放在一张对照表。每行标出拒绝层、policy 版本、trace、write_count 和幂等 receipt。补写一段‘如果真实 endpoint 尚未接入，我不能推出什么’，并为下一阶段集成门禁列出凭据、审批和补偿事务的责任人。" ] },
  "TD-T18": { title: "T18 练习提交说明", body: ["提交时必须能从 risk_id 追到生成脚本、浏览器 Trace、后端 mutation 和 repair diff。请选择一个 healer 可能误改的断言，解释为什么要人工拒绝；再写出迁移到另一个业务状态机时需要重建的 fixture、Oracle、认证和人工 owner。没有后端状态证据的脚本只能进入候选区。" ] },
  "TD-W02": { title: "W02 练习提交说明", body: ["提交时交事件时间线、状态转移图、checkpoint、幂等账本、预算和 handoff receipt。请分别说明写后崩溃、checkpoint 损坏、审批超时应如何停止，以及什么情况下可以安全继续。迁移到真实队列前列出必须补的事务、告警、SLA 和人工接管证据，不能把离线重放报告当作生产恢复承诺。" ] },
};
const wave5Rubric: Record<string, TutorialBlock> = {
  "TD-T13": { title: "T13 评分量规", body: ["按可比性、风险覆盖、可回退性、可迁移性四项各给 0/1 分；任一高风险项为 0 即整体阻断。评分理由必须引用具体 run_id 和工件，不允许用‘感觉稳定’。"], table: { headers: ["维度", "1 分条件"], rows: [["可比性", "单变量且分母固定"], ["风险", "blocker 独立统计"], ["回退", "A 已复原"], ["迁移", "新 Oracle 已批准"]] } },
  "TD-T16": { title: "T16 评分量规", body: ["按身份边界、参数边界、副作用控制、审计可追溯四项评分；任何真实写入无法证明为零，或重复请求没有唯一 receipt，整体即阻断。将模型拒答与服务端拒绝分开计分。"], table: { headers: ["维度", "1 分条件"], rows: [["身份", "tenant/scope 强制"], ["参数", "越界稳定拒绝"], ["副作用", "zero-write 证据"], ["审计", "trace 可复现"]] } },
  "TD-T18": { title: "T18 评分量规", body: ["按风险来源、业务 Oracle、变异检测、自愈审查四项评分；没有后端状态或 mutation 结果时最多算界面观察，不得进入回归套件。healer 改 expected 必须判零分并人工接管。"], table: { headers: ["维度", "1 分条件"], rows: [["来源", "risk_id 可追溯"], ["Oracle", "独立状态可读"], ["变异", "故障杀死"], ["自愈", "断言语义保留"]] } },
  "TD-W02": { title: "W02 评分量规", body: ["按状态可解释、重放幂等、预算终止、交接不扩权四项评分；缺少 checkpoint 或 stop receipt 时，不得把最终 completed 当作恢复成功。第二位工程师无法仅凭工件接手时，交接项为零分。"], table: { headers: ["维度", "1 分条件"], rows: [["状态", "事件与状态闭合"], ["重放", "副作用仅一次"], ["预算", "有 stop reason"], ["交接", "scope 与 owner 明确"]] } },
};
const wave5Last: Record<string, TutorialBlock> = {
  "TD-T13": { title: "T13 反例练习", body: ["反例：B 的总体分数提高，但退款切片样本数从 48 变成 20，且两条失败样例被评测器标为格式问题。学员必须识别分母漂移与 Oracle 漂移，拒绝发布，恢复原分母并重跑；这一步训练的是在漂亮数字出现时仍能保护高风险用户。"] },
  "TD-T16": { title: "T16 反例练习", body: ["反例：工具返回 denied，但服务端审计显示已经创建退款单。学员要沿 trace 追到模型外的 adapter，证明拒答和副作用是两条不同事实；修复为服务端强制 policy，再用同一 request_id 重跑并核对写入次数，而不是修改 prompt 让模型更礼貌地拒绝。"] },
  "TD-T18": { title: "T18 反例练习", body: ["反例：mutation 把订单改成 auto_refunded，脚本因页面加载超时而失败，团队却把它当成检测到业务回归。学员需先修同步并确认变异生效，再看状态 Oracle 是否失败；若只因 timeout 变红，结果不得计为 mutation killed，避免把环境噪声当成质量收益。"] },
  "TD-W02": { title: "W02 反例练习", body: ["反例：系统最终显示 completed，但事件时间线有两次写入、一次无 owner 的 handoff 和一次预算耗尽。学员必须把结论降为恢复失败，按 receipt 追查重复副作用、权限转移和 stop reason；只有状态、权限、预算和副作用同时闭合，才可称为可恢复。"] },
};
const wave5Takeaway: Record<string, TutorialBlock> = {
  "TD-T13": { title: "T13 带走的工作习惯", body: ["以后每次模型升级都先问‘哪一个字段变了、谁承担风险、如何撤回’，再问分数是否上涨。把这三个问题写进模板化评审卡，能让新人从第一天形成可审计而非凭感觉的实验习惯。"] },
  "TD-T16": { title: "T16 带走的工作习惯", body: ["以后每接入一个新工具，都先画写前边界和 zero-write 证据链，再设计提示词。提示词只能降低误调用概率，不能替代服务端授权、幂等和审计；这条边界要在设计评审和故障复盘中重复检查。"] },
  "TD-T18": { title: "T18 带走的工作习惯", body: ["以后看到 Agent 自动生成了很多脚本，先问每个脚本是否有风险来源、业务 Oracle 和能杀死它的变异。没有这三项的脚本可以作为探索草稿，但不能冒充覆盖率或回归能力。"] },
  "TD-W02": { title: "W02 带走的工作习惯", body: ["以后设计长流程，先定义停止、交接和恢复，再定义成功路径。只要系统无法解释最后安全 checkpoint、当前权限和预算余量，就应停止并请求人工，而不是让 Agent 用更多重试掩盖状态缺失。"] },
};
const wave5Buffer: Record<string, TutorialBlock> = {
  "TD-T13": { title: "T13 最后一步", body: ["把结论、证据、未知和下一步分成四栏，交接时禁止把 UNKNOWN 改写成通过。"] },
  "TD-T16": { title: "T16 最后一步", body: ["把模型建议、策略决定、服务端执行和审计结果分栏保存，任何一栏缺证据都保持阻断。"] },
  "TD-T18": { title: "T18 最后一步", body: ["把页面观察、业务状态、变异结果和人工批准分栏保存，未杀死变异的脚本不进入回归。迁移时还要保留同一 risk_id 与状态版本，才能比较修复前后的检测力。"] },
  "TD-W02": { title: "W02 最后一步", body: ["把事件状态、权限范围、幂等结果、预算停止和人工接管分栏保存，缺一项就不称恢复成功。迁移时还要保留 checkpoint 版本和 owner 责任，才能让下一位值班人员安全接手。"] },
};
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
      { title: "架构、输入契约与可观察证据", body: [spec.scenario, control.metric], bullets: spec.workflow, expected: `固定 input、Schema、eval 和 mutation 已绑定；模型执行仍为 NOT_RUN。`, technical: { kind: "prompt", content: promptBody(`${promptBase}/task.md`), version: "1.0.0", promptPath: `${promptBase}/task.md`, manifestPath: `${promptBase}/manifest.json`, inputFixturePath: `${promptBase}/input.json`, outputSchemaPath: `${promptBase}/output.schema.json`, evaluationPath: `${promptBase}/eval.json` } },
      { title: "运行 baseline、故障与修复", body: [control.oracle, "命令依次保存 baseline、fault、repair 和 cycle-summary；只有内部退出语义精确为 0/1/0 时 cycle 才通过。"], expected: `${reportDir} 中四份 JSON；fault 有命名 failed_oracle_ids，repair 不覆盖 fault。`, technical: { kind: "command", content: command, manifestPath: `materials/llm-agent-quality/learner-materials/manifests/${spec.id}.json`, stepId: "cycle", workingDirectory: "materials/llm-agent-quality/learner-materials", expectedExitCode: 0, expectedArtifacts: [`${reportDir}/baseline.json`, `${reportDir}/fault.json`, `${reportDir}/repair.json`, `${reportDir}/cycle-summary.json`] } },
      { title: "从症状定位到安全修复", body: [spec.failure, `回滚：${control.rollback}`], warning: "删除 Oracle、改变 expected、扩大权限、增加预算或无限重试都属于制造假绿。" },
      { title: "人工门禁与迁移", body: [`决策 owner 检查原始输入、版本、failed Oracle、权限 receipt、成本和 residual risk；模型只能提供候选解释。`, control.transfer], bullets: ["来源上下文与目标上下文分开记录", "保持不变量，显式修改至少两项配置", "以故障仍能变红和零越权副作用作为成功标准"] },
      ...(wave2Expansions[spec.id] ? [wave2Expansions[spec.id]] : []),
      ...(wave5ExtraDepth[spec.id] ? [wave5ExtraDepth[spec.id]] : []),
      ...(wave5FinalDepth[spec.id] ? [wave5FinalDepth[spec.id]] : []),
      ...(wave5Closing[spec.id] ? [wave5Closing[spec.id]] : []),
      ...(wave5Rubric[spec.id] ? [wave5Rubric[spec.id]] : []),
      ...(wave5Last[spec.id] ? [wave5Last[spec.id]] : []),
      ...(wave5Takeaway[spec.id] ? [wave5Takeaway[spec.id]] : []),
      ...(wave5Buffer[spec.id] ? [wave5Buffer[spec.id]] : []),
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
  blocks: composeDeepPage(page.blocks, agentWorkflowDeepBlocks(page.id), ragQualityDeepBlocks(page.id)),
}));
