import type { TutorialBlock } from "../course.ts";

/**
 * 通用深度层渲染器。
 *
 * 它**不产生任何内容**——所有句子都必须由调用方逐页提供。它只负责把逐页数据
 * 渲染成固定的块结构，从而满足
 * `career-ai-course-factory/references/page-depth-and-projection-fidelity-contract.md`
 * 的可机器校验要求：
 *
 *   · 术语前置（首次出现的术语各一句话）
 *   · ≥ 1 张判断表
 *   · ≥ 2 个反例，且说明「为什么它看起来是对的」
 *   · ≥ 4 行症状 → 层 → 下一步的诊断树
 *   · 一次可执行或可手工完成的演练
 *   · 页面专属的带走物
 *
 * 与已退役的 `topic-page.ts` 的关键区别：那个模板自带散文，因此十页读起来一样；
 * 这里的每一句话都来自 `DeepPageContent`，渲染器本身不写教学句。
 */
export type DeepTable = { headers: string[]; rows: string[][]; caption: string };

export type DeepPageContent = {
  /** 术语前置：本页判断真正依赖的词 */
  terms: { title: string; intro: string; rows: [string, string][] };
  /** 核心判断表 */
  method: { title: string; intro: [string, string]; table: DeepTable };
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
  /** 带走物 */
  takeaway: { title: string; note: [string, string]; bullets: [string, string, string] };
};

export const renderDeepBlocks = (content: DeepPageContent): TutorialBlock[] => [
  {
    title: content.terms.title,
    body: [content.terms.intro],
    table: {
      headers: ["术语", "一句话解释"],
      rows: content.terms.rows.map((row) => [...row]),
      caption: "更完整的中英对照与易混辨析见方法论 02 术语表；这里只收本页判断真正依赖的几个。",
    },
  },
  {
    title: content.method.title,
    body: [content.method.intro[0], content.method.intro[1]],
    table: content.method.table,
  },
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
  {
    title: content.takeaway.title,
    body: [content.takeaway.note[0], content.takeaway.note[1]],
    bullets: content.takeaway.bullets,
  },
];
