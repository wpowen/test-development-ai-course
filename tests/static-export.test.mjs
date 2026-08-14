import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { catalogPages, pages, releaseScope } from "../content/course.ts";

const siteRoot = fileURLToPath(new URL("..", import.meta.url));
const html = await readFile(new URL("../dist-github-pages/index.html", import.meta.url), "utf8");
const courseSource = await readFile(new URL("../content/course.ts", import.meta.url), "utf8");

function validateMaterials(...args) {
  return spawnSync("python3", ["scripts/validate-material-archives.py", "--skip-labs", ...args], {
    cwd: siteRoot,
    encoding: "utf8",
  });
}

test("static GitHub Pages export contains the professional curriculum", () => {
  assert.deepEqual(pages.map((page) => page.id), releaseScope.promisedPageIds);
  for (const id of releaseScope.promisedPageIds) assert.match(html, new RegExp(`"id":"${id}"`));
  for (const id of catalogPages.map((page) => page.id).filter((id) => !releaseScope.promisedPageIds.includes(id))) {
    assert.doesNotMatch(html, new RegExp(`"id":"${id}"`));
  }
  assert.match(html, /专业主路径已完成/);
  assert.match(html, /localStorage/);
  assert.match(html, /输入需求、执行证据、TTFT/);
  assert.match(html, />搜索课程</);
  assert.match(html, /https:\/\/github\.com\/wpowen\/test-development-ai-tutorial/);
  assert.match(html, /GitHub Star/);
  assert.match(html, /id="nav-toggle"/);
  assert.match(html, /career-ai-nav-collapsed/);
  assert.match(html, /aria-controls="side"/);
  assert.match(html, /id="reference-nav"/);
  assert.match(html, /data-reference="glossary"/);
  assert.match(html, /data-reference="design"/);
  assert.match(html, />术语表</);
  assert.match(html, />设计思路</);
  assert.match(html, /"glossary":\[/);
  assert.match(html, /AI（人工智能）/);
  assert.match(html, /这套课程是怎么设计的/);
  assert.match(html, /四层结构，单向依赖/);
  assert.equal((html.match(/"moduleId":"TD-/g) ?? []).length, releaseScope.promisedPageIds.length);
  assert.match(html, new RegExp(`"validatedAt":"${releaseScope.validatedAt}"`));
  assert.match(html, /DATA\.releaseScope\.validatedAt/);
  assert.doesNotMatch(html, /"status":"planned"/);
  assert.doesNotMatch(html, /"status":"outlined"|"status":"blocked"/);
  assert.doesNotMatch(html, /仅保留知识位置|本页尚未开发|本页尚未通过逐题研究|提纲\/待重写/);
  assert.match(html, /需求文档到执行证据|需求契约/);
  for (const material of ["api-ai-automation.zip", "ui-mobile-automation.zip", "reliability-chaos-observability.zip", "quality-platform-integrations.zip"]) assert.match(html, new RegExp(material));
  assert.match(html, /basis_gate_and_candidate_review\.py/);
  assert.match(html, /gitlab_sha_junit_gate\.py/);
  assert.match(html, /ephemeral_namespace_cleanup\.py/);
  assert.match(html, /event_replay_and_reconcile\.py/);
  assert.doesNotMatch(html, /本页完成后|你会带走|轮到你动手|你应该看到 \/ 得出|别踩这个坑/);
  assert.match(courseSource, /incompleteStatuses[^;]+planned[^;]+outlined[^;]+blocked/s);
  assert.doesNotMatch(html, /"technicalPresentation":\{"kind":"legacy-untyped"/);
  assert.doesNotMatch(html, /未分类技术内容（不可复制）/);
  assert.match(html, /"technicalPresentation":\{"kind":"command"/);
  assert.match(html, /"technicalPresentation":\{"kind":"prompt"/);
  assert.match(html, /复制使用/);
  assert.match(html, /不可复制/);
  assert.match(html, /<details class=materials><summary>/);
  assert.doesNotMatch(html, /<details class=materials open>/);
  assert.doesNotMatch(html, /<section class=evidence>|>证据与边界</);
  assert.ok(
    html.indexOf("<section class=complete>") < html.indexOf("<details class=materials><summary>"),
    "静态站点的随课物料必须位于完成检查之后",
  );
  assert.match(html, /technicalPresentation\.content/);
  assert.doesNotMatch(html, /clipboard\.writeText\(p\.blocks\[Number\(b\.dataset\.copy\)\]\.code\)/);
});

test("static export ships syntactically valid client JavaScript", () => {
  const match = html.match(/<script>([\s\S]*)<\/script>/);
  assert.ok(match, "inline client script must exist");
  assert.doesNotThrow(() => new vm.Script(match[1], { filename: "github-pages-inline.js" }));
});

test("static export does not include private Sites configuration", () => {
  assert.doesNotMatch(html, /hosting\.json|"project_id"\s*:|"account_id"\s*:/i);
});

test("static material folders and ZIPs exactly match the canonical public projection", () => {
  const result = validateMaterials("--static-root", "dist-github-pages");
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /canonical\/public projection/);
  assert.match(result.stdout, /public\/static projection/);
  assert.match(result.stdout, /ZIP member\/hash closure/);
});

test("an obsolete PASS release manifest fails explicitly as stale", async () => {
  const releaseRoot = await mkdtemp(path.join(tmpdir(), "stale-course-release-"));
  try {
    await writeFile(
      path.join(releaseRoot, "RELEASE-MANIFEST.json"),
      JSON.stringify({ validation_verdict: "PASS", content_hash: "sha256:obsolete" }),
    );
    const result = validateMaterials("--skip-source", "--release-root", releaseRoot);
    assert.notEqual(result.status, 0, "a legacy PASS manifest must not pass the current release contract");
    assert.match(result.stderr, /stale release manifest/);
    assert.match(result.stderr, /SOLUTION-MANIFEST\.json/);
  } finally {
    await rm(releaseRoot, { recursive: true, force: true });
  }
});

test("material validation dynamically discovers a newly added bundle", async () => {
  const materialsRoot = await mkdtemp(path.join(tmpdir(), "dynamic-material-bundle-"));
  try {
    const bundleRoot = path.join(materialsRoot, "future-bundle");
    await mkdir(bundleRoot);
    await writeFile(path.join(bundleRoot, "README.md"), "future bundle\n");
    const archived = spawnSync("zip", ["-qr", "future-bundle.zip", "future-bundle"], { cwd: materialsRoot, encoding: "utf8" });
    assert.equal(archived.status, 0, archived.stderr);
    const result = validateMaterials("--skip-source", materialsRoot);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /1 dynamically discovered material bundle/);
  } finally {
    await rm(materialsRoot, { recursive: true, force: true });
  }
});
