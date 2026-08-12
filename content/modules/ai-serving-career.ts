import type { TutorialBlock, TutorialPage } from "../course.ts";

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
    boundary: "离线 manifest fixture；没有调用任何供应商 API，也不证明真实模型行为或当前限额。",
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
    boundary: "离线事件和账本 fixture；没有真实 SSE 分片、代理缓冲、工具或任务队列。",
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
    boundary: "确定性时间戳 fixture；不代表任何模型、GPU 或供应商的真实性能。",
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
    boundary: "本页只运行合成负载、虚拟时间与固定到达账本；没有网络、真实模型、GPU、调度器、缓存、生产流量或真实容量数据。报告中的到达率、Goodput 拐点与安全余量仅用于证明 fixture 门禁能发现守恒缺失，禁止外推为任何硬件、供应商或生产 SLA。",
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
    boundary: "离线错误和预算 fixture；未验证真实供应商配额、Retry-After、fallback 模型或生产恢复。",
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
    boundary: "职业框架与合成自评 fixture；不构成就业、晋升、薪资、地区需求或个体适配保证。",
    practice: ["完成五维能力自评并为每项添加 evidence_ref", "选择两条可组合路线并写清岗位边界", "设计一个能让坏版本变红的 90 天作品"], completion: ["自评无证据项标 UNKNOWN", "作品区分 desk/fixture/live/production", "文档明确不承诺就业或岗位结果"], sourceIds: ["S23", "S60", "S62", "S64"], nodes: ["当前能力基线", "岗位责任", "五维差距", "90 天计划", "作品集证据", "人工复评", "非就业承诺边界"],
  },
];

const technicalBlocks = (page: PageContract): TutorialBlock[] => {
  const id = page.id;
  const action = servingActions[id];
  return [
    { title: action, body: [page.control, page.method, page.oracle] },
    { title: `${action}：把协议和决策写成可检查模型`, body: [page.protocol], technical: { kind: "pseudocode", content: `BASELINE(${id})\n  verify page manifest and versioned input\nFAULT(${id})\n  apply only the declared mutation\n  require the target Oracle to fail\nREPAIR(${id})\n  restore implementation, not the Oracle`, verification: `运行 ${id} 的 cycle，实际子步骤必须为 0/1/0；检查 evidence/${id}/ 下四份报告。`, implementationPath: `${bundle}/scripts/serving_lab.py` }, expected: page.repair },
    { title: `${action}：版本化 Prompt/Eval/Mutation`, body: [`本页 Prompt 只解决“${page.control}”`, `Critic 以“${page.oracle}”为专业审查点；UNKNOWN、NOT_RUN 和禁止事项不可由模型改写。`], technical: { kind: "prompt", content: `读取 ${id} 的批准输入和来源，只生成可回链的候选测试、指标或职业工件；输出必须满足 Schema，并接受 mutation eval。`, version: "1.0.0", promptPath: `${bundle}/prompts/${id}/task-v1.md`, manifestPath: `${bundle}/prompts/${id}/manifest.json`, inputFixturePath: `${bundle}/fixtures/${id}-input.json`, outputSchemaPath: `${bundle}/schemas/${id}-output.schema.json`, evaluationPath: `${bundle}/evals/${id}-eval.json` }, expected: "模型为 NOT_RUN；版本化 Prompt 包只通过确定性 schema/eval/mutation 夹具。" },
    { title: `${action}：重放 0 → 1 → 0`, body: [page.failure, page.repair, page.boundary], technical: { kind: "command", content: `python3 scripts/serving_lab.py --manifest manifests/${id}.json --mode cycle`, manifestPath: `${bundle}/manifests/${id}.json`, stepId: "cycle", workingDirectory: bundle, expectedExitCode: 0, expectedArtifacts: [`evidence/${id}/baseline.json`, `evidence/${id}/fault.json`, `evidence/${id}/repair.json`, `evidence/${id}/cycle.json`] }, expected: "cycle 自身退出 0，内部实际退出码严格为 0/1/0；fault 退出 1 是检测力证据。" },
  ];
};

export const aiServingCareerPages: TutorialPage[] = contracts.map((page) => ({
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
    { title: `${servingActions[page.id]}：证据边界与迁移`, body: [page.boundary, page.id === "TD-C01" ? "岗位路径和自评只用于学习规划与作品复盘；任何招聘、晋升或薪资判断必须由具体组织基于当前岗位独立作出。" : "迁移到真实 serving 前必须重新锁定 API/SDK、模型、Prompt、硬件、流量、阈值、owner 和回滚；fixture 数值不得外推。"], warning: page.boundary },
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
}));
