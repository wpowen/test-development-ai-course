import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFile, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  REQUIRED_RESEARCH_FILES,
  buildCatalogManifest,
  normalizeEditorialReviewEvidence,
  buildPublicationClosure,
  buildPromotionReceipt,
  buildSupportOwnership,
} from "./generate-course-integrity-manifests.mjs";

test("editorial review normalizes nested current-page hashes only with attested independence", () => {
  const evidence = normalizeEditorialReviewEvidence({
    reviewer: "independent-reviewer",
    author_id: "course-author",
    reviewer_independence: {
      status: "ATTESTED",
      evidence_ref: "governance/reviews/2026-08-16.md",
      evidence_sha256: "sha256:abc",
      conflict_of_interest_declared: true,
    },
  }, {
    page_id: "TD-P01",
    reviewer_id: "independent-reviewer",
    author_id: "course-author",
    verdict: "PASS",
    editorial_score: 94,
    boundary_preservation_score: 100,
    hashes: { tutorial_page_content_hash: "sha256:current-page" },
  }, "sha256:review");

  assert.equal(evidence.page_content_hash, "sha256:current-page");
  assert.equal(evidence.review_verdict, "PASS");
  assert.equal(evidence.reviewer_is_independent_of_author, true);
});

const page = (id, materials = []) => ({ id, moduleId: "TD-M00", order: 1, status: "fixture-tested", materials });

test("complete catalog and pilot scope preserve exact ordered IDs", () => {
  const catalogPages = [page("TD-P01"), page("TD-PS01"), page("TD-T01")];
  const publicPages = [catalogPages[0], catalogPages[2]];
  const canonicalManifest = {
    topics: [
      { canonical_id: "CAN-1", aliases: [{ source_catalog: "site-81", source_id: "TD-P01" }] },
      { canonical_id: "CAN-2", aliases: [{ source_catalog: "site-81", source_id: "TD-PS01" }] },
      { canonical_id: "CAN-3", aliases: [{ source_catalog: "site-81", source_id: "TD-T01" }] },
    ],
  };
  const manifest = buildCatalogManifest({
    catalogPages,
    publicPages,
    releaseScope: { mode: "pilot-path", promisedPageIds: ["TD-P01", "TD-T01"], catalogComplete: false },
    canonicalManifest,
  });

  assert.deepEqual(manifest.page_ids, ["TD-P01", "TD-PS01", "TD-T01"]);
  assert.deepEqual(manifest.release_scope.promised_page_ids, ["TD-P01", "TD-T01"]);
  assert.equal(manifest.catalog_scope, "complete-catalog");
  assert.deepEqual(manifest.pages.map((item) => item.canonical_topic_ids), [["CAN-1"], ["CAN-2"], ["CAN-3"]]);
  assert.ok(manifest.pages.every((item) => item.support_bundle_id), "every catalog record needs an exact support bundle ID");
});

test("catalog mapping accepts regenerated site cardinality labels", () => {
  const catalogPages = [page("TD-X805")];
  const manifest = buildCatalogManifest({
    catalogPages,
    publicPages: catalogPages,
    releaseScope: { mode: "pilot-path", promisedPageIds: ["TD-X805"], catalogComplete: false },
    canonicalManifest: {
      topics: [{ canonical_id: "TD-CAN-X805", aliases: [{ source_catalog: "site-89", source_id: "TD-X805" }] }],
    },
  });

  assert.equal(manifest.verdict, "PASS");
  assert.deepEqual(manifest.pages[0].canonical_topic_ids, ["TD-CAN-X805"]);
});

test("publication closure requires identical canonical, public, static, and ZIP bytes", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "publication-closure-"));
  try {
    const publicRoot = path.join(root, "public");
    const staticRoot = path.join(root, "static");
    const courseRoot = path.join(root, "courses");
    await mkdir(path.join(publicRoot, "materials/demo"), { recursive: true });
    await mkdir(path.join(staticRoot, "materials/demo"), { recursive: true });
    await mkdir(path.join(courseRoot, "demo"), { recursive: true });
    for (const file of [
      path.join(publicRoot, "materials/demo/README.md"),
      path.join(staticRoot, "materials/demo/README.md"),
      path.join(courseRoot, "demo/README.md"),
    ]) await writeFile(file, "closed bytes\n");
    const archived = spawnSync("zip", ["-qr", "demo.zip", "demo"], { cwd: path.join(publicRoot, "materials"), encoding: "utf8" });
    assert.equal(archived.status, 0, archived.stderr);
    await copyFile(path.join(publicRoot, "materials/demo.zip"), path.join(staticRoot, "materials/demo.zip"));
    const pages = [page("TD-P01", [
      { href: "materials/demo/README.md", kind: "guide", validation: "fixture-tested" },
      { href: "materials/demo.zip", kind: "archive", validation: "fixture-tested" },
    ])];
    assert.equal(buildPublicationClosure({ pages, publicRoot, staticRoot, courseRoot }).verdict, "PASS");
    await writeFile(path.join(staticRoot, "materials/demo/README.md"), "drifted bytes\n");
    const drifted = buildPublicationClosure({ pages, publicRoot, staticRoot, courseRoot });
    assert.equal(drifted.verdict, "FAIL");
    assert.match(drifted.entries[0].materials[0].findings.join("\n"), /hashes differ/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("publication closure follows byte-identical canonical sources across flattened layouts", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "publication-flattened-"));
  try {
    const publicRoot = path.join(root, "public");
    const staticRoot = path.join(root, "static");
    const courseRoot = path.join(root, "courses");
    await mkdir(path.join(publicRoot, "materials/demo/manifests"), { recursive: true });
    await mkdir(path.join(staticRoot, "materials/demo/manifests"), { recursive: true });
    await mkdir(path.join(courseRoot, "demo/lab/topic-manifests"), { recursive: true });
    for (const file of [
      path.join(publicRoot, "materials/demo/manifests/TD-X.json"),
      path.join(staticRoot, "materials/demo/manifests/TD-X.json"),
      path.join(courseRoot, "demo/lab/topic-manifests/TD-X.json"),
    ]) await writeFile(file, '{"status":"PASS-FIXTURE"}\n');
    const archived = spawnSync("zip", ["-qr", "demo.zip", "demo"], { cwd: path.join(publicRoot, "materials"), encoding: "utf8" });
    assert.equal(archived.status, 0, archived.stderr);
    await copyFile(path.join(publicRoot, "materials/demo.zip"), path.join(staticRoot, "materials/demo.zip"));
    const result = buildPublicationClosure({
      pages: [page("TD-X", [
        { href: "materials/demo/manifests/TD-X.json", kind: "evidence", validation: "fixture-tested" },
        { href: "materials/demo.zip", kind: "archive", validation: "fixture-tested" },
      ])],
      publicRoot,
      staticRoot,
      courseRoot,
    });

    assert.equal(result.verdict, "PASS");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("publication closure ignores only generated report run_id while keeping projections byte-exact", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "publication-report-receipt-"));
  try {
    const publicRoot = path.join(root, "public");
    const staticRoot = path.join(root, "static");
    const courseRoot = path.join(root, "courses");
    const publicReport = path.join(publicRoot, "materials/demo/reports/baseline.json");
    const staticReport = path.join(staticRoot, "materials/demo/reports/baseline.json");
    const canonicalReport = path.join(courseRoot, "demo/reports/baseline.json");
    await mkdir(path.dirname(publicReport), { recursive: true });
    await mkdir(path.dirname(staticReport), { recursive: true });
    await mkdir(path.dirname(canonicalReport), { recursive: true });
    await writeFile(canonicalReport, '{"run_id":"canonical-run","status":"PASS-FIXTURE","failed":0}\n');
    await writeFile(publicReport, '{"run_id":"published-run","status":"PASS-FIXTURE","failed":0}\n');
    await copyFile(publicReport, staticReport);
    const archived = spawnSync("zip", ["-qr", "demo.zip", "demo"], { cwd: path.join(publicRoot, "materials"), encoding: "utf8" });
    assert.equal(archived.status, 0, archived.stderr);
    await copyFile(path.join(publicRoot, "materials/demo.zip"), path.join(staticRoot, "materials/demo.zip"));
    const pages = [page("TD-REPORT", [
      { href: "materials/demo/reports/baseline.json", kind: "evidence", validation: "fixture-tested" },
      { href: "materials/demo.zip", kind: "archive", validation: "fixture-tested" },
    ])];

    const closed = buildPublicationClosure({ pages, publicRoot, staticRoot, courseRoot });
    assert.equal(closed.verdict, "PASS");
    const report = closed.entries[0].materials[0];
    assert.notEqual(report.raw_hashes.public, `sha256:${"0".repeat(64)}`);
    assert.equal(report.raw_hashes.public, report.raw_hashes.static);
    assert.equal(report.raw_hashes.public, report.raw_hashes.archive_member);

    await writeFile(canonicalReport, '{"run_id":"canonical-run","status":"PASS-FIXTURE","failed":1}\n');
    const semanticDrift = buildPublicationClosure({ pages, publicRoot, staticRoot, courseRoot });
    assert.equal(semanticDrift.verdict, "FAIL");
    assert.match(semanticDrift.findings.join("\n"), /canonical authoring source missing|ZIP closure/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("support ownership uses exact IDs and never prefix ownership", () => {
  const shared = [{ href: "materials/shared/README.md", kind: "guide", validation: "fixture-tested" }];
  const ownership = buildSupportOwnership({ pages: [page("TD-P01", shared), page("TD-PS01", shared)] });
  assert.equal(ownership.bundles.length, 1);
  assert.deepEqual(ownership.bundles[0].owner_page_ids, ["TD-P01", "TD-PS01"]);
  assert.equal(ownership.bundles[0].shared, true);
  assert.equal(ownership.page_owners["TD-P01"], ownership.bundles[0].bundle_id);
  assert.equal(ownership.page_owners["TD-PS01"], ownership.bundles[0].bundle_id);
});

test("promotion receipt fails closed when any of the exact ten research files is absent", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "promotion-receipt-"));
  try {
    const topicRoot = path.join(root, "TD-P01");
    await mkdir(topicRoot, { recursive: true });
    for (const name of REQUIRED_RESEARCH_FILES.slice(0, -1)) await writeFile(path.join(topicRoot, name), `${name}\n`);
    const receipt = await buildPromotionReceipt({
      page: page("TD-P01"),
      topicRoot,
      audit: { pageId: "TD-P01", verdict: "PASS", findingCount: 0, findings: [] },
      auditHash: "sha256:audit",
      closureEntries: [],
      validationTime: "2026-08-11T00:00:00.000Z",
      reviewer: "automated-integrity-gate",
    });
    assert.equal(receipt.verdict, "FAIL");
    assert.deepEqual(receipt.research_inventory.filter((item) => !item.exists).map((item) => item.path), ["projection-ledger.json"]);
    assert.match(receipt.findings.join("\n"), /exact ten-file research package incomplete/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("promotion receipt cannot pass an executability finding", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "promotion-receipt-"));
  try {
    for (const name of REQUIRED_RESEARCH_FILES) await writeFile(path.join(root, name), `${name}\n`);
    const receipt = await buildPromotionReceipt({
      page: page("TD-P01"),
      topicRoot: root,
      audit: { pageId: "TD-P01", verdict: "FAIL", findingCount: 1, findings: ["missing command manifest"] },
      auditHash: "sha256:audit",
      closureEntries: [],
      validationTime: "2026-08-11T00:00:00.000Z",
      reviewer: "automated-integrity-gate",
    });
    assert.equal(receipt.verdict, "FAIL");
    assert.match(receipt.findings.join("\n"), /executability audit/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("promotion receipt consumes an independent editorial review and pins current evidence", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "promotion-receipt-pass-"));
  try {
    for (const name of REQUIRED_RESEARCH_FILES) await writeFile(path.join(root, name), `${name}\n`);
    const attestation = '{"schema_version":"reviewer-independence-attestation.v1"}\n';
    await writeFile(path.join(root, "attestation.json"), attestation);
    const receipt = await buildPromotionReceipt({
      page: page("TD-P01"),
      topicRoot: root,
      audit: { page_id: "TD-P01", verdict: "PASS", finding_count: 0, findings: [] },
      auditHash: "sha256:audit",
      closureEntries: [{ page_id: "TD-P01", verdict: "PASS", materials: [] }],
      validationTime: "2026-08-11T00:00:00.000Z",
      reviewer: "independent-editorial-audit",
      independenceEvidenceRoot: root,
      evidenceRun: {
        schema_version: "evidence-run.v1",
        run_id: "integrity-test-run",
        started_at: "2026-08-11T00:00:00.000Z",
        finished_at: "2026-08-11T00:01:00.000Z",
        exit_code: 0,
        validator: { path: "scripts/generate-course-integrity-manifests.mjs", sha256: `sha256:${"a".repeat(64)}` },
        input_hashes: { course: `sha256:${"b".repeat(64)}`, tutorial: `sha256:${"c".repeat(64)}` },
      },
      editorialReview: {
        editorial_score: 94,
        boundary_preservation_score: 100,
        page_content_hash: "sha256:6bf8829b69c6541cfd3b80f55cb072f85458112e815ba0f65035044b43b7639b",
        review_ref: "research/editorial-review-2026-08-11-final.json",
        review_hash: "sha256:review",
        review_verdict: "PASS",
        reviewer_id: "independent-editorial-audit",
        author_id: "course-page-author",
        reviewer_independence: {
          status: "ATTESTED",
          evidence_ref: "attestation.json",
          evidence_sha256: `sha256:${createHash("sha256").update(attestation).digest("hex")}`,
          conflict_of_interest_declared: true,
        },
      },
    });

    assert.equal(receipt.verdict, "PASS");
    assert.deepEqual(receipt.research_package_files, REQUIRED_RESEARCH_FILES);
    assert.equal(receipt.executability_audit_ref, "research/executability-audit.json");
    assert.equal(receipt.executability_audit_hash, "sha256:audit");
    assert.equal(receipt.editorial_review_hash, "sha256:review");
    assert.equal(receipt.evidence_run_id, "integrity-test-run");
    assert.equal(receipt.input_content_sha256, `sha256:${"b".repeat(64)}`);
    assert.deepEqual(receipt.reviewer_independence, {
      status: "ATTESTED",
      evidence_ref: "attestation.json",
      evidence_sha256: `sha256:${createHash("sha256").update(attestation).digest("hex")}`,
      conflict_of_interest_declared: true,
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("promotion receipt rejects an attestation whose pinned evidence cannot be read", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "promotion-receipt-missing-attestation-"));
  try {
    for (const name of REQUIRED_RESEARCH_FILES) await writeFile(path.join(root, name), `${name}\n`);
    const receipt = await buildPromotionReceipt({
      page: page("TD-P01"),
      topicRoot: root,
      audit: { page_id: "TD-P01", verdict: "PASS", finding_count: 0, findings: [] },
      auditHash: "sha256:audit",
      closureEntries: [{ page_id: "TD-P01", verdict: "PASS", materials: [] }],
      validationTime: "2026-08-16T00:00:00.000Z",
      reviewer: "independent-editorial-audit",
      editorialReview: {
        editorial_score: 94,
        boundary_preservation_score: 100,
        page_content_hash: "sha256:6bf8829b69c6541cfd3b80f55cb072f85458112e815ba0f65035044b43b7639b",
        review_ref: "research/editorial-review-2026-08-11-final.json",
        review_hash: "sha256:review",
        review_verdict: "PASS",
        reviewer_id: "independent-editorial-audit",
        author_id: "course-page-author",
        reviewer_independence: {
          status: "ATTESTED",
          evidence_ref: "missing-attestation.json",
          evidence_sha256: "sha256:abc",
          conflict_of_interest_declared: true,
        },
      },
    });
    assert.equal(receipt.verdict, "FAIL");
    assert.match(receipt.findings.join("\n"), /independence is not attested/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("promotion receipt rejects self-review or a non-PASS page review", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "promotion-receipt-review-boundary-"));
  try {
    for (const name of REQUIRED_RESEARCH_FILES) await writeFile(path.join(root, name), `${name}\n`);
    const base = {
      page: page("TD-P01"),
      topicRoot: root,
      audit: { page_id: "TD-P01", verdict: "PASS", finding_count: 0, findings: [] },
      auditHash: "sha256:audit",
      closureEntries: [{ page_id: "TD-P01", verdict: "PASS", materials: [] }],
      validationTime: "2026-08-13T00:00:00.000Z",
      reviewer: "course-page-author",
    };
    const receipt = await buildPromotionReceipt({
      ...base,
      editorialReview: {
        editorial_score: 100,
        boundary_preservation_score: 100,
        page_content_hash: "sha256:6bf8829b69c6541cfd3b80f55cb072f85458112e815ba0f65035044b43b7639b",
        review_ref: "research/editorial-review-2026-08-11-final.json",
        review_hash: "sha256:review",
        review_verdict: "FAIL",
        reviewer_id: "course-page-author",
        author_id: "course-page-author",
        reviewer_independence: { status: "UNVERIFIED" },
      },
    });
    assert.equal(receipt.verdict, "FAIL");
    assert.match(receipt.findings.join("\n"), /page verdict is not PASS/);
    assert.match(receipt.findings.join("\n"), /independence is not attested/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
