import type { TutorialPage } from "../course.ts";
import { agentPerformanceDeepBlocks } from "./agent-performance-deep.ts";
import { composeDeepPage } from "./deep-layer.ts";

/** 在共享实验材料之外，为每页追加逐页不同的深度块（术语、判断表、反例、诊断树、演练、带走物）。 */
const withDeepLayer = (page: TutorialPage): TutorialPage => ({
  ...page,
  blocks: composeDeepPage(page.blocks, agentPerformanceDeepBlocks(page.id)),
});

const appendExecutedLabMaterial = (page: TutorialPage): TutorialPage => ({
  ...page,
  materials: [
    ...(page.materials ?? []),
    {
      title: "Agent 性能三态实验脚本",
      description: "各页 manifest 共同调用的确定性 baseline/fault/repair 执行器；仅证明本地 fixture 检测力。",
      href: "materials/agent-load-stability/scripts/agent_performance_lab.py",
      kind: "script",
      validation: "fixture-tested",
    },
  ],
});

/**
 * 页面专属迁移卡：补足 AP03-AP06 的学习者可复用判断，避免共享实验脚手架
 * 在同一模块内成为主要正文。每一张卡都绑定本页的性能问题，不改变 fixture 边界。
 */
const appendPageSpecificPerformanceContext = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-AP03": [{
      title: "AP03 迁移卡：从一条断链 Trace 定位责任层",
      body: [
        "拿到失败任务后先固定 task_id、trace_id、workload_hash 和 schema_version，再逐层检查 root、generation、tool、retry、handoff、terminal。不要从最后一句回答猜根因；每一层都要能给出 span_id、parent_id、状态和脱敏决定。",
        "学习者交付一张字段缺口卡：缺口属于采集器、传播中间件、存储采样还是脱敏策略，并为每个缺口写一个可观察的补证动作。只有修复后同一 task 的 root-to-terminal 闭包恢复，才能把 fault 记为已修复。",
      ],
      table: { headers: ["观察到的断点", "责任层", "复验工件"], rows: [["root 存在但 tool 无 parent", "context 传播/埋点", "同一 trace 的 parent-child 图"], ["tool 参数被脱敏成空对象", "redaction policy", "字段级脱敏快照"], ["retry 次数与调用数不符", "采集/聚合", "attempt ledger 与 span 对账"], ["terminal 缺失", "编排结束事件", "task 完成事件与时间戳"]], caption: "每个判断都必须回到同一 task 的证据链。" },
    }],
    "TD-AP04": [{
      title: "AP04 迁移卡：把协调遗漏显式算进用户等待",
      body: [
        "先冻结 workload_hash、目标到达率、计划到达时间和截止时间，再分别运行 open 与 closed。closed 只能回答固定并发下的局部表现；对外 SLO 不能使用它自动降速后留下的漂亮 p99。",
        "学习者交付一张 offered-versus-achieved 对照卡：每个时间桶记录计划请求、实际发出、完成、队列深度和超时。若系统变慢时实际发出量下降，必须把遗漏样本标红，而不是把下降后的速率当成系统承载力。",
      ],
      table: { headers: ["对照证据", "closed 的风险", "open 的复验"], rows: [["计划到达时刻", "未进入系统的等待被忽略", "按计划时刻计端到端延迟"], ["achieved rate", "变慢时自动下降", "保持 offered rate 不变"], ["queue depth", "常被压测器隐藏", "与 p99 同时记录"], ["截止时间", "只看响应返回", "按 task terminal 判断"]], caption: "负载模型是实验变量，不能混写成一个吞吐数字。" },
    }],
    "TD-AP05": [{
      title: "AP05 迁移卡：把容量写成带条件的 SLO 拐点",
      body: [
        "容量卡必须同时写 workload_hash、模型/服务版本、SLO、台阶稳定时长和首个失败门禁。最大吞吐不是容量；在 SLO 已经失败的台阶继续加压，只能说明系统还能继续产出，不能说明可用。",
        "学习者交付一张瓶颈归因卡：先标出首个违反 SLO 的台阶，再用 queue、prefill、decode、tool、retry 五个信号排除候选。每次只改一层并复测，避免把多个优化叠加后误称为归因成功。",
      ],
      table: { headers: ["首个信号", "不能直接下的结论", "下一次实验"], rows: [["queue 持续增长", "一定是模型慢", "固定模型，调度/并发单变量"], ["TTFT 上升", "一定要换模型", "固定到达率，改变上下文长度"], ["tool span 变慢", "系统容量已到", "隔离依赖并复测工具路径"], ["goodput 下降", "最大吞吐就是容量", "按 SLO 拐点重算容量"]], caption: "容量结论必须说明适用条件与失败原因。" },
    }],
    "TD-AP06": [{
      title: "AP06 迁移卡：用任务级预算保护副作用",
      body: [
        "先把 gateway、SDK、Agent、tool 的超时和重试配置抄成一张任务级预算表，计算最坏调用次数和最坏总时长，再检查是否小于总 deadline。每层单独看起来合理，合起来可能出现 81 倍放大。",
        "学习者交付一张安全降级卡：对每个可写工具标出幂等键、允许重试次数、超预算终态和账本复核动作。压力 fault 下只读、转人工或明确拒绝可以是合法终态，但重复扣款、重复退款和无审计写入必须阻断。",
      ],
      table: { headers: ["故障信号", "先看哪一层", "必须保留的证据"], rows: [["调用次数成倍增长", "预算传播", "每层 attempt ledger"], ["外层未超时", "deadline 递减", "各层 deadline 时间线"], ["出现重复写", "工具幂等", "幂等键与账本差异"], ["降级被报错", "终态 Oracle", "只读/人工/拒绝的业务判定"]], caption: "安全降级不是隐藏失败，而是有证据的合法终态。" },
    }],
  };
  const card = cards[page.id];
  if (!card) return page;
  return { ...page, blocks: [...page.blocks, ...card] };
};

/** Wave 3: each AP page gets a distinct worked example, transfer artifact and diagnosis. */
const appendWave3PerformanceDepth = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-AP01": [{ title: "AP01 工作负载案例：退款、查询与转人工三切片", body: ["把客服 Agent 的一小时请求拆成退款、订单查询和转人工三类任务。退款包含一次检索和一次写工具，查询只有检索，转人工允许安全拒绝；三类必须分别记录输入长度、工具路径、允许终态和业务 Oracle。若只按请求数统计，退款的长链失败会被查询流量稀释。", "学习者要交付 workload-v2.json、切片比例表和一张 Oracle 卡。迁移到新业务时先替换任务终态和副作用，再重算分母，不能复制旧的 QPS 阈值；真实流量采样、模型行为和生产容量仍是 NOT_RUN。"], table: { headers: ["切片", "关键字段", "可观察工件"], rows: [["退款", "tool=refund、幂等键、金额", "副作用账本与终态"], ["查询", "retrieval_ids、上下文长度", "引用覆盖表"], ["转人工", "handoff_reason、deadline", "人工升级记录"], ["混合流量", "比例与版本 hash", "workload manifest"]], caption: "workload 先表达业务任务，再表达压测工具。" } }, { title: "AP01 反例：平均请求掩盖长尾任务", body: ["把所有任务压成同一个短 Prompt 看起来可复现，却没有覆盖多工具路径、长上下文和合法转人工。修复不是盲目增加请求，而是保留风险切片并让每类都有自己的成功判定。", "诊断时先问分母是谁，再问输入分布是否变化；若 achieved rate 变高但 good-task rate 下降，应保留 fault 证据并回到 workload hash。"], table: { headers: ["症状", "怀疑层", "下一步与修复"], rows: [["吞吐涨、业务成功降", "分母/Oracle", "按切片重算 good task"], ["长上下文超时", "token 分布", "补 p90/p99 样本"], ["转人工被算失败", "终态集合", "由 owner 定义合法终态"], ["结果不可复现", "版本治理", "锁 workload hash"]], caption: "每一行都要能落到一个新工件。" } }, { title: "AP01 迁移工件：从样本到容量假设", body: ["将 200 条脱敏任务抽样表转换为 workload manifest，明确采样窗口、任务比例、token 桶、工具路径、终态 owner 和未知项。迁移前先在隔离夹具中跑 baseline/fault/repair，再由工程师决定哪些字段可以进入真实压测。", "最终交付包括 manifest、比例图、Oracle 规则、变更记录和边界声明。任何模型/provider、企业集成、从业者复核、学习者观察、live 或 production 运行都保持 NOT_RUN。"], bullets: ["先锁样本与 hash，再选工具", "分片而非平均值是容量前提", "Oracle 与 workload 同版本"] }],
    "TD-AP02": [{ title: "AP02 指标案例：把一次慢任务拆成六段", body: ["选择一条客服 Agent 的慢任务，按 queue、TTFT、TPOT、tool、retry、orchestration gap 画时间线。若工具等待占总时长 70%，优化 TTFT 只能改变局部数字；若重试占 30%，应先收紧预算并核对幂等性。", "学习者交付阶段指标卡，列出分子、分母、测量点、风险切片、p50/p95/p99 和采样窗口。迁移到另一个 Agent 时只迁移指标定义，不迁移阈值；阈值必须由新业务 owner 重定。"], table: { headers: ["观察", "不要直接推断", "复验动作"], rows: [["TTFT 下降", "任务更快", "看端到端与工具占比"], ["裸 QPS 上升", "可用性提升", "重算 goodput"], ["重试变多", "依赖更可靠", "对账 attempt 与成本"], ["指标正常、投诉变多", "用户误报", "按任务类型分桶"]], caption: "指标只有放回任务链才有解释力。" } }, { title: "AP02 反例与转移条件", body: ["单报平均延迟会把长尾和多跳工具路径隐藏；单报入口 2xx 会漏掉后台失败。修复时必须同时保留计划到达、终态、工具副作用和成本字段。", "当模型供应商更换、缓存策略变化或工具 schema 更新时，原指标仍可复用，但必须生成新 configuration_hash 并重新做 baseline。"], table: { headers: ["故障症状", "怀疑层", "下一步检查"], rows: [["p95 正常但用户慢", "任务切片", "查长任务端到端线"], ["cost/success 翻倍", "retry/token", "拆 attempt 与 token"], ["tool 变慢", "外部依赖", "独立压工具路径"], ["阶段和不闭合", "观测空隙", "补 orchestration span"]], caption: "诊断结果必须落到指标卡的缺口。" } }, { title: "AP02 可复用指标字典", body: ["把每个指标写成可复制的卡片：名称、公式、单位、分母、切片、观测点、统计窗口、owner、阻断动作和未知项。学习者用一条 baseline 和一条 fault 对照填写，不能用模型生成数字替代观察。", "迁移到生产前，先在目标环境做 capability probe，确认 trace、token、队列和工具延迟是否可见；不可见部分写 UNKNOWN，并排除在错误的正常判断之外。"], bullets: ["分子分母一起版本化", "p99 必须注明时间窗口", "不可见指标不推断"] }],
    "TD-AP07": [{ title: "AP07 长稳案例：区分缓存平台期与泄漏", body: ["在固定 workload 下运行八小时，记录内存、连接、句柄、临时文件、尾延迟和 cleanup 成功率。前两小时上升后平台可能是有界缓存；持续正斜率且快照差分不断扩大才是泄漏候选。", "学习者交付三条趋势线、首中尾快照和对象增长排序。迁移到另一运行时必须说明 GC、缓存和连接池实现差异，不能把同一斜率阈值直接复制。"], table: { headers: ["曲线", "优先怀疑", "复验工件"], rows: [["上升后平台", "有界缓存", "缓存上限与快照"], ["持续上升", "对象泄漏", "首尾差分"], ["锯齿回落", "cleanup 周期", "回收成功率"], ["尾延迟缓升", "GC/连接", "资源相关性图"]], caption: "长稳结论依赖趋势和快照，不依赖单个瞬时值。" } }, { title: "AP07 反例：重启掩盖泄漏", body: ["每小时重启服务看起来稳定，却把泄漏切成多个短窗口；低负载长稳又可能让泄漏速率低于噪声。正确做法是固定在 SLO 拐点约七成、禁用自动重启，并预先定义停止条件。", "若 cleanup 失败率先下降，先查回收链，再查内存；不要等到 OOM 才判定异常。"], table: { headers: ["症状", "怀疑层", "下一步与修复"], rows: [["每次重启后恢复", "泄漏被掩盖", "禁用重启做长稳"], ["内存不升但临时文件增", "cleanup", "做资源快照差分"], ["尾延迟周期波动", "定时任务", "对齐调度时间"], ["中途版本变化", "实验污染", "废弃本轮并重跑"]], caption: "异常诊断要保留时间线。" } }, { title: "AP07 迁移工件：长稳复盘包", body: ["交付 workload_hash、运行窗口、版本、资源趋势、快照差分、cleanup receipt、停止条件和责任人。每个候选泄漏都要写出最小复现和回归观测，而不是只写‘内存上涨’。", "真实 provider/model、integration、practitioner review、learner observation、live 与 production 长稳均 NOT_RUN；本地 fixture 仅证明检测路径。"], bullets: ["固定版本和负载", "首中尾快照", "趋势与回收同时判读"] }],
    "TD-AP08": [{ title: "AP08 SLO 案例：从 good task 到 burn rate", body: ["为订单 Agent 定义 good task：业务终态正确、p95 端到端延迟不超预算、成本不超上限且无未授权副作用。再用短窗高倍率与长窗低倍率组合告警，分别绑定止血、降级和复盘动作。", "学习者交付 SLO 卡、错误预算表、告警规则、owner/升级路径和一次复盘记录。迁移到新业务时重做终态和预算，不能复制客服 Agent 的阈值。"], table: { headers: ["指标", "分子/分母", "动作"], rows: [["good-task rate", "合格任务/eligible task", "低于 SLO 触发调查"], ["burn rate", "预算消耗/时间", "短窗超标先止血"], ["成本成功比", "成本/合格任务", "超限切换模型或降级"], ["副作用错误", "非法写/写尝试", "硬红线立即阻断"]], caption: "SLO 必须同时覆盖质量、性能、成本和副作用。" } }, { title: "AP08 反例：HTTP 5xx 全绿不等于 Agent 可用", body: ["Agent 任务可能返回 200 后在后台失败；只监控 5xx 会得到完美告警图。把 good task 作为分子，并保留错误预算消耗，才能让用户真实失败进入门禁。", "告警不是越敏感越好；没有 owner 和动作的告警会被静音。每个窗口都要绑定响应时限和回滚条件。"], table: { headers: ["症状", "怀疑层", "下一步与修复"], rows: [["5xx 正常、任务失败", "SLI 分子", "切换 good-task SLI"], ["告警频繁抖动", "窗口设计", "改多窗口 burn rate"], ["无人响应", "责任链", "补 owner 与升级"], ["事故反复", "回流缺失", "转成固定回归样例"]], caption: "告警链的出口必须是动作。" } }, { title: "AP08 迁移工件：性能事故到回归", body: ["从一次 fault trace 生成事故卡：影响切片、时间窗口、good-task 分母、burn rate、止血动作、恢复证据和回归用例。复盘时区分 Evidence、Inference、Unknown，未知的托管模型内部指标不能补写成正常。", "真实 provider/model、integration、practitioner review、learner observation、live 与 production SLO 运行均 NOT_RUN；发布门禁不得消费本地 fixture 成功。"], bullets: ["每次告警写动作", "事故样例回流回归", "未知指标显式列出"] }],
    "TD-AP03": [{ title: "AP03 Worked example：退款任务的因果 Trace", body: ["取一条退款任务：gateway 接收、retrieval 查询订单、model 选择 refund 工具、tool 返回超时、Agent 重试一次、最后转人工。把这些节点放进 task root，给每个 span 写 parent_id、attempt、tool schema hash、风险切片和脱敏状态。", "如果最终文本说‘已为你处理’，但账本没有退款且 terminal span 缺失，任务必须判为 UNKNOWN 或失败，不能凭语言成功。学习者交付一张 root-to-terminal 图和一条字段缺口清单，说明责任落在传播、采集、存储还是脱敏。"], table: { headers: ["节点", "必须证明", "缺失时"], rows: [["gateway", "trace_id/task_id", "无法关联请求"], ["retrieval", "文档与版本", "无法复核依据"], ["tool attempt", "参数/返回/幂等键", "无法判副作用"], ["terminal", "业务终态/人工升级", "不可计算 good task"]], caption: "Trace 图的出口是可复核工件，不是漂亮的最终回答。" } }, { title: "AP03 迁移与复验：从本地 schema 到真实 telemetry", body: ["先在 fixture 中注入 orphan span、错误 parent、缺 terminal 和过度脱敏四种 fault，保持 Oracle 不变；再把相同字段映射到目标 OTel exporter。迁移条件是后端能保留父子关系、风险字段能脱敏、失败与高危动作能全量采样。", "学习者交付 schema diff、字段隐私等级、采样策略、collector receipt 和复验 Trace。真实 provider/model、integration、practitioner review、learner observation、live 与 production telemetry 均 NOT_RUN，不能将 fixture 闭包写成线上可观测。"], bullets: ["一次只注入一个断点", "字段结构先于字段数量", "采样变化必须有版本"] }],
    "TD-AP04": [{ title: "AP04 Worked example：开环揭露隐藏队列", body: ["用 60 task/min 的订单 workload 做对照。closed 模式在服务变慢后自动降速，achieved rate 仍接近 60、p99 看似稳定；open 模式固定 offered rate，计划到达样本持续进入，队列和截止时间违约才真实暴露。", "学习者交付两个时间桶的 offered/achieved/queue/p99 表，并从计划到达时刻计端到端等待。若 closed 少发了最坏请求，报告必须标记 coordinated omission，而不是把低 achieved rate 当成容量。"], table: { headers: ["证据", "closed 结果", "open 结果"], rows: [["offered rate", "随完成率下降", "保持 60/min"], ["queue", "压测器隐藏", "持续增长可见"], ["截止时间", "响应返回即结束", "按 task terminal 判定"], ["SLO", "容易过绿", "能发现拐点"]], caption: "到达模型决定你测到的是局部用户循环还是系统承载。" } }, { title: "AP04 迁移与复验：从压测工具到平台容量", body: ["迁移前冻结 workload hash、arrival distribution、计划时钟、发压端资源和停止条件。真实平台需要检查压测端是否先到 CPU/连接上限，再解释服务 p99；否则测到的是发压器瓶颈。", "交付 open/closed 对照报告、压测端资源曲线、队列证据、截止时间分布和迁移决策。真实 provider/model、integration、practitioner review、learner observation、live 与 production 负载均 NOT_RUN。"], bullets: ["同一 workload 才能对照", "计划时刻必须进延迟", "压测端瓶颈先排除"] }],
    "TD-AP05": [{ title: "AP05 Worked example：容量是第一个 SLO 失败台阶", body: ["对固定 workload 按 20、40、60、80 task/min 阶梯加压。60 时 goodput 达标，80 时 p95 超过预算，即使吞吐继续增长，容量也应记录为 60 的 SLO 拐点。再比较 queue、TTFT、TPOT、tool 和 retry，定位首个瓶颈。", "学习者交付容量曲线、首个失败门禁、瓶颈候选排序和单变量复测结果。报告必须写版本、SLO、稳定时长、workload hash 和适用切片，不能只留下‘120 并发’。"], table: { headers: ["台阶", "观察", "判断"], rows: [["20", "goodput 稳定", "基线"], ["40", "p95 接近预算", "预警"], ["60", "SLO 满足", "可用容量候选"], ["80", "p95 超预算", "首个失败台阶"]], caption: "容量卡记录的是条件性边界。" } }, { title: "AP05 迁移与复验：从 synthetic goodput 到业务容量", body: ["synthetic goodput 只能说明某个 workload hash 下的确定性夹具；迁移到真实业务必须补真实任务比例、上下文长尾、工具路径、业务 Oracle 和成本约束。先在授权隔离环境逐级探测，再由 owner 接受风险。", "交付 workload 差异、SLO 版本、瓶颈证据、复测曲线和 UNKNOWN 清单。真实 provider/model、integration、practitioner review、learner observation、live 与 production capacity 均 NOT_RUN。"], bullets: ["首失败台阶优先", "一次只改一层", "最大吞吐不等于容量"] }],
    "TD-AP06": [{ title: "AP06 Worked example：81 倍重试放大与安全终态", body: ["gateway、SDK、Agent、tool 各配置三次重试时，最坏可产生 3×3×3×3=81 次调用。对只读检索可有限重试，对退款写工具必须使用幂等键并从任务预算扣减；超预算进入转人工或对账，而不是继续写。", "学习者交付层级预算表、deadline 时间线、attempt ledger 和副作用差异。若最终回答成功但账本有两笔退款，Oracle 必须阻断，并把 fault 指向工具幂等或预算传播。"], table: { headers: ["层", "预算问题", "复验"], rows: [["gateway", "是否重复入口", "请求 id 对账"], ["SDK", "是否叠加重试", "attempt ledger"], ["Agent", "是否消耗任务预算", "deadline 时间线"], ["tool", "是否可写/幂等", "账本零重复"]], caption: "重试可靠性必须同时看调用数和业务副作用。" } }, { title: "AP06 迁移与复验：从策略夹具到真实依赖", body: ["迁移前先做 capability probe：确认依赖返回码、幂等语义、deadline 传播、限流响应和可观测字段。再用单变量 fault 验证只读、转人工、明确拒绝和对账终态；不允许用提高重试次数掩盖依赖未知。", "交付预算表、降级矩阵、幂等键证明、fault/repair receipt 和 UNKNOWN 清单。真实 provider/model、integration、practitioner review、learner observation、live 与 production 稳定性均 NOT_RUN。"], bullets: ["预算在 task 层统一", "写工具必须有幂等证据", "安全降级要可审计"] }],
  };
  const extra = cards[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const appendWave3ExtendedPractice = (page: TutorialPage): TutorialPage => {
  const ext: Record<string, TutorialPage["blocks"]> = {
    "TD-AP01": [{ title: "AP01 实作复盘：从样本表到可执行假设", body: ["先把每条任务标记为 eligible、excluded 或 unknown，并记录排除原因。退款任务还要保存金额、幂等键和是否产生账本变化；查询任务要保存检索文档和引用覆盖；转人工任务要保存升级原因和等待预算。这样 workload 不是一组 Prompt，而是一组可解释的业务样本。", "再用比例、p90/p99 长度和工具跳数生成版本化 profile，任何字段变化都触发新 hash。容量假设必须写成‘在这份 profile、这台环境、这个 Oracle 下成立’，并列出不能外推的生产变量。"], table: { headers: ["工件", "验收问题", "失败处置"], rows: [["sample ledger", "每条任务是否可追溯", "补 provenance"], ["slice profile", "比例和长尾是否保留", "重新采样"], ["oracle card", "终态和副作用是否明确", "让 owner 签字"], ["unknown list", "不可见变量是否列出", "保持 NOT_RUN"]], caption: "workload 的质量取决于可追溯、可质疑和可迁移。" } }],
    "TD-AP02": [{ title: "AP02 实作复盘：指标卡驱动修复优先级", body: ["把一条慢任务的时间线转成指标卡后，按占比和风险排序，而不是按最容易优化的指标排序。queue 长说明调度或并发，TTFT 长说明 prefill 或上下文，tool 长说明依赖，retry 长说明预算或幂等；每个结论都要附一条 Trace 证据。", "同一指标在不同切片上可能代表不同问题，因此必须保留 task_type、风险等级、模型版本、工具版本和窗口。新业务迁移时先验证指标是否可观测，再决定是否加入门禁；不可见的 GPU 或托管模型内部信号只能写 UNKNOWN。"], table: { headers: ["修复顺序", "依据", "复测"], rows: [["先修副作用", "高风险且不可逆", "账本零变化"], ["再修预算", "重试放大成本", "attempt 降低"], ["再修等待", "用户感知直接", "端到端 p95"], ["最后优化局部", "避免局部假绿", "goodput 不下降"]], caption: "指标卡把排查从争论变成证据顺序。" } }],
    "TD-AP03": [{ title: "AP03 实作复盘：字段治理与重放边界", body: ["一条可重放 Trace 至少需要模型版本和种子、完整 system/user Prompt、工具清单与 description hash、每次调用的脱敏入参出参、时间戳和终态。缺一项时，学习者不能声称已复现，只能记录阻断原因。", "字段治理要同时回答‘谁能看’和‘能不能归因’：原文可脱敏但结构不能删除，失败和高危动作可全量采样，普通低风险流量才按成本采样。迁移到不同 collector 时用 schema diff 和丢 span fault 复验闭包。"], table: { headers: ["缺口", "错误推断", "转移工件"], rows: [["缺 Prompt", "模型已按预期", "prompt hash"], ["缺 tool schema", "工具未变化", "description snapshot"], ["缺 timestamp", "延迟来自模型", "阶段时间线"], ["缺 terminal", "任务成功", "终态 Oracle"]], caption: "Trace 结构比字段总量更决定归因能力。" } }],
    "TD-AP04": [{ title: "AP04 实作复盘：计划时钟与发压端证据", body: ["每个时间桶同时记录计划到达数、实际发出数、完成数、队列深度、超时数和压测端 CPU/连接。若 actual 小于 offered，先查协调遗漏；若压测端 CPU 满而服务端指标平稳，结论只适用于发压端，不适用于被测系统。", "open 模式用于 SLO 和容量，closed 模式用于固定并发的瓶颈定位。二者必须使用相同任务集合、相同 deadline 和相同版本 hash，否则差异可能来自 workload 而非到达模型。"], table: { headers: ["证据缺失", "会产生的错觉", "修复"], rows: [["计划时间", "用户等待变短", "从计划时刻计时"], ["压测端资源", "服务吞吐封顶", "先排发压瓶颈"], ["queue", "系统没有排队", "补队列 span"], ["deadline", "响应返回即完成", "用 terminal Oracle"]], caption: "协调遗漏的识别依赖完整时间桶。" } }],
    "TD-AP05": [{ title: "AP05 实作复盘：容量卡的适用范围", body: ["容量卡第一行写 workload hash、服务版本、硬件、模型、SLO 和实验窗口；第二行写各阶梯的 offered rate、goodput、p95/p99、queue、TTFT、TPOT、tool 和 retry；第三行写首个失败门禁与证据。这样别人才能判断数字适不适合自己的任务。", "瓶颈归因必须是单变量实验。若同时改并发、批处理和缓存，曲线右移不能证明是哪项有效。synthetic goodput 可以作为设计输入，但不能替代真实任务比例、业务 Oracle、成本和合规约束。"], table: { headers: ["容量结论", "必须同时说明", "不可替代"], rows: [["SLO 拐点", "首个失败层", "最大吞吐"], ["goodput", "workload hash", "生产容量"], ["瓶颈归因", "单变量变化", "多项同时优化"], ["迁移建议", "未知和风险 owner", "自动发布"]], caption: "容量数字脱离条件就会变成危险的常数。" } }],
    "TD-AP06": [{ title: "AP06 实作复盘：预算、幂等与降级联动", body: ["任务级预算表要把总 deadline 分给 gateway、SDK、Agent 和 tool，并列出每层最多 attempt、超时、可重试错误和退出终态。可读工具可以有限重试；可写工具必须验证幂等键、去重账本和补偿路径。", "当依赖 429、超时或返回不确定时，系统应优先进入只读、转人工或对账，而不是继续写入。学习者要从 Trace 统计调用放大，从账本确认副作用为零，并把 repair 前后的预算差异写入证据卡。"], table: { headers: ["决策", "需要的证据", "禁止"], rows: [["重试", "错误类型与幂等性", "无限重试"], ["降级", "合法终态与 owner", "静默失败"], ["回滚", "账本与 receipt", "删除审计"], ["放行", "预算和副作用均满足", "只看文本"]], caption: "性能稳定性必须与业务副作用一起验收。" } }],
    "TD-AP07": [{ title: "AP07 实作复盘：资源趋势与泄漏候选", body: ["长稳复盘不能只看一条内存曲线。把资源趋势与 cleanup 成功率、尾延迟、GC、连接池和临时文件关联；若 cleanup 先下降，说明回收链可能比堆内存更早暴露问题。", "快照差分要按对象、连接、句柄和文件排序，并判断增长是否有明确上限。任何中途部署、自动重启或自动扩缩容都要使本轮结论失效，因为它们改变了实验对象。"], table: { headers: ["复盘证据", "含义", "下一步"], rows: [["资源平台期", "可能有界缓存", "核对上限"], ["持续正斜率", "泄漏候选", "做差分"], ["cleanup 下降", "回收异常", "查 owner"], ["中途变更", "实验污染", "废弃重跑"]], caption: "长稳实验的可信度来自不变条件。" } }],
    "TD-AP08": [{ title: "AP08 实作复盘：把事故变成 SLO 回归", body: ["事故卡记录影响切片、good-task 分母、窗口、burn rate、止血动作、降级状态、恢复时间和 owner。复盘必须区分 Evidence、Inference、Unknown，尤其不能因为模型内部指标不可见就推断模型正常。", "将确认的 fault 样例写成固定回归：错误终态、超时、成本超限、副作用和告警链分别有 Oracle。下一次发布先运行回归，再由具名角色接受剩余风险；本地 fixture 成功不等于生产放行。"], table: { headers: ["事故字段", "用途", "缺失后果"], rows: [["good-task 分母", "判断影响范围", "错误率失真"], ["burn rate", "决定响应等级", "告警无动作"], ["恢复证据", "证明止血完成", "误报修复"], ["回归样例", "防止复发", "同类事故重演"]], caption: "SLO 的终点是可执行响应和回归，而不是一张图。" } }],
  };
  const extra = ext[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave4Text: Record<string, TutorialPage["blocks"]> = {
  "TD-AP01": [{ title: "AP01 Wave4：把业务切片计算成可复用负载", body: ["给定 200 条脱敏样本，其中退款 80、查询 90、转人工 30，先计算 eligible task=200，再分别计算工具调用率、长上下文比例和合法终态比例。退款成功必须同时满足金额账本不重复、引用订单正确和 deadline 未超；查询允许引用不足时转人工；转人工不能被当成模型失败。把这些规则写入 workload profile 后，任何 QPS、成本和成功率都必须按切片分层展示。", "具体决策顺序是：第一步剔除缺少业务 Oracle 的样本并记录 excluded_reason；第二步按 task_type、input_tokens、tool_hops 和终态打桶；第三步用 hash 固化比例；第四步只在隔离夹具里注入缺 slice、缺 Oracle、错误终态三种 fault。fault 绿时不能放宽规则，只能回查 profile 版本、分母和 mutation 是否生效。"], table: { headers: ["计算/决策", "判定", "迁移工件"], rows: [["eligible=200", "分母固定", "sample-ledger.json"], ["refund=80/200", "切片比例", "workload-v2.json"], ["无 Oracle 样本", "排除并记录原因", "exclusion-report.md"], ["profile hash 改变", "新实验", "decision-record.md"]], caption: "工作负载不是请求列表，而是带 Oracle 的业务分布。" } }, { title: "AP01 Wave4 转移边界", body: ["迁移到另一个客服场景时，保留切片方法、字段命名和审计格式，但重新决定合法终态、写工具副作用、采样窗口和 owner。不能把本页的退款比例或 latency budget 当成通用阈值。学习者最终提交一份可被同伴复核的 profile、计算表、fault 诊断和 transfer note。", "本轮只证明确定性 fixture 的检测力；真实 provider/model、真实业务样本、企业 integration、practitioner review、learner observation、live 与 production 容量均 NOT_RUN。"], bullets: ["分母先于指标", "切片先于工具", "未知项不得补写为通过"] }],
  "TD-AP02": [{ title: "AP02 Wave4：用阶段预算决定优化先后", body: ["取一条总时长 12 秒的任务：queue 1.5 秒、TTFT 2 秒、TPOT 3 秒、工具 4 秒、retry 1 秒、编排空隙 0.5 秒。先验证六段加总等于端到端，再按用户风险选择修复：工具超时和重复写优先于 TTFT，retry 预算优先于局部吞吐。每个阶段的 p95、分母和测量起点必须写在指标卡。", "当裸 QPS 上升而 good-task rate 下降时，decision 是回滚并检查并发、超时、重试和终态，而不是继续优化模型。迁移到新系统前，先做观测能力 probe，确认能读取 queue、token、tool 和 terminal；读不到的字段在报告中标 UNKNOWN，并禁止作为健康证据。"], table: { headers: ["阶段", "样例耗时", "下一项判断"], rows: [["queue", "1.5s", "检查调度上限"], ["TTFT", "2s", "看输入长度/prefill"], ["tool", "4s", "隔离依赖重测"], ["retry", "1s", "核算预算与幂等"]], caption: "先拆阶段，再决定优化。" } }, { title: "AP02 Wave4 转移工件", body: ["交付 metric-card、阶段 Trace、分桶结果、baseline/fault/repair 对照和 transfer note。fault 可分别注入工具延迟、空 queue span、错误分母和重试暴涨；修复后必须同时观察端到端、goodput 与副作用。真实 provider/model、integration、practitioner review、learner observation、live 与 production 指标仍 NOT_RUN。"], bullets: ["分位数不替代分母", "局部变快不等于任务变快", "不可观测段保持 UNKNOWN"] }],
  "TD-AP03": [{ title: "AP03 Wave4：Trace 字段闭包与重放计算", body: ["对一个退款 trace 计算 root-to-terminal closure：root、retrieval、generation、tool、retry、handoff、terminal 七类节点必须通过 parent_id 连接；tool attempt 数应等于 ledger 中的调用数；每个可写工具还要有 schema hash、幂等键和脱敏状态。若少一个 terminal，业务成功率只能记 UNKNOWN；若调用数对不上，成本和安全结论都不能发布。", "逐项诊断时先比较 trace_id/task_id，再比较 parent_id 图，再比较 attempt ledger，最后检查采样和脱敏。不要用更高采样率掩盖错误传播；不要因为最终回答自然就跳过工具副作用。迁移到 OTel 时提交 schema diff、collector receipt、字段隐私表和一条可重放失败样例。"], table: { headers: ["计算", "异常", "修复动作"], rows: [["child/root=0", "断链", "修 context propagation"], ["attempt span≠ledger", "聚合错", "补 writer/oracle"], ["tool schema hash 缺失", "不可验证", "保存 snapshot"], ["terminal 缺失", "终态未知", "补 finalize event"]], caption: "Trace 的最小闭包决定是否能归因。" } }, { title: "AP03 Wave4 去重与边界", body: ["本页不复用‘先进入明确工作目录’等通用解释，改用 trace writer、collector、redaction 和 replay 的具体决策。只把授权范围、provider/model NOT_RUN 和 fixture 约定作为共享边界；其余判断必须围绕断链、工具副作用和字段闭包。真实 telemetry、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], bullets: ["root-to-terminal 可重放", "高危失败全量采样", "结构脱敏而非删除"] }],
  "TD-AP04": [{ title: "AP04 Wave4：用时间桶识别 coordinated omission", body: ["设定 offered rate=60 task/min、deadline=10 秒、窗口=5 秒。每桶记录计划到达 5、实际发出 5、完成 5、队列和超时；系统变慢后若计划仍是 5 而实际只发 3，closed 压测会隐藏另外 2 个用户等待，open 压测则保留它们并使 p99 变差。报告必须以计划到达时刻计延迟。", "先排除压测端 CPU、连接数和出口带宽，再比较 open 与 closed。若两轮 workload hash、模型版本和 deadline 不一致，差异不能归因到 arrival model。迁移工件包括 offered-achieved 表、压测端资源曲线、queue timeline 和 SLO decision record。"], table: { headers: ["时间桶", "closed 读数", "open 读数"], rows: [["0-5s", "5/5 完成", "5/5 完成"], ["5-10s", "3/3 发出", "5/5 offered"], ["10-15s", "p99 偏好", "queue/timeout 暴露"], ["结论", "局部循环", "到达率下的系统行为"]], caption: "遗漏样本必须进入分母。" } }, { title: "AP04 Wave4 去重与边界", body: ["将通用的‘先核对 page_id’式说明替换成 arrival clock、offered rate、achieved rate、queue 和 executor evidence 的具体检查。只有负载模型、压测端资源和截止时间都被记录，才允许把结果转移到真实容量讨论。provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], bullets: ["计划时刻决定用户等待", "open 用于 SLO", "closed 用于瓶颈定位"] }],
  "TD-AP05": [{ title: "AP05 Wave4：阶梯容量与首个失败门禁", body: ["固定 workload hash、SLO=p95≤8 秒、每级稳定 5 分钟，按 20/40/60/80 task/min 加压。若 60 级 goodput=55 且 p95=7.8 秒，80 级 goodput=62 但 p95=11 秒，容量卡应写 60，而不是最大吞吐 62。然后用 queue、TTFT、TPOT、tool、retry 五类信号做单变量瓶颈实验。", "迁移到真实服务时补 workload 长尾、工具比例、业务 Oracle、成本和硬件；合成 goodput 只能作为候选基线。若曲线没有拐点，先检查台阶间隔、稳定时间、压测端瓶颈和缓存状态，再谈系统优化。"], table: { headers: ["负载级", "goodput", "p95", "decision"], rows: [["20", "18", "5.2s", "基线"], ["40", "37", "6.8s", "稳定"], ["60", "55", "7.8s", "容量候选"], ["80", "62", "11s", "首个失败"]], caption: "容量边界由第一个硬门禁失败决定。" } }, { title: "AP05 Wave4 转移工件", body: ["交付阶梯曲线、首个失败表、瓶颈证据、单变量复测、workload/SLO hash 和 UNKNOWN 清单。真实 provider/model、integration、practitioner review、learner observation、live 与 production capacity 均 NOT_RUN，不能把示例数字放进发布门禁。"], bullets: ["先定 SLO", "首失败优先", "一次只改一层"] }],
  "TD-AP06": [{ title: "AP06 Wave4：任务级重试预算与副作用账本", body: ["假设总 deadline=30 秒，gateway 2 次、SDK 2 次、Agent 3 次、tool 2 次，最坏调用数是 24；若每次工具耗时 2 秒，最坏等待已经 48 秒，必然超过 deadline。decision 是削减层级预算、关闭写工具自动重试或转人工，而不是把外层 timeout 再加长。", "对每次 fault 保存 attempt ledger、deadline 时间线、错误类型、幂等键、读写差异和终态。429 可以有限重试，未知写结果必须先对账；只读、人工升级和明确拒绝是可接受终态，但重复退款、重复扣款和无审计写入是硬阻断。"], table: { headers: ["计算/症状", "怀疑层", "修复/复验"], rows: [["2×2×3×2=24", "预算传播", "任务级限额"], ["48s>30s", "deadline", "逐层递减"], ["账本写入两次", "幂等键", "暂停重试并对账"], ["降级被报错", "终态 Oracle", "补人工/只读终态"]], caption: "重试预算必须与副作用账本联动。" } }, { title: "AP06 Wave4 去重与边界", body: ["不再复用泛化的 cycle 阅读说明，而是围绕 deadline、attempt、幂等、账本和降级终态做判断。迁移前先 probe 依赖错误码、幂等语义和回执可见性；真实 provider/model、integration、practitioner review、learner observation、live、production 稳定性均 NOT_RUN。"], bullets: ["总预算小于 deadline", "写操作优先对账", "合法降级必须可审计"] }],
  "TD-AP07": [{ title: "AP07 Wave4：长稳停止条件与快照差分", body: ["设置负载为 SLO 拐点的 70%，固定版本八小时，禁用自动重启和自动扩缩容。开始、中段、结束分别抓内存对象、连接、句柄、临时文件和 cleanup receipt；首尾差分持续正斜率才是泄漏候选，平台期要结合缓存上限判断。", "如果 cleanup 成功率从 99% 降到 92% 但内存未升，先查回收链；如果尾延迟随连接池增长，查连接泄漏；若中途部署新版本，本轮必须作废。迁移工件包括趋势图、快照排序、停止记录和回归用例。"], table: { headers: ["观察", "decision", "复验"], rows: [["内存平台", "可能有界", "查缓存上限"], ["句柄正斜率", "泄漏候选", "差分对象"], ["cleanup 下降", "回收故障", "按资源类型查"], ["中途重启", "实验无效", "固定版本重跑"]], caption: "长稳需要慢变量证据。" } }, { title: "AP07 Wave4 转移边界", body: ["不同运行时的 GC、缓存、连接池和 cleanup 机制不能共用斜率阈值；迁移只复用趋势、快照和停止条件框架。provider/model、integration、practitioner review、learner observation、live、production 长稳均 NOT_RUN。"], bullets: ["固定环境", "三条线并看", "差分验证候选"] }],
  "TD-AP08": [{ title: "AP08 Wave4：把 good-task SLO 接到告警动作", body: ["为订单 Agent 设 good-task：终态正确、p95≤10 秒、cost/success≤预算、非法副作用=0。短窗高 burn-rate 立即止血，长窗中 burn-rate 进入排查；每条告警绑定 owner、响应时间、降级开关和回滚条件。仅看 HTTP 5xx 会漏掉返回 200 但任务失败的情况。", "故障复盘要保存影响切片、分母、窗口、burn rate、止血动作、恢复证据和回归样例。若告警频繁抖动，检查窗口组合和分母；若没人响应，补责任链；若事故复发，确认是否回流为固定 regression。"], table: { headers: ["硬条件", "信号", "动作"], rows: [["终态正确", "good-task rate", "低于门禁阻断"], ["p95≤10s", "长尾延迟", "降级或扩容"], ["cost/success", "预算消耗", "限制上下文/模型"], ["副作用=0", "账本差异", "硬红线回滚"]], caption: "SLO 必须能触发具体动作。" } }, { title: "AP08 Wave4 转移工件", body: ["交付 SLO 卡、错误预算、burn-rate 规则、owner matrix、事故卡和回归样例。迁移到另一业务时重做合法终态、成本和风险分层；provider/model、integration、practitioner review、learner observation、live、production SLO 均 NOT_RUN。"], bullets: ["good task 是分子", "告警必须有动作", "事故必须回归"] }],
};
const appendWave4ExtendedPractice = (page: TutorialPage): TutorialPage => {
  const extra = wave4Text[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const rewriteWave4SharedSentences = (page: TutorialPage): TutorialPage => {
  const labels: Record<string, string> = { "TD-AP03": "本 Trace 页要求先验证父子闭包与工具账本，再解释模型结果。", "TD-AP04": "本到达模型页要求先保留计划时钟与队列样本，再比较 open/closed。", "TD-AP05": "本容量页要求先锁定 SLO 拐点与 workload 条件，再讨论瓶颈。", "TD-AP06": "本重试页要求先计算任务预算和副作用，再决定是否重试。" };
  const label = labels[page.id];
  if (!label) return page;
  return { ...page, blocks: page.blocks.map((b) => ({ ...b, body: (b.body ?? []).map((text) => text.replace("先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。", label).replace("先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。", label)) })) };
};

const wave5PerformanceDepth = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-AP01": [{ title: "AP01 Project lab：从业务样本生成负载契约", body: ["取 200 条脱敏任务，先按退款 80、查询 90、转人工 30 建立分母，再给每条样本补 task_type、input_tokens、tool_hops、合法终态、Oracle owner 和 excluded_reason。退款成功要同时满足金额账本不重复、订单引用正确、截止时间未超；查询允许引用不足后转人工；转人工是合法终态，不能被粗暴记成模型失败。", "第二轮按切片计算 tool_call_rate、long_context_rate、good_task_rate 和终态分布，并用 profile hash 固化比例。故障注入缺 Oracle、错误终态和缺 slice 三种 mutation；若 fault 没被识别，先查分母、采样和 mutation 生效，而不是调高 QPS。项目交付 workload-v2.json、sample-ledger、Oracle 卡和变更记录，迁移到新业务必须重做终态和副作用。"], table: { headers: ["字段", "计算", "decision", "工件"], rows: [["eligible", "200-excluded", "固定分母", "sample-ledger"], ["tool rate", "tool_tasks/eligible", "估算依赖压力", "slice-table"], ["good task", "合法终态/eligible", "阻断业务失败", "oracle-card"], ["profile hash", "输入+规则摘要", "变更即新实验", "workload-manifest"]], caption: "工作负载必须携带业务 Oracle，平均 QPS 不能替代任务分布。" } }, { title: "AP01 项目交接与边界", body: ["向下一位工程师移交 profile、输入 hash、切片比例图、fault 诊断、baseline/fault/repair 对照和 transfer note。迁移前重算样本窗口、长上下文比例、写工具语义和 owner；不能直接复制本页退款比例或 latency budget。真实业务样本、provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], bullets: ["先锁分母，再算指标", "终态和副作用必须有 owner", "未知样本不能默认为成功"] }],
    "TD-AP02": [{ title: "AP02 Project lab：阶段预算驱动的优化决策", body: ["对一条 12 秒任务记录 queue=1.5、TTFT=2、TPOT=3、tool=4、retry=1、orchestration gap=0.5 秒，先检查六段之和是否等于端到端。若 tool 占比最高，优先隔离依赖；若 retry 暴涨，先查错误类型、幂等和预算；TTFT 改善不能掩盖任务终态或副作用失败。每项 p95 必须同时记录分子、分母、起止 span 和时间窗口。", "用 baseline、工具延迟 fault、空 queue span fault 和重试放大 fault 做单变量对照。裸 QPS 上升但 good-task rate 下降时，decision 是回滚并检查 workload、终态、并发和 timeout；读不到 token、queue、tool 或 terminal 的字段一律 UNKNOWN。交付阶段指标卡、Trace timeline、分桶表和复验记录，迁移只复制定义不复制阈值。"], table: { headers: ["阶段", "证据", "首个判断", "转移工件"], rows: [["queue", "调度 span", "排队还是服务慢", "queue-card"], ["TTFT/TPOT", "token 与时间", "输入或生成瓶颈", "token-card"], ["tool", "依赖 receipt", "外部依赖故障", "tool-trace"], ["retry", "attempt+error", "预算/幂等问题", "retry-diff"]], caption: "阶段指标要能改变下一步动作，而不是成为漂亮的仪表盘。" } }, { title: "AP02 项目交接与边界", body: ["交接包包括指标字典、起止点定义、baseline/fault/repair、未知字段清单和 capability probe。新 Agent 必须重新确认模型版本、缓存策略、工具 schema 与业务 SLO；真实 provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], bullets: ["端到端优先于局部变快", "每个分位数绑定窗口", "观测缺口保持 UNKNOWN"] }],
    "TD-AP03": [{ title: "AP03 Project lab：Trace 闭包与重放审计", body: ["对退款任务建立 root、retrieval、generation、tool、retry、handoff、terminal 七类节点，逐条检查 parent_id、trace_id、task_id 和版本。tool attempt 必须与 ledger 调用数相等；可写工具还要有 schema hash、幂等键、脱敏状态和远端 receipt。terminal 缺失时只能报告 UNKNOWN，不能用最终文本推断业务成功。", "故障诊断从传播、采集、存储、采样和脱敏五层逐层排查：先比 root/child 关系，再对 attempt ledger，再看 collector receipt，最后检查字段是否被错误删除。把一条断链 trace 重放到隔离 fixture，验证 repair 只补缺失 parent 或 finalize event，不改变 Oracle。交付 schema diff、字段隐私表、可重放样例和 trace-decision record；真实 telemetry、provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], table: { headers: ["闭包检查", "计算/证据", "失败结论", "交付"], rows: [["parent graph", "每个 child 有 parent", "传播断链", "trace-graph"], ["attempt ledger", "span 数=调用数", "聚合漏计", "ledger-diff"], ["schema/redaction", "hash+隐私状态", "不可审计", "schema-diff"], ["terminal", "finalize event 存在", "业务未知", "replay-case"]], caption: "Trace 页的核心决定是能否把故障定位到具体节点，并安全重放。" } }, { title: "AP03 页面专属交接", body: ["交接时保留 trace writer 配置、collector receipt、root-to-terminal 图和一条高危失败样例；下一个系统要重新确认采样策略、字段命名和脱敏要求。仅授权、fixture 边界和 NOT_RUN 可共享，arrival、容量、重试判断不能复制到本页。"], bullets: ["结构闭包先于语义解释", "高危失败应保留完整轨迹", "脱敏不能删掉诊断关系"] }],
    "TD-AP04": [{ title: "AP04 Project lab：open/closed 到达时钟对账", body: ["设 offered rate=60 task/min、deadline=10 秒、5 秒时间桶。每桶保存计划到达、实际发出、完成、队列和超时；当系统变慢时计划仍为 5 而实际降到 3，closed 模型会遗漏两名用户的等待，open 模型则把样本保留在分母。延迟必须从计划到达时刻计，而非从压测循环开始计。", "先排除压测端 CPU、连接和出口带宽，再以相同 workload hash、版本和 deadline 比较 open/closed。注入 executor 饥饿、queue 堵塞和 deadline 缩短三类 fault，分别诊断发压端、服务排队和 SLO 层。交付 offered-achieved 表、arrival timeline、executor 资源、SLO decision；真实 provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], table: { headers: ["时钟", "样例", "误判", "工件"], rows: [["计划", "5/桶", "用户已发出", "arrival-plan"], ["实际", "3/桶", "系统吞吐下降", "executor-log"], ["完成", "3/桶", "遗漏被隐藏", "completion-log"], ["SLO", "按计划计时", "p99 偏低", "arrival-decision"]], caption: "到达模型的专业判断是是否保留被协调遗漏的用户等待。" } }, { title: "AP04 页面专属交接", body: ["迁移交付只复用 offered/achieved 字段、时间桶和资源排查顺序；arrival rate、deadline、并发和容量阈值必须由新业务 owner 重定。closed 可用于固定并发瓶颈定位，不应替代 open 的外部 SLO 证据。"], bullets: ["计划时刻进入分母", "先排压测端瓶颈", "两轮 workload 必须同 hash"] }],
    "TD-AP05": [{ title: "AP05 Project lab：SLO 阶梯容量卡", body: ["固定 workload hash、SLO=p95≤8 秒，每个台阶稳定 5 分钟，按 20/40/60/80 task/min 加压。示例 60 级 goodput=55、p95=7.8 秒，80 级 goodput=62、p95=11 秒，因此容量取 60 而非最大吞吐 62。随后只改变 queue、batch、缓存或工具中的一个变量，观察首个硬门禁是否移动。", "诊断要同时看 goodput、p95/p99、queue、TTFT、TPOT、tool 和 retry；若没有拐点，先查台阶间隔、稳定时长、缓存暖机和压测端资源。迁移到真实服务时补真实长尾、业务 Oracle、成本和硬件，合成数字不能进入发布门禁。交付容量曲线、首失败表、单变量复测、适用条件和 UNKNOWN 清单；production capacity 仍 NOT_RUN。"], table: { headers: ["台阶", "goodput", "p95", "decision"], rows: [["20", "18", "5.2s", "baseline"], ["40", "37", "6.8s", "稳定"], ["60", "55", "7.8s", "容量候选"], ["80", "62", "11s", "首个失败"]], caption: "容量不是最大吞吐，而是满足业务 SLO 的最高可解释台阶。" } }, { title: "AP05 页面专属交接", body: ["交接工件写明 workload/SLO hash、版本、硬件、台阶稳定时间、首个失败层、瓶颈证据、单变量改动和 owner。新服务须重新决定 good-task、成本、工具比例和容量安全余量；provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], bullets: ["先锁 SLO 再加压", "首个失败优先于最大吞吐", "单变量才能支持归因"] }],
    "TD-AP06": [{ title: "AP06 Project lab：重试预算与副作用账本", body: ["总 deadline=30 秒，gateway/SDK/Agent/tool 的最大次数为 2×2×3×2=24；若每次 tool 2 秒，最坏等待 48 秒，已超过任务预算。decision 只能是削减层级次数、关闭写工具自动重试或转人工，不能把外层 timeout 无限延长。对每个 attempt 保存错误类型、幂等键、读写性质、receipt 和最终终态。", "注入 429、网络超时、未知写结果和降级失败四种 fault。429 可有限退避；未知写结果必须先用业务 key 对账；只读、人工升级和明确拒绝是合法终态；重复扣款、重复退款和无审计写入硬阻断。交付 attempt ledger、deadline timeline、retry amplification 计算、repair 对照和 rollback note；真实 provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], table: { headers: ["计算/症状", "怀疑层", "decision", "工件"], rows: [["24 attempts", "预算传播", "任务级限额", "budget-sheet"], ["48s>30s", "deadline", "递减/降级", "deadline-trace"], ["两次写账本", "幂等", "暂停并对账", "effect-ledger"], ["合法降级被报错", "终态 Oracle", "补只读/人工", "terminal-matrix"]], caption: "重试是否可接受，必须同时满足时间预算和副作用安全。" } }, { title: "AP06 页面专属交接", body: ["交接时保存预算表、依赖错误码、幂等语义、账本回执、降级 owner 和 repair 结论；新系统必须重新确认哪些工具可写、哪些错误可重试。仅 NOT_RUN 边界可共享，不能复制其他性能页面的 arrival 或容量阈值。"], bullets: ["预算小于 deadline", "未知写结果先对账", "无限重试永远不是修复"] }],
    "TD-AP07": [{ title: "AP07 Project lab：八小时 soak 的慢变量证据", body: ["固定版本、固定 workload、SLO 拐点的 70% 负载运行八小时，首中尾分别抓内存对象、连接、句柄、临时文件、GC、尾延迟和 cleanup receipt。持续正斜率才是泄漏候选；上升后平台要结合缓存上限和对象类型判断。若 cleanup 从 99% 降至 92% 而内存未升，优先查回收链而不是堆内存。", "禁止中途部署、自动重启和自动扩缩容；一旦发生，记录时间点并废弃本轮结论。故障诊断先比较快照差分，再关联连接池、句柄、临时文件和尾延迟；修复后要用同一版本、同一负载重跑。交付趋势图、快照排序、停止记录、泄漏候选清单和 regression；真实长稳、provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], table: { headers: ["观察", "判断", "复验", "工件"], rows: [["内存平台", "有界缓存候选", "查上限", "heap-diff"], ["句柄正斜率", "资源泄漏", "对象差分", "handle-trend"], ["cleanup 下降", "回收异常", "按 owner 查", "cleanup-receipt"], ["中途重启", "实验污染", "整轮作废", "stop-record"]], caption: "Soak 结论来自慢变量、停止条件和快照差分的组合。" } }, { title: "AP07 页面专属交接", body: ["迁移只复用趋势字段、首中尾快照和停止规则；GC、缓存、连接池实现及阈值必须由新运行时重新解释。项目接收人要签收环境不变性、资源 owner、回归样例和残留风险，production soak 仍 NOT_RUN。"], bullets: ["固定版本才能比较", "平台期不等于泄漏", "中途变更即废弃"] }],
    "TD-AP08": [{ title: "AP08 Project lab：good-task SLO 到告警动作", body: ["为订单 Agent 定义 good-task：终态正确、p95≤10 秒、cost/success 不超预算、非法副作用为零。短窗高 burn-rate 触发止血，长窗中 burn-rate 进入排查；每条告警绑定 owner、响应时间、降级开关和回滚条件。HTTP 200 但终态错误必须计入失败分母。", "事故卡记录影响切片、good-task 分母、窗口、burn rate、止血动作、降级状态、恢复证据和回归样例。若告警抖动，查窗口与分母；若无人响应，补责任链；若事故复发，把确认的 fault 固化为 regression。交付 SLO 卡、错误预算、owner matrix、事故卡和回归报告；真实 provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。"], table: { headers: ["硬条件", "信号", "动作", "工件"], rows: [["终态正确", "good-task rate", "低于门禁阻断", "oracle-card"], ["p95≤10s", "尾延迟", "降级/扩容", "slo-card"], ["cost/success", "预算消耗", "限制上下文", "cost-report"], ["副作用=0", "ledger diff", "硬红线回滚", "incident-card"]], caption: "SLO 的价值在于它能驱动责任人采取可审计动作。" } }, { title: "AP08 页面专属交接", body: ["迁移到另一业务时重做合法终态、成本上限、风险分层、窗口组合和 owner matrix；不能复制订单场景阈值。接收人要复核 burn-rate、回滚和 regression 的关系，并区分 fixture-tested、model/integration、practitioner、learner、live、production 证据。"], bullets: ["good-task 是业务分子", "告警必须绑定动作", "事故必须回流回归"] }],
  };
  const extra = cards[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5PerformanceCaseNotes = (page: TutorialPage): TutorialPage => {
  const notes: Record<string, TutorialPage["blocks"]> = {
    "TD-AP01": [{ title: "AP01 负载审查记录", body: ["评审时逐条回答样本是否具备业务 Oracle、是否落入合法切片、是否有排除原因。把 80 条退款、90 条查询和 30 条转人工分别计算分母，任何切片漂移都生成新 workload hash。这样容量结果不会因为流量构成变化而被误解释。", "交接时附上样本抽样窗口、隐私处理、owner 和未知项；没有真实数据时只讲 fixture 检测力，不写业务普遍性。"], table: { headers: ["审查", "证据", "动作"], rows: [["样本有效", "Oracle/字段", "纳入或排除"], ["切片稳定", "比例/hash", "新实验"], ["终态正确", "账本/引用", "阻断"], ["隐私合规", "脱敏 receipt", "保留 Unknown"]], caption: "负载审查先问样本能否被判定。" } }],
    "TD-AP02": [{ title: "AP02 指标审查记录", body: ["阶段指标评审要把起止时间、分母、分位窗口和任务终态放在同一张卡上。若 tool 4 秒而 TTFT 2 秒，优化顺序应由业务风险和副作用决定；若 retry 1 秒但调用放大，必须先对账 attempt。", "下一位工程师接收指标卡时，先做 capability probe，读不到的阶段保持 UNKNOWN，不能用端到端数字填补。"], table: { headers: ["审查", "证据", "动作"], rows: [["阶段闭合", "span 加总", "补观测"], ["分母一致", "任务切片", "重算"], ["尾延迟", "p95/p99 窗口", "定位"], ["副作用", "tool receipt", "阻断"]], caption: "指标必须连接到任务决策。" } }],
    "TD-AP03": [{ title: "AP03 Trace 复盘记录", body: ["逐节点核对 parent_id、attempt ledger、schema hash 和 terminal event。若 root-to-terminal 不闭合，先保存缺口和采样信息；若 tool span 与账本不一致，先修 writer 或 collector，再讨论模型质量。", "交接工件包含字段隐私表和 replay case，保证下一位工程师可重现同一断链，而非只看一段自然语言答案。"], table: { headers: ["复盘", "证据", "结论"], rows: [["传播", "parent graph", "断链"], ["采集", "collector receipt", "丢失"], ["账本", "attempt 对账", "聚合错"], ["终态", "finalize event", "Unknown"]], caption: "Trace 复盘围绕结构闭包。" } }],
    "TD-AP04": [{ title: "AP04 到达模型复盘", body: ["把计划、实际、完成、队列和超时按 5 秒桶对齐。closed 只说明固定并发循环，open 才保留被服务变慢影响的计划请求；两者不能混用为同一容量数字。", "交接时保留压测端资源、arrival clock、deadline 与 workload hash，任何字段缺失都不升级为容量结论。"], table: { headers: ["复盘", "证据", "结论"], rows: [["计划", "arrival clock", "用户等待起点"], ["实际", "executor log", "发压能力"], ["队列", "queue span", "服务排队"], ["超时", "deadline", "SLO 影响"]], caption: "到达时钟决定分母。" } }],
    "TD-AP05": [{ title: "AP05 容量复盘记录", body: ["容量评审先锁 SLO，再读取各台阶的 goodput 和 p95。示例 60 级满足 p95 7.8 秒，80 级违反 8 秒门禁，因此容量候选是 60。所有瓶颈判断都要绑定 workload、版本和硬件。", "交接时附首个失败证据、单变量改动和 UNKNOWN 清单，不能把 fixture 阶梯当成生产承诺。"], table: { headers: ["复盘", "证据", "动作"], rows: [["SLO", "p95/p99", "定门禁"], ["吞吐", "goodput", "看有效任务"], ["瓶颈", "queue/tool/retry", "单变量"], ["适用性", "hash/版本", "限制范围"]], caption: "容量数字脱离条件没有意义。" } }],
    "TD-AP06": [{ title: "AP06 重试复盘记录", body: ["把每一层 attempt 与总 deadline 放在同一时间线。24 次最坏调用、每次 2 秒即 48 秒，说明预算传播已失败；未知写结果要先对账，不得继续自动重试。", "交接时保留错误分类、幂等键、receipt 和降级 owner，下一系统必须重新确认哪些工具可写、哪些错误可重试。"], table: { headers: ["复盘", "证据", "动作"], rows: [["预算", "attempt×耗时", "削减"], ["幂等", "业务 key/ledger", "暂停"], ["错误", "429/timeout", "分类"], ["终态", "人工/只读", "审计"]], caption: "重试复盘同时看时间和副作用。" } }],
    "TD-AP07": [{ title: "AP07 Soak 复盘记录", body: ["首中尾快照要按对象、连接、句柄、临时文件排序，并与 cleanup、尾延迟和 GC 对齐。平台期不等于泄漏，持续正斜率才是候选；中途重启或部署会使比较失效。", "交接时记录停止原因、环境不变性和回归样例，生产长稳仍需独立验证。"], table: { headers: ["复盘", "证据", "动作"], rows: [["趋势", "首中尾", "找斜率"], ["资源", "对象/连接", "差分"], ["回收", "cleanup receipt", "查 owner"], ["环境", "部署/重启", "作废重跑"]], caption: "Soak 复盘依赖慢变量。" } }],
    "TD-AP08": [{ title: "AP08 SLO 复盘记录", body: ["good-task 必须同时看终态、p95、成本和副作用。短窗 burn-rate 负责止血，长窗 burn-rate 负责排查；HTTP 200 但订单状态错误仍是失败。", "交接时把告警、owner、降级开关、回滚和 regression 绑在同一事故卡，不能只交一张趋势图。"], table: { headers: ["复盘", "证据", "动作"], rows: [["质量", "good-task", "阻断"], ["性能", "p95", "降级"], ["成本", "cost/success", "限额"], ["副作用", "ledger diff", "回滚"]], caption: "SLO 复盘必须能触发动作。" } }],
  };
  const extra = notes[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5PerformanceFinalDepth = (page: TutorialPage): TutorialPage => {
  const text: Record<string, TutorialPage["blocks"]> = {
    "TD-AP01": [{ title: "AP01 最终练习：审查一份 workload manifest", body: ["学习者拿到一份混合任务清单，逐行判断是否有 Oracle、是否属于合法终态、是否应被排除，并解释排除不会被悄悄算入成功率。最终输出必须同时包含样本分母、切片比例、profile hash、未知项和 owner。", "迁移到另一个业务时，先复制字段契约和审查顺序，再重新定义任务终态、写工具副作用和采样窗口。若新业务没有可回读的业务事实，不能把旧 workload 的 good-task 率作为默认基线。"], table: { headers: ["审查项", "输入", "结果"], rows: [["Oracle", "订单/账本", "纳入或排除"], ["切片", "task_type/tool_hops", "重算比例"], ["版本", "profile hash", "新实验"], ["边界", "真实流量缺失", "NOT_RUN"]], caption: "AP01 以可判定的样本为容量实验起点。" } }],
    "TD-AP02": [{ title: "AP02 最终练习：从指标卡做一次决策", body: ["学习者比较两次运行：一次 TTFT 下降但 tool 变慢，一次裸 QPS 上升但 good-task 下降。必须根据阶段分母、终态、成本和副作用选择回滚或继续，而不是挑选更好看的单项数字。", "交接时附指标定义、观测起止点、窗口、未知字段和复验动作；新系统不能继承旧阈值，必须由业务 owner 重新确认。"], table: { headers: ["对照", "事实", "决策"], rows: [["TTFT", "局部变快", "看端到端"], ["tool", "依赖变慢", "隔离重测"], ["QPS", "good-task 下降", "阻断"], ["观测", "字段缺失", "UNKNOWN"]], caption: "AP02 的输出是决策，而不是指标堆叠。" } }],
    "TD-AP03": [{ title: "AP03 最终练习：修复一条断链 Trace", body: ["学习者从 root、tool、retry 和 terminal 中找出缺失 parent 或 finalize event，先保留原始 trace 与隐私状态，再提交最小修复。修复后必须证明 attempt ledger、schema hash 和业务终态仍一致，不能通过删除失败 span 让图看起来完整。", "接收人要能按 replay case 重现断链、核对 collector receipt，并知道真实 telemetry 和 provider 行为还没有运行。"], table: { headers: ["修复", "验证", "阻断"], rows: [["补 parent", "图闭合", "传播缺失"], ["补 terminal", "终态可判定", "业务 Unknown"], ["对账 ledger", "调用数一致", "成本失真"], ["保留脱敏", "隐私可追", "不可审计"]], caption: "AP03 只接受不破坏原始证据的修复。" } }],
    "TD-AP04": [{ title: "AP04 最终练习：识别 coordinated omission", body: ["学习者比较同一 workload 在 open 与 closed 下的时间桶。当系统变慢、实际发出数下降时，必须把计划但未发出的任务保留在 open 的分母，并解释 closed 为什么会低估 p99。", "项目交接时明确 arrival clock、executor 资源、deadline、queue 和 hash；没有这些字段，只能报告局部 fixture 行为。"], table: { headers: ["情况", "closed", "open"], rows: [["服务正常", "局部可比", "SLO 可比"], ["服务变慢", "遗漏等待", "保留分母"], ["压测端满", "误判服务瓶颈", "先排除"], ["hash 不同", "不可归因", "重跑"]], caption: "AP04 的核心是保留真实到达压力。" } }],
    "TD-AP05": [{ title: "AP05 最终练习：签发容量卡", body: ["学习者根据 SLO 阶梯结果签发容量卡：写明满足门禁的最高台阶、首个失败信号、测试条件、硬件、workload hash 和未知项。最大吞吐超过 SLO 的台阶不能写成容量。", "交接时附单变量复测结果，下一服务必须重做 good-task、成本和长尾定义。"], table: { headers: ["容量卡字段", "示例", "限制"], rows: [["SLO", "p95≤8s", "业务 owner 定义"], ["最高台阶", "60/min", "非最大吞吐"], ["首失败", "80 p95=11s", "要有证据"], ["条件", "hash/版本/硬件", "不可脱离"]], caption: "AP05 让容量结论可被复核和迁移。" } }],
    "TD-AP06": [{ title: "AP06 最终练习：拒绝危险重试", body: ["学习者对 429、超时、未知写结果分别选择有限重试、对账或降级，并计算预算是否小于总 deadline。任何重复写账本、无幂等键、无 receipt 的路径都必须硬阻断。", "交接时保存 attempt、错误分类、幂等语义、终态 Oracle 和 repair 结果；新业务需重新确认写工具边界。"], table: { headers: ["错误", "可选动作", "禁止"], rows: [["429", "有限退避", "无限重试"], ["超时", "重新读取", "直接写第二次"], ["未知写", "业务对账", "假设未执行"], ["副作用重复", "暂停回滚", "只看文本"]], caption: "AP06 以副作用安全约束性能优化。" } }],
    "TD-AP07": [{ title: "AP07 最终练习：给出 Soak 结论", body: ["学习者根据首中尾快照和趋势判断平台期、泄漏候选、cleanup 故障或实验污染，并写出下一轮复验。任何中途重启或版本变化都必须使本轮结论失效。", "交接时记录环境不变性、资源 owner、停止时间、残留风险和回归样例；生产长稳仍需单独验证。"], table: { headers: ["观察", "结论", "复验"], rows: [["平台", "有界缓存候选", "查上限"], ["正斜率", "泄漏候选", "差分"], ["cleanup 下降", "回收异常", "查 owner"], ["中途变更", "实验失效", "重跑"]], caption: "AP07 只在不变条件下解释慢变量。" } }],
    "TD-AP08": [{ title: "AP08 最终练习：把事故卡变成回归", body: ["学习者把一次 good-task SLO 事故写成固定回归：终态错误、p95 超限、成本超限和副作用各有一个 Oracle，并绑定短窗/长窗 burn-rate、owner、降级和回滚。", "迁移时重新定义合法终态、成本和风险分层，不能复用订单 Agent 的阈值；没有真实 provider、integration、practitioner、learner、live、production 证据时保持 NOT_RUN。"], table: { headers: ["事故", "回归", "动作"], rows: [["终态错", "业务 Oracle", "阻断"], ["尾延迟", "p95 case", "降级"], ["成本超", "cost/success", "限额"], ["副作用", "ledger diff", "回滚"]], caption: "AP08 的闭环是告警、动作与回归。" } }],
  };
  const extra = text[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

const wave5PerformanceAcceptance = (page: TutorialPage): TutorialPage => {
  const cards: Record<string, TutorialPage["blocks"]> = {
    "TD-AP01": [{ title: "AP01 验收标准", body: ["验收必须同时看到 workload hash、样本分母、切片比例、业务 Oracle 和 excluded_reason；缺 Oracle 的样本不能被写入成功率。"], bullets: ["分母可重算", "终态有 owner", "真实业务流量仍 NOT_RUN"] }],
    "TD-AP02": [{ title: "AP02 验收标准", body: ["验收必须能把 queue、TTFT、TPOT、tool、retry 和端到端耗时对齐到同一任务；观测不到的阶段保持 UNKNOWN，不以平均数补齐。"], bullets: ["阶段加总可核对", "分位数有窗口", "真实 provider 指标仍 NOT_RUN"] }],
    "TD-AP03": [{ title: "AP03 验收标准", body: ["验收必须证明 Trace root-to-terminal 闭包、attempt ledger、schema hash、脱敏状态和 terminal event 均可回读；缺任何一项都不能声明业务通过。"], bullets: ["结构证据优先", "可重放且不篡改", "真实 telemetry 仍 NOT_RUN"] }],
    "TD-AP04": [{ title: "AP04 验收标准", body: ["验收必须保留计划到达、实际发出、完成、队列和超时，并明确 open/closed 的目的不同；计划样本不能因发压端循环停止而消失。"], bullets: ["分母保留遗漏", "压测端先排除", "真实容量仍 NOT_RUN"] }],
    "TD-AP05": [{ title: "AP05 验收标准", body: ["验收必须以业务 SLO 选出首个失败前台阶，并附 workload、版本、硬件、稳定时长和单变量瓶颈证据；最大吞吐不能替代容量。"], bullets: ["首失败可解释", "条件完整", "production capacity 仍 NOT_RUN"] }],
    "TD-AP06": [{ title: "AP06 验收标准", body: ["验收必须证明最坏重试预算小于任务 deadline，写工具有幂等键和业务 receipt，未知写结果会先对账；副作用重复直接阻断。"], bullets: ["预算可计算", "写操作可追溯", "真实 integration 仍 NOT_RUN"] }],
    "TD-AP07": [{ title: "AP07 验收标准", body: ["验收必须有固定版本、固定负载、首中尾快照、资源趋势、cleanup receipt 和停止记录；中途变更会使本轮结论失效。"], bullets: ["慢变量可比较", "快照可差分", "production soak 仍 NOT_RUN"] }],
    "TD-AP08": [{ title: "AP08 验收标准", body: ["验收必须把 good-task、p95、cost/success、副作用、burn-rate、owner、降级和回归绑定起来；HTTP 200 不能覆盖业务终态失败。"], bullets: ["告警有动作", "事故有回归", "live/production SLO 仍 NOT_RUN"] }],
  };
  const extra = cards[page.id];
  return extra ? { ...page, blocks: [...page.blocks, ...extra] } : page;
};

export const agentPerformancePages: TutorialPage[] = ([
  {
    "id": "TD-AP01",
    "moduleId": "TD-M11",
    "order": 1,
    "title": "先建工作负载模型：Task 不是 HTTP Request",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "65 分钟",
    "summary": "把任务类型、上下文、工具路径、允许终态和故障分布写成版本化 workload，避免用单一 Prompt 或入口 2xx 假装代表真实 Agent。",
    "why": "Agent 一项用户任务可能展开成多轮模型、工具与重试；分母错了，吞吐、成功率和成本都会假绿。",
    "prerequisites": [],
    "outcomes": [
      "区分 task/run/request/model/tool 五种工作单元",
      "为每个任务切片定义业务 Oracle 与预算",
      "运行缺切片/缺 Oracle 的可检测故障"
    ],
    "artifact": "TD-AP01 工作负载模型与 Oracle 证据卡",
    "architecture": {
      "title": "TD-AP01 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "业务任务与风险切片",
        "版本化 workload fixture",
        "到达调度器",
        "Agent/模型/工具夹具",
        "task 终态 Oracle",
        "Gate 与证据卡"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "先从用户要完成的业务任务切片，而不是从 URL 或 Prompt 文案切片。每条样本同时保存 task_type、token_bucket、expected_tools、allowed_terminal_states、latency_budget 和 provenance。",
          "入口 2xx 只证明接收；task success 要验证最终终态、工具副作用与预算。模型调用、工具调用和 retry 是放大因子，不是用户任务分母。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "用户任务",
              "eligible task",
              "允许终态且副作用正确"
            ],
            [
              "Agent run",
              "run_id",
              "工作流到达合法终态"
            ],
            [
              "模型调用",
              "generation",
              "生成完成，不代表任务正确"
            ],
            [
              "工具调用",
              "tool attempt",
              "返回成功，不代表幂等正确"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "call_amplification = (model_calls + tool_calls) / eligible_tasks\nbusiness_success_rate = allowed_terminal_tasks / eligible_tasks",
          "verification": "逐条核对分母是 eligible_tasks，且 fixture 中每条任务都有 allowed terminal state。"
        },
        "expected": "逐条核对分母是 eligible_tasks，且 fixture 中每条任务都有 allowed terminal state。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "抽样真实但脱敏的 Trace，先按业务风险和路径分层",
          "为每层建立输入长度、步骤、工具、缓存和失败联合分布",
          "把观察流量、预测峰值和 synthetic fault 分开标注",
          "版本化数据、价格、Prompt、工具 schema 与业务 Oracle"
        ],
        "warning": "fault 将 represented_slice_rate 与 business_oracle_rate 同时降到 0.5；删除阈值或用入口 2xx 替代 Oracle 都不算修复。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP01 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP01/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP01/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP01/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP01/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP01/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP01-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP01-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP01/baseline/summary.json",
            "reports/TD-AP01/fault/summary.json",
            "reports/TD-AP01/repair/summary.json",
            "reports/TD-AP01/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP01、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP01 cycle 并保存 0/1/0",
      "fault 将 represented_slice_rate 与 business_oracle_rate 同时降到 0.5；删除阈值或用入口 2xx 替代 Oracle 都不算修复。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S47",
      "S48",
      "S68",
      "S72",
      "S75",
      "S77"
    ],
    "evidenceBoundary": "工作负载建模机制来自公开来源；示例任务分布是 deterministic fixture。真实 AI provider/model、integration、practitioner review、learner run、live 与 production 峰值、路径和容量均 NOT_RUN，不能外推。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP01 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP01.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP01 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP01-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP01 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP01.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP01 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP01/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP02",
    "moduleId": "TD-M11",
    "order": 2,
    "title": "建立指标树：TTFT、TPOT、Queue、Retry、Step",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "70 分钟",
    "summary": "把用户等待拆为排队、首 Token、逐 Token、工具、重试和编排，并用 task success 与 goodput 防止只追求吞吐。",
    "why": "单一 E2E 平均值无法说明慢在何处；不控制输入/输出 Token、任务类型与步骤数，版本比较没有可解释性。",
    "prerequisites": [
      "TD-AP01"
    ],
    "outcomes": [
      "正确解释 TTFT、TPOT/ITL、Queue 和 E2E",
      "为 retry 与 step 指标写清分母和门禁",
      "从红灯下钻到可行动的根因候选"
    ],
    "artifact": "TD-AP02 Agent 性能指标字典",
    "architecture": {
      "title": "TD-AP02 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "计划到达时间",
        "Queue wait",
        "Prefill/TTFT",
        "Decode/TPOT",
        "Tool/Retry/Step",
        "Task Goodput Gate"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "TTFT 包含排队与 Prefill；TPOT/ITL 描述首 Token 后的生成节奏；E2E 还包括工具、重试与编排。比较前必须固定或分桶 input/output tokens。",
          "Retry 与 Step 是 Agent 特有放大器。最终成功也可能经过大量尝试，所以要同时看 retry_p95、step_p95、cost_per_success 和 goodput。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "queue_p95",
              "started_at-admitted_at",
              "调度/容量"
            ],
            [
              "TTFT p95",
              "first_token-request",
              "排队+Prefill"
            ],
            [
              "TPOT p95",
              "decode time/token",
              "Decode 竞争"
            ],
            [
              "retry p95",
              "extra attempts/task",
              "依赖不稳/策略"
            ],
            [
              "step p95",
              "model+tool steps/task",
              "循环/路由退化"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "good_task = business_success && e2e_ms <= budget && retry_count <= budget\ngoodput = good_tasks / observed_duration_seconds",
          "verification": "用相同 workload_version 重算 fault 和 repair；任何不满足质量/延迟/重试预算的任务不得进入 goodput。"
        },
        "expected": "用相同 workload_version 重算 fault 和 repair；任何不满足质量/延迟/重试预算的任务不得进入 goodput。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "先按 task_type 与 token bucket 分组",
          "先读 queue，再读 TTFT/TPOT，再读工具与 retry/step",
          "分开成功和失败延迟，保留 p50/p95/p99",
          "每个告警指标写 owner、窗口、阈值来源与动作"
        ],
        "warning": "fault 同时增加 TTFT、TPOT、Queue、Retry 和 Step，五个门禁应全部红；repair 不能删掉任何指标。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP02 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP02/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP02/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP02/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP02/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP02/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP02-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP02-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP02/baseline/summary.json",
            "reports/TD-AP02/fault/summary.json",
            "reports/TD-AP02/repair/summary.json",
            "reports/TD-AP02/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP02、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP02 cycle 并保存 0/1/0",
      "fault 同时增加 TTFT、TPOT、Queue、Retry 和 Step，五个门禁应全部红；repair 不能删掉任何指标。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S47",
      "S51",
      "S67",
      "S69",
      "S73",
      "S74"
    ],
    "evidenceBoundary": "指标语义可迁移，阈值不可迁移。当前数字只证明 fixture 检测力；真实 AI provider/model、integration、practitioner review、learner run、live 与 production 性能均 NOT_RUN。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP02 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP02.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP02 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP02-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP02 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP02.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP02 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP02/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP03",
    "moduleId": "TD-M11",
    "order": 3,
    "title": "锁定 Trace 语义：从 Task Root 到 Tool Attempt",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "70 分钟",
    "summary": "设计一条 task 一个根 Trace、generation/tool/retry/handoff 为子 Span 的证据模型，并把标准字段、本地扩展和隐私策略分开。",
    "why": "只有日志和最终延迟时，无法判断排队、模型、工具、重试或未埋点等待；Trace 缺父子关系也会让因果链断裂。",
    "prerequisites": [
      "TD-AP02"
    ],
    "outcomes": [
      "画出 task-rooted Span 树",
      "区分标准 gen_ai 字段与 app 扩展",
      "检测 orphan span、缺终态和高基数风险"
    ],
    "artifact": "TD-AP03 Trace Schema 与字段治理表",
    "architecture": {
      "title": "TD-AP03 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "invoke_agent root",
        "queue.wait span",
        "gen_ai generation span",
        "execute_tool attempt span",
        "task.finalize event",
        "Metric/Trace/Log 存储与访问"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "Span 表示有时长的操作，parent/span context 组成树。一个 task root 下保存 generation、tool、retry、handoff 与 finalize，才能从用户症状追到具体步骤。",
          "OpenTelemetry GenAI Agent 约定仍在 Development。锁定 schema/version；缺少的 task、attempt、budget、oracle 字段放在 app.*，不要冒充稳定标准。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "Metric",
              "低基数速率/分位数",
              "不要放 task_id、原文"
            ],
            [
              "Trace",
              "单任务关键路径/attempt",
              "按风险采样与保留"
            ],
            [
              "Log",
              "离散错误/审计事件",
              "不能替代结构化耗时"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "unattributed_ms = task_e2e_ms - critical_path_ms\ntrace_complete = root && all_required_children_parented && terminal_event",
          "verification": "从 fault traces.jsonl 抽一条 orphan span；验证 trace_complete_rate 门禁拒绝它。"
        },
        "expected": "从 fault traces.jsonl 抽一条 orphan span；验证 trace_complete_rate 门禁拒绝它。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "根 Span 使用低基数操作名，实例标识放属性",
          "模型/工具每次物理尝试单独 Span，逻辑调用另用 parent/link",
          "正文默认不采集，仅保存长度、版本、哈希和分类",
          "慢/错任务提高采样率，但访问、保留和审计另设策略"
        ],
        "warning": "fault 让 45% generation/tool Span 丢失父子关联；repair 恢复关联，而不是在报表端伪造 parent。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP03 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP03/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP03/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP03/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP03/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP03/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP03-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP03-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP03/baseline/summary.json",
            "reports/TD-AP03/fault/summary.json",
            "reports/TD-AP03/repair/summary.json",
            "reports/TD-AP03/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP03、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP03 cycle 并保存 0/1/0",
      "fault 让 45% generation/tool Span 丢失父子关联；repair 恢复关联，而不是在报表端伪造 parent。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S49",
      "S70",
      "S71",
      "S72",
      "S80"
    ],
    "evidenceBoundary": "Trace 结构是课程实现；语义约定仍会变化。真实 AI provider/model、integration、practitioner review、learner run、live 与 production telemetry 均 NOT_RUN，生产前需锁版本、验证后端兼容并完成隐私评审。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP03 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP03.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP03 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP03-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP03 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP03.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP03 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP03/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP04",
    "moduleId": "TD-M11",
    "order": 4,
    "title": "对照开放与封闭负载：识别 Coordinated Omission",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "70 分钟",
    "summary": "用同一 workload 分别控制到达率和并发，观察系统变慢时闭环如何自动降速，并记录计划到达与实际完成。",
    "why": "固定并发中，系统越慢发压端越慢，恰好漏掉本应继续到达的用户任务，容易把过载写成健康。",
    "prerequisites": [
      "TD-AP03"
    ],
    "outcomes": [
      "解释 open/closed 模型控制量",
      "识别 coordinated omission",
      "为容量、用户并发和回放选择合适负载"
    ],
    "artifact": "TD-AP04 开闭环对照报告",
    "architecture": {
      "title": "TD-AP04 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "固定 workload",
        "Open arrival scheduler",
        "Closed VU scheduler",
        "同一 Agent fixture",
        "计划/实际到达记录",
        "Queue/Goodput 对照"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "闭环中下次迭代等待上次完成，适合固定并发用户体验；开环到达与完成解耦，更直接测试每秒固定任务到来时的排队和拒绝。",
          "模型不是优劣关系。容量边界、突发和过载优先开环；固定用户/会话并发可用闭环。两者用同一任务分布交叉验证。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "Closed",
              "并发 VU",
              "用户被系统速度反压",
              "可能漏记等待中的到达"
            ],
            [
              "Open",
              "arrival rate",
              "容量/排队/拒绝",
              "需限制队列与发压资源"
            ],
            [
              "Replay",
              "真实时间间隔",
              "已知业务回归",
              "历史不代表未来峰值"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "arrival_fidelity = min(observed_rate,target_rate) / max(observed_rate,target_rate)\ncoordinated_omission_risk = closed_loop && service_time_controls_next_arrival",
          "verification": "比较 fault 的 closed load 与 repair 的 open load；不能只因 closed p95 较低就宣布容量更高。"
        },
        "expected": "比较 fault 的 closed load 与 repair 的 open load；不能只因 closed p95 较低就宣布容量更高。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "固定 task mix、seed、资源和 gate",
          "同时记录 scheduled_at、admitted_at、started_at、completed_at",
          "报告 dropped/queued/rejected，而非无限排队",
          "校验发压端 CPU/连接池，避免负载生成器成为瓶颈"
        ],
        "warning": "fault 把容量实验换成 closed load，并降低 worker、放慢工具；应被 coordinated_omission 与 arrival fidelity 拒绝。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP04 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP04/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP04/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP04/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP04/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP04/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP04-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP04-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP04/baseline/summary.json",
            "reports/TD-AP04/fault/summary.json",
            "reports/TD-AP04/repair/summary.json",
            "reports/TD-AP04/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP04、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP04 cycle 并保存 0/1/0",
      "fault 把容量实验换成 closed load，并降低 worker、放慢工具；应被 coordinated_omission 与 arrival fidelity 拒绝。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S48",
      "S68",
      "S75",
      "S77"
    ],
    "evidenceBoundary": "实验说明负载模型差异；它不包含真实 think time、峰值预测或生产资源。真实 AI provider/model、integration、practitioner review、learner run、live 与 production 负载均 NOT_RUN，因此不能输出生产容量。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP04 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP04.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP04 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP04-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP04 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP04.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP04 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP04/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP05",
    "moduleId": "TD-M11",
    "order": 5,
    "title": "寻找容量边界并归因瓶颈：只报告 Synthetic Goodput",
    "type": "项目",
    "status": "fixture-tested",
    "duration": "85 分钟",
    "summary": "在固定合成 workload 上逐级加压，找到第一个 SLO 失效阶梯，并用 queue/prefill/decode/tool/retry 信号给出瓶颈证据。",
    "why": "最大 QPS 可能来自错误、超时或降质任务；没有工作负载版本和瓶颈证据的容量数字不可用于采购或生产承诺。",
    "prerequisites": [
      "TD-AP04"
    ],
    "outcomes": [
      "画出 load-goodput-latency 曲线",
      "识别第一个门禁失效点",
      "用控制变量验证瓶颈假设"
    ],
    "artifact": "TD-AP05 Synthetic 容量曲线与瓶颈证据卡",
    "architecture": {
      "title": "TD-AP05 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "阶梯到达率",
        "Admission/Queue",
        "Agent Scheduler",
        "Model Prefill/Decode",
        "Tool Dependency",
        "Goodput Gate 与瓶颈对照"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "每个阶梯保持足够稳态，记录 offered load、accepted、completed、goodput、queue 与资源。当 latency/quality/cost 任一 gate 首次失败，前一稳定阶梯才是当前夹具的可持续点。",
          "瓶颈归因是证据链：症状→假设→确认/反证指标→一次只改一个变量的复跑。Queue 高并不自动等于 GPU 不足。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "queue↑ TTFT↑",
              "调度/模型饱和",
              "降到达或增 worker 对照"
            ],
            [
              "TTFT↑ token↑",
              "Prefill",
              "固定长度桶"
            ],
            [
              "TPOT↑ GPU高",
              "Decode",
              "固定输出与并发"
            ],
            [
              "tool p95↑ retry↑",
              "依赖/策略",
              "固定工具夹具"
            ],
            [
              "step↑ 资源平",
              "Agent 循环",
              "对比 workflow/prompt"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "synthetic_goodput = good_fixture_tasks / test_seconds\nfirst_failure_step = min(load_step where any versioned gate fails)",
          "verification": "报告必须带 synthetic/fixture 标签、profile hash 与第一个失败 gate；禁止把结果改名为 production capacity。"
        },
        "expected": "报告必须带 synthetic/fixture 标签、profile hash 与第一个失败 gate；禁止把结果改名为 production capacity。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "低负载建立 service-time baseline",
          "阶梯增加 open arrival rate，每阶梯等待稳态",
          "固定 token/path/failure mix，保存 run manifest",
          "用一个变量复跑确认 bottleneck，再讨论扩容或优化"
        ],
        "warning": "fault 压低 worker、提高到达率、放慢 tool 且隐藏 bottleneck；goodput、queue、attribution 应红。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP05 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP05/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP05/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP05/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP05/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP05/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP05-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP05-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP05/baseline/summary.json",
            "reports/TD-AP05/fault/summary.json",
            "reports/TD-AP05/repair/summary.json",
            "reports/TD-AP05/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP05、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP05 cycle 并保存 0/1/0",
      "fault 压低 worker、提高到达率、放慢 tool 且隐藏 bottleneck；goodput、queue、attribution 应红。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S47",
      "S51",
      "S67",
      "S68",
      "S69",
      "S75"
    ],
    "evidenceBoundary": "所有容量与 goodput 数字仅属于本地 deterministic synthetic fixture，真实 AI provider/model、integration、practitioner review、learner run、live 与 production capacity 均 NOT_RUN，不能用于生产 Sizing、SLA 或供应商比较。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP05 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP05.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP05 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP05-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP05 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP05.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP05 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP05/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP06",
    "moduleId": "TD-M11",
    "order": 6,
    "title": "约束超时与重试：压力下安全降级",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "80 分钟",
    "summary": "把 gateway、SDK、Agent 和 Tool 的多层尝试纳入一个总 deadline/retry budget，并为只读、人工和拒绝终态定义安全降级。",
    "why": "每层各重试 3 次会乘法放大；延迟变长触发更多重试，又进一步加剧排队和依赖过载。",
    "prerequisites": [
      "TD-AP05"
    ],
    "outcomes": [
      "计算多层重试放大",
      "设计总 deadline 与 attempts budget",
      "验证重试风暴被拒绝且 repair 不删 gate"
    ],
    "artifact": "TD-AP06 超时/重试/降级策略与 0/1/0 证据",
    "architecture": {
      "title": "TD-AP06 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "Ingress deadline",
        "Agent task budget",
        "Model SDK retry",
        "Tool retry/breaker",
        "Read-only/Human degrade",
        "Gate + reconciliation"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "重试只适用于暂态且幂等的失败，并尊重 Retry-After；指数退避加 jitter 减少同步重放，但仍需总 attempts 和 deadline。",
          "降级要定义合法终态：高风险写操作可切人工或只读，不能把失败模型输出直接当成功。恢复时逐级放量，避免积压瞬间重放。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "429/503",
              "在预算内重试",
              "Retry-After + jitter"
            ],
            [
              "400/401/403",
              "不重试",
              "修配置/权限"
            ],
            [
              "写工具超时",
              "先对账",
              "不可盲重放"
            ],
            [
              "队列超限",
              "拒绝/人工",
              "不可无限排队"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "worst_attempts_without_budget = gateway * sdk * agent * tool\ntotal_deadline >= sum(per_step_timeout) + bounded_backoff",
          "verification": "fault 的 retry_p95、timeout_budget_valid、task_success 必须红；repair 通过限制 attempts 与安全降级恢复。"
        },
        "expected": "fault 的 retry_p95、timeout_budget_valid、task_success 必须红；repair 通过限制 attempts 与安全降级恢复。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "列出所有重试层与 retryable code",
          "把绝对 deadline 沿调用链传递",
          "写工具携带幂等键并在超时后先 reconciliation",
          "队列/错误预算超限时冻结放量、限重试、切只读/人工"
        ],
        "warning": "fault 允许 3–5 次重试、提高失败率并移除压力降级，形成可见重试风暴。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP06 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP06/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP06/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP06/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP06/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP06/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP06-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP06-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP06/baseline/summary.json",
            "reports/TD-AP06/fault/summary.json",
            "reports/TD-AP06/repair/summary.json",
            "reports/TD-AP06/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP06、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP06 cycle 并保存 0/1/0",
      "fault 允许 3–5 次重试、提高失败率并移除压力降级，形成可见重试风暴。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S48",
      "S57",
      "S67",
      "S75"
    ],
    "evidenceBoundary": "当前 0/1/0 证明 fixture gate 与策略方向；真实 AI provider/model、integration、practitioner review、learner run、live 与 production 依赖语义、幂等和补偿责任均 NOT_RUN，仍需集成与从业者评审。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP06 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP06.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP06 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP06-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP06 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP06.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP06 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP06/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP07",
    "moduleId": "TD-M11",
    "order": 7,
    "title": "运行长稳测试：识别资源泄漏与漂移",
    "type": "跟做",
    "status": "fixture-tested",
    "duration": "80 分钟",
    "summary": "用资源斜率、平台期、快照差分、cleanup 成功率和尾延迟趋势区分冷启动、缓存热身、有界缓存与泄漏。",
    "why": "十分钟峰值可能完全看不到内存、连接、线程、KV cache 或会话状态的单调增长；只看终点值也无法证明因果。",
    "prerequisites": [
      "TD-AP06"
    ],
    "outcomes": [
      "设计 soak 负载与观察窗口",
      "计算内存/资源斜率",
      "用快照差分和清理证据验证修复"
    ],
    "artifact": "TD-AP07 长稳趋势与资源差分报告",
    "architecture": {
      "title": "TD-AP07 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "固定长期 workload",
        "Process/GPU/Cache sampler",
        "Task Trace",
        "Periodic snapshots",
        "Cleanup/Reconciliation",
        "Slope + latency gate"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "先设热身窗口，再在稳态窗口计算 slope。缓存增长后平台化与真正泄漏不同；还要看 cleanup、吞吐、p95/p99 和重启/GC 事件。",
          "tracemalloc 等快照工具能定位分配差异，但生产 GPU allocator、驱动和外部进程需各自观测。Issue 只能提供故障线索，不能代替目标版本复现。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "热身",
              "先升后稳",
              "排除初始窗口"
            ],
            [
              "有界缓存",
              "增长后平台",
              "验证淘汰与命中"
            ],
            [
              "泄漏候选",
              "持续正斜率",
              "快照/对象/句柄差分"
            ],
            [
              "清理失效",
              "run 结束仍残留",
              "reconciliation/owner"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "resource_slope = (resource_end - resource_start) / completed_tasks\nleak_candidate = slope > budget && no_plateau && cleanup_rate < target",
          "verification": "fault 注入 0.8MB/task 和 cleanup failure；repair 必须在相同任务数下同时恢复 slope 与 cleanup。"
        },
        "expected": "fault 注入 0.8MB/task 和 cleanup failure；repair 必须在相同任务数下同时恢复 slope 与 cleanup。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "固定任务分布、到达率、资源与版本",
          "分热身/稳态/恢复三个窗口",
          "周期采集 RSS/GPU/cache/FD/thread/queue 与任务指标",
          "对异常窗口做 snapshot diff，并验证 cleanup/restart 后是否回收"
        ],
        "warning": "fault 产生单调内存增长并让四分之一 cleanup 失败；只重启进程不能算根因修复。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP07 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP07/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP07/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP07/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP07/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP07/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP07-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP07-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP07/baseline/summary.json",
            "reports/TD-AP07/fault/summary.json",
            "reports/TD-AP07/repair/summary.json",
            "reports/TD-AP07/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP07、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP07 cycle 并保存 0/1/0",
      "fault 产生单调内存增长并让四分之一 cleanup 失败；只重启进程不能算根因修复。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S51",
      "S67",
      "S68",
      "S75"
    ],
    "evidenceBoundary": "本地用合成 memory slope 教学；真实 AI provider/model、integration、practitioner review、learner run、live 与 production 泄漏均 NOT_RUN，必须在目标运行时、驱动、缓存与真实任务切片上复现。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP07 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP07.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP07 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP07-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP07 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP07.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP07 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP07/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  },
  {
    "id": "TD-AP08",
    "moduleId": "TD-M11",
    "order": 8,
    "title": "把结果接入 SLO、告警与事故证据",
    "type": "项目",
    "status": "fixture-tested",
    "duration": "90 分钟",
    "summary": "以 good task 为 SLI，把多窗口 burn-rate 告警连接到具体 owner、止血、降级、恢复和事故样例回流。",
    "why": "上线前压测只证明某一版本和环境。模型、Prompt、工具、流量与价格持续变化，生产需要用户症状 SLO 和可执行 Runbook。",
    "prerequisites": [
      "TD-AP07"
    ],
    "outcomes": [
      "定义 task-centered SLI/SLO",
      "区分 Page 症状与诊断指标",
      "交付带 Trace/版本/动作的事故证据卡"
    ],
    "artifact": "TD-AP08 Agent SLO、告警与事故 Runbook",
    "architecture": {
      "title": "TD-AP08 证据链",
      "caption": "每个节点都有版本、输入与可检查输出；Prompt 只解释证据，不能改门禁。",
      "nodes": [
        "Eligible task stream",
        "Good-task evaluator",
        "SLI/Error budget",
        "Multi-window alert",
        "Runbook mitigation",
        "Incident-to-workload regression"
      ]
    },
    "blocks": [
      {
        "title": "先理解系统边界与假绿",
        "body": [
          "good task 同时满足正确终态、时延、重试/成本预算、策略和副作用安全。高风险写任务应单独切片；模型 99.9% 可用不能替代业务任务 SLO。",
          "Page 用于需要立即行动的用户症状或错误预算快速燃烧。Queue、TTFT、tool、retry、cost 主要用于诊断，除非它们本身有明确 owner 与动作。"
        ],
        "table": {
          "headers": [
            "对象/信号",
            "正确口径",
            "常见假绿"
          ],
          "rows": [
            [
              "P1",
              "重复副作用/高风险错终态",
              "停止写工具、回滚、人工"
            ],
            [
              "P2",
              "good-task burn rate",
              "冻结放量、降级"
            ],
            [
              "诊断",
              "queue/TTFT/tool/retry",
              "定位后执行 owner action"
            ],
            [
              "趋势",
              "成本/步骤/长度漂移",
              "容量与流程改进"
            ]
          ],
          "caption": "任何比例都标明分母；任何容量都标明 workload 与环境。"
        }
      },
      {
        "title": "把概念变成可验证公式",
        "body": [
          "公式用于建立计算口径；阈值来自版本化 profile，不从来源或本页示例直接复制到生产。"
        ],
        "technical": {
          "kind": "formula",
          "content": "task_sli = good_tasks / eligible_tasks\nburn_rate = observed_bad_task_rate / allowed_bad_task_rate",
          "verification": "fault 同时降低 good-task、移除 alert action 与 incident evidence；任何一项缺失都必须 fail-closed。"
        },
        "expected": "fault 同时降低 good-task、移除 alert action 与 incident evidence；任何一项缺失都必须 fail-closed。"
      },
      {
        "title": "专业工作方法",
        "body": [
          "按下面顺序交付，避免先选工具再补证据。"
        ],
        "bullets": [
          "明确 eligible 与 good-task 判定、窗口和数据源",
          "用快慢多窗口控制 page 灵敏度",
          "Runbook 写三条安全止血、回滚与逐级恢复",
          "把 incident trace、版本和 mutation 回流为新 workload slice"
        ],
        "warning": "fault 让 good-task rate 下降，且没有告警动作和事故证据；repair 要三项同时恢复。"
      },
      {
        "title": "版本化 Prompt / Input / Schema / Eval / Mutation",
        "body": [
          "Prompt v1.0.0 只读取固定输入和三阶段摘要，强制输出 Evidence、Inference、Unknown 与边界。provider=none、model=NOT_RUN；fixture 成功不冒充模型评审。"
        ],
        "technical": {
          "kind": "prompt",
          "content": "审阅 TD-AP08 baseline/fault/repair；缺字段、fault 未红、repair 未绿或 synthetic 边界缺失时 BLOCKED。",
          "version": "1.0.0",
          "promptPath": "materials/agent-load-stability/prompts/TD-AP08/prompt-v1.md",
          "manifestPath": "materials/agent-load-stability/prompts/TD-AP08/manifest.json",
          "inputFixturePath": "materials/agent-load-stability/prompts/TD-AP08/input-v1.json",
          "outputSchemaPath": "materials/agent-load-stability/prompts/TD-AP08/output-schema-v1.json",
          "evaluationPath": "materials/agent-load-stability/prompts/TD-AP08/eval-v1.json"
        },
        "expected": "输入、Schema、Eval、Mutation 均固定；provider=none/model=NOT_RUN，不得声称 live model pass。"
      },
      {
        "title": "运行完整 baseline → fault → repair",
        "body": [
          "先进入明确工作目录，再执行一条 cycle 命令。脚本实际运行三个阶段；只有观察到 0/1/0 才整体退出 0。"
        ],
        "technical": {
          "kind": "command",
          "content": "python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP08-lab.json --mode cycle",
          "manifestPath": "materials/agent-load-stability/manifests/TD-AP08-lab.json",
          "stepId": "cycle",
          "workingDirectory": "materials/agent-load-stability",
          "expectedExitCode": 0,
          "expectedArtifacts": [
            "reports/TD-AP08/baseline/summary.json",
            "reports/TD-AP08/fault/summary.json",
            "reports/TD-AP08/repair/summary.json",
            "reports/TD-AP08/cycle-summary.json"
          ]
        },
        "expected": "cycle-summary.json 显示 TD-AP08、cycle_pass=true、observed_exit_codes=0/1/0，并列出 fault_detected_by。"
      },
      {
        "title": "读结果、排错并交付",
        "body": [
          "先核对 page_id、workload_version、configuration_hash 和 boundary；再比较 checks/metrics；最后从 fault traces.jsonl 找一条证据。",
          "若 fault 也绿，优先检查 mutation 是否生效、gate 是否仍在、输入是否相同；若 repair 仍红，只改实现/配置，不删阈值。"
        ],
        "expected": "交付一张包含 Evidence / Inference / Unknown、fault 检测项、repair 差异和剩余风险的证据卡。"
      }
    ],
    "practice": [
      "运行 TD-AP08 cycle 并保存 0/1/0",
      "fault 让 good-task rate 下降，且没有告警动作和事故证据；repair 要三项同时恢复。",
      "从 fault Trace 找到一条红灯证据",
      "写明哪些结论仍不能外推到生产"
    ],
    "completion": [
      "命令、cwd、manifest、退出码与工件完全一致",
      "Prompt/Input/Schema/Eval/Mutation 均为 v1.0.0",
      "fault 至少被一个门禁拒绝，repair 未删除门禁",
      "证据明确 synthetic fixture ≠ production capacity"
    ],
    "sourceIds": [
      "S47",
      "S48",
      "S70",
      "S71",
      "S75",
      "S76"
    ],
    "evidenceBoundary": "SLO/告警结构来自 SRE 方法；真实 AI provider/model、integration、practitioner review、learner run、live 与 production SLO/告警均 NOT_RUN，组织阈值、值班责任、业务等级与合规保留期仍为 Unknown。",
    "materials": [
      {
        "title": "完整实验归档",
        "description": "含八页 profile、Prompt 包、三阶段证据和执行脚本。",
        "href": "materials/agent-load-stability.zip",
        "kind": "archive",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP08 实验指南",
        "description": "固定 cwd、0/1/0 命令、阅读顺序与停止条件。",
        "href": "materials/agent-load-stability/guides/TD-AP08.md",
        "kind": "guide",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP08 Lab Manifest",
        "description": "精确声明 required files、命令、退出码与证据路径。",
        "href": "materials/agent-load-stability/manifests/TD-AP08-lab.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP08 Profile",
        "description": "版本化 workload、mutation、threshold 与 synthetic 边界。",
        "href": "materials/agent-load-stability/profiles/TD-AP08.json",
        "kind": "config",
        "validation": "fixture-tested"
      },
      {
        "title": "TD-AP08 Cycle Evidence",
        "description": "记录 baseline/fault/repair 观察退出码和修复比较。",
        "href": "materials/agent-load-stability/reports/TD-AP08/cycle-summary.json",
        "kind": "evidence",
        "validation": "fixture-tested"
      }
    ]
  }
] satisfies TutorialPage[]).map(appendExecutedLabMaterial).map(withDeepLayer).map(appendPageSpecificPerformanceContext).map(appendWave3PerformanceDepth).map(appendWave3ExtendedPractice).map(appendWave4ExtendedPractice).map(rewriteWave4SharedSentences).map(wave5PerformanceDepth).map(wave5PerformanceCaseNotes).map(wave5PerformanceFinalDepth).map(wave5PerformanceAcceptance);
