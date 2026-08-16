#!/usr/bin/env node
/**
 * 把逐页术语与核心术语合并成站点术语表。
 *
 * 两个来源，两种读者：
 *   · methodology/glossary-core.json —— 贯穿全站的核心词，写给第一次见到这个词的人，
 *     每条有「是什么」和「测试开发为什么要关心它」两段。
 *   · methodology/dimensions/_sources/*.json 的 terms 表 —— 逐页术语，
 *     写给已经在该页上下文里的读者，一句话解释。
 *
 * 合并规则：核心词优先；逐页术语按首次出现的模块归属，同名只保留第一次出现的解释，
 * 并记录它出现在哪些页面，使读者能从术语跳回原文。
 *
 * 用法：node scripts/build-glossary.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = resolve(ROOT, "methodology/dimensions/_sources");
const CORE_PATH = resolve(ROOT, "methodology/glossary-core.json");
const DEEP_PATH = resolve(ROOT, "methodology/glossary-deep.json");
const OUT_TS = resolve(ROOT, "site/content/glossary.ts");

const core = JSON.parse(readFileSync(CORE_PATH, "utf8"));
const deep = JSON.parse(readFileSync(DEEP_PATH, "utf8"));

const pageGuidance = {
  "逐页术语": {
    mechanism: "这是页面判断所依赖的局部概念。先把输入、处理步骤、可观察输出和失败边界拆开，再决定采用哪一种测试方法。",
    testFocus: ["确认术语在本页的输入和输出", "为它绑定一个可观察的断言或工件", "出现冲突时保留 UNKNOWN/BLOCKED，而不是凭感觉补齐"],
    example: "打开它出现的页面，找到该词对应的案例或表格，用页面命令/模板复现一次，再记录实际结果。",
    pitfalls: ["只背中文译名不看使用边界", "把页面示例当通用阈值", "没有把术语落到输入、Oracle 和失败动作"],
    related: [],
    sourceIds: ["WIKI_SOFTWARE_TEST", "NIST_AI_RMF"]
  }
};

const toSources = (sourceIds = []) => sourceIds
  .map((id) => ({ id, ...deep.sourceRegistry[id] }))
  .filter((source) => source.url);

const enrich = (entry, fallbackCategory) => {
  const override = deep.termOverrides[entry.term] ?? {};
  const fallback = pageGuidance[fallbackCategory] ?? pageGuidance["逐页术语"];
  const merged = { ...fallback, ...override };
  return {
    ...entry,
    mechanism: merged.mechanism,
    testFocus: merged.testFocus,
    example: merged.example,
    pitfalls: merged.pitfalls,
    related: merged.related,
    sources: toSources(merged.sourceIds),
    staticExplanation: `${entry.plain} 机制：${merged.mechanism} 测试开发看什么：${merged.testFocus.join("；")} 可复用例子：${merged.example} 常见误区：${merged.pitfalls.join("；")} 延伸来源：${toSources(merged.sourceIds).map((source) => `${source.title}（${source.url}）`).join("；")}`,
  };
};

/** term -> { definition, pages: Set } */
const pageTerms = new Map();
for (const file of readdirSync(SOURCE_DIR).filter((name) => name.endsWith(".json"))) {
  const src = JSON.parse(readFileSync(resolve(SOURCE_DIR, file), "utf8"));
  for (const [pageId, page] of Object.entries(src)) {
    for (const [term, definition] of page.terms?.rows ?? []) {
      const key = term.trim();
      if (!pageTerms.has(key)) pageTerms.set(key, { definition, pages: [] });
      pageTerms.get(key).pages.push(pageId);
    }
  }
}

// 核心词与逐页词同名时以核心词为准，但保留逐页出处，方便跳回原文。
const coreNames = new Set(core.terms.map((entry) => entry.term));
const normalize = (value) => value.replace(/[（(].*?[)）]/g, "").trim().toLowerCase();
const coreAliases = new Set(
  core.terms.flatMap((entry) => [normalize(entry.term), ...(entry.aka ? entry.aka.split("、").map(normalize) : [])]),
);

const coreEntries = core.terms.map((entry) => {
  const matched = [...pageTerms.entries()].filter(([term]) => coreAliases.has(normalize(term)));
  return {
    ...enrich(entry, entry.category),
    kind: "core",
    pages: [...new Set(matched.flatMap(([, value]) => value.pages))].sort(),
  };
});

const pageEntries = [...pageTerms.entries()]
  .filter(([term]) => !coreNames.has(term) && !coreAliases.has(normalize(term)))
  .map(([term, value]) => enrich({
    term,
    kind: "page",
    category: "逐页术语",
    plain: value.definition,
    pages: [...new Set(value.pages)].sort(),
  }, "逐页术语"))
  .sort((a, b) => a.term.localeCompare(b.term, "zh-Hans-CN"));

const entries = [...coreEntries, ...pageEntries];

const banner = `/**
 * 站点术语表（生成产物，请勿直接编辑）。
 *
 * 由 scripts/build-glossary.mjs 从两处合并：
 *   · methodology/glossary-core.json —— ${coreEntries.length} 个核心词，写给第一次见到它的人
 *   · methodology/dimensions/_sources/*.json 的 terms 表 —— ${pageEntries.length} 个逐页术语
 *
 * 改术语请改上述来源后重新生成。
 */`;

const ts = [
  banner,
  "",
  "export type GlossaryEntry = {",
  "  term: string;",
  "  aka?: string;",
  "  kind: \"core\" | \"page\";",
  "  category: string;",
  "  /** 大白话解释：它是什么 */",
  "  plain: string;",
  "  /** 静态导出的单段解释，避免 GitHub 版丢失多维内容 */",
  "  staticExplanation: string;",
  "  /** 核心词才有：测试开发为什么要关心它 */",
  "  why?: string;",
  "  /** 多维解释：机制、测试关注点、例子、误区、关联词和来源 */",
  "  mechanism: string;",
  "  testFocus: string[];",
  "  example: string;",
  "  pitfalls: string[];",
  "  related: string[];",
  "  sources: { id: string; title: string; url: string; kind: string; accessed: string }[];",
  "  /** 出现在哪些页面，供跳回原文 */",
  "  pages: string[];",
  "};",
  "",
  `export const glossary: GlossaryEntry[] = ${JSON.stringify(entries, null, 2)};`,
  "",
  `export const glossaryCategories = ${JSON.stringify([...new Set(entries.map((e) => e.category))], null, 2)};`,
  "",
].join("\n");

writeFileSync(OUT_TS, ts, "utf8");
console.log(`术语表已生成：核心词 ${coreEntries.length} 条 + 逐页术语 ${pageEntries.length} 条 = ${entries.length} 条`);
