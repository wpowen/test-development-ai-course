/** Explicit local promotion only; never deploys. Importing this file is inert. */
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {promises as fs} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {isMain, readRegular, regularFile, releasePaths, sha256, verifyReceipt} from './release-gate.mjs';

async function atomicReplace(path, bytes, mode, guard) {
  const temporary = `${path}.${randomUUID()}.release-tmp`;
  let displaced = false, installed = false;
  try {
    await fs.writeFile(temporary, bytes, {flag: 'wx', mode});
    if (!guard) {
      await fs.rename(temporary, path);
      return;
    }
    await fs.mkdir(dirname(guard.displacedPath), {recursive: true});
    // Capture the actual destination inode rather than overwriting it. A save
    // since the preflight is preserved here and detected before installation.
    await fs.rename(path, guard.displacedPath);
    displaced = true;
    assert.equal(sha256(await fs.readFile(guard.displacedPath)), guard.expectedHash,
      `Formal baseline/concurrent edit before installation: ${path}`);
    // link is exclusive: a user save that recreates the destination wins.
    await fs.link(temporary, path);
    installed = true;
    assert.equal(sha256(await fs.readFile(guard.displacedPath)), guard.expectedHash,
      `Concurrent edit on displaced inode: ${path}`);
  } catch (error) {
    if (displaced && !installed) {
      try { await fs.link(guard.displacedPath, path); }
      catch (restoreError) {
        if (restoreError.code !== 'EEXIST') throw new AggregateError([error, restoreError], `Cannot restore displaced file: ${path}`);
      }
    }
    throw error;
  } finally {
    await fs.rm(temporary, {force: true});
  }
}
async function saveJSON(path, value) {
  await atomicReplace(path, JSON.stringify(value, null, 2) + '\n', 0o600);
}
async function checkFormal(root, baseline) {
  for (const [path, hash] of Object.entries(baseline)) {
    assert.equal(sha256(await readRegular(root, path)), hash, `Formal baseline mismatch: ${path}`);
  }
}

export async function promoteRelease(options = {}) {
  const paths = releasePaths(options);
  const parent = await fs.realpath(dirname(paths.candidateRoot));
  const lock = resolve(parent, '.promotion.lock');
  // mkdir is exclusive. A failed lock acquisition must not remove another lock.
  await fs.mkdir(lock);
  let backupRoot, transaction;
  const touched = [], original = new Map(), staged = new Map(), modes = new Map();
  try {
    const receipt = await verifyReceipt(options);
    const root = receipt.formal_root;
    const baselineBytes = await readRegular(dirname(paths.baselinePath), paths.baselinePath.split('/').at(-1));
    assert.equal(sha256(baselineBytes), receipt.formal_baseline_sha256, 'Formal baseline hash changed');
    const baseline = JSON.parse(baselineBytes);
    await checkFormal(root, baseline);
    // Install image/package bytes before switching the page contract.
    const releaseFiles=Object.entries(receipt.file_hashes).sort(([a],[b])=>Number(a.startsWith('content/'))-Number(b.startsWith('content/'))||a.localeCompare(b));
    for (const [path, hash] of releaseFiles) {
      const bytes = await readRegular(receipt.candidate_root, path);
      assert.equal(sha256(bytes), hash, `Candidate hash stale before staging: ${path}`);
      staged.set(path, bytes);
      const target = await regularFile(root, path);
      const old = await fs.readFile(target);
      assert.equal(sha256(old), baseline[path], `Formal baseline mismatch before backup: ${path}`);
      original.set(path, old);
      modes.set(path, (await fs.stat(target)).mode & 0o777);
    }
    const backups = resolve(parent, 'promotion-backups');
    await fs.mkdir(backups, {recursive: true});
    assert.ok(!(await fs.lstat(backups)).isSymbolicLink(), 'Backup directory cannot be a symlink');
    backupRoot = await fs.mkdtemp(resolve(backups, new Date().toISOString().replaceAll(':', '-') + '-'));
    transaction = {status: 'PREPARING', receipt_sha256: receipt.receipt_sha256, file_count: 133, files: baseline};
    await saveJSON(resolve(backupRoot, 'transaction.json'), transaction);
    for (const [path, bytes] of original) {
      const backup = resolve(backupRoot, 'original', path);
      await fs.mkdir(dirname(backup), {recursive: true});
      await fs.writeFile(backup, bytes, {flag: 'wx', mode: modes.get(path)});
      assert.equal(sha256(await fs.readFile(backup)), baseline[path], `Backup readback failed: ${path}`);
    }
    transaction.status = 'PREPARED';
    await saveJSON(resolve(backupRoot, 'transaction.json'), transaction);
    // No formal writes until the complete backup, gate, receipt and baseline
    // have passed again. Promote the verified in-memory bytes, never a later read.
    assert.deepEqual(await verifyReceipt(options), receipt, 'Receipt changed during backup');
    await checkFormal(root, baseline);
    for (const [path, bytes] of staged) {
      const target = await regularFile(root, path);
      assert.equal(sha256(await fs.readFile(target)), baseline[path], `Formal baseline mismatch before copy: ${path}`);
      touched.push(path);
      await atomicReplace(target, bytes, modes.get(path), {
        expectedHash: baseline[path], displacedPath: resolve(backupRoot, 'displaced/promotion', path),
      });
      assert.equal(sha256(await readRegular(root, path)), receipt.file_hashes[path], `Promotion readback failed: ${path}`);
    }
    // A review or candidate mutation during copying invalidates the transaction.
    assert.deepEqual(await verifyReceipt(options), receipt, 'Receipt changed during copy');
    await checkFormal(root, receipt.file_hashes);
    transaction.status = 'PROMOTED';
    await saveJSON(resolve(backupRoot, 'transaction.json'), transaction);
    return {status: 'PROMOTED', file_count: staged.size, backupRoot};
  } catch (error) {
    const rollbackErrors = [];
    // Never overwrite a third party's intervening edit during rollback.
    for (const path of [...touched].reverse()) {
      try {
        const target = await regularFile(paths.projectRoot, path);
        const current = sha256(await fs.readFile(target));
        if (current === sha256(original.get(path))) continue;
        assert.equal(current, sha256(staged.get(path)), `Rollback conflict (concurrent edit): ${path}`);
        await atomicReplace(target, original.get(path), modes.get(path), {
          expectedHash: sha256(staged.get(path)), displacedPath: resolve(backupRoot, 'displaced/rollback', path),
        });
        assert.equal(sha256(await fs.readFile(target)), sha256(original.get(path)), `Rollback readback failed: ${path}`);
      } catch (rollbackError) { rollbackErrors.push(rollbackError); }
    }
    if (backupRoot && transaction) {
      transaction.status = rollbackErrors.length ? 'ROLLBACK_FAILED' : 'ROLLED_BACK';
      transaction.error = error.message;
      transaction.rollback_errors = rollbackErrors.map(item => item.message);
      try { await saveJSON(resolve(backupRoot, 'transaction.json'), transaction); }
      catch (journalError) { rollbackErrors.push(journalError); }
    }
    if (rollbackErrors.length) {
      throw new AggregateError([error, ...rollbackErrors], `Promotion failed; rollback requires recovery from ${backupRoot}: ${error.message}`);
    }
    throw error;
  } finally {
    await fs.rmdir(lock);
  }
}

if (isMain(import.meta.url)) {
  try {
    assert.equal(process.argv.length, 3, 'Usage: node scripts/visuals/promote.mjs --execute');
    assert.equal(process.argv[2], '--execute', 'Explicit --execute is required for formal promotion');
    console.log(JSON.stringify(await promoteRelease(), null, 2));
  } catch (error) {
    console.error(`PROMOTION_BLOCKED: ${error.message}`);
    process.exitCode = 1;
  }
}
