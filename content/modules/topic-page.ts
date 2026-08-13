import type { TutorialPage } from "../course.ts";

/**
 * 已退役的通用页面模板。
 *
 * 它曾经用一套共享散文把短 spec 展开成六个块，产生的正是
 * `page-depth-and-projection-fidelity-contract.md` 禁止的同质化页面，
 * 并且写入 fail-closed 的 legacy `code` 字段。
 *
 * 保留这个文件只是为了让误用立即失败：死模板是缺陷，因为下一位作者会捡起它。
 * 新页面必须由各模块自己的 builder 生成，并逐页写判断表、反例与诊断树。
 */

export type TopicSpec = never;

export const buildTopicPage = (): TutorialPage => {
  throw new Error(
    "buildTopicPage 已退役：通用散文模板会产生同质化页面。" +
      "请在模块自己的 builder 中逐页编写判断表、反例与失败诊断树，" +
      "并按 page-depth-and-projection-fidelity-contract.md 记录投影台账。",
  );
};
