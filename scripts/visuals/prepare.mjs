/** Seed an absent candidate from formal assets; existing candidates are read-only. */
import assert from 'node:assert/strict';
import {promises as fs} from 'node:fs';
import {basename, dirname, isAbsolute, relative, resolve, sep} from 'node:path';
import {projectRoot, candidateRoot} from './paths.mjs';
import {isMain, readRegular, safeRelative, sha256} from './release-gate.mjs';

const BASELINE_INVENTORY = 'docs/svg-redesign-2026-10-26/baseline-hashes.json';
const ANCILLARY = [
  'content/professional-visual-contracts.ts',
  ...['agent-architecture-system', 'career-evolution'].flatMap((bundle, i) => [
    `public/materials/${bundle}.zip`,
    `public/materials/${bundle}/source-visual-manifest.json`,
    `public/materials/${bundle}/visuals/${i ? 'career' : 'agent'}-visual-source.json`,
  ]),
];

// Inventory comes from committed paths, never generated output or renderer imports.
export async function visualInventory(root) {
  const baselineHashes = JSON.parse(await readRegular(root, BASELINE_INVENTORY));
  assert.ok(baselineHashes && typeof baselineHashes === 'object' && !Array.isArray(baselineHashes), 'Invalid baseline inventory');
  const svgPaths = Object.keys(baselineHashes).filter(path => path.endsWith('.svg')).sort();
  assert.equal(svgPaths.length, 126, 'Baseline inventory must contain 126 SVGs');
  for (const path of svgPaths) {
    safeRelative(path);
    assert.ok(path.startsWith('public/visuals/') || path.startsWith('public/materials/'), `Invalid SVG inventory path: ${path}`);
    assert.match(baselineHashes[path], /^[a-f0-9]{64}$/, `Invalid baseline SHA-256: ${path}`);
  }
  return {paths: [...svgPaths, ...ANCILLARY].sort(), svgPaths, baselineHashes};
}

async function statIfPresent(path) {
  try { return await fs.lstat(path); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function readHashes(path, paths) {
  const hashes = JSON.parse(await readRegular(dirname(path), basename(path)));
  assert.ok(hashes && typeof hashes === 'object' && !Array.isArray(hashes), `Invalid hash map: ${path}`);
  assert.deepEqual(Object.keys(hashes).sort(), paths, `Hash inventory mismatch: ${path}`);
  for (const value of Object.values(hashes)) assert.match(value, /^[a-f0-9]{64}$/, `Invalid SHA-256 in ${path}`);
  return hashes;
}

async function candidateFiles(root, prefix) {
  const stat = await fs.lstat(resolve(root, prefix));
  assert.ok(!stat.isSymbolicLink() && stat.isDirectory(), `Candidate inventory symlink/directory: ${prefix}`);
  const paths = [];
  for (const entry of await fs.readdir(resolve(root, prefix), {withFileTypes: true})) {
    const path = `${prefix}/${entry.name}`;
    assert.ok(!entry.isSymbolicLink(), `Candidate inventory symlink: ${path}`);
    if (entry.isDirectory()) paths.push(...await candidateFiles(root, path));
    else {
      assert.ok(entry.isFile(), `Candidate inventory non-file: ${path}`);
      paths.push(path);
    }
  }
  return paths;
}

async function inspectCandidate(root, candidate, baselinePath, paths) {
  const issues = [];
  const modifiedFiles = [];
  const readMap = async path => {
    try { return await readHashes(path, paths); }
    catch (error) { issues.push({path, issue: error.message}); return null; }
  };
  const recorded = await readMap(resolve(candidate, 'file-hashes.json'));
  const baseline = await readMap(baselinePath);
  try {
    const found = [...await candidateFiles(candidate, 'public'), ...await candidateFiles(candidate, 'content')].sort();
    assert.deepEqual(found, paths, 'Candidate inventory mismatch (missing or unexpected files)');
  } catch (error) { issues.push({path: candidate, issue: error.message}); }
  for (const path of paths) {
    try {
      const actual = sha256(await readRegular(candidate, path));
      // Build/partial redraws legitimately precede the audit hash refresh.
      // Report those byte changes without rewriting hashes or approving review.
      if (recorded && actual !== recorded[path]) modifiedFiles.push({path, issue: 'Candidate hash mismatch', expected_sha256: recorded[path], actual_sha256: actual});
    } catch (error) { issues.push({path, issue: `Candidate missing/invalid: ${error.message}`}); }
    if (baseline) {
      try {
        const actual = sha256(await readRegular(root, path));
        if (actual !== baseline[path]) issues.push({path, issue: 'Formal baseline hash mismatch', expected_sha256: baseline[path], actual_sha256: actual});
      } catch (error) { issues.push({path, issue: `Formal baseline missing/invalid: ${error.message}`}); }
    }
  }
  const status = issues.length ? 'EXISTING_INVALID' : modifiedFiles.length ? 'EXISTING_MODIFIED' : 'EXISTING_INTACT';
  return {status, candidate_root: candidate, file_count: paths.length, review_status: 'NOT_ASSESSED', issues, modified_files: modifiedFiles};
}

// Resolve even an absent destination through its nearest existing ancestor.
async function canonicalDestination(path) {
  const tail = [];
  let ancestor = path;
  while (!await statIfPresent(ancestor)) {
    tail.unshift(basename(ancestor));
    ancestor = dirname(ancestor);
  }
  return resolve(await fs.realpath(ancestor), ...tail);
}
function contains(parent, child) {
  const path = relative(parent, child);
  return !path || (!isAbsolute(path) && path !== '..' && !path.startsWith('..' + sep));
}

export async function prepareCandidate(options = {}) {
  const root = await fs.realpath(resolve(options.projectRoot ?? projectRoot));
  const requested = resolve(options.candidateRoot ?? (options.projectRoot
    ? resolve(root, 'output/svg-release-20261026/candidate') : candidateRoot));
  const existing = await statIfPresent(requested);
  assert.ok(!existing || (!existing.isSymbolicLink() && existing.isDirectory()), 'Candidate must be a directory, not a symlink');
  const candidate = await canonicalDestination(requested);
  for (const source of ['public', 'content', 'docs', 'scripts', '.git']) {
    const formal = resolve(root, source);
    assert.ok(!contains(formal, candidate) && !contains(candidate, formal), 'Candidate must not overlap formal/source directories');
  }
  const baselinePath = resolve(candidate, '../formal-baseline.json');
  const {paths} = await visualInventory(root);
  if (existing) return inspectCandidate(root, candidate, baselinePath, paths);

  // Validate and snapshot all inputs before creating any output. Formal bytes are
  // never rewritten, and an existing baseline must still describe those bytes.
  const files = new Map();
  const hashes = {};
  for (const path of paths) {
    const bytes = await readRegular(root, path);
    files.set(path, bytes);
    hashes[path] = sha256(bytes);
  }
  if (await statIfPresent(baselinePath)) {
    const baseline = await readHashes(baselinePath, paths);
    assert.deepEqual(hashes, baseline, 'Formal baseline changed; refusing to replace the existing baseline');
  }
  await fs.mkdir(dirname(candidate), {recursive: true});
  if (!await statIfPresent(baselinePath)) {
    await fs.writeFile(baselinePath, JSON.stringify(hashes, null, 2) + '\n', {flag: 'wx'});
  }
  // Exclusive creation refuses another preparer or an intervening user directory.
  // If interrupted, keep the partial candidate for inspection; never reset it.
  await fs.mkdir(candidate);
  for (const [path, bytes] of files) {
    const target = resolve(candidate, path);
    await fs.mkdir(dirname(target), {recursive: true});
    await fs.writeFile(target, bytes, {flag: 'wx'});
  }
  await fs.writeFile(resolve(candidate, 'file-hashes.json'), JSON.stringify(hashes, null, 2) + '\n', {flag: 'wx'});
  const result = await inspectCandidate(root, candidate, baselinePath, paths);
  assert.equal(result.status, 'EXISTING_INTACT', 'Candidate changed during preparation');
  return {...result, status: 'PREPARED', formal_baseline: baselinePath};
}

if (isMain(import.meta.url)) {
  try {
    assert.equal(process.argv.length, 2, 'Usage: node scripts/visuals/prepare.mjs');
    const result = await prepareCandidate();
    console.log(JSON.stringify(result, null, 2));
    if (result.status === 'EXISTING_INVALID') process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
