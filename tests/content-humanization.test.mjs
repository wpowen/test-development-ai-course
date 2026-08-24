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

test("the beginner entry explains responsibility before introducing external career frameworks", () => {
  const page = pages.find((item) => item.id === "TD-F01");
  assert.ok(page);

  const responsibility = page.blocks.find((block) => block.title === "先把职责说清：测试开发要帮助团队判断这个版本能不能发布");
  assert.ok(responsibility, "TD-F01 must contain one plain-language responsibility section");
  const responsibilityText = responsibility.body?.join("\n") ?? "";
  assert.match(responsibilityText, /能不能发布/);
  assert.match(responsibilityText, /还剩哪些风险/);
  assert.match(responsibilityText, /出了问题怎样回滚/);
  assert.doesNotMatch(responsibilityText, /O\*NET|英国.*能力框架|让质量风险(?:变得)?可决定/);

  const evidence = page.blocks.find((block) => block.title === "外部职业资料怎么用：只做职责查漏，不替公司定规则");
  assert.ok(evidence, "TD-F01 must explain why external career sources appear");
  const evidenceText = evidence.body?.join("\n") ?? "";
  assert.match(evidenceText, /美国劳工部维护的职业信息数据库（O\*NET）/);
  assert.match(evidenceText, /英国政府数字和数据专业能力框架/);
  assert.match(evidenceText, /不能决定你所在公司的岗位权限、绩效标准或发布责任/);
  assert.deepEqual(evidence.refs, ["R-ONET-QA", "R-UK-DDAT"]);
});

test("the beginner entry defines operational English terms in Chinese at first use", () => {
  const page = pages.find((item) => item.id === "TD-F01");
  assert.ok(page);
  const learnerText = JSON.stringify({
    summary: page.summary,
    outcomes: page.outcomes,
    architecture: page.architecture,
    blocks: page.blocks,
  });
  for (const definition of [
    "例外放行（Waiver）",
    "判断对错的依据（Oracle）",
    "测试包（TestPackage）",
    "运行记录（Run Manifest）",
    "左移测试（Shift-left）",
    "右移测试（Shift-right）",
  ]) {
    assert.ok(learnerText.includes(definition), `TD-F01 must define ${definition}`);
  }
  assert.doesNotMatch(learnerText, /O\*NET 的任务清单|英国(?:政府|公开)能力框架|同一职业面上|All[ -]?Night/i);
});

test("learner prose does not expose content-factory taxonomy or generation-wave labels", () => {
  const forbidden = /profession-baseline|反事实门禁|\bWave\s*\d+\b|\b(?:Worked example|Guided lab|Project handoff)\b/i;
  const findings = [];
  for (const page of pages) {
    for (const block of page.blocks) {
      const text = [block.title, ...(block.body ?? [])].join("\n");
      if (forbidden.test(text)) findings.push(`${page.id}: ${block.title}`);
    }
  }
  assert.deepEqual(findings, []);
});

test("learner section headings are complete sentences rather than concatenated generator fields", () => {
  const findings = [];
  for (const page of pages) {
    for (const block of page.blocks) {
      if (/。：|：.*：先用白话建立模型|：.*：把决策写成可检查模型/.test(block.title)) {
        findings.push(`${page.id}: ${block.title}`);
      }
    }
  }
  assert.deepEqual(findings, []);
});

test("learner prose does not contain punctuation introduced by template concatenation", () => {
  const findings = [];
  for (const page of pages) {
    for (const block of page.blocks) {
      const texts = [block.title, ...(block.body ?? [])];
      for (const text of texts) {
        if (/。。|。；|；。|，。|。：/.test(text)) findings.push(`${page.id}: ${text.slice(0, 120)}`);
      }
    }
  }
  assert.deepEqual(findings, []);
});

test("learner section headings do not append generic generator suffixes to a complete title", () => {
  const findings = [];
  for (const page of pages) {
    for (const block of page.blocks) {
      if (/：.*：(?:把 fixture 迁移到真实项目还缺什么|把结论拆回可观察组件)$/.test(block.title)) {
        findings.push(`${page.id}: ${block.title}`);
      }
    }
  }
  assert.deepEqual(findings, []);
});
