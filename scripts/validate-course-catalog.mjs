#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalogPages, pages as publicPages } from "../site/content/course.ts";
import { advancedQualityGapPages } from "../site/content/modules/advanced-quality-gaps.ts";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const errors = [];
const uniqueById = (items) => [...new Map(items.map((item) => [item.id, item])).values()];
const siteCatalogPages = uniqueById([...catalogPages, ...advancedQualityGapPages]);
const publicCatalogPages = uniqueById([...publicPages, ...advancedQualityGapPages]);
const siteCatalogLabel = `site-${siteCatalogPages.length}`;

const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const manifest = readJson("research/course-catalog-manifest.json");
const curriculum = readJson("curriculum.json");
const migrationText = fs.readFileSync(path.join(root, "research/course-catalog-migration.csv"), "utf8");
const mapText = fs.readFileSync(path.join(root, "course-map.md"), "utf8");
const gapText = fs.readFileSync(path.join(root, "curriculum-gap-analysis.md"), "utf8");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])));
}

const migration = parseCsv(migrationText);
const topics = manifest.topics ?? [];
const topicIds = topics.map((topic) => topic.canonical_id);
const topicSet = new Set(topicIds);
const orderById = new Map(topics.map((topic) => [topic.canonical_id, topic.canonical_order]));

if (topics.length !== 117) errors.push(`expected 117 canonical topics, found ${topics.length}`);
if (topicSet.size !== topics.length) errors.push("canonical topic IDs are not unique");
if (manifest.canonical_counts?.retained_from_topic_system !== 105) errors.push("manifest must preserve 105 source topics");
if (manifest.canonical_counts?.proactive_high_risk_gaps !== 12) errors.push("manifest must preserve 12 explicit high-risk gaps");
if (manifest.source_catalog_counts?.curriculum_contracts !== 46) errors.push("manifest must record 46 legacy curriculum contracts");
if (manifest.source_catalog_counts?.site_catalog !== siteCatalogPages.length) errors.push(`manifest must record ${siteCatalogPages.length} internal site pages`);
if (manifest.source_catalog_counts?.site_public_projection !== publicCatalogPages.length) errors.push(`manifest must record ${publicCatalogPages.length} public-projection pages`);
if (manifest.canonical_counts?.uncovered_high_risk_gaps !== 0) errors.push("all 12 high-risk gaps must have a direct page or explicit existing-page alias");

const expectedStageIds = ["CAT-00", "CAT-01", "CAT-02", "CAT-03", "CAT-04", "CAT-05", "CAT-06", "CAT-07", "CAT-08", "CAT-09"];
if (JSON.stringify(manifest.stages?.map((stage) => stage.id)) !== JSON.stringify(expectedStageIds)) errors.push("canonical stage sequence drifted");
if ((manifest.stages ?? []).reduce((sum, stage) => sum + stage.topic_count, 0) !== 117) errors.push("stage topic counts do not sum to 117");

for (const [index, topic] of topics.entries()) {
  if (topic.canonical_order !== index + 1) errors.push(`${topic.canonical_id}: canonical_order must be contiguous`);
  if (topic.content_gate !== "blocked") errors.push(`${topic.canonical_id}: content gate cannot pass before per-topic package validation`);
  if (!new Set(["planned", "outlined", "gap"]).has(topic.delivery_status)) errors.push(`${topic.canonical_id}: unsupported delivery status ${topic.delivery_status}`);
  if (topic.delivery_status === "gap" && topic.coverage_decision !== "add-gap-and-research") errors.push(`${topic.canonical_id}: gap must retain add-gap-and-research decision`);
  for (const prerequisiteId of topic.prerequisite_ids ?? []) {
    if (!topicSet.has(prerequisiteId)) errors.push(`${topic.canonical_id}: unknown prerequisite ${prerequisiteId}`);
    else if (orderById.get(prerequisiteId) >= topic.canonical_order) errors.push(`${topic.canonical_id}: prerequisite ${prerequisiteId} is not earlier in canonical order`);
  }
}

if (curriculum.course_count !== 46 || curriculum.courses?.length !== 46) errors.push("curriculum.json must preserve exactly 46 compatibility course contracts");
if (curriculum.compatibility_course_count !== 46) errors.push("curriculum.json must record 46 compatibility courses");
if (curriculum.canonical_course_count !== 117 || curriculum.canonical_topics?.length !== 117) errors.push("curriculum.json must expose exactly 117 canonical topics");
if (curriculum.legacy_courses?.length !== 46) errors.push("curriculum.json must preserve exactly 46 legacy contracts as aliases");
if (JSON.stringify(curriculum.canonical_topics?.map((topic) => topic.canonical_id)) !== JSON.stringify(topicIds)) errors.push("curriculum canonical topic order/IDs drifted from canonical manifest");
if (JSON.stringify(curriculum.courses?.map((course) => course.course_id)) !== JSON.stringify(curriculum.legacy_courses?.map((course) => course.course_id))) errors.push("compatibility courses drifted from preserved legacy contracts");
if (curriculum.catalog_complete !== false) errors.push("curriculum catalog_complete must remain false");

const expectedMigrationRows = 105 + 12 + 46 + siteCatalogPages.length;
if (migration.length !== expectedMigrationRows) errors.push(`expected ${expectedMigrationRows} migration rows, found ${migration.length}`);
const expectedMigrationCounts = { "topic-system-105": 105, "gap-audit-12": 12, "curriculum-46": 46, [siteCatalogLabel]: siteCatalogPages.length };
for (const [sourceCatalog, expectedCount] of Object.entries(expectedMigrationCounts)) {
  const rows = migration.filter((row) => row.source_catalog === sourceCatalog);
  if (rows.length !== expectedCount) errors.push(`${sourceCatalog}: expected ${expectedCount} rows, found ${rows.length}`);
  if (new Set(rows.map((row) => row.source_id)).size !== rows.length) errors.push(`${sourceCatalog}: duplicate source IDs`);
}
for (const row of migration) {
  const targets = row.canonical_ids.split(";").filter(Boolean);
  if (!targets.length) errors.push(`${row.source_catalog}/${row.source_id}: missing canonical target`);
  for (const target of targets) if (!topicSet.has(target)) errors.push(`${row.source_catalog}/${row.source_id}: unknown canonical target ${target}`);
}

for (const page of siteCatalogPages) {
  if (!migration.some((row) => row.source_catalog === siteCatalogLabel && row.source_id === page.id)) errors.push(`site page missing migration row: ${page.id}`);
}
for (const course of curriculum.legacy_courses ?? []) {
  if (!migration.some((row) => row.source_catalog === "curriculum-46" && row.source_id === course.course_id)) errors.push(`legacy course missing migration row: ${course.course_id}`);
}

for (const text of [mapText, gapText]) {
  for (const staleClaim of ["已有 52/52 页完整可读路径", "所有页面均已达到正文交付门禁", "深度正文：33/33 页"]) {
    if (text.includes(staleClaim)) errors.push(`stale completion claim remains: ${staleClaim}`);
  }
}
for (const requiredHeading of ["## Research corpus", "## Industry body of knowledge", "## Real work and practitioner evidence", "## Existing course supply", "## AI technology and benchmark frontier", "## Coverage matrix", "## Missing and overrepresented topics", "## Expert review", "## Curriculum decisions", "## Remaining unknowns"]) {
  if (!gapText.includes(requiredHeading)) errors.push(`curriculum gap analysis misses heading: ${requiredHeading}`);
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`PASS course catalog: ${topics.length} canonical topics; ${publicCatalogPages.length} public pages; ${46 + siteCatalogPages.length} alias source IDs; 0 uncovered high-risk gaps; all 117 content gates remain blocked.`);
