/** Review inputs describe candidates; this never writes verdicts. */
import {readFile,writeFile} from 'node:fs/promises';
import {relative,resolve} from 'node:path';
import {projectRoot,candidateRoot,reviewRoot} from './paths.mjs';
import {bindSpec} from './binding.mjs';
const manifest=JSON.parse(await readFile(resolve(candidateRoot,'manifest.json'),'utf8'));
const hashes=new Map(manifest.visuals.map(v=>[v.path,v.sha256]));
for(const group of ['course-1','course-2','course-3','materials','modules','aliases']){
 const specs=(await import(new URL('./specs/'+group+'.mjs',import.meta.url))).default.map(bindSpec);
 const rows=specs.map(s=>({...s,sha256:hashes.get(s.path),
  candidate_svg:relative(projectRoot,resolve(candidateRoot,'public',s.path)),
  screenshot:'output/svg-redesign-2026-10-26/screenshots/'+s.path.replace(/\.svg$/,'').replaceAll('/','__')+'.png'}));
 await writeFile(resolve(reviewRoot,group+'-inputs.json'),JSON.stringify(rows,null,2)+'\n');
}
console.log('Fresh review inputs written; no review verdict changed.');
