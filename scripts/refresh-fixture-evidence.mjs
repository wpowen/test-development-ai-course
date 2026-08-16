#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.dirname(scriptRoot);
const siteRoot = path.join(packageRoot, "site");
const integrityScript = path.join(scriptRoot, "generate-course-integrity-manifests.mjs");

const promotionFailure = (failure) => /^[A-Z0-9-]+: promotion FAIL$/.test(failure);

/**
 * A fixture refresh is allowed to preserve a higher-maturity block, but it
 * must never hide a stale manifest or a failed source/public/static/ZIP gate.
 */
export const classifyFixtureEvidenceRefresh = ({ problems = [], gateFailures = [] }) => {
  const unexpected_failures = [
    ...problems,
    ...gateFailures.filter((failure) => !promotionFailure(failure)),
  ];
  const promotion_blocker_count = gateFailures.filter(promotionFailure).length;
  if (unexpected_failures.length > 0) {
    return { verdict: "FAIL", promotion_blocker_count, unexpected_failures };
  }
  return {
    verdict: promotion_blocker_count > 0
      ? "FIXTURE_SYNCED_HIGHER_MATURITY_BLOCKED"
      : "FIXTURE_SYNCED",
    promotion_blocker_count,
    unexpected_failures: [],
  };
};

const parseIntegritySummary = (stdout) => {
  try {
    return JSON.parse(stdout);
  } catch {
    throw new Error("integrity generator did not emit a machine-readable JSON summary");
  }
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  // Static export must happen before receipts are written, otherwise receipts
  // can pin a stale dist hash even when public and ZIP artifacts are healthy.
  execFileSync("npm", ["run", "export:static"], { cwd: siteRoot, stdio: "inherit" });
  const result = spawnSync(process.execPath, [integrityScript, "--write"], {
    cwd: packageRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  const integrity = parseIntegritySummary(result.stdout);
  const summary = {
    schema_version: "fixture-evidence-refresh-summary.v1",
    static_export: "PASS",
    integrity: classifyFixtureEvidenceRefresh(integrity),
  };
  console.log(JSON.stringify(summary, null, 2));
  if (summary.integrity.verdict === "FAIL") process.exitCode = 1;
}
