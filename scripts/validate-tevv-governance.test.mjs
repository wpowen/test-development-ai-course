#!/usr/bin/env node

import assert from "node:assert/strict";
import test from "node:test";
import { validateGovernanceArtifacts, validateNotRunReceipt } from "./validate-tevv-governance.mjs";

test("a real-validation receipt template must remain NOT_RUN until external evidence exists", () => {
  assert.deepEqual(validateNotRunReceipt({
    receipt_kind: "real-model-validation",
    execution_status: "NOT_RUN",
    outcome: "NOT_RUN",
    evidence: [],
  }), []);
  assert.deepEqual(validateNotRunReceipt({
    receipt_kind: "real-model-validation",
    execution_status: "PASS",
    outcome: "PASS",
    evidence: [],
  }), ["receipt template must declare execution_status=NOT_RUN and outcome=NOT_RUN"]);
});

test("TEVV, Judge/Gold, threshold and learner-path contracts require decision-grade fields", () => {
  const findings = validateGovernanceArtifacts({
    matrix: { framework_functions: ["GOVERN"], system_layers: ["MODEL"], cells: [] },
    thresholdPolicy: { thresholds: [] },
    judgeCard: { calibration: {} },
    goldSetCard: { annotation_protocol: {} },
    learningPaths: { paths: [] },
  });
  assert.ok(findings.some((finding) => finding.includes("TEVV")));
  assert.ok(findings.some((finding) => finding.includes("threshold")));
  assert.ok(findings.some((finding) => finding.includes("Judge")));
  assert.ok(findings.some((finding) => finding.includes("Gold")));
  assert.ok(findings.some((finding) => finding.includes("learning path")));
});
