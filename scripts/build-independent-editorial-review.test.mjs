import test from "node:test";
import assert from "node:assert/strict";

const { precheckHashStatus, applyPrecheckDuplication, moduleDuplication } = await import(`./build-independent-editorial-review.mjs?test=${Date.now()}`);

test("precheck is consumable only when all three evidence hashes match", () => {
  const current = {
    content_hash: "sha256:content-current",
    manuscript_hash: "sha256:manuscript-current",
    projection_hash: "sha256:projection-current",
  };
  const result = precheckHashStatus({ ...current }, current);
  assert.equal(result.valid, true);
  assert.deepEqual(result.mismatched_fields, []);
  assert.equal(result.reason, null);
});

test("any current hash drift rejects stale precheck and records the exact reason", () => {
  const current = {
    content_hash: "sha256:content-current",
    manuscript_hash: "sha256:manuscript-current",
    projection_hash: "sha256:projection-current",
  };
  const stale = { ...current, manuscript_hash: "sha256:manuscript-old" };
  const result = precheckHashStatus(stale, current);
  assert.equal(result.valid, false);
  assert.deepEqual(result.mismatched_fields, ["manuscript_hash"]);
  assert.match(result.reason, /manuscript_hash/);
  assert.match(result.reason, /stale/i);
});

test("stale precheck keeps current recomputation and records source plus reason", () => {
  const current = {
    content_hash: "sha256:content-current",
    manuscript_hash: "sha256:manuscript-current",
    projection_hash: "sha256:projection-current",
  };
  const stale = { ...current, projection_hash: "sha256:projection-old", dup_rate: "0.9876" };
  const result = applyPrecheckDuplication({ rate: 0.125, source: "current-recomputed" }, stale, current);
  assert.equal(result.rate, 0.125);
  assert.equal(result.source, "current-recomputed");
  assert.match(result.precheck_stale_reason, /projection_hash/);
});

test("hash-matched precheck may provide its measured rate", () => {
  const current = {
    content_hash: "sha256:content-current",
    manuscript_hash: "sha256:manuscript-current",
    projection_hash: "sha256:projection-current",
  };
  const result = applyPrecheckDuplication({ rate: 0.125, source: "current-recomputed" }, { ...current, dup_rate: "0.25" }, current);
  assert.equal(result.rate, 0.25);
  assert.equal(result.source, "precheck-hash-matched");
  assert.equal(result.precheck_stale_reason, undefined);
});

test("current recomputation compares tutorial learner projections, not runtime pages", () => {
  const pages = [
    { id: "P1", moduleId: "M1", content_sections: { teaching_blocks: [{ title: "共同句", body: ["这是一个足够长的中文句子，用来验证跨页重复。"] }] } },
    { id: "P2", moduleId: "M1", content_sections: { teaching_blocks: [{ title: "共同句", body: ["这是一个足够长的中文句子，用来验证跨页重复。"] }] } },
  ];
  const result = moduleDuplication(pages[0], pages, new Set());
  assert.equal(result.source, "current-recomputed");
  assert.equal(result.duplicated, 1);
  assert.equal(result.total, 1);
  assert.equal(result.rate, 1);
});
