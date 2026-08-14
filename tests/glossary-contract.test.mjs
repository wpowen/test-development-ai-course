import assert from "node:assert/strict";
import test from "node:test";

import { glossary, glossaryCategories } from "../content/glossary.ts";

test("every glossary entry has a reusable multi-dimensional explanation", () => {
  assert.equal(glossary.length, 342);
  for (const entry of glossary) {
    assert.ok(entry.mechanism.length >= 30, `${entry.term} mechanism is too short`);
    assert.ok(entry.example.length >= 20, `${entry.term} example is too short`);
    assert.ok(entry.testFocus.length >= 2, `${entry.term} test focus is incomplete`);
    assert.ok(entry.pitfalls.length >= 2, `${entry.term} pitfalls are incomplete`);
    assert.ok(entry.staticExplanation.includes("机制："), `${entry.term} static projection lost mechanism`);
    assert.ok(entry.sources.length >= 1, `${entry.term} has no source link`);
    for (const source of entry.sources) {
      assert.match(source.url, /^https:\/\//, `${entry.term} source must be HTTPS`);
      assert.ok(source.title && source.kind && source.accessed, `${entry.term} source metadata incomplete`);
    }
  }
});

test("core glossary keeps high-value AI testing concepts connected", () => {
  const byTerm = new Map(glossary.map((entry) => [entry.term, entry]));
  for (const term of ["Prompt（提示词）", "RAG（检索增强生成）", "Oracle（判据）", "MCP 与工具投毒", "Trace 与 Span"]) {
    const entry = byTerm.get(term);
    assert.ok(entry, `${term} missing`);
    assert.ok(entry.related.length >= 2, `${term} related terms are too shallow`);
    assert.ok(entry.sources.some((source) => ["官方规范", "官方文档", "标准框架", "安全资料", "百科"].includes(source.kind)));
  }
});

test("glossary categories cover every entry and keep the learner filters meaningful", () => {
  const entryCategories = new Set(glossary.map((entry) => entry.category));
  assert.ok(glossaryCategories.length >= 10, "glossary should expose multiple knowledge domains");
  assert.deepEqual(new Set(glossaryCategories), entryCategories);
  assert.ok(glossaryCategories.every((category) => category.trim().length > 0));
});
