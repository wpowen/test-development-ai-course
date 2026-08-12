import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { pages } from "../content/course.ts";

const siteRoot = fileURLToPath(new URL("..", import.meta.url));
const packageRoot = path.resolve(siteRoot, "..");
const courseLab = path.join(packageRoot, "courses/td-ai-011-requirements-to-evidence/lab");
const pageIds = Array.from({ length: 8 }, (_, index) => `TD-P0${index + 1}`);
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

const requiredSections = [
  "## 能做什么",
  "## 使用前准备",
  "## 直接复制到 AI Agent",
  "## 修改这些字段就能复用",
  "## 预期输出",
  "## 结果自检",
  "## 停止条件与边界",
];

const expectedSchemaFields = {
  "TD-P01": ["sources", "claims", "conflicts", "downstream_artifacts"],
  "TD-P02": ["requirements", "acceptance_criteria", "review_questions"],
  "TD-P03": ["components", "interfaces", "states", "failure_modes", "observability", "requirement_mapping"],
  "TD-P04": ["risks", "method_decisions", "test_level_map"],
  "TD-P05": ["oracles", "test_conditions", "test_cases", "blocked_tests"],
  "TD-P06": ["review_findings", "adapter_contracts", "commands", "trace_links"],
  "TD-P07": ["run", "results", "attributions", "defects", "decision"],
  "TD-P08": ["change_set", "impact_set", "regression_set", "evidence_pack", "residual_risks", "decision"],
};

test("P01-P08 prompts are beginner-facing direct-use packages, not abstract task stubs", async () => {
  for (const pageId of pageIds) {
    const promptPath = path.join(courseLab, "page-prompts", pageId, "prompt-v1.md");
    const manifestPath = path.join(courseLab, "page-prompts", pageId, "manifest.json");
    const schemaPath = path.join(courseLab, "page-prompts", pageId, "schema.json");
    const inputPath = path.join(courseLab, "page-prompts", pageId, "input.json");
    const promptBytes = await readFile(promptPath);
    const prompt = promptBytes.toString("utf8");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    const schema = JSON.parse(await readFile(schemaPath, "utf8"));
    const input = JSON.parse(await readFile(inputPath, "utf8"));

    assert.ok(prompt.length >= 2200, `${pageId} prompt is too thin for direct reuse`);
    for (const section of requiredSections) assert.ok(prompt.includes(section), `${pageId} missing ${section}`);
    for (const marker of ["[粘贴", "Evidence", "Inference", "Unknown", "BLOCKED", "source_ref", "不要编造"]) {
      assert.ok(prompt.includes(marker), `${pageId} missing direct-use marker ${marker}`);
    }

    assert.equal(manifest.direct_use, true, `${pageId} manifest must declare direct use`);
    assert.equal(manifest.copy_target, "generic-ai-agent");
    assert.ok(manifest.editable_fields?.length >= 4, `${pageId} needs editable fields`);
    assert.ok(manifest.expected_outputs?.length >= 3, `${pageId} needs expected outputs`);
    assert.ok(manifest.self_checks?.length >= 4, `${pageId} needs self checks`);
    assert.equal(manifest.model_status, "NOT_RUN");
    assert.equal(manifest.template_sha256, sha256(promptBytes));
    assert.equal(manifest.input_sha256, sha256(await readFile(inputPath)));
    assert.equal(manifest.output_schema_sha256, sha256(await readFile(schemaPath)));
    assert.equal(manifest.evaluation_sha256, sha256(await readFile(path.join(courseLab, "page-prompts", pageId, "eval.json"))));
    for (const field of expectedSchemaFields[pageId]) {
      assert.ok(schema.required.includes(field), `${pageId} schema missing professional field ${field}`);
      assert.ok(schema.properties[field], `${pageId} schema has no property ${field}`);
    }
    assert.ok(input.direct_use_inputs && Object.keys(input.direct_use_inputs).length >= 4, `${pageId} needs inspectable direct-use input fields`);
  }
});

test("the first three prompts explicitly cover lifecycle control, requirements review, and technical-document analysis", async () => {
  const p01 = await readFile(path.join(courseLab, "page-prompts/TD-P01/prompt-v1.md"), "utf8");
  const p02 = await readFile(path.join(courseLab, "page-prompts/TD-P02/prompt-v1.md"), "utf8");
  const p03 = await readFile(path.join(courseLab, "page-prompts/TD-P03/prompt-v1.md"), "utf8");

  for (const marker of ["测试生命周期", "Test Basis", "入口门禁", "下游工件"]) assert.ok(p01.includes(marker));
  for (const marker of ["需求评审", "需求解析", "验收标准", "Requirement Contract"]) assert.ok(p02.includes(marker));
  for (const marker of ["技术文档解析", "组件", "接口", "状态", "重试", "幂等", "可观测性"]) assert.ok(p03.includes(marker));
});

test("every lifecycle page exposes a visible copyable prompt and a direct prompt-file material", () => {
  const lifecyclePages = pages.filter((page) => pageIds.includes(page.id));
  assert.deepEqual(lifecyclePages.map((page) => page.id), pageIds);

  for (const page of lifecyclePages) {
    const promptBlocks = page.blocks.filter((block) => block.technical?.kind === "prompt");
    assert.ok(promptBlocks.length >= 1, `${page.id} needs a visible prompt block`);
    assert.ok(promptBlocks.some((block) => block.technical.content.includes("输入粘贴区")), `${page.id} prompt is not copy-ready`);
    assert.ok(page.materials?.some((material) => material.href === `materials/requirements-to-evidence/page-prompts/${page.id}/prompt-v1.md`), `${page.id} direct prompt material missing`);
  }
});

test("prompt kit has a novice guide, adaptation card, and exact eight-page manifest", async () => {
  const guide = await readFile(path.join(courseLab, "DIRECT-USE-GUIDE.md"), "utf8");
  const card = await readFile(path.join(courseLab, "ADAPTATION-CARD.md"), "utf8");
  const manifest = JSON.parse(await readFile(path.join(courseLab, "DIRECT-USE-MANIFEST.json"), "utf8"));

  for (const marker of ["先看能做什么", "直接复制", "替换输入", "检查输出", "不能替你决定"]) assert.ok(guide.includes(marker));
  for (const marker of ["业务场景", "来源权威", "责任人", "不可修改", "验证方法"]) assert.ok(card.includes(marker));
  assert.deepEqual(manifest.page_ids, pageIds);
  assert.equal(manifest.prompt_count, 8);
  assert.equal(manifest.model_status, "NOT_RUN");
  assert.equal(manifest.packages?.length, 8);
  for (const item of manifest.packages) {
    assert.ok(item.prompt_sha256 && item.input_sha256 && item.schema_sha256 && item.eval_sha256);
  }
});
