import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {promises as fs} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {checkRelease, verifyReceipt} from '../scripts/visuals/release-gate.mjs';
import {approveRelease} from '../scripts/visuals/review.mjs';
import {promoteRelease} from '../scripts/visuals/promote.mjs';

const sha = value => createHash('sha256').update(value).digest('hex');
const groups = ['course-1', 'course-2', 'course-3', 'materials', 'modules-aliases'];
const ancillary = [
  'content/professional-visual-contracts.ts',
  ...['agent-architecture-system', 'career-evolution'].flatMap((bundle, i) => [
    `public/materials/${bundle}.zip`,
    `public/materials/${bundle}/source-visual-manifest.json`,
    `public/materials/${bundle}/visuals/${i ? 'career' : 'agent'}-visual-source.json`,
  ]),
];
const readJSON = async path => JSON.parse(await fs.readFile(path, 'utf8'));
async function write(path, value) {
  await fs.mkdir(dirname(path), {recursive: true});
  await fs.writeFile(path, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
}
async function fixture(t) {
  const root = await fs.mkdtemp(resolve(tmpdir(), 'svg-release-gate-'));
  t.after(() => fs.rm(root, {recursive: true, force: true}));
  const candidateRoot = resolve(root, 'output/release/candidate');
  const reviewRoot = resolve(root, 'docs/release-review');
  const baselinePath = resolve(candidateRoot, '../formal-baseline.json');
  const receiptPath = resolve(candidateRoot, '../approval-receipt.json');
  const options = {projectRoot: root, candidateRoot, reviewRoot, baselinePath, receiptPath};
  const baseline = {}, hashes = {}, visuals = [], results = [];
  for (let i = 0; i < 126; i++) {
    const directory = i < 101 ? 'visuals/course' : `materials/${i < 117 ? 'agent-architecture-system' : 'career-evolution'}/visuals`;
    const path = `${directory}/fixture-${String(i).padStart(3, '0')}.svg`;
    const content = `<svg><title>Fixture ${i}</title><desc>Test only</desc></svg>`;
    visuals.push({id: `fixture-${i}`, path, sha256: sha(content)});
    results.push({path, sha256: sha(content), status: 'PASS',outside:[],overflow:[],overlaps:[],labelNodeCollisions:[],semanticEdgeMismatches:[],nonVector:0});
  }
  const bindings = visuals.slice(0, 103).map(v => ({id: v.id,
    src: v.path + (v.path.startsWith('visuals/course/') ? '?v=' + v.sha256.slice(0, 12) : ''), alt: v.id}));
  const contracts = 'export const professionalVisualContracts: Record<string, ProfessionalVisualContract> = {\n'
    + bindings.map(({id, ...binding}) => `  ${JSON.stringify(id)}: ${JSON.stringify({...binding, kind: 'flow'})},`).join('\n') + '\n};\n';
  const ancillaryContent = {[ancillary[0]]: contracts};
  for (const [i, bundle] of ['agent-architecture-system', 'career-evolution'].entries()) {
    const subset = visuals.filter(v => v.path.startsWith(`materials/${bundle}/`));
    const sourceName = `${i ? 'career' : 'agent'}-visual-source.json`;
    ancillaryContent[`public/materials/${bundle}/source-visual-manifest.json`] = JSON.stringify({visuals: subset.map(v => ({
      visual_id: v.id, rendered_path: 'visuals/' + v.path.split('/').at(-1), editable_path: 'visuals/' + sourceName, sha256: v.sha256,
    }))});
    ancillaryContent[`public/materials/${bundle}/visuals/${sourceName}`] = JSON.stringify({visuals: subset.map(v => ({visual_id: v.id, file: v.path.split('/').at(-1)}))});
  }
  for (const path of [...visuals.map(v => 'public/' + v.path), ...ancillary]) {
    const content = path.endsWith('.svg') ? `<svg><title>Fixture ${visuals.findIndex(v => 'public/' + v.path === path)}</title><desc>Test only</desc></svg>` : ancillaryContent[path] ?? `candidate ${path}`;
    const old = `old ${path}`;
    hashes[path] = sha(content); baseline[path] = sha(old);
    await write(resolve(candidateRoot, path), content);
    await write(resolve(root, path), old);
  }
  // Use actual ZIP containers so archive/member integrity is exercised end to end.
  const zipped = spawnSync('python3', ['-c', `
import pathlib, sys, zipfile
root = pathlib.Path(sys.argv[1])
for bundle in ['agent-architecture-system', 'career-evolution']:
 base = root / 'public/materials' / bundle
 with zipfile.ZipFile(str(base) + '.zip', 'w') as archive:
  for file in base.rglob('*'):
   if file.is_file(): archive.write(file, bundle + '/' + str(file.relative_to(base)))
`, candidateRoot], {encoding: 'utf8'});
  assert.equal(zipped.status, 0, zipped.stderr);
  for (const path of ancillary.filter(path => path.endsWith('.zip'))) hashes[path] = sha(await fs.readFile(resolve(candidateRoot, path)));
  await write(resolve(candidateRoot, 'page-visual-bindings.json'), bindings);
  await write(baselinePath, baseline);
  await write(resolve(candidateRoot, 'file-hashes.json'), hashes);
  await write(resolve(candidateRoot, 'manifest.json'), {
    schema_version: '2.0.0', status: 'COMPLETE_LOCAL_VERIFIED', visuals,
    validation: {rendered: 'batch-verification.json', integrity: 'integrity-verification.json'},
  });
  await write(resolve(candidateRoot, 'batch-verification.json'), {status: 'PASS', assetCount: 126, passCount: 126, results});
  await write(resolve(candidateRoot, 'integrity-verification.json'), {
    status: 'PASS', unique_resource_paths: 126, changed_svg_files: 126, page_bindings: 103,
    rendered_qc_passes: 126, material_manifest_coverage: '25/25',
  });
  let offset = 0;
  for (const [i, count] of [29, 29, 27, 25, 16].entries()) {
    await write(resolve(reviewRoot, groups[i] + '.json'), {results: visuals.slice(offset, offset + count).map(v => ({
      path: v.path, sha256: v.sha256, visual_inspected: true, body_checked: true, verdict: 'PASS', issues: [],
    }))});
    offset += count;
  }
  return {...options, options, baseline, hashes};
}
async function formalHashes(f) {
  return Object.fromEntries(await Promise.all(Object.keys(f.baseline).map(async path => [path, sha(await fs.readFile(resolve(f.projectRoot, path)))])));
}
async function editJSON(path, edit) {
  const value = await readJSON(path); edit(value); await write(path, value);
}
async function rejectsUntouched(f, action, pattern) {
  const before = await formalHashes(f);
  await assert.rejects(action, pattern);
  assert.deepEqual(await formalHashes(f), before);
}

// These are synthetic attestations only. No production review result is written.
test('complete isolated fixture binds 133 files and five review hashes; approval does not promote', async t => {
  const f = await fixture(t);
  const before = await formalHashes(f);
  const snapshot = await checkRelease(f.options);
  assert.equal(Object.keys(snapshot.file_hashes).length, 133);
  assert.equal(Object.keys(snapshot.review_hashes).length, 5);
  await approveRelease(f.options);
  await verifyReceipt(f.options);
  assert.deepEqual(await formalHashes(f), before);
});

for (const [label, change, pattern] of [
  ['partial review', d => d.results.pop(), /review.*(count|coverage)/i],
  ['duplicate review', d => {d.results[1] = d.results[0];}, /duplicate/i],
  ['unknown review path', d => {d.results[0].path = 'unknown.svg';}, /(unknown|coverage)/i],
  ['stale review', d => {d.results[0].sha256 = '0'.repeat(64);}, /review.*(stale|hash)/i],
  ['REWORK', d => {d.results[0].verdict = 'REWORK';}, /verdict/i],
  ['uninspected image', d => {d.results[0].visual_inspected = false;}, /visual_inspected/i],
  ['unchecked body', d => {d.results[0].body_checked = 'true';}, /body_checked/i],
  ['unresolved P1', d => {d.results[0].issues = [{severity: 'P1', status: 'OPEN'}];}, /unresolved.*P1/i],
  ['unresolved P2', d => {d.findings = [{priority: 'P2', resolved: false}];}, /unresolved.*P2/i],
]) {
  test(`rejects ${label} without touching formal files`, async t => {
    const f = await fixture(t);
    await editJSON(resolve(f.reviewRoot, 'course-1.json'), change);
    await rejectsUntouched(f, () => approveRelease(f.options), pattern);
    await assert.rejects(fs.access(f.receiptPath), {code: 'ENOENT'});
  });
}

test('missing review group is rejected', async t => {
  const f = await fixture(t);
  await fs.unlink(resolve(f.reviewRoot, 'course-3.json'));
  await rejectsUntouched(f, () => checkRelease(f.options), /ENOENT/);
});

for (const [label, change, pattern] of [
  ['partial QC', d => d.results.pop(), /QC.*(count|coverage)/i],
  ['duplicate QC', d => {d.results[1] = d.results[0];}, /duplicate/i],
  ['stale QC', d => {d.results[0].sha256 = '0'.repeat(64);}, /QC.*(stale|hash)/i],
  ['failed QC', d => {d.results[0].status = 'FAIL';}, /QC.*PASS/i],
  ['QC missing semantic closure', d => {delete d.results[0].semanticEdgeMismatches;}, /QC.*semanticEdgeMismatches/i],
  ['QC lost semantic edge', d => {d.results[0].semanticEdgeMismatches = [{key:'a→b',expected:1,observed:0}];}, /QC.*semanticEdgeMismatches/i],
  ['QC hidden overflow', d => {d.results[0].overflow = ['bad'];}, /QC.*overflow/i],
]) {
  test(`rejects ${label}`, async t => {
    const f = await fixture(t);
    await editJSON(resolve(f.candidateRoot, 'batch-verification.json'), change);
    await rejectsUntouched(f, () => approveRelease(f.options), pattern);
  });
}

test('failed integrity is rejected', async t => {
  const f = await fixture(t);
  await editJSON(resolve(f.candidateRoot, 'integrity-verification.json'), d => {d.status = 'FAIL';});
  await rejectsUntouched(f, () => checkRelease(f.options), /integrity/i);
});

for (const [label, mutate] of [
  ['SVG', async f => fs.appendFile(resolve(f.candidateRoot, 'public/visuals/course/fixture-000.svg'), 'changed')],
  ['TS map', async f => fs.appendFile(resolve(f.candidateRoot, ancillary[0]), 'changed')],
  ['ZIP', async f => fs.appendFile(resolve(f.candidateRoot, ancillary[1]), 'changed')],
  ['registry', async f => fs.appendFile(resolve(f.candidateRoot, ancillary[2]), 'changed')],
  ['review bytes', async f => fs.appendFile(resolve(f.reviewRoot, 'materials.json'), '\n')],
  ['QC evidence bytes', async f => fs.appendFile(resolve(f.candidateRoot, 'batch-verification.json'), '\n')],
  ['baseline bytes', async f => fs.appendFile(f.baselinePath, '\n')],
]) {
  test(`approved receipt becomes stale after changed ${label}`, async t => {
    const f = await fixture(t);
    await approveRelease(f.options);
    await mutate(f);
    await rejectsUntouched(f, () => promoteRelease(f.options), /(hash|stale|receipt)/i);
  });
}

test('mutated receipt is rejected, even with a recomputed envelope checksum', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  await editJSON(f.receiptPath, d => {
    d.file_hashes[ancillary[0]] = '0'.repeat(64);
    delete d.receipt_sha256;
    d.receipt_sha256 = sha(JSON.stringify(d));
  });
  await rejectsUntouched(f, () => promoteRelease(f.options), /receipt/i);
});

test('editing receipt timestamps and recomputing its checksum cannot renew approval', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  await editJSON(f.receiptPath, d => {
    const issued = Date.parse(d.issued_at) - 60_000;
    d.issued_at = new Date(issued).toISOString();
    d.expires_at = new Date(issued + 24 * 3600_000).toISOString();
    delete d.receipt_sha256;
    d.receipt_sha256 = sha(JSON.stringify(d));
  });
  await rejectsUntouched(f, () => promoteRelease(f.options), /receipt/i);
});

test('expired and future receipts are rejected', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  const receipt = await readJSON(f.receiptPath);
  const issued = Date.parse(receipt.issued_at);
  await rejectsUntouched(f, () => verifyReceipt({...f.options, now: issued + 25 * 3600_000}), /expired/i);
  await rejectsUntouched(f, () => verifyReceipt({...f.options, now: issued - 1}), /future/i);
});

test('changed formal file blocks promotion before any formal writes', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  await fs.appendFile(resolve(f.projectRoot, ancillary[0]), 'another worker');
  await rejectsUntouched(f, () => promoteRelease(f.options), /formal.*baseline/i);
});

test('missing receipt blocks promotion', async t => {
  const f = await fixture(t);
  await rejectsUntouched(f, () => promoteRelease(f.options), /ENOENT/);
});

test('unlisted candidate file and symlink candidates are rejected', async t => {
  const f = await fixture(t);
  const extra = resolve(f.candidateRoot, 'public/extra.svg');
  await write(extra, '<svg/>');
  await assert.rejects(() => checkRelease(f.options), /inventory/i);
  await fs.unlink(extra);
  const path = resolve(f.candidateRoot, ancillary[0]);
  await fs.unlink(path);
  await fs.symlink(resolve(f.projectRoot, ancillary[0]), path);
  await assert.rejects(() => checkRelease(f.options), /symlink/i);
});

test('baseline path traversal is rejected', async t => {
  const f = await fixture(t);
  await editJSON(f.baselinePath, d => {d['../escape.svg'] = d[Object.keys(d)[0]]; delete d[Object.keys(d)[0]];});
  await rejectsUntouched(f, () => checkRelease(f.options), /(path|inventory)/i);
});

test('concurrent promotion lock refuses a second writer', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  const lock = resolve(f.candidateRoot, '../.promotion.lock');
  await fs.mkdir(lock);
  await rejectsUntouched(f, () => promoteRelease(f.options), /(lock|EEXIST)/i);
  await fs.access(lock);
});

test('successful temp promotion backs up and copies exactly 133 files, leaving real formal unchanged', async t => {
  const f = await fixture(t);
  const realRoot = fileURLToPath(new URL('../', import.meta.url));
  // Guard real files using the committed inventory; CI has no local release workspace.
  const realBaseline = (await readJSON(resolve(realRoot, 'docs/svg-redesign-2026-10-26/published-release.json'))).file_hashes;
  const realBefore = await formalHashes({projectRoot: realRoot, baseline: realBaseline});
  await write(resolve(f.projectRoot, 'public/unrelated.txt'), 'keep');
  await approveRelease(f.options);
  const result = await promoteRelease(f.options);
  assert.equal(result.status, 'PROMOTED');
  assert.deepEqual(await formalHashes(f), f.hashes);
  for (const [path, expected] of Object.entries(f.baseline)) {
    assert.equal(sha(await fs.readFile(resolve(result.backupRoot, 'original', path))), expected);
  }
  assert.equal(await fs.readFile(resolve(f.projectRoot, 'public/unrelated.txt'), 'utf8'), 'keep');
  assert.deepEqual(await formalHashes({projectRoot: realRoot, baseline: realBaseline}), realBefore);
});

test('mid-copy filesystem failure rolls back every touched formal file and keeps backup', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  const link = fs.link;
  const canonicalRoot = await fs.realpath(f.projectRoot);
  let writes = 0;
  t.mock.method(fs, 'link', async (from, to) => {
    if (to.startsWith(resolve(canonicalRoot, 'public') + '/') || to === resolve(canonicalRoot, ancillary[0])) {
      if (++writes === 4) throw new Error('injected filesystem failure');
    }
    return link(from, to);
  });
  await rejectsUntouched(f, () => promoteRelease(f.options), /injected filesystem failure/);
  assert.ok(writes > 4, 'rollback performs real filesystem writes');
  const backups = await fs.readdir(resolve(f.candidateRoot, '../promotion-backups'));
  assert.equal(backups.length, 1);
  const transaction = await readJSON(resolve(f.candidateRoot, '../promotion-backups', backups[0], 'transaction.json'));
  assert.equal(transaction.status, 'ROLLED_BACK');
  await assert.rejects(fs.access(resolve(f.candidateRoot, '../.promotion.lock')), {code: 'ENOENT'});
});

test('cross-group duplicate cannot hide an omitted visual', async t => {
  const f = await fixture(t);
  const first = (await readJSON(resolve(f.reviewRoot, 'course-1.json'))).results[0];
  await editJSON(resolve(f.reviewRoot, 'course-2.json'), d => {d.results[0] = first;});
  await rejectsUntouched(f, () => approveRelease(f.options), /duplicate across groups/i);
});

test('resolved findings and P3 notes allow approval, including a raw-array review file', async t => {
  const f = await fixture(t);
  const path = resolve(f.reviewRoot, 'course-1.json');
  const document = await readJSON(path);
  document.results[0].issues = [
    {severity: 'P1', resolved: true, status: 'RESOLVED'},
    {severity: 'P2', status: 'CLOSED'},
    {severity: 'P3', status: 'OPEN'},
  ];
  await write(path, document.results);
  await approveRelease(f.options);
  await verifyReceipt(f.options);
});

test('missing receipt seal and an interrupted approval pair fail closed', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  const seal = f.receiptPath + '.sha256';
  await fs.unlink(seal);
  await rejectsUntouched(f, () => promoteRelease(f.options), /ENOENT/);
  await write(seal, '0'.repeat(64) + '\n');
  await rejectsUntouched(f, () => promoteRelease(f.options), /receipt.*mutated/i);
});

test('rollback preserves an intervening user edit and records recovery requirements', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  const canonicalRoot = await fs.realpath(f.projectRoot);
  const target = resolve(canonicalRoot, ancillary[0]);
  const link = fs.link;
  let interrupted = false;
  t.mock.method(fs, 'link', async (from, to) => {
    await link(from, to);
    if (!interrupted && to === target) {
      interrupted = true;
      await fs.writeFile(target, 'intervening user edit');
      throw new Error('interrupted after concurrent edit');
    }
  });
  await assert.rejects(() => promoteRelease(f.options), /rollback requires recovery/i);
  assert.equal(await fs.readFile(target, 'utf8'), 'intervening user edit');
  const backups = await fs.readdir(resolve(f.candidateRoot, '../promotion-backups'));
  const transaction = await readJSON(resolve(f.candidateRoot, '../promotion-backups', backups[0], 'transaction.json'));
  assert.equal(transaction.status, 'ROLLBACK_FAILED');
  assert.match(transaction.rollback_errors[0], /concurrent edit/i);
  assert.equal(sha(await fs.readFile(resolve(f.candidateRoot, '../promotion-backups', backups[0], 'original', ancillary[0]))), f.baseline[ancillary[0]]);
});


test('review CLI still validates arguments when invoked through a symlink', async t => {
  const f = await fixture(t);
  const alias = resolve(f.projectRoot, 'review-alias.mjs');
  await fs.symlink(fileURLToPath(new URL('../scripts/visuals/review.mjs', import.meta.url)), alias);
  const result = spawnSync(process.execPath, [alias, '--invalid-mode'], {encoding: 'utf8'});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage:/);
});


test('stale integrity cannot approve a changed registry even when file-hashes is refreshed', async t => {
  const f = await fixture(t);
  const path = 'public/materials/career-evolution/source-visual-manifest.json';
  await editJSON(resolve(f.candidateRoot, path), d => {d.visuals[0].sha256 = '0'.repeat(64);});
  const changedHash = sha(await fs.readFile(resolve(f.candidateRoot, path)));
  await editJSON(resolve(f.candidateRoot, 'file-hashes.json'), d => {d[path] = changedHash;});
  await rejectsUntouched(f, () => approveRelease(f.options), /integrity.*registry/i);
});


test('concurrent save between baseline check and installation is preserved', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  const root = await fs.realpath(f.projectRoot);
  const target = resolve(root, ancillary[0]);
  const writeFile = fs.writeFile;
  let saved = false;
  t.mock.method(fs, 'writeFile', async (path, ...args) => {
    await writeFile(path, ...args);
    if (!saved && String(path).startsWith(target + '.') && String(path).endsWith('.release-tmp')) {
      saved = true;
      await writeFile(target, 'user saved during installation');
    }
  });
  await assert.rejects(() => promoteRelease(f.options), /(concurrent|baseline|recovery)/i);
  assert.equal(await fs.readFile(target, 'utf8'), 'user saved during installation');
});

test('user save recreating a captured destination wins over exclusive installation', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  const root = await fs.realpath(f.projectRoot);
  const target = resolve(root, ancillary[0]);
  const rename = fs.rename;
  let saved = false;
  t.mock.method(fs, 'rename', async (from, to) => {
    await rename(from, to);
    if (!saved && from === target) {
      saved = true;
      await fs.writeFile(target, 'user recreated destination');
    }
  });
  await assert.rejects(() => promoteRelease(f.options), /recovery/i);
  assert.equal(await fs.readFile(target, 'utf8'), 'user recreated destination');
});

test('rollback detects a save after its own SHA check and preserves those bytes', async t => {
  const f = await fixture(t);
  await approveRelease(f.options);
  const root = await fs.realpath(f.projectRoot);
  const link = fs.link, writeFile = fs.writeFile;
  let installations = 0, rollingBack = false, userTarget;
  t.mock.method(fs, 'link', async (from, to) => {
    if (!rollingBack && (to.startsWith(resolve(root, 'public') + '/') || to === resolve(root, ancillary[0]))) {
      if (++installations === 4) {
        rollingBack = true;
        throw new Error('interrupt installation');
      }
    }
    return link(from, to);
  });
  t.mock.method(fs, 'writeFile', async (path, ...args) => {
    await writeFile(path, ...args);
    if (rollingBack && !userTarget && String(path).startsWith(resolve(root, 'public') + '/') && String(path).endsWith('.release-tmp')) {
      userTarget = String(path).replace(/\.[^.]+\.release-tmp$/, '');
      await writeFile(userTarget, 'user saved during rollback');
    }
  });
  await assert.rejects(() => promoteRelease(f.options), /recovery/i);
  assert.ok(userTarget);
  assert.equal(await fs.readFile(userTarget, 'utf8'), 'user saved during rollback');
});

for (const kind of ['TS map', 'ZIP']) {
  test(`old integrity cannot approve a refreshed hash table with broken ${kind}`, async t => {
    const f = await fixture(t);
    const path = kind === 'TS map' ? ancillary[0] : ancillary[1];
    if (kind === 'TS map') {
      const target = resolve(f.candidateRoot, path);
      const content = await fs.readFile(target, 'utf8');
      await fs.writeFile(target, content.replace(/\?v=[a-f0-9]{12}/, '?v=000000000000'));
    } else {
      await fs.writeFile(resolve(f.candidateRoot, path), 'not a ZIP');
    }
    const current = sha(await fs.readFile(resolve(f.candidateRoot, path)));
    await editJSON(resolve(f.candidateRoot, 'file-hashes.json'), d => {d[path] = current;});
    await rejectsUntouched(f, () => approveRelease(f.options), /integrity/i);
  });
}
