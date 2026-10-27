/** CI readback of the reviewed, promoted files; no rendering runtime needed. */
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {projectRoot,reviewRoot} from './paths.mjs';
import {bindSpec} from './binding.mjs';
import './body-inputs.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const dir=resolve(projectRoot,'docs/svg-redesign-2026-10-26');
const receipt=JSON.parse(await readFile(resolve(dir,'published-release.json'),'utf8'));
assert.equal(receipt.status,'REVIEWED_AND_PROMOTED');
assert.equal(Object.keys(receipt.file_hashes).length,133);
const manifest=JSON.parse(await readFile(resolve(dir,'redraw-manifest.json'),'utf8'));
assert.equal(sha(await readFile(resolve(dir,'redraw-manifest.json'))),receipt.manifest_sha256);
assert.equal(manifest.visuals.length,126);assert.equal(new Set(manifest.visuals.map(v=>v.path)).size,126);
const sourcePaths=[...new Set(manifest.visuals.flatMap(v=>v.sourceRefs.map(r=>r.path)))].sort();
assert.deepEqual(Object.keys(receipt.source_hashes).sort(),sourcePaths);
for(const [path,hash] of Object.entries(receipt.source_hashes))assert.equal(sha(await readFile(resolve(projectRoot,path))),hash,`Reviewed source changed: ${path}`);
const rows=[];
for(const [group,hash] of Object.entries(receipt.review_hashes)){
 const bytes=await readFile(resolve(reviewRoot,group));assert.equal(sha(bytes),hash,`Review changed: ${group}`);
 const report=JSON.parse(bytes);assert.equal(report.count,report.results.length);rows.push(...report.results);
}
assert.equal(rows.length,126);const reviews=new Map(rows.map(r=>[r.path,r]));assert.equal(reviews.size,126);
let specs=[];for(const file of (await readdir(new URL('./specs/',import.meta.url))).filter(f=>f.endsWith('.mjs')))
 specs.push(...(await import(new URL('./specs/'+file,import.meta.url))).default);
const designs=new Map(specs.map(bindSpec).map(s=>[s.path,s]));
for(const [path,hash] of Object.entries(receipt.file_hashes))assert.equal(sha(await readFile(resolve(projectRoot,path))),hash,`Published file changed: ${path}`);
for(const v of manifest.visuals){
 const review=reviews.get(v.path);assert.equal(review?.sha256,v.sha256,`Review stale: ${v.id}`);
 assert.equal(review.verdict,'PASS');assert.equal(review.visual_inspected,true);assert.equal(review.body_checked,true);
 assert.ok(!review.findings.some(f=>/^P[12]$/.test(f.severity)&&!f.resolved&&!['FIXED','RESOLVED','CLOSED'].includes(f.status)));
 assert.equal(v.spec_sha256,sha(JSON.stringify(designs.get(v.path))),`Design changed: ${v.id}`);
 assert.equal(receipt.file_hashes['public/'+v.path],v.sha256);
 for(const ref of v.sourceRefs){const text=await readFile(resolve(projectRoot,ref.path),'utf8');assert.ok(text.includes(ref.quote)||text.replaceAll('\\"','"').includes(ref.quote),`Body reference missing: ${v.id}`);}
}
console.log('Published visual gate PASS: 126 reviewed SVGs, 133 promoted files, current specs and body references.');
