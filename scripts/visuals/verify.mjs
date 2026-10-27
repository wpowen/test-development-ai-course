/** Exhaustive geometry + rendered evidence; accepts existing runtime packages. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {runtimePackage} from './runtime.mjs';
import {candidateRoot,assetRoot} from './paths.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const playwrightModule=await import(pathToFileURL(runtimePackage('playwright')));const {chromium}=playwrightModule.chromium?playwrightModule:playwrightModule.default;
const {default:sharp}=await import(pathToFileURL(runtimePackage('sharp')));
const out=resolve(root,'output/svg-redesign-2026-10-26');await mkdir(out+'/screenshots',{recursive:true});await mkdir(out+'/contact-sheets',{recursive:true});
const manifest=JSON.parse(await readFile(resolve(candidateRoot,'manifest.json'),'utf8'));
let only=process.argv.find(x=>x.startsWith('--only='))?.slice(7).split(',');
const renderHash=svg=>createHash('sha256').update(svg.replace(/<metadata\b[^>]*>[\s\S]*?<\/metadata>/g,'')).digest('hex');
if(process.argv.includes('--changed')){const previous=JSON.parse(await readFile(resolve(candidateRoot,'batch-verification.json'),'utf8'));const byPath=new Map(previous.results.map(r=>[r.path,r]));only=[];for(const v of manifest.visuals){const svg=await readFile(resolve(assetRoot,v.path),'utf8');const old=byPath.get(v.path);if(old?.status==='PASS'&&old.render_sha256===renderHash(svg)){old.sha256=v.sha256;old.evidence_reused='Only non-rendered metadata changed; rendering inputs unchanged';}else only.push(v.id);}await writeFile(resolve(candidateRoot,'batch-verification.json'),JSON.stringify(previous,null,2)+'\n');console.log('Rendering changed images: '+only.length);}
const assets=only?manifest.visuals.filter(v=>only.includes(v.id)):manifest.visuals;
const browser=await chromium.launch({channel:'chrome',headless:true});
const pages=await Promise.all(Array.from({length:3},()=>browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1})));
let results=[];const thumbs=[];let next=0;
await Promise.all(pages.map(async page=>{
 while(next<assets.length){const v=assets[next++];const svg=await readFile(resolve(assetRoot,v.path),'utf8');const key=v.path.replace(/\.svg$/,'').replaceAll('/','__');
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#f4f7fb}</style>${svg.replace(/<\?xml[^>]*>/,'')}`);
  await page.evaluate(()=>document.fonts.ready);
  const check=await page.evaluate(()=>{
   const root=document.querySelector('svg');const bounds=root.getBoundingClientRect();const texts=[...root.querySelectorAll('text')].map(el=>({el,t:el.textContent,r:el.getBoundingClientRect()}));
   const outside=[],overflow=[],overlaps=[],labelNodeCollisions=[];
   for(const {el,t,r} of texts){
    if(r.left<bounds.left-1||r.top<bounds.top-1||r.right>bounds.right+1||r.bottom>bounds.bottom+1)outside.push(t);
    const region=el.closest('[data-region]');if(region){const b=region.querySelector(':scope > rect').getBoundingClientRect();if(r.left<b.left+2||r.top<b.top+2||r.right>b.right-2||r.bottom>b.bottom-2)overflow.push({text:t,region:region.id,bbox:[r.x,r.y,r.width,r.height],bounds:[b.x,b.y,b.width,b.height]});}
   }
   for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i],b=texts[j];if(Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>1&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>1)overlaps.push([a.t,b.t]);}
   const nodes=[...root.querySelectorAll('.node[data-region]')].map(el=>({id:el.id,r:el.getBoundingClientRect()}));
   for(const a of texts.filter(t=>t.el.classList.contains('edge-label')))for(const b of nodes)if(Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>1&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>1)labelNodeCollisions.push([a.t,b.id]);
   const img=root.querySelectorAll('image,foreignObject,script').length;
   const semanticEdgeMismatches=[];const semanticEdgeScope=root.querySelector('[data-graph-scale]')?'ROUTED_GRAPH':'CUSTOM_LAYOUT_REQUIRES_VISUAL_REVIEW';
   if(root.querySelector('[data-graph-scale]')){
    const metadata=JSON.parse(root.querySelector('metadata').textContent);
    const count=edges=>{const m={};for(const e of edges){const key=e.from+'→'+e.to;m[key]=(m[key]||0)+1;}return m;};
    const expected=count(metadata.edges||[]),observed=count([...root.querySelectorAll('path[data-from][data-to]')].map(el=>({from:el.dataset.from,to:el.dataset.to})));
    for(const key of new Set([...Object.keys(expected),...Object.keys(observed)]))if(expected[key]!==observed[key])semanticEdgeMismatches.push({key,expected:expected[key]||0,observed:observed[key]||0});
   }
   return {semanticEdgeScope,semanticEdgeMismatches,width:bounds.width,height:bounds.height,textCount:texts.length,nodeCount:root.querySelectorAll('.node').length,edgeCount:root.querySelectorAll('.edge').length,outside,overflow,overlaps,labelNodeCollisions,nonVector:img,minGraphScale:Math.min(1,...[...root.querySelectorAll('[data-graph-scale]')].map(el=>Number(el.dataset.graphScale)))};
  });
  const pngPath=resolve(out,'screenshots',key+'.png');await page.locator('svg').screenshot({path:pngPath,timeout:20000});
  const thumb=await sharp(pngPath).resize({width:440,height:650,fit:'contain',background:'#ffffff'}).png().toBuffer();
  thumbs.push({key,thumb,title:v.id});
  const ok=!check.semanticEdgeMismatches.length&&!check.outside.length&&!check.overflow.length&&!check.overlaps.length&&!check.labelNodeCollisions.length&&!check.nonVector;
  results.push({id:v.id,path:v.path,sha256:createHash('sha256').update(svg).digest('hex'),render_sha256:renderHash(svg),status:ok?'PASS':'FAIL',...check,screenshot:`output/svg-redesign-2026-10-26/screenshots/${key}.png`});
  console.log(`${ok?'PASS':'FAIL'} ${v.id} ${v.layout} ${Math.round(check.height)}px ${check.overlaps.length} text overlaps ${check.labelNodeCollisions.length} label-node`);
 }
}));
await browser.close();
if(only){
 const previous=JSON.parse(await readFile(resolve(candidateRoot,'batch-verification.json'),'utf8'));
 const changed=new Map(results.map(r=>[r.path,r]));results=previous.results.map(r=>changed.get(r.path)||r);
 const done=new Set(thumbs.map(t=>t.key));for(const v of manifest.visuals){const key=v.path.replace(/\.svg$/,'').replaceAll('/','__');if(done.has(key))continue;const thumb=await sharp(resolve(out,'screenshots',key+'.png')).resize({width:440,height:650,fit:'contain',background:'#ffffff'}).png().toBuffer();thumbs.push({key,thumb,title:v.id});}
}
thumbs.sort((a,b)=>a.key.localeCompare(b.key));
for(let i=0;i<thumbs.length;i+=9){const chunk=thumbs.slice(i,i+9);const image=sharp({create:{width:1380,height:2040,channels:3,background:'#dce4ef'}}).composite(chunk.map((t,j)=>({input:t.thumb,left:10+(j%3)*460,top:10+Math.floor(j/3)*680})));await image.png().toFile(resolve(out,'contact-sheets',`sheet-${String(i/9+1).padStart(2,'0')}.png`));}
results.sort((a,b)=>a.path.localeCompare(b.path));
const report={status:results.every(r=>r.status==='PASS')?'PASS':'FAIL',assetCount:results.length,passCount:results.filter(r=>r.status==='PASS').length,visualInspection:'PENDING_CONTACT_SHEET_REVIEW',results};
await writeFile(resolve(candidateRoot,'batch-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(`Checked ${results.length}, passed ${report.passCount}; contact sheets written.`);
if(report.status!=='PASS')process.exitCode=1;
