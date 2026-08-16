#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalogPages, pages as publicPages } from "../site/content/course.ts";
import { advancedQualityGapPages } from "../site/content/modules/advanced-quality-gaps.ts";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const researchDir = path.join(root, "research");
const topicSystemPath = path.join(researchDir, "course-topic-system-v3.md");
const curriculumPath = path.join(root, "curriculum.json");

const asOf = "2026-08-11";
const uniqueById = (items) => [...new Map(items.map((item) => [item.id, item])).values()];
const siteCatalogPages = uniqueById([...catalogPages, ...advancedQualityGapPages]);
const publicCatalogPages = uniqueById([...publicPages, ...advancedQualityGapPages]);
const siteCatalogLabel = `site-${siteCatalogPages.length}`;

const stageSpecs = [
  { id: "CAT-00", title: "职业责任、入场检查与路线", track: "orientation", level: "L0-entry", aiLane: "profession-baseline", ids: ["TD-000", "TD-001", "TD-002", "TD-003"] },
  { id: "CAT-01", title: "AI 系统基础", track: "ai-foundation", level: "L1-foundation", aiLane: "ai-foundation", ids: ["TD-201", "TD-202", "TD-203", "TD-204", "TD-205", "TD-206", "TD-207", "TD-208", "TD-209", "TD-210", "TD-X602"] },
  { id: "CAT-02", title: "测试生命周期与专业基线", track: "profession-lifecycle", level: "L1-foundation", aiLane: "profession-baseline", ids: ["TD-101", "TD-102", "TD-103", "TD-104", "TD-105", "TD-106", "TD-107", "TD-108", "TD-X101", "TD-X102", "TD-X103", "TD-X104", "TD-X105"] },
  { id: "CAT-03", title: "Evaluation、数据与统计基础", track: "eval-foundation", level: "L2-control", aiLane: "test-ai-systems", ids: ["TD-1001", "TD-1002", "TD-1003", "TD-1004", "TD-1005", "TD-1006", "TD-1007", "TD-1008"] },
  { id: "CAT-04", title: "AI 辅助测试全生命周期", track: "ai-assisted-work", level: "L2-control", aiLane: "use-ai-for-work", ids: ["TD-301", "TD-302", "TD-303", "TD-304", "TD-305", "TD-306", "TD-307", "TD-308", "TD-309", "TD-310"] },
  { id: "CAT-05", title: "LLM、RAG 与多模态质量", track: "llm-rag-quality", level: "L2-control", aiLane: "test-ai-systems", ids: ["TD-401", "TD-402", "TD-403", "TD-404", "TD-405", "TD-406", "TD-407", "TD-408", "TD-501", "TD-502", "TD-503", "TD-504", "TD-505", "TD-506", "TD-507", "TD-508", "TD-X501", "TD-X502"] },
  { id: "CAT-06", title: "Agent、Workflow 与安全", track: "agent-workflow-security", level: "L3-integrate", aiLane: "test-ai-systems", ids: ["TD-601", "TD-602", "TD-901", "TD-902", "TD-903", "TD-904", "TD-905", "TD-906", "TD-907", "TD-908", "TD-603", "TD-604", "TD-605", "TD-606", "TD-607", "TD-608", "TD-609", "TD-610", "TD-X601", "TD-X603", "TD-X604"] },
  { id: "CAT-07", title: "Serving、性能与稳定性", track: "serving-performance", level: "L3-integrate", aiLane: "build-ai-quality-system", ids: ["TD-701", "TD-702", "TD-703", "TD-704", "TD-705", "TD-706", "TD-707", "TD-708", "TD-AP01", "TD-AP02", "TD-AP03", "TD-AP04", "TD-AP05", "TD-AP06", "TD-AP07", "TD-AP08"] },
  { id: "CAT-08", title: "质量平台、Benchmark 与生产运营", track: "quality-platform-production", level: "L4-operate", aiLane: "build-ai-quality-system", ids: ["TD-1101", "TD-1102", "TD-1103", "TD-1104", "TD-1105", "TD-1106", "TD-1107", "TD-1108", "TD-1009", "TD-1010", "TD-X805"] },
  { id: "CAT-09", title: "Capstone、作品集与职业迁移", track: "capstone-career", level: "L4-operate", aiLane: "capstone", ids: ["TD-1201", "TD-1202", "TD-1203", "TD-1204", "TD-1205"] },
];

const supplementalTopics = [
  ["TD-X101", "静态测试、架构、代码与依赖质量", "怎样把设计评审、静态分析、依赖与供应链风险连接到可阻断证据？", "静态质量策略、规则集与依赖证据包", "profession-baseline-gap"],
  ["TD-X102", "数据库、数据管道与迁移质量", "怎样验证 Schema、数据质量、批流处理、回填和迁移不会破坏业务不变量？", "数据质量契约与迁移回滚实验", "profession-baseline-gap"],
  ["TD-X103", "Web 兼容、可访问性与本地化质量", "怎样把浏览器差异、辅助技术、语言和视觉变化变成可维护门禁？", "Web 兼容与可访问性测试矩阵", "profession-baseline-gap"],
  ["TD-X104", "Android 质量工程", "怎样验证生命周期、同步、权限、系统版本和设备矩阵下的业务旅程？", "Android 测试仓库与设备证据包", "profession-baseline-gap"],
  ["TD-X105", "iOS 质量工程", "怎样验证签名、权限、状态残留、系统弹窗和设备版本下的业务旅程？", "iOS 测试仓库与设备证据包", "profession-baseline-gap"],
  ["TD-X501", "多模态 AI 评测", "怎样分别验证文本、图像、音频、视频及跨模态对齐，而不是只看最终描述？", "多模态 Eval 数据集与分层报告", "ai-quality-gap"],
  ["TD-X502", "多语言、可访问性与包容性 AI 评测", "怎样验证不同语言、方言、读写能力和辅助技术场景下的质量差异？", "多语言与可访问性切片评测", "ai-quality-gap"],
  ["TD-X601", "公平性、伤害与人类监督有效性", "怎样识别群体差异、错误自动化信任和无效人工复核？", "公平性切片、伤害登记册与监督校准报告", "safety-governance-gap"],
  ["TD-X602", "训练、Fine-tuning 与模型更新质量", "训练数据、适配、模型更新和回滚怎样进入应用团队可审计的质量合同？", "模型更新测试计划与回归清单", "model-lifecycle-gap"],
  ["TD-X603", "长期 Memory、个性化与语义缓存质量", "怎样验证记忆写入、读取、遗忘、隔离、缓存命中和陈旧内容风险？", "Memory/Cache 状态机与隐私回归集", "agent-quality-gap"],
  ["TD-X604", "模型路由、Provider Fallback 与工具协议漂移", "多模型路由、降级、MCP/工具 Schema 变化时怎样保持语义、权限和可重放性？", "路由兼容矩阵与 Fallback 回归包", "agent-quality-gap"],
  ["TD-X805", "在线实验、Canary 与人工抽样评审", "没有实时黄金答案时，怎样用 Canary、代理信号和人工抽样支持发布与回滚？", "在线质量实验与抽样评审方案", "production-quality-gap"],
].map(([id, title, question, artifact, track]) => ({ id, title, question, artifact, track, sourceModuleId: "GAP", sourceModuleTitle: "主动发现的高风险缺口", addedByGapAudit: true }));

const curriculumAliasMap = {
  "TD-BASE-01": ["TD-000", "TD-002"],
  "TD-BASE-02": ["TD-103"],
  "TD-BASE-03": ["TD-105", "TD-106", "TD-107"],
  "TD-FOUND-01": ["TD-201"],
  "TD-FOUND-02": ["TD-202", "TD-203"],
  "TD-FOUND-03": ["TD-205", "TD-206", "TD-207", "TD-208", "TD-209"],
  "TD-FOUND-04": ["TD-001", "TD-210"],
  "TD-AI-01": ["TD-301", "TD-302"],
  "TD-AI-02": ["TD-303", "TD-305", "TD-306", "TD-307"],
  "TD-AI-03": ["TD-309"],
  "TD-AI-04": ["TD-304"],
  "TD-EVAL-01": ["TD-1001", "TD-1002", "TD-1003", "TD-1004"],
  "TD-EVAL-02": ["TD-402", "TD-407", "TD-1003", "TD-1005"],
  "TD-AI-05": ["TD-401", "TD-402", "TD-403", "TD-404", "TD-407", "TD-408"],
  "td-ai-006-rag-eval-ci": ["TD-501", "TD-502", "TD-503", "TD-504", "TD-505", "TD-506", "TD-507", "TD-508"],
  "TD-AI-07": ["TD-405", "TD-508"],
  "TD-AI-08": ["TD-601", "TD-602", "TD-604", "TD-605"],
  "TD-AI-09": ["TD-404", "TD-608", "TD-901", "TD-902", "TD-903", "TD-904", "TD-907"],
  "TD-AI-10": ["TD-X501"],
  "TD-AI-11": ["TD-308", "TD-609"],
  "TD-AI-12": ["TD-603", "TD-608", "TD-609"],
  "TD-AI-13": ["TD-308", "TD-305"],
  "TD-AI-14": ["TD-606", "TD-607", "TD-610"],
  "TD-AI-15": ["TD-1101"],
  "TD-AI-16": ["TD-1102", "TD-1103"],
  "TD-AI-17": ["TD-1104", "TD-1105"],
  "TD-AI-18": ["TD-1103", "TD-707"],
  "TD-AI-19": ["TD-1105", "TD-1106"],
  "TD-BENCH-01": ["TD-1001", "TD-1002", "TD-1003", "TD-1004"],
  "TD-BENCH-02": ["TD-1005", "TD-1008"],
  "TD-BENCH-03": ["TD-1006", "TD-1007"],
  "TD-BENCH-04": ["TD-1009", "TD-1010"],
  "TD-BASE-04": ["TD-101", "TD-301"],
  "TD-BASE-05": ["TD-102", "TD-107"],
  "TD-BASE-06": ["TD-104"],
  "TD-BASE-07": ["TD-105", "TD-306"],
  "TD-BASE-08": ["TD-X103", "TD-X104", "TD-X105"],
  "TD-BASE-09": ["TD-702", "TD-703", "TD-705", "TD-707"],
  "TD-BASE-10": ["TD-901", "TD-908", "TD-1104", "TD-1106"],
  "TD-AI-21": ["TD-701"],
  "TD-AI-22": ["TD-702", "TD-703", "TD-707"],
  "TD-AI-23": ["TD-704", "TD-705", "TD-706", "TD-707"],
  "TD-AI-24": ["TD-708", "TD-908"],
  "TD-AI-25": ["TD-704", "TD-1104", "TD-1105"],
  "TD-AI-26": ["TD-1205"],
  "TD-AI-20": ["TD-1204"],
};

const siteAliasMap = {
  "TD-F01": ["TD-000", "TD-002"],
  "TD-FP01": ["TD-001", "TD-301"],
  "TD-P01": ["TD-101", "TD-301"],
  "TD-P02": ["TD-301"],
  "TD-P03": ["TD-101", "TD-301"],
  "TD-P04": ["TD-102"],
  "TD-P05": ["TD-103", "TD-402"],
  "TD-P06": ["TD-105", "TD-305", "TD-306", "TD-307"],
  "TD-P07": ["TD-106", "TD-309"],
  "TD-P08": ["TD-107", "TD-108", "TD-310"],
  "TD-PS01": ["TD-306", "TD-701"],
  "TD-PS02": ["TD-306"],
  "TD-PS03": ["TD-306", "TD-602", "TD-603"],
  "TD-PS04": ["TD-307", "TD-X103"],
  "TD-PS05": ["TD-X103"],
  "TD-PS06": ["TD-X104"],
  "TD-PS07": ["TD-X105"],
  "TD-PS08": ["TD-X102"],
  "TD-PS09": ["TD-702", "TD-703", "TD-707"],
  "TD-PS10": ["TD-708", "TD-908"],
  "TD-PS11": ["TD-1104", "TD-1105"],
  "TD-PS12": ["TD-1106"],
  "TD-QP01": ["TD-301", "TD-1102", "TD-1107"],
  "TD-QP02": ["TD-1102", "TD-1107"],
  "TD-QP03": ["TD-1102", "TD-1108"],
  "TD-QP04": ["TD-1104", "TD-1107"],
  "TD-S01": ["TD-306", "TD-701"],
  "TD-S02": ["TD-X103", "TD-X104", "TD-X105"],
  "TD-S03": ["TD-702", "TD-703", "TD-705", "TD-707"],
  "TD-S04": ["TD-901", "TD-908", "TD-1104", "TD-1106"],
  "TD-F02": ["TD-201"],
  "TD-F03": ["TD-202", "TD-203"],
  "TD-F04": ["TD-205", "TD-206", "TD-207", "TD-208", "TD-209", "TD-210"],
  "TD-A01": ["TD-701"],
  "TD-A02": ["TD-701"],
  "TD-A03": ["TD-702", "TD-703", "TD-707"],
  "TD-A04": ["TD-705", "TD-706", "TD-707"],
  "TD-A05": ["TD-704"],
  "TD-A06": ["TD-708"],
  "TD-T01": ["TD-001", "TD-210"],
  "TD-T02": ["TD-206", "TD-208"],
  "TD-T03": ["TD-402", "TD-408"],
  "TD-T04": ["TD-401", "TD-1001", "TD-1002", "TD-1004"],
  "TD-T05": ["TD-301", "TD-302"],
  "TD-T06": ["TD-303", "TD-305"],
  "TD-T07": ["TD-304"],
  "TD-T08": ["TD-309"],
  "TD-T09": ["TD-401", "TD-402", "TD-403", "TD-404"],
  "TD-T10": ["TD-501", "TD-502", "TD-503"],
  "TD-T11": ["TD-403", "TD-404", "TD-504", "TD-505"],
  "TD-T12": ["TD-501", "TD-502", "TD-503", "TD-504", "TD-505", "TD-506", "TD-507", "TD-508"],
  "TD-T13": ["TD-405", "TD-508"],
  "TD-T14": ["TD-407"],
  "TD-T15": ["TD-601"],
  "TD-T16": ["TD-602", "TD-603"],
  "TD-T17": ["TD-901", "TD-902", "TD-903", "TD-904", "TD-907"],
  "TD-T18": ["TD-609"],
  "TD-T19": ["TD-305", "TD-308"],
  "TD-W01": ["TD-208", "TD-601"],
  "TD-W02": ["TD-604", "TD-605", "TD-606", "TD-607"],
  "TD-W03": ["TD-606", "TD-610"],
  "TD-T20": ["TD-1102"],
  "TD-T21": ["TD-1101"],
  "TD-T22": ["TD-1104", "TD-1105"],
  "TD-T23": ["TD-1103"],
  "TD-T24": ["TD-1105", "TD-1106"],
  "TD-B01": ["TD-1001", "TD-1005"],
  "TD-B02": ["TD-1002", "TD-1003", "TD-1004"],
  "TD-B03": ["TD-1005", "TD-1006"],
  "TD-B04": ["TD-1008"],
  "TD-B05": ["TD-1006", "TD-1007"],
  "TD-B06": ["TD-1009", "TD-1010"],
  "TD-T25": ["TD-1204"],
  "TD-C01": ["TD-1205"],
  "TD-C02": ["TD-003", "TD-1205"],
  "TD-C03": ["TD-003", "TD-1205"],
  "TD-C04": ["TD-003"],
  "TD-F05": ["TD-1001", "TD-1002", "TD-1003", "TD-1004"],
  "TD-T26": ["TD-308", "TD-310"],
  "TD-R01": ["TD-1205"],
  "TD-AP01": ["TD-AP01"],
  "TD-AP02": ["TD-AP02"],
  "TD-AP03": ["TD-AP03"],
  "TD-AP04": ["TD-AP04"],
  "TD-AP05": ["TD-AP05"],
  "TD-AP06": ["TD-AP06"],
  "TD-AP07": ["TD-AP07"],
  "TD-AP08": ["TD-AP08"],
  "TD-X602": ["TD-X602"],
  "TD-X101": ["TD-X101"],
  "TD-X501": ["TD-X501"],
  "TD-X502": ["TD-X502"],
  "TD-X601": ["TD-X601"],
  "TD-X603": ["TD-X603"],
  "TD-X604": ["TD-X604"],
  "TD-X805": ["TD-X805"],
  "TD-AG-00": ["TD-601", "TD-602"],
  "TD-AG-01": ["TD-407", "TD-1005"],
  "TD-AG-02": ["TD-601", "TD-602"],
  "TD-AG-03": ["TD-603", "TD-604", "TD-605"],
  "TD-AG-04": ["TD-606", "TD-607"],
  "TD-AG-05": ["TD-610", "TD-1006"],
  "TD-AG-06": ["TD-901", "TD-902", "TD-903", "TD-904", "TD-907"],
  "TD-AG-07": ["TD-702", "TD-703", "TD-707"],
  "TD-AG-08": ["TD-1101", "TD-1103", "TD-1104"],
  "TD-AG-09": ["TD-1105", "TD-X805"],
  "TD-AG-10": ["TD-907", "TD-908"],
};

const prereqOverrides = {
  "TD-000": [], "TD-001": ["TD-000"], "TD-002": ["TD-000"], "TD-003": ["TD-001", "TD-002"],
  "TD-201": ["TD-003"], "TD-X602": ["TD-210"],
  "TD-101": ["TD-210"], "TD-X101": ["TD-108"], "TD-X102": ["TD-X101"], "TD-X103": ["TD-X102"], "TD-X104": ["TD-X103"], "TD-X105": ["TD-X104"],
  "TD-1001": ["TD-X105"],
  "TD-301": ["TD-1004"],
  "TD-401": ["TD-1008"], "TD-501": ["TD-206", "TD-408"], "TD-X501": ["TD-408"], "TD-X502": ["TD-X501"],
  "TD-601": ["TD-208", "TD-408"], "TD-602": ["TD-601"],
  "TD-901": ["TD-602"], "TD-902": ["TD-901"], "TD-903": ["TD-901"], "TD-904": ["TD-901"], "TD-905": ["TD-903", "TD-904"], "TD-906": ["TD-901"], "TD-907": ["TD-902", "TD-903", "TD-904", "TD-906"], "TD-908": ["TD-907"],
  "TD-603": ["TD-602", "TD-901"], "TD-604": ["TD-603"], "TD-605": ["TD-604"], "TD-606": ["TD-605"], "TD-607": ["TD-606"], "TD-608": ["TD-907"], "TD-609": ["TD-603", "TD-605", "TD-608"], "TD-610": ["TD-609"],
  "TD-X601": ["TD-907"], "TD-X603": ["TD-604", "TD-903"], "TD-X604": ["TD-602", "TD-906", "TD-908"],
  "TD-701": ["TD-207", "TD-408", "TD-X604"], "TD-AP01": ["TD-610", "TD-708"],
  "TD-1101": ["TD-508", "TD-610", "TD-708"], "TD-1009": ["TD-1105", "TD-1008"], "TD-1010": ["TD-1009"], "TD-X805": ["TD-1105", "TD-1006"],
  "TD-1201": ["TD-310", "TD-1106"], "TD-1202": ["TD-508", "TD-1106"], "TD-1203": ["TD-610", "TD-AP08", "TD-1106"], "TD-1204": ["TD-1010", "TD-X805"], "TD-1205": ["TD-1201", "TD-1202", "TD-1203", "TD-1204"],
};

function parseTopicSystem() {
  const lines = fs.readFileSync(topicSystemPath, "utf8").split(/\r?\n/);
  const topics = [];
  let moduleId = "";
  let moduleTitle = "";
  for (const line of lines) {
    const moduleMatch = line.match(/^## (M\d+)\s+(.+)$/);
    if (moduleMatch) {
      moduleId = moduleMatch[1];
      moduleTitle = moduleMatch[2];
      continue;
    }
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    if (cells.length === 4 && /^TD-(?:\d+|AP\d+)$/.test(cells[0])) {
      topics.push({ id: cells[0], title: cells[1], question: cells[2], artifact: cells[3], sourceModuleId: moduleId, sourceModuleTitle: moduleTitle, addedByGapAudit: false });
    }
  }
  if (topics.length !== 105) throw new Error(`expected 105 source topics, found ${topics.length}`);
  return topics;
}

function getLegacyCurriculum() {
  const current = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
  const legacy = current.legacy_courses ?? current.courses;
  if (!Array.isArray(legacy) || legacy.length !== 46) throw new Error(`expected preserved 46-course legacy catalog, found ${legacy?.length}`);
  return legacy;
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join(";") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(relativePath, value) {
  fs.writeFileSync(path.join(root, relativePath), value.endsWith("\n") ? value : `${value}\n`);
}

const sourceTopics = parseTopicSystem();
const legacyCurriculum = getLegacyCurriculum();
const allTopicsById = new Map([...sourceTopics, ...supplementalTopics].map((topic) => [topic.id, topic]));
const canonicalOrder = stageSpecs.flatMap((stage) => stage.ids);
if (canonicalOrder.length !== 117 || new Set(canonicalOrder).size !== 117) throw new Error("canonical order must contain 117 unique topics");
for (const id of canonicalOrder) if (!allTopicsById.has(id)) throw new Error(`canonical order references missing topic ${id}`);
for (const id of Object.keys(curriculumAliasMap)) if (!legacyCurriculum.some((course) => course.course_id === id)) throw new Error(`legacy curriculum alias map references unknown ID ${id}`);
for (const course of legacyCurriculum) if (!curriculumAliasMap[course.course_id]) throw new Error(`legacy curriculum ID is unmapped: ${course.course_id}`);
for (const page of siteCatalogPages) if (!siteAliasMap[page.id]) throw new Error(`site catalog ID is unmapped: ${page.id}`);
for (const id of Object.keys(siteAliasMap)) if (!siteCatalogPages.some((page) => page.id === id)) throw new Error(`site alias map references unknown ID ${id}`);
for (const targets of [...Object.values(curriculumAliasMap), ...Object.values(siteAliasMap)]) for (const id of targets) if (!allTopicsById.has(id)) throw new Error(`alias targets unknown canonical ID ${id}`);

const stageByTopic = new Map();
for (const stage of stageSpecs) stage.ids.forEach((id, index) => stageByTopic.set(id, { ...stage, index }));

const siteAliasesByCanonical = new Map(canonicalOrder.map((id) => [id, []]));
for (const page of siteCatalogPages) {
  for (const canonicalId of siteAliasMap[page.id]) siteAliasesByCanonical.get(canonicalId).push({ source_catalog: siteCatalogLabel, source_id: page.id, title: page.title, delivery_status: page.status, public: publicCatalogPages.some((candidate) => candidate.id === page.id) });
}
const curriculumAliasesByCanonical = new Map(canonicalOrder.map((id) => [id, []]));
for (const course of legacyCurriculum) {
  for (const canonicalId of curriculumAliasMap[course.course_id]) curriculumAliasesByCanonical.get(canonicalId).push({ source_catalog: "curriculum-46", source_id: course.course_id, title: course.title, delivery_status: course.delivery_status ?? "planned" });
}

const maturityRank = { unmeasured: 0, "desk-researched": 1, "fixture-tested": 2, "live-tested": 3, "practitioner-reviewed": 4, "production-validated": 5 };
const canonicalTopics = canonicalOrder.map((id, globalIndex) => {
  const topic = allTopicsById.get(id);
  const stage = stageByTopic.get(id);
  const siteAliases = siteAliasesByCanonical.get(id);
  const curriculumAliases = curriculumAliasesByCanonical.get(id);
  const observedMaturities = siteAliases.map((alias) => alias.delivery_status).filter((status) => maturityRank[status] !== undefined);
  const evidenceMaturity = observedMaturities.sort((a, b) => maturityRank[b] - maturityRank[a])[0] ?? "unmeasured";
  const hasFixtureSubtopic = evidenceMaturity === "fixture-tested";
  const directCanonicalPage = siteAliases.some((alias) => alias.source_id === id);
  const deliveryStatus = siteAliases.length ? "outlined" : topic.addedByGapAudit ? "gap" : "planned";
  const previousId = stage.index > 0 ? stage.ids[stage.index - 1] : null;
  const prerequisiteIds = prereqOverrides[id] ?? (previousId ? [previousId] : []);
  const aliases = [...curriculumAliases, ...siteAliases];
  return {
    canonical_id: id,
    canonical_order: globalIndex + 1,
    stage_id: stage.id,
    stage_title: stage.title,
    source_module_id: topic.sourceModuleId,
    source_module_title: topic.sourceModuleTitle,
    title: topic.title,
    controlling_question: topic.question,
    learner_artifact: topic.artifact,
    learner_level: stage.level,
    ai_lane: stage.aiLane,
    knowledge_tracks: [stage.track, topic.track].filter(Boolean),
    prerequisite_ids: prerequisiteIds,
    delivery_status: deliveryStatus,
    evidence_maturity: evidenceMaturity,
    maturity_scope: hasFixtureSubtopic ? `fixture evidence belongs only to aliases: ${siteAliases.filter((alias) => alias.delivery_status === "fixture-tested").map((alias) => alias.source_id).join(", ")}` : evidenceMaturity === "desk-researched" ? "legacy page text only; independent canonical-topic package is missing" : "no execution or practitioner evidence",
    content_gate: "blocked",
    coverage_decision: directCanonicalPage ? "deliver-canonical-page" : topic.addedByGapAudit && siteAliases.length ? "cover-via-existing-page-alias" : topic.addedByGapAudit ? "add-gap-and-research" : aliases.length ? "retain-canonical-topic-and-migrate-aliases" : "retain-planned-canonical-topic",
    aliases,
    unknowns: directCanonicalPage ? ["fixture evidence does not establish live, practitioner, publication, or production maturity"] : topic.addedByGapAudit && siteAliases.length ? ["existing page alias covers the topic; canonical split and practitioner review are not complete"] : topic.addedByGapAudit ? ["evidence triangulation and page split decision not completed"] : ["canonical topic does not yet have its own validated nine-file research package"],
  };
});

const manifest = {
  schema_version: "1.0",
  profession_id: "test-development-ai",
  as_of: asOf,
  canonical_policy: {
    source: "research/course-topic-system-v3.md plus explicit high-risk gap cells",
    sequence: "orientation -> AI foundation -> testing lifecycle -> Eval foundation -> AI-assisted work -> LLM/RAG -> Agent/security -> Serving/performance -> quality platform/production/Benchmark -> Capstone",
    status_policy: "A legacy title, site page, or fixture cannot promote a canonical topic. Delivery and evidence maturity are independent; every canonical topic remains content-gate blocked until its own research package and page-type gates pass.",
  },
  source_catalog_counts: { topic_system: 105, curriculum_contracts: 46, site_catalog: siteCatalogPages.length, site_public_projection: publicCatalogPages.length },
  canonical_counts: { total: 117, retained_from_topic_system: 105, proactive_high_risk_gaps: 12, uncovered_high_risk_gaps: canonicalTopics.filter((topic) => topic.coverage_decision === "add-gap-and-research").length },
  stages: stageSpecs.map(({ ids, ...stage }) => ({ ...stage, topic_count: ids.length, topic_ids: ids })),
  topics: canonicalTopics,
};
writeJson("research/course-catalog-manifest.json", manifest);

const migrationRows = [["source_catalog", "source_id", "source_title", "canonical_ids", "relation", "source_delivery_status", "source_evidence_maturity", "coverage_decision", "notes"]];
for (const topic of sourceTopics) migrationRows.push(["topic-system-105", topic.id, topic.title, topic.id, "canonical-source", "planned", "unmeasured", "retain", "source topic remains canonical; publication requires an independent package"]);
for (const topic of supplementalTopics) migrationRows.push(["gap-audit-12", topic.id, topic.title, topic.id, "canonical-gap", "gap", "unmeasured", "add-gap-and-research", "not complete; evidence and split decision required"]);
for (const course of legacyCurriculum) migrationRows.push(["curriculum-46", course.course_id, course.title, curriculumAliasMap[course.course_id], curriculumAliasMap[course.course_id].length === 1 ? "alias" : "split-alias", course.delivery_status ?? "planned", course.delivery_status === "fixture-tested" ? "fixture-tested" : "unmeasured", "migrate-without-promotion", "legacy contract preserved as alias"]);
for (const page of siteCatalogPages) migrationRows.push([siteCatalogLabel, page.id, page.title, siteAliasMap[page.id], siteAliasMap[page.id].length === 1 ? "alias" : "split-or-merge-alias", page.status, maturityRank[page.status] !== undefined ? page.status : "unmeasured", page.id.startsWith("TD-X") ? "deliver-canonical-page" : "rebuild-under-canonical-topic", publicCatalogPages.some((candidate) => candidate.id === page.id) ? `currently in ${publicCatalogPages.length}-page public projection; public visibility is not a completion gate` : "currently internal outlined page"]);
writeText("research/course-catalog-migration.csv", migrationRows.map((row) => row.map(csvCell).join(",")).join("\n"));

const canonicalCurriculum = {
  version: "4.0",
  career_id: "test-development-ai",
  last_verified: asOf,
  architecture_profile: "ai-quality-engineer",
  canonical_catalog: "research/course-catalog-manifest.json",
  migration_table: "research/course-catalog-migration.csv",
  release_scope: "internal-catalog-only",
  catalog_complete: false,
  course_count: 46,
  compatibility_course_count: 46,
  canonical_course_count: 117,
  courses: legacyCurriculum,
  canonical_topics: canonicalTopics.map((topic) => ({
    canonical_id: topic.canonical_id,
    title: topic.title,
    stage_id: topic.stage_id,
    learner_level: topic.learner_level,
    ai_lane: topic.ai_lane,
    prerequisite_ids: topic.prerequisite_ids,
    knowledge_tracks: topic.knowledge_tracks,
    controlling_question: topic.controlling_question,
    learner_artifact: topic.learner_artifact,
    delivery_status: topic.delivery_status,
    evidence_maturity: topic.evidence_maturity,
    content_gate: topic.content_gate,
    coverage_decision: topic.coverage_decision,
    alias_ids: topic.aliases.map((alias) => alias.source_id),
  })),
  legacy_courses: legacyCurriculum,
};
writeJson("curriculum.json", canonicalCurriculum);

const mapLines = [
  "# 测试开发 × AI：Canonical 课程地图",
  "",
  `更新时间：${asOf}`,
  "",
  `本地图只描述内部课程目录和依赖，不声明公开课程已经完成。Canonical 目录包含 117 个主题：105 个既有专业命题，加 12 个主动审计发现的高风险缺口。46 个旧课程合同和 ${siteCatalogPages.length} 个站点 ID 均保留在迁移表中作为 alias，不再作为独立完成事实。`,
  "",
  "## 依赖主线",
  "",
  "`职业责任 → AI 基础 → 测试生命周期 → Eval 数据/Oracle/统计 → AI 辅助测试 → LLM/RAG → Agent + 安全 → Serving/性能 → 质量平台/生产/Benchmark → Capstone`",
  "",
  "任何阶段都必须通过工件退出考核；观看页面、静态渲染、共享 Fixture 或旧 alias 状态不能跳过前置能力。",
  "",
];
for (const stage of stageSpecs) {
  mapLines.push(`## ${stage.id}：${stage.title}`, "", "| 顺序 | Canonical ID | 主题 | 前置 | Delivery | Evidence maturity |", "| ---: | --- | --- | --- | --- | --- |");
  for (const id of stage.ids) {
    const topic = canonicalTopics.find((candidate) => candidate.canonical_id === id);
    mapLines.push(`| ${topic.canonical_order} | ${id} | ${topic.title} | ${topic.prerequisite_ids.join("；") || "—"} | ${topic.delivery_status} | ${topic.evidence_maturity} |`);
  }
  mapLines.push("");
}
mapLines.push("## 状态边界", "", "- `planned`：有 canonical 学习合同，但没有独立正文。", "- `outlined`：存在旧页面或别名材料，但 canonical topic 的九文件研究包和页面门禁尚未通过。", "- `gap`：证据显示能力可能重要，但尚未完成研究裁决。", "- `fixture-tested` 只描述指定 alias 的离线执行证据，不升级 canonical topic 的内容完成度。", "- 当前 117 个 canonical topic 的 `content_gate` 全部保持 `blocked`；TD-P02 的 Fixture 证据单独保留，不外推到 TD-301 全命题或整课。", "");
writeText("course-map.md", mapLines.join("\n"));

const decisionLines = [
  "# Course Catalog Coverage Decisions",
  "",
  `更新时间：${asOf}`,
  "",
  "## Decision",
  "",
  `选择 research/course-topic-system-v3.md 的 105 个专业命题作为稳定知识主干，并新增 12 个主动审计高风险单元，形成 117 个 canonical topic。旧 46 课程合同和站点 ${siteCatalogPages.length} ID 不删除，全部通过 migration CSV 映射到 canonical ID。`,
  "",
  "## 为什么不选 46 或 81",
  "",
  "- 46 课程合同是过薄的阶段合同，多数把多个独立职业结果合并在一课。",
  `- ${siteCatalogPages.length} 个站点 ID 中仍有内部 outlined 页面；${publicCatalogPages.length} 个公开页也不等于逐命题研究完成。`,
  "- 105 命题树覆盖专业主干，但仍漏掉若干传统专项和 AI 前沿责任，所以只作为主干，不冒充最终完整性。",
  "",
  "## 合并与 alias 规则",
  "",
  "- `TD-S01～S04` 合并到 API/平台/安全等 canonical 主题，保留 alias。",
  "- `TD-F04` 与 `TD-T01/T02` 分解映射到 AI 系统结构主题。",
  "- `TD-T05～T08` 与 `TD-P01～P08` 映射到需求、风险、设计、执行和发布 canonical 主题。",
  "- `TD-A01～A06`、`TD-PS09～PS12` 和 `TD-AP01～AP08` 按协议、指标、工作负载、诊断、容量、降级和 Agent 任务性能拆分。",
  "- 一个旧 ID 映射多个 canonical ID 时记为 `split-alias`；多个旧 ID 指向同一 canonical ID 时记为 merge aliases。任何 alias 的成熟度只在原 scope 内有效。",
  "- TD-PS08、TD-PS05、TD-PS06、TD-PS07 分别作为 TD-X102、TD-X103、TD-X104、TD-X105 的覆盖 alias；保留原页面，不重复新建数据库、Web、Android、iOS 页面。",
  "",
  "## 主动新增的 12 个 gap",
  "",
  ...supplementalTopics.map((topic) => `- ${topic.id} ${topic.title}：${topic.question}`),
  "",
  "## 当前 coverage verdict",
  "",
  "- Canonical topics：117。",
  "- 可宣称 complete：0。",
  "- 内容门禁：117 blocked；目录覆盖不等于内容、从业者或发布门禁通过。",
  `- 主动高风险 coverage gap：${canonicalTopics.filter((topic) => topic.coverage_decision === "add-gap-and-research").length}；8 个 canonical 新页和 4 个专项 alias 已有明确落点。`,
  "- 旧站点中最强的执行证据仍是少数 Fixture；只有对应 alias 可记录该 maturity。",
  "- 真实模型、真实平台、从业者评审和学习效果继续为 Unknown。",
  "",
  "## 下一步",
  "",
  "先按 canonical 顺序完成第一条 12 页初学者路径的逐命题研究与正文，再进入 Eval、LLM/RAG、Agent 和生产路线。禁止从 Agent 压测或平台集成页绕过 AI 基础、Eval 和安全前置。",
];
writeText("research/course-coverage-decisions.md", decisionLines.join("\n"));

const gapAnalysis = `# 测试开发 × AI：课程专业度缺口审计

更新时间：${asOf}

## Research corpus

本次目录恢复沿用六类证据系统：职业知识体系、真实工作与从业信号、AI 一手技术、开源实现与 Benchmark、课程供给、失败与学习者反证。当前任务只修复课程目录真相，没有新增 live、practitioner 或 production 证据。

## Industry body of knowledge

Canonical 目录保留测试职业的风险、需求、Oracle、数据环境、自动化、执行诊断、发布和生产反馈链，并新增静态质量、数据管道、Web、Android、iOS 五个传统专项 gap。它们均未被标记完成。

## Real work and practitioner evidence

现有职业与工程证据支持这些能力进入目录，但尚无可追踪从业者签字、真实企业流程回读或目标学员工件证据。旧页面存在不等于职业可用性通过。

## Existing course supply

市场供给只能帮助识别结构和差异化，不能证明课程有效。旧版以 46、52、81 等不同数量表达课程范围，已造成完成度错觉。本次以 117 个 canonical topic 作为内部 backlog，不对外承诺完整课程。

## AI technology and benchmark frontier

目录补入多模态、多语言、Fine-tuning/模型更新、Memory/语义缓存、模型路由/Fallback/MCP 漂移、公平性与人工监督、在线实验七类 AI 高风险 gap。它们需要单独研究，不能由标题直接进入正文。

## Coverage matrix

- 原专业命题树：105。
- 旧 curriculum 合同：46。
- 站点内部页面：${siteCatalogPages.length}，其中公开投影 ${publicCatalogPages.length}、内部页面 ${siteCatalogPages.length - publicCatalogPages.length}。
- Canonical 目录：117，包含 105 个保留命题和 12 个新增 gap。
- Canonical complete：0；content gate blocked：117。

映射事实见 \`research/course-catalog-migration.csv\`；每个主题的状态、成熟度、前置和 alias 见 \`research/course-catalog-manifest.json\`。

Coverage 决策遵循“命题、课程合同、页面 ID 三层分离”：117 个 canonical topic 回答“知识与能力应该覆盖什么”，46 个 legacy curriculum contract 继续服务现有工厂验证和历史引用，${siteCatalogPages.length} 个 site ID 只记录当前页面投影。三者通过迁移表连接，但互不冒充完成证据。一个旧课程或页面映射到多个 canonical topic，表示旧单元过宽，需要拆分生产；多个旧 ID 指向同一 canonical topic，表示重复入口，应保留 alias 而不重复计算主题数量。

当前 delivery 分布只表示材料存在形态：有旧页面映射的主题为 outlined，没有页面投影的主题为 planned，新增的高风险能力为 gap。Evidence maturity 只继承能够明确归属的旧证据，而且作用域固定为 alias；即使某个旧页面存在 fixture-tested 结果，也不能证明其映射到的整个 canonical topic、相邻主题或学习路径已经可用。所有 117 个主题继续保持 content gate blocked。

## Missing and overrepresented topics

缺失或过薄：静态与供应链质量、数据库/数据管道/迁移、Web/移动端独立工程链、多模态、多语言、AI 公平性、人类监督、训练更新、长期 Memory、模型路由/Fallback、在线质量实验。

过度代表：工具或平台名称、共享模拟器、同一通用正文模板，以及需求/性能/平台主题在多套 ID 中重复出现。

## Expert review

### Profession veteran

恢复测试生命周期和专项，但要求后续逐主题验证真实工件、决策权和失败成本。

### AI systems engineer

要求 AI 基础先于 LLM/RAG/Agent，安全和协议边界先于可写 Agent，Serving 指标必须绑定采集点和工作负载。

### Evaluation and quality expert

要求 Eval 数据、Oracle、Holdout、Scorer 和统计在应用专题之前；Fixture maturity 不得外推。

### Curriculum designer

新顺序固定为：职业责任 → AI 基础 → 测试生命周期 → Eval → AI 辅助 → LLM/RAG → Agent+安全 → Serving/性能 → 质量平台/生产 → Capstone。

### Market and learner researcher

主题数量不是差异化。学习者需要逐页工件、真实动作、失败诊断、修复和迁移，而不是更多导航标题。

### Adversarial critic

旧“52/52 正文完成”和“33/33 深度正文”与当前研究包事实冲突，已从 canonical 文档删除。任何页面或 alias 状态都不能升级 canonical topic。

## Curriculum decisions

1. 使用 117-topic canonical manifest 作为唯一内部课程目录。
2. 46 个旧合同和 ${siteCatalogPages.length} 个站点 ID 全部保留为 alias，不删除历史，也不重复计数。
3. 12 个主动缺口均已有直接 canonical 页面或既有专项 alias；coverage gap 为 0，但内容、从业者和发布门禁仍分别关闭。
4. Delivery 与 evidence maturity 分开；别名 Fixture 不升级内容完整度。
5. 每个 canonical topic 必须拥有自己的九文件研究包，才能离开 planned/outlined/gap。
6. 先修完整初学者路径，再扩展高级专题；不从 Agent 性能或平台页绕过基础。

### Delivery sequence and exit evidence

每个阶段必须先产出可复核工件再进入下一阶段。职业与 AI 基础阶段要求风险声明、系统边界和失败停止条件；测试生命周期阶段要求需求到 Oracle、数据、环境、执行、诊断和发布的可追踪链；Eval 阶段要求数据版本、Holdout、Scorer、统计与失败分析；LLM/RAG 和 Agent 阶段必须增加协议、权限、安全、可重放与回归证据；Serving、性能、平台和生产阶段必须绑定真实采集点、工作负载、容量、降级、发布与回滚。Capstone 必须组合前述证据，不能用演示截图替代。

目录顺序修复只解决生产路线和依赖真相，不自动补齐任何正文。后续每个 topic 仍要独立完成职业证据、AI 一手来源、反证、样本、工件、练习、自检、边界和来源九类材料，并通过对应页面类型的验证器。若一个主题无法给出真实动作、可运行样本、失败诊断和迁移说明，应继续 blocked，而不是用更长的概念说明填充。

## Remaining unknowns

- 12 个新增 gap 的页面落点已裁决；数据库、Web、Android、iOS 复用既有专项页，其余 8 个使用独立 canonical 页面。真实职业有效性仍待复核。
- 没有从业者盲评、目标学员试学和生产环境证据。
- 真实模型、真实 RAG、真实 Agent 权限、真实 Jira/GitLab/Kubernetes、浏览器与移动端集成仍未验证。
- 当前目录可用于恢复课程生产顺序，不能用于声称课程、职业能力或商业效果已完成。
`;
writeText("curriculum-gap-analysis.md", gapAnalysis);

console.log(JSON.stringify({ canonical: canonicalTopics.length, sourceTopics: sourceTopics.length, supplementalGaps: supplementalTopics.length, uncoveredHighRiskGaps: canonicalTopics.filter((topic) => topic.coverage_decision === "add-gap-and-research").length, legacyCurriculum: legacyCurriculum.length, siteCatalog: siteCatalogPages.length, publicSite: publicCatalogPages.length, aliasSourceIds: legacyCurriculum.length + siteCatalogPages.length, migrationRows: migrationRows.length - 1 }));
