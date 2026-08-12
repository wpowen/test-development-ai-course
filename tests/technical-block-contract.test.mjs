import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  catalogPages,
  getTechnicalBlockPresentation,
} from "../content/course.ts";
import { professionRealityPage } from "../content/modules/profession-reality.ts";
import {
  auditTutorialPages,
} from "../scripts/audit-executability.ts";

const basePage = (block) => ({
  id: "TEST-PAGE",
  moduleId: "TEST-MODULE",
  order: 1,
  title: "Technical block contract fixture",
  type: "跟做",
  status: "desk-researched",
  duration: "10 minutes",
  summary: "fixture",
  why: "fixture",
  prerequisites: [],
  outcomes: ["one", "two", "three"],
  artifact: "report",
  blocks: [block],
  practice: ["one", "two", "three"],
  completion: ["one", "two", "three"],
  sourceIds: ["S1", "S2", "S3"],
  evidenceBoundary: "fixture only",
});

test("catalog projection preserves page-owned TD-F01 architecture and materials", () => {
  const projected = catalogPages.find((page) => page.id === "TD-F01");
  assert.ok(projected);
  assert.deepEqual(projected.architecture, professionRealityPage.architecture);
  assert.deepEqual(projected.materials, professionRealityPage.materials);
  assert.notEqual(projected.materials?.[0]?.href, "materials/career-reality-map.md");
});

test("legacy untyped code is fail-closed and cannot be copied", () => {
  const block = { title: "legacy", body: ["legacy"], code: "python3 run.py" };
  const presentation = getTechnicalBlockPresentation(block);
  assert.equal(presentation?.kind, "legacy-untyped");
  assert.equal(presentation?.copyable, false);
  assert.match(presentation?.reason ?? "", /typed technical block/i);
});

test("formula, diagram, and pseudocode are explicitly non-runnable", () => {
  for (const kind of ["formula", "diagram", "pseudocode"]) {
    const presentation = getTechnicalBlockPresentation({
      title: kind,
      body: [kind],
      technical: { kind, content: `${kind} content`, verification: "review the named evidence" },
    });
    assert.equal(presentation?.kind, kind);
    assert.equal(presentation?.copyable, false);
    assert.equal(presentation?.runnable, false);
  }
});

test("complete versioned prompt is copyable but an incomplete prompt is not", () => {
  const complete = getTechnicalBlockPresentation({
    title: "prompt",
    body: ["prompt"],
    technical: {
      kind: "prompt",
      content: "Return JSON.",
      version: "1.0.0",
      promptPath: "materials/prompt/task-v1.md",
      manifestPath: "materials/prompt/manifest.json",
      inputFixturePath: "materials/prompt/input.json",
      outputSchemaPath: "materials/prompt/schema.json",
      evaluationPath: "materials/prompt/eval.json",
    },
  });
  assert.equal(complete?.copyable, true);

  const incomplete = getTechnicalBlockPresentation({
    title: "prompt",
    body: ["prompt"],
    technical: {
      kind: "prompt",
      content: "Return JSON.",
      version: "1.0.0",
      promptPath: "materials/prompt/task-v1.md",
      manifestPath: "materials/prompt/manifest.json",
      inputFixturePath: "materials/prompt/input.json",
      outputSchemaPath: "materials/prompt/schema.json",
    },
  });
  assert.equal(incomplete?.copyable, false);
});

test("command audit requires an exact public manifest contract", async () => {
  const publicDir = await mkdtemp(join(tmpdir(), "technical-block-public-"));
  const labDir = join(publicDir, "materials", "lab");
  await mkdir(labDir, { recursive: true });
  await writeFile(join(labDir, "run.py"), "print('ok')\n");
  await writeFile(join(labDir, "lab-manifest.json"), JSON.stringify({
    working_directory: "materials/lab",
    required_files: ["run.py"],
    steps: [{
      step_id: "baseline",
      command: "python3 run.py",
      expected_exit_code: 0,
      expected_artifacts: ["reports/baseline.json"],
    }],
  }));

  const validBlock = {
    title: "command",
    body: ["command"],
    expected: "exit 0",
    technical: {
      kind: "command",
      content: "python3 run.py",
      manifestPath: "materials/lab/lab-manifest.json",
      stepId: "baseline",
      workingDirectory: "materials/lab",
      expectedExitCode: 0,
      expectedArtifacts: ["reports/baseline.json"],
    },
  };
  const valid = auditTutorialPages([basePage(validBlock)], { publicDir });
  assert.equal(valid.pages[0].verdict, "PASS");

  const mismatch = structuredClone(validBlock);
  mismatch.technical.content = "python3 another.py";
  const mismatchAudit = auditTutorialPages([basePage(mismatch)], { publicDir });
  assert.equal(mismatchAudit.pages[0].verdict, "FAIL");
  assert.match(mismatchAudit.pages[0].findings.join("\n"), /does not exactly match manifest step/i);
});

test("command audit rejects unpublished courses paths and implicit working directories", async () => {
  const publicDir = await mkdtemp(join(tmpdir(), "technical-block-public-"));
  const page = basePage({
    title: "bad command",
    body: ["bad command"],
    expected: "exit 0",
    technical: {
      kind: "command",
      content: "python3 courses/private/run.py",
      manifestPath: "materials/missing.json",
      stepId: "baseline",
      workingDirectory: "",
      expectedExitCode: 0,
      expectedArtifacts: [],
    },
  });
  const audit = auditTutorialPages([page], { publicDir });
  const findings = audit.pages[0].findings.join("\n");
  assert.match(findings, /unpublished courses\/ path/i);
  assert.match(findings, /working directory/i);
});

test("prompt audit resolves every contract file and exact manifest fields", async () => {
  const publicDir = await mkdtemp(join(tmpdir(), "technical-block-public-"));
  const promptDir = join(publicDir, "materials", "prompt");
  await mkdir(promptDir, { recursive: true });
  await Promise.all([
    writeFile(join(promptDir, "task-v1.md"), "Return JSON.\n"),
    writeFile(join(promptDir, "input.json"), "{}\n"),
    writeFile(join(promptDir, "schema.json"), "{}\n"),
    writeFile(join(promptDir, "eval.json"), "{}\n"),
    writeFile(join(promptDir, "manifest.json"), JSON.stringify({
      version: "1.0.0",
      task_prompt: "task-v1.md",
      schema: "schema.json",
      eval: "eval.json",
    })),
  ]);
  const promptBlock = {
    title: "prompt",
    body: ["prompt"],
    expected: "valid JSON",
    technical: {
      kind: "prompt",
      content: "Return JSON.",
      version: "1.0.0",
      promptPath: "materials/prompt/task-v1.md",
      manifestPath: "materials/prompt/manifest.json",
      inputFixturePath: "materials/prompt/input.json",
      outputSchemaPath: "materials/prompt/schema.json",
      evaluationPath: "materials/prompt/eval.json",
    },
  };
  const promptPage = { ...basePage(promptBlock), type: "概念" };
  assert.equal(auditTutorialPages([promptPage], { publicDir }).pages[0].verdict, "PASS");

  const missingEval = structuredClone(promptBlock);
  missingEval.technical.evaluationPath = "materials/prompt/missing-eval.json";
  const audit = auditTutorialPages([{ ...basePage(missingEval), type: "概念" }], { publicDir });
  assert.equal(audit.pages[0].verdict, "FAIL");
  assert.match(audit.pages[0].findings.join("\n"), /missing prompt evaluation/i);
});

test("public build and static export are both gated by release validation", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(packageJson.scripts.build, /^npm run validate:release && /);
  assert.match(packageJson.scripts["export:static"], /^npm run validate:release && /);
  assert.equal(packageJson.scripts["validate:release"], "node scripts/validate-content.ts --with-executability");
});
