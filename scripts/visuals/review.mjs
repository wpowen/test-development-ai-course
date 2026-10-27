/** Validate existing per-image attestations; never manufacture review verdicts.
 * Default/--check is read-only. --approve writes a 24-hour, content-bound receipt.
 */
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import {checkRelease, isMain, receiptFor, releasePaths, sha256, verifyReceipt} from './release-gate.mjs';

export async function approveRelease(options = {}) {
  const paths = releasePaths(options);
  // Fix the output location outside the candidate inventory and review inputs.
  assert.equal(paths.receiptPath, resolve(paths.candidateRoot, '../approval-receipt.json'), 'Receipt must use the release approval-receipt.json path');
  const snapshot = await checkRelease(options);
  const receipt = receiptFor(snapshot, new Date(options.now ?? Date.now()).toISOString());
  const bytes = JSON.stringify(receipt, null, 2) + '\n';
  const temporary = `${paths.receiptPath}.${randomUUID()}.tmp`;
  const sealTemporary = temporary + '.sha256';
  try {
    await fs.writeFile(temporary, bytes, {flag: 'wx', mode: 0o600});
    await fs.writeFile(sealTemporary, sha256(bytes) + '\n', {flag: 'wx', mode: 0o600});
    // A reader between these renames sees an invalid pair and fails closed.
    await fs.rename(temporary, paths.receiptPath);
    await fs.rename(sealTemporary, paths.receiptPath + '.sha256');
  } finally {
    await fs.rm(temporary, {force: true});
    await fs.rm(sealTemporary, {force: true});
  }
  // Detect changes while the receipt was being written; an invalid receipt
  // cannot subsequently authorize promotion.
  await verifyReceipt(options);
  return {receiptPath: paths.receiptPath, receipt};
}

if (isMain(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    assert.ok(args.length <= 1 && (!args.length || ['--check', '--approve', '--check-receipt'].includes(args[0])),
      'Usage: node scripts/visuals/review.mjs [--check|--approve|--check-receipt]');
    if (args[0] === '--approve') {
      const {receiptPath, receipt} = await approveRelease();
      console.log(JSON.stringify({status: 'APPROVED', receiptPath, receipt_sha256: receipt.receipt_sha256}, null, 2));
    } else if (args[0] === '--check-receipt') {
      const receipt = await verifyReceipt();
      console.log(JSON.stringify({status: 'PASS', receipt_sha256: receipt.receipt_sha256}, null, 2));
    } else {
      const snapshot = await checkRelease();
      console.log(JSON.stringify({status: 'PASS', visual_count: snapshot.visual_count, file_count: snapshot.file_count}, null, 2));
    }
  } catch (error) {
    console.error(`REVIEW_BLOCKED: ${error.message}`);
    process.exitCode = 1;
  }
}
