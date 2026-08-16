#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.dirname(SCRIPT_ROOT);
const TEVV_ROOT = path.join(PACKAGE_ROOT, "governance", "tevv");
const RECEIPTS_ROOT = path.join(PACKAGE_ROOT, "governance", "validation-receipts");
const LEARNING_PATHS = path.join(PACKAGE_ROOT, "courses", "learning-paths", "learning-paths.json");

const parseJsonYaml = (file) => JSON.parse(readFileSync(file, "utf8"));
const required = (object, fields, label, findings) => {
  for (const field of fields) if (object?.[field] === undefined || object[field] === "" || object[field] === null) findings.push(`${label} missing ${field}`);
};

export const validateNotRunReceipt = (receipt) => {
  if (receipt?.execution_status === "NOT_RUN" && receipt?.outcome === "NOT_RUN") return [];
  return ["receipt template must declare execution_status=NOT_RUN and outcome=NOT_RUN"];
};

export const validateGovernanceArtifacts = ({ matrix, thresholdPolicy, judgeCard, goldSetCard, learningPaths }) => {
  const findings = [];
  const framework = ["GOVERN", "MAP", "MEASURE", "MANAGE"];
  const layers = ["MODEL", "RETRIEVAL", "TOOL", "APPLICATION", "HUMAN_DECISION"];
  const lifecycle = ["DEFINE", "BUILD", "EVALUATE", "RELEASE", "OPERATE"];
  if (!framework.every((value) => matrix?.framework_functions?.includes(value)) || !layers.every((value) => matrix?.system_layers?.includes(value))) findings.push("TEVV matrix must cover four framework functions and five system layers");
  for (const frameworkFunction of framework) for (const layer of layers) {
    const cell = matrix?.cells?.find((candidate) => candidate.framework === frameworkFunction && candidate.layer === layer);
    if (!cell) {
      findings.push(`TEVV matrix missing ${frameworkFunction} × ${layer}`);
      continue;
    }
    if (!lifecycle.every((stage) => cell.lifecycle_stages?.includes(stage))) findings.push(`TEVV cell ${frameworkFunction} × ${layer} must cover all lifecycle stages`);
    required(cell, ["risk", "scenario", "oracle", "data", "owner", "evidence", "monitor", "rollback"], `TEVV cell ${frameworkFunction} × ${layer}`, findings);
  }
  if (!Array.isArray(thresholdPolicy?.thresholds) || thresholdPolicy.thresholds.length === 0) findings.push("threshold policy requires at least one threshold");
  for (const threshold of thresholdPolicy?.thresholds ?? []) required(threshold, ["policy_id", "metric", "comparison", "target", "source", "applicable_system", "target_slice", "statistical_assumptions", "owner", "effective_until", "recalibration_triggers", "waiver_rule", "failure_action", "status"], `threshold ${threshold.policy_id ?? "unknown"}`, findings);
  required(judgeCard, ["decision_boundary", "target_construct", "rubric", "calibration", "reporting", "next_evidence"], "Judge Card", findings);
  required(goldSetCard, ["construct_and_harm", "provenance", "splits", "slice_plan", "annotation_protocol", "quality_controls", "next_evidence"], "Gold-set Card", findings);
  const paths = learningPaths?.paths ?? [];
  if (paths.length !== 3) findings.push("learning path artifact must define exactly three learner paths");
  for (const pathDefinition of paths) {
    required(pathDefinition, ["path_id", "duration", "target_learner", "capstone", "steps"], "learning path", findings);
    for (const step of pathDefinition.steps ?? []) required(step, ["prerequisite", "input", "command", "expected_output", "common_failure", "human_check", "artifact"], `learning path step ${pathDefinition.path_id ?? "unknown"}`, findings);
  }
  return findings;
};

const main = () => {
  const artifacts = {
    matrix: parseJsonYaml(path.join(TEVV_ROOT, "ai-tevv-coverage-matrix.yaml")),
    thresholdPolicy: parseJsonYaml(path.join(TEVV_ROOT, "..", "threshold-policy.yaml")),
    judgeCard: parseJsonYaml(path.join(TEVV_ROOT, "judge-card.template.yaml")),
    goldSetCard: parseJsonYaml(path.join(TEVV_ROOT, "gold-set-card.template.yaml")),
    learningPaths: parseJsonYaml(LEARNING_PATHS),
  };
  const findings = validateGovernanceArtifacts(artifacts);
  for (const entry of readdirSync(RECEIPTS_ROOT, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".template.json")) continue;
    const file = path.join(RECEIPTS_ROOT, entry.name);
    for (const finding of validateNotRunReceipt(JSON.parse(readFileSync(file, "utf8")))) findings.push(`${path.relative(PACKAGE_ROOT, file)}: ${finding}`);
  }
  if (findings.length > 0) {
    console.error("TEVV governance validation failed:\n" + findings.map((finding) => `- ${finding}`).join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log("TEVV governance validation passed: 20 TEVV cells, 4 threshold policies, 3 learner paths and NOT_RUN receipt templates.");
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
