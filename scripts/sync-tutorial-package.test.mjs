import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  createTutorialArtifacts,
  synchronizeTutorialPackage,
} from "./sync-tutorial-package.mjs";

const releaseScope = {
  mode: "pilot-path",
  promisedPageIds: ["TD-X01"],
  catalogComplete: false,
  validatedAt: "2026-08-11",
};

const page = {
  id: "TD-X01",
  moduleId: "TD-MX",
  order: 1,
  title: "保真测试页",
  type: "跟做",
  status: "fixture-tested",
  duration: "20 分钟",
  summary: "验证教程投影不会缩减信息。",
  why: "学习者需要看到全部教学内容。",
  prerequisites: [],
  outcomes: ["保留全部教学块"],
  artifact: "保真清单",
  blocks: [
    {
      kind: "explanation",
      title: "完整解释",
      body: ["第一段", "第二段"],
      bullets: ["要点一", "要点二"],
      table: {
        headers: ["输入", "输出"],
        rows: [["PRD", "Requirement Contract"]],
        caption: "需求转换表",
      },
      warning: "不得猜测冲突。",
    },
    {
      title: "可执行技术块",
      body: ["在固定目录执行。"],
      technical: {
        kind: "command",
        content: "python3 run.py",
        manifestPath: "materials/sample/manifest.json",
        stepId: "run-fixture",
        workingDirectory: "materials/sample",
        expectedExitCode: 0,
        expectedArtifacts: ["reports/result.json"],
      },
      expected: "exit 0",
      warning: "exit 2 means BLOCKED",
    },
  ],
  practice: ["执行一次"],
  completion: ["保存运行证据"],
  sourceIds: ["S-TEST"],
  evidenceBoundary: "仅验证离线 fixture。",
  architecture: {
    title: "输入到证据",
    caption: "最小链路",
    nodes: ["PRD", "Contract", "Evidence"],
  },
  materials: [
    {
      title: "运行脚本",
      description: "离线脚本",
      href: "materials/sample/run.py",
      kind: "script",
      validation: "fixture-tested",
    },
  ],
};

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "tutorial-sync-"));
  const materialRoot = join(root, "site", "public");
  await mkdir(join(materialRoot, "materials", "sample"), { recursive: true });
  await writeFile(join(materialRoot, "materials", "sample", "run.py"), "print('v1')\n");
  const artifacts = await createTutorialArtifacts({
    pages: [page],
    publicModules: [{ id: "TD-MX", title: "测试模块", subtitle: "保真" }],
    releaseScope,
    firstUsablePath: ["TD-X01"],
    materialRoot,
    getTechnicalBlockPresentation: (block) => block.technical ? {
      kind: block.technical.kind,
      content: block.technical.content,
      label: "可执行命令",
      copyable: true,
      runnable: true,
      reason: "测试契约完整",
      workingDirectory: block.technical.workingDirectory,
    } : undefined,
  });
  const indexSourcePath = join(root, "site", "dist-github-pages", "index.html");
  await mkdir(join(root, "site", "dist-github-pages"), { recursive: true });
  await writeFile(indexSourcePath, `<script>const COURSE_DATA=${JSON.stringify(artifacts.staticCourseData)};const DATA=COURSE_DATA;</script>\n`);
  return { root, materialRoot, artifacts, indexSourcePath };
}

test("projection preserves every teaching block field, table, technical metadata, material, and status", async () => {
  const { artifacts } = await fixture();
  const projected = artifacts.tutorial.pages[0];

  assert.deepEqual(projected.content_sections.teaching_blocks, page.blocks);
  assert.deepEqual(projected.content_sections.technical_presentations, [{
    block_index: 1,
    kind: "command",
    content: "python3 run.py",
    label: "可执行命令",
    copyable: true,
    runnable: true,
    reason: "测试契约完整",
    workingDirectory: "materials/sample",
  }]);
  assert.deepEqual(projected.materials, page.materials);
  assert.equal(projected.source_status, "fixture-tested");
  assert.equal(projected.evidence_status, "fixture-tested");
  assert.equal(projected.delivery_status, "fixture-tested");
  assert.match(projected.source_hash, /^[a-f0-9]{64}$/);
  assert.match(projected.material_hash, /^[a-f0-9]{64}$/);
  assert.equal(artifacts.fidelityManifest.pages[0].source_hash, projected.source_hash);
  assert.equal(artifacts.fidelityManifest.pages[0].material_hash, projected.material_hash);
});

test("material hash changes when referenced material bytes change while source hash remains stable", async () => {
  const { materialRoot, artifacts: before } = await fixture();
  await writeFile(join(materialRoot, "materials", "sample", "run.py"), "print('v2')\n");
  const after = await createTutorialArtifacts({
    pages: [page],
    publicModules: [{ id: "TD-MX", title: "测试模块", subtitle: "保真" }],
    releaseScope,
    firstUsablePath: ["TD-X01"],
    materialRoot,
    getTechnicalBlockPresentation: (block) => block.technical ? {
      kind: block.technical.kind,
      content: block.technical.content,
      label: "可执行命令",
      copyable: true,
      runnable: true,
      reason: "测试契约完整",
      workingDirectory: block.technical.workingDirectory,
    } : undefined,
  });

  assert.equal(after.tutorial.pages[0].source_hash, before.tutorial.pages[0].source_hash);
  assert.notEqual(after.tutorial.pages[0].material_hash, before.tutorial.pages[0].material_hash);
});

test("check mode reports generated artifact drift without rewriting files", async () => {
  const { root, artifacts, indexSourcePath } = await fixture();
  const tutorialDir = join(root, "tutorial");
  await synchronizeTutorialPackage({ tutorialDir, artifacts, indexSourcePath });
  const readmePath = join(tutorialDir, "README.md");
  await writeFile(readmePath, "stale\n");

  await assert.rejects(
    synchronizeTutorialPackage({ tutorialDir, artifacts, indexSourcePath, check: true }),
    /tutorial package drift.*README\.md/i,
  );
  assert.equal(await readFile(readmePath, "utf8"), "stale\n");
});

test("sync rejects a static index whose embedded course payload is stale", async () => {
  const { root, artifacts, indexSourcePath } = await fixture();
  await writeFile(indexSourcePath, '<script>const COURSE_DATA={"pages":[]};const DATA=COURSE_DATA;</script>\n');

  await assert.rejects(
    synchronizeTutorialPackage({ tutorialDir: join(root, "tutorial"), artifacts, indexSourcePath }),
    /static index payload drift from course source/i,
  );
});

test("page-count reduction is rejected without an exact approved scope-change decision", async () => {
  const { root, artifacts, indexSourcePath } = await fixture();
  const tutorialDir = join(root, "tutorial");
  await mkdir(tutorialDir, { recursive: true });
  await writeFile(join(tutorialDir, "tutorial-site.json"), JSON.stringify({
    pages: [{ page_id: "TD-X01" }, { page_id: "TD-X02" }],
  }));

  await assert.rejects(
    synchronizeTutorialPackage({ tutorialDir, artifacts, indexSourcePath }),
    /page count decrease.*scope-change decision/i,
  );

  const decisionPath = join(root, "scope-change-decision.json");
  await writeFile(decisionPath, JSON.stringify({
    schema_version: "1.0",
    decision: "approved-page-scope-reduction",
    approved: true,
    approved_by: "course-owner",
    approved_at: "2026-08-11T12:00:00+08:00",
    reason: "TD-X02 failed the publication gate and is removed from this bounded fixture.",
    previous_page_ids: ["TD-X01", "TD-X02"],
    next_page_ids: ["TD-X01"],
    removed_page_ids: ["TD-X02"],
  }));

  await synchronizeTutorialPackage({
    tutorialDir,
    artifacts,
    indexSourcePath,
    scopeChangeDecisionPath: decisionPath,
  });
  const result = JSON.parse(await readFile(join(tutorialDir, "tutorial-site.json"), "utf8"));
  assert.deepEqual(result.pages.map((item) => item.page_id), ["TD-X01"]);
});
