#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const root = resolve(dirname(scriptPath), "..");

const pageType = {
  概念: "concept",
  跟做: "guided-lab",
  诊断: "diagnostic",
  参考: "reference",
  项目: "project",
};

const generatedFileNames = [
  "tutorial-site.json",
  "fidelity-manifest.json",
  "course-tree.md",
  "README.md",
  "index.html",
];

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function hashFile(path) {
  const bytes = await readFile(path);
  return { sha256: sha256(bytes), size: bytes.byteLength };
}

async function listMaterialFiles(path, materialRoot) {
  const metadata = await lstat(path);
  if (metadata.isSymbolicLink()) throw new Error(`material path must not be a symbolic link: ${path}`);
  if (metadata.isFile()) {
    const digest = await hashFile(path);
    return [{ path: relative(materialRoot, path).split(sep).join("/"), ...digest }];
  }
  if (!metadata.isDirectory()) throw new Error(`material path is neither file nor directory: ${path}`);

  const entries = await readdir(path, { withFileTypes: true });
  const nested = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    nested.push(...await listMaterialFiles(resolve(path, entry.name), materialRoot));
  }
  return nested;
}

function resolveMaterialPath(materialRoot, href) {
  const cleanHref = href.split(/[?#]/, 1)[0].replace(/^\/+/, "");
  const path = resolve(materialRoot, cleanHref);
  const rootPrefix = `${resolve(materialRoot)}${sep}`;
  if (path !== resolve(materialRoot) && !path.startsWith(rootPrefix)) {
    throw new Error(`material href escapes public root: ${href}`);
  }
  return path;
}

async function hashMaterials(materials, materialRoot) {
  const entries = [];
  for (const material of materials ?? []) {
    if (!material?.href || typeof material.href !== "string") throw new Error("material href must be a non-empty string");
    const path = resolveMaterialPath(materialRoot, material.href);
    if (!await pathExists(path)) throw new Error(`referenced material does not exist: ${material.href}`);
    entries.push({
      href: material.href,
      descriptor_hash: sha256(stableJson(material)),
      files: await listMaterialFiles(path, materialRoot),
    });
  }
  return {
    hash: sha256(stableJson(entries)),
    entries,
  };
}

function legacyContentSections(page, getTechnicalBlockPresentation) {
  const firstCode = page.blocks.find((block) => block.code)?.code;
  const firstExpected = page.blocks.find((block) => block.expected)?.expected;
  const warnings = page.blocks.flatMap((block) => block.warning ? [block.warning] : []);
  const technicalPresentations = page.blocks.flatMap((block, blockIndex) => {
    const presentation = getTechnicalBlockPresentation?.(block);
    return presentation ? [{ block_index: blockIndex, ...clone(presentation) }] : [];
  });
  return {
    outcome: page.outcomes.join("；"),
    professional_relevance: page.why,
    plain_explanation: page.blocks[0]?.body.join("\n") ?? page.summary,
    smallest_example: firstCode ?? page.blocks[1]?.body.join("\n") ?? page.summary,
    learner_action: page.practice.join("；"),
    expected_result: firstExpected ?? page.completion.join("；"),
    common_errors: warnings.join("；") || "按页面完成检查逐项复核；没有证据时不得把推断当成通过。",
    completion_check: page.completion.join("；"),
    evidence_boundary: page.evidenceBoundary,
    teaching_blocks: clone(page.blocks),
    technical_presentations: technicalPresentations,
    learner_actions: clone(page.practice),
    completion_checks: clone(page.completion),
  };
}

function buildTree(pages, publicModules, releaseScope) {
  return [
    "# 测试开发 × AI 课程树",
    "",
    "## 学习路线",
    "",
    "从传统测试生命周期开始，依次进入大模型基础、AI 辅助测试、AI 系统评测、Agent/Workflow、质量工程、Benchmark 和 Capstone。页面顺序由前置依赖决定。",
    "",
    "## 模块",
    "",
    ...publicModules.flatMap((module) => [
      `### ${module.title}`,
      "",
      module.subtitle,
      "",
      ...pages.filter((page) => page.moduleId === module.id).map((page) => `- ${page.id} · ${page.title} · ${page.status}`),
      "",
    ]),
    "## 页面状态",
    "",
    `- 发布范围：\`${releaseScope.mode}\`。`,
    `- 同步页面：${pages.length} 页。`,
    `- 深度正文状态：${pages.filter((page) => ["desk-researched", "fixture-tested"].includes(page.status)).length}/${pages.length} 页。`,
    "- `desk-researched` 表示正文和来源已整理，但没有运行目标系统。",
    "- `fixture-tested` 表示对应离线夹具已经运行，不代表生产效果。",
    "- 内容完成度与证据等级分开记录，不因正文完整而升级证据状态。",
    "",
  ].join("\n");
}

function buildReadme(pages, releaseScope) {
  const statusCounts = Object.fromEntries(
    [...new Set(pages.map((page) => page.status))]
      .sort()
      .map((status) => [status, pages.filter((page) => page.status === status).length]),
  );
  const statusSummary = Object.entries(statusCounts).map(([status, count]) => `\`${status}\` ${count} 页`).join("、");
  return `# 测试开发 × AI 实战教程

本目录是 \`site/content/course.ts\` 当前公共页面集合的保真投影，不是独立维护的第二套课程。页面是否进入公共集合由课程门禁决定；同步成功只证明投影一致，不等于 practitioner、live 或 publication 验证通过。

## 如何学习

打开 \`index.html\`，从左侧课程树进入。每页包含学习结果、职业场景、完整教学块、表格、技术块、练习、完成检查、材料、来源和证据边界。\`tutorial-site.json\` 保留机器可读的全部教学块；\`fidelity-manifest.json\` 记录逐页源内容哈希和实际材料哈希。

不要只连续阅读。每完成一页，至少要留下页面要求的工件，并按完成检查逐项验收。跟做页中的命令是最小执行形状：如果页面明确标为离线夹具，可以直接复现；如果页面标为资料已审，则应先换成脱敏业务输入，在隔离环境中验证后再接入真实系统。遇到证据不足、越权动作或高风险分歧时，正确结果是停止并进入人工复核，而不是让模型继续猜测。

## 教程结构

课程按职业认知、需求与技术文档解读、传统测试专项、AI 基础、测试设计与自动化、RAG 与 Agent 质量、质量系统、平台集成、性能稳定性和综合交付逐层展开。每页都把职业问题、输入证据、风险与方法、独立 Oracle、版本化 Prompt、Eval、Mutation、离线运行命令、失败诊断和迁移练习连成一条链；课程树中的前置关系决定学习顺序，不能只跳到工具命令。

## 当前完成度

- 发布范围：\`${releaseScope.mode}\`
- 公共页面：${pages.length} 页
- 页面状态：${statusSummary || "无页面"}
- 承诺页面 ID：${releaseScope.promisedPageIds.length} 个
- 内部未完成命题不属于当前公共课程，不能因同步而升级状态。

历史文档中的 17 页或 52 页是旧快照，不是当前事实。当前数量必须从 \`tutorial-site.json\`、\`fidelity-manifest.json\` 和课程内容源共同读取；任何无正式 scope-change decision 的页面数减少都会被同步器拒绝。

## 保真与漂移检查

同步器完整保留每个教学 block 的所有字段，包括表格、typed technical metadata、代码、工作目录、预期结果和警告；同时保留页面材料描述与证据状态。运行 \`node scripts/sync-tutorial-package.mjs --check\` 只检查漂移，不改文件。

“课程正文完整”不等于“生产有效性已验证”。页面会分别标注资料整理、离线夹具运行和仍需人工或生产验证的边界。
`;
}

export async function createTutorialArtifacts({
  pages,
  publicModules,
  releaseScope,
  firstUsablePath,
  materialRoot,
  getTechnicalBlockPresentation,
  sourceNotes = {},
  glossary = [],
  glossaryCategories = [],
}) {
  const fidelityPages = [];
  const tutorialPages = [];

  for (const [index, page] of pages.entries()) {
    const sourceHash = sha256(stableJson(page));
    const materialResult = await hashMaterials(page.materials, materialRoot);
    tutorialPages.push({
      page_id: page.id,
      slug: page.id.toLowerCase(),
      module_id: page.moduleId,
      title: page.title,
      page_type: pageType[page.type],
      level: page.id.startsWith("TD-F") || page.id.startsWith("TD-P") ? "L1" : page.id.startsWith("TD-B") || page.id === "TD-T25" ? "L4" : "L2-L3",
      order: page.order,
      display_number: page.display_number,
      duration: page.duration,
      summary: page.summary,
      prerequisite_ids: clone(page.prerequisites),
      scenario_ids: ["TD-SYNTHETIC-COURSE"],
      learner_result: page.outcomes.join("；"),
      outcomes: clone(page.outcomes),
      artifact: page.artifact,
      keywords: [page.id, page.moduleId, page.title],
      source_status: page.status,
      evidence_status: page.status,
      delivery_status: page.status,
      updated_at: releaseScope.validatedAt,
      source_ids: clone(page.sourceIds),
      architecture: clone(page.architecture),
      materials: clone(page.materials ?? []),
      source_hash: sourceHash,
      material_hash: materialResult.hash,
      previous_page_id: index === 0 ? "" : pages[index - 1].id,
      next_page_id: index === pages.length - 1 ? "" : pages[index + 1].id,
      content_sections: legacyContentSections(page, getTechnicalBlockPresentation),
    });
    fidelityPages.push({
      page_id: page.id,
      source_hash: sourceHash,
      material_hash: materialResult.hash,
      material_entries: materialResult.entries,
    });
  }

  const tutorial = {
    tutorial_id: "test-development-ai-tutorial-v2",
    title: "测试开发 × AI 实战教程",
    audience: "希望从传统测试开发系统进阶到 AI 质量工程的学习者",
    updated_at: releaseScope.validatedAt,
    default_page_id: firstUsablePath[0] ?? pages[0]?.id ?? "",
    release_scope: {
      mode: releaseScope.mode,
      promised_page_ids: clone(releaseScope.promisedPageIds),
      catalog_complete: releaseScope.catalogComplete,
      validated_at: releaseScope.validatedAt,
    },
    modules: publicModules.map((module, index) => ({
      module_id: module.id,
      title: module.title,
      learner_result: module.subtitle,
      order: index + 1,
    })),
    pages: tutorialPages,
  };
  const fidelityManifest = {
    schema_version: "1.0",
    tutorial_id: tutorial.tutorial_id,
    generated_from: "site/content/course.ts",
    validated_at: releaseScope.validatedAt,
    page_count: pages.length,
    page_ids: pages.map((page) => page.id),
    catalog_hash: sha256(stableJson(fidelityPages.map(({ page_id, source_hash, material_hash }) => ({ page_id, source_hash, material_hash })))),
    pages: fidelityPages,
  };
  const staticCourseData = {
    firstUsablePath: clone(firstUsablePath),
    modules: clone(publicModules),
    pages: pages.map((page) => ({
      ...clone(page),
      blocks: page.blocks.map((block) => {
        const presentation = getTechnicalBlockPresentation?.(block);
        return presentation ? { ...clone(block), technicalPresentation: clone(presentation) } : clone(block);
      }),
    })),
    releaseScope: clone(releaseScope),
    sourceNotes: clone(sourceNotes),
    glossary: clone(glossary),
    glossaryCategories: clone(glossaryCategories),
  };

  return {
    tutorial,
    fidelityManifest,
    staticCourseData,
    files: {
      "tutorial-site.json": `${JSON.stringify(tutorial, null, 2)}\n`,
      "fidelity-manifest.json": `${JSON.stringify(fidelityManifest, null, 2)}\n`,
      "course-tree.md": buildTree(pages, publicModules, releaseScope),
      "README.md": buildReadme(pages, releaseScope),
    },
  };
}

async function validateScopeReduction({ previousPageIds, nextPageIds, scopeChangeDecisionPath }) {
  if (nextPageIds.length >= previousPageIds.length) return;
  if (!scopeChangeDecisionPath) {
    throw new Error(`page count decrease ${previousPageIds.length} -> ${nextPageIds.length} requires a scope-change decision via --scope-change-decision`);
  }

  let decision;
  try {
    decision = JSON.parse(await readFile(scopeChangeDecisionPath, "utf8"));
  } catch (error) {
    throw new Error(`cannot read scope-change decision: ${scopeChangeDecisionPath}: ${error.message}`);
  }
  const removedPageIds = previousPageIds.filter((id) => !nextPageIds.includes(id));
  const valid = decision.schema_version === "1.0"
    && decision.decision === "approved-page-scope-reduction"
    && decision.approved === true
    && typeof decision.approved_by === "string" && decision.approved_by.trim()
    && typeof decision.approved_at === "string" && decision.approved_at.trim()
    && typeof decision.reason === "string" && decision.reason.trim()
    && arraysEqual(decision.previous_page_ids ?? [], previousPageIds)
    && arraysEqual(decision.next_page_ids ?? [], nextPageIds)
    && arraysEqual(decision.removed_page_ids ?? [], removedPageIds);
  if (!valid) throw new Error("scope-change decision is invalid or does not exactly match the page reduction");
}

async function readExistingPageIds(tutorialDir) {
  const path = resolve(tutorialDir, "tutorial-site.json");
  if (!await pathExists(path)) return [];
  let tutorial;
  try {
    tutorial = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`cannot read existing tutorial catalog: ${path}: ${error.message}`);
  }
  if (!Array.isArray(tutorial.pages)) throw new Error(`existing tutorial catalog has no pages array: ${path}`);
  return tutorial.pages.map((page) => page.page_id);
}

async function atomicWrite(path, content) {
  const temporaryPath = `${path}.tmp-${process.pid}`;
  await writeFile(temporaryPath, content);
  await rename(temporaryPath, path);
}

function parseStaticCourseData(indexHtml) {
  const startMarker = "const COURSE_DATA=";
  const endMarker = ";const DATA=COURSE_DATA;";
  const start = indexHtml.indexOf(startMarker);
  const end = indexHtml.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error("static index payload drift from course source: COURSE_DATA payload is missing");
  try {
    return JSON.parse(indexHtml.slice(start + startMarker.length, end));
  } catch (error) {
    throw new Error(`static index payload drift from course source: invalid COURSE_DATA JSON: ${error.message}`);
  }
}

function validateStaticIndex(indexBytes, expectedCourseData) {
  const actualCourseData = parseStaticCourseData(indexBytes.toString("utf8"));
  if (stableJson(actualCourseData) !== stableJson(expectedCourseData)) {
    throw new Error("static index payload drift from course source: rebuild site/dist-github-pages before tutorial sync");
  }
}

export async function synchronizeTutorialPackage({
  tutorialDir,
  artifacts,
  indexSourcePath,
  check = false,
  scopeChangeDecisionPath,
}) {
  const previousPageIds = await readExistingPageIds(tutorialDir);
  const nextPageIds = artifacts.tutorial.pages.map((page) => page.page_id);
  if (previousPageIds.length) {
    await validateScopeReduction({ previousPageIds, nextPageIds, scopeChangeDecisionPath });
  }

  const indexBytes = await readFile(indexSourcePath);
  validateStaticIndex(indexBytes, artifacts.staticCourseData);
  const expectedFiles = {
    ...artifacts.files,
    "index.html": indexBytes,
  };

  if (check) {
    const drift = [];
    for (const name of generatedFileNames) {
      const path = resolve(tutorialDir, name);
      if (!await pathExists(path)) {
        drift.push(`${name} (missing)`);
        continue;
      }
      const actual = await readFile(path);
      const expected = Buffer.isBuffer(expectedFiles[name]) ? expectedFiles[name] : Buffer.from(expectedFiles[name], "utf8");
      if (!actual.equals(expected)) drift.push(name);
    }
    if (drift.length) throw new Error(`tutorial package drift: ${drift.join(", ")}`);
    return { changed: false, checked: true, pageCount: nextPageIds.length };
  }

  await mkdir(tutorialDir, { recursive: true });
  for (const name of generatedFileNames) {
    await atomicWrite(resolve(tutorialDir, name), expectedFiles[name]);
  }
  return { changed: true, checked: false, pageCount: nextPageIds.length };
}

function parseArguments(argv) {
  const options = {
    check: false,
    outputDir: resolve(root, "tutorial"),
    materialRoot: resolve(root, "site/public"),
    indexSourcePath: resolve(root, "site/dist-github-pages/index.html"),
    scopeChangeDecisionPath: undefined,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") options.check = true;
    else if (argument === "--output-dir") options.outputDir = resolve(argv[++index] ?? "");
    else if (argument === "--material-root") options.materialRoot = resolve(argv[++index] ?? "");
    else if (argument === "--index-source") options.indexSourcePath = resolve(argv[++index] ?? "");
    else if (argument === "--scope-change-decision") options.scopeChangeDecisionPath = resolve(argv[++index] ?? "");
    else if (argument === "--help") options.help = true;
    else throw new Error(`unknown argument: ${argument}`);
  }
  return options;
}

function usage() {
  return `Usage: node scripts/sync-tutorial-package.mjs [options]

Options:
  --check                         Compare generated files without writing
  --output-dir <path>             Override tutorial output directory
  --material-root <path>          Override site public root used for material hashes
  --index-source <path>           Override static index.html source
  --scope-change-decision <path>  Approve an exact page-count reduction
  --help                          Show this help
`;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }
  const {
    firstUsablePath,
    getTechnicalBlockPresentation,
    pages,
    publicModules,
    releaseScope,
    sourceNotes,
    glossary,
    glossaryCategories,
  } = await import(resolve(root, "site/content/course.ts"));
  const { glossary: glossaryEntries, glossaryCategories: glossaryCategoryList } = await import(resolve(root, "site/content/glossary.ts"));
  const artifacts = await createTutorialArtifacts({
    pages,
    publicModules,
    releaseScope,
    firstUsablePath,
    materialRoot: options.materialRoot,
    getTechnicalBlockPresentation,
    sourceNotes,
    glossary: glossaryEntries,
    glossaryCategories: glossaryCategoryList,
  });
  const result = await synchronizeTutorialPackage({
    tutorialDir: options.outputDir,
    artifacts,
    indexSourcePath: options.indexSourcePath,
    check: options.check,
    scopeChangeDecisionPath: options.scopeChangeDecisionPath,
  });
  const action = result.checked ? "verified" : "synchronized";
  console.log(`Tutorial package ${action}: ${result.pageCount} public pages; source/material hashes recorded.`);
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
