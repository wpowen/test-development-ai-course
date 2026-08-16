#!/usr/bin/env node

import assert from "node:assert/strict";
import test from "node:test";
import {
  getLegacyStatisticalRuleFindings,
  isReviewerIndependenceAttested,
  validateStatusRecord,
} from "./validate-semantic-contracts.mjs";

test("UNKNOWN may be recorded but cannot close a release-controlling decision", () => {
  const findings = validateStatusRecord({
    fact_status: "UNKNOWN",
    controls: ["release"],
    unknown_scope: "production rollback threshold",
  });
  assert.deepEqual(findings, [
    "UNKNOWN requires unknown_class, stage, and risk_level",
    "UNKNOWN requires owner, next_evidence, expires_at, and escalation_action",
  ]);

  assert.deepEqual(validateStatusRecord({
    fact_status: "UNKNOWN",
    controls: ["analysis"],
    unknown_scope: "legacy interface behavior",
    unknown_class: "DISCOVERY",
    stage: "S2",
    risk_level: "LOW",
    owner: "service owner",
    next_evidence: "approved interface contract",
    expires_at: "2026-09-01T00:00:00Z",
    escalation_action: "escalate to product owner",
  }), []);
});

test("decision-critical UNKNOWN is blocked even when its follow-up fields are complete", () => {
  assert.deepEqual(validateStatusRecord({
    fact_status: "UNKNOWN",
    controls: ["release"],
    unknown_scope: "rollback threshold",
    unknown_class: "DECISION_CRITICAL",
    stage: "S9",
    risk_level: "HIGH",
    owner: "release owner",
    next_evidence: "approved rollback exercise receipt",
    expires_at: "2026-09-01T00:00:00Z",
    escalation_action: "block release and escalate to risk owner",
  }), ["DECISION_CRITICAL UNKNOWN blocks release, risk_decision, oracle, and exit_criterion closure"]);
});

test("CI-overlap-only regression rules and unconditional pass@k formulae are rejected", () => {
  const findings = getLegacyStatisticalRuleFindings([
    "版本间差异以 CI 是否重叠判定",
    "pass@k = 1 - (1-p)^k",
    "pass^k = p^k",
  ].join("\n"));
  assert.equal(findings.length, 3);
  assert.match(findings.join("\n"), /CI 重叠/);
  assert.match(findings.join("\n"), /IID/);
});

test("different identifiers are not independent-review evidence without an attestation", () => {
  assert.equal(isReviewerIndependenceAttested({
    reviewer_id: "reviewer-a",
    author_id: "author-b",
  }), false);
  assert.equal(isReviewerIndependenceAttested({
    reviewer_id: "reviewer-a",
    author_id: "author-b",
    reviewer_independence: {
      status: "ATTESTED",
      evidence_ref: "governance/reviews/2026-08-16.md",
      evidence_sha256: "sha256:abc",
      conflict_of_interest_declared: true,
    },
  }), true);
});
