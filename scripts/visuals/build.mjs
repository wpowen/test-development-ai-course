import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {runtimePackage} from './runtime.mjs';
import {renderSpec,esc} from './renderer.mjs';
import {bindSpec} from './binding.mjs';
import './body-inputs.mjs';
import {candidateRoot,assetRoot} from './paths.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const hash=b=>createHash('sha256').update(b).digest('hex');
const specsDir=new URL('./specs/',import.meta.url);
const {instance}=await import(pathToFileURL(runtimePackage('@viz-js/viz')));const viz=await instance();
const args=process.argv.slice(2);const selected=args.find(x=>x.startsWith('--only='))?.slice(7).split(',');
const originalHashes=JSON.parse(await readFile(resolve(root,'docs/svg-redesign-2026-10-26/baseline-hashes.json'),'utf8').catch(()=>'{}'));
const dry=args.includes('--dry-run');const partial=args.includes('--partial');
const named=args.find(x=>x.startsWith('--specs='))?.slice(8).split(',');
const files=(await readdir(specsDir)).filter(x=>x.endsWith('.mjs')&&(!named||named.includes(x.replace('.mjs','')))).sort();let specs=[];
for(const f of files){const mod=await import(new URL(f,specsDir));specs.push(...mod.default);}
specs=specs.map(bindSpec);
if(selected)specs=specs.filter(s=>selected.includes(s.id));
const paths=new Set();const manifest=[];
for(const s of specs){
 if(paths.has(s.path))throw Error(`duplicate path ${s.path}`);paths.add(s.path);
 if(!['visuals/','materials/'].some(p=>s.path.startsWith(p))||s.path.includes('..'))throw Error(`bad path ${s.path}`);
 if(!s.sourceRefs?.length||s.sections?.length!==3)throw Error(`${s.id}: missing sources or detail sections`);
 for(const r of s.sourceRefs){if(r.path.startsWith('/'))throw Error(`${s.id}: absolute source ref`);const raw=await readFile(resolve(root,r.path),'utf8');if(!raw.includes(r.quote)&&!raw.replaceAll('\\"','"').includes(r.quote))throw Error(`${s.id}: source quote not found in ${r.path}: ${r.quote}`);}
 let svg;if(s.approvedAsset){svg=(await readFile(resolve(root,s.approvedAsset),'utf8')).replace('role="img"','data-redraw-version="2" role="img"').replace('样图 01 · 待确认','TD-M04 · 模块全景').replace('</desc>',`</desc><metadata>${esc(JSON.stringify({sourceRefs:s.sourceRefs,pageIds:s.pageIds,approvedReference:s.approvedAsset}))}</metadata>`);}else{svg=await renderSpec(s,viz);}const target=resolve(assetRoot,s.path);const old=await readFile(target,'utf8').catch(()=>readFile(resolve(root,'public',s.path),'utf8'));

 if(!dry){await mkdir(dirname(target),{recursive:true});await writeFile(target,svg);}
 manifest.push({id:s.id,path:s.path,pageIds:s.pageIds,primaryPageIds:s.primaryPageIds,layout:s.layout,title:s.title,sourceRefs:s.sourceRefs,supplementalSources:s.supplementalSources||[],nodeCount:s.nodes.length,edgeCount:s.edges.length,sha256:hash(svg),spec_sha256:hash(JSON.stringify(s)),before_sha256:originalHashes['public/'+s.path]||hash(old),bytes:Buffer.byteLength(svg)});
}
if(!dry&&!partial&&!selected){
 await writeFile(resolve(candidateRoot,'manifest.json'),JSON.stringify({schema_version:'2.0.0',status:'GENERATED_PENDING_VISUAL_QC',strategy:'body-bound SVG typography + explicit semantic edges + browser inspection',visuals:manifest},null,2)+'\n');
}
console.log(`${dry?'Would render':'Rendered'} ${manifest.length} body-bound diagrams. Graphviz ${viz.graphvizVersion}`);
