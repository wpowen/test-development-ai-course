/**
 * 校验「内容源写了」是否真的等于「页面上渲染了」。
 *
 * ## 它拦的是什么
 *
 * 仓库根目录的 `scripts/validate-deep-sources.py` 与 `scripts/validate-references.py`
 * 检查的都是**内容源**：JSON 里写没写、写得够不够、引用存不存在。两者都通过，
 * 仍然可能有一整页的内容渲染在任何地方都看不到——因为投影没有被页面消费。
 *
 * 这不是假想。TD-F01 是全站访问量最高的入口页，它的失效点、架构索引、指标卡与
 * 三段式门禁四段一直写在 `_sources/requirements-lifecycle-supplement.json` 里，
 * 也一直通过可落地性校验；但那一页的正文是手写模块，从未调用
 * `requirementsLifecycleSupplement()`，于是那四段从来没有出现在页面上。
 * 缺口存在了很久，没有任何门禁会报告它——因为没有门禁站在「渲染结果」这一侧。
 *
 * 这个校验器补的就是这一侧：它读站点真正渲染时用的 `course.ts` 与 `references.ts`，
 * 三条判据全部作用在最终产物上，而不是作用在内容源上。
 *
 * 用法：
 *     node scripts/validate-reference-projection.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "../content/course.ts";
import { references, referencesByPage, resolveReferences } from "../content/references.ts";

/** 与 `scripts/validate-references.py` 的 MIN_REFS_PER_PAGE 保持一致。 */
const MIN_REFERENCES_PER_PAGE = 3;

const problems: string[] = [];

/**
 * 孤儿检查：内容源里写了一页，但公开页面里没有这个 id。
 *
 * 这是 TD-F01 缺口的另一种形态。TD-F01 的 id 是对的、只是没接线，靠「正文有没有依据标记」
 * 能查出来；但如果内容源里的 id 本身就拼错了（或页面被下线而内容源忘了删），那一页的内容
 * 同样渲染不到任何地方，而正文检查看不见它——因为根本没有对应的页面可检查。
 *
 * 两个方向都要查：内容源有而页面没有（内容白写了），页面有而内容源没有（这一页没有深度层）。
 */
const sourceDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), "../../methodology/dimensions/_sources",
);
const sourcePageIds = new Map<string, string>();
for (const file of readdirSync(sourceDir).filter((name) => name.endsWith(".json"))) {
  const content = JSON.parse(readFileSync(path.join(sourceDir, file), "utf8")) as Record<string, unknown>;
  for (const pageId of Object.keys(content)) {
    const seen = sourcePageIds.get(pageId);
    if (seen) {
      problems.push(`${pageId}: 同时出现在 ${seen} 与 ${file} 两个内容源里，投影结果不确定`);
    }
    sourcePageIds.set(pageId, file);
  }
}
const publishedIds = new Set(pages.map((page) => page.id));
for (const [pageId, file] of sourcePageIds) {
  if (!publishedIds.has(pageId)) {
    problems.push(`${pageId}（来自 ${file}）: 内容源里写了这一页，但公开页面里没有这个 id——内容渲染不到任何地方`);
  }
}
for (const pageId of publishedIds) {
  if (!sourcePageIds.has(pageId)) {
    problems.push(`${pageId}: 公开页面没有对应的内容源，深度层与引用层都不会生效`);
  }
}

for (const page of pages) {
  const ordered: string[] = [];
  const push = (id: string) => {
    if (references[id] && !ordered.includes(id)) ordered.push(id);
  };
  page.blocks.forEach((block) => block.refs?.forEach(push));
  (page.references ?? referencesByPage[page.id] ?? []).forEach(push);
  const resolved = resolveReferences(ordered);

  // 判据一：页尾来源清单不能为空。空表示这一页对读者没有任何可核对的出处。
  if (resolved.length === 0) {
    problems.push(`${page.id}: 页尾没有任何来源，读者无法核对本页结论`);
  } else if (resolved.length < MIN_REFERENCES_PER_PAGE) {
    problems.push(
      `${page.id}: 页尾只有 ${resolved.length} 条来源，至少 ${MIN_REFERENCES_PER_PAGE} 条`,
    );
  }

  // 判据二：正文里必须至少有一块携带 refs。
  //
  // 这一条专门拦 TD-F01 那一类缺口：内容源写了 refs，但页面没有把深度层块组合进来，
  // 于是 refs 只存在于 JSON 里。页尾清单会因为 referencesByPage 兜底而看起来正常，
  // 因此只有检查正文块才能发现投影断裂。
  const blocksWithRefs = page.blocks.filter((block) => (block.refs?.length ?? 0) > 0);
  if (blocksWithRefs.length === 0) {
    problems.push(
      `${page.id}: 正文没有任何一块携带依据标记——内容源的 refs 没有被投影进页面，` +
      `检查这一页有没有调用对应的 deep/supplement 渲染函数`,
    );
  }

  // 判据三：正文引用的每个 ID 都必须能解析。
  // 渲染层对未知 ID 是静默丢弃的，因此这里不报错就等于读者少看到一条依据而无人知晓。
  for (const block of page.blocks) {
    for (const id of block.refs ?? []) {
      if (!references[id]) {
        problems.push(`${page.id}「${block.title.slice(0, 20)}」: 引用了无法解析的 ${id}`);
      }
    }
  }
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  console.error(`\n${problems.length} 处投影问题。`);
  process.exit(1);
}

const totalCards = pages.reduce((sum, page) => {
  const ids = new Set<string>();
  page.blocks.forEach((block) => block.refs?.forEach((id) => ids.add(id)));
  (page.references ?? referencesByPage[page.id] ?? []).forEach((id) => ids.add(id));
  return sum + resolveReferences([...ids]).length;
}, 0);

console.log(
  `引用投影校验通过：内容源 ${sourcePageIds.size} 页与公开 ${pages.length} 页一一对应，` +
  `全部渲染出来源，合计 ${totalCards} 张引用卡，每页正文均带依据标记。`,
);
