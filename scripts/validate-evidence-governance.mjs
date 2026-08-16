#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.dirname(SCRIPT_ROOT);
const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const evidenceArtifacts = [
  "research/executability-audit.json",
  "research/publication-closure.json",
  "research/editorial-review-2026-08-11-final.json",
];
const supersededHistoricalFiles = new Set([
  "human-review/04-完整方案审计.md",
  "human-review/05-逐命题深研与代码可执行性审计.md",
  "human-review/06-最终课程验收.md",
  "human-review/07-102页课程重建检查点.md",
]);

const sha256File = (file) => `sha256:${createHash("sha256").update(readFileSync(file)).digest("hex")}`;
const isFile = (file) => existsSync(file) && statSync(file).isFile();
const isIsoDate = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));
const posix = (value) => value.split(path.sep).join("/");

export const validateEvidenceFreshness = ({ artifactPath, record, expectedInputHashes = {}, now = new Date().toISOString(), maxAgeMs = DEFAULT_MAX_AGE_MS }) => {
  const findings = [];
  const run = record?.evidence_run;
  if (!run || typeof run !== "object") {
    return { artifact_path: artifactPath, verdict: "FAIL", findings: ["missing immutable evidence_run metadata"] };
  }
  if (run.schema_version !== "evidence-run.v1") findings.push("unsupported evidence_run schema_version");
  if (typeof run.run_id !== "string" || !/^[a-z0-9][a-z0-9._-]+$/i.test(run.run_id)) findings.push("missing or invalid evidence_run.run_id");
  if (typeof run.command !== "string" || run.command.length === 0) findings.push("missing evidence_run.command");
  if (!isIsoDate(run.started_at) || !isIsoDate(run.finished_at)) findings.push("missing or invalid evidence_run start/end timestamps");
  if (isIsoDate(run.started_at) && isIsoDate(run.finished_at) && Date.parse(run.finished_at) < Date.parse(run.started_at)) findings.push("evidence_run finished before it started");
  if (run.exit_code !== 0) findings.push("evidence_run exit_code is not 0");
  if (!run.validator || typeof run.validator.path !== "string" || !run.validator.path || typeof run.validator.sha256 !== "string" || !/^sha256:[a-f0-9]{64}$/.test(run.validator.sha256)) findings.push("missing pinned validator path or SHA-256");
  if (!run.input_hashes || typeof run.input_hashes !== "object") findings.push("missing evidence_run.input_hashes");
  for (const [name, expectedHash] of Object.entries(expectedInputHashes)) {
    if (run.input_hashes?.[name] !== expectedHash) findings.push(`input hash changed: ${name}`);
  }
  if (isIsoDate(run.finished_at)) {
    const ageMs = Date.parse(now) - Date.parse(run.finished_at);
    if (ageMs > maxAgeMs) findings.push(`freshness TTL expired: ${Math.floor(ageMs / 1000)}s exceeds ${Math.floor(maxAgeMs / 1000)}s`);
    if (ageMs < 0) findings.push("evidence_run finished_at is in the future");
  }
  return { artifact_path: artifactPath, run_id: run.run_id ?? null, verdict: findings.length === 0 ? "PASS" : "FAIL", findings };
};

export const validateHistoricalClaim = ({ relativePath, text }) => {
  const findings = [];
  const historicalFinalClaim = supersededHistoricalFiles.has(relativePath)
    || /(?:最终|验收|final|acceptance)/i.test(relativePath)
    || /#\s*(?:最终|.*验收|.*final|.*acceptance)/im.test(text);
  if (!historicalFinalClaim) return { artifact_path: relativePath, verdict: "PASS", findings };
  if (!/^---\s*\n[\s\S]*?^status:\s*superseded\s*$/m.test(text)) findings.push("missing status: superseded metadata");
  if (!/^---\s*\n[\s\S]*?^superseded_at:\s*\S+/m.test(text)) findings.push("missing superseded_at metadata");
  if (!/^---\s*\n[\s\S]*?^replacement:\s*\S+/m.test(text)) findings.push("missing replacement metadata");
  if (!/>\s*(?:\*\*)?(?:历史(?:快照|文档)|Superseded)/i.test(text)) findings.push("missing visible historical/superseded banner");
  return { artifact_path: relativePath, verdict: findings.length === 0 ? "PASS" : "FAIL", findings };
};

const expectedHashesFor = (root) => {
  const inputs = {
    course: "site/content/course.ts",
    tutorial: "tutorial/tutorial-site.json",
  };
  return Object.fromEntries(Object.entries(inputs)
    .filter(([, relative]) => isFile(path.join(root, relative)))
    .map(([name, relative]) => [name, sha256File(path.join(root, relative))]));
};

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));

const validateImmutableRunRecord = ({ root, run }) => {
  if (!run?.run_id) return ["immutable run record cannot be resolved without run_id"];
  const recordPath = path.join(root, "research", "evidence-runs", `${run.run_id}.json`);
  if (!isFile(recordPath)) return [`immutable run record is missing: research/evidence-runs/${run.run_id}.json`];
  try {
    return JSON.stringify(readJson(recordPath)) === JSON.stringify(run) ? [] : ["immutable run record differs from referenced evidence_run metadata"];
  } catch (error) {
    return [`immutable run record is invalid JSON: ${error.message}`];
  }
};

export const validateEvidenceGovernance = ({ root = PACKAGE_ROOT, now = new Date().toISOString(), maxAgeMs = DEFAULT_MAX_AGE_MS } = {}) => {
  const expectedInputHashes = expectedHashesFor(root);
  const artifactChecks = evidenceArtifacts.map((relative) => {
    const absolute = path.join(root, relative);
    if (!isFile(absolute)) return { artifact_path: relative, verdict: "FAIL", findings: ["required evidence artifact is missing"] };
    try {
      const record = readJson(absolute);
      const check = validateEvidenceFreshness({ artifactPath: relative, record, expectedInputHashes, now, maxAgeMs });
      const recordFindings = validateImmutableRunRecord({ root, run: record.evidence_run });
      return { ...check, verdict: check.findings.length + recordFindings.length === 0 ? "PASS" : "FAIL", findings: [...check.findings, ...recordFindings] };
    } catch (error) {
      return { artifact_path: relative, verdict: "FAIL", findings: [`invalid JSON: ${error.message}`] };
    }
  });
  const humanReviewRoot = path.join(root, "human-review");
  const historicalChecks = isFile(humanReviewRoot) ? [] : (existsSync(humanReviewRoot)
    ? readdirSync(humanReviewRoot).filter((name) => name.endsWith(".md")).map((name) => {
      const absolute = path.join(humanReviewRoot, name);
      return validateHistoricalClaim({ relativePath: posix(path.join("human-review", name)), text: readFileSync(absolute, "utf8") });
    }) : [{ artifact_path: "human-review", verdict: "FAIL", findings: ["human-review directory is missing"] }]);
  const findings = [...artifactChecks, ...historicalChecks]
    .filter((check) => check.verdict !== "PASS")
    .flatMap((check) => check.findings.map((finding) => `${check.artifact_path}: ${finding}`));
  return {
    schema_version: "evidence-governance-summary.v1",
    checked_at: now,
    freshness_policy: { max_age_seconds: Math.floor(maxAgeMs / 1000), required_inputs: Object.keys(expectedInputHashes) },
    artifact_checks: artifactChecks,
    historical_claim_checks: historicalChecks,
    verdict: findings.length === 0 ? "PASS" : "FAIL",
    findings,
  };
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const summaryIndex = process.argv.indexOf("--summary");
  const summaryPath = summaryIndex >= 0 ? process.argv[summaryIndex + 1] : null;
  if (summaryIndex >= 0 && (!summaryPath || summaryPath.startsWith("-"))) throw new Error("--summary requires a file path");
  const result = validateEvidenceGovernance();
  const output = `${JSON.stringify(result, null, 2)}\n`;
  if (summaryPath) writeFileSync(path.resolve(summaryPath), output);
  process.stdout.write(output);
  if (result.verdict !== "PASS") process.exitCode = 1;
}
