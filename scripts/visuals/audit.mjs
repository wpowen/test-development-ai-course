import {readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {pages} from '../../content/course.ts';
import {bindSpec} from './binding.mjs';
import {candidateRoot,assetRoot} from './paths.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));const sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(await readFile(resolve(candidateRoot,'manifest.json'),'utf8'));
const checks=JSON.parse(await readFile(resolve(candidateRoot,'batch-verification.json'),'utf8'));
const before=JSON.parse(await readFile(resolve(root,'docs/svg-redesign-2026-10-26/baseline-hashes.json'),'utf8'));
const expected=Object.keys(before).filter(p=>p.endsWith('.svg')).sort();const actual=manifest.visuals.map(v=>'public/'+v.path).sort();assert.deepEqual(actual,expected,'Redraw did not cover the original SVG inventory');assert.equal(checks.assetCount,manifest.visuals.length);
let specs=[];for(const file of (await readdir(new URL('./specs/',import.meta.url))).filter(f=>f.endsWith('.mjs')))specs.push(...(await import(new URL('./specs/'+file,import.meta.url))).default);const bySpec=new Map(specs.map(bindSpec).map(s=>[s.path,s]));
const verified=new Map(checks.results.map(r=>[r.path,r]));const byPath=new Map(manifest.visuals.map(r=>[r.path,r]));let quotes=0;
for(const v of manifest.visuals){assert.equal(v.spec_sha256,sha(JSON.stringify(bySpec.get(v.path))),v.id+': design spec changed after generation');const path=resolve(assetRoot,v.path);const svg=await readFile(path,'utf8');const hash=sha(svg);assert.equal(hash,v.sha256,`${v.id}: generated manifest drift`);assert.notEqual(hash,before['public/'+v.path],`${v.id}: original SVG was not redrawn`);const check=verified.get(v.path);assert.equal(check?.status,'PASS',`${v.id}: rendered QC failure`);assert.equal(hash,check.sha256,`${v.id}: rendered evidence stale`);
 for(const ref of v.sourceRefs){const body=await readFile(resolve(root,ref.path),'utf8');assert.ok(body.includes(ref.quote)||body.replaceAll('\\"','"').includes(ref.quote),`${v.id}: missing body reference`);quotes++;}
 assert.match(svg,/<title[^>]*>[^<]+<\/title>/);assert.match(svg,/<desc[^>]*>[^<]+<\/desc>/);assert.doesNotMatch(svg,/<(?:script|image|foreignObject)\b/i);
}
const stagedBindings=JSON.parse(await readFile(resolve(candidateRoot,'page-visual-bindings.json'),'utf8'));assert.deepEqual(stagedBindings.map(p=>p.id),pages.map(p=>p.id));
for(const page of stagedBindings){const src=page.src;if(!src)continue;const [path,query]=src.split('?');assert.ok(byPath.has(path),`${page.id}: missing figure binding`);if(query)assert.equal(query,'v='+byPath.get(path).sha256.slice(0,12),`${page.id}: stale image cache hash`);}
for(const bundle of ['agent-architecture-system','career-evolution']){const m=JSON.parse(await readFile(resolve(assetRoot,'materials',bundle,'source-visual-manifest.json'),'utf8'));const expectedCount=bundle==='agent-architecture-system'?16:9;assert.equal(m.visuals.length,expectedCount);for(const v of m.visuals){const b=await readFile(resolve(assetRoot,'materials',bundle,v.rendered_path));assert.equal(sha(b),v.sha256,`${bundle}: material manifest drift`);}}
const report={status:'PASS',unique_resource_paths:actual.length,changed_svg_files:actual.length,page_bindings:pages.length,source_quotes_verified:quotes,rendered_qc_passes:checks.passCount,material_manifest_coverage:'25/25',evidence_scope:'Body binding, file integrity, rendered geometry, material registries; does not claim human acceptance or production efficacy.'};await writeFile(resolve(candidateRoot,'integrity-verification.json'),JSON.stringify(report,null,2)+'\n');manifest.status='COMPLETE_LOCAL_VERIFIED';manifest.validation={rendered:'batch-verification.json',integrity:'integrity-verification.json',review:'PENDING_INDEPENDENT_REVIEW'};
await writeFile(resolve(candidateRoot,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const inventory=JSON.parse(await readFile(resolve(candidateRoot,'../formal-baseline.json'),'utf8'));const hashes={};
for(const path of Object.keys(inventory).sort())hashes[path]=sha(await readFile(resolve(candidateRoot,path)));
await writeFile(resolve(candidateRoot,'file-hashes.json'),JSON.stringify(hashes,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
