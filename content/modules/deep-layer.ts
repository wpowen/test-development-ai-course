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
   * 能力革新：这项传统测试能力在 AI 系统上发生了什么变化。
   *
   * 传统专项模块最容易写成「把传统测试原样搬进来，再在场景里提一句 AI」——
   * 那样读者学到的是两套并列的东西，而不是一套演进后的能力。这一段强制回答三件事：
   * 原来怎么做、在 AI 系统里为什么不够用、融合之后怎么做。
   *
   * `invariant` 同样是强制的，它防止走向另一个极端：不是所有传统功夫都过时了，
   * 恰恰相反，多数 AI 质量问题最终仍然落在这些地基上。
   */
  evolution?: {
    title: string;
    intro: [string, string];
    table: DeepTable;
    invariantTitle: string;
    invariant: [string, string, ...string[]];
  };
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

/**
 * 门禁表按「段」出一行，不按「条」出一行。
 *
 * 初版每条判据占一行，于是三个段标题与三条处置说明在同一页内重复 N 次、
 * 在模块内重复 N × 页数 次，直接把跨页句级重复率推到 21%，被原创性门禁拦下。
 * 那次拦截是对的：重复的是脚手架而非判断，读者每读一页就要跳过一遍相同的列。
 * 现在三段各占一行，判据用换行分隔——重复量降到每页 6 句，且表更短更好读。
 */
const renderGate = (gate: NonNullable<DeepPageContent["gate"]>): TutorialBlock => ({
  title: gate.title,
  body: [gate.intro[0], gate.intro[1]],
  table: {
    headers: ["门禁段", "判据", "不满足时的处置"],
    rows: [
      [GATE_STAGE_LABEL.redline, gate.redline.join("\n"), "阻断发布，不进入后续两段"],
      [GATE_STAGE_LABEL.statistical, gate.statistical.join("\n"), "样本量不足时结论为「证据不足」，不是「通过」"],
      [GATE_STAGE_LABEL.acceptance, gate.acceptance.join("\n"), "由具名 owner 签字接受剩余风险后放行"],
    ],
    caption: "三段顺序执行：红线不过不看统计，统计不过不进风险接受。第三段永远需要人，不能由脚本代签。",
  },
});

/**
 * 深度层分成 head 与 tail 两截，中间留给页面自身的块（实验 Manifest、Prompt 包、
 * 可运行命令等物料）。
 *
 * 早期版本把深度层整体追加在页面块之后，结果是：架构图卡片渲染在全部正文之前，
 * 而解释这张图的 `archref` 落在第 9 块，中间隔着六块别的内容——图和它的说明被拆散，
 * 读者依旧把图当插图。同样，`failure` 回答的是「这一页为什么存在」，出现在页面中部
 * 时这个问题已经不必回答了。
 *
 * 现在的顺序是：
 *   head  失效点 → 术语 → 架构索引 → 方法判断表 → 指标卡
 *   （页面自身的物料、Prompt、命令、实验说明）
 *   tail  反例 → 诊断树 → 演练 → 三段式门禁 → 带走物
 */
export type DeepBlocks = { head: TutorialBlock[]; tail: TutorialBlock[] };

export const EMPTY_DEEP_BLOCKS: DeepBlocks = { head: [], tail: [] };

export const renderDeepBlocks = (content: DeepPageContent): DeepBlocks => ({
  head: [
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
    ...(content.evolution
      ? [
          {
            title: content.evolution.title,
            body: [content.evolution.intro[0], content.evolution.intro[1]],
            table: content.evolution.table,
          },
          {
            title: content.evolution.invariantTitle,
            body: ["下面这些不因为被测对象换成 AI 系统而失效。它们是上面那张表里「融合后的新做法」能够成立的前提——地基塌了，新做法只是换了个说法的空话。"],
            bullets: content.evolution.invariant,
          },
        ]
      : []),
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
  ],
  tail: [
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
  ],
});

/**
 * 只补四段的轻量补充层。
 *
 * TD-M00、TD-M12 与 TD-FP01 的正文是逐页手写的 TypeScript，不走内容源投影，
 * 而且它们本来就是全站最厚的几个模块——把已经写好的方法、反例、诊断、演练
 * 重写一遍进 JSON，收益是零。
 *
 * 但它们同样缺失失效点、架构索引、指标卡与三段式门禁这四段，也就同样躲开了
 * 可落地性门禁。这个类型让它们以最小代价接入同一套校验：内容源里只写四段，
 * 其余部分继续由页面自己的块承担。
 */
export type DeepSupplement = Pick<DeepPageContent, "failure" | "archref" | "metrics" | "gate">;

export const renderSupplement = (content: DeepSupplement): DeepBlocks => ({
  head: [
    ...(content.failure
      ? [{
          title: content.failure.title,
          body: [content.failure.intro[0], content.failure.intro[1]],
          table: content.failure.table,
        }]
      : []),
    ...(content.archref
      ? [{
          title: content.archref.title,
          body: [content.archref.intro[0], content.archref.intro[1]],
          table: content.archref.table,
        }]
      : []),
    ...(content.metrics
      ? [{
          title: content.metrics.title,
          body: [content.metrics.intro[0], content.metrics.intro[1]],
          table: content.metrics.table,
        }]
      : []),
  ],
  tail: content.gate ? [renderGate(content.gate)] : [],
});

/**
 * 把页面自身的块夹在深度层的 head 与 tail 之间。
 *
 * 一个模块文件通常托管来自多个内容源的页面，因此这里接受任意多个解析结果；
 * 对某一页而言只有一个是非空的，其余返回 EMPTY_DEEP_BLOCKS。
 */
export const composeDeepPage = (
  pageBlocks: TutorialBlock[],
  ...deep: DeepBlocks[]
): TutorialBlock[] => [
  ...deep.flatMap((item) => item.head),
  ...pageBlocks,
  ...deep.flatMap((item) => item.tail),
];
