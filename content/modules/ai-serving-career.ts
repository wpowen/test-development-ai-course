import type { TutorialBlock, TutorialPage } from "../course.ts";
import { promptBody } from "../prompt-bodies.ts";
import { aiServingDeepBlocks } from "./ai-serving-deep.ts";
import { composeDeepPage } from "./deep-layer.ts";
import { careerEvolutionDeepBlocks } from "./career-evolution-deep.ts";

type ServingPageId = "TD-A01" | "TD-A02" | "TD-A03" | "TD-A04" | "TD-A05" | "TD-A06" | "TD-C01";

const bundle = "materials/ai-serving-career";

const sharedMaterials: NonNullable<TutorialPage["materials"]> = [
  { title: "AI Serving 与职业迁移完整实验包", description: "七页独立 manifest、Prompt/Input/Schema/Eval/Mutation、标准库 runner、证据和 hash closure。", href: "materials/ai-serving-career.zip", kind: "archive", validation: "fixture-tested" },
  { title: "共享实验 Runner", description: "只复用确定性执行机制；每页的控制问题、Oracle、fault 和 owner 均由独立 manifest 定义。", href: "materials/ai-serving-career/scripts/serving_lab.py", kind: "script", validation: "fixture-tested" },
  { title: "Bundle Owners", description: "显式记录 bundle、runner、内容、Oracle、职业建议和发布责任。", href: "materials/ai-serving-career/owners.json", kind: "config", validation: "static-reviewed" },
  { title: "Hash Closure", description: "逐文件 SHA-256、页级输入闭包与 ZIP 边界；不包含任何 live serving 声明。", href: "materials/ai-serving-career/closure-manifest.json", kind: "evidence", validation: "fixture-tested" },
];

type PageContract = {
  id: ServingPageId;
  moduleId: "TD-M09" | "TD-M10";
  title: string;
  type: TutorialPage["type"];
  duration: string;
  summary: string;
  why: string;
  prerequisites: string[];
  outcomes: string[];
  artifact: string;
  control: string;
  method: string;
  oracle: string;
  scenario: string;
  protocol: string;
  failure: string;
  repair: string;
  boundary: string;
  practice: string[];
  completion: string[];
  sourceIds: string[];
  nodes: string[];
};

const servingActions: Record<ServingPageId, string> = {
  "TD-A01": "给生成请求建立可重放版本指纹",
  "TD-A02": "把流式、工具与异步过程建成状态机",
  "TD-A03": "从 Token 事件重算延迟、Goodput 与成本",
  "TD-A04": "用到达守恒寻找 fixture 容量拐点",
  "TD-A05": "用单变量实验区分 Queue、GPU 与 KV Cache",
  "TD-A06": "用四类预算约束重试与降级",
  "TD-C01": "把岗位自评绑定可复验作品",
};

// Wave 3 learner-facing expansion: each page uses its own worked example and
// transfer checklist. These paragraphs are deliberately not shared scaffolding.
const wave3Expansion: Record<string, string[]> = {
  "TD-C01": [
    "worked example：把 UI 自动化工程师的现有能力拆成需求追踪、故障注入、AI Eval、Serving 可靠性和沟通治理五列；每列只填当前能打开的工件。证书和工具名称放在背景，不放在能力结论里。",
    "迁移条件：目标岗位必须写清负责、协作和禁止决定，并由具体组织 owner 提供 source_ref、版本和生效日期。没有这些组织证据时，公共责任状态只能用于学习规划，不能推断 P5/P6、薪资或录用。",
    "可观察工件：交付岗位路径图、能力自评 JSON、90 天计划和一份 portfolio receipt；每项 claim 都有 evidence_ref、reviewer、failure_cost、next_artifact 和 UNKNOWN 边界。",
    "实验步骤：先运行当前基线，再注入一条权限或 Oracle fault，最后修复并由独立 reviewer 复核。若作品只能展示成功截图，不能证明 independent-scoped-ownership。",
    "复用边界：换到另一团队时重新填写业务错误成本、数据权限、组织 policy、复评日期和就业决策 owner。本页 fixture、模型、集成、practitioner、learner、live、production 均 NOT_RUN。",
    "职业案例：把一次传统 UI 回归失败改写成 AI 测试作品时，先保留原始需求、风险切片、失败截图和修复提交，再新增数据集版本、模型/Prompt 指纹、独立 Oracle 与业务错误成本。作品集要让评审者看到你承担了哪一个决定，而不是只看到调用了什么工具。",
    "自评实验：为“能独立设计评测”写一个 0/1/0 证据合同。baseline 是按批准 fixture 运行，fault 是故意交换标签或放宽阈值，repair 是恢复数据与 Oracle；每次保存输入 hash、failed_oracle_ids、reviewer 和复评日期，不能把成功截图当能力证明。",
    "组织适配：同一份 serving 作品在客服、金融和内容团队的错误成本不同。迁移时逐项重填数据可用性、权限边界、owner、回滚、审批和 publication 状态；如果岗位 policy 没有 source_ref 或生效版本，就只能输出 UNKNOWN，不得自动映射职级或薪资。",
    "评审问答：评审者可追问“为什么这个指标支持你的决定”“故障先在哪里变红”“如果模型换版谁批准”“哪些结论还没运行”。学习者必须从 manifest、raw receipt 和 Metric Card 回答；回答不了时把缺口写入下一阶段实验，而不是用术语或证书数量掩盖。",
    "复用清单：复制本页 portfolio receipt 到新项目时保留 claim、evidence_ref、failure_cost、decision_rights、owner、version、review_date 和 limitation 八列，只替换业务字段。当前 static/fixture、provider、model、integration、practitioner、learner、live、production、publication 均 NOT_RUN，不能向外宣称已验证。",
  ],
  "TD-A01": [
    " worked example：退款解释接口同一请求连续出现两个不同结果时，先把 request_id、model_alias、prompt_hash、schema_hash、tool_version 和 region 写入一行 Manifest，再把每次差异归因到可见变量或 UNKNOWN。若只保存最终文本，无法判断是 Prompt 改动、动态路由还是模型内部修订；五层测试面必须分别给出 owner 和证据链接。",
    "迁移条件：把 fixture 迁移到真实 SDK 前，先固定 SDK 版本、鉴权租户、模型别名解析时间、采样参数与区域，并约定哪些供应商字段永远不可见。测试报告必须把“可复现”拆成协议可复现、输入可复现、路由可见性和行为复现四个结论，任何一个缺证据都只能写 UNKNOWN。",
    "可观察工件：交付一份带 hash 的 Manifest、一张错误分类表和一张版本可见性矩阵。复盘时抽查三条失败请求，确认每条都能从 request_id 找到原始输入、Oracle、重试决定和负责人；不能用 200、非空或漂亮文本替代版本证据。",
    "练习复盘：把一个浮动模型别名拆成四次调用记录，分别标出客户端可见、网关可见、供应商不可见和推断所得字段。对每个字段写“能否复现、由谁负责、缺失时怎么停”。如果学员只能写出一个总版本号，说明尚未理解生成服务的组合版本；应回到 Prompt、Schema、Tool 和采样层逐项补证。",
    "反例拆解：状态码、响应时间和非空文本都通过时，报告看似完整，却没有回答“这次回答由哪一个组合产生”。将 model_alias 固定而 Prompt hash 漂移，会造成测试结果无法比较；将内部 revision 猜成 v7，会把推断冒充证据。学员要把两种错误分别标成可观测性缺口和越界陈述，并写出阻断动作。",
    "交付检查：Manifest 至少包含输入脱敏标识、请求时间、request_id、协议版本、模型别名、Prompt/Schema/Tool hash、采样参数、区域、错误类别、retryable、owner 和证据级别。缺一个字段不能直接补默认值；必须说明字段不可见、采集失败或尚未执行，并把 UNKNOWN 传播到结论。",
    "复用路径：拿这张五层表去评审一个客服、代码生成或文档摘要接口时，只替换业务场景和 Oracle，不复制结论。先列协议共同项，再列生成新增项，最后逐项检查行为、成本与可靠性是否有真实 owner；这样模板是结构复用，不是把退款例子伪装成通用答案。",
    "小结练习：面对接口 200 但答案不稳定的问题，先收集五次相同输入的 request_id 和版本指纹，再判断是行为分布、路由漂移、Prompt 漂移还是字段不可见。每种候选都要有最小检查、阻断条件和修复后重放动作；如果只能说模型有随机性，说明还没有建立可审计测试面。",
  ],
  "TD-A02": [
    " worked example：退款助手先发送 SSE delta，再要求结构化审批建议，随后调用订单查询工具并提交异步合规任务。学习者要分别画四张状态机，标出取消、断流、Schema 合法但语义错误、工具超时和异步部分失败的出口；最终文本相同也不能合并这些状态。",
    "迁移条件：真实代理接入前逐项确认 SSE 心跳与代理缓冲、JSON Schema 版本、工具 allowlist/幂等键、task_id 回调签名和重放策略。任何一个状态没有明确 owner，就把该分支标为 BLOCKED，而不是用客户端重试掩盖；副作用账本必须独立于模型文本保存。",
    "可观察工件：交付事件 reducer、Schema+业务不变量清单、工具副作用账本和异步状态转移表。每个故障样例都记录“收到的最后事件、允许的下一事件、用户可见提示、是否重试和修复后终态”，这样新人可以直接复制表格改成自己的协议。",
    "练习复盘：给出一条 created、delta、tool_call、disconnect、retry、completed 的事件序列，让学习者标出第一个非法转移和最小修复。再把工具调用改成只读与写入两种模式，分别规定是否允许自动重试。最后把异步任务改成部分成功，要求输出“不可汇总为 completed”的理由和用户提示，避免只凭最终文本判定通过。",
    "评审问题：如果 Schema 合法但金额字段与订单状态冲突，应由哪个 Oracle 打红；如果回调重复到达，应由哪个账本去重；如果用户取消后服务仍完成，应记录哪一个终态。回答必须指向具体状态、字段和 owner，而不是写“加强监控”。",
    "状态机练习：SSE 需要区分首包、增量、结束和错误；结构化输出需要区分语法合法与字段不变量；工具调用需要区分请求、授权、执行、回填和副作用；异步任务需要区分提交、处理中、成功、失败、超时和取消。每张图都标出允许重试的边与禁止重试的边，避免四种协议被一条 happy path 淹没。",
    "故障解释：断流后文本仍然通顺，不代表 completed；Schema 通过但金额与订单不一致，不代表业务正确；工具返回 200 不代表副作用只发生一次；轮询得到空结果不代表任务失败。学习者要为每个误判写一条用户风险、一个最小检测和一条安全修复，再把 evidence_ref 放回重放报告。",
    "复用路径：将四态状态机用于 RAG 检索、Agent 规划或批量评测时，保留过程 Oracle 和副作用账本，只替换事件名、Schema 和业务不变量。任何新工具都先进入 allowlist 与幂等审查，任何新异步回调都先验证签名、task_id 去重和唯一终态，不能因为是只读场景就跳过过程验证。",
    "小结练习：把一条用户取消后仍收到结果的投诉拆成客户端取消、代理转发、服务生成、工具执行和回调落库五段，逐段写出可观察事件。最终报告同时给出用户可见结果、服务真实终态和是否产生副作用；三者不一致时优先修状态机和账本。",
  ],
  "TD-A03": [
    " worked example：同一批请求中，短聊天首 Token 很快但长报告 TPOT 变慢；不要用平均总延迟覆盖差异。学习者从 raw event 逐行标出 arrival、queue_end、first_token、last_token、quality_pass 和 cost_attempt，再计算 TTFT、TPOT、ITL、Goodput 与 cost_per_success，最后按场景和质量切片。",
    "迁移条件：接入真实 telemetry 前先定义时钟来源、Token 计数口径、流式空事件、重试归属和质量判定 owner。p95 只有在样本量、时间窗、请求类型和失败分母一起固定时才可比较；指标卡要写明统计窗口和缺失字段的 UNKNOWN 处理，不能拿 GPU 利用率替代用户体感。",
    "可观察工件：交付公式卡、原始事件 CSV、机器可读重算报告和一张分母审计表。审查者随机删除一条失败费用或一个质量标记，报告应立即显示 Goodput 或单位成功成本变化；如果删除字段仍然不影响结论，说明指标 Oracle 没有真正消费证据。",
    "练习复盘：先给出五条请求的事件表，其中一条首 Token 缺失、一条质量失败、一条重试两次。学习者必须说明哪些行能进入 TTFT 分位数、哪些行仍进入 Goodput 分母、失败费用如何摊入 cost_per_success。再将聊天和批处理分开切片，解释为什么同一个 p95 在不同 Token 分布下不能直接比较。",
    "迁移审查：当真实系统只返回总耗时而没有 Token 事件时，报告必须把 TPOT、ITL 和 prefill/decode 拆分标为 UNKNOWN，并提出最小新增采集字段。不能用采样估算填补缺失字段后宣称已完成指标建设；采集改动、数据保留和隐私 owner 都要进入迁移清单。",
    "指标推导：TTFT 关注请求到首 Token，TPOT 关注首末 Token 间生成速度，ITL 关注相邻 Token 间隔；三者分别暴露排队/prefill、decode 长尾和流式抖动。Goodput 不是“完成数除以时间”，而是满足质量、安全、完整性与 SLO 的成功数除以所有计划到达；cost_per_success 必须把失败和重试放回分子。",
    "切片练习：把短问答、长文档、工具调用和拒答分成四个 slice，分别记录 Token 长度、质量失败、重试次数和费用。若只公布总 p95，读者无法知道长上下文是否拖慢所有用户；若只公布平均成本，异常重试会被稀释。学习者应在报告中同时保留总体值和风险切片，并解释分母变化。",
    "复用路径：把事件模型交给日志、Trace 或数据仓库团队时，先提供字段字典和重算 SQL/脚本，再由业务 owner 确认 quality_pass。采集系统只能提供事实，不能自动决定“可接受”；指标门禁需要指定时间窗、样本量、缺失策略和人工风险接受者，避免 dashboard 颜色代替决策。",
    "小结练习：写一份指标审查单，逐项回答测量起点、测量终点、分母、切片、失败归属、重试归属、缺失处理和 owner。让另一名同学只看原始事件重算一次，再比较两份结果；若公式、分母或切片不同，先修定义卡再谈性能趋势。",
  ],
  "TD-A04": [
    " worked example：容量阶梯包含短聊天、长报告和工具请求三种 Token 分布，open-loop 每秒计划到达数固定，closed-loop 只作为单用户诊断。每一级都记录 completed、failed、dropped、queued，学习者要解释为何 dropped 被隐藏时 Goodput 会虚高，以及为何变慢后 closed-loop 会自动减小压力。",
    "迁移条件：迁移到真实压测前锁定 workload hash、输入/输出 Token 分布、缓存命中、到达率、并发、稳态时长、恢复窗口和停止条件。容量报告要把裸 RPS、SLO 合格吞吐和质量约束 Goodput 分开，并明确安全余量属于该版本、该流量切片，不能写成机器或供应商承诺。",
    "可观察工件：交付 workload Manifest、每级到达守恒表、阶梯曲线和停止/恢复记录。复盘者应能从计划到达数重新加总四类结果，并定位第一条 SLO 破坏发生在哪一级；若总数对不上，先修负载生成器或账本，不得继续解释拐点。",
    "练习复盘：将同一工作负载分别用 open-loop 和 closed-loop 运行，故意让响应时间在第三级翻倍。学习者要计算两种模型的实际到达数，并指出 closed-loop 为什么在系统变慢时自己减少压力。再把 dropped arrivals 从账本删除，要求写出被放大的 Goodput 与被掩盖的容量风险。",
    "容量决策：安全余量不是一个固定百分比。学习者需依据质量失败、长上下文比例、恢复速度和成本上界说明余量来源，并把“继续加压”“停止并修复生成器”“回退到前一级”三种动作绑定到不同证据。这样容量卡才是可执行决策，而不是一张漂亮曲线。",
    "负载构造：不要只发固定 Hello Prompt。先统计输入/输出 Token 分布、工具比例、缓存命中、请求优先级和质量风险，再用 workload hash 固定样本。短请求会掩盖 prefill，长请求会放大 KV，工具请求会把下游等待算进服务时间；每种人口都要有独立的 SLO 和 Goodput 口径。",
    "守恒推演：第三级计划 100 个到达，完成 62、失败 8、dropped 20、queued 10 才是完整账本。若只写完成 62，或把 dropped 从分母删掉，容量曲线会看起来更漂亮但完全不可用于容量决策。学习者要在每级结束后先验算守恒，再判断是否达到稳态，最后才允许计算拐点。",
    "复用路径：把阶梯实验交给真实环境前，先让平台 owner 审核停止条件和恢复窗口，数据 owner 审核脱敏与成本，业务 owner 审核质量切片。只有三者都确认，才能把 fixture 的实验设计迁移为受控压测；本页数字仍然不代表硬件能力、供应商限额或生产 SLA。",
    "小结练习：对每个容量级别写继续、停止、回退三种决策，并绑定到到达守恒、Goodput、SLO、成本和恢复证据。遇到 queued 长时间不归零时不能只等结果，应检查负载发送器、账本完整性和停止条件是否生效。",
  ],
  "TD-A05": [
    " worked example：一批长上下文请求 TTFT 上升，但 TPOT 稳定，GPU 利用率也同步升高。学习者先把 queue_time、prefill_time、decode_time、KV eviction、batch_size 和工具 span 放到同一 Trace，再降低到达率而不改变请求形状；若 TTFT 随 queue 占比下降，才可把排队升级为候选根因。",
    "迁移条件：真实服务通常看不到托管队列和 KV profiler，因此每个结论要区分直接证据、支持证据和反证。改变并发、Prompt 长度或 batch 时只能选一个变量，并保留前后 trace、资源快照、质量结果和回滚动作；没有对照实验，Dashboard 的相关性只能写 UNKNOWN。",
    "可观察工件：交付症状分流表、慢请求 Trace 对照、候选根因账本和单变量实验记录。新人拿到一条“服务慢”告警时，按 TTFT/TPOT、queue、prefill/decode、GPU/KV、下游工具顺序填写下一检查与修复动作，而不是直接申请扩容。",
    "练习复盘：准备四条相同总时长但阶段分解不同的 Trace：排队长、prefill 长、decode 长、工具长。学习者必须分别给出首个检查、支持证据、反证和最小修复；若只凭 GPU 利用率选择 GPU，判定为相关性误判。然后用一次只改到达率的对照，验证哪条假设被推翻。",
    "交接规则：当托管平台不提供 queue 或 KV 指标时，诊断报告不能把空白当成零。应记录缺失字段、请求平台补充的字段、临时替代信号及其误差风险，并把“不能定位”作为可交付结论。只有补齐 trace/profiler 后，才可把候选根因升级为 owner 的修复任务。",
    "阶段判别：TTFT 高而 TPOT 稳，优先排 Queue 或 Prefill；TTFT 稳而 TPOT/ITL 高，优先排 Decode；显存逼近上限且 eviction 增加，才有 KV 证据；模型 span 正常而总时长高，才看工具或下游。每次判别都要保存支持与反证，不能因为 GPU 利用率高就跳过队列检查。",
    "实验记录：假设 H1 是 Queue，改变到达率；H2 是 Prefill，改变输入长度；H3 是 Decode，改变输出长度或 batch；H4 是 KV，改变长上下文并发。一次只改变一个变量，保留不变项、预期信号、实际信号、结论和回滚；若预期信号不变，结论是推翻候选而不是实验失败。",
    "复用路径：把症状分流表接入值班流程时，告警必须携带 request_id、TTFT/TPOT、Token 数、queue/prefill/decode span 和版本信息。缺少关键字段的告警先进入 observability backlog，不能直接升级为扩容工单；这样减少误扩容，也能把平台可观测性缺口变成明确的工程任务。",
    "小结练习：给四个候选根因各写一条反证：Queue 反证是低到达率下 queue_time 仍低却 TTFT 高；Prefill 反证是输入长度不变而 prefill 不变；Decode 反证是 TPOT 稳定；KV 反证是无 eviction/preemption。诊断树必须能记录反证，否则只是按关键词猜答案。",
  ],
  "TD-A06": [
    " worked example：主模型先返回 429，工具提交已成功但客户端超时，随后 fallback 质量门禁失败。学习者按错误类别建立状态机，计算 attempt、deadline、token、cost 和副作用四类预算，说明为什么查询既有 task 状态比再次提交安全，以及为什么 fallback 失败时必须安全失败或转人工。",
    "迁移条件：真实限流策略要读取 Retry-After 并确认租户配额、幂等语义和 fallback 模型的质量/安全基线。预算必须在网关、SDK、工具层共享一个请求级 deadline；任何一层自行重试都会制造放大。恢复演练还要记录用户提示、降级原因、费用和回滚 owner，不能只看可用率。",
    "可观察工件：交付错误矩阵、预算计算表、幂等副作用账本和降级质量切片。复盘者随机把 Retry-After 改短、把质量门禁置 false 或增加一次重试，cycle 应分别打红并指出放大、成本或质量原因；修复后再以同一 request_id 验证唯一终态。",
    "练习复盘：把网关、SDK、工具三层的重试参数列成表，计算最坏调用次数、最长耗时和 Token 成本；只要任一项超过请求级预算就必须阻断。再分别注入 400、429、超时、拒答和输出截断，要求学习者选择重试、等待、改参数、降级或人工升级，并写出理由。",
    "降级评审：小模型、缓存答案、缩短输出和关闭工具不是同一种 fallback。每种降级都要有自己的质量、安全、隐私和用户提示断言；如果 fallback 质量门禁失败，系统只能安全失败或转人工。恢复后用同一 request_id 查终态，证明重试没有重复副作用，再记录回滚 owner 和复盘时间。",
    "预算推演：网关允许 2 次、SDK 允许 2 次、工具允许 2 次并不等于请求允许 6 次；如果层层叠加，最坏调用数会指数放大。把 attempt、总耗时、Token、费用和副作用作为同一请求的预算，任何一项越界就停止，并在报告中说明是等待、降级、人工还是安全失败。",
    "错误分流：400/401/策略拒绝通常不重试；429 读取 Retry-After 并受 deadline 限制；5xx 只在剩余预算允许时退避；超时先查 task 状态；输出截断需要检查参数和 Token 上限；工具已提交但客户端超时只能查询幂等状态。每条规则都要有可观察字段和 owner，不能写成“统一重试”。",
    "复用路径：把韧性状态机交给网关、SDK、工具和业务团队时，要求四方共同签署预算与质量边界。Fallback 的可用率提升不等于业务成功，降级原因必须进入用户提示和指标切片；恢复后用小流量、同一版本和明确回滚条件验证，不能直接宣称生产恢复。",
    "小结练习：复盘一次重试风暴时，先画调用拓扑，再按 request_id 汇总每层 attempt、等待时间、Token、费用和副作用。将放大倍数与质量下降并列展示，最后指定停止开关、人工升级条件和复测日期。",
  ],
};

const wave3Extra: Record<string, string[]> = {
  "TD-A02": [
    "协议评审工件：在状态机旁边增加事件字段字典，写清 event_id、sequence、request_id、task_id、tool_name、idempotency_key、finish_reason 和 error_class 的来源、允许为空的条件及保留时间。评审者先用非法顺序、重复回调、缺少结束事件和权限变更四个 mutation 逐项打红，再检查 repair 是否恢复唯一终态；这样协议检查可以被另一个项目直接复用，而不是只复述 SSE 概念。",
    "学习迁移：如果换成 RAG 或 Agent，过程仍然分为检索请求、候选文档、重排、生成、工具和异步回调，只是状态名不同。学员要把每个状态的输入、输出、超时、取消、重试和副作用写入同一张表，并标出哪些字段来自系统事实、哪些只是模型候选。没有过程证据时，最终答案再完整也只能保持 UNKNOWN。",
    "逐步演练：第一遍只验证 SSE 事件 reducer，输入一条正常序列和一条缺失 completed 的序列；第二遍加入 Structured Schema 合法但业务字段矛盾的样例；第三遍让工具请求在授权后超时，比较“重新执行”和“查询幂等状态”两种结果；第四遍让异步回调重复或乱序，检查 task_id、签名和唯一终态。每遍都保存输入 hash、预期红点、实际红点与修复后的重放结果，不能只截一张最终页面。",
    "新人复用时的最低标准：任何新协议至少有正常、取消、超时、重复、部分失败五类样例；每类样例至少有一个过程断言、一个终态断言和一个用户提示。只断言最终文本的用例归为低价值 smoke，不得作为流式、工具或异步可靠性证据。",
    "细节核对：SSE 的 sequence 必须连续，重复 delta 不能让客户端重复展示；Structured 的 JSON Schema 通过后仍要检查金额、权限和状态等字段关系；Tool 的 allowlist 只说明允许调用，不说明执行成功；Async 的 completed 只能在集合完整、签名有效且没有未处理失败时成立。把这些检查写进 reducer 和账本，才能在断线重试、代理缓冲和重复回调时保持可解释。",
    "协议产出评分：状态图只有节点没有非法边时不算完成；必须能从图直接找到一个 fault、一个 Oracle、一个用户提示和一个 repair。学习者用四个样例做交叉检查，确保取消不会被当成功、重复回调不会产生第二次副作用、Schema 语法通过不会跳过业务校验、异步部分失败不会汇总为完成。",
    "完整练习：为一个流式对话设计事件 reducer，先处理正常首包和增量，再处理乱序、重复、断开、错误和取消。为结构化输出设计字段不变量，至少覆盖金额与币种、权限与角色、状态与时间；为工具调用设计 allowlist、幂等键和副作用账本；为异步任务设计签名校验、轮询退避和部分失败聚合规则。完成后让同伴只看状态图执行四个 mutation，若无法判断应该阻断、重试还是转人工，说明状态出口仍不完整。",
    "协议门禁复盘：每个状态必须有进入条件、允许的下一事件、不可接受的事件、超时动作、取消动作和最终 owner。把这些条件写成表后，才能让新人从页面直接复制到自己的 API 评审；否则“支持流式和工具”仍然只是功能清单，无法指导测试或事故定位。",
  ],
  "TD-A03": [
    "指标审计工件：把一条请求的 arrival 到 completed 画成时间线，并在每个时间点标注 queue、prefill、first token、相邻 token、quality verdict、retry 和费用。再把时间线压成机器可读事件，要求同一脚本同时产出 p50/p95、Goodput 和单位成功成本；任何手工改动都必须留下 diff 和 owner。这样新人不仅会背公式，还能发现时间戳倒序、Token 少记和失败分母丢失。",
    "决策边界：当质量评测样本不足时，Goodput 不能用“暂时全部通过”补齐，应该输出证据不足并暂停容量结论；当成本账单延迟到达时，cost_per_success 先标 UNKNOWN，不用估算值伪装完成。只有业务 owner 确认质量条件、财务 owner 确认费用口径、平台 owner 确认时间戳后，指标才可以进入跨版本比较。",
    "手算检查：一条请求在 t=0 到达、t=120 结束排队、t=400 收到首 Token、t=1400 收到最后 Token，共 101 个输出 Token；另一条请求首 Token 缺失但最终失败。学员应明确第一条 TTFT=280ms、TPOT 按 100 个间隔计算，第二条不能进入成功延迟分位数却仍进入 Goodput 到达分母。这个小例子用来检查起点、终点、Token 间隔和失败分母是否真正理解。",
    "质量与性能分离：如果输出格式正确但事实错误，不能因为 TTFT 和 TPOT 达标就计入 Goodput；如果答案正确但安全策略拒绝，业务 owner 也不能擅自计为成功。页面工件要并列记录 latency_pass、quality_pass、safety_pass、completeness_pass 和 cost_attempt，说明哪个条件阻断了单位成功成本。",
    "统计复盘：同一 p95 可能来自少量极慢请求，也可能来自大量长上下文请求；必须同时查看样本数、分布、缺失比例和风险切片。若只保留一个百分位数，后续无法区分系统变慢、工作量变大还是失败被排除。学习者应把原始事件、聚合 SQL、过滤条件和图表一起归档，确保另一个人能从分母复算结论。",
    "指标落地：先给每个字段指定采集点和保留时长，再给每个公式指定 owner、质量条件和停止动作。指标平台不能自行猜测缺失 Token 或失败质量；缺失就显示 UNKNOWN，质量评测过期就阻断 Goodput。这样指标定义卡可以被研发、测试、数据和业务共同评审，而不是只在仪表盘里展示一个数字。",
    "完整练习：从原始事件创建一张逐请求核对表，列出 arrival、queue_end、first_token、token_events、last_token、finish_reason、quality_pass、safety_pass、retry_count 和 cost_attempt。对正常、截断、拒答、超时、重试成功、质量失败六类请求分别计算哪些指标可用、哪些指标必须排除、哪些记录仍进入 Goodput 分母。再把结果按短请求、长上下文、工具调用切片，说明为什么总体 p95 或平均成本不能替代风险切片。",
    "指标工程复盘：如果事件流缺少 first_token，就只能报告总耗时和缺失原因；如果 output_tokens 为 1，TPOT 分母不能出现除零；如果请求重试后成功，原始失败尝试仍要进入成本，不能只保留最后一次。学习者应为每个异常写校验规则、错误提示和修复责任，让指标脚本在数据坏时先阻断而不是静默给出数字。",
  ],
  "TD-A04": [
    "容量实验工件：每级压测记录 workload hash、计划到达、发送成功、完成、失败、dropped、queued、Goodput、SLO breach、恢复时间和成本。把第一级 warm-up 与稳态分开，不能把启动缓存命中当容量；把停止后的排空时间单独记录，不能把仍排队请求丢掉。报告要让复核者从原始账本重新算出拐点，而不是只接受一张折线图。",
    "方法迁移：open-loop 适合回答外部到达增加时系统何时失守，closed-loop 适合回答一个用户循环能达到什么上限，两者的分母、停止规则和结论不同。学员需在报告开头写明采用哪种模型、为何选择、哪些问题不能回答，并在 workload 变化、缓存变化或质量门禁变化时重新生成 hash，防止跨实验偷换输入。",
    "阶梯实验示例：第一级每秒 2 个请求稳定 10 分钟，第二级 4 个请求出现轻微 queue，第三极 8 个请求出现 dropped 和质量下降。不要直接说“4 QPS 是容量”；先确认第二级是否达到稳态、到达守恒是否完整、Goodput 是否满足业务门禁，再根据恢复窗口决定安全余量。若第三极停止后队列无法排空，报告要把恢复失败作为独立风险，而不是隐藏在平均延迟里。",
    "负载变更纪律：改变输出 Token 分布等同于改变工作量，改变缓存命中率等同于改变服务路径，改变工具比例等同于引入下游瓶颈；任何一项都必须新建 workload hash。学习者要在差异表中列出旧值、新值、预期影响和实际影响，避免把不同实验拼成一条虚假的容量趋势。",
    "容量复盘：当某一级 Goodput 下降时，先区分是质量门禁变严、请求被 dropped、队列未排空、Token 工作量变大还是服务本身变慢。每种解释都要对应一条账本字段和一个对照实验；若缺少字段，容量结论保持 UNKNOWN。这样“容量下降”不会被误报成单纯吞吐下降，也能避免无证据扩容。",
    "容量报告验收：复核者随机抽取一级压测，读取 workload hash、计划到达和四类结果，独立重算 Goodput 与 SLO breach。若与报告不一致，先标记账本或聚合逻辑缺陷；不能通过调整图表范围、隐藏 dropped 或删除失败行来“修复”趋势。验收通过后才可进入下一等级，保持逐级加压的可解释性。",
    "完整练习：设计一个五级阶梯，分别说明每级到达率、稳态时长、warm-up、排空窗口、停止条件和恢复条件。为每级构造短聊天、长报告和工具请求人口，并保持 workload hash 可追踪。运行后先验证 planned=completed+failed+dropped+queued，再判断 SLO、Goodput、质量和成本是否满足；如果第三级开始 queue 不归零，必须停止并记录恢复失败，而不是继续追求更高裸 RPS。最后用 open-loop 与 closed-loop 对照解释 coordinated omission，并写出该实验不能证明的真实硬件或生产结论。",
    "容量解释复盘：一个级别的平均延迟下降可能只是发送器因变慢而自动减压，也可能是长请求比例减少；因此每级必须比较实际到达、Token 工作量、人口比例和排队排空时间。学习者要把“容量增加”“负载变轻”“统计口径改变”三种解释分开，并为每种解释指定下一次实验，避免把图表变化直接写成系统升级效果。",
  ],
  "TD-A05": [
    "诊断工件：每个候选根因至少记录症状、直接证据、支持证据、反证、下一检查、单变量改变、预期信号、实际信号、修复动作和复跑结果。若 queue_time、prefill_time、decode_time 不能加总到总时延，先修 trace 采集；若 GPU 饱和但 queue 占比更高，GPU 只能作为伴随信号。这个账本让团队可以复盘错误假设，而不是只保留最终猜测。",
    "可观测性迁移：真实托管 API 可能只给 request latency 和 token 数，不给队列、batch 或 KV eviction。此时要建立“可见指标→可推断范围→不可推断结论”三列，明确请求平台补充什么 telemetry，并为临时替代指标写误差风险。没有 profiler 的页面不能承诺扩 GPU 有效，没有 queue 的页面不能承诺调并发有效，保持 UNKNOWN 本身就是质量结果。",
    "诊断对话示例：开发者说“GPU 90% 所以 GPU 是瓶颈”，测试开发先问 TTFT/TPOT 哪个升高、queue_time 占比多少、长上下文是否触发 eviction、工具 span 是否变长。若只拿到 GPU 曲线而拿不到阶段 Trace，正确答复是“当前只能确认伴随信号，不能确认根因”，并创建 telemetry 补齐任务。这个沟通工件能防止高成本扩容先于证据。",
    "复测要求：每个修复都要以同一 workload、同一模型/Prompt 版本、同一质量门禁重跑，并保留修复前后的阶段占比。只看到总延迟下降还不够，必须说明是 queue、prefill、decode、KV 或下游哪一项变化，以及是否把成本、质量或其他切片的风险转移了。",
    "边界判定：如果 queue、prefill、decode 三段加总不等于总延迟，不能先选一个最像的根因；应先把 trace 采集修到可加总。若 KV eviction 只有计数没有上下文长度和 preemption 对照，也只能写“存在相关信号”。诊断报告必须同时展示直接测量、推断链条和未知项，防止把可观测性缺口包装成确定结论。",
    "诊断报告验收：四行诊断表的每一行都要能从症状跳到层、下一检查和修复/复跑，且至少有一行明确写 UNKNOWN 条件。若所有行最终都指向扩容，说明分流树没有区分 Queue、Prefill、Decode、KV 和下游；若没有复跑动作，说明结论无法被验证。",
    "完整练习：准备五条慢请求 Trace，分别模拟 Queue、Prefill、Decode/GPU、KV eviction 和工具下游。学习者先不看 fault 标签，只按症状填写疑似层、下一检查、支持证据和反证；再对每个候选设计只改变一个变量的实验，并写出预期信号、实际信号、修复动作和复跑结果。要求至少一次实验推翻原假设，并把该失败作为有效证据保留。若阶段时间不能加总、profiler 缺失或队列不可见，报告必须写 UNKNOWN 与 telemetry 补齐任务，而不是猜一个根因。",
    "诊断沟通复盘：向平台团队提单时不要只写“服务很慢”，要附 request_id、TTFT/TPOT、Token 数、阶段 span、到达率、版本和质量结果，并明确希望验证的假设。平台返回“GPU 正常”也不能结束调查，因为仍需确认 Queue、KV 和下游；测试开发要把每次来回转换成证据、反证或新的 UNKNOWN，而不是把沟通结论当作 profiler 事实。",
  ],
  "TD-A06": [
    "韧性工件：把一次请求的 deadline 画成时间预算条，标出网关、模型、工具、等待和回退各自上限；再把 attempt、Retry-After、Token、费用和副作用账本串起来。若工具已经提交而客户端超时，恢复动作只能查询幂等状态；若质量门禁失败，降级状态必须可见并转人工。每条恢复路径都需要对应的用户提示和回滚 owner。",
    "评审迁移：把 retry policy 从一个 SDK 移到另一个 SDK 时，先对照错误分类、退避、jitter、deadline 传播、幂等键和费用计量，不能只复制 max_attempts。将 429、5xx、超时、拒答、截断和安全拒绝各跑一次负控制，比较放大倍数和质量变化；任何策略在 fixture 通过，都不意味着真实供应商配额或生产恢复已经验证。",
    "状态机细化：请求进入后先取得 deadline，再根据错误类别选择等待、重试、换参数、fallback、人工或安全失败；每一次转移都写入 attempt、剩余时间、预计 Token、费用和副作用状态。若剩余时间不足，即使错误可重试也要停止；若工具副作用未知，必须查询状态而不是再次提交。这样“有重试”才变成有界、可解释的恢复策略。",
    "复盘输出：一份高质量报告不只写“恢复成功”，还要列出原始错误、Retry-After、每次退避、实际模型、降级原因、质量/安全结果、用户提示、总费用、最终 task 状态和回滚 owner。将这些字段按 request_id 串起来，才能区分服务恢复、用户体验恢复和业务结果恢复；三者任意一个缺失，都不能写成生产可用。",
  ],
};

const contracts: PageContract[] = [
  {
    id: "TD-A01", moduleId: "TD-M09", title: "普通 API 与 AI API：从确定性响应到版本化生成服务", type: "概念", duration: "45 分钟",
    summary: "用同一张契约图比较普通 REST 与生成式 AI API，识别协议、模型行为、算力、成本和生产可靠性五个测试面。",
    why: "只复用状态码与 JSON 断言，会漏掉模型/Prompt/Schema/Tool 版本、流式阶段、Token 成本、概率行为和服务内部不可见项。",
    prerequisites: ["TD-F04", "TD-PS01"], outcomes: ["区分普通 API 与 AI API 的共同面和新增面", "建立版本 Manifest 与错误分类", "明确供应商内部版本的 UNKNOWN 边界"], artifact: "AI API 测试面、请求 Manifest 与错误分类表",
    control: "怎样证明一次 AI API 结果来自哪组协议、模型、Prompt、上下文、采样、Schema、工具和区域变量，而不把动态别名当固定版本？",
    method: "先保留 HTTP/鉴权/幂等共同契约，再增加生成 Manifest、行为 Oracle、Token/成本与可靠性层；因为供应商内部版本不可见时只能记录 UNKNOWN，不能伪造可复现性。",
    oracle: "request_id 存在；公开版本变量齐全；动态或内部版本明确 UNKNOWN；错误类别带 retryable 决策；工具副作用不由最终文本替代。",
    scenario: "同一个退款解释请求分别调用普通规则 API 与生成式 API；后者还携带模型别名、Prompt hash、上下文、采样、输出 Schema 和工具定义。",
    protocol: "把输入划为 protocol、generation_manifest、behavior、serving_metrics、reliability 五层；每层有独立证据与 owner。",
    failure: "删除 request_id 并把内部模型版本写成伪造的固定值，门禁必须同时报告追踪和可复现性失败。",
    repair: "恢复 request_id，将不可见内部版本改为 UNKNOWN，并保留可见模型别名、Prompt hash、Schema 和工具版本。",
    boundary: "本页仅运行离线 manifest fixture；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。没有调用供应商 API，不证明真实模型行为、当前限额、集成环境、实践者复核、学习者完成、线上服务或生产 SLA。",
    practice: ["把一个普通订单 API 与生成式解释 API 对齐成五层测试面", "为 400/401/429/5xx/安全拒绝写 retryable 分类", "生成一份不伪造内部版本的请求 Manifest"],
    completion: ["共同协议与 AI 新增变量分开", "未知供应商内部状态显式为 UNKNOWN", "错误分类能驱动重试或安全失败"], sourceIds: ["S44", "S56", "S57", "S58"], nodes: ["客户端", "HTTP/鉴权", "生成 Manifest", "模型/Prompt/Tool", "Token/成本", "Telemetry", "错误与发布门禁"],
  },
  {
    id: "TD-A02", moduleId: "TD-M09", title: "AI API 协议：Streaming、Structured、Tool 与 Async", type: "跟做", duration: "60 分钟",
    summary: "用四个状态机分别验证 SSE 流、结构化输出、工具调用和异步任务，避免最终文本掩盖中途失败与真实副作用。",
    why: "流中断、JSON 语义错误、工具重复执行和批任务部分失败，都可能在最终界面看似成功。",
    prerequisites: ["TD-A01"], outcomes: ["验证 SSE 事件顺序和取消", "分开 Schema 与业务语义 Oracle", "证明工具幂等和异步唯一终态"], artifact: "四协议状态机、故障矩阵与重放报告",
    control: "怎样证明 streaming、structured output、tool call 和 async job 的过程与终态都合法，并且取消或重试不会重复副作用？",
    method: "为四种交互建立独立状态机：SSE 查事件顺序，Structured 查 Schema+语义，Tool 查权限+账本，Async 查状态集合+回调去重；最终文本不能合并这些 Oracle。",
    oracle: "流事件有 created→delta*→completed/error 唯一终态；Schema 与业务语义均通过；工具 side_effect_count 至多一；异步任务部分失败不汇总成 completed。",
    scenario: "退款助手流式解释政策，随后输出结构化审批建议、调用只读订单工具，并提交一个异步合规检查任务。",
    protocol: "SSE 使用事件 reducer；Structured 使用 JSON Schema 与字段间不变量；Tool 使用 allowlist、确认和幂等键；Async 使用 task_id、回调签名和集合完整性。",
    failure: "客户端断连后重试导致工具 side_effect_count=2，门禁必须由账本 Oracle 打红，而不是接受第二次友好回答。",
    repair: "恢复幂等键与状态查询；重放同一 request_id 时返回已有终态，不再次执行工具。",
    boundary: "本页仅运行离线事件和账本 fixture；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。没有运行真实 SSE 分片、代理缓冲、工具或任务队列，也不把协议夹具写成线上集成、实践者复核、学习者完成或生产结论。",
    practice: ["画出 SSE 合法与非法序列", "为 Structured 输出补三个业务不变量", "模拟断连重试并用副作用账本证明幂等"], completion: ["四类协议分别有过程 Oracle", "工具结果由真实状态 fixture 验证", "任务只有一个可解释终态"], sourceIds: ["S56", "S57", "S58"], nodes: ["请求", "SSE reducer", "Schema+语义", "Tool 权限/幂等", "Async 状态机", "副作用账本", "协议门禁"],
  },
  {
    id: "TD-A03", moduleId: "TD-M09", title: "AI Serving 指标：TTFT、TPOT、ITL、Goodput 与单位成功成本", type: "跟做", duration: "55 分钟",
    summary: "从时间戳和 Token 事件计算用户体感、生成速度、有效吞吐与成本，并明确分母和切片。",
    why: "总延迟或 GPU 利用率不能区分排队、prefill 与 decode，也会把质量失败、截断和昂贵重试计入成功吞吐。",
    prerequisites: ["TD-A02", "TD-PS09"], outcomes: ["从事件计算 TTFT/TPOT/ITL", "定义质量约束的 Goodput", "计算含失败成本的 cost_per_success"], artifact: "指标公式卡、事件夹具与机器可读报告",
    control: "怎样让 TTFT、TPOT、ITL、Goodput 和 cost_per_success 的时间点、分母、切片与质量条件都可重算？",
    method: "从请求、首 Token、逐 Token 和终态时间戳计算延迟；Goodput 只计同时满足质量、安全、完整性和 SLO 的请求；所有尝试成本进入单位成功成本。",
    oracle: "TTFT=first-start；TPOT=(last-first)/(output_tokens-1)；ITL 分布来自相邻事件；Goodput 分母含所有到达；cost_per_success 含失败与重试成本。",
    scenario: "同一 serving fixture 含短聊天、长报告与工具请求；每条保存到达、排队、首 Token、Token 间隔、终态、质量和成本。",
    protocol: "先验证事件单调与 Token 计数，再计算 p50/p95 切片；指标定义和阈值分开，阈值只属于本 fixture。",
    failure: "把质量失败请求计入 Goodput 并从成本分母删除失败尝试，门禁必须同时报告有效吞吐和单位成本失真。",
    repair: "恢复全到达分母和 quality_pass 条件，重算所有尝试成本；阈值不外推到任何真实模型。",
    boundary: "本页仅运行确定性时间戳 fixture；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。时间戳、Token、成本和分位数不代表任何真实模型、GPU、供应商、集成环境、实践者复核、学习者完成或生产性能。",
    practice: ["从一条 Token 时间线手算 TTFT/TPOT/ITL", "为聊天与批任务分别写 Goodput 条件", "把失败与重试费用纳入 cost_per_success"], completion: ["公式可由原始事件重算", "Goodput 不含质量或安全失败", "容量与成本结论标明 fixture-only"], sourceIds: ["S51", "S52", "S53", "S54"], nodes: ["到达", "Queue", "Prefill/首 Token", "Decode/ITL", "终态/质量", "Goodput", "成本门禁"],
  },
  {
    id: "TD-A04", moduleId: "TD-M09", title: "AI Serving 负载与容量：从 Token 分布到 SLO 拐点", type: "跟做", duration: "60 分钟",
    summary: "组合输入/输出 Token、到达率、并发、缓存和质量切片，比较开放/封闭负载并找出 fixture 的 Goodput 拐点。",
    why: "固定 Hello Prompt 和固定并发会在系统变慢时自动降低发送速率，造成 coordinated omission，并掩盖排队和 dropped arrivals。",
    prerequisites: ["TD-A03"], outcomes: ["构建 Token 与场景工作负载", "比较 open/closed 模型", "给出 fixture Goodput 拐点和安全余量"], artifact: "工作负载 Manifest、阶梯实验与容量报告",
    control: "怎样在到达率、Token 长度、缓存、场景和质量条件固定可审计时，找到 SLO 拐点且不发生 coordinated omission？",
    method: "open-loop 保持外部到达并记录 dropped arrivals，closed-loop 诊断单用户上限；阶梯加压每级保留稳态、停止和恢复窗口；容量只按 Goodput 判定。",
    oracle: "计划到达数=完成+失败+dropped+仍排队；每级 workload hash 稳定；SLO 破坏后停止；fixture 最大稳定 Goodput 与安全余量可重算。",
    scenario: "三档到达率覆盖短聊天、长报告和工具调用，输入/输出 Token 分布与缓存命中固定；故障档隐藏 dropped arrivals。",
    protocol: "先校验负载生成器自身发送能力，再比较 open/closed；每级只改到达率，保存 TTFT/TPOT/Goodput/queue/cost 与恢复证据。",
    failure: "删除 dropped arrivals 并只报告已完成请求，使容量看似提高；守恒 Oracle 必须阻断。",
    repair: "恢复到达账本和排队项，把失败/dropped 纳入容量分母；报告继续标记 fixture-only。",
    boundary: "本页只运行合成负载、虚拟时间与固定到达账本；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。没有网络、真实模型、GPU、调度器、缓存、生产流量或真实容量数据。报告中的到达率、Goodput 拐点与安全余量仅用于证明 fixture 门禁能发现守恒缺失，禁止外推为任何硬件、供应商、集成环境、实践者复核、学习者完成或生产 SLA。",
    practice: ["构造三类 Token 长度切片", "比较 open/closed 模型在变慢时的发送差异", "找出 fixture 拐点并写安全余量理由"], completion: ["到达守恒可核对", "容量基于 Goodput 而非裸 RPS", "没有将 fixture 数字写成硬件承诺"], sourceIds: ["S51", "S52", "S53"], nodes: ["Workload 分布", "Open/Closed 生成器", "Serving Queue", "Token 执行", "SLO/质量", "Goodput 拐点", "停止/恢复"],
  },
  {
    id: "TD-A05", moduleId: "TD-M09", title: "AI Serving 瓶颈：Queue、GPU、KV Cache 与阶段诊断", type: "诊断", duration: "55 分钟",
    summary: "沿用户症状、阶段指标、Trace、资源信号和单变量实验定位排队、prefill、decode、KV Cache 或下游瓶颈。",
    why: "“模型慢”不是根因；直接扩 GPU、缩 Prompt 或开缓存，可能只移动瓶颈并让质量或成本变差。",
    prerequisites: ["TD-A04"], outcomes: ["按 TTFT/TPOT 症状分流", "关联 queue/GPU/KV 与请求 Trace", "用单变量实验推翻候选根因"], artifact: "瓶颈诊断树、Trace 对照和实验记录",
    control: "怎样从 TTFT/TPOT/ITL 症状定位 Queue、prefill、decode、GPU、KV Cache 或工具瓶颈，并用单变量证据避免相关性误判？",
    method: "先按阶段症状分流，再把慢请求与 queue_time、prefill、decode、GPU memory、KV usage、batch 和工具 span 对齐；最后每次只改变一个变量。",
    oracle: "TTFT 高且 queue 占主要比例指向排队；TPOT 高且 decode/GPU 饱和指向生成；KV 高必须伴随 eviction/preemption 或对照实验；托管内部指标缺失保持 UNKNOWN。",
    scenario: "一组长上下文请求出现高 TTFT；fixture 同时提供 queue、prefill、decode、GPU、KV 和 Trace，候选 fault 把根因错误标为 GPU。",
    protocol: "保存假设、支持证据、反证、单变量变更和结论；Dashboard 相关性不能直接升级为 root cause。",
    failure: "忽略 queue_time，因 GPU 利用率同时升高便宣称 GPU 是根因；诊断一致性门禁必须失败。",
    repair: "恢复阶段占比判断，用降低到达率的单变量结果确认 queue 根因；GPU/KV 只保留次要或 UNKNOWN。",
    boundary: "离线 telemetry fixture；托管 API、GPU profiler 和真实 KV Cache 均未运行。",
    practice: ["为 TTFT 高、TPOT 高和 Agent 慢各画路径", "用 queue 占比和对照实验推翻一个错误根因", "为不可见的托管指标写 UNKNOWN"], completion: ["结论回链到慢请求和阶段证据", "相关性经过单变量实验", "内部指标缺失不被伪造"], sourceIds: ["S51", "S53", "S54", "S55"], nodes: ["用户症状", "Request Trace", "Queue/Prefill/Decode", "GPU/Memory", "KV Cache", "单变量实验", "诊断结论"],
  },
  {
    id: "TD-A06", moduleId: "TD-M09", title: "AI Serving 韧性：限流、Timeout、Retry、Fallback 与 Degradation", type: "诊断", duration: "60 分钟",
    summary: "按错误类别、deadline、次数/时间/Token/成本预算和副作用设计恢复；将 fallback 的质量与安全变化纳入门禁。",
    why: "生成请求昂贵且长尾明显；盲目重试会扩大排队和成本，工具调用可能重复执行，回退模型也会改变格式、质量与安全。",
    prerequisites: ["TD-A05"], outcomes: ["按错误分类重试或拒绝", "验证 deadline 与四类 retry budget", "为 fallback/degradation 设置独立质量 Gate"], artifact: "韧性状态机、故障矩阵与恢复证据",
    control: "怎样保证 429、5xx、超时和断流下重试有界、工具副作用不重复，fallback/degradation 不会无声突破质量与安全底线？",
    method: "先分类错误，再传播 deadline；次数、总时间、Token/费用和副作用共同限制重试；指数退避+jitter 防同步放大；每条 fallback 有独立评测和用户提示。",
    oracle: "400/401/策略拒绝不重试；429 尊重 Retry-After；attempt/time/cost 均不超预算；同一幂等键副作用至多一；fallback quality_gate=true 才可使用。",
    scenario: "主模型连续返回 429，工具第一次已提交但客户端超时；候选策略无限重试并静默切小模型。",
    protocol: "故障矩阵逐项保存原始错误、每次 attempt、退避、实际模型、费用、副作用、降级原因和恢复后小流量验证。",
    failure: "attempts=8、忽略 Retry-After、fallback_quality=false，门禁必须同时报放大、成本和无声质量降级。",
    repair: "恢复三次以内、deadline/cost budget、幂等状态查询与安全失败；未通过质量门禁时转人工。",
    boundary: "本页仅运行离线错误和预算 fixture；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。未验证真实供应商配额、Retry-After、fallback 模型、集成环境、实践者复核、学习者完成、线上调用或生产恢复。",
    practice: ["为 400/401/429/5xx/超时写处理表", "计算一次重试风暴的 call/cost amplification", "为小模型 fallback 写独立质量切片"], completion: ["不可重试错误不会循环", "重试同时受四类预算约束", "回退失败时安全失败或转人工"], sourceIds: ["S46", "S57", "S59"], nodes: ["错误分类", "Deadline", "Retry Budget", "Backoff/Jitter", "幂等账本", "Fallback Gate", "恢复验证"],
  },
  {
    id: "TD-C01", moduleId: "TD-M10", title: "职业能力迁移：岗位路径、自评证据与作品集边界", type: "项目", duration: "60 分钟",
    summary: "把传统测试能力映射到 Quality Engineering、AI Eval、开发者生产力和 Reliability/Platform，并用可复验工件完成自评。",
    why: "工具清单和就业口号不能证明能力；职业迁移需要当前基线、目标岗位责任、能力差距、作品证据和明确的非承诺边界。",
    prerequisites: ["TD-A06", "TD-T12"], outcomes: ["选择可组合而非互斥的岗位路径", "完成带证据的能力自评", "设计不夸大成熟度的作品集"], artifact: "岗位路径图、能力自评 JSON、90 天计划与作品集证据表",
    control: "怎样把已有测试能力迁移到可验证的新责任，并用作品证明，而不承诺就业、薪资或某一岗位必然存在？",
    method: "先以 O*NET/SFIA/ISTQB/NIST 等职业与能力框架建立责任基线，再按风险设计、代码/数据、AI Eval、serving/可靠性、沟通治理五维自评；每个分数必须绑定 evidence_ref。",
    oracle: "目标岗位写清负责/协作/禁止边界；每项自评分有证据或 UNKNOWN；90 天计划包含 baseline→fault→repair 工件；employment_guarantee=false。",
    scenario: "一名 UI 自动化测试工程师希望迁移到 AI Quality/Eval 与 Reliability 的组合路线，需要选择 90 天可交付作品而非堆积证书。",
    protocol: "能力自评不是人格或潜力判断；只记录当前可验证工件、待补缺口、练习计划和复评日期，招聘结论由具体组织独立决定。",
    failure: "将证书数量当能力证据并写入‘完成课程即可就业’，同时缺少失败检测工件；职业边界门禁必须失败。",
    repair: "删除就业承诺，把每个能力等级绑定需求追踪、自动化、AI Eval、容量/韧性或治理作品，并给出 30/60/90 天复评。",
    boundary: "本页仅为 static/fixture-tested 职业自评；provider、model、integration、practitioner、learner、live、production、publication 均 NOT_RUN，不构成就业、晋升、薪资、地区需求或个体适配保证。",
    practice: ["完成五维能力自评并为每项添加 evidence_ref", "选择两条可组合路线并写清岗位边界", "设计一个能让坏版本变红的 90 天作品"], completion: ["自评无证据项标 UNKNOWN", "作品区分 desk/fixture/live/production", "文档明确不承诺就业或岗位结果"], sourceIds: ["S23", "S60", "S62", "S64"], nodes: ["当前能力基线", "岗位责任", "五维差距", "90 天计划", "作品集证据", "人工复评", "非就业承诺边界"],
  },
];

const technicalBlocks = (page: PageContract): TutorialBlock[] => {
  const id = page.id;
  const action = servingActions[id];
  const wave5 = id === "TD-C01" ? [
    "Wave5 worked decision：把“我想转 AI 测试”改成可审查的岗位决策。先列 AI Eval、Serving 可靠性、质量平台治理三条路径，为每条填写可承担决策、最低工件、失败成本、组织 owner 和 90 天复评；只有工具熟练度而无独立 Oracle 时，仍是 guided-execution。",
    "故障诊断：当 portfolio 评审者说“报告像模型摘要”，沿 Evidence→Inference→Unknown 回溯 raw input、fault、failed_oracle_ids、版本 hash、reviewer 和复评日期。缺一项就修证据链，不用术语或截图数量掩盖；修复后让另一名评审者仅凭 receipt 重建决定。",
    "主题实验：以 RAG 评测为例，baseline 使用固定检索集和人工 gold，fault 将过期文档置首位，repair 恢复有效期过滤与证据 Oracle。作品集同时展示检索命中、证据支持、最终答案和风险切片，不能只放回答文本或 F1。",
    "迁移工件：交付 role-decision-card.json、portfolio-receipt.json、organization-adapter-draft.yaml 和 90-day-review.md；editable_fields 含业务错误成本、数据权限、模型/Prompt 版本、复评人、回滚 owner、发布日期和适用人群。无组织 source_ref 时保持 INTERNAL-UNKNOWN。",
    "同行复盘：让招聘经理、平台 owner 和业务风险 owner 分别追问“证明了什么”“失败伤害谁”“换模型谁批准”，把问题记为 reviewer objections 并链接工件或 UNKNOWN。只能回答模型输出漂亮时，回到 guided 练习。",
    "边界复用：结构可复制到测试开发、RAG、Agent 或 Serving 岗位，但样本、Oracle、风险和组织 policy 必须重建。当前 static/fixture、provider、model、integration、practitioner、learner、live、production、publication 均 NOT_RUN。",
  ] : [];
  const wave6 = id === "TD-C01" ? [
    "Wave6 决策练习：把传统接口测试经验映射到 AI Serving 责任时，先选一个低风险业务对象，再明确可决定范围、禁止动作、独立 Oracle、失败成本和交接人。岗位结论必须由作品证据支持，不能由模型名称、框架数量或工作年限替代；证据不足时回到 guided-execution。",
    "诊断细节：作品集评审出现“版本可复现但风险不可复现”时，检查数据切片、业务规则、Prompt/Schema/Tool hash、模型别名解析时间和复评 owner。修复先补一个缺失字段并重跑 fault，保留前后 receipt；真实 provider 或 live 条件未运行时结论仍 UNKNOWN/NOT_RUN。",
    "可交付决定：分别写出“继续构建作品”“停止并补数据”“升级组织 owner”三种条件，绑定 evidence_ref、failure_cost、review_date 和 rollback。学习者要说明当前样本支持的有限判断，以及不能外推到哪个岗位、薪资或生产系统。",
    "迁移工件：在 portfolio receipt 外新增 role-scope-card、serving-version-matrix、reviewer-objection-log 和 next-experiment.md。每个 editable_field 写示例值、数据来源、责任人和缺失动作，复制到 RAG、Agent 或压测场景时必须重新签署。",
    "复盘任务：同伴随机删除一条版本字段或替换一条风险切片，要求指出哪一个结论必须降级、哪个 Oracle 需要重跑、谁拥有停止权。若无法定位，说明作品仍依赖口头解释，不具备直接复用条件。",
  ] : [];
  return [
    ...(wave5.length ? [{ title: `${id} Wave5 专属职业决策`, body: wave5 }] : []),
    ...(wave6.length ? [{ title: `${id} Wave6 主题决策与诊断`, body: wave6 }] : []),
    { title: `${action}：主题化 worked example、迁移条件与复用工件`, body: [...wave3Expansion[id], ...(wave3Extra[id] ?? [])] },
    { title: `${id} 专属责任四态与可复验证据`, body: [
      `针对 ${id}，不要把“会压测/会看指标”当作成熟度。请将责任状态写成 guided-execution、independent-scoped-ownership、system-cross-team-leverage 或 strategy-governance-mentoring，并为本页绑定输入版本、${page.artifact}、命名 fault、独立 Oracle、失败动作和 reviewer。`,
      "没有可打开的 evidence_ref 就保持 UNKNOWN；fixture-only 的 0/1/0 只证明测试资产能检测声明故障，不能升级成真实模型、供应商集成、从业者、学习者或 production 结论。",
    ], bullets: [
      `先说明 ${page.control} 的 decision_rights 与必须升级的高风险决定，再运行同一 manifest。`,
      "把实际输出、失败收据、复评日期和适用范围写入证据表；不要用吞掉 fault 或修改 expected 换绿。",
      "迁移到真实 serving 前重新锁定模型、流量、硬件、阈值、owner、回滚和边界；本页数字不可外推。",
    ] },
    { title: `${action}：从指标练习到可复用 Serving 实验`, body: [
      `不要从“压出多少 QPS”开始。先写 ${page.control} 的场景、错误成本、到达人口、模型/Prompt/硬件版本和停止条件；再把每一条结论绑定 raw event、独立 Oracle、Metric Card、owner 与失败动作。${page.scenario} 只用于说明方法，不代表任何供应商或生产系统。`,
      `一轮可复用实验必须保留 baseline、单一 fault、repair、重放命令、输入 hash、失败字段、时间/成本分母和 UNKNOWN 清单。若看不到队列、Token、工具副作用、质量约束或回退原因，就不能把漂亮的均值升级成性能、可靠性或经济性结论。`,
      `迁移到真实环境时，重新确认 API/SDK、模型别名与内部版本、流量分布、数据隐私、GPU/队列、阈值、owner、回滚和审批；模型、integration、practitioner、learner、live、production 在本页均保持 NOT_RUN，直到对应证据门禁执行。`,
    ] },
    { title: action, body: [page.control, page.method, page.oracle] },
    { title: `${action}：把协议和决策写成可检查模型`, body: [page.protocol], technical: { kind: "pseudocode", content: `BASELINE(${id})\n  verify page manifest and versioned input\nFAULT(${id})\n  apply only the declared mutation\n  require the target Oracle to fail\nREPAIR(${id})\n  restore implementation, not the Oracle`, verification: `运行 ${id} 的 cycle，实际子步骤必须为 0/1/0；检查 evidence/${id}/ 下四份报告。`, implementationPath: `${bundle}/scripts/serving_lab.py` }, expected: page.repair },
    { title: `${action}：版本化 Prompt/Eval/Mutation`, body: [`本页 Prompt 只解决“${page.control}”`, `Critic 以“${page.oracle}”为专业审查点；UNKNOWN、NOT_RUN 和禁止事项不可由模型改写。`], technical: { kind: "prompt", content: promptBody(`${bundle}/prompts/${id}/task-v1.md`), version: "1.0.0", promptPath: `${bundle}/prompts/${id}/task-v1.md`, manifestPath: `${bundle}/prompts/${id}/manifest.json`, inputFixturePath: `${bundle}/fixtures/${id}-input.json`, outputSchemaPath: `${bundle}/schemas/${id}-output.schema.json`, evaluationPath: `${bundle}/evals/${id}-eval.json` }, expected: page.id === "TD-A05" ? "Queue/GPU/KV 的模型与集成均 NOT_RUN；版本化 Prompt 包只通过确定性 schema/eval/mutation 夹具，不能替代 profiler 或 trace。" : "模型为 NOT_RUN；版本化 Prompt 包只通过确定性 schema/eval/mutation 夹具。" },
    { title: `${action}：重放 0 → 1 → 0`, body: [page.failure, page.repair, page.boundary], technical: { kind: "command", content: `python3 scripts/serving_lab.py --manifest manifests/${id}.json --mode cycle`, manifestPath: `${bundle}/manifests/${id}.json`, stepId: "cycle", workingDirectory: bundle, expectedExitCode: 0, expectedArtifacts: [`evidence/${id}/baseline.json`, `evidence/${id}/fault.json`, `evidence/${id}/repair.json`, `evidence/${id}/cycle.json`] }, expected: page.id === "TD-A05" ? "该页 cycle 外层退出 0，内部仍严格为 0/1/0；fault 退出 1 只证明瓶颈归因门禁能拦截错误 GPU 结论。" : "cycle 自身退出 0，内部实际退出码严格为 0/1/0；fault 退出 1 是检测力证据。" },
  ];
};

const servingDiagnosisBlocks: Partial<Record<ServingPageId, TutorialBlock>> = {
  "TD-A05": {
    title: "Queue、Prefill、Decode、KV 与下游：四列诊断卡",
    body: [
      "诊断必须从可观测症状走到可证伪的下一检查，再给出保持 workload、模型、Prompt 与质量门禁不变的修复重跑。某一监控曲线与慢请求同时出现只能算相关信号；缺阶段 Trace 或 profiler 时应写 UNKNOWN。",
    ],
    table: {
      headers: ["症状/问题", "疑似层", "下一步检查", "修复/重跑"],
      rows: [
        ["TTFT 上升且 queue_time 占比扩大", "Queue/Admission", "核对计划到达、实际到达、queued/dropped 与 batch 等待", "限制入口或调整 batch；用同一 workload hash 重跑"],
        ["长上下文 TTFT 上升、GPU 利用未满", "Prefill", "按 input_tokens 切片并比较 prefill span 与缓存命中", "只改变上下文或 prefill 策略；保持输出长度重跑"],
        ["TPOT 上升且 decode span 拉长", "Decode/GPU", "核对 output_tokens、decode 占用、抢占和功耗频率", "恢复资源或调度策略；以同一 Token 分布复测"],
        ["长会话抖动伴随 eviction，或工具 span 独立变长", "KV Cache/Downstream", "区分 KV eviction、工具超时和重试放大；缺 profiler 时标 UNKNOWN", "分别改变缓存容量或下游依赖，只保留能推翻假设的单变量结果"],
      ],
      caption: "每一行都要求证据、反证与可重放修复，禁止从 GPU 曲线直接跳到扩容。",
    },
  },
};

export const aiServingCareerPages: TutorialPage[] = (contracts.map((page) => ({
  id: page.id,
  moduleId: page.moduleId,
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
  blocks: [
    { title: `${servingActions[page.id]}：职业场景与失败代价`, body: [page.scenario, page.why] },
    ...technicalBlocks(page),
    ...(servingDiagnosisBlocks[page.id] ? [servingDiagnosisBlocks[page.id]!] : []),
    { title: `${servingActions[page.id]}：证据边界与迁移`, body: [page.boundary, page.id === "TD-C01" ? "岗位路径和自评只用于学习规划与作品复盘；任何招聘、晋升或薪资判断必须由具体组织基于当前岗位独立作出。" : page.id === "TD-A05" ? "迁移瓶颈诊断到真实 serving 前，必须重新取得 queue/prefill/decode trace、GPU/KV profiler、流量切片、阈值、owner、回滚和审批；本页 fixture 只演示如何推翻一个错误归因。" : "迁移到真实 serving 前必须重新锁定 API/SDK、模型、Prompt、硬件、流量、阈值、owner 和回滚；fixture 数值不得外推."], warning: page.boundary },
  ],
  practice: page.practice,
  completion: page.completion,
  sourceIds: page.sourceIds,
  evidenceBoundary: page.boundary,
  architecture: { title: `${page.title} 证据链`, caption: `${page.control} 任一关键证据缺失时保持 UNKNOWN/BLOCKED。`, nodes: page.nodes },
  materials: [
    { title: `${page.id} 输入夹具`, description: "版本化场景、批准假设与 fixture-only 数值。", href: `${bundle}/fixtures/${page.id}-input.json`, kind: "fixture", validation: "fixture-tested" },
    { title: `${page.id} 运行 Manifest`, description: "页级 owners、Oracle、fault、required files 和 0/1/0 步骤。", href: `${bundle}/manifests/${page.id}.json`, kind: "config", validation: "fixture-tested" },
    ...sharedMaterials,
  ],
})) satisfies TutorialPage[]).map((page): TutorialPage => ({
  ...page,
  blocks: composeDeepPage(page.blocks, careerEvolutionDeepBlocks(page.id), aiServingDeepBlocks(page.id)),
}));
