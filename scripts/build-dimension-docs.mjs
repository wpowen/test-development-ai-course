#!/usr/bin/env node
/**
 * 把逐页深度内容的 JSON 源渲染成仓库内的 Markdown 文档集。
 *
 * 为什么需要它：深度内容此前只存在于 TypeScript 模块里，只能被站点渲染器消费。
 * 落成 Markdown 之后，同一份内容可以被文档站、PDF、离线包、评审流程直接复用，
 * 也让「改内容」不再等于「改代码」。
 *
 * 单一事实来源是 `methodology/dimensions/_sources/<module>.json`；
 * TypeScript 模块与 Markdown 文档都是它的投影。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "methodology/dimensions/_sources");
const docsRoot = path.join(root, "methodology/dimensions");

const MODULES = {
  "agent-performance": { id: "TD-M11", title: "Agent 性能与稳定性工程" },
  "benchmark": { id: "TD-M06", title: "Benchmark 与分数工程" },
  "career-evolution": { id: "TD-M10", title: "职业演进" },
  "ai-serving": { id: "TD-M09", title: "AI 接口、性能与可靠性" },
  "agent-workflow": { id: "TD-M04", title: "测试 Agent、Worker 与 Workflow" },
  "quality-platform": { id: "TD-M07", title: "专业专题与 Capstone" },
  "ai-assisted-testing": { id: "TD-M02", title: "AI 帮你做传统测试" },
  "ai-foundations": { id: "TD-M01", title: "大模型与 AI 系统基础" },
  "rag-quality": { id: "TD-M03", title: "测试 LLM 和 RAG" },
  "quality-system": { id: "TD-M05", title: "建设 AI 质量系统" },
  "professional-specializations": { id: "TD-M08", title: "传统测试专项" },
};

/**
 * 引用台账。Markdown 侧与站点侧读同一份产物，因此两边的版本号不可能对不上。
 * 台账缺失时不静默降级——这个脚本的存在意义就是让文档与站点同构，
 * 少渲染一段引用而不报错，正是它过去最需要修掉的毛病。
 */
const libraryPath = path.join(root, "research/reference-library.json");
if (!fs.existsSync(libraryPath)) {
  throw new Error("missing research/reference-library.json — 先跑 scripts/build-reference-library.py");
}
const library = JSON.parse(fs.readFileSync(libraryPath, "utf8")).entries;

/** 表格单元格里的换行会破坏 Markdown 表结构，统一换成 <br>。 */
const cell = (value) => String(value).replaceAll("\n", "<br>");

const table = (headers, rows, caption) => {
  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
  ];
  if (caption) lines.push("", `> ${caption}`);
  return lines.join("\n");
};

/** 段落级引用在 Markdown 里渲染成一行可点击链接，与站点的「依据」小标签等价。 */
const refLine = (refs) => {
  const entries = (refs ?? []).map((id) => library[id]).filter(Boolean);
  if (!entries.length) return [];
  const links = entries.map((e) => (e.url ? `[${e.repo ?? e.title}](${e.url})` : e.title));
  return [`*依据：${links.join(" · ")}*`, ""];
};

/** 有 intro（二元组）+ table 的通用段，站点与文档共用同一套结构。 */
const tableSection = (section) => {
  if (!section) return [];
  return [
    `### ${section.title}`, "",
    section.intro[0], "",
    section.intro[1], "",
    table(section.table.headers, section.table.rows, section.table.caption), "",
    ...refLine(section.refs),
  ];
};

const GATE_STAGE = {
  redline: "第一段 · 硬红线（任一条不满足即阻断，无例外）",
  statistical: "第二段 · 统计门禁（看置信区间，不看点估计）",
  acceptance: "第三段 · 风险接受（不是通过/失败，是具名决策）",
};

const renderReferences = (pageId) => {
  const entries = Object.values(library).filter((e) => e.pages.includes(pageId));
  if (!entries.length) return [];
  const out = ["### 来源与延伸阅读", "",
    "版本号、许可证与最近提交由 GitHub API 在构建时抓取，不是手抄的。",
    "「不能证明」一列比「能证明」更重要：拿工具给结论背书，是本模块反复拆解的错误。", ""];
  for (const e of entries) {
    const anchor = e.anchor ? `${e.anchor.value}${e.anchor.date ? `（${e.anchor.date}）` : ""}` : "未锚定";
    out.push(`- **[${e.title}](${e.url})** — ${e.role}`);
    out.push(`  - 能证明：${e.whatItProves}`);
    out.push(`  - 不能证明：${e.whatItDoesNotProve}`);
    const meta = [e.repo ? `\`${e.repo}\`` : null, `版本 ${anchor}`, e.license ?? "许可证见原站", e.reuseNote]
      .filter(Boolean).join(" · ");
    out.push(`  - ${meta}`);
  }
  out.push("");
  return out;
};

/**
 * 渲染顺序与站点 `deep-layer.ts` 的 renderDeepBlocks 完全一致。
 *
 * 改造前这里只渲染六段（terms/method/counter/diagnosis/drill/takeaway），
 * 于是 JSON 里已经写好的 failure、evolution、archref、metrics、gate 全部没进 Markdown——
 * 文档每页只有 86 行，比站点薄一半，而且没有任何机制会报告这件事。
 * 现在两个投影读同一份结构、走同一个顺序，缺段会在下面的空数组处直接消失，不会悄悄错位。
 */
const renderPage = (pageId, c) => {
  const out = [`## ${pageId}`, ""];

  out.push(...tableSection(c.failure));

  out.push(`### ${c.terms.title}`, "", c.terms.intro, "");
  out.push(table(["术语", "一句话解释"], c.terms.rows,
    "更完整的中英对照见方法论 02 术语表；这里只收本页判断真正依赖的几个。"), "");
  out.push(...refLine(c.terms.refs));

  if (c.mechanism) {
    out.push(`### ${c.mechanism.title}`, "");
    c.mechanism.body.forEach((p) => out.push(p, ""));
    out.push(...refLine(c.mechanism.refs));
  }

  if (c.evolution) {
    out.push(...tableSection(c.evolution));
    out.push(`### ${c.evolution.invariantTitle}`, "",
      "下面这些不因为被测对象换成 AI 系统而失效。它们是上面那张表里「融合后的新做法」能够成立的前提——地基塌了，新做法只是换了个说法的空话。", "");
    c.evolution.invariant.forEach((item) => out.push(`- ${item}`));
    out.push("");
  }

  out.push(...tableSection(c.toolchain));
  out.push(...tableSection(c.archref));
  out.push(...tableSection(c.method));
  out.push(...tableSection(c.metrics));
  out.push(...tableSection(c.counter));
  out.push(...tableSection(c.diagnosis));

  out.push(`### ${c.drill.title}`, "", c.drill.intro, "");
  c.drill.steps.forEach((step, index) => out.push(`${index + 1}. ${step}`));
  out.push("", `**期望结果**：${c.drill.expected}`, "");
  if (c.drill.warning) out.push(`> ⚠ ${c.drill.warning}`, "");
  out.push(...refLine(c.drill.refs));

  if (c.gate) {
    out.push(`### ${c.gate.title}`, "", c.gate.intro[0], "", c.gate.intro[1], "");
    out.push(table(
      ["门禁段", "判据", "不满足时的处置"],
      [
        [GATE_STAGE.redline, c.gate.redline.join("\n"), "阻断发布，不进入后续两段"],
        [GATE_STAGE.statistical, c.gate.statistical.join("\n"), "样本量不足时结论为「证据不足」，不是「通过」"],
        [GATE_STAGE.acceptance, c.gate.acceptance.join("\n"), "由具名 owner 签字接受剩余风险后放行"],
      ],
      "三段顺序执行：红线不过不看统计，统计不过不进风险接受。第三段永远需要人，不能由脚本代签。",
    ), "");
    out.push(...refLine(c.gate.refs));
  }

  out.push(`### ${c.takeaway.title}`, "", c.takeaway.note[0], "", c.takeaway.note[1], "");
  c.takeaway.bullets.forEach((b) => out.push(`- ${b}`));
  out.push("");

  out.push(...renderReferences(pageId));
  return out.join("\n");
};

let written = 0;
for (const [slug, meta] of Object.entries(MODULES)) {
  const file = path.join(sourceDir, `${slug}.json`);
  if (!fs.existsSync(file)) throw new Error(`missing dimension source: ${slug}.json`);
  const content = JSON.parse(fs.readFileSync(file, "utf8"));
  const dir = path.join(docsRoot, slug);
  fs.mkdirSync(dir, { recursive: true });

  const pageIds = Object.keys(content);
  const index = [
    `# ${meta.title}（${meta.id}）深度内容`,
    "",
    "> 本目录由 `scripts/build-dimension-docs.mjs` 从 `methodology/dimensions/_sources/` 渲染生成。",
    "> 单一事实来源是那份 JSON；站点模块与本文档都是它的投影，请修改 JSON 而不是本文件。",
    "",
    `共 ${pageIds.length} 页。渲染顺序与站点 \`deep-layer.ts\` 完全一致，两个投影读同一份结构：`,
    "失效点 → 术语前置 → 能力机理与演进对照 → 工具链 → 架构索引 → 判断表 → 指标卡 →",
    "反例（含「为什么它看起来是对的」）→ 诊断树 → 演练 → 三段式门禁 → 带走物 → 来源与延伸阅读。",
    "",
    "页内「*依据：…*」与页尾来源清单里的版本号、许可证与最近提交，由",
    "`scripts/build-reference-library.py` 调 GitHub API 在构建时抓取，不是手写的。",
    "",
    "| 页面 | 文档 |",
    "| --- | --- |",
    ...pageIds.map((id) => `| ${id} | [${id}.md](${id}.md) |`),
    "",
    "## 证据边界",
    "",
    "所有数值为结构占位或来源观测，不得直接作为你系统的验收阈值。",
    "整体成熟度 `fixture-tested`；真实模型、企业集成、从业者评审与生产验证均 `NOT_RUN`。",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(dir, "README.md"), `${index}\n`);
  written += 1;

  for (const [pageId, pageContent] of Object.entries(content)) {
    const body = [
      `# ${pageId} 深度内容`,
      "",
      `> 模块 ${meta.id}《${meta.title}》。由 \`_sources/${slug}.json\` 生成，请勿直接编辑。`,
      "",
      renderPage(pageId, pageContent),
    ].join("\n");
    fs.writeFileSync(path.join(dir, `${pageId}.md`), body);
    written += 1;
  }
}
console.log(`dimension docs written: ${written} files across ${Object.keys(MODULES).length} modules`);
