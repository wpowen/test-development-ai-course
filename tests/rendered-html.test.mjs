import assert from "node:assert/strict";
import test from "node:test";

import { catalogPages, releaseScope } from "../content/course.ts";

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
  assert.match(html, /先重建测试开发这份工作，再判断 AI 应该改哪里/);
  assert.match(html, /图示（不可运行）/);
  assert.match(html, /aria-label="不可复制"/);
  assert.match(html, />复制使用<\/button>/);
  assert.doesNotMatch(html, /未分类技术内容（不可复制）/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("ships only validated public pages without empty catalog placeholders", async () => {
  const response = await render();
  const html = await response.text();
  assert.equal(releaseScope.promisedPageIds.length, 85);
  for (const id of releaseScope.promisedPageIds) assert.match(html, new RegExp(`data-page-id="${id}"`));
  for (const id of catalogPages.map((page) => page.id).filter((id) => !releaseScope.promisedPageIds.includes(id))) {
    assert.doesNotMatch(html, new RegExp(`data-page-id="${id}"`));
  }
  assert.doesNotMatch(html, /完整课程|仅提纲|待开发|仅保留知识位置|本页尚未通过逐题研究/);
  assert.match(html, /实验已跑/);
  assert.match(html, /资料已审/);
});
