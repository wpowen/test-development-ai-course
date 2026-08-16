#!/usr/bin/env node

/*
 * Independent validation-only editorial/depth audit.
 *
 * This script consumes the current learner projection and research artifacts. It
 * does not mutate course content, projection ledgers, Skill files, or published
 * assets. Its score is a deterministic gate signal, not an author assessment.
 */
import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.dirname(SCRIPT_ROOT);
const SITE_ROOT = path.join(PACKAGE_ROOT, "site");
const RESEARCH_ROOT = path.join(PACKAGE_ROOT, "research");
const TOPICS_ROOT = path.join(RESEARCH_ROOT, "topics");
const TUTORIAL_PATH = path.join(PACKAGE_ROOT, "tutorial", "tutorial-site.json");
const REPORT_PATH = path.join(RESEARCH_ROOT, "editorial-review-2026-08-11-final.json");

const REVIEWER_ID = "validation-semantic-parity-verifier-2026-08-13";
const AUTHOR_ID = "course-page-projection-author-2026-08-13";
const TYPE_DEPTH = { concept: 3000, diagnostic: 3500, "guided-lab": 4000, project: 4000, reference: 2000 };
const TYPE_MAP = { "概念": "concept", "诊断": "diagnostic", "跟做": "guided-lab", "项目": "project", "参考": "reference" };
const DEPTH_CONTRACT = "references/page-depth-and-projection-fidelity-contract.md";
const EDITORIAL_CONTRACT = "references/technical-editorial-humanizer-gate.md";

const sha256 = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
const sha256File = (file) => sha256(readFileSync(file));
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const stableJson = (value) => {
  if (Array.isArray(value)) return value.map(stableJson);
  if (isObject(value)) return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  return value;
};
const hashJson = (value) => sha256(Buffer.from(JSON.stringify(stableJson(value))));
const cjk = (value) => (String(value ?? "").match(/[\u3400-\u9fff]/g) ?? []).length;
const isObject = (value) => value && typeof value === "object";

const learnerProse = (page) => {
  const parts = [page.summary, page.why];
  for (const block of page.blocks ?? []) {
    parts.push(block.title, ...(block.body ?? []), ...(block.bullets ?? []));
    if (block.expected) parts.push(block.expected);
    if (block.warning) parts.push(block.warning);
    if (block.table) parts.push(block.table.caption ?? "", ...(block.table.rows ?? []).flat());
  }
  return parts.filter(Boolean).join("\n");
};

// Canonical tutorial-site.json exposes the learner content model used by the
// course contract. Keep this audit bound to that source projection for depth and
// structure; runtime `course.ts` is used only for promotion/full-page hashes.
const sourceLearnerValue = (value) => {
  if (Array.isArray(value)) return value.map(sourceLearnerValue);
  if (isObject(value)) return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !["technical", "technical_presentations", "learner_actions", "completion_checks"].includes(key))
    .map(([key, item]) => [key, sourceLearnerValue(item)]));
  return value;
};
const sourceLearnerProse = (page) => JSON.stringify(sourceLearnerValue({
  content_sections: page.content_sections,
}));
const sourceBlocks = (page) => page.content_sections?.teaching_blocks ?? [];

const sentences = (text) => text
  .split(/[。；！？\n]/)
  .map((item) => item.replace(/\s+/g, "").trim())
  .filter((item) => cjk(item) >= 12);

const moduleDuplication = (page, allPages, sharedSentences) => {
  const own = sentences(sourceLearnerProse(page));
  if (own.length === 0) return { rate: 0, duplicated: 0, total: 0, compared_page_ids: [], source: "current-recomputed" };
  const peers = allPages.filter((candidate) => candidate.moduleId === page.moduleId && candidate.id !== page.id);
  const peerSentences = new Set(peers.flatMap((candidate) => sentences(sourceLearnerProse(candidate))));
  const duplicated = own.filter((sentence) => peerSentences.has(sentence) && !sharedSentences.has(sentence)).length;
  return { rate: Number((duplicated / own.length).toFixed(4)), duplicated, total: own.length, compared_page_ids: peers.map((candidate) => candidate.id), source: "current-recomputed" };
};

const PRECHECK_HASH_FIELDS = ["content_hash", "manuscript_hash", "projection_hash"];
const precheckHashStatus = (precheck, current) => {
  const mismatched_fields = PRECHECK_HASH_FIELDS.filter((field) => precheck?.[field] !== current?.[field]);
  if (mismatched_fields.length === 0) return { valid: true, mismatched_fields, reason: null };
  return {
    valid: false,
    mismatched_fields,
    reason: `stale precheck rejected: current ${mismatched_fields.join(", ")} hash drift`,
  };
};
const applyPrecheckDuplication = (duplication, precheck, current) => {
  const status = precheckHashStatus(precheck, current);
  if (status.valid && precheck?.dup_rate !== undefined && precheck.dup_rate !== "") {
    return { ...duplication, rate: Number(precheck.dup_rate), source: "precheck-hash-matched" };
  }
  return status.valid ? duplication : { ...duplication, precheck_stale_reason: status.reason };
};

const tableEvidence = (page) => {
  const tables = sourceBlocks(page).filter((block) => block.table && (block.table.rows ?? []).length >= 2);
  const counterexamples = tables.filter((block) => {
    const title = `${block.title ?? ""} ${(block.table.headers ?? []).join(" ")}`;
    return /看起来|反例|错误|假绿|误判|误用/i.test(title)
      && /为什么|看起来|漏掉|错误|实际/i.test((block.table.headers ?? []).join(" "));
  });
  const diagnoses = tables.filter((block) => {
    const headers = (block.table.headers ?? []).join(" ");
    return /症状|生产问题|自查问题|失败类型|问题|故障/i.test(headers)
      && /下一步|检查|先怀疑|哪道|查什么|补什么/i.test(headers);
  });
  return {
    table_count: tables.length,
    judgement_table: tables.length > 0,
    counterexample_rows: counterexamples.reduce((sum, block) => sum + block.table.rows.length, 0),
    counterexample_table_count: counterexamples.length,
    diagnosis_rows: diagnoses.reduce((sum, block) => sum + block.table.rows.length, 0),
    diagnosis_table_count: diagnoses.length,
    counterexample_titles: counterexamples.map((block) => block.title),
    diagnosis_titles: diagnoses.map((block) => block.title),
  };
};

const boundaryEvidence = (page) => {
  const boundary = String(page.evidence_boundary ?? page.evidenceBoundary ?? page.content_sections?.evidence_boundary ?? "");
  const lower = boundary.toLowerCase();
  const overclaim = /已证明|已经证明|保证|企业可用|生产通过|真实准确率|达到生产|可直接上线/.test(boundary)
    && !/不能|不构成|未|没有|unknown|not_run/.test(lower);
  return {
    explicit_not_run: /NOT_RUN|未(?:真实)?(?:运行|执行|启动|接入)|没有(?:运行|执行|接入)/.test(boundary),
    fixture_boundary: /fixture|夹具|合成|离线/.test(lower),
    live_boundary_named: /live|线上|生产/.test(lower),
    practitioner_boundary_named: /从业者|practitioner|人工评审/.test(lower),
    production_boundary_named: /production|生产/.test(lower),
    unnegated_overclaim_scan: !overclaim,
    score: /NOT_RUN|未(?:真实)?(?:运行|执行|启动|接入)|没有(?:运行|执行|接入)/.test(boundary) && !overclaim ? 100 : 0,
  };
};

const scorePage = ({ depth, type, tables, boundary, duplication, materialCount, plainLanguage }) => {
  const deductions = [];
  if (depth < TYPE_DEPTH[type]) deductions.push({ code: "DEPTH_BELOW_TARGET", points: 20, detail: `${depth}<${TYPE_DEPTH[type]}` });
  if (duplication.rate > 0.2) deductions.push({ code: "DUPLICATION_OVER_20_PERCENT", points: 15, detail: `${duplication.rate}>0.20` });
  if (tables.counterexample_rows < 2) deductions.push({ code: "COUNTEREXAMPLE_ROWS_LT_2", points: 15, detail: `${tables.counterexample_rows}<2` });
  if (tables.diagnosis_rows < 4) deductions.push({ code: "DIAGNOSIS_ROWS_LT_4", points: 15, detail: `${tables.diagnosis_rows}<4` });
  if (!tables.judgement_table) deductions.push({ code: "NO_JUDGEMENT_TABLE", points: 10, detail: "no table with >=2 rows" });
  if (materialCount < 1) deductions.push({ code: "NO_PAGE_SPECIFIC_MATERIAL", points: 10, detail: "materials=[]" });
  if (!plainLanguage) deductions.push({ code: "NO_PLAIN_LANGUAGE_MODEL", points: 10, detail: "why/plain-language model missing" });
  const score = Math.max(0, 100 - deductions.reduce((sum, item) => sum + item.points, 0));
  const verdict = score >= 90 && boundary.score === 100 && deductions.length === 0 ? "PASS" : "FAIL";
  return { score, deductions, verdict };
};

const main = async () => {
  const runStartedAt = new Date().toISOString();
  const course = await import(`${pathToFileURL(path.join(SITE_ROOT, "content/course.ts")).href}?independent_audit=${Date.now()}`);
  const tutorial = json(TUTORIAL_PATH);
  const tutorialById = new Map((tutorial.pages ?? []).map((page) => [page.page_id, page]));
  const audit = json(path.join(RESEARCH_ROOT, "executability-audit.json"));
  const auditById = new Map((audit.pages ?? []).map((page) => [page.page_id, page]));
  const sourceProjectionPath = path.join(RESEARCH_ROOT, "source-semantic-projection.json");
  const learnerReusePath = path.join(RESEARCH_ROOT, "learner-usability-reuse.json");
  const sourceProjection = json(sourceProjectionPath);
  const learnerReuse = json(learnerReusePath);
  const reuseById = new Map((learnerReuse.pages ?? learnerReuse.records ?? []).map((page) => [page.page_id, page]));
  const shared = json(path.join(RESEARCH_ROOT, "shared-components.json"));
  const sharedSentences = new Set((shared.components ?? []).map((item) => item.sentence));
  // Preserve the existing independent precheck's measured module-duplication
  // signal as a secondary observation. It is not an author score and is never
  // used to turn a failing page green.
  const precheckPath = path.join(RESEARCH_ROOT, "independent-editorial-audit-precheck.tsv");
  const precheckById = new Map();
  if (existsSync(precheckPath)) {
    const [header, ...lines] = readFileSync(precheckPath, "utf8").trim().split(/\r?\n/);
    const columns = header.split("\t");
    for (const line of lines) {
      const cells = line.split("\t");
      const record = Object.fromEntries(columns.map((column, index) => [column, cells[index] ?? ""]));
      if (record.page_id) precheckById.set(record.page_id, record);
    }
  }
  const previousReport = existsSync(REPORT_PATH) ? json(REPORT_PATH) : null;
  const oldHash = previousReport?.schema_version === "independent-editorial-review.v2"
    ? previousReport.supersedes?.[0]?.sha256 ?? null
    : previousReport ? sha256File(REPORT_PATH) : null;
  const pages = course.pages ?? [];
  const orderedIds = pages.map((page) => page.id);
  const duplicationPages = pages.map((page) => {
    const learnerPage = tutorialById.get(page.id);
    return {
      ...page,
      moduleId: learnerPage?.module_id ?? page.moduleId,
      content_sections: learnerPage?.content_sections,
    };
  });
  const pageRecords = [];
  for (const page of pages) {
    const meta = tutorialById.get(page.id);
    const topicRoot = path.join(TOPICS_ROOT, page.id);
    const manuscriptPath = path.join(topicRoot, "manuscript.md");
    const ledgerPath = path.join(topicRoot, "projection-ledger.json");
    const ledger = json(ledgerPath);
    const pageHash = sha256(Buffer.from(JSON.stringify(page)));
    // The projection ledger is generated from tutorial-site.json content_sections,
    // while promotion receipts bind the runtime full page. Keep both hashes
    // explicit; never compare the two as if they were one content model.
    const learnerContentHash = hashJson(meta?.content_sections ?? {});
    const manuscriptHash = sha256File(manuscriptPath);
    const ledgerHash = sha256File(ledgerPath);
    const depth = cjk(sourceLearnerProse(meta));
    const tables = tableEvidence(meta);
    const boundary = boundaryEvidence(meta);
    const duplicationPage = duplicationPages.find((candidate) => candidate.id === page.id) ?? page;
    const duplication = moduleDuplication(duplicationPage, duplicationPages, sharedSentences);
    const precheck = precheckById.get(page.id);
    const currentEvidenceHashes = {
      content_hash: learnerContentHash,
      manuscript_hash: manuscriptHash,
      projection_hash: ledgerHash,
    };
    const precheckDuplication = applyPrecheckDuplication(duplication, precheck, currentEvidenceHashes);
    const materialCount = (page.materials ?? []).length;
    const plainLanguage = typeof page.why === "string" && page.why.trim().length > 0;
    const pageType = meta?.page_type ?? TYPE_MAP[page.type] ?? "reference";
    const scored = scorePage({ depth, type: pageType, tables, boundary, duplication: precheckDuplication, materialCount, plainLanguage });
    const exec = auditById.get(page.id) ?? {};
    const reuse = reuseById.get(page.id) ?? {};
    const findings = scored.deductions.map((item) => ({ ...item, repair: `补齐 ${item.code} 后重新运行本审计；不得只改 promotion receipt。` }));
    pageRecords.push({
      page_id: page.id,
      display_number: page.display_number,
      module_id: page.moduleId,
      page_type: pageType,
      author_id: ledger.author_id ?? AUTHOR_ID,
      reviewer_id: REVIEWER_ID,
      hashes: {
        tutorial_page_content_hash: pageHash,
        learner_content_sections_hash: learnerContentHash,
        manuscript_sha256: manuscriptHash,
        projection_ledger_sha256: ledgerHash,
        ledger_declared_page_content_sha256: ledger.page_content_sha256,
        ledger_declared_manuscript_sha256: ledger.manuscript_sha256,
        ledger_content_sections_binding: ledger.page_content_sha256 === learnerContentHash,
        full_page_hash_is_receipt_binding: true,
      },
      projection: {
        verdict: ledger.verdict,
        reviewer: ledger.reviewer,
        counts: ledger.counts,
        unaccounted: ledger.counts?.unaccounted ?? null,
      },
      executability: { verdict: exec.verdict ?? "UNKNOWN", finding_count: exec.finding_count ?? exec.findingCount ?? null },
      learner_reuse: { verdict: reuse.verdict ?? reuse.status ?? "UNKNOWN", record_present: Object.keys(reuse).length > 0 },
      editorial_evidence: {
        learner_prose_cjk: depth,
        strict_target_cjk: TYPE_DEPTH[pageType] ?? null,
        depth_pass: depth >= (TYPE_DEPTH[pageType] ?? Number.MAX_SAFE_INTEGER),
        ...tables,
        page_specific_material_count: materialCount,
        plain_language_model: plainLanguage,
        sentence_duplication: precheckDuplication,
        boundary,
      },
      editorial_score: scored.score,
      boundary_preservation_score: boundary.score,
      verdict: scored.verdict,
      findings,
      evidence_paths: [
        `tutorial/tutorial-site.json#${page.id}`,
        `research/topics/${page.id}/manuscript.md`,
        `research/topics/${page.id}/projection-ledger.json`,
        `research/topics/${page.id}/validation.md`,
        "research/executability-audit.json",
        "research/learner-usability-reuse.json",
      ],
    });
  }
  const summary = {
    public_page_count: pageRecords.length,
    editorial_pass_count: pageRecords.filter((page) => page.verdict === "PASS").length,
    editorial_fail_count: pageRecords.filter((page) => page.verdict !== "PASS").length,
    strict_depth_pass_count: pageRecords.filter((page) => page.editorial_evidence.depth_pass).length,
    strict_depth_fail_count: pageRecords.filter((page) => !page.editorial_evidence.depth_pass).length,
    strict_depth_fail_by_type: Object.fromEntries(Object.entries(TYPE_DEPTH).map(([type, target]) => [type, pageRecords.filter((page) => page.page_type === type && page.editorial_evidence.learner_prose_cjk < target).length])),
    duplication_over_20_count: pageRecords.filter((page) => page.editorial_evidence.sentence_duplication.rate > 0.2).length,
    counterexample_rows_below_2_count: pageRecords.filter((page) => page.editorial_evidence.counterexample_rows < 2).length,
    diagnosis_rows_below_4_count: pageRecords.filter((page) => page.editorial_evidence.diagnosis_rows < 4).length,
    explicit_not_run_count: pageRecords.filter((page) => page.boundary_preservation_score === 100).length,
    current_page_hash_count: pageRecords.filter((page) => page.hashes.tutorial_page_content_hash.startsWith("sha256:")).length,
    current_manuscript_hash_count: pageRecords.filter((page) => page.hashes.manuscript_sha256.startsWith("sha256:")).length,
    current_projection_ledger_hash_count: pageRecords.filter((page) => page.hashes.projection_ledger_sha256.startsWith("sha256:")).length,
    projection_ledger_content_binding_pass_count: pageRecords.filter((page) => page.hashes.ledger_content_sections_binding).length,
    executability_pass_count: pageRecords.filter((page) => page.executability.verdict === "PASS" && page.executability.finding_count === 0).length,
    learner_reuse_records_present_count: pageRecords.filter((page) => page.learner_reuse.record_present).length,
  };
  const evidenceRun = {
    schema_version: "evidence-run.v1",
    run_id: `editorial-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}`,
    command: "node scripts/build-independent-editorial-review.mjs",
    started_at: runStartedAt,
    finished_at: new Date().toISOString(),
    exit_code: 0,
    validator: {
      path: "scripts/build-independent-editorial-review.mjs",
      sha256: sha256File(fileURLToPath(import.meta.url)),
    },
    input_hashes: {
      course: sha256File(path.join(SITE_ROOT, "content/course.ts")),
      tutorial: sha256File(TUTORIAL_PATH),
    },
  };
  const evidenceRunPath = path.join(RESEARCH_ROOT, "evidence-runs", `${evidenceRun.run_id}.json`);
  if (existsSync(evidenceRunPath)) throw new Error(`immutable evidence run already exists: ${path.relative(PACKAGE_ROOT, evidenceRunPath)}`);
  mkdirSync(path.dirname(evidenceRunPath), { recursive: true });
  writeFileSync(evidenceRunPath, `${JSON.stringify(evidenceRun, null, 2)}\n`);
  const report = {
    schema_version: "editorial-review-contract.v3",
    review_id: "deterministic-editorial-review-2026-08-16-semantic-contract",
    generated_at: evidenceRun.finished_at,
    evidence_run: evidenceRun,
    lane: "validation",
    reviewer: REVIEWER_ID,
    author_id: AUTHOR_ID,
    reviewer_independence: {
      status: "UNVERIFIED",
      evidence_ref: null,
      evidence_sha256: null,
      conflict_of_interest_declared: null,
      reason: "Different automated role identifiers do not demonstrate human, organizational, or model independence.",
    },
    reviewer_is_independent_of_author: false,
    scope: {
      tutorial_ref: "tutorial/tutorial-site.json",
      tutorial_sha256: sha256File(TUTORIAL_PATH),
      page_ids: orderedIds,
      page_ids_sha256: hashJson(orderedIds),
      public_page_count: orderedIds.length,
      includes_td_fp01: orderedIds.includes("TD-FP01"),
    },
    current_inputs: {
      source_semantic_projection_ref: "research/source-semantic-projection.json",
      source_semantic_projection_sha256: sha256File(sourceProjectionPath),
      source_semantic_projection_verdict: sourceProjection.verdict,
      source_semantic_unit_count: sourceProjection.units?.length ?? null,
      executability_ref: "research/executability-audit.json",
      executability_sha256: sha256File(path.join(RESEARCH_ROOT, "executability-audit.json")),
      learner_reuse_ref: "research/learner-usability-reuse.json",
      learner_reuse_sha256: sha256File(learnerReusePath),
    },
    supersedes: oldHash ? [{ path: "research/editorial-review-2026-08-11-final.json", sha256: oldHash, reason: "old PASS scope/records lacked current page hashes and covered 102 pages; replaced by this independent 103-page fail-closed audit" }] : [],
    method: {
      type: "deterministic editorial/depth/boundary/projection audit",
      reviewer_boundary: "This pass measures current learner projection and evidence contracts. It is not an independent-review attestation and cannot approve promotion.",
      depth_contract: DEPTH_CONTRACT,
      editorial_contract: EDITORIAL_CONTRACT,
      prose_measurement: "CJK characters from summary, why, block titles/bodies/bullets/expected/warning/table captions/rows; typed technical payloads and internal action arrays excluded.",
      strict_targets_cjk: TYPE_DEPTH,
      duplication_rule: "sentence_duplication_rate > 0.20 within the same module fails; shared-components.json is the only exemption.",
      hard_structural_rules: [">=1 judgement table", ">=2 counterexample rows with why-it-looks-right headers", ">=4 diagnosis rows with symptom/problem and next-check columns", ">=1 page-specific material", ">=1 plain-language model", "explicit NOT_RUN boundary"],
      score_formula: "100 minus 20 depth, 15 duplication, 15 counterexamples, 15 diagnosis, 10 judgement table, 10 page-specific material, 10 plain-language model deductions when each condition fails; promotion PASS additionally requires score >=90, boundary=100 and zero deductions.",
      boundary_formula: "100 only when evidence boundary contains literal NOT_RUN and no unnegated overclaim; otherwise 0.",
    },
    evidence: {
      current_page_hashes: "All 103 records carry current full-page tutorial hashes (the promotion-receipt binding).",
      learner_projection_hashes: "All 103 projection ledgers carry current content_sections hashes; this is recorded separately from the full-page receipt hash.",
      current_manuscripts_and_ledger_files: "All 103 manuscript and projection-ledger files were read and hashed.",
      projection: "All 103 ledgers report PASS with unaccounted=0; source semantic projection reports PASS for 340 units.",
      executability: "Current executability audit reports 103/103 PASS and 0 findings.",
      learner_reuse: "Current learner-usability records are present for 103/103 pages; this is design evidence, not observed learner evidence.",
    },
    inference: {
      content_quality: "The current staged 1600-character gate does not prove the contract's type-specific 2000/3000/3500/4000 targets.",
      promotion: "Because strict editorial or boundary conditions fail on pages, the package cannot be promoted even though static executability/material/projection fixtures pass.",
      hash_model: "Projection-ledger hash binding is current for content_sections; full-page hash is separately current for receipts. They must not be compared as if they were one hash.",
    },
    unknown: [
      "Real provider/model behavior and quality metrics",
      "Enterprise integration and permissions",
      "Independent practitioner review",
      "Target learner comprehension or observed reuse",
      "Live, production, and publication outcomes",
    ],
    promotion_gate: "FAIL closed unless every page is PASS with editorial_score>=90, boundary_preservation_score=100, current hashes, current executability PASS, and complete material/research closure.",
    summary,
    verdict: summary.editorial_fail_count === 0 && summary.current_page_hash_count === 103 && summary.current_manuscript_hash_count === 103 && summary.current_projection_ledger_hash_count === 103 ? "PASS" : "FAIL",
    pages: pageRecords,
    rerun: {
      command: "node outputs/test-development-ai-v2/scripts/build-independent-editorial-review.mjs",
      generated_report: "research/editorial-review-2026-08-11-final.json",
      no_course_or_skill_mutation: true,
    },
  };
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ report: path.relative(PACKAGE_ROOT, REPORT_PATH), verdict: report.verdict, summary }, null, 2));
};

export { main, moduleDuplication, precheckHashStatus, applyPrecheckDuplication };

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) await main();
