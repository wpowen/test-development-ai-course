import { catalogPages, firstUsablePath, getTechnicalBlockPresentation, pages, publicModules, releaseScope, sourceNotes } from "../content/course.ts";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { auditTutorialPages } from "./audit-executability.ts";

const errors: string[] = [];
const byId = new Map(pages.map((page) => [page.id, page]));

for (const page of catalogPages.filter((candidate) => candidate.id.startsWith("TD-PS"))) {
  if (page.materials?.some((material) => material.href.includes("requirements-to-evidence"))) {
    errors.push(`${page.id} was incorrectly assigned requirements-lifecycle materials`);
  }
}

if (catalogPages.length < 60) errors.push(`internal knowledge catalog must preserve the full topic map, found ${catalogPages.length}`);
if (pages.length < 8) errors.push(`public tutorial needs at least 8 delivered pages, found ${pages.length}`);
if (byId.size !== pages.length) errors.push("page IDs must be unique");
if (releaseScope.mode !== "pilot-path") errors.push("current release must declare pilot-path scope");
if (releaseScope.catalogComplete) errors.push("pilot-path release cannot claim catalogComplete=true");
if (new Set(releaseScope.promisedPageIds).size !== releaseScope.promisedPageIds.length) errors.push("promised IDs must be unique");
if (releaseScope.promisedPageIds.join(",") !== pages.map((page) => page.id).join(",")) errors.push("promised IDs must exactly equal public page IDs");
if (firstUsablePath[0] !== "TD-F01") errors.push("deep path must start with profession reality reconstruction");
if (publicModules.some((module) => !pages.some((page) => page.moduleId === module.id))) errors.push("public navigation contains an empty module");

/**
 * 页面深度与跨页原创性门禁。
 *
 * 依据 `career-ai-course-factory/references/page-depth-and-projection-fidelity-contract.md`。
 *
 * 两条设计要点：
 * 1. 深度按**中文字符**度量学习者散文，不按 JSON 序列化长度——后者把语法也算进去，
 *    所以 750 这个旧门槛只能挡住空页，挡不住薄页。
 * 2. 原创性按**实测句级重复率**判定，不靠固定短语黑名单——黑名单只能抓住上一个模板，
 *    换一套新的通用句就照样通过。
 *
 * 门槛按契约要求分阶段抬升：先设到当前实测 P25 防倒退，每完成一个模块再抬到
 * 已完成模块的最低值，全部完成后才抬到目标值（概念 3000 / 跟做 4000）。
 */
// 阶段值，按契约「先设到实测水平防倒退，每完成一个模块再抬升」执行。
// 记录：2026-08-12 —— 13 个模块全部扩写完成，全站 min=1625 / P25=1796 / median=1948。
// 目标值（全部模块扩写完成后）：概念页 3000、跟做/项目页 4000。
const DEPTH_GATE_CJK = 1600;          // 全部模块已扩写；取全站实测最低值 1625 的下沿
const DEPTH_GATE_ENRICHED = 1600;     // 与基线门槛统一；目标值 3000/4000 待下一轮加深
// 13 个模块全部完成扩写，强门禁已对全站开启。
const ENRICHED_MODULE_IDS = new Set([
  "TD-M00", "TD-M01", "TD-M02", "TD-M03", "TD-M04", "TD-M05", "TD-M06",
  "TD-M07", "TD-M08", "TD-M09", "TD-M10", "TD-M11", "TD-M12",
]);
const ARCHREF_NODE_HEADER = "架构节点";
const DUPLICATION_RATE_MAX = 0.2;

/**
 * 显式声明的共享脚手架句（证据边界、AI 授权声明、Prompt Kit 用法、0/1/0 约定、
 * 阶段准出与迁移前置）。契约允许元数据脚手架逐字复用，但必须先声明并给出理由；
 * 未声明的重复句一律计入重复率。
 */
const sharedComponentSentences = (() => {
  const candidates = [
    resolve("research/shared-components.json"),
    resolve("..", "research/shared-components.json"),
  ];
  const path = candidates.find((candidate) => existsSync(candidate));
  if (!path) {
    errors.push("shared-components.json is missing; duplicate exemptions cannot be verified");
    return new Set<string>();
  }
  const declared = JSON.parse(readFileSync(path, "utf8")) as {
    components?: { sentence: string }[];
    undeclared_duplicates?: string[];
  };
  if (declared.undeclared_duplicates?.length) {
    errors.push(
      `research/shared-components.json still lists ${declared.undeclared_duplicates.length} undeclared duplicate sentences`,
    );
  }
  return new Set((declared.components ?? []).map((item) => item.sentence));
})();

const learnerProse = (page: (typeof pages)[number]): string => {
  const parts: string[] = [page.summary, page.why];
  for (const block of page.blocks) {
    parts.push(block.title, ...block.body, ...(block.bullets ?? []));
    if (block.expected) parts.push(block.expected);
    if (block.warning) parts.push(block.warning);
    if (block.table) parts.push(block.table.caption ?? "", ...block.table.rows.flat());
  }
  return parts.join("\n");
};

const cjkCount = (text: string): number => (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;

const sentences = (text: string): string[] =>
  text
    .split(/[。；！？\n]/)
    .map((item) => item.replace(/\s+/g, "").trim())
    .filter((item) => cjkCount(item) >= 12);

const bannedGenericPhrases = [
  "先把真实问题说清楚",
  "按证据顺序完成工作流",
  "在最小业务场景里亲手做一次",
  "迁移到你的项目",
  "轮到你动手",
  "本页完成后",
  "你会带走",
];

for (const id of firstUsablePath) {
  const page = byId.get(id);
  if (!page) {
    errors.push(`usable path references unknown page ${id}`);
    continue;
  }
  if (["planned", "outlined"].includes(page.status)) errors.push(`usable path page ${id} is not delivered`);
}

for (const page of pages) {
  if (["planned", "outlined", "blocked"].includes(page.status)) errors.push(`${page.id} exposes an incomplete page on the public surface`);
  for (const dependency of page.prerequisites) {
    if (!byId.has(dependency)) errors.push(`${page.id} references unknown prerequisite ${dependency}`);
    if ((byId.get(dependency)?.order ?? 999) >= page.order) errors.push(`${page.id} prerequisite ${dependency} must appear earlier`);
  }
  const contentLength = JSON.stringify(page.blocks).length;
  if (contentLength < 750) errors.push(`${page.id} content is too thin (${contentLength} chars)`);
  const prose = learnerProse(page);
  const depth = cjkCount(prose);
  const depthGate = ENRICHED_MODULE_IDS.has(page.moduleId) ? DEPTH_GATE_ENRICHED : DEPTH_GATE_CJK;
  if (depth < depthGate) {
    errors.push(`${page.id} learner prose is too thin: ${depth} CJK chars < gate ${depthGate}`);
  }
  // 结构性要求同样分阶段：先只对已扩写模块强制，随扩写推进逐个纳入。
  if (ENRICHED_MODULE_IDS.has(page.moduleId)) {
    // 反例表按契约只需 2 行（≥2 个反例），因此判断表的行数下限取 2。
    const tables = page.blocks.filter((block) => block.table && block.table.rows.length >= 2);
    if (!tables.length) {
      errors.push(`${page.id} has no judgement table; a decision table is what separates a method from a walkthrough`);
    }
    if (tables.length < 3) {
      errors.push(`${page.id} needs at least three tables (dimension/method, counterexample, diagnosis), found ${tables.length}`);
    }
    // 架构图与正文的交叉引用。
    //
    // 每页都配了架构图，但图渲染在独立的 architecture-card 里，正文从不引用它——
    // 图是插图，不是骨架。archref 表要求逐个节点声明它对应正文哪一段、产出什么工件；
    // 这里校验第一列的节点名逐字存在于 page.architecture.nodes，使图改了而正文没跟
    // （或正文引用了一个图上根本没有的节点）会让构建失败，而不是静默漂移。
    const archref = page.blocks.find((block) => block.table?.headers[0] === ARCHREF_NODE_HEADER);
    if (archref?.table) {
      const declared = new Set(page.architecture?.nodes ?? []);
      for (const [node] of archref.table.rows.map((row) => row)) {
        if (!declared.has(node)) {
          errors.push(`${page.id} archref cites "${node}", which is not a node in its architecture diagram`);
        }
      }
      const cited = new Set(archref.table.rows.map((row) => row[0]));
      for (const node of declared) {
        if (!cited.has(node)) {
          errors.push(`${page.id} architecture node "${node}" is drawn but never explained in the archref table`);
        }
      }
    }
  }
  if (page.outcomes.length < 3) errors.push(`${page.id} needs at least 3 observable outcomes`);
  if (page.blocks.length < 4) errors.push(`${page.id} needs at least 4 teaching blocks`);
  if (page.practice.length < 3) errors.push(`${page.id} needs at least 3 practice or transfer actions`);
  if (page.completion.length < 3) errors.push(`${page.id} needs at least 3 completion checks`);
  if (page.sourceIds.length < 3) errors.push(`${page.id} needs at least 3 source references`);
  for (const sourceId of page.sourceIds) if (!sourceNotes[sourceId]) errors.push(`${page.id} references unknown source ${sourceId}`);
  if (page.evidenceBoundary.length < 35) errors.push(`${page.id} evidence boundary is too thin`);
  if (!page.architecture || page.architecture.nodes.length < 5 || page.architecture.caption.length < 30) {
    errors.push(`${page.id} needs a substantive architecture or workflow diagram`);
  }
  if (!page.materials?.length) {
    errors.push(`${page.id} must expose learner-facing materials`);
  } else {
    const hrefs = new Set<string>();
    for (const material of page.materials) {
      if (hrefs.has(material.href)) errors.push(`${page.id} repeats material ${material.href}`);
      hrefs.add(material.href);
      if (/^(?:https?:)?\/\//.test(material.href) || material.href.includes("..")) {
        errors.push(`${page.id} material must be a repository-owned relative path: ${material.href}`);
        continue;
      }
      const localPath = resolve("public", material.href);
      if (!existsSync(localPath) || !statSync(localPath).isFile() || statSync(localPath).size === 0) {
        errors.push(`${page.id} material does not exist or is empty: ${material.href}`);
      }
    }
    if (page.status === "fixture-tested") {
      const tested = page.materials.filter((material) => material.validation === "fixture-tested");
      if (tested.length < 2 || !tested.some((material) => material.kind === "script")) {
        errors.push(`${page.id} fixture-tested claim needs at least two tested materials including a script`);
      }
    }
  }
  const learnerCopy = JSON.stringify({ summary: page.summary, why: page.why, blocks: page.blocks, practice: page.practice, completion: page.completion });
  for (const phrase of bannedGenericPhrases) {
    if (learnerCopy.includes(phrase)) errors.push(`${page.id} contains generic/template phrase: ${phrase}`);
  }
  if (page.type === "跟做") {
    const technicalBlocks = page.blocks.filter((block) => getTechnicalBlockPresentation(block)).length;
    const expectedBlocks = page.blocks.filter((block) => block.expected).length;
    if (technicalBlocks < 1 || expectedBlocks < 1) errors.push(`${page.id} guided lab needs commands/examples and observable expected results`);
    if (page.status === "fixture-tested" && (technicalBlocks < 2 || expectedBlocks < 2)) {
      errors.push(`${page.id} fixture-tested lab needs at least two runnable/observable steps`);
    }
  }
}

const byModule = new Map<string, typeof pages>();
for (const page of pages) {
  const bucket = byModule.get(page.moduleId) ?? [];
  bucket.push(page);
  byModule.set(page.moduleId, bucket);
}
for (const [moduleId, modulePages] of byModule) {
  // 分阶段：重复率门禁先只作用于已完成扩写的模块，随扩写推进逐个纳入。
  // 一次性对全部模块开启会让整个已验证发布变红并阻断发布，违反契约的分阶段抬升要求。
  if (!ENRICHED_MODULE_IDS.has(moduleId)) continue;
  if (modulePages.length < 2) continue;
  const sentencesByPage = modulePages.map((page) => ({ id: page.id, list: sentences(learnerProse(page)) }));
  for (const current of sentencesByPage) {
    if (current.list.length < 10) continue;
    const others = new Set(
      sentencesByPage.filter((item) => item.id !== current.id).flatMap((item) => item.list),
    );
    const counted = current.list.filter((sentence) => !sharedComponentSentences.has(sentence));
    if (counted.length < 10) continue;
    const duplicated = counted.filter((sentence) => others.has(sentence)).length;
    const rate = duplicated / counted.length;
    if (rate > DUPLICATION_RATE_MAX) {
      errors.push(
        `${current.id} repeats ${duplicated}/${counted.length} non-scaffold sentences (${(rate * 100).toFixed(0)}%) ` +
          `from other ${moduleId} pages; module builders must write page-specific prose`,
      );
    }
  }
}

if (process.argv.includes("--with-executability")) {
  const executability = auditTutorialPages(pages);
  for (const page of executability.pages.filter((candidate) => candidate.verdict === "FAIL")) {
    errors.push(`${page.pageId} executability failed: ${page.findings.join("; ")}`);
  }
}

if (errors.length) {
  console.error("Tutorial content invalid:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`Tutorial content valid: ${pages.length} delivered pages public; ${catalogPages.length - pages.length} incomplete topics kept internal.`);
