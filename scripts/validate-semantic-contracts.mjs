#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.dirname(SCRIPT_ROOT);
const METHODOLOGY_ROOT = path.join(PACKAGE_ROOT, "methodology");
const SOURCE_ROOT = path.join(METHODOLOGY_ROOT, "dimensions", "_sources");

const read = (file) => readFileSync(file, "utf8");
const sourceFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  if (entry.isDirectory()) return sourceFiles(file);
  return entry.isFile() && entry.name.endsWith(".json") ? [file] : [];
});

export const validateStatusRecord = (record) => {
  if (record.fact_status !== "UNKNOWN") return [];
  const findings = [];
  if (!record.unknown_scope) findings.push("UNKNOWN requires unknown_scope");
  if (!record.unknown_class || !record.stage || !record.risk_level) findings.push("UNKNOWN requires unknown_class, stage, and risk_level");
  if (!record.owner || !record.next_evidence || !record.expires_at || !record.escalation_action) {
    findings.push("UNKNOWN requires owner, next_evidence, expires_at, and escalation_action");
  }
  if (record.unknown_class === "DISCOVERY" && !["S1", "S2"].includes(record.stage)) findings.push("DISCOVERY UNKNOWN is only permitted in S1 or S2");
  if (record.unknown_class === "DISCOVERY" && !["LOW", "MEDIUM"].includes(record.risk_level)) findings.push("DISCOVERY UNKNOWN is only permitted for LOW or MEDIUM risk");
  if (record.unknown_class === "DECISION_CRITICAL") findings.push("DECISION_CRITICAL UNKNOWN blocks release, risk_decision, oracle, and exit_criterion closure");
  return findings;
};

export const getLegacyStatisticalRuleFindings = (text) => {
  const findings = [];
  const hasCiOverlapCriterion = text.split("\n").some((line) => {
    if (!/CI 是否重叠|区间是否重叠/.test(line)) return false;
    return !/(?:不以|不能以|禁止以|禁止用).{0,24}(?:CI 是否重叠|区间是否重叠)/.test(line);
  });
  if (hasCiOverlapCriterion) findings.push("CI 重叠不能作为回归或差异判定的唯一规则");
  const statesIidAssumption = /IID|独立同分布|任务同质/.test(text);
  if (/1\s*-\s*\(1-p\)\^k/.test(text) && !statesIidAssumption) findings.push("pass@k 解析式必须声明 IID/同质性前提");
  if (/p\^k/.test(text) && !statesIidAssumption) findings.push("pass^k 解析式必须声明 IID/同质性前提");
  return findings;
};

export const isReviewerIndependenceAttested = (review) => {
  const attestation = review?.reviewer_independence;
  return Boolean(
    review?.reviewer_id
      && review?.author_id
      && review.reviewer_id !== review.author_id
      && attestation?.status === "ATTESTED"
      && typeof attestation.evidence_ref === "string"
      && attestation.evidence_ref.length > 0
      && /^sha256:[a-f0-9]+$/i.test(attestation.evidence_sha256 ?? "")
      && attestation.conflict_of_interest_declared === true,
  );
};

const main = () => {
  const findings = [];
  const statusModel = JSON.parse(read(path.join(METHODOLOGY_ROOT, "status-model.schema.json")));
  for (const namespace of ["fact_status", "execution_status", "gate_status", "maturity", "record_lifecycle"]) {
    if (!Array.isArray(statusModel.namespaces?.[namespace]) || statusModel.namespaces[namespace].length === 0) findings.push(`status model missing namespace: ${namespace}`);
  }
  for (const [unknownClass, route] of Object.entries(statusModel.unknown_routes ?? {})) {
    for (const field of ["allowed_stages", "allowed_risk_levels", "allowed_actions", "required_fields", "closure_rule"]) {
      if ((Array.isArray(route[field]) && route[field].length > 0) || (typeof route[field] === "string" && route[field].length > 0)) continue;
      findings.push(`status model route ${unknownClass} missing ${field}`);
    }
  }
  if (!statusModel.unknown_routes?.DISCOVERY || !statusModel.unknown_routes?.DECISION_CRITICAL) findings.push("status model must define DISCOVERY and DECISION_CRITICAL UNKNOWN routes");
  const axiom = read(path.join(METHODOLOGY_ROOT, "01-公理与责任模型.md"));
  const lifecycle = read(path.join(METHODOLOGY_ROOT, "03-生命周期总览.md"));
  if (!/UNKNOWN`?\s*可被登记/.test(axiom)) findings.push("axiom does not define UNKNOWN registration and propagation");
  if (!lifecycle.includes("unknown_scope")) findings.push("lifecycle does not require UNKNOWN scope and closure evidence");
  for (const file of [path.join(METHODOLOGY_ROOT, "08-度量体系.md"), ...sourceFiles(SOURCE_ROOT)]) {
    for (const finding of getLegacyStatisticalRuleFindings(read(file))) findings.push(`${path.relative(PACKAGE_ROOT, file)}: ${finding}`);
  }
  if (findings.length > 0) {
    console.error("Semantic contract validation failed:\n" + findings.map((finding) => `- ${finding}`).join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log("Semantic contract validation passed.");
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
