import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  validateEvidenceFreshness,
  validateHistoricalClaim,
  validateEvidenceGovernance,
} from "./validate-evidence-governance.mjs";

const NOW = "2026-08-16T12:00:00.000Z";
const run = (overrides = {}) => ({
  schema_version: "evidence-run.v1",
  run_id: "integrity-2026-08-16T11-00-00Z-abc123",
  command: "node scripts/generate-course-integrity-manifests.mjs --write",
  started_at: "2026-08-16T11:00:00.000Z",
  finished_at: "2026-08-16T11:01:00.000Z",
  exit_code: 0,
  validator: { path: "scripts/generate-course-integrity-manifests.mjs", sha256: `sha256:${"a".repeat(64)}` },
  input_hashes: { course: "sha256:course", tutorial: "sha256:tutorial" },
  ...overrides,
});

test("fresh evidence requires immutable run metadata, matching inputs, and a bounded TTL", () => {
  const fresh = validateEvidenceFreshness({
    artifactPath: "research/executability-audit.json",
    record: { evidence_run: run() },
    expectedInputHashes: { course: "sha256:course", tutorial: "sha256:tutorial" },
    now: NOW,
    maxAgeMs: 2 * 60 * 60 * 1000,
  });
  assert.deepEqual(fresh.findings, []);

  const stale = validateEvidenceFreshness({
    artifactPath: "research/executability-audit.json",
    record: { evidence_run: run({ finished_at: "2026-08-15T00:00:00.000Z" }) },
    expectedInputHashes: { course: "sha256:course", tutorial: "sha256:tutorial" },
    now: NOW,
    maxAgeMs: 2 * 60 * 60 * 1000,
  });
  assert.match(stale.findings.join("\n"), /freshness TTL expired/);

  const changed = validateEvidenceFreshness({
    artifactPath: "research/executability-audit.json",
    record: { evidence_run: run({ input_hashes: { course: "sha256:old", tutorial: "sha256:tutorial" } }) },
    expectedInputHashes: { course: "sha256:course", tutorial: "sha256:tutorial" },
    now: NOW,
    maxAgeMs: 2 * 60 * 60 * 1000,
  });
  assert.match(changed.findings.join("\n"), /input hash changed: course/);
});

test("a historical final or acceptance document needs explicit supersession metadata and replacement", () => {
  const missing = validateHistoricalClaim({
    relativePath: "human-review/06-最终课程验收.md",
    text: "# 最终课程验收\n\n85 页课程通过。\n",
  });
  assert.match(missing.findings.join("\n"), /missing status: superseded/);
  assert.match(missing.findings.join("\n"), /missing replacement/);

  const compliant = validateHistoricalClaim({
    relativePath: "human-review/06-最终课程验收.md",
    text: "---\nstatus: superseded\nsuperseded_at: 2026-08-16\nreplacement: human-review/11-测试开发专家全量质量审计与修订计划-2026-08-16.md\n---\n\n> 历史快照，不代表当前课程。\n\n# 最终课程验收\n",
  });
  assert.deepEqual(compliant.findings, []);
});

test("repository validator emits a machine-readable failing summary instead of accepting legacy artifacts", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "evidence-governance-"));
  try {
    await mkdir(path.join(root, "research"), { recursive: true });
    await mkdir(path.join(root, "human-review"), { recursive: true });
    await writeFile(path.join(root, "research", "executability-audit.json"), JSON.stringify({ verdict: "PASS" }));
    await writeFile(path.join(root, "research", "publication-closure.json"), JSON.stringify({ verdict: "PASS" }));
    await writeFile(path.join(root, "research", "editorial-review-2026-08-11-final.json"), JSON.stringify({ verdict: "PASS" }));
    await writeFile(path.join(root, "human-review", "06-最终课程验收.md"), "# 最终课程验收\n85 页\n");
    const result = validateEvidenceGovernance({ root, now: NOW, maxAgeMs: 60_000 });
    assert.equal(result.schema_version, "evidence-governance-summary.v1");
    assert.equal(result.verdict, "FAIL");
    assert.ok(result.findings.length >= 4);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("a reported immutable run must exist as an unmodified append-only record", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "evidence-run-record-"));
  try {
    await mkdir(path.join(root, "research", "evidence-runs"), { recursive: true });
    await mkdir(path.join(root, "human-review"), { recursive: true });
    const record = run();
    for (const name of ["executability-audit.json", "publication-closure.json", "editorial-review-2026-08-11-final.json"]) {
      await writeFile(path.join(root, "research", name), JSON.stringify({ evidence_run: record }));
    }
    await writeFile(path.join(root, "research", "evidence-runs", `${record.run_id}.json`), JSON.stringify(record));
    let result = validateEvidenceGovernance({ root, now: NOW, maxAgeMs: 2 * 60 * 60 * 1000 });
    assert.equal(result.verdict, "PASS");

    await writeFile(path.join(root, "research", "evidence-runs", `${record.run_id}.json`), JSON.stringify({ ...record, exit_code: 1 }));
    result = validateEvidenceGovernance({ root, now: NOW, maxAgeMs: 2 * 60 * 60 * 1000 });
    assert.match(result.findings.join("\n"), /immutable run record differs/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
