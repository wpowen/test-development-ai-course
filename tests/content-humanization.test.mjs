#!/usr/bin/env node

import assert from "node:assert/strict";
import test from "node:test";
import { getLearnerTechnicalBlockPresentation, pages } from "../content/course.ts";

const CHATBOT_STYLE_HEADINGS = new Set([
  "这一页的出口判据",
  "先把架构问题说清楚",
  "按证据顺序执行",
  "先把本页要用到的词说清楚",
  "迁移到自己的项目",
]);

test("learner pages use technical-document headings instead of repeated chatbot scaffolding", () => {
  const findings = [];
  for (const page of pages) {
    for (const block of page.blocks) {
      if (CHATBOT_STYLE_HEADINGS.has(block.title) || /^这张图的 \d+ 个节点，本页各交付什么$/.test(block.title)) {
        findings.push(`${page.id}: ${block.title}`);
      }
    }
  }
  assert.deepEqual(findings, []);
});

test("each learner page uses distinct section headings", () => {
  const findings = [];
  for (const page of pages) {
    const seen = new Set();
    for (const block of page.blocks) {
      if (seen.has(block.title)) findings.push(`${page.id}: ${block.title}`);
      seen.add(block.title);
    }
  }
  assert.deepEqual(findings, []);
});

test("Agent and Workflow lessons assign page-specific learner actions", () => {
  const ids = new Set(["TD-T13", "TD-T14", "TD-T15", "TD-T16", "TD-T17", "TD-T18", "TD-T19", "TD-W01", "TD-W02", "TD-W03"]);
  const selected = pages.filter((page) => ids.has(page.id));
  assert.equal(selected.length, ids.size);
  const signatures = selected.map((page) => page.practice.join("\n"));
  assert.equal(new Set(signatures).size, selected.length);
  for (const page of selected) {
    assert.doesNotMatch(page.practice[0], new RegExp(`^运行 ${page.id} 的 0/1/0 fixture`));
  }
});

test("learner-facing prompt blocks do not expose factory diagnostics or generator instructions", () => {
  const forbidden = /(优化诊断|让我们一步步思考|自我批判|Version History|methodology\/page-prompt-specs\.json|直接编辑本文件)/;
  let promptCount = 0;
  for (const page of pages) {
    for (const block of page.blocks) {
      const presentation = getLearnerTechnicalBlockPresentation(block);
      if (presentation?.kind !== "prompt") continue;
      promptCount += 1;
      assert.equal(presentation.copyable, false);
      assert.doesNotMatch(presentation.content, forbidden);
    }
  }
  assert.ok(promptCount > 0);
});

test("learner prose does not present unsupported numeric anecdotes or absolute API claims as general rules", () => {
  const forbidden = /(高达 44% 的总方差|一致性从 0\.72 掉到 0\.58|结论不一致率可达 10% 以上|连续运行 11 天|运营成本的 10[–-]25%|检出能力接近 0|同样的输入必然得到同样的输出|identifier .*一定意味着结构真的变了)/;
  const findings = [];
  for (const page of pages) {
    const prose = JSON.stringify({ summary: page.summary, why: page.why, blocks: page.blocks });
    if (forbidden.test(prose)) findings.push(page.id);
  }
  assert.deepEqual(findings, []);
});
