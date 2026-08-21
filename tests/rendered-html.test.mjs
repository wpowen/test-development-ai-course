import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import { catalogPages, pages, releaseScope } from "../content/course.ts";
import { glossary } from "../content/glossary.ts";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the test-development AI tutorial shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /测试开发 × AI/);
  assert.match(html, /从传统测试到 AI 质量工程/);
  assert.match(html, />搜索课程</);
  assert.match(html, /https:\/\/github\.com\/wpowen\/test-development-ai-tutorial/);
  assert.match(html, /GitHub Star/);
  assert.match(html, new RegExp(`${glossary.length}(?:<!-- -->)? 条`));
  assert.match(html, /不懂的词先查这里/);
  assert.match(html, /aria-label="按阅读任务筛选"/);
  for (const label of ["Learn · 学会", "Do · 完成任务", "Look up · 查证", "Understand · 理解", "Report / Decide · 报告决策"]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /逐命题 Deep Research、独立审阅和生产验证尚未完成/);
  assert.doesNotMatch(html, /已经完成逐题研究|已通过逐题研究/);
  assert.doesNotMatch(html, />设计思路</);
  assert.match(html, /机制|测试开发看什么|延伸来源/);
  assert.match(html, /打开术语表/);
  assert.match(html, /测试开发职业责任与 AI 授权边界/);
  assert.match(html, /图示（不可运行）/);
  assert.match(html, /aria-label="不可复制"/);
  assert.match(html, />复制使用<\/button>/);
  assert.match(html, /<details class="materials-card">/);
  assert.doesNotMatch(html, /<details class="materials-card" open>/);
  assert.doesNotMatch(html, />证据与边界</);
  assert.ok(
    html.indexOf('class="completion-card"') < html.indexOf('class="materials-card"'),
    "随课物料必须位于完成检查之后",
  );
  assert.doesNotMatch(html, /未分类技术内容（不可复制）/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("document-task navigation is styled and contains no retired learning-path UI", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const source = await readFile(new URL("../app/reference-views.tsx", import.meta.url), "utf8");
  assert.match(css, /\.document-job-nav/);
  assert.doesNotMatch(source, /三条路径|再从 TD-F01 顺着读|从 TD-F02 进/);
});

test("dynamic build excludes internal topic support files", async () => {
  await assert.rejects(access(new URL("../dist/client/materials/internal-topics/README.md", import.meta.url)));
});

test("ships only validated public pages without empty catalog placeholders", async () => {
  const response = await render();
  const html = await response.text();
  assert.equal(
    releaseScope.promisedPageIds.length,
    new Set(releaseScope.promisedPageIds).size,
    "the release scope must not contain duplicate page IDs",
  );
  assert.deepEqual(
    releaseScope.promisedPageIds,
    pages.map((page) => page.id),
    "the release scope must equal the ordered delivered catalog projection",
  );
  for (const id of releaseScope.promisedPageIds) assert.match(html, new RegExp(`data-page-id="${id}"`));
  for (const id of catalogPages.map((page) => page.id).filter((id) => !releaseScope.promisedPageIds.includes(id))) {
    assert.doesNotMatch(html, new RegExp(`data-page-id="${id}"`));
  }
  assert.doesNotMatch(html, /完整课程|仅提纲|待开发|仅保留知识位置|本页尚未通过逐题研究/);
  assert.match(html, /实验已跑/);
  assert.match(html, /资料已审/);
});
