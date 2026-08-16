#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tutorialPath = path.join(root, "tutorial", "tutorial-site.json");
const contractPath = path.join(root, "research", "solution-architecture.json");

const coverageBySolution = {
  "SOL-REQ-RELEASE": {
    coverageCellId: "TD-CELL-001",
    pageIds: [
      "TD-F01", "TD-P01", "TD-P02", "TD-P03", "TD-P04", "TD-P05", "TD-P06", "TD-P07", "TD-P08",
      "TD-X101", "TD-C01",
      // 2026-08-12 新增：职业演进六页与 TD-C01 同属责任与证据链，归入同一解决方案单元。
      "TD-C02", "TD-C03", "TD-C04", "TD-F05", "TD-T26", "TD-R01",
    ],
  },
  "SOL-API-SERVICE": {
    coverageCellId: "TD-CELL-004",
    pageIds: ["TD-PS01", "TD-PS02", "TD-PS03", "TD-PS09", "TD-T05", "TD-T06", "TD-T07", "TD-T08"],
  },
  "SOL-UI-MOBILE": {
    coverageCellId: "TD-CELL-004",
    pageIds: ["TD-PS04", "TD-PS05", "TD-PS06", "TD-PS07", "TD-PS08", "TD-T18", "TD-X502"],
  },
  "SOL-RELIABILITY-LOAD": {
    coverageCellId: "TD-CELL-026",
    pageIds: ["TD-PS10", "TD-PS11", "TD-PS12", "TD-AP01", "TD-AP02", "TD-AP03", "TD-AP04", "TD-AP05", "TD-AP06", "TD-AP07", "TD-AP08", "TD-A01", "TD-A02", "TD-A03", "TD-A04", "TD-A05", "TD-A06", "TD-X604", "TD-X805"],
  },
  "SOL-QUALITY-PLATFORM": {
    coverageCellId: "TD-CELL-023",
    pageIds: ["TD-QP01", "TD-QP02", "TD-QP03", "TD-QP04", "TD-T20", "TD-T21", "TD-T22", "TD-T23", "TD-T24", "TD-T25", "TD-W01", "TD-W02", "TD-W03"],
  },
  "SOL-AI-EVAL-GOV": {
    coverageCellId: "TD-CELL-014",
    pageIds: [
      "TD-FP01", "TD-F02", "TD-F03", "TD-F04",
      "TD-T01", "TD-T02", "TD-T03", "TD-T04",
      "TD-T09", "TD-T10", "TD-T11", "TD-T12",
      "TD-T13", "TD-T14", "TD-T15", "TD-T16", "TD-T17", "TD-T19",
      "TD-B01", "TD-B02", "TD-B03", "TD-B04", "TD-B05", "TD-B06",
      "TD-X501", "TD-X601", "TD-X602", "TD-X603",
      // 2026-08-12 新增：Agent 测试架构 D0–D7、四证据环与三段门禁属于 AI 系统评测与治理。
      "TD-AG-00", "TD-AG-01", "TD-AG-02", "TD-AG-03", "TD-AG-04", "TD-AG-05",
      "TD-AG-06", "TD-AG-07", "TD-AG-08", "TD-AG-09", "TD-AG-10",
    ],
  },
};

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function buildTrace(pageId, unit, coverageCellId, preserved) {
  if (pageId === "TD-P02" && preserved?.execution_receipt_ref === "REC-TD-P02-FIXTURE-20260811") {
    return preserved;
  }
  return {
    coverage_cell_id: coverageCellId,
    topic_id: pageId,
    page_id: pageId,
    scenario_id: unit.scenario_ids[0],
    artifact_ref: `research/topics/${pageId}/manuscript.md`,
    command_ref: `research/topics/${pageId}/lab-manifest.json`,
    execution_receipt_ref: "NOT_RUN",
    assessment_ref: `research/topics/${pageId}/validation.md`,
    human_gate: "NOT_REVIEWED: qualified test-development practitioner plus accountable domain owner",
  };
}

export function synchronizeCoverage(tutorial, contract) {
  const publicPageIds = tutorial.pages.map((page) => page.page_id);
  const publicSet = new Set(publicPageIds);
  const assigned = Object.values(coverageBySolution).flatMap((entry) => entry.pageIds);
  const duplicateIds = assigned.filter((pageId, index) => assigned.indexOf(pageId) !== index);
  const missingIds = publicPageIds.filter((pageId) => !assigned.includes(pageId));
  const unknownIds = assigned.filter((pageId) => !publicSet.has(pageId));
  if (duplicateIds.length || missingIds.length || unknownIds.length) {
    throw new Error(`solution coverage mismatch: duplicate=${[...new Set(duplicateIds)]}; missing=${missingIds}; unknown=${unknownIds}`);
  }

  for (const unit of contract.solution_units) {
    const mapping = coverageBySolution[unit.solution_id];
    if (!mapping) throw new Error(`unmapped solution unit: ${unit.solution_id}`);
    const preservedByPage = new Map(unit.traceability.map((trace) => [trace.page_id, trace]));
    unit.page_ids = [...mapping.pageIds];
    unit.traceability = mapping.pageIds.map((pageId) =>
      buildTrace(pageId, unit, mapping.coverageCellId, preservedByPage.get(pageId)),
    );
  }
  return contract;
}

const tutorial = loadJson(tutorialPath);
const current = loadJson(contractPath);
const synchronized = synchronizeCoverage(tutorial, structuredClone(current));
const nextText = stableJson(synchronized);
const currentText = fs.readFileSync(contractPath, "utf8");

if (process.argv.includes("--check")) {
  if (currentText !== nextText) {
    console.error("solution architecture coverage is out of sync");
    process.exit(1);
  }
  console.log(`solution architecture coverage is synchronized: ${tutorial.pages.length} pages`);
} else {
  fs.writeFileSync(contractPath, nextText);
  console.log(`synchronized solution architecture coverage: ${tutorial.pages.length} pages`);
}
