import assert from "node:assert/strict";
import test from "node:test";

import { classifyFixtureEvidenceRefresh } from "./refresh-fixture-evidence.mjs";

test("fixture evidence refresh accepts only expected higher-maturity promotion blocks", () => {
  assert.deepEqual(classifyFixtureEvidenceRefresh({
    problems: [],
    gateFailures: ["TD-P01: promotion FAIL", "TD-P02: promotion FAIL"],
  }), {
    verdict: "FIXTURE_SYNCED_HIGHER_MATURITY_BLOCKED",
    promotion_blocker_count: 2,
    unexpected_failures: [],
  });
});

test("fixture evidence refresh rejects closure or manifest failures", () => {
  const result = classifyFixtureEvidenceRefresh({
    problems: ["manifest stale: research/publication-closure.json"],
    gateFailures: ["publication-closure.v1: FAIL", "TD-P01: promotion FAIL"],
  });
  assert.equal(result.verdict, "FAIL");
  assert.deepEqual(result.unexpected_failures, [
    "manifest stale: research/publication-closure.json",
    "publication-closure.v1: FAIL",
  ]);
});
