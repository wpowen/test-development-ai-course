/** Keep source descriptions, image hashes and learner downloads in one projection. */
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {bindSpec} from './binding.mjs';
import {candidateRoot,assetRoot} from './paths.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
let specs=[];for(const file of (await readdir(new URL('./specs/',import.meta.url))).filter(f=>f.endsWith('.mjs')).sort())specs.push(...(await import(new URL('./specs/'+file,import.meta.url))).default);
specs=specs.map(bindSpec);
const byPath=new Map(specs.map(s=>[s.path,s]));
// The source graphic registries remain their package-owned editable entrypoint.
for(const [bundle,sourceName] of [['agent-architecture-system','agent-visual-source.json'],['career-evolution','career-visual-source.json']]){
 const directory=resolve(assetRoot,'materials',bundle);
 const sourcePath=resolve(directory,'visuals',sourceName);const source=JSON.parse(await readFile(sourcePath,'utf8'));
 const manifestPath=resolve(directory,'source-visual-manifest.json');const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
 const oldSources=new Map(source.visuals.map(v=>[v.file,v]));const oldManifests=new Map(manifest.visuals.map(v=>[v.rendered_path.split('/').pop(),v]));
 const packageSpecs=specs.filter(s=>s.path.startsWith(`materials/${bundle}/visuals/`));
 const sources=[],records=[];
 for(const s of packageSpecs){const filename=s.path.split('/').pop(),prior=oldSources.get(filename),previous=oldManifests.get(filename);const svg=await readFile(resolve(assetRoot,s.path));
  const visual_id=prior?.visual_id||previous?.visual_id||`${bundle}-${s.id.toLowerCase()}`;
  const kind=prior?.kind||previous?.kind||s.layout;
  const source_refs=prior?.source_refs||previous?.source_refs||s.sourceRefs.map(r=>`${r.path}#${r.locator}`);
  const alt=`${s.title}。${s.thesis} ${s.focus}`;
  const caption=`${s.thesis} ${s.boundary}`;
  const nodes=s.nodes.map(n=>n.title);const relationships=s.edges.map(e=>`${s.nodes.find(n=>n.id===e.from)?.title}→${s.nodes.find(n=>n.id===e.to)?.title}：${e.label}`);
  sources.push({...prior,visual_id,kind,file:filename,title:s.title,purpose:s.focus,nodes,relationships,source_refs,alt_text:alt,alt,caption,not_proof:s.boundary,rendering:{layout:s.layout,generator:'scripts/visuals/build.mjs',spec:'scripts/visuals/specs/materials.mjs',body_refs:s.sourceRefs}});
  records.push({...previous,visual_id,kind,purpose:s.focus,alt_text:alt,caption,not_proof:s.boundary,source_refs,nodes,relationships,rendered_path:`visuals/${filename}`,editable_path:`visuals/${sourceName}`,sha256:sha(svg),rendering_layout:s.layout,body_refs:s.sourceRefs});
 }
 source.visuals=sources;source.renderer={version:'2.0.0',entrypoint:'scripts/visuals/build.mjs',design_specs:'scripts/visuals/specs/materials.mjs',source_bound:true};
 manifest.visuals=records;manifest.renderer=source.renderer;
 await writeFile(sourcePath,JSON.stringify(source,null,2)+'\n');await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
}
// Refresh the map already consumed by course.ts. Material URLs stay stable for package contracts.
const {pages}=await import(new URL('../../content/course.ts',import.meta.url));
const kindMap={layers:'architecture',comparison:'architecture',dimensions:'architecture',donut:'career',quadrant:'career'};
let contract='// Generated from scripts/visuals/specs/*.mjs by scripts/visuals/sync.mjs.\n// Edit body-bound visual specifications; regenerate with npm run visuals:build.\n\nexport type ProfessionalVisualContract = { src: string; alt: string; kind: "flow" | "architecture" | "decision" | "state" | "sequence" | "metric" | "career" | "evidence"; };\n\nexport const professionalVisualContracts: Record<string, ProfessionalVisualContract> = {\n';
const altRecords=[];
for(const page of pages){const path=page.architecture?.visual?.src.split('?')[0];if(!path)continue;const s=byPath.get(path);if(!s)throw Error(`No body-bound spec for ${page.id}: ${path}`);const svg=await readFile(resolve(assetRoot,path));const src=path.startsWith('visuals/course/')?`${path}?v=${sha(svg).slice(0,12)}`:path;const diagramLabel={layers:'分层架构图',comparison:'对照与责任边界图',decision:'决策门禁图',state:'状态与恢复边界图',metric:'指标与证据图',flow:'流程与风险图',evidence:'证据关系图',sequence:'交互与权限边界图',dimensions:'维度架构图',donut:'来源权重图',quadrant:'行动优先级图'}[s.layout]||'关系图';const alt=`${s.title}的${diagramLabel}：${s.thesis}`;const kind=kindMap[s.layout]||s.layout;
 contract+=`  ${JSON.stringify(page.id)}: ${JSON.stringify({src,alt,kind})},\n`;altRecords.push({id:page.id,src,alt});
}
contract+='};\n';await writeFile(resolve(candidateRoot,'content/professional-visual-contracts.ts'),contract);
// Only replace changed members in the two ZIPs; preserve every unrelated member and its metadata.
const py=String.raw`
from pathlib import Path
import zipfile, os
root=Path('.')
for bundle in ['agent-architecture-system','career-evolution']:
 base=root/'public/materials'/bundle
 archive=base.with_suffix('.zip')
 temp=archive.with_suffix('.redraw.zip')
 count=0
 with zipfile.ZipFile(archive) as old, zipfile.ZipFile(temp,'w') as new:
  for info in old.infolist():
   data=old.read(info.filename)
   relative=Path(info.filename)
   if relative.parts and relative.parts[0]==bundle: relative=Path(*relative.parts[1:])
   target=base/relative
   if target.is_file() and (relative.suffix=='.svg' or relative.name in ['source-visual-manifest.json','agent-visual-source.json','career-visual-source.json']):
    data=target.read_bytes();count+=1
   new.writestr(info,data)
 os.replace(temp,archive)
 print(f'{bundle}: synchronized {count} ZIP members')
`;
const result=spawnSync('python3',['-c',py],{cwd:candidateRoot,encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);console.log(result.stdout.trim());
await writeFile(resolve(candidateRoot,'page-visual-bindings.json'),JSON.stringify(altRecords,null,2)+'\n');
console.log(`Synchronized ${pages.length} page visual bindings, 25 material records and 2 ZIPs.`);
