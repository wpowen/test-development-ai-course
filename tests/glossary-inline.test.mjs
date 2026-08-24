import assert from "node:assert/strict";
import test from "node:test";

import { glossary } from "../content/glossary.ts";
import {
  buildGlossaryMatcher,
  findGlossaryEntry,
  glossaryAliases,
  tokenizeGlossaryText,
} from "../app/glossary-matcher.ts";

const matcher = buildGlossaryMatcher(glossary);

test("every glossary entry contributes at least one clickable alias", () => {
  for (const entry of glossary) {
    assert.ok(glossaryAliases(entry).length > 0, `${entry.term} has no matchable alias`);
  }
  assert.ok(matcher.aliasCount >= glossary.length, "the matcher must cover the complete glossary");
});

test("term, Chinese label and aka all resolve to the canonical glossary entry", () => {
  const prompt = glossary.find((entry) => entry.term === "Prompt（提示词）");
  assert.ok(prompt);
  for (const alias of ["Prompt", "提示词", "系统提示"]) {
    assert.equal(findGlossaryEntry(matcher, alias)?.term, prompt.term, `${alias} must resolve to ${prompt.term}`);
  }
});

test("tokenizer links every occurrence and preserves surrounding learner prose", () => {
  const parts = tokenizeGlossaryText("先固定 Prompt，再检查提示词；第二次 Prompt 也必须能点。", matcher);
  assert.equal(parts.map((part) => part.text).join(""), "先固定 Prompt，再检查提示词；第二次 Prompt 也必须能点。");
  assert.deepEqual(
    parts.filter((part) => part.kind === "term").map((part) => part.entry.term),
    ["Prompt（提示词）", "Prompt（提示词）", "Prompt（提示词）"],
  );
});

test("longest term wins when glossary aliases overlap", () => {
  const localMatcher = buildGlossaryMatcher([
    { ...glossary[0], term: "Agent" },
    { ...glossary[0], term: "Agent Loop" },
  ]);
  const terms = tokenizeGlossaryText("检查 Agent Loop，不要只看 Agent。", localMatcher)
    .filter((part) => part.kind === "term")
    .map((part) => part.entry.term);
  assert.deepEqual(terms, ["Agent Loop", "Agent"]);
});

test("ASCII abbreviations respect word boundaries", () => {
  const localMatcher = buildGlossaryMatcher([{ ...glossary[0], term: "AI", aka: undefined }]);
  const parts = tokenizeGlossaryText("AI 可以被点击，RAIL 和 AIOps 不应被拆开。", localMatcher);
  assert.deepEqual(parts.filter((part) => part.kind === "term").map((part) => part.text), ["AI"]);
});

test("ambiguous bare abbreviations require an authored disambiguating form", () => {
  assert.equal(findGlossaryEntry(matcher, "CI"), undefined, "bare CI must not be forced to confidence interval");
  assert.equal(findGlossaryEntry(matcher, "95% CI")?.term, "置信区间（CI）");
  assert.equal(
    tokenizeGlossaryText("CI 门禁与 95% CI 是两个概念。", matcher)
      .filter((part) => part.kind === "term")
      .map((part) => part.text)
      .includes("CI"),
    false,
  );
});

test("leading whitespace does not shift matched term positions", () => {
  const parts = tokenizeGlossaryText("  Prompt 前保留两个空格。", matcher);
  assert.equal(parts.map((part) => part.text).join(""), "  Prompt 前保留两个空格。");
  assert.equal(parts.find((part) => part.kind === "term")?.text, "Prompt");
});
