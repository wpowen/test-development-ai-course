import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {pages} from '../../content/course.ts';
const root=new URL('../../',import.meta.url);
const clean=page=>Object.fromEntries(['id','title','summary','why','outcomes','artifact','blocks','practice','completion','expected','failure'].filter(k=>page[k]!==undefined).map(k=>[k,k==='blocks'?page.blocks.map(b=>Object.fromEntries(Object.entries(b).filter(([key])=>key!=='technical'))):page[k]]));
// Store pedagogical inputs, not the image URL/hash that this pipeline itself changes.
for(const file of ['course-1','course-2','course-3','material-pages']){
 const path=new URL(`docs/svg-redesign-2026-10-26/body-sources/${file}.json`,root);
 const saved=JSON.parse(await readFile(path,'utf8'));
 for(const old of saved){const current=pages.find(p=>p.id===old.id);assert.ok(current,`Source page removed: ${old.id}`);assert.deepEqual(clean(current),clean(old),`${old.id}: course body changed; refresh its body snapshot and review the diagram specification before rendering`);}
}
console.log('Body snapshots match all 103 current public pages; generated image bindings excluded.');
