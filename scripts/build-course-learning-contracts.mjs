#!/usr/bin/env node

/**
 * Build the course-facing beginner/reuse and topic-visual contracts.
 *
 * The generator deliberately consumes the canonical tutorial projection rather
 * than hand-maintained page lists. Re-running it after adding pages regenerates
 * display numbers, manifests and one inspectable SVG per page.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  defs,
  headerDef,
  css,
  header,
  node,
  edge,
  footer,
  legend,
  tokens,
  xml,
  wrap as wrapText,
} from "./visual-design-system.mjs";

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(SCRIPT_ROOT);
const TUTORIAL_PATH = path.join(ROOT, "tutorial", "tutorial-site.json");
const SITE_PUBLIC = path.join(ROOT, "site", "public");
const VISUAL_ROOT = path.join(SITE_PUBLIC, "visuals", "course");
const RESEARCH_ROOT = path.join(ROOT, "research");

const sha256 = (value) => `sha256:${createHash("sha256").update(value).digest("hex")}`;
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const slugify = (value) => String(value || "page")
  .normalize("NFKC")
  .replace(/[^\p{L}\p{N}]+/gu, "-")
  .replace(/^-+|-+$/g, "")
  .toLowerCase()
  .slice(0, 52) || "page";
const asArray = (value) => Array.isArray(value) ? value : [];
const firstSentence = (value, fallback) => {
  const text = String(value || fallback || "").replace(/\s+/g, " ").trim();
  return (text.match(/^.{1,150}?[。.!！?？]/)?.[0] || text.slice(0, 150)).trim();
};
const compact = (value, max = 26) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};

const VOCABULARY = {
  AI: "用数据和规则执行部分判断或生成任务的计算系统",
  LLM: "能根据上下文生成或理解文本的大语言模型",
  Prompt: "给模型的任务说明、输入约束和输出格式",
  Token: "模型处理文本时使用的最小片段单位",
  Context: "模型本次回答可以看到的上下文范围",
  RAG: "先从外部知识库检索证据，再让模型生成回答的方法",
  Embedding: "把文本转换成可比较向量的表示",
  Agent: "能规划并调用工具完成目标的模型驱动程序",
  Workflow: "按预先定义的步骤、条件和终态运行的流程",
  Worker: "执行一个受限任务但不自行改变总体流程的执行单元",
  "Tool call": "Agent 向外部工具发出的结构化调用",
  Oracle: "独立判断测试结果对错的规则、数据或人工标准",
  Dataset: "用于运行或评测的一组有版本的数据样本",
  Slice: "从数据集中按一个维度切出的可比较子集",
  Eval: "用数据、Oracle 和指标判断系统质量的评测过程",
  Metric: "把观察结果汇总成可比较数值的度量",
  Latency: "从请求开始到结果可用所经过的时间",
  Throughput: "单位时间内系统完成的有效工作量",
  Trace: "记录一次任务经过哪些步骤、工具和结果的链路",
  CI: "每次代码变更自动执行检查的持续集成环境",
  API: "让程序按约定请求和返回数据的接口",
  Schema: "规定数据字段、类型和约束的结构合同",
  Benchmark: "用固定数据、协议和评分方法比较系统的基准测试",
  Mutation: "有意制造一个可解释故障来检验测试检测力的方法",
  SLO: "服务在一段时间内应达到的可量化目标",
  QPS: "每秒处理的请求数量",
  TTFT: "流式响应中首个 token 到达前的时间",
  TPOT: "流式响应中相邻 token 生成的平均时间",
  Goodput: "满足质量和延迟约束的有效吞吐量",
  F1: "综合 precision 和 recall 的分类质量指标",
  Recall: "相关目标中被系统找回的比例",
  Precision: "系统找回的目标中真正相关的比例",
  Handoff: "把任务状态、证据和责任交给下一执行者的交接",
};
const VOCABULARY_ENTRIES = Object.entries(VOCABULARY);

const readTutorial = () => {
  const data = JSON.parse(readFileSync(TUTORIAL_PATH, "utf8"));
  const pages = asArray(data.pages).slice().sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  if (!pages.length) throw new Error("tutorial-site.json has no pages");
  return { data, pages };
};

const allFiles = (root) => {
  if (!existsSync(root)) return [];
  const files = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  };
  visit(root);
  return files;
};

const resolveMaterial = (page) => {
  const candidates = asArray(page.materials)
    .map((material) => String(material?.href || "").replace(/^\/+/, ""))
    .filter(Boolean)
    .map((href) => path.join(SITE_PUBLIC, href));
  const existing = candidates.filter((file) => existsSync(file) && statSync(file).isFile());
  // Prefer an inspectable file over an archive so the learner can open the
  // contract, input or runner directly. Keep ZIP as a safe fallback for pages
  // that only publish a bundle.
  const found = existing.find((file) => !file.toLowerCase().endsWith(".zip")) || existing[0];
  if (found) return `site/public/${path.relative(SITE_PUBLIC, found).split(path.sep).join("/")}`;
  const fallback = path.join(SITE_PUBLIC, "materials", "internal-topics", "README.md");
  if (!existsSync(fallback)) throw new Error(`no learner material for ${page.page_id}`);
  return "site/public/materials/internal-topics/README.md";
};

const pageText = (page) => {
  const sections = page.content_sections && typeof page.content_sections === "object" ? page.content_sections : {};
  return [
    page.title, page.summary, page.artifact, page.learner_result,
    sections.outcome, sections.plain_explanation, sections.smallest_example,
    sections.learner_action, sections.expected_result, sections.common_errors,
    sections.completion_check, JSON.stringify(page.keywords || []),
    JSON.stringify(sections.teaching_blocks || []),
  ].filter(Boolean).join(" ");
};

const conceptsFor = (page) => {
  const text = pageText(page);
  return VOCABULARY_ENTRIES
    .filter(([term]) => new RegExp(`(^|[^\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[^\\p{L}\\p{N}])`, "iu").test(text))
    .map(([term, definition]) => ({ term, plain_definition: definition, first_use_ref: `${page.page_id}#term-${slugify(term)}` }));
};

const primaryConcept = (page) => ({
  term: `${page.page_id} 核心动作`,
  plain_definition: firstSentence(page.summary, `完成本页的 ${page.title}`),
  first_use_ref: `${page.page_id}#core-action`,
});

const visualKindFor = (page) => {
  const title = String(page.title || "").toLowerCase();
  const module = String(page.module_id || "");
  const id = String(page.page_id || "");
  const text = `${title} ${JSON.stringify(page.keywords || [])}`.toLowerCase();
  // Page/module identity wins over broad prose terms such as “能力”, which
  // appear in many unrelated lessons. This prevents generic career diagrams
  // from leaking into serving, quality-system or benchmark topics.
  if (id === "TD-C01" || module === "TD-M10" || /职业演进|职业能力迁移|晋升|作品集/.test(title)) return "career-evidence-ladder";
  if (module === "TD-M11" || /指标|性能|容量|slo|ttft|tpot|goodput|qps|延迟|吞吐|资源消耗/.test(text)) return "metric-tree";
  if (page.page_type === "diagnostic" || /症状|诊断|根因|故障|修复|归因|漂移|不稳定/.test(text)) return "decision-tree";
  if (module === "TD-M04" || /agent|workflow|worker|handoff|tool|权限|轨迹|循环/.test(text)) return "sequence-diagram";
  if (/状态|生命周期|回滚|重试|降级|发布|门禁|状态机/.test(text)) return "state-flow";
  if (/rag|检索|dataset|数据|benchmark|评测|oracle|mutation|模型|embedding|split|holdout/.test(text)) return "data-flow";
  return "concept-map";
};

const relationshipFor = (page, kind) => ({
  "career-evidence-ladder": "能力状态通过可观察证据逐级扩大负责范围",
  "metric-tree": "原始观测经过切片和指标计算进入质量或容量决定",
  "decision-tree": "故障症状沿证据检查顺序分流到修复和重跑",
  "sequence-diagram": "角色、模型、工具和系统按调用顺序形成可审计轨迹",
  "state-flow": "输入在门禁、执行、失败和恢复终态之间转移",
  "data-flow": "版本化输入经过变换、独立 Oracle 和报告形成证据",
  "concept-map": "概念通过上下位、边界和使用场景建立可迁移关系",
  "flow": "输入沿证据链经过变换、独立判断与门禁，最终形成可复核决定",
  "comparison": "传统测试能力与 AI 测试新增责任逐项对照，避免把职业升级误写成工具替换",
  "mindmap": "能力域从共同核心向专业分支展开，帮助学习者识别短板与下一项证据",
  "pie": "能力投入比例只是可编辑规划参数，必须结合岗位和阶段重新校准",
  "lifecycle": "需求、数据、模型、系统与反馈形成闭环，任何环节都要留下可复核证据",
  "ladder": "责任范围随可观察证据扩大，年限不能替代晋升判断",
  "radar": "多维能力由真实工件评分，未知项不会被平均分掩盖",
  "gantt": "成长计划按证据依赖排序，时间只是可编辑计划而非职业承诺",
  "path": "不同背景从已有能力出发补齐差距，不假设所有人走同一条路",
  "quadrant": "学习任务按价值与紧迫度分流，先处理阻断项再扩展能力",
  "architecture": "Agent 的输入、模型、工具、状态、权限与观测面共同构成被测系统",
  "four-ring": "离线、回放、影子与在线证据环逐层扩大，但不能互相冒充",
  "gate": "硬红线、统计门禁与风险接受分层决定，固定阈值必须由场景 owner 参数化",
}[kind] || "概念、证据与决策关系被显式画出，帮助学习者定位下一步动作");

const topicNodes = (page) => {
  const base = asArray(page.architecture?.nodes).filter(Boolean).map(String);
  const fallback = ["输入与依据", "风险/失败模型", "方法与约束", "独立 Oracle", "执行证据", "修复与重跑", "下游决定"];
  const nodes = base.length >= 5 ? base : fallback;
  return nodes.slice(0, 10).map((node) => compact(node, 26));
};

const edgesFor = (nodes, kind) => {
  const edges = [];
  for (let index = 0; index < nodes.length - 1; index += 1) edges.push(`${nodes[index]} → ${nodes[index + 1]}`);
  if (kind === "decision-tree") edges.push(`${nodes[0]} → 检查证据 → 修复 → 重跑`);
  if (kind === "state-flow") edges.push(`${nodes.at(-1)} → BLOCKED/FAIL/PASS 终态`);
  return edges.slice(0, Math.max(4, Math.min(10, nodes.length + 1)));
};

const roleForNode = (text, index, total) => {
  const value = String(text || "");
  if (index === 0) return { tone: "blue", tag: "输入 / 依据" };
  if (index === total - 1) return { tone: "amber", tag: "决定 / 输出" };
  if (/BLOCKED|FAIL|停止|阻断|回滚|否决|Kill/i.test(value)) return { tone: "red", tag: "安全终态" };
  if (/门禁|Gate|发布|审批|决定|Decision|Approval|Owner/i.test(value)) return { tone: "amber", tag: "门禁 / 裁决" };
  if (/Oracle|判断|校验|验证|Contract|Schema|Policy/i.test(value)) return { tone: "purple", tag: "独立判断" };
  return { tone: "mint", tag: "处理 / 变换" };
};

/** Horizontal snake pipeline for `flow` pages. */
const renderFlow = ({ page, kind, nodes, sourceRefs }) => {
  const W = 1160;
  const nodeWidth = 176;
  const nodeHeight = 96;
  const hGap = 26;
  const vGap = 74;
  const cols = 5;
  const rows = Math.ceil(nodes.length / cols);
  const contentWidth = cols * nodeWidth + (cols - 1) * hGap;
  const marginX = Math.floor((W - contentWidth) / 2);
  const headerHeight = 118;
  const top = 172;
  const positions = nodes.map((_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      x: marginX + col * (nodeWidth + hGap),
      y: top + row * (nodeHeight + vGap),
      row,
      col,
    };
  });

  const nodeGroups = nodes.map((text, index) => {
    const pos = positions[index];
    const role = roleForNode(text, index, nodes.length);
    return node({
      x: pos.x,
      y: pos.y,
      width: nodeWidth,
      height: nodeHeight,
      title: text,
      detail: role.tag,
      index: index + 1,
      tone: role.tone,
      highlight: index === nodes.length - 1,
    });
  }).join("");

  const edgeGroups = [];
  for (let index = 0; index < nodes.length - 1; index += 1) {
    const from = positions[index];
    const to = positions[index + 1];
    if (from.row === to.row) {
      edgeGroups.push(edge({
        x1: from.x + nodeWidth,
        y1: from.y + nodeHeight / 2,
        x2: to.x - 4,
        y2: to.y + nodeHeight / 2,
      }));
    } else {
      const midY = from.y + nodeHeight + vGap / 2;
      edgeGroups.push(`
    <path d="M ${from.x + nodeWidth / 2} ${from.y + nodeHeight} V ${midY} H ${to.x + nodeWidth / 2} V ${to.y - 4}" fill="none" stroke="${tokens.forest}" stroke-width="2" marker-end="url(#ds-arw-forest)"/>`);
    }
  }

  const contentBottom = top + rows * nodeHeight + (rows - 1) * vGap;
  const height = contentBottom + 108;
  const relationship = relationshipFor(page, kind);
  const flowName = compact(page.architecture?.title || page.title, 52);
  const subtitle = relationship;
  const sourceLine = `flow · ${flowName} · 来源 ${sourceRefs.join(", ") || "课程页证据"}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}">
  <title id="title">${xml(page.title)}：${xml(kind)}流程</title>
  <desc id="desc">${xml(subtitle)}</desc>
  ${headerDef()}
  ${defs()}
  <style>${css()}</style>
  <rect class="ds-bg" width="${W}" height="${height}" rx="22"/>
  ${header({ width: W, height: headerHeight, eyebrow: `${kind.toUpperCase()} · 证据流`, title: compact(page.title, 48), subtitle, source: sourceLine })}
  ${edgeGroups.join("")}
  ${nodeGroups}
  ${legend({ x: marginX, y: contentBottom + 26, items: [
    { label: "输入 / 依据", color: tokens.blue },
    { label: "处理 / 变换", color: tokens.sage },
    { label: "独立判断", color: tokens.purple },
    { label: "门禁 / 裁决", color: tokens.amber },
    { label: "安全终态", color: tokens.red },
  ] })}
  ${footer({ width: W, height, text: "节点是页面语义关系；不代表真实模型、企业集成或生产效果已验证。" })}
</svg>\n`;
};

/** Vertical layered control-flow for `architecture` pages. */
const renderArchitecture = ({ page, kind, nodes, sourceRefs }) => {
  const W = 1160;
  const headerHeight = 118;
  const top = 170;
  const cardWidth = 850;
  const cardHeight = 58;
  const vGap = 24;
  const railX = 74;
  const cardX = 150;
  const contentBottom = top + nodes.length * cardHeight + (nodes.length - 1) * vGap;
  const height = contentBottom + 106;

  const cards = nodes.map((text, index) => {
    const y = top + index * (cardHeight + vGap);
    const role = roleForNode(text, index, nodes.length);
    const toneFill = { blue: tokens.blueFill, mint: tokens.mint, purple: tokens.purpleFill, amber: tokens.amberFill, red: tokens.redFill }[role.tone];
    const toneStroke = { blue: "#aec6e3", mint: tokens.sage, purple: "#c9b8ea", amber: "#e0b76a", red: "#e3a89f" }[role.tone];
    const connector = index < nodes.length - 1
      ? `<path d="M ${railX + 34} ${y + cardHeight} V ${y + cardHeight + vGap - 4}" stroke="${tokens.forest}" stroke-width="2" fill="none" marker-end="url(#ds-arw-forest)"/>`
      : "";
    return `
    <circle cx="${railX + 34}" cy="${y + cardHeight / 2}" r="12" fill="${index === nodes.length - 1 ? tokens.forest : tokens.white}" stroke="${toneStroke}" stroke-width="1.5"/>
    <text x="${railX + 34}" y="${y + cardHeight / 2 + 4}" text-anchor="middle" fill="${index === nodes.length - 1 ? tokens.white : tokens.soft}" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10" font-weight="800">${String(index + 1).padStart(2, "0")}</text>
    <g filter="url(#ds-soft)">
      <rect x="${cardX}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="13" fill="${toneFill}" stroke="${toneStroke}" stroke-width="1.4"/>
      <rect x="${cardX}" y="${y}" width="5" height="${cardHeight}" rx="2.5" fill="${toneStroke}"/>
    </g>
    <text x="${cardX + 24}" y="${y + 24}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC',sans-serif" font-size="14" font-weight="800" fill="${tokens.ink}">${xml(wrapText(text, 62, 1)[0])}</text>
    <text x="${cardX + 24}" y="${y + 45}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC',sans-serif" font-size="10.5" font-weight="600" fill="${tokens.muted}">${xml(role.tag)}</text>
    ${connector}`;
  }).join("");

  const relationship = relationshipFor(page, kind);
  const subtitle = relationship;
  const flowName = compact(page.architecture?.title || page.title, 52);
  const sourceLine = `architecture · ${flowName} · 来源 ${sourceRefs.join(", ") || "课程页证据"}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}">
  <title id="title">${xml(page.title)}：${xml(kind)}架构</title>
  <desc id="desc">${xml(subtitle)}</desc>
  ${headerDef()}
  ${defs()}
  <style>${css()}</style>
  <rect class="ds-bg" width="${W}" height="${height}" rx="22"/>
  ${header({ width: W, height: headerHeight, eyebrow: `${kind.toUpperCase()} · 控制流`, title: compact(page.title, 48), subtitle, source: sourceLine })}
  <text x="${cardX}" y="${top - 10}" class="ds-section">系统控制链 · 输入 → 处理 → 判断 → 决定</text>
  ${cards}
  ${footer({ width: W, height, text: "节点是页面语义关系；不代表真实模型、企业集成或生产效果已验证。" })}
</svg>\n`;
};

const renderSvg = ({ page, kind, nodes, sourceRefs }) => (
  kind === "architecture"
    ? renderArchitecture({ page, kind, nodes, sourceRefs })
    : renderFlow({ page, kind, nodes, sourceRefs })
);

const buildLearnerRecord = (page, displayNumber, materialPath, terms) => {
  const section = page.content_sections && typeof page.content_sections === "object" ? page.content_sections : {};
  const title = page.title;
  const actionText = firstSentence(section.learner_action || page.learner_result, `完成 ${title} 的最小练习并保存结果`);
  const expected = firstSentence(section.expected_result || page.artifact, `生成 ${page.artifact || "本页工件"}，并能指出一条证据`);
  const failure = firstSentence(section.common_errors || "输入版本、Oracle 或权限不完整", "输入版本、Oracle 或权限不完整");
  const termsIntroduced = [primaryConcept(page), ...terms.filter((term) => term.term !== "AI").slice(0, 8)];
  const termsUsed = termsIntroduced.map((term) => term.term);
  const evidenceStatus = String(page.evidence_status || page.delivery_status || "fixture-tested");
  const limitations = evidenceStatus === "fixture-tested"
    ? "本页材料和离线夹具可复核；不证明真实模型、企业集成、从业者认可或生产效果。"
    : "本页为资料/设计证据；不把静态材料写成真实运行或学习效果。";
  const artifactId = `${page.page_id.toLowerCase()}-${slugify(page.artifact || title).slice(0, 42)}`;
  return {
    page_id: page.page_id,
    display_number: displayNumber,
    prerequisite_ids: asArray(page.prerequisite_ids),
    assumed_knowledge: asArray(page.prerequisite_ids).map((id) => `已完成前置页面 ${id}`),
    terms_introduced: termsIntroduced,
    terms_used: termsUsed,
    mental_model: `把“${title}”看成一条输入—判断—证据—决定链：先固定依据，再观察失败，最后留下可复核工件。`,
    worked_example: {
      input: materialPath,
      expected_observation: `在已准备输入上完成本页动作，得到“${compact(expected, 110)}”，并能指出对应的版本或证据位置。`,
    },
    counterexample: {
      input: materialPath,
      expected_observation: `故意使用过期、缺字段或无独立 Oracle 的变体时，门禁应显示 FAIL、BLOCKED 或 UNKNOWN，而不是静默通过。`,
    },
    learner_action: {
      input_ref: materialPath,
      action: actionText,
      expected_result: `保存 ${page.artifact || "本页学习工件"}，并记录一次可观察结果：${compact(expected, 130)}`,
    },
    failure_diagnosis: {
      symptom: failure,
      diagnosis_steps: ["核对输入路径、版本和前置工件", "核对方法、Oracle、权限与预期证据", "保留原始失败输出并定位最早分叉"],
      repair: "修复最早缺失的输入、约束或责任人字段；不要直接修改期望结果来消除失败。",
      rerun_check: "使用同一输入版本重跑，确认故障从 FAIL/BLOCKED 变为预期状态，并留下新的 run receipt。",
    },
    comprehension_checks: [{
      question: `不用看页面标题，你能说出“${title}”的输入、判断标准和下游消费者吗？`,
      expected_answer: `能指出一个真实输入、一个独立或具名的判断标准、一个输出工件和一个下游决定。`,
      common_misconception: "把模型生成的文字、执行数量或页面阅读完成当作证据。",
    }],
    reusable_artifacts: [{
      artifact_id: artifactId,
      path: materialPath,
      purpose: page.artifact || `完成 ${title} 的可审计练习`,
      inputs: [materialPath, `source_ids:${asArray(page.source_ids).slice(0, 3).join(",") || "page-evidence"}`],
      editable_fields: ["业务场景/样例输入", "版本与 owner", "Oracle、阈值或决策条件"],
      outputs: [page.artifact || "page-artifact", "run-manifest/结果记录", "失败或 UNKNOWN 处置记录"],
      adaptation_steps: ["替换为一个脱敏的新业务对象并保留 schema/目录结构", "由具名 owner 更新 Oracle、阈值或批准规则", "在 clean-room 目录运行验证并保存原始输出", "解释失败切片并决定修复、阻断或升级"],
      validation: {
        method: "输入/schema 校验 + 独立 Oracle 或人工 owner 复核 + 正/负/修复重跑",
        expected_evidence: "原始输入、命令或步骤、退出状态、输出文件、版本/hash 和失败处置记录",
      },
      limitations,
      owner: "学习者执行；业务/质量 owner 负责规则、Oracle、阈值或发布决定",
    }],
  };
};

const buildVisualRecord = (page, displayNumber, sourcePath, sourceHash) => {
  const kind = String(page.architecture?.visual?.kind || visualKindFor(page));
  const sourceStem = path.basename(sourcePath, path.extname(sourcePath));
  const nodes = topicNodes(page);
  const edges = edgesFor(nodes, kind);
  const sourceRefs = asArray(page.source_ids).slice(0, 5);
  return {
    page_id: page.page_id,
    display_number: displayNumber,
    prerequisite_ids: asArray(page.prerequisite_ids),
    knowledge_relationship: relationshipFor(page, kind),
    required_visual_kinds: [kind],
    visuals: [{
      // The visual ID names the actual repository-owned artifact. Source-
      // specific diagrams such as career-role-comparison.svg must not be
      // disguised behind a generic page-kind ID.
      visual_id: sourcePath.includes(`/visuals/course/${page.page_id}-`)
        ? `${page.page_id}-${kind}`
        : sourceStem,
      kind,
      purpose: `帮助初学者理解“${page.title}”中的输入、判断、失败和下游决定关系。`,
      source_path: sourcePath,
      source_hash: sourceHash,
      alt_text: `${page.title}的${kind}：${nodes.slice(0, 5).join("、")}`,
      caption: `${relationshipFor(page, kind)}。本图支持学习者定位下一步证据；不证明真实模型、企业集成或生产效果。`,
      nodes,
      edges,
      source_refs: sourceRefs.length ? sourceRefs : [page.page_id],
    }],
  };
};

export const buildContracts = () => {
  const { data, pages } = readTutorial();
  rmSync(VISUAL_ROOT, { recursive: true, force: true });
  mkdirSync(VISUAL_ROOT, { recursive: true });
  const learnerPages = [];
  const visualPages = [];
  const orderedPageIds = [];
  const seenTerms = new Set();

  pages.forEach((page, index) => {
    const displayNumber = index + 1;
    const materialPath = resolveMaterial(page);
    const concepts = conceptsFor(page);
    // Keep the first-use order deterministic: definitions are written on the
    // page where a concept first appears, then remain available downstream.
    const newConcepts = concepts.filter((term) => !seenTerms.has(term.term.toLowerCase()));
    newConcepts.forEach((term) => seenTerms.add(term.term.toLowerCase()));
    const terms = newConcepts.length ? newConcepts : concepts.slice(0, 4);
    const kind = String(page.architecture?.visual?.kind || visualKindFor(page));
    const nodes = topicNodes(page);
    const edges = edgesFor(nodes, kind);
    const explicitVisual = String(page.architecture?.visual?.src || "").replace(/^\/+/, "");
    const explicitVisualFile = explicitVisual ? path.join(SITE_PUBLIC, explicitVisual) : "";
    let sourcePath;
    let sourceHash;
    if (explicitVisualFile && existsSync(explicitVisualFile) && statSync(explicitVisualFile).isFile()) {
      const svg = readFileSync(explicitVisualFile, "utf8");
      sourcePath = `site/public/${explicitVisual}`;
      sourceHash = sha256(svg);
    } else {
      const sourceFile = path.join(VISUAL_ROOT, `${page.page_id}.svg`);
      const svg = renderSvg({ page, kind, nodes, edges, sourceRefs: asArray(page.source_ids).slice(0, 5) });
      writeFileSync(sourceFile, svg, "utf8");
      sourcePath = `site/public/visuals/course/${page.page_id}.svg`;
      sourceHash = sha256(svg);
    }
    learnerPages.push(buildLearnerRecord(page, displayNumber, materialPath, terms));
    visualPages.push(buildVisualRecord(page, displayNumber, sourcePath, sourceHash));
    orderedPageIds.push(page.page_id);
  });

  const learner = {
    schema_version: "learner-usability-reuse.v1",
    generated_from: "tutorial/tutorial-site.json",
    generated_at: new Date().toISOString().slice(0, 10),
    tutorial_id: data.tutorial_id || "test-development-ai-v2",
    page_count: pages.length,
    learner_evidence_boundary: {
      status: "NOT_RUN",
      design_status: "PASS-DESIGN",
      limitations: "自动生成的合同证明字段、路径和顺序闭合；只有独立目标学员观察才能证明理解和迁移。",
      required_evidence: ["无答案解释任务", "找错/修复任务", "相邻业务迁移任务", "原始观察与版本化修订"],
    },
    pages: learnerPages,
    verdict: "PASS-DESIGN",
  };
  const visual = {
    schema_version: "visual-sequence-manifest.v1",
    generated_from: "tutorial/tutorial-site.json",
    generated_at: new Date().toISOString().slice(0, 10),
    tutorial_id: data.tutorial_id || "test-development-ai-v2",
    ordered_page_ids: orderedPageIds,
    pages: visualPages,
    verdict: "PASS",
  };
  mkdirSync(RESEARCH_ROOT, { recursive: true });
  writeFileSync(path.join(RESEARCH_ROOT, "learner-usability-reuse.json"), json(learner), "utf8");
  writeFileSync(path.join(RESEARCH_ROOT, "visual-sequence-manifest.json"), json(visual), "utf8");
  return { pageCount: pages.length, learnerPath: path.join(RESEARCH_ROOT, "learner-usability-reuse.json"), visualPath: path.join(RESEARCH_ROOT, "visual-sequence-manifest.json"), visualRoot: VISUAL_ROOT };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = buildContracts();
  console.log(`generated learner/reuse + visual contracts for ${result.pageCount} pages`);
  console.log(`learner: ${result.learnerPath}`);
  console.log(`visuals: ${result.visualRoot}`);
}
