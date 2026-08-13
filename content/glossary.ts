/**
 * 站点术语表（生成产物，请勿直接编辑）。
 *
 * 由 scripts/build-glossary.mjs 从两处合并：
 *   · methodology/glossary-core.json —— 45 个核心词，写给第一次见到它的人
 *   · methodology/dimensions/_sources/*.json 的 terms 表 —— 297 个逐页术语
 *
 * 改术语请改上述来源后重新生成。
 */

export type GlossaryEntry = {
  term: string;
  aka?: string;
  kind: "core" | "page";
  category: string;
  /** 大白话解释：它是什么 */
  plain: string;
  /** 核心词才有：测试开发为什么要关心它 */
  why?: string;
  /** 出现在哪些页面，供跳回原文 */
  pages: string[];
};

export const glossary: GlossaryEntry[] = [
  {
    "term": "AI（人工智能）",
    "category": "AI 基础",
    "plain": "让机器完成原本需要人类判断、识别、生成或决策的任务的技术集合。大模型只是其中一种实现，不等于全部 AI。",
    "why": "先确认被测对象是规则、传统机器学习、大模型还是多组件系统，才能选择正确的数据、Oracle、指标和失败注入。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "LLM（大语言模型）",
    "aka": "Large Language Model、大模型",
    "category": "AI 基础",
    "plain": "根据已有上下文预测并逐个生成 Token 的模型。它产出的是候选结果，不自带事实正确、权限正确或业务批准。",
    "why": "同一问题可能受模型版本、Prompt、Context、解码和服务端实现影响；测试必须固定可见变量并保留 UNKNOWN。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Prompt（提示词）",
    "aka": "系统提示、任务提示",
    "category": "AI 基础",
    "plain": "交给模型的指令、目标、上下文与输出约束。专业 Prompt 应与输入、Schema、评价规则、变异和运行收据一起版本化。",
    "why": "只复制一句指令无法复现结果，也无法判断失败来自输入、规则还是模型。Prompt Package 把这些责任拆开。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Token",
    "category": "AI 基础",
    "plain": "模型读写文本时使用的离散单位；它不等于一个汉字或一个英文单词。",
    "why": "Context 上限、延迟和费用通常按 Token 计算，字符数测试不能替代真实 Token 边界测试。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Context（上下文）",
    "category": "AI 基础",
    "plain": "一次生成时模型实际能够读取的输入集合，包括 system、用户消息、历史、检索片段和工具结果。",
    "why": "报告只保存用户问题会丢失真正输入；顺序、截断、冲突和不可信内容都可能改变输出。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Embedding（向量表示）",
    "category": "AI 基础",
    "plain": "把文本等对象转换成数值向量，使系统可以按相似度寻找候选内容。",
    "why": "换模型、维度、归一化或切块策略都会改变检索空间；索引和查询必须版本匹配并可回滚。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Oracle（判据）",
    "aka": "测试预言、判定依据",
    "category": "评测基础",
    "plain": "判断一次结果对不对的依据。传统测试里它通常是一个期望值；在 AI 系统里它可能是一条规则、一个模型打分、或者一个人。",
    "why": "AI 输出没有唯一正确答案，所以「拿什么判断对错」不再是显然的。一个测试有没有价值，取决于它的 Oracle 有多可靠——这是本课程反复回到的问题。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "pass@1 与 pass^k",
    "aka": "单次通过率与一致性通过率",
    "category": "可靠性",
    "plain": "同一个任务跑 k 次：pass@1 是「至少能做对一次」的比例，pass^k 是「k 次全部做对」的比例。后者永远不高于前者。",
    "why": "模型对同样输入会给出不同结果。只看 pass@1 会把「偶尔能行」读成「可以上线」。公开结果里出现过 pass@1 为 61% 而 pass^8 只有 25% 的情况——这两者的差距就是一致性缺口。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "置信区间（CI）",
    "aka": "95% CI、区间估计",
    "category": "统计",
    "plain": "一个范围，表示真实值大概落在哪里。样本越少，这个范围越宽。",
    "why": "两个版本 84% 和 87% 看起来有差距，但如果它们的区间大幅重叠，这个差距在统计上不成立。本课程要求所有对外结论都带区间，并用「区间是否重叠」而不是「数字谁大」来判断回归。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Wilson 区间",
    "category": "统计",
    "plain": "计算比例类指标置信区间的一种方法，在样本量小或比例接近 0 和 1 时比常见的正态近似更可靠。",
    "why": "评测里大量指标是「通过率」这类比例。样本常常只有几十条，此时用错方法算出来的区间会明显偏窄，给人一种比实际更确定的错觉。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Cohen's κ（kappa）",
    "aka": "一致性系数",
    "category": "评测可信度",
    "plain": "衡量两个评判者的判断一致到什么程度，并且扣除了「碰巧一致」的部分。取值 0 到 1。",
    "why": "当你用模型给模型打分时，先用当前任务、样本与评分规则校准一致性。可接受区间必须由具名质量 owner 在 Metric Card 中声明；课程不把某个经验分界当作所有场景的发布阈值。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "变异系数（CV）",
    "category": "统计",
    "plain": "标准差除以均值，用来描述波动相对有多大。CV 越小越稳定。",
    "why": "同一个任务重复跑，结果波动多大是一个独立于「好不好」的问题。CV 过大通常说明配置没锁（比如温度、随机种子）或者存在没被识别的输入差异。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "分位数（p50 / p95 / p99）",
    "aka": "百分位、尾延迟",
    "category": "性能",
    "plain": "把所有观测值从小到大排列，p99 就是排在 99% 位置的那个值——只有 1% 的情况比它更差。",
    "why": "延迟和成本都是长尾分布：均值被大量快速请求拉低，而用户的糟糕体验和账单超支都发生在尾部。本课程要求这两类指标一律报分位而不是均值。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Judge（模型评判器）",
    "aka": "LLM-as-judge",
    "category": "评测可信度",
    "plain": "用一个模型去评价另一个模型的输出好不好。",
    "why": "它便宜、快、可规模化，也因此几乎每个 AI 评测体系都在用它。风险在于它本身很少被测过——如果它不准，基于它的所有数字都不准。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "金标集（gold set）",
    "category": "评测可信度",
    "plain": "一批由人工仔细标注过正确答案的样本，用来校准自动评判器。",
    "why": "它是校准 Judge 的重要人工参照。若标注一致性低于本场景预声明的门槛，先修订评分标准、培训标注者并复标；没有 owner、样本和门槛依据时结论保持 UNKNOWN。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Holdout（封存集）",
    "aka": "sealed holdout",
    "category": "数据",
    "plain": "一批被锁起来、不参与任何调优的数据，只在最终验收时打开用一次。",
    "why": "反复用同一批数据调优会让分数持续上涨，但涨的是对这批题的适应，不是真实能力。封存集是唯一的无偏参照，每开封一次它就少一分价值。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "数据污染（contamination）",
    "category": "数据",
    "plain": "评测用的题目出现在了模型的训练数据里，或者出现在了本该独立的另一个数据集里。",
    "why": "被污染的评测集会给出虚高分。政策目标通常是不允许已知重叠，但检测本身存在覆盖边界；必须披露检测方法、疑似/已知重叠和处置 owner，是否阻断由具体评测合同预先声明。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "幂等（idempotent）与幂等键",
    "category": "工程基础",
    "plain": "同一个操作执行一次和执行多次，结果一样。幂等键是用来识别「这是同一次操作」的标记。",
    "why": "网络超时后重试是常态。没有幂等保护的退款或转账，重试就意味着执行两次。AI 系统里这个风险更高，因为一次重试会重放整条工具链。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "变异测试（mutation testing）",
    "aka": "mutation score、变异体、杀伤率",
    "category": "测试方法",
    "plain": "故意往代码里注入错误（变异体），看你的测试会不会失败。会失败叫「杀死」，不会失败说明测试没起作用。",
    "why": "一套完全不检查任何东西的测试，通过率是 100%。变异测试是证明「测试真的能发现问题」的手段，也是本课程验收 AI 生成测试的主要方式。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "0 / 1 / 0 红绿约定",
    "aka": "baseline → fault → repair",
    "category": "测试方法",
    "plain": "跑三次：正常情况应该通过（退出码 0），注入一个故障后应该失败（非 0），修复后应该再次通过（0）。",
    "why": "只证明「能通过」不说明任何问题——一个什么都不检查的脚本也能通过。中间那次必须真的失败，才证明这个检查是有效的。本项目所有 lab 都遵守这个约定。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Trace 与 Span",
    "aka": "链路追踪",
    "category": "可观测性",
    "plain": "Trace 是一次完整请求的全过程记录；Span 是其中的一个环节，比如一次模型调用或一次工具调用。",
    "why": "只看最终答案会漏掉约九成发生在执行中途的失败。逐 Span 打标才能得出「失败集中在第几步」，而这个结论才能转成具体的改进项。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Agent、Workflow 与 Worker",
    "category": "被测对象",
    "plain": "Agent 是模型自己决定下一步做什么；Workflow 是路径由代码固定、模型只负责填内容；Worker 是在后台异步执行的单元。",
    "why": "判据是「路径由谁决定」，不是产品叫什么名字。三者的失败模式和测试方法完全不同，混在一起算总成功率会让风险最高的那部分被稀释掉。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "RAG（检索增强生成）",
    "category": "被测对象",
    "plain": "回答之前先去知识库里检索相关内容，再让模型基于检索到的材料作答。",
    "why": "它把失败拆成了两类：该找的没找到，或者找到了但没用好。这两类的修复方向完全相反，所以必须分开测量，否则会一直在调错的那一半。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Goodput",
    "aka": "有效产出",
    "category": "性能",
    "plain": "单位时间内真正达到质量标准的完成任务数——失败的、质量不达标的都不算。",
    "why": "Agent 的一次任务包含很多次调用，用请求数（QPS）衡量容量会得到一个好看但无法换算成业务量的数字。Goodput 的分母是「好任务」，它才能用来做扩容决策。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "TTFT 与 TPOT",
    "aka": "首字延迟、逐字延迟",
    "category": "性能",
    "plain": "TTFT 是从提问到看见第一个字的时间；TPOT 是之后每个字之间的间隔。",
    "why": "流式输出下，用户在第一个字出现时就开始获得价值。用端到端总时长描述体验会与体感严重脱节，两者必须分开设阈值。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "KV Cache",
    "category": "性能",
    "plain": "模型生成时用来缓存已处理上下文的显存区域，上下文越长占用越大。",
    "why": "它是 AI 服务特有的容量瓶颈，在传统性能指标（CPU、内存、QPS）里完全看不见。按平均长度压测时它不会暴露，而真实流量的长尾会把它打满。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "提示注入（prompt injection）与 ASR",
    "aka": "攻击成功率",
    "category": "安全",
    "plain": "把指令藏在模型会读到的内容里，让它做本不该做的事。ASR 是这类攻击的成功比例。",
    "why": "关键在于攻击不一定来自用户输入框——检索到的文档、工具返回、网页正文都会进入上下文。只在入口做过滤，对这些通道的覆盖率是 0。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "MCP 与工具投毒",
    "aka": "rug-pull",
    "category": "安全",
    "plain": "MCP 是让模型调用外部工具的一种协议。工具投毒是指工具的描述里藏了恶意指令；rug-pull 是指描述在通过审核之后被偷偷改掉。",
    "why": "工具描述会直接进入模型上下文并影响它的决策，影响力不亚于一个代码依赖，却通常不在任何依赖清单里，也没有变更检测。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "爆炸半径（blast radius）",
    "category": "安全",
    "plain": "一个动作出错时最坏能影响多大范围。通常按三个维度标注：可不可逆、影响多少人、涉及多少钱。",
    "why": "「不可逆 + 资金无上限」的动作必须强制人工确认和额度硬上限。而这些控制本身要被测试——不是测模型会不会调用，是测限额到底生不生效。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "熔断、限流与降级",
    "category": "稳定性",
    "plain": "熔断是失败太多时主动停下；限流是超过容量时拒绝一部分请求；降级是在无法提供完整能力时给出一个较弱但可用的结果。",
    "why": "Agent 的失控形态是「一直在正常地工作但不收敛」——不报错也不超时，传统基于错误率的熔断完全静默。因此需要步数、时间、成本三重熔断，并逐一验证它们真的会触发。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "SLO 与错误预算",
    "aka": "burn-rate 告警",
    "category": "可观测性",
    "plain": "SLO 是你承诺的服务质量目标；错误预算是这个目标允许的失败额度；burn-rate 是这份额度被消耗的速度。",
    "why": "它把「还能不能继续发版」变成一个可计算的问题，而不是一场争论。AI 系统里成本也应当进 SLO，因为成本失控和质量失控一样会中断服务。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "expand-contract（扩展—收缩）",
    "category": "数据",
    "plain": "改数据结构时分三步：先只做兼容性扩展，再迁移数据，最后才移除旧结构。中间任何时刻新旧代码都能工作。",
    "why": "它消除了「必须同时上线」的协调需求。换 embedding 模型同样是一次破坏性的结构变更，只是很多团队没把它当成数据迁移来对待。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "SBOM 与 provenance",
    "aka": "软件物料清单、来源证明",
    "category": "供应链",
    "plain": "SBOM 是这个系统用到的所有外部组件的清单；provenance 是这些组件从哪来、由谁构建的证明。",
    "why": "AI 系统的「外部组件」不止代码依赖，还包括工具定义、模型端点、外部提示模板。它们能改变系统行为，却通常不在清单里。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "证据成熟度与 NOT_RUN",
    "aka": "fixture-tested、production-validated",
    "category": "证据边界",
    "plain": "描述一个结论被验证到什么程度的分级：从只做过桌面研究，到离线夹具跑通，到接了真实模型，到经过生产验证。NOT_RUN 表示这一级根本没有跑过。",
    "why": "这是本课程最重要的诚实性机制。当前全站处于「离线夹具跑通」这一级，更高的四级全部标记 NOT_RUN——内容完整不等于结论已被验证，这两件事必须能被区分。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Fixture（夹具）",
    "aka": "固定夹具、合成数据",
    "category": "证据边界",
    "plain": "预先准备好的、固定不变的输入和期望输出，用来让测试可以脱离真实系统重复运行。",
    "why": "它让结论可复现，代价是它不代表真实环境。本课程的所有 lab 都基于夹具，因此可以证明逻辑正确，不能证明真实模型的准确率。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "PASS_SCHEMA 与 PASS_SEMANTIC",
    "aka": "结构通过与语义通过",
    "category": "评测基础",
    "plain": "前者表示输出的格式、字段、类型都合法；后者表示输出的内容真的是对的。",
    "why": "结构化输出容易让人产生安全感。但金额算错、状态取了合法但错误的值，这些都会顺利通过结构校验——模型最擅长的恰恰是产出形状正确的错误内容。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "UNKNOWN 与 BLOCKED",
    "category": "证据边界",
    "plain": "UNKNOWN 表示查不出原因；BLOCKED 表示因为某个前提不满足而无法继续。两者都不是「通过」。",
    "why": "把不确定的结论记成通过，是评测体系里最常见也最贵的一次撒谎。健康的失败分析里 UNKNOWN 应当长期存在，它归零通常意味着判据被放松了。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "三段式门禁",
    "aka": "硬红线 / 统计门禁 / 风险接受",
    "category": "发布决策",
    "plain": "第一段是任何一条不满足就阻断的硬性条件；第二段看置信区间而不是单个数字；第三段不是通过或失败，而是由具名的人签字接受剩余风险。",
    "why": "AI 系统不存在「没有失败模式」的版本。测试的职责不是宣布没问题，而是把失败模式测清楚、量化频率、确认护栏兜得住，然后让业务方在知情前提下决定。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "首错位置（first error position）",
    "category": "轨迹评估",
    "plain": "一条失败的执行轨迹里，第一个出错的步骤在第几步。把很多次失败的首错位置统计起来会看到明显的集中。",
    "why": "「成功率 73%」无法转成工作项，「失败集中在第 3 步和第 7 步」可以。这是轨迹评估最有行动价值的产物。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "步骤效率比与无效循环",
    "category": "轨迹评估",
    "plain": "最优步数除以实际步数。无效循环指同一个工具被连续调用多次且参数几乎相同。",
    "why": "答案对了不代表过程对了。Agent 可能靠很多次多余的操作凑出正确结果，其中的写操作可能已经改坏了别的东西。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Workload 模型",
    "category": "性能",
    "plain": "对真实负载的一份描述：任务类型的混合比例、输入输出长度的分布、工具调用路径、故障比例。",
    "why": "压测结论能不能用，取决于 workload 是否还原了真实分布。用固定长度、单一任务类型压出来的容量数字，在生产上通常高估两到五倍。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "开放负载与封闭负载",
    "aka": "协调遗漏",
    "category": "性能",
    "plain": "开放负载按固定到达率发请求，不管系统忙不忙；封闭负载固定并发数，前一个没返回就不发下一个。",
    "why": "封闭负载在系统变慢时会自动降速，于是把最严重的排队问题隐藏起来——这叫协调遗漏。两种负载得到的结论不同，不能混用。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "影子模式与灰度",
    "aka": "shadow、canary",
    "category": "发布决策",
    "plain": "影子模式是把真实流量同时发给新旧两个版本，但新版本的结果不返回给用户也不执行任何动作；灰度是先让一小部分真实用户使用新版本。",
    "why": "影子模式能零风险地拿到真实分布上的对比数据，是高风险场景最重要的一道保险。灰度则必须预先写死回滚条件，否则它只是把事故推迟了几小时。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "投影保真（projection fidelity）",
    "category": "本项目机制",
    "plain": "研究做了多少，最终有多少真的出现在了页面上。中间任何一次「简化一下」都会让两者产生落差。",
    "why": "本项目此前正是在这一跳上出的问题：研究写了三千字，页面只投影了一千字，而所有门禁照样通过——因为没有任何门禁检查这一跳。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "Metric Card（指标卡）",
    "category": "本项目机制",
    "plain": "一张说明某个指标测什么、阈值是多少、多久复测一次的表。本课程每一页都有。",
    "why": "内容正确但读完不知道做到什么程度算做到，是「正确的废话」最典型的形态。指标卡把它变成可判定的：阈值必须写成可比较的数字，不能写「良好」。",
    "kind": "core",
    "pages": [
      "TD-A03",
      "TD-A05",
      "TD-AP01",
      "TD-AP02",
      "TD-AP04",
      "TD-B02",
      "TD-PS08",
      "TD-PS09",
      "TD-T01",
      "TD-T04",
      "TD-X602"
    ]
  },
  {
    "term": "安全降级",
    "kind": "page",
    "category": "逐页术语",
    "plain": "超预算时的可接受终态，如只读结果、转人工、明确拒绝；它不是失败",
    "pages": [
      "TD-AP06"
    ]
  },
  {
    "term": "版本 Manifest",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把上述各阶段的标识固定下来的记录；没有它，错误无法归属",
    "pages": [
      "TD-F02"
    ]
  },
  {
    "term": "版本化生成服务",
    "kind": "page",
    "category": "逐页术语",
    "plain": "模型、Prompt、参数共同决定行为；接口不变时行为仍可能变",
    "pages": [
      "TD-A01"
    ]
  },
  {
    "term": "版本兼容",
    "kind": "page",
    "category": "逐页术语",
    "plain": "新版本能否让旧消费者继续工作",
    "pages": [
      "TD-PS03"
    ]
  },
  {
    "term": "版本账本",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次运行涉及的全部组件版本记录",
    "pages": [
      "TD-T21"
    ]
  },
  {
    "term": "闭环负载",
    "kind": "page",
    "category": "逐页术语",
    "plain": "固定并发数，前一个请求完成后才发下一个；系统变慢时发压速率自动下降",
    "pages": [
      "TD-AP04"
    ]
  },
  {
    "term": "边界",
    "kind": "page",
    "category": "逐页术语",
    "plain": "阈值附近的取值；适用于有明确分界线的场景",
    "pages": [
      "TD-T07"
    ]
  },
  {
    "term": "变异回归",
    "kind": "page",
    "category": "逐页术语",
    "plain": "修复后重跑已知业务变异，确认仍能变红",
    "pages": [
      "TD-T19"
    ]
  },
  {
    "term": "标准字段 vs 本地扩展",
    "kind": "page",
    "category": "逐页术语",
    "plain": "前者跨系统可比，后者承载业务语义；混在一起会让 trace 无法迁移",
    "pages": [
      "TD-AP03"
    ]
  },
  {
    "term": "补偿",
    "kind": "page",
    "category": "逐页术语",
    "plain": "失败后撤销已完成部分的动作；它本身也需要被测试",
    "pages": [
      "TD-PS03"
    ]
  },
  {
    "term": "部署配置",
    "kind": "page",
    "category": "逐页术语",
    "plain": "上下文上限、采样参数、安全策略；它常常是行为变化的真实原因",
    "pages": [
      "TD-F02"
    ]
  },
  {
    "term": "裁决",
    "kind": "page",
    "category": "逐页术语",
    "plain": "在争议中做出决定并承担后果；判据是决定被记录且被执行",
    "pages": [
      "TD-C02"
    ]
  },
  {
    "term": "参数边界",
    "kind": "page",
    "category": "逐页术语",
    "plain": "参数允许的取值范围；金额、数量、时间窗都属于此类",
    "pages": [
      "TD-T16"
    ]
  },
  {
    "term": "成熟度声明",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这份 RC 各项证据分别到了哪一级",
    "pages": [
      "TD-T25"
    ]
  },
  {
    "term": "冲突状态",
    "kind": "page",
    "category": "逐页术语",
    "plain": "同一规则在多处描述不一致时的显式标记；它必须阻断而不是被合并",
    "pages": [
      "TD-QP01"
    ]
  },
  {
    "term": "错误预算",
    "kind": "page",
    "category": "逐页术语",
    "plain": "允许违反 SLO 的额度；它把「要不要发布」从争论变成算术",
    "pages": [
      "TD-AP08"
    ]
  },
  {
    "term": "代表性人工样本",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按风险切片抽取的人工复核样本，不是随机抽",
    "pages": [
      "TD-X805"
    ]
  },
  {
    "term": "代码 Diff",
    "kind": "page",
    "category": "逐页术语",
    "plain": "本次实际改动；它回答「改了什么」，不回答「该测什么」",
    "pages": [
      "TD-T05"
    ]
  },
  {
    "term": "带引用的风险候选",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每条风险都指向具体的 source_ref 或 diff 行",
    "pages": [
      "TD-T05"
    ]
  },
  {
    "term": "单变量",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次实验只改一样：模型、Prompt 或知识库",
    "pages": [
      "TD-T13"
    ]
  },
  {
    "term": "单位成本",
    "kind": "page",
    "category": "逐页术语",
    "plain": "含人工审查时间在内的总成本除以最终采纳的产物数",
    "pages": [
      "TD-T26"
    ]
  },
  {
    "term": "单位成功成本",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每个成功任务的总花费；架构决策的核心可比量",
    "pages": [
      "TD-A01",
      "TD-PS09",
      "TD-T23",
      "TD-W03"
    ]
  },
  {
    "term": "到达率",
    "kind": "page",
    "category": "逐页术语",
    "plain": "单位时间进入系统的请求数；固定它才能观察排队",
    "pages": [
      "TD-PS09"
    ]
  },
  {
    "term": "到达率 vs 并发",
    "kind": "page",
    "category": "逐页术语",
    "plain": "前者固定每秒来多少，后者固定同时有多少；两者结论不同",
    "pages": [
      "TD-A04"
    ]
  },
  {
    "term": "定位器策略",
    "kind": "page",
    "category": "逐页术语",
    "plain": "如何找到页面元素；它决定了测试对改版的敏感度",
    "pages": [
      "TD-PS04"
    ]
  },
  {
    "term": "动画同步",
    "kind": "page",
    "category": "逐页术语",
    "plain": "等待动画结束再操作；提前操作会导致点击落空",
    "pages": [
      "TD-PS07"
    ]
  },
  {
    "term": "冻结 Basis",
    "kind": "page",
    "category": "逐页术语",
    "plain": "本次变更所依据的需求、设计与契约的固定版本",
    "pages": [
      "TD-T05"
    ]
  },
  {
    "term": "独立 Oracle",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不依赖被测模型的判据，如图像元数据、字幕时间轴",
    "pages": [
      "TD-X501"
    ]
  },
  {
    "term": "端到端 Gate",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把语料、检索、忠实度、无答案、权限组合起来的发布关卡",
    "pages": [
      "TD-T12"
    ]
  },
  {
    "term": "短生命周期 namespace",
    "kind": "page",
    "category": "逐页术语",
    "plain": "为一次运行创建、用完即销毁的隔离单元",
    "pages": [
      "TD-QP03"
    ]
  },
  {
    "term": "对象级授权",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不只检查角色，还要检查这个用户能否操作这个具体对象",
    "pages": [
      "TD-PS12"
    ]
  },
  {
    "term": "对照组",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不使用 AI 的同任务基线；没有它，任何提升都是无参照的",
    "pages": [
      "TD-T26"
    ]
  },
  {
    "term": "发布问题",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这次评测要支撑哪个具体决定；它必须是一句能回答「发不发」的话",
    "pages": [
      "TD-T01"
    ]
  },
  {
    "term": "翻译语义",
    "kind": "page",
    "category": "逐页术语",
    "plain": "译文是否保持了原文的约束强度，而不只是字面对应",
    "pages": [
      "TD-X502"
    ]
  },
  {
    "term": "反作弊检查",
    "kind": "page",
    "category": "逐页术语",
    "plain": "比对修复前后差异，识别删断言、改期望、跳步骤",
    "pages": [
      "TD-T19"
    ]
  },
  {
    "term": "非语义表面",
    "kind": "page",
    "category": "逐页术语",
    "plain": "定位器属性、等待时长等不影响业务含义的部分；这是允许自动改的范围",
    "pages": [
      "TD-T19"
    ]
  },
  {
    "term": "分歧矩阵",
    "kind": "page",
    "category": "逐页术语",
    "plain": "Judge 与人在哪些类别上分歧最大的分布",
    "pages": [
      "TD-T14"
    ]
  },
  {
    "term": "风险加权",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按失败成本给任务加权，而不是按数量平均",
    "pages": [
      "TD-B06"
    ]
  },
  {
    "term": "风险切片",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按业务风险划分的子集；平均分永远会掩盖高风险切片",
    "pages": [
      "TD-T02",
      "TD-T13"
    ]
  },
  {
    "term": "封存 Holdout",
    "kind": "page",
    "category": "逐页术语",
    "plain": "只在发布判断时开封一次的集合；反复开封即失效",
    "pages": [
      "TD-T02"
    ]
  },
  {
    "term": "复评日期",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这条主张下次被重新检验的时间；没有它，自评会长期停在旧状态",
    "pages": [
      "TD-C03"
    ]
  },
  {
    "term": "副作用",
    "kind": "page",
    "category": "逐页术语",
    "plain": "对外产生的真实影响；它决定风险等级",
    "pages": [
      "TD-F04",
      "TD-PS01"
    ]
  },
  {
    "term": "副作用提交点",
    "kind": "page",
    "category": "逐页术语",
    "plain": "真正写数据的那一步在哪个组件",
    "pages": [
      "TD-W01"
    ]
  },
  {
    "term": "跟做",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按既定方案执行并交出结果；判据是结果正确",
    "pages": [
      "TD-C02"
    ]
  },
  {
    "term": "工件链",
    "kind": "page",
    "category": "逐页术语",
    "plain": "从 PRD 到回滚预案的完整链条，每一环都能指向上一环",
    "pages": [
      "TD-T25"
    ]
  },
  {
    "term": "工具调用",
    "kind": "page",
    "category": "逐页术语",
    "plain": "模型请求执行外部函数；副作用发生在你的系统里，不在模型里",
    "pages": [
      "TD-A02"
    ]
  },
  {
    "term": "公共责任状态",
    "kind": "page",
    "category": "逐页术语",
    "plain": "跟做/设计/裁决/治理四级；它跨组织稳定",
    "pages": [
      "TD-C04"
    ]
  },
  {
    "term": "固定 workload",
    "kind": "page",
    "category": "逐页术语",
    "plain": "三个维度必须在同一负载下测量，否则不可比",
    "pages": [
      "TD-T23"
    ]
  },
  {
    "term": "关键旅程",
    "kind": "page",
    "category": "逐页术语",
    "plain": "用户完成一个业务目标的完整路径；它不是页面元素的集合",
    "pages": [
      "TD-PS04"
    ]
  },
  {
    "term": "国际化文本",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不同语言下文本长度变化导致的布局问题",
    "pages": [
      "TD-PS05"
    ]
  },
  {
    "term": "过度代理权",
    "kind": "page",
    "category": "逐页术语",
    "plain": "Agent 拥有超出任务所需的行动能力；它把小漏洞放大成大事故",
    "pages": [
      "TD-T17"
    ]
  },
  {
    "term": "后训练",
    "kind": "page",
    "category": "逐页术语",
    "plain": "指令微调与对齐；同一基座的不同后训练版本行为差异可能很大",
    "pages": [
      "TD-F02"
    ]
  },
  {
    "term": "候选",
    "kind": "page",
    "category": "逐页术语",
    "plain": "生成的用例在被证明有检测力之前，只是候选而不是资产",
    "pages": [
      "TD-T06"
    ]
  },
  {
    "term": "候选簇",
    "kind": "page",
    "category": "逐页术语",
    "plain": "AI 提出的分组；它是假设不是结论",
    "pages": [
      "TD-T08"
    ]
  },
  {
    "term": "候选模型",
    "kind": "page",
    "category": "逐页术语",
    "plain": "已训练完成但尚未被接受的模型；它默认不可用",
    "pages": [
      "TD-X602"
    ]
  },
  {
    "term": "缓存命中率",
    "kind": "page",
    "category": "逐页术语",
    "plain": "相同前缀的复用比例；它显著影响容量且容易在压测中失真",
    "pages": [
      "TD-A04"
    ]
  },
  {
    "term": "回滚目标",
    "kind": "page",
    "category": "逐页术语",
    "plain": "出问题时要退回到哪个具体版本，而不是「上一个」",
    "pages": [
      "TD-X602"
    ]
  },
  {
    "term": "回填",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把历史数据补齐到新结构；它通常是耗时最长的一步",
    "pages": [
      "TD-PS08"
    ]
  },
  {
    "term": "混杂",
    "kind": "page",
    "category": "逐页术语",
    "plain": "两组之间有多于一个变量不同，结论无法归因",
    "pages": [
      "TD-B04",
      "TD-W03"
    ]
  },
  {
    "term": "计划到达 vs 实际完成",
    "kind": "page",
    "category": "逐页术语",
    "plain": "前者是应当发出的时刻，后者是实际结束的时刻；两者差值才是用户真正的等待",
    "pages": [
      "TD-AP04"
    ]
  },
  {
    "term": "假覆盖",
    "kind": "page",
    "category": "逐页术语",
    "plain": "测试跑了很多但只验证了格式的状态",
    "pages": [
      "TD-PS02"
    ]
  },
  {
    "term": "间接注入",
    "kind": "page",
    "category": "逐页术语",
    "plain": "恶意指令埋在检索文档、网页、邮件或工具返回值里；用户全程无恶意",
    "pages": [
      "TD-T17"
    ]
  },
  {
    "term": "检测力验证",
    "kind": "page",
    "category": "逐页术语",
    "plain": "用变异确认这条新用例真的有效，而不是恰好变红",
    "pages": [
      "TD-T22"
    ]
  },
  {
    "term": "检查日期",
    "kind": "page",
    "category": "逐页术语",
    "plain": "上次确认这条资源仍然有效的日期；没有它无法判断是否过期",
    "pages": [
      "TD-R01"
    ]
  },
  {
    "term": "键盘可达",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不用鼠标能否完成全部关键操作",
    "pages": [
      "TD-PS05"
    ]
  },
  {
    "term": "降级",
    "kind": "page",
    "category": "逐页术语",
    "plain": "主动降低能力保住核心可用性",
    "pages": [
      "TD-PS10"
    ]
  },
  {
    "term": "阶梯加压",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按台阶逐级提升负载并在每级稳定观察；比连续加压更容易定位拐点",
    "pages": [
      "TD-AP05"
    ]
  },
  {
    "term": "接受率",
    "kind": "page",
    "category": "逐页术语",
    "plain": "生成产物经人工审查后被采纳的比例；它比生成数量重要得多",
    "pages": [
      "TD-T26"
    ]
  },
  {
    "term": "结构化输出",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按 Schema 返回；结构合法不等于语义正确",
    "pages": [
      "TD-A02"
    ]
  },
  {
    "term": "解码配置",
    "kind": "page",
    "category": "逐页术语",
    "plain": "temperature、top_p、seed 等控制采样的参数",
    "pages": [
      "TD-F03"
    ]
  },
  {
    "term": "近邻反例",
    "kind": "page",
    "category": "逐页术语",
    "plain": "与正例只差一个关键点的负例；它最能暴露 Judge 的迟钝",
    "pages": [
      "TD-T14"
    ]
  },
  {
    "term": "近重复",
    "kind": "page",
    "category": "逐页术语",
    "plain": "与训练样本高度相似但不完全相同；它比精确重复更难检测",
    "pages": [
      "TD-B05"
    ]
  },
  {
    "term": "禁止副作用",
    "kind": "page",
    "category": "逐页术语",
    "plain": "无论路径如何都不允许发生的动作；它比黄金路径更好用",
    "pages": [
      "TD-T15"
    ]
  },
  {
    "term": "聚合",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把逐题结果合成一个总分的方式；平均、加权还是按子集，决定了哪类失败会被稀释",
    "pages": [
      "TD-B01"
    ]
  },
  {
    "term": "开环负载",
    "kind": "page",
    "category": "逐页术语",
    "plain": "固定到达率，不管系统是否处理得完；它才能还原真实用户不会因为你慢就少来的事实",
    "pages": [
      "TD-AP04"
    ]
  },
  {
    "term": "可比性",
    "kind": "page",
    "category": "逐页术语",
    "plain": "两个分数能不能放在一起比较；数据、协议、Harness、Scorer 任一不同，比较就不成立",
    "pages": [
      "TD-B01"
    ]
  },
  {
    "term": "可访问名称",
    "kind": "page",
    "category": "逐页术语",
    "plain": "辅助技术读到的名称；它常常与视觉文字不同",
    "pages": [
      "TD-X502"
    ]
  },
  {
    "term": "可访问性标识",
    "kind": "page",
    "category": "逐页术语",
    "plain": "用于定位元素的稳定标识；它需要开发侧显式设置",
    "pages": [
      "TD-PS07"
    ]
  },
  {
    "term": "可回放",
    "kind": "page",
    "category": "逐页术语",
    "plain": "凭账本能重现当时的运行；它是归因的前提",
    "pages": [
      "TD-T21"
    ]
  },
  {
    "term": "可展示工件",
    "kind": "page",
    "category": "逐页术语",
    "plain": "别人不需要听你解释就能看懂的产物，如带红绿证据的实验包",
    "pages": [
      "TD-C01"
    ]
  },
  {
    "term": "可重放",
    "kind": "page",
    "category": "逐页术语",
    "plain": "凭 trace 就能还原一次运行；不可重放的失败 trace 无法归因，也就无法修",
    "pages": [
      "TD-AP03"
    ]
  },
  {
    "term": "控制权",
    "kind": "page",
    "category": "逐页术语",
    "plain": "下一步由代码、模型还是队列决定；它是分类的唯一判据",
    "pages": [
      "TD-F04"
    ]
  },
  {
    "term": "控制实验",
    "kind": "page",
    "category": "逐页术语",
    "plain": "改一个变量重跑，验证假设；没有它就不能升级为根因",
    "pages": [
      "TD-T08"
    ]
  },
  {
    "term": "跨版本可比",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不同时间的两次评测能否比较；模型、数据、Harness 任一变化都会破坏它",
    "pages": [
      "TD-B05"
    ]
  },
  {
    "term": "跨模态关系",
    "kind": "page",
    "category": "逐页术语",
    "plain": "图与文、音与画、视频与时序之间应当成立的对应关系",
    "pages": [
      "TD-X501"
    ]
  },
  {
    "term": "快速层",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每次提交都跑，分钟级，只做确定性检查",
    "pages": [
      "TD-T20"
    ]
  },
  {
    "term": "快照差分",
    "kind": "page",
    "category": "逐页术语",
    "plain": "两个时间点的对象或连接快照相减；它比曲线更能定位泄漏来源",
    "pages": [
      "TD-AP07"
    ]
  },
  {
    "term": "离线 blocker",
    "kind": "page",
    "category": "逐页术语",
    "plain": "上线前必须通过的硬条件；它与在线观察是两回事",
    "pages": [
      "TD-X805"
    ]
  },
  {
    "term": "例外 owner",
    "kind": "page",
    "category": "逐页术语",
    "plain": "扫描发现被豁免时的责任人；无 owner 的例外等于无人负责",
    "pages": [
      "TD-X101"
    ]
  },
  {
    "term": "联合 Gate",
    "kind": "page",
    "category": "逐页术语",
    "plain": "三个维度各自设阈值，任一不满足即不通过",
    "pages": [
      "TD-T23"
    ]
  },
  {
    "term": "路径决定权",
    "kind": "page",
    "category": "逐页术语",
    "plain": "下一步由代码、模型还是队列决定",
    "pages": [
      "TD-W01"
    ]
  },
  {
    "term": "盲评",
    "kind": "page",
    "category": "逐页术语",
    "plain": "隐藏候选来源与顺序后再评判",
    "pages": [
      "TD-T14"
    ]
  },
  {
    "term": "矛盾场景",
    "kind": "page",
    "category": "逐页术语",
    "plain": "两个模态给出不一致信息；正确行为通常是指出矛盾而不是二选一",
    "pages": [
      "TD-X501"
    ]
  },
  {
    "term": "幂等键",
    "kind": "page",
    "category": "逐页术语",
    "plain": "保证重复调用只产生一次副作用的标识",
    "pages": [
      "TD-QP04",
      "TD-T16"
    ]
  },
  {
    "term": "敏感性",
    "kind": "page",
    "category": "逐页术语",
    "plain": "固定模型与数据后，单独改一个变量导致的分数变化幅度",
    "pages": [
      "TD-B04"
    ]
  },
  {
    "term": "模型路由",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按任务、成本或可用性把请求分给不同模型",
    "pages": [
      "TD-X604"
    ]
  },
  {
    "term": "内部基准",
    "kind": "page",
    "category": "逐页术语",
    "plain": "用自己的任务、数据与 Scorer 建立的基准；它不与外部可比，也不需要",
    "pages": [
      "TD-B06"
    ]
  },
  {
    "term": "能力边界",
    "kind": "page",
    "category": "逐页术语",
    "plain": "服务能做什么与不能做什么；它不写在 OpenAPI 里，只能靠测量",
    "pages": [
      "TD-A01"
    ]
  },
  {
    "term": "能力矩阵",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每个模型或工具在各能力维度上的实际表现；它必须实测",
    "pages": [
      "TD-X604"
    ]
  },
  {
    "term": "能力域",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一类可独立展示的工作能力，如风险与策略、Oracle 设计、归因；它比岗位名称稳定得多",
    "pages": [
      "TD-C01"
    ]
  },
  {
    "term": "能力主张",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一句可被检验的陈述，如「我能独立设计带独立 Oracle 的测试策略」",
    "pages": [
      "TD-C03"
    ]
  },
  {
    "term": "排队",
    "kind": "page",
    "category": "逐页术语",
    "plain": "请求已到达但尚未开始处理；表现为 TTFT 上升而生成速度正常",
    "pages": [
      "TD-A05"
    ]
  },
  {
    "term": "配对差异",
    "kind": "page",
    "category": "逐页术语",
    "plain": "同一样本在两个版本下的结果对比；它比整体均值更敏感",
    "pages": [
      "TD-T04"
    ]
  },
  {
    "term": "批准 baseline",
    "kind": "page",
    "category": "逐页术语",
    "plain": "在干净版本上必须全绿的那次运行；它证明用例本身没写错",
    "pages": [
      "TD-T06"
    ]
  },
  {
    "term": "批准权限",
    "kind": "page",
    "category": "逐页术语",
    "plain": "谁有权让候选方案进入执行；这个人不能是生成方案的那个系统",
    "pages": [
      "TD-QP01"
    ]
  },
  {
    "term": "漂移",
    "kind": "page",
    "category": "逐页术语",
    "plain": "版本未变但行为变了；它只能通过账本对比被发现",
    "pages": [
      "TD-T21",
      "TD-T24"
    ]
  },
  {
    "term": "平台期",
    "kind": "page",
    "category": "逐页术语",
    "plain": "资源上升后稳定的水平；有界缓存会形成平台期，泄漏不会",
    "pages": [
      "TD-AP07"
    ]
  },
  {
    "term": "评测层",
    "kind": "page",
    "category": "逐页术语",
    "plain": "合并前跑，覆盖风险切片与语义评测",
    "pages": [
      "TD-T20"
    ]
  },
  {
    "term": "破坏性变更",
    "kind": "page",
    "category": "逐页术语",
    "plain": "会让现有消费者失败的接口变化，如删字段、改类型",
    "pages": [
      "TD-PS02"
    ]
  },
  {
    "term": "七要素",
    "kind": "page",
    "category": "逐页术语",
    "plain": "Dataset、Prompt、模型、知识库、工具、Scorer、运行环境",
    "pages": [
      "TD-T21"
    ]
  },
  {
    "term": "签名",
    "kind": "page",
    "category": "逐页术语",
    "plain": "对产物的密码学签名；它防止产物在传输中被替换",
    "pages": [
      "TD-X101"
    ]
  },
  {
    "term": "权威",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这份文档能不能作为判断依据；同一主题的多份文档要有优先级",
    "pages": [
      "TD-T09"
    ]
  },
  {
    "term": "权限",
    "kind": "page",
    "category": "逐页术语",
    "plain": "运行时权限的授予与拒绝路径；两条都要测",
    "pages": [
      "TD-PS06"
    ]
  },
  {
    "term": "缺口路由",
    "kind": "page",
    "category": "逐页术语",
    "plain": "主张成立但证据不足时，明确下一步去哪里补",
    "pages": [
      "TD-C03"
    ]
  },
  {
    "term": "缺模态",
    "kind": "page",
    "category": "逐页术语",
    "plain": "某个模态缺失或不可读；模型应当说明而不是脑补",
    "pages": [
      "TD-X501"
    ]
  },
  {
    "term": "确定性 Gate",
    "kind": "page",
    "category": "逐页术语",
    "plain": "可以用代码精确判定的部分，如格式、字段、引用存在性",
    "pages": [
      "TD-T03"
    ]
  },
  {
    "term": "确定性响应",
    "kind": "page",
    "category": "逐页术语",
    "plain": "同一请求同一结果；传统 API 的默认假设，生成式 API 不成立",
    "pages": [
      "TD-A01"
    ]
  },
  {
    "term": "群体切片",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按可能受影响的属性划分的子集；它的划分本身需要合规确认",
    "pages": [
      "TD-X601"
    ]
  },
  {
    "term": "人工 Handoff",
    "kind": "page",
    "category": "逐页术语",
    "plain": "模型判断不了时转人工的路径；它是安全网不是失败",
    "pages": [
      "TD-T12"
    ]
  },
  {
    "term": "人工复核",
    "kind": "page",
    "category": "逐页术语",
    "plain": "最终的判断者；成本最高，因此要精准投放",
    "pages": [
      "TD-T03"
    ]
  },
  {
    "term": "人工基线",
    "kind": "page",
    "category": "逐页术语",
    "plain": "同样任务由人完成的成本与质量；没有它，ROI 无法计算",
    "pages": [
      "TD-B06"
    ]
  },
  {
    "term": "人人一致性",
    "kind": "page",
    "category": "逐页术语",
    "plain": "两名领域标注员独立打分的一致程度；它是 Judge 一致性的上限",
    "pages": [
      "TD-T14"
    ]
  },
  {
    "term": "任务分布",
    "kind": "page",
    "category": "逐页术语",
    "plain": "你的业务真实遇到的任务构成；它与任何公共榜单都不同",
    "pages": [
      "TD-B06"
    ]
  },
  {
    "term": "任务族",
    "kind": "page",
    "category": "逐页术语",
    "plain": "分类、检索、生成、决策、执行等；不同任务族的指标不可互换",
    "pages": [
      "TD-F05"
    ]
  },
  {
    "term": "熔断",
    "kind": "page",
    "category": "逐页术语",
    "plain": "连续失败后主动断开，给下游恢复时间",
    "pages": [
      "TD-PS10"
    ]
  },
  {
    "term": "入口 2xx",
    "kind": "page",
    "category": "逐页术语",
    "plain": "网关返回成功，但任务可能仍在后台失败；用它代表可用性是最常见的假绿",
    "pages": [
      "TD-AP01"
    ]
  },
  {
    "term": "杀死率",
    "kind": "page",
    "category": "逐页术语",
    "plain": "生成用例在已知缺陷上的检出比例；它是检测力的唯一客观代理",
    "pages": [
      "TD-T26"
    ]
  },
  {
    "term": "删除回执",
    "kind": "page",
    "category": "逐页术语",
    "plain": "用户要求删除后，可证明确实删掉的记录",
    "pages": [
      "TD-X603"
    ]
  },
  {
    "term": "上下文位置",
    "kind": "page",
    "category": "逐页术语",
    "plain": "信息在提示中的位置会影响它被使用的程度",
    "pages": [
      "TD-F03"
    ]
  },
  {
    "term": "设备矩阵",
    "kind": "page",
    "category": "逐页术语",
    "plain": "要覆盖的系统版本与屏幕组合；它必须有明确取舍依据",
    "pages": [
      "TD-PS06"
    ]
  },
  {
    "term": "设计",
    "kind": "page",
    "category": "逐页术语",
    "plain": "决定用什么方法、什么 Oracle、测到多深；判据是选择有理由",
    "pages": [
      "TD-C02"
    ]
  },
  {
    "term": "申诉效果",
    "kind": "page",
    "category": "逐页术语",
    "plain": "用户提出异议后结果是否真的改变；没有效果的申诉通道等于没有",
    "pages": [
      "TD-X601"
    ]
  },
  {
    "term": "生命周期",
    "kind": "page",
    "category": "逐页术语",
    "plain": "应用在前后台、被回收、重建时的状态变化",
    "pages": [
      "TD-PS06"
    ]
  },
  {
    "term": "生效期",
    "kind": "page",
    "category": "逐页术语",
    "plain": "文档从什么时候到什么时候有效；过期文档仍被检索是常见事故",
    "pages": [
      "TD-T09"
    ]
  },
  {
    "term": "失败成本",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这类样本出错的代价；它决定样本的权重而不是数量",
    "pages": [
      "TD-F05",
      "TD-T02"
    ]
  },
  {
    "term": "时间边界",
    "kind": "page",
    "category": "逐页术语",
    "plain": "样本的时间范围；跨越版本变更的样本会让对比失效",
    "pages": [
      "TD-T02"
    ]
  },
  {
    "term": "事件信封",
    "kind": "page",
    "category": "逐页术语",
    "plain": "统一的消息外壳：事件 ID、类型、来源、时间、幂等键",
    "pages": [
      "TD-QP04"
    ]
  },
  {
    "term": "视觉回归",
    "kind": "page",
    "category": "逐页术语",
    "plain": "界面变化的自动比对；它需要区分有意变更与意外变更",
    "pages": [
      "TD-PS05"
    ]
  },
  {
    "term": "适配器",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把公共状态映射到组织 band 的对照表，必须由组织内部人填写",
    "pages": [
      "TD-C04"
    ]
  },
  {
    "term": "属性",
    "kind": "page",
    "category": "逐页术语",
    "plain": "对任意输入都应成立的性质；适用于有不变量但无唯一答案的场景",
    "pages": [
      "TD-PS02",
      "TD-T07"
    ]
  },
  {
    "term": "数据分类",
    "kind": "page",
    "category": "逐页术语",
    "plain": "哪些字段属于敏感信息；它决定输出过滤规则",
    "pages": [
      "TD-PS12"
    ]
  },
  {
    "term": "锁定字段",
    "kind": "page",
    "category": "逐页术语",
    "plain": "实验期间必须固定的所有其他配置",
    "pages": [
      "TD-T13"
    ]
  },
  {
    "term": "提示边界",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不可信内容进入模型上下文的位置",
    "pages": [
      "TD-PS12"
    ]
  },
  {
    "term": "替代路径",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这条资源不可得时的等价选择，如付费课程对应的开源实现",
    "pages": [
      "TD-R01"
    ]
  },
  {
    "term": "同步",
    "kind": "page",
    "category": "逐页术语",
    "plain": "等待界面真正就绪的机制；固定延时在移动端尤其不可靠",
    "pages": [
      "TD-PS06"
    ]
  },
  {
    "term": "同类反查",
    "kind": "page",
    "category": "逐页术语",
    "plain": "找出与它同类但尚未暴露的风险",
    "pages": [
      "TD-T22"
    ]
  },
  {
    "term": "同意与目的",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这条记忆是基于什么授权、为什么目的写入的",
    "pages": [
      "TD-X603"
    ]
  },
  {
    "term": "同预算",
    "kind": "page",
    "category": "逐页术语",
    "plain": "两组共享相同的总 token、时间、重试与人工干预额度",
    "pages": [
      "TD-W03"
    ]
  },
  {
    "term": "托管模型盲区",
    "kind": "page",
    "category": "逐页术语",
    "plain": "供应商内部不可见的部分；它必须被显式标注为未知",
    "pages": [
      "TD-PS11"
    ]
  },
  {
    "term": "脱敏 Trace",
    "kind": "page",
    "category": "逐页术语",
    "plain": "移除敏感信息但保留结构的运行记录",
    "pages": [
      "TD-PS11",
      "TD-T22"
    ]
  },
  {
    "term": "脱敏通知",
    "kind": "page",
    "category": "逐页术语",
    "plain": "对外通知中移除敏感字段；通知渠道往往是泄露的最后一公里",
    "pages": [
      "TD-QP04"
    ]
  },
  {
    "term": "外部质量状态",
    "kind": "page",
    "category": "逐页术语",
    "plain": "来自扫描、评测等外部系统的结论；它常常滞后于当前 commit",
    "pages": [
      "TD-QP02"
    ]
  },
  {
    "term": "完整层",
    "kind": "page",
    "category": "逐页术语",
    "plain": "发布前跑，含全量评测、安全与性能",
    "pages": [
      "TD-T20"
    ]
  },
  {
    "term": "网络控制",
    "kind": "page",
    "category": "逐页术语",
    "plain": "主动控制外部请求的响应，让测试摆脱外部依赖",
    "pages": [
      "TD-PS04"
    ]
  },
  {
    "term": "威胁模型",
    "kind": "page",
    "category": "逐页术语",
    "plain": "谁可能攻击、攻击什么、能得到什么；它决定测试范围",
    "pages": [
      "TD-PS12"
    ]
  },
  {
    "term": "稳定分流",
    "kind": "page",
    "category": "逐页术语",
    "plain": "同一用户始终落在同一组；否则对比会被稀释",
    "pages": [
      "TD-X805"
    ]
  },
  {
    "term": "无答案",
    "kind": "page",
    "category": "逐页术语",
    "plain": "语料里确实没有答案的情况；正确行为是明确说不知道",
    "pages": [
      "TD-T12"
    ]
  },
  {
    "term": "系统权限弹窗",
    "kind": "page",
    "category": "逐页术语",
    "plain": "由系统而非应用弹出的对话框；它不在应用视图层级里",
    "pages": [
      "TD-PS07"
    ]
  },
  {
    "term": "限制",
    "kind": "page",
    "category": "逐页术语",
    "plain": "它不覆盖什么、在什么条件下失效；这是最容易被省略也最有用的一栏",
    "pages": [
      "TD-R01"
    ]
  },
  {
    "term": "响应式",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不同屏幕尺寸下布局是否可用，而不只是不错位",
    "pages": [
      "TD-PS05"
    ]
  },
  {
    "term": "消费者契约",
    "kind": "page",
    "category": "逐页术语",
    "plain": "由调用方定义的期望；它比提供方的声明更能反映实际依赖",
    "pages": [
      "TD-PS03"
    ]
  },
  {
    "term": "协议变量",
    "kind": "page",
    "category": "逐页术语",
    "plain": "Prompt 模板、示例数量、输出格式要求等影响提问方式的设定",
    "pages": [
      "TD-B04"
    ]
  },
  {
    "term": "协议层",
    "kind": "page",
    "category": "逐页术语",
    "plain": "HTTP 状态码、头、编码；它只回答「通了吗」",
    "pages": [
      "TD-PS01"
    ]
  },
  {
    "term": "协议漂移",
    "kind": "page",
    "category": "逐页术语",
    "plain": "工具或 Provider 的接口、Schema、语义在版本间变化",
    "pages": [
      "TD-X604"
    ]
  },
  {
    "term": "协作失败",
    "kind": "page",
    "category": "逐页术语",
    "plain": "多 Agent 特有的失败：重复工作、信息丢失、互相等待",
    "pages": [
      "TD-W03"
    ]
  },
  {
    "term": "写前授权",
    "kind": "page",
    "category": "逐页术语",
    "plain": "在副作用发生之前完成的检查链；它必须在模型之外",
    "pages": [
      "TD-T16"
    ]
  },
  {
    "term": "虚构政策",
    "kind": "page",
    "category": "逐页术语",
    "plain": "模型补写的、原文不存在的业务规则；它是本页要阻断的主要失败",
    "pages": [
      "TD-T05"
    ]
  },
  {
    "term": "需求事件",
    "kind": "page",
    "category": "逐页术语",
    "plain": "Jira 的创建/变更/状态流转事件；它是触发信号，不是依据本身",
    "pages": [
      "TD-QP01"
    ]
  },
  {
    "term": "训练污染",
    "kind": "page",
    "category": "逐页术语",
    "plain": "评测样本已进入训练数据；此时分数是记忆而非能力",
    "pages": [
      "TD-B05"
    ]
  },
  {
    "term": "演练",
    "kind": "page",
    "category": "逐页术语",
    "plain": "在没有事故时先走一遍回滚流程",
    "pages": [
      "TD-T24"
    ]
  },
  {
    "term": "业务 Oracle",
    "kind": "page",
    "category": "逐页术语",
    "plain": "判断业务状态是否正确的依据；它不能由生成方决定",
    "pages": [
      "TD-T18",
      "TD-T19"
    ]
  },
  {
    "term": "业务不变量",
    "kind": "page",
    "category": "逐页术语",
    "plain": "无论怎么调用都必须成立的约束，如退款不超过实付",
    "pages": [
      "TD-PS01"
    ]
  },
  {
    "term": "业务规则",
    "kind": "page",
    "category": "逐页术语",
    "plain": "领域内必须成立的约束，如金额上限、状态转换",
    "pages": [
      "TD-T03"
    ]
  },
  {
    "term": "异步任务",
    "kind": "page",
    "category": "逐页术语",
    "plain": "提交后轮询；任务 ID 丢失或状态机漏态会造成静默失败",
    "pages": [
      "TD-A02"
    ]
  },
  {
    "term": "隐藏测试集",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不公开样本以防污染；它降低风险但不能消除",
    "pages": [
      "TD-B05"
    ]
  },
  {
    "term": "影子读",
    "kind": "page",
    "category": "逐页术语",
    "plain": "同时读新旧两处并比对，但只返回旧结果",
    "pages": [
      "TD-PS08"
    ]
  },
  {
    "term": "用户隔离",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一个用户的记忆绝不能出现在另一个用户的上下文里",
    "pages": [
      "TD-X603"
    ]
  },
  {
    "term": "用途",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这条资源解决什么问题；它决定要不要读，而不是评分",
    "pages": [
      "TD-R01"
    ]
  },
  {
    "term": "语义评分",
    "kind": "page",
    "category": "逐页术语",
    "plain": "模型判分；它是估计值，不是判据",
    "pages": [
      "TD-T03"
    ]
  },
  {
    "term": "语义忠实",
    "kind": "page",
    "category": "逐页术语",
    "plain": "结论真的被引用内容支持，而不是被扭曲或补充",
    "pages": [
      "TD-T11"
    ]
  },
  {
    "term": "预训练",
    "kind": "page",
    "category": "逐页术语",
    "plain": "模型的基础能力来源；测试开发通常无法干预，但要知道它决定了能力上限",
    "pages": [
      "TD-F02"
    ]
  },
  {
    "term": "允许终态",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次任务被认为「完成」的所有合法结果，含成功、转人工、安全拒绝；只认成功会把正确的拒绝算成失败",
    "pages": [
      "TD-AP01"
    ]
  },
  {
    "term": "运行波动",
    "kind": "page",
    "category": "逐页术语",
    "plain": "批处理、缓存、硬件差异带来的输出变化；即使 temperature=0 也存在",
    "pages": [
      "TD-F03"
    ]
  },
  {
    "term": "责任状态",
    "kind": "page",
    "category": "逐页术语",
    "plain": "你在一个决定上处于什么位置：执行、设计、裁决还是治理",
    "pages": [
      "TD-C01"
    ]
  },
  {
    "term": "整包回滚",
    "kind": "page",
    "category": "逐页术语",
    "plain": "模型、Prompt、索引、工具、阈值成组退回",
    "pages": [
      "TD-T24"
    ]
  },
  {
    "term": "证据",
    "kind": "page",
    "category": "逐页术语",
    "plain": "支撑主张的具体工件或记录，能被第三方打开查看",
    "pages": [
      "TD-C03"
    ]
  },
  {
    "term": "证据闭包",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每个结论都能追到产生它的那次运行",
    "pages": [
      "TD-T25"
    ]
  },
  {
    "term": "执行变量",
    "kind": "page",
    "category": "逐页术语",
    "plain": "工具集合、超时、重试次数、上下文上限等影响执行的设定",
    "pages": [
      "TD-B04"
    ]
  },
  {
    "term": "直接注入",
    "kind": "page",
    "category": "逐页术语",
    "plain": "用户在输入里写「忽略之前的指令」；最容易想到也最容易防",
    "pages": [
      "TD-T17"
    ]
  },
  {
    "term": "止血 vs 修复",
    "kind": "page",
    "category": "逐页术语",
    "plain": "先恢复用户可用性，再定位根因；两者的 owner 与时限不同",
    "pages": [
      "TD-AP08"
    ]
  },
  {
    "term": "只追加证据层",
    "kind": "page",
    "category": "逐页术语",
    "plain": "原始 trace 与工件只增不改；聚类与假设建在它之上",
    "pages": [
      "TD-T08"
    ]
  },
  {
    "term": "至少一次语义",
    "kind": "page",
    "category": "逐页术语",
    "plain": "消息可能被重复投递；这是队列的常态而非异常",
    "pages": [
      "TD-W02"
    ]
  },
  {
    "term": "治理",
    "kind": "page",
    "category": "逐页术语",
    "plain": "定义别人做决定的规则；判据是规则被采用并产生了可观察的行为变化",
    "pages": [
      "TD-C02"
    ]
  },
  {
    "term": "质量回流",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把生产样本回流到评测集的机制",
    "pages": [
      "TD-PS11"
    ]
  },
  {
    "term": "终止条件",
    "kind": "page",
    "category": "逐页术语",
    "plain": "什么时候算结束；没有明确终止的系统一定会有死循环",
    "pages": [
      "TD-W01"
    ]
  },
  {
    "term": "重放",
    "kind": "page",
    "category": "逐页术语",
    "plain": "从历史事件重新推进状态；它是恢复手段也是测试手段",
    "pages": [
      "TD-QP04"
    ]
  },
  {
    "term": "重复投递",
    "kind": "page",
    "category": "逐页术语",
    "plain": "消息可能被送达多次；这是至少一次语义的常态",
    "pages": [
      "TD-PS03"
    ]
  },
  {
    "term": "重复运行",
    "kind": "page",
    "category": "逐页术语",
    "plain": "同输入多次执行；它是所有分布统计的前提",
    "pages": [
      "TD-T04"
    ]
  },
  {
    "term": "重试放大",
    "kind": "page",
    "category": "逐页术语",
    "plain": "网关、SDK、Agent、Tool 各自重试三次，最坏情况是 81 次调用",
    "pages": [
      "TD-AP06"
    ]
  },
  {
    "term": "重试预算",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次任务允许的重试总次数；它是任务级的，不是每层各自的",
    "pages": [
      "TD-A06",
      "TD-AP06",
      "TD-PS10"
    ]
  },
  {
    "term": "状态",
    "kind": "page",
    "category": "逐页术语",
    "plain": "会话状态存在哪里：请求内、数据库、还是长期记忆",
    "pages": [
      "TD-F04"
    ]
  },
  {
    "term": "状态残留",
    "kind": "page",
    "category": "逐页术语",
    "plain": "上次运行留下的登录态、缓存与权限设置",
    "pages": [
      "TD-PS07"
    ]
  },
  {
    "term": "状态持有者",
    "kind": "page",
    "category": "逐页术语",
    "plain": "状态存在哪里：进程内、数据库、还是消息里",
    "pages": [
      "TD-W01"
    ]
  },
  {
    "term": "状态隔离",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每个测试自建自清数据，不依赖执行顺序",
    "pages": [
      "TD-PS04"
    ]
  },
  {
    "term": "资源斜率",
    "kind": "page",
    "category": "逐页术语",
    "plain": "内存、连接、句柄随时间的增长斜率；持续正斜率且不回落才是泄漏",
    "pages": [
      "TD-AP07"
    ]
  },
  {
    "term": "总 deadline",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次任务允许的最长时间；所有层的超时之和必须小于它，否则外层永远等不到内层结束",
    "pages": [
      "TD-AP06"
    ]
  },
  {
    "term": "总体",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这个指标算在哪一群样本上；总体不同则数字不可比",
    "pages": [
      "TD-F05"
    ]
  },
  {
    "term": "纵深防御",
    "kind": "page",
    "category": "逐页术语",
    "plain": "输入、检索、模型、工具、输出五层各自独立拦截",
    "pages": [
      "TD-T17"
    ]
  },
  {
    "term": "租户权限",
    "kind": "page",
    "category": "逐页术语",
    "plain": "不同身份检索到的集合必须不同；任一次跨租户即 blocker",
    "pages": [
      "TD-T12"
    ]
  },
  {
    "term": "组合",
    "kind": "page",
    "category": "逐页术语",
    "plain": "多个参数的取值搭配；适用于参数间互相影响的场景",
    "pages": [
      "TD-T07"
    ]
  },
  {
    "term": "组织 band",
    "kind": "page",
    "category": "逐页术语",
    "plain": "你公司自己的职级体系，如 P5–P9；它不跨组织可比",
    "pages": [
      "TD-C04"
    ]
  },
  {
    "term": "最坏结果",
    "kind": "page",
    "category": "逐页术语",
    "plain": "切片中表现最差的那一组；平均值会完全掩盖它",
    "pages": [
      "TD-X601"
    ]
  },
  {
    "term": "最小 scope",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这个工具在这次调用中被授予的最小权限范围",
    "pages": [
      "TD-T16"
    ]
  },
  {
    "term": "最小回归样例",
    "kind": "page",
    "category": "逐页术语",
    "plain": "能稳定复现该缺陷的最小输入集合",
    "pages": [
      "TD-T22"
    ]
  },
  {
    "term": "作品集边界",
    "kind": "page",
    "category": "逐页术语",
    "plain": "哪些内容可以对外展示；企业数据、内部流程、未脱敏证据都不能",
    "pages": [
      "TD-C01"
    ]
  },
  {
    "term": "Accuracy",
    "kind": "page",
    "category": "逐页术语",
    "plain": "逐题判对的比例；分母是题数，适合有唯一答案的任务",
    "pages": [
      "TD-B03"
    ]
  },
  {
    "term": "ACL 传播",
    "kind": "page",
    "category": "逐页术语",
    "plain": "文档权限变更后，索引与缓存里的副本是否同步更新",
    "pages": [
      "TD-T09"
    ]
  },
  {
    "term": "Basis Gate",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把事件转成冻结依据的那道门；不通过就不允许生成下游工件",
    "pages": [
      "TD-QP01"
    ]
  },
  {
    "term": "blocker",
    "kind": "page",
    "category": "逐页术语",
    "plain": "无论整体统计如何都必须阻断的单条失败",
    "pages": [
      "TD-T04"
    ]
  },
  {
    "term": "Burn rate",
    "kind": "page",
    "category": "逐页术语",
    "plain": "错误预算的消耗速率；多窗口组合可以同时兼顾快响应与低误报",
    "pages": [
      "TD-AP08"
    ]
  },
  {
    "term": "CDC 高水位",
    "kind": "page",
    "category": "逐页术语",
    "plain": "增量同步已处理到的位置；它决定了断点续传的正确性",
    "pages": [
      "TD-PS08"
    ]
  },
  {
    "term": "challenge",
    "kind": "page",
    "category": "逐页术语",
    "plain": "刻意收集的难例，回答「边界在哪里」；它的绝对分数没有意义",
    "pages": [
      "TD-B02"
    ]
  },
  {
    "term": "checkpoint",
    "kind": "page",
    "category": "逐页术语",
    "plain": "可恢复的状态快照；崩溃后从这里继续而不是从头开始",
    "pages": [
      "TD-W02"
    ]
  },
  {
    "term": "chunk lineage",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每个检索单元能追回原文档的位置；没有它就无法核对引用",
    "pages": [
      "TD-T09"
    ]
  },
  {
    "term": "citation 存在",
    "kind": "page",
    "category": "逐页术语",
    "plain": "引用指向的内容确实在检索结果里；这一层可以完全自动化",
    "pages": [
      "TD-T11"
    ]
  },
  {
    "term": "citation 对齐",
    "kind": "page",
    "category": "逐页术语",
    "plain": "引用的那段内容确实与这句话相关",
    "pages": [
      "TD-T11"
    ]
  },
  {
    "term": "claim",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把回答拆开后的一条可独立核查的陈述",
    "pages": [
      "TD-T11"
    ]
  },
  {
    "term": "cleanup 成功率",
    "kind": "page",
    "category": "逐页术语",
    "plain": "会话、临时环境、连接的回收成功比例；它下降通常早于内存曲线异常",
    "pages": [
      "TD-AP07"
    ]
  },
  {
    "term": "confounded",
    "kind": "page",
    "category": "逐页术语",
    "plain": "两个及以上锁定字段同时变化，实验作废",
    "pages": [
      "TD-T13"
    ]
  },
  {
    "term": "deadline",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次请求允许的最长总时间；所有层的超时之和必须小于它",
    "pages": [
      "TD-A06"
    ]
  },
  {
    "term": "deadline 传播",
    "kind": "page",
    "category": "逐页术语",
    "plain": "上游的剩余时间要传给下游；否则下游会做无用功",
    "pages": [
      "TD-PS10"
    ]
  },
  {
    "term": "decode",
    "kind": "page",
    "category": "逐页术语",
    "plain": "逐 token 生成阶段；受输出长度与批处理影响",
    "pages": [
      "TD-A05"
    ]
  },
  {
    "term": "Degradation",
    "kind": "page",
    "category": "逐页术语",
    "plain": "主动降低服务能力以保住可用性，如缩短输出、关闭工具",
    "pages": [
      "TD-A06"
    ]
  },
  {
    "term": "fail-closed",
    "kind": "page",
    "category": "逐页术语",
    "plain": "证据不完整时阻断而不是放行；这是聚合逻辑的默认行为",
    "pages": [
      "TD-QP02",
      "TD-T20"
    ]
  },
  {
    "term": "Fallback",
    "kind": "page",
    "category": "逐页术语",
    "plain": "主路径不可用时的替代；它的能力边界与主路径不同",
    "pages": [
      "TD-A06",
      "TD-X604"
    ]
  },
  {
    "term": "Fuzz",
    "kind": "page",
    "category": "逐页术语",
    "plain": "大量随机或畸形输入；适用于输入面未知、要找崩溃与异常的场景",
    "pages": [
      "TD-T07"
    ]
  },
  {
    "term": "generator",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把计划变成可执行代码；它决定怎么测",
    "pages": [
      "TD-T18"
    ]
  },
  {
    "term": "gold document",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这个问题的正确答案所在的文档；它由人标注，不由模型判定",
    "pages": [
      "TD-T10"
    ]
  },
  {
    "term": "Good task",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次既完成业务终态、又满足延迟与成本约束的任务；它是 SLI 的分子",
    "pages": [
      "TD-AP02"
    ]
  },
  {
    "term": "guardrail 指标",
    "kind": "page",
    "category": "逐页术语",
    "plain": "小流量阶段用于快速止损的少数关键指标",
    "pages": [
      "TD-X805"
    ]
  },
  {
    "term": "Handoff",
    "kind": "page",
    "category": "逐页术语",
    "plain": "任务在组件或人之间转移；权限不得随之扩大",
    "pages": [
      "TD-W02"
    ]
  },
  {
    "term": "Harness",
    "kind": "page",
    "category": "逐页术语",
    "plain": "跑 Benchmark 的那套执行代码：Prompt 模板、工具、超时、重试；同一模型换 Harness 分数会变",
    "pages": [
      "TD-B01"
    ]
  },
  {
    "term": "healer",
    "kind": "page",
    "category": "逐页术语",
    "plain": "失败后修复测试；它是风险最高的角色",
    "pages": [
      "TD-T18"
    ]
  },
  {
    "term": "INTERNAL-UNKNOWN",
    "kind": "page",
    "category": "逐页术语",
    "plain": "缺组织来源时的显式状态；它不是失败，是诚实",
    "pages": [
      "TD-C04"
    ]
  },
  {
    "term": "ITL",
    "kind": "page",
    "category": "逐页术语",
    "plain": "相邻 token 的实际间隔序列；比 TPOT 多了抖动信息",
    "pages": [
      "TD-A03"
    ]
  },
  {
    "term": "Judge score",
    "kind": "page",
    "category": "逐页术语",
    "plain": "模型判分的连续得分；它是估计值，误差取决于 Judge 校准",
    "pages": [
      "TD-B03"
    ]
  },
  {
    "term": "JUnit 报告",
    "kind": "page",
    "category": "逐页术语",
    "plain": "标准化的测试结果格式；它只描述结果，不描述覆盖了什么",
    "pages": [
      "TD-QP02"
    ]
  },
  {
    "term": "lineage",
    "kind": "page",
    "category": "逐页术语",
    "plain": "训练数据、基座、代码、超参、评测集的完整版本链",
    "pages": [
      "TD-X602"
    ]
  },
  {
    "term": "locale",
    "kind": "page",
    "category": "逐页术语",
    "plain": "语言与地区组合；它影响日期、数字、货币与排序",
    "pages": [
      "TD-X502"
    ]
  },
  {
    "term": "miss reason",
    "kind": "page",
    "category": "逐页术语",
    "plain": "没检索到的原因分类；它比 recall 数字更有行动价值",
    "pages": [
      "TD-T10"
    ]
  },
  {
    "term": "MRR",
    "kind": "page",
    "category": "逐页术语",
    "plain": "gold 出现位置的倒数均值；它回答「排得够靠前吗」",
    "pages": [
      "TD-T10"
    ]
  },
  {
    "term": "mutation",
    "kind": "page",
    "category": "逐页术语",
    "plain": "独立植入的已知缺陷；它是检测力的唯一客观代理",
    "pages": [
      "TD-T06"
    ]
  },
  {
    "term": "NetworkPolicy",
    "kind": "page",
    "category": "逐页术语",
    "plain": "限制它能访问什么；防止测试环境打到生产依赖",
    "pages": [
      "TD-QP03"
    ]
  },
  {
    "term": "no coverage",
    "kind": "page",
    "category": "逐页术语",
    "plain": "变异所在代码根本没被执行；它既不算杀死也不算存活",
    "pages": [
      "TD-T06"
    ]
  },
  {
    "term": "Oracle 可得性",
    "kind": "page",
    "category": "逐页术语",
    "plain": "有没有独立的判对方式；没有时精确指标算不出来",
    "pages": [
      "TD-F05"
    ]
  },
  {
    "term": "Outcome",
    "kind": "page",
    "category": "逐页术语",
    "plain": "业务最终状态是否正确；它是用户看到的那一层",
    "pages": [
      "TD-T15"
    ]
  },
  {
    "term": "override",
    "kind": "page",
    "category": "逐页术语",
    "plain": "人工推翻模型结论的动作；它的可用性决定人是否真的有控制权",
    "pages": [
      "TD-X601"
    ]
  },
  {
    "term": "owner",
    "kind": "page",
    "category": "逐页术语",
    "plain": "这份合同的负责人；阈值与例外由他裁决",
    "pages": [
      "TD-T01"
    ]
  },
  {
    "term": "Pareto 前沿",
    "kind": "page",
    "category": "逐页术语",
    "plain": "在某一维度上无法再改进而不牺牲其他维度的候选集合",
    "pages": [
      "TD-T23"
    ]
  },
  {
    "term": "Pass@k",
    "kind": "page",
    "category": "逐页术语",
    "plain": "k 次采样中至少一次成功的比例；它衡量能力上限，不衡量稳定性",
    "pages": [
      "TD-B03"
    ]
  },
  {
    "term": "planner",
    "kind": "page",
    "category": "逐页术语",
    "plain": "从需求与风险产出测试计划；它决定测什么",
    "pages": [
      "TD-T18"
    ]
  },
  {
    "term": "prefill",
    "kind": "page",
    "category": "逐页术语",
    "plain": "处理输入上下文的阶段；受输入长度影响最大",
    "pages": [
      "TD-A05"
    ]
  },
  {
    "term": "prefill / decode",
    "kind": "page",
    "category": "逐页术语",
    "plain": "首 token 前的上下文处理阶段与逐 token 生成阶段；两者的瓶颈完全不同",
    "pages": [
      "TD-AP05"
    ]
  },
  {
    "term": "provenance",
    "kind": "page",
    "category": "逐页术语",
    "plain": "构建来源证明；它说明这个产物是由谁、用什么源码、在哪构建的",
    "pages": [
      "TD-X101"
    ]
  },
  {
    "term": "Recall@k",
    "kind": "page",
    "category": "逐页术语",
    "plain": "前 k 个结果里包含 gold 的比例；它回答「找到了吗」",
    "pages": [
      "TD-T10"
    ]
  },
  {
    "term": "regression",
    "kind": "page",
    "category": "逐页术语",
    "plain": "已修复缺陷转化的固定集合，回答「有没有退回去」",
    "pages": [
      "TD-B02"
    ]
  },
  {
    "term": "Release Candidate",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一个可以被评审的完整版本，而不是一堆分散的产物",
    "pages": [
      "TD-T25"
    ]
  },
  {
    "term": "representative",
    "kind": "page",
    "category": "逐页术语",
    "plain": "按真实分布抽样，回答「典型情况下表现如何」",
    "pages": [
      "TD-B02"
    ]
  },
  {
    "term": "Resolved rate",
    "kind": "page",
    "category": "逐页术语",
    "plain": "端到端解决问题的比例；分母是任务数，通常远低于逐步 accuracy",
    "pages": [
      "TD-B03"
    ]
  },
  {
    "term": "ResourceQuota",
    "kind": "page",
    "category": "逐页术语",
    "plain": "限制这套环境能占用的资源上限；防止一次失控拖垮集群",
    "pages": [
      "TD-QP03"
    ]
  },
  {
    "term": "SBOM",
    "kind": "page",
    "category": "逐页术语",
    "plain": "软件物料清单；它列出构建产物里包含了什么",
    "pages": [
      "TD-X101"
    ]
  },
  {
    "term": "Schema 变异",
    "kind": "page",
    "category": "逐页术语",
    "plain": "故意破坏请求或响应结构，看校验是否生效",
    "pages": [
      "TD-PS02"
    ]
  },
  {
    "term": "Schema 层",
    "kind": "page",
    "category": "逐页术语",
    "plain": "字段、类型、必填；它只回答「格式对吗」",
    "pages": [
      "TD-PS01"
    ]
  },
  {
    "term": "Scorer",
    "kind": "page",
    "category": "逐页术语",
    "plain": "把模型输出判定为对错的程序或模型；它本身也可能有偏差，且很少被单独评估",
    "pages": [
      "TD-B01"
    ]
  },
  {
    "term": "script 与 RTL",
    "kind": "page",
    "category": "逐页术语",
    "plain": "文字系统与书写方向；RTL 会改变整个布局逻辑",
    "pages": [
      "TD-X502"
    ]
  },
  {
    "term": "SHA 绑定",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每份证据都记录它对应的 commit SHA；没有它证据无法归属",
    "pages": [
      "TD-QP02"
    ]
  },
  {
    "term": "SLI",
    "kind": "page",
    "category": "逐页术语",
    "plain": "服务质量指标；Agent 场景应以 good task 为分子，而不是 HTTP 成功率",
    "pages": [
      "TD-AP08"
    ]
  },
  {
    "term": "SLO 拐点",
    "kind": "page",
    "category": "逐页术语",
    "plain": "延迟或成功率开始违反 SLO 的那个负载点；容量指的是它，不是最大吞吐",
    "pages": [
      "TD-A04",
      "TD-AP05"
    ]
  },
  {
    "term": "SLO 链",
    "kind": "page",
    "category": "逐页术语",
    "plain": "从用户体验指标到具体组件指标的连接",
    "pages": [
      "TD-PS11"
    ]
  },
  {
    "term": "Span 类型",
    "kind": "page",
    "category": "逐页术语",
    "plain": "generation、tool、retry、handoff 四类；类型不分开就无法按类型统计耗时与失败",
    "pages": [
      "TD-AP03"
    ]
  },
  {
    "term": "SSE 流",
    "kind": "page",
    "category": "逐页术语",
    "plain": "服务端逐段推送；连接中断与最后一段缺失在最终拼接文本里看不出来",
    "pages": [
      "TD-A02"
    ]
  },
  {
    "term": "Step",
    "kind": "page",
    "category": "逐页术语",
    "plain": "每次工具调用的工具、参数、权限、前置条件是否合法",
    "pages": [
      "TD-T15"
    ]
  },
  {
    "term": "stop state",
    "kind": "page",
    "category": "逐页术语",
    "plain": "什么情况下停止评测并升级；没有它，评测会在证据不足时给出结论",
    "pages": [
      "TD-T01"
    ]
  },
  {
    "term": "stop_reason",
    "kind": "page",
    "category": "逐页术语",
    "plain": "停止的机器可读原因；没有它就分不清正常完成与撞上限",
    "pages": [
      "TD-W02"
    ]
  },
  {
    "term": "Synthetic goodput",
    "kind": "page",
    "category": "逐页术语",
    "plain": "合成负载下满足 SLO 的成功任务吞吐；它只对这份合成负载成立",
    "pages": [
      "TD-AP05"
    ]
  },
  {
    "term": "Task",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次有业务终态的完整工作，可能包含十几次模型调用与工具调用；它才是 Agent 的压测单位",
    "pages": [
      "TD-AP01"
    ]
  },
  {
    "term": "Task Root",
    "kind": "page",
    "category": "逐页术语",
    "plain": "一次任务的根 span；一条任务对应一个根，是所有归因的挂载点",
    "pages": [
      "TD-AP03"
    ]
  },
  {
    "term": "Token 分布",
    "kind": "page",
    "category": "逐页术语",
    "plain": "输入与输出长度的实际分布；用均值压测会严重高估容量",
    "pages": [
      "TD-A04"
    ]
  },
  {
    "term": "Token 预算",
    "kind": "page",
    "category": "逐页术语",
    "plain": "输入与输出可用的 token 上限；超出即截断，而截断常常无声",
    "pages": [
      "TD-F03"
    ]
  },
  {
    "term": "TPOT",
    "kind": "page",
    "category": "逐页术语",
    "plain": "生成阶段每 token 平均间隔；决定出字快慢",
    "pages": [
      "TD-A03"
    ]
  },
  {
    "term": "TPOT / ITL",
    "kind": "page",
    "category": "逐页术语",
    "plain": "生成阶段每个 token 的平均间隔；总时长 ≈ TTFT + 输出长度 × TPOT",
    "pages": [
      "TD-AP02"
    ]
  },
  {
    "term": "Trace 层次",
    "kind": "page",
    "category": "逐页术语",
    "plain": "要观察到哪一级：调用级、步骤级还是任务级",
    "pages": [
      "TD-F04"
    ]
  },
  {
    "term": "Trajectory",
    "kind": "page",
    "category": "逐页术语",
    "plain": "整条决策序列的状态、重试、交接与终止原因是否可接受",
    "pages": [
      "TD-T15"
    ]
  },
  {
    "term": "TTFT",
    "kind": "page",
    "category": "逐页术语",
    "plain": "从请求到第一个 token 的时间；它决定流式体验，但在 Agent 里通常发生在若干次工具调用之后",
    "pages": [
      "TD-A03",
      "TD-AP02"
    ]
  },
  {
    "term": "TTL",
    "kind": "page",
    "category": "逐页术语",
    "plain": "记忆的有效期；没有过期的个性化会持续放大早期误判",
    "pages": [
      "TD-QP03",
      "TD-X603"
    ]
  },
  {
    "term": "UNKNOWN 桶",
    "kind": "page",
    "category": "逐页术语",
    "plain": "无法归类的失败；它不允许为了报表好看而被清空",
    "pages": [
      "TD-T08"
    ]
  },
  {
    "term": "Waiver",
    "kind": "page",
    "category": "逐页术语",
    "plain": "明知不达标但批准通过的记录；它必须有过期时间",
    "pages": [
      "TD-T24"
    ]
  }
];

export const glossaryCategories = [
  "AI 基础",
  "评测基础",
  "可靠性",
  "统计",
  "评测可信度",
  "性能",
  "数据",
  "工程基础",
  "测试方法",
  "可观测性",
  "被测对象",
  "安全",
  "稳定性",
  "供应链",
  "证据边界",
  "发布决策",
  "轨迹评估",
  "本项目机制",
  "逐页术语"
];
