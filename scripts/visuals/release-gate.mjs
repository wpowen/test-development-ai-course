/** Read-only, fail-closed release contract. This does not perform visual review. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {promises as fs, realpathSync} from 'node:fs';
import {dirname, isAbsolute, relative, resolve, sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {projectRoot, candidateRoot, reviewRoot} from './paths.mjs';

export const REVIEW_GROUPS = Object.freeze({
  'course-1': 29, 'course-2': 29, 'course-3': 27, materials: 25, 'modules-aliases': 16,
});
export const RECEIPT_TTL_MS = 24 * 60 * 60 * 1000;
const ANCILLARY = [
  'content/professional-visual-contracts.ts',
  ...['agent-architecture-system', 'career-evolution'].flatMap((bundle, i) => [
    `public/materials/${bundle}.zip`,
    `public/materials/${bundle}/source-visual-manifest.json`,
    `public/materials/${bundle}/visuals/${i ? 'career' : 'agent'}-visual-source.json`,
  ]),
].sort();
const EVIDENCE = ['manifest.json', 'batch-verification.json', 'integrity-verification.json', 'file-hashes.json', 'page-visual-bindings.json'];
const HASH = /^[a-f0-9]{64}$/;
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const isMain = url => Boolean(process.argv[1]) && pathToFileURL(realpathSync(process.argv[1])).href === url;

export function releasePaths(options = {}) {
  const root = resolve(options.projectRoot ?? projectRoot);
  const candidate = resolve(options.candidateRoot ?? (options.projectRoot
    ? resolve(root, 'output/svg-release-20261026/candidate') : candidateRoot));
  return {
    projectRoot: root, candidateRoot: candidate,
    reviewRoot: resolve(options.reviewRoot ?? (options.projectRoot
      ? resolve(root, 'docs/svg-redesign-2026-10-26/release-review') : reviewRoot)),
    baselinePath: resolve(options.baselinePath ?? resolve(candidate, '../formal-baseline.json')),
    receiptPath: resolve(options.receiptPath ?? resolve(candidate, '../approval-receipt.json')),
  };
}

export function safeRelative(path) {
  assert.ok(typeof path === 'string' && path.length && !isAbsolute(path)
    && !path.includes('\\') && !path.includes('\0')
    && path.split('/').every(part => part && part !== '.' && part !== '..'), `Unsafe path: ${path}`);
  return path;
}
function inside(root, path) {
  const rel = relative(root, path);
  return rel === '' || (!rel.startsWith('..' + sep) && rel !== '..' && !isAbsolute(rel));
}

// Canonicalize the root (the workspace has an ancestor symlink), then refuse
// symlinks below it, including parent directories, on every individual access.
export async function regularFile(root, path) {
  safeRelative(path);
  let target = await fs.realpath(root);
  const parts = path.split('/');
  for (const [i, part] of parts.entries()) {
    target = resolve(target, part);
    const stat = await fs.lstat(target);
    assert.ok(!stat.isSymbolicLink(), `Symlink is not allowed: ${path}`);
    assert.ok(i === parts.length - 1 ? stat.isFile() : stat.isDirectory(), `Not a regular file path: ${path}`);
  }
  return target;
}
export async function readRegular(root, path) {
  return fs.readFile(await regularFile(root, path));
}
async function readDocument(path) {
  return fs.readFile(await regularFile(dirname(path), path.split(sep).at(-1)));
}
function object(value, label) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${label}: expected object`);
}
function samePaths(actual, expected, label) {
  assert.deepEqual([...actual].sort(), [...expected].sort(), `${label}: count/coverage mismatch`);
}
function hashMap(value, label) {
  object(value, label);
  for (const [path, hash] of Object.entries(value)) {
    safeRelative(path);
    assert.match(hash, HASH, `${label}: invalid hash for ${path}`);
  }
}
function indexRows(rows, label) {
  assert.ok(Array.isArray(rows), `${label}: expected results array`);
  const result = new Map();
  for (const row of rows) {
    object(row, label);
    safeRelative(row.path);
    assert.ok(!result.has(row.path), `${label}: duplicate path ${row.path}`);
    result.set(row.path, row);
  }
  return result;
}
function noBlockers(value, label) {
  if (!value || typeof value !== 'object') return;
  const priority = value.severity ?? value.priority;
  if (/^P[12]$/i.test(String(priority))) {
    const status = String(value.status ?? '').toUpperCase();
    const resolved = value.resolved !== false
      && (!status || ['RESOLVED', 'FIXED', 'CLOSED'].includes(status))
      && (value.resolved === true || ['RESOLVED', 'FIXED', 'CLOSED'].includes(status));
    assert.ok(resolved, `${label}: unresolved ${priority}`);
  }
  for (const child of Object.values(value)) noBlockers(child, label);
}
async function inventory(root, prefix) {
  const directory = resolve(root, prefix);
  const stat = await fs.lstat(directory);
  assert.ok(!stat.isSymbolicLink() && stat.isDirectory(), `Candidate inventory symlink/directory: ${prefix}`);
  const paths = [];
  for (const entry of await fs.readdir(directory, {withFileTypes: true})) {
    const path = `${prefix}/${entry.name}`;
    assert.ok(!entry.isSymbolicLink(), `Candidate inventory symlink: ${path}`);
    if (entry.isDirectory()) paths.push(...await inventory(root, path));
    else {
      assert.ok(entry.isFile(), `Candidate inventory non-file: ${path}`);
      paths.push(path);
    }
  }
  return paths;
}

async function checkRegistries(candidate, visuals, fileHashes, bindings, integrity) {
  for (const [i, bundle] of ['agent-architecture-system', 'career-evolution'].entries()) {
    const base = `materials/${bundle}/`;
    const sourceName = `${i ? 'career' : 'agent'}-visual-source.json`;
    const registry = JSON.parse(await readRegular(candidate, `public/${base}source-visual-manifest.json`));
    const source = JSON.parse(await readRegular(candidate, `public/${base}visuals/${sourceName}`));
    assert.ok(Array.isArray(registry.visuals) && Array.isArray(source.visuals), 'Integrity registry visuals missing');
    const expected = [...visuals.keys()].filter(path => path.startsWith(base));
    assert.equal(expected.length, i ? 9 : 16, 'Integrity registry inventory count');
    const records = indexRows(registry.visuals.map(row => ({...row, path: base + safeRelative(row.rendered_path)})), 'Integrity registry');
    samePaths(records.keys(), expected, 'Integrity registry coverage');
    const sources = indexRows(source.visuals.map(row => ({...row, path: base + 'visuals/' + safeRelative(row.file)})), 'Integrity source registry');
    samePaths(sources.keys(), expected, 'Integrity source registry coverage');
    for (const [path, row] of records) {
      assert.equal(row.sha256, fileHashes['public/' + path], `Integrity registry hash stale: ${path}`);
      assert.equal(row.editable_path, 'visuals/' + sourceName, `Integrity registry editable path: ${path}`);
      assert.ok(typeof row.visual_id === 'string' && row.visual_id, `Integrity registry visual_id: ${path}`);
      assert.equal(sources.get(path).visual_id, row.visual_id, `Integrity source registry id: ${path}`);
    }
  }
  const bindingRows = new Map();
  assert.ok(Array.isArray(bindings), 'Integrity page bindings missing');
  for (const row of bindings) {
    assert.ok(typeof row.id === 'string' && !bindingRows.has(row.id), 'Integrity duplicate page binding');
    bindingRows.set(row.id, row);
    const [path, query] = String(row.src).split('?');
    assert.ok(visuals.has(path), `Integrity binding unknown path: ${row.id}`);
    assert.equal(query, path.startsWith('visuals/course/') ? 'v=' + visuals.get(path).sha256.slice(0, 12) : undefined,
      `Integrity binding cache hash stale: ${row.id}`);
  }
  assert.equal(bindingRows.size, integrity.page_bindings, 'Integrity page binding count');
  // Parse the generated, one-JSON-record-per-line TS format without evaluating it.
  const ts = (await readRegular(candidate, 'content/professional-visual-contracts.ts')).toString('utf8');
  const body = ts.match(/export const professionalVisualContracts: Record<string, ProfessionalVisualContract> = \{\n([\s\S]*)\n\};\s*$/);
  assert.ok(body, 'Integrity TS map format');
  const ids = new Set();
  for (const line of body[1].split('\n').filter(line => line.trim())) {
    const match = line.match(/^\s*("(?:[^"\\]|\\.)*"):\s*(\{.*\}),\s*$/);
    assert.ok(match, 'Integrity TS map record format');
    const id = JSON.parse(match[1]), binding = JSON.parse(match[2]);
    assert.ok(!ids.has(id) && bindingRows.has(id), `Integrity TS map duplicate/unknown id: ${id}`);
    ids.add(id);
    assert.equal(binding.src, bindingRows.get(id).src, `Integrity TS map src stale: ${id}`);
    assert.equal(binding.alt, bindingRows.get(id).alt, `Integrity TS map alt stale: ${id}`);
  }
  samePaths(ids, bindingRows.keys(), 'Integrity TS map coverage');
  // Reuse the same Python stdlib ZIP reader already used by visuals/sync.mjs.
  // Every changed package member must exist exactly once and match staged bytes.
  const zipCheck = spawnSync('python3', ['-c', `
import hashlib, json, pathlib, sys, zipfile
root = pathlib.Path(sys.argv[1])
hashes = json.load(sys.stdin)
for bundle in ['agent-architecture-system', 'career-evolution']:
 prefix = 'public/materials/' + bundle + '/'
 expected = {path[len(prefix):]: sha for path, sha in hashes.items() if path.startswith(prefix)}
 seen = set()
 with zipfile.ZipFile(root / ('public/materials/' + bundle + '.zip')) as archive:
  for info in archive.infolist():
   name = info.filename
   if name.startswith(bundle + '/'): name = name[len(bundle) + 1:]
   if name not in expected: continue
   assert name not in seen, 'duplicate member: ' + name
   seen.add(name)
   assert hashlib.sha256(archive.read(info)).hexdigest() == expected[name], 'stale member: ' + name
 assert seen == set(expected), 'missing changed ZIP members: ' + bundle
`, candidate], {input: JSON.stringify(fileHashes), encoding: 'utf8', timeout: 30_000, maxBuffer: 1024 * 1024});
  assert.equal(zipCheck.status, 0, `Integrity ZIP verification failed: ${zipCheck.error?.message ?? zipCheck.stderr}`);
}

export async function checkRelease(options = {}) {
  const paths = releasePaths(options);
  const root = await fs.realpath(paths.projectRoot);
  const candidate = await fs.realpath(paths.candidateRoot);
  const reviews = await fs.realpath(paths.reviewRoot);
  assert.ok(!inside(resolve(root, 'public'), candidate) && !inside(resolve(root, 'content'), candidate)
    && !inside(candidate, root), 'Candidate must be isolated from formal content/public');
  const baselineBytes = await readDocument(paths.baselinePath);
  const baseline = JSON.parse(baselineBytes);
  hashMap(baseline, 'Formal baseline inventory');
  const expected = Object.keys(baseline).sort();
  assert.equal(expected.length, 133, 'Formal baseline inventory must contain 133 files');
  const svgPaths = expected.filter(path => path.endsWith('.svg'));
  assert.equal(svgPaths.length, 126, 'Formal baseline inventory must contain 126 SVGs');
  assert.ok(svgPaths.every(path => path.startsWith('public/')), 'SVG inventory must be under public/');
  samePaths(expected.filter(path => !path.endsWith('.svg')), ANCILLARY, 'Ancillary inventory');
  const files = [...await inventory(candidate, 'public'), ...await inventory(candidate, 'content')];
  samePaths(files, expected, 'Candidate inventory');

  const evidenceHashes = {}, documents = {};
  for (const name of EVIDENCE) {
    const bytes = await readRegular(candidate, name);
    evidenceHashes[name] = sha256(bytes);
    documents[name] = JSON.parse(bytes);
  }
  const manifest = documents['manifest.json'];
  assert.equal(manifest.schema_version, '2.0.0', 'Unsupported candidate manifest schema');
  assert.equal(manifest.status, 'COMPLETE_LOCAL_VERIFIED', 'Candidate manifest is incomplete');
  assert.equal(manifest.validation?.rendered, 'batch-verification.json', 'Unsupported QC evidence path');
  assert.equal(manifest.validation?.integrity, 'integrity-verification.json', 'Unsupported integrity evidence path');
  const visuals = indexRows(manifest.visuals, 'Manifest');
  samePaths([...visuals.keys()].map(path => 'public/' + path), svgPaths, 'Manifest SVG inventory');
  const recordedHashes = documents['file-hashes.json'];
  hashMap(recordedHashes, 'Candidate hashes');
  samePaths(Object.keys(recordedHashes), expected, 'Candidate hash inventory');
  const fileHashes = {};
  for (const path of expected) {
    fileHashes[path] = sha256(await readRegular(candidate, path));
    assert.equal(fileHashes[path], recordedHashes[path], `Candidate hash stale: ${path}`);
  }
  for (const [path, row] of visuals) {
    assert.equal(row.sha256, fileHashes['public/' + path], `Manifest hash stale: ${path}`);
  }
  const qc = documents['batch-verification.json'];
  assert.equal(qc.status, 'PASS', 'QC must PASS');
  assert.equal(qc.assetCount, 126, 'QC asset count');
  assert.equal(qc.passCount, 126, 'QC pass count');
  const qcRows = indexRows(qc.results, 'QC');
  samePaths(qcRows.keys(), visuals.keys(), 'QC coverage');
  for (const [path, row] of qcRows) {
    assert.equal(row.status, 'PASS', `QC must PASS: ${path}`);
    assert.equal(row.sha256, visuals.get(path).sha256, `QC hash stale: ${path}`);
    for (const field of ['outside', 'overflow', 'overlaps', 'labelNodeCollisions', 'semanticEdgeMismatches']) {
      assert.deepEqual(row[field], [], `QC ${field}: ${path}`);
    }
    assert.equal(row.nonVector, 0, `QC nonVector: ${path}`);
  }
  const integrity = documents['integrity-verification.json'];
  assert.equal(integrity.status, 'PASS', 'Integrity must PASS');
  for (const field of ['unique_resource_paths', 'changed_svg_files', 'rendered_qc_passes']) {
    assert.equal(integrity[field], 126, `Integrity ${field}`);
  }
  assert.equal(integrity.material_manifest_coverage, '25/25', 'Integrity material coverage');
  await checkRegistries(candidate, visuals, fileHashes, documents['page-visual-bindings.json'], integrity);
  noBlockers(qc, 'QC');
  noBlockers(integrity, 'Integrity');

  const reviewed = new Map(), reviewHashes = {};
  for (const [group, count] of Object.entries(REVIEW_GROUPS)) {
    const name = group + '.json';
    const bytes = await readRegular(reviews, name);
    reviewHashes[name] = sha256(bytes);
    const document = JSON.parse(bytes);
    noBlockers(document, `Review ${group}`);
    // Both a raw results array and a results envelope are accepted. Inputs
    // and contact-sheet summaries are never treated as review results.
    const rows = indexRows(Array.isArray(document) ? document : document.results, `Review ${group}`);
    assert.equal(rows.size, count, `Review ${group}: count/coverage mismatch`);
    for (const [path, row] of rows) {
      assert.ok(!reviewed.has(path), `Review duplicate across groups: ${path}`);
      assert.ok(visuals.has(path), `Review unknown path: ${path}`);
      assert.equal(row.visual_inspected, true, `Review visual_inspected required: ${path}`);
      assert.equal(row.body_checked, true, `Review body_checked required: ${path}`);
      assert.equal(row.verdict, 'PASS', `Review verdict must PASS: ${path}`);
      assert.equal(row.sha256, visuals.get(path).sha256, `Review hash stale: ${path}`);
      reviewed.set(path, row);
    }
  }
  samePaths(reviewed.keys(), visuals.keys(), 'Review coverage');
  return {
    formal_root: root, candidate_root: candidate, review_root: reviews,
    visual_count: 126, file_count: 133, file_hashes: fileHashes,
    review_hashes: reviewHashes, evidence_hashes: evidenceHashes,
    formal_baseline_sha256: sha256(baselineBytes),
  };
}

export function receiptFor(snapshot, issuedAt) {
  const receipt = {
    schema_version: '1.0.0', status: 'APPROVED', issued_at: issuedAt,
    expires_at: new Date(Date.parse(issuedAt) + RECEIPT_TTL_MS).toISOString(), ...snapshot,
  };
  return {...receipt, receipt_sha256: sha256(JSON.stringify(receipt))};
}

export async function verifyReceipt(options = {}) {
  const paths = releasePaths(options);
  const receiptBytes = await readDocument(paths.receiptPath);
  // The approval writer pins the exact issued bytes outside the editable JSON.
  // This catches re-checksummed timestamps/fields as well as ordinary drift.
  // This is a local integrity seal, not authentication against a hostile signer.
  const seal = (await readDocument(paths.receiptPath + '.sha256')).toString('utf8').trim();
  assert.match(seal, HASH, 'Receipt seal is invalid');
  assert.equal(sha256(receiptBytes), seal, 'Receipt bytes mutated after approval');
  const receipt = JSON.parse(receiptBytes);
  const issued = Date.parse(receipt.issued_at);
  const now = options.now ?? Date.now();
  assert.ok(Number.isFinite(issued) && Number.isFinite(now), 'Receipt timestamp invalid');
  assert.equal(new Date(issued).toISOString(), receipt.issued_at, 'Receipt timestamp must be canonical');
  assert.ok(now >= issued, 'Receipt issued in the future');
  assert.ok(now < issued + RECEIPT_TTL_MS, 'Receipt expired; rerun the full gate and approve');
  const snapshot = await checkRelease(options);
  assert.deepEqual(receipt, receiptFor(snapshot, receipt.issued_at), 'Receipt stale or mutated; rerun the full gate and approve');
  return receipt;
}

// A gate invocation is read-only, including when no approval exists yet.
if (isMain(import.meta.url)) {
  try {
    assert.equal(process.argv.length, 2, 'Usage: node scripts/visuals/release-gate.mjs');
    const snapshot = await checkRelease();
    console.log(JSON.stringify({status: 'PASS', ...snapshot}, null, 2));
  } catch (error) {
    console.error(`RELEASE_BLOCKED: ${error.message}`);
    process.exitCode = 1;
  }
}
