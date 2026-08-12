import type { TutorialBlock } from "../course.ts";

/**
 * 通用深度层渲染器。
 *
 * 它**不产生任何内容**——所有句子都必须由调用方逐页提供。它只负责把逐页数据
 * 渲染成固定的块结构，从而满足
 * `career-ai-course-factory/references/page-depth-and-projection-fidelity-contract.md`
 * 的可机器校验要求。
 *
 * ## 十段结构与它要解决的问题
 *
 * 前六段（terms / method / counter / diagnosis / drill / takeaway）解决的是
 * 「页面有没有教学深度」。实测证明它们不足以解决第二个问题：**内容正确但不可落地**。
 * 全站实测中位数显示 60/102 页正文里没有任何可判定阈值——读完知道该做什么，
 * 不知道做到什么程度算做到了。
 *
 * 后四段针对性地补这个缺口，取自两份生产级参考文档的骨架：
 *
 *   · `failure`  失效点：本页存在的理由，每条必须带可核查的数字
 *   · `archref`  架构索引：架构图的每个节点由本页哪一段负责，出口是什么工件
 *   · `metrics`  指标卡：测什么 / 硬阈值 / 复测频率
 *   · `gate`     三段式门禁：硬红线 / 统计判据 / 风险接受
 *
 * `archref` 是其中最重要的一段。此前 102 页每页都配了架构图，但图渲染在独立的
 * `architecture-card` 里，与正文零交叉引用——图是插图，不是骨架。`archref` 强制
 * 每个图节点声明它对应正文的哪一段、产出什么工件，并由门禁校验节点名必须真实
 * 存在于该页 `architecture.nodes`，使「看图」和「读正文」成为同一件事。
 *
 * 与已退役的 `topic-page.ts` 的关键区别：那个模板自带散文，因此十页读起来一样；
 * 这里的每一句话都来自 `DeepPageContent`，渲染器本身不写教学句。
 */
export type DeepTable = { headers: string[]; rows: string[][]; caption: string };

export type DeepPageContent = {
  /**
   * 失效点：不写「本页介绍 X」，写「不做 X 会得到什么错误结论」。
   * 每行第二列必须含可核查的数字，否则门禁判为「正确的废话」。
   */
  failure?: { title: string; intro: [string, string]; table: DeepTable };
  /** 术语前置：本页判断真正依赖的词 */
  terms: { title: string; intro: string; rows: [string, string][] };
  /**
   * 架构索引：把本页架构图的节点逐个映射到正文段落与出口工件。
   * 第一列的节点名必须逐字出现在该页 `architecture.nodes` 中。
   */
  archref?: { title: string; intro: [string, string]; table: DeepTable };
  /** 核心判断表 */
  method: { title: string; intro: [string, string]; table: DeepTable };
  /**
   * 指标卡：本页方法的验收口径。
   * 「关键指标」列必须写成可判定阈值（含 ≥ ≤ 数字 % 分位或统计量），不能写「良好」「合理」。
   */
  metrics?: { title: string; intro: [string, string]; table: DeepTable };
  /** 反例：看起来对但不成立 */
  counter: { title: string; intro: [string, string]; table: DeepTable };
  /** 诊断树 */
  diagnosis: { title: string; intro: [string, string]; table: DeepTable };
  /** 演练：可运行命令或手工步骤 */
  drill: {
    title: string;
    intro: string;
    steps: [string, string, string, ...string[]];
    expected: string;
    warning?: string;
  };
  /**
   * 三段式门禁：取代「通过率 ≥ X 就放行」的布尔判断。
   * redline 任一条不满足即阻断；statistical 看置信区间不看点估计；
   * acceptance 不是通过/失败，是由具名角色签字的明示决策。
   */
  gate?: {
    title: string;
    intro: [string, string];
    redline: [string, string, ...string[]];
    statistical: [string, string, ...string[]];
    acceptance: [string, string, ...string[]];
  };
  /** 带走物 */
  takeaway: { title: string; note: [string, string]; bullets: [string, string, string] };
};

const GATE_STAGE_LABEL = {
  redline: "第一段 · 硬红线（任一条不满足即阻断，无例外）",
  statistical: "第二段 · 统计门禁（看置信区间，不看点估计）",
  acceptance: "第三段 · 风险接受（不是通过/失败，是具名决策）",
} as const;

const renderGate = (gate: NonNullable<DeepPageContent["gate"]>): TutorialBlock => ({
  title: gate.title,
  body: [gate.intro[0], gate.intro[1]],
  table: {
    headers: ["门禁段", "判据", "不满足时的处置"],
    rows: [
      ...gate.redline.map((item) => [GATE_STAGE_LABEL.redline, item, "阻断发布，不进入后续两段"]),
      ...gate.statistical.map((item) => [GATE_STAGE_LABEL.statistical, item, "样本量不足时结论为「证据不足」，不是「通过」"]),
      ...gate.acceptance.map((item) => [GATE_STAGE_LABEL.acceptance, item, "由具名 owner 签字接受剩余风险后放行"]),
    ],
    caption: "三段顺序执行：红线不过不看统计，统计不过不进风险接受。第三段永远需要人，不能由脚本代签。",
  },
});

export const renderDeepBlocks = (content: DeepPageContent): TutorialBlock[] => [
  ...(content.failure
    ? [{
        title: content.failure.title,
        body: [content.failure.intro[0], content.failure.intro[1]],
        table: content.failure.table,
      }]
    : []),
  {
    title: content.terms.title,
    body: [content.terms.intro],
    table: {
      headers: ["术语", "一句话解释"],
      rows: content.terms.rows.map((row) => [...row]),
      caption: "更完整的中英对照与易混辨析见方法论 02 术语表；这里只收本页判断真正依赖的几个。",
    },
  },
  ...(content.archref
    ? [{
        title: content.archref.title,
        body: [content.archref.intro[0], content.archref.intro[1]],
        table: content.archref.table,
      }]
    : []),
  {
    title: content.method.title,
    body: [content.method.intro[0], content.method.intro[1]],
    table: content.method.table,
  },
  ...(content.metrics
    ? [{
        title: content.metrics.title,
        body: [content.metrics.intro[0], content.metrics.intro[1]],
        table: content.metrics.table,
      }]
    : []),
  {
    title: content.counter.title,
    body: [content.counter.intro[0], content.counter.intro[1]],
    table: content.counter.table,
  },
  {
    title: content.diagnosis.title,
    body: [content.diagnosis.intro[0], content.diagnosis.intro[1]],
    table: content.diagnosis.table,
  },
  {
    title: content.drill.title,
    body: [content.drill.intro],
    bullets: content.drill.steps,
    expected: content.drill.expected,
    ...(content.drill.warning ? { warning: content.drill.warning } : {}),
  },
  ...(content.gate ? [renderGate(content.gate)] : []),
  {
    title: content.takeaway.title,
    body: [content.takeaway.note[0], content.takeaway.note[1]],
    bullets: content.takeaway.bullets,
  },
];
