import assert from 'node:assert/strict';
import {writeFile,mkdir,lstat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {projectRoot,candidateRoot} from './paths.mjs';
import {isMain,readRegular,sha256} from './release-gate.mjs';
import {visualInventory} from './prepare.mjs';
const BASELINE_COMMIT = 'f0e1a5eb59466c82d8c7e46f34e89b3e5c9ec529';
const MAX_BUFFER = 64 * 1024 * 1024;

async function originalsFromZip(root, zipPath, paths) {
  // Read exact members into memory; never extract unchecked archive paths.
  const py = String.raw`import base64,json,sys,zipfile
with zipfile.ZipFile(sys.argv[1]) as archive:
 print(json.dumps({path:base64.b64encode(archive.read(path)).decode('ascii') for path in json.load(sys.stdin)}))
`;
  const result = spawnSync('python3', ['-c', py, zipPath], {
    cwd: root, input: JSON.stringify(paths), encoding: 'utf8', maxBuffer: MAX_BUFFER,
  });
  if (result.error || result.status !== 0) throw Error(`Original ZIP read failed: ${result.error?.message || result.stderr}`);
  return new Map(Object.entries(JSON.parse(result.stdout)).map(([path, data]) => [path, Buffer.from(data, 'base64')]));
}

function originalsFromGit(root, paths) {
  const prefix = spawnSync('git', ['rev-parse', '--show-prefix'], {cwd: root, encoding: 'utf8'});
  if (prefix.error || prefix.status !== 0) throw Error(`Cannot locate Git baseline: ${prefix.error?.message || prefix.stderr}`);
  const originals = new Map();
  for (const path of paths) {
    const result = spawnSync('git', ['show', `${BASELINE_COMMIT}:${prefix.stdout.trim()}${path}`], {cwd: root, maxBuffer: MAX_BUFFER});
    if (result.error || result.status !== 0) throw Error(`Cannot read Git baseline ${BASELINE_COMMIT}:${path}: ${result.error?.message || result.stderr.toString()}`);
    originals.set(path, result.stdout);
  }
  return originals;
}

export async function generateGallery(options = {}) {
const root=resolve(options.projectRoot ?? projectRoot);
const candidate=resolve(options.candidateRoot ?? (options.projectRoot ? resolve(root,'output/svg-release-20261026/candidate') : candidateRoot));
const dir=resolve(root,'docs/svg-redesign-2026-10-26');
const manifest=JSON.parse(await readRegular(candidate,'manifest.json'));
const {svgPaths,baselineHashes}=await visualInventory(root);
assert.ok(Array.isArray(manifest.visuals),'Gallery manifest must contain visuals');
assert.deepEqual(manifest.visuals.map(v=>'public/'+v.path).sort(),svgPaths,'Gallery manifest SVG inventory mismatch');
const zipPath=resolve(root,'output/svg-redesign-2026-10-26/before-redraw.zip');
let hasZip=true;
try { const stat=await lstat(zipPath); assert.ok(stat.isFile() && !stat.isSymbolicLink(),'Original ZIP must be a regular file'); }
catch (error) { if(error.code==='ENOENT')hasZip=false;else throw error; }
const originals=hasZip ? await originalsFromZip(root,zipPath,svgPaths) : originalsFromGit(root,svgPaths);
const candidates=new Map();
// Validate every original before producing gallery assets; a bad ZIP/hash is an
// error, not a reason to silently switch sources or publish a partial gallery.
for(const v of manifest.visuals){
  const path='public/'+v.path;
  assert.equal(sha256(originals.get(path)),baselineHashes[path],`Original baseline SHA-256 mismatch: ${path}`);
  candidates.set(v.path,await readRegular(candidate,path));
}
for(const v of manifest.visuals){
  for(const [version,bytes] of [['current',candidates.get(v.path)],['original',originals.get('public/'+v.path)]]){
    const target=resolve(dir,'gallery-assets',version,v.path);await mkdir(dirname(target),{recursive:true});await writeFile(target,bytes);
  }
}
const sample=candidates.get('visuals/modules/TD-M04.svg');if(sample){await mkdir(resolve(dir,'assets'),{recursive:true});await writeFile(resolve(dir,'assets/TD-M04.published.svg'),sample);}
const data=manifest.visuals.map(v=>({id:v.id,path:v.path,title:v.title,layout:v.layout,pageIds:v.pageIds,sources:v.sourceRefs,category:v.path.startsWith('visuals/modules/')?'modules':v.path.startsWith('visuals/course/')?'course':v.path.includes('agent-architecture-system')?'agent':'career'})).sort((a,b)=>{const order=v=>v.id==='TD-M04'?-1:v.id.endsWith('-compat')?5:{modules:0,course:1,agent:2,career:3}[v.category];return order(a)-order(b)||a.id.localeCompare(b.id);});
const payload=JSON.stringify(data).replaceAll('<','\\u003c');
await writeFile(resolve(dir,'gallery.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>全项目 SVG 候选预览 · 126 图对照</title><style>
*{box-sizing:border-box}body{margin:0;background:#f0f4fa;color:#172b45;font:16px/1.6 -apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif}header{padding:42px 5vw 24px;background:white;border-bottom:1px solid #d9e2ed}h1{font-size:34px;margin:8px 0}p{color:#50647c}small{font-weight:750;color:#215cbb;letter-spacing:1px}.controls{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}button,input,select,a.action{font:inherit;border:1px solid #c9d5e4;border-radius:8px;background:white;padding:10px 14px;color:#172b45}input{min-width:260px;flex:1}button{cursor:pointer}button[aria-pressed=true]{background:#215cbb;color:white;border-color:#215cbb}main{padding:30px 5vw}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.card{background:white;border:1px solid #d9e2ed;border-radius:14px;overflow:hidden}.card .image{display:block;height:310px;padding:14px;background:#e7edf5;border-bottom:1px solid #d9e2ed}.card img{width:100%;height:100%;object-fit:contain}.body{padding:20px}.body h2{font-size:19px;margin:6px 0;line-height:1.5}.body p{font-size:13px;margin:8px 0;overflow-wrap:anywhere}.links{display:flex;gap:10px;flex-wrap:wrap}.links a{font-size:14px;color:#215cbb;text-decoration:none}.pill{display:inline-block;font-size:12px;padding:3px 8px;border-radius:5px;background:#edf3ff;color:#215cbb}dialog{width:min(1450px,96vw);max-height:95vh;border:0;border-radius:16px;padding:0}dialog::backdrop{background:#102033bf}.dialog-head{position:sticky;top:0;padding:16px;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #d9e2ed}.dialog-image{overflow:auto;background:#e7edf5;padding:20px}.dialog-image img{display:block;width:100%;height:auto}.dialog-meta{padding:20px;font-size:14px;color:#50647c}body.dark{background:#102033;color:#eaf0f8}body.dark header,body.dark .card{background:#172b45;border-color:#304965}body.dark p{color:#bfd0e4}body.dark .card .image{background:#213b58}body.dark .dialog-head{color:#172b45}@media(max-width:1050px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:650px){header{padding:26px 20px}main{padding:22px 20px}h1{font-size:27px}.grid{grid-template-columns:1fr}input{min-width:0;width:100%;flex-basis:100%}.controls{gap:8px}.dialog-image{padding:10px}.dialog-image img{width:760px;max-width:none}}
</style><header><small>BODY-BOUND SVG REDESIGN / 2026.10.26</small><h1>全项目候选预览 · 重绘与原图对照</h1><p><strong>候选预览，不代表通过 review，亦不代表获准替换或部署。</strong></p><p>126 个资源路径：87 张课程图、14 张模块全景、16 张 Agent 材料图、9 张职业材料图。逐图绑定正文，保留原始版本供比较。</p><div class="controls"><input id="search" type="search" placeholder="搜索图名、课程编号或正文主题" aria-label="搜索图片"><select id="category" aria-label="图片类别"><option value="all">全部图片</option><option value="course">课程图</option><option value="modules">模块全景</option><option value="agent">Agent 材料</option><option value="career">职业材料</option></select><button id="before" aria-pressed="false">切换为原图</button><button id="dark" aria-pressed="false">深色背景</button></div><p id="count"></p></header><main><div id="grid" class="grid"></div></main><dialog id="detail"><div class="dialog-head"><b id="detail-title"></b><div><button id="detail-before">看原图</button> <button id="close">关闭</button></div></div><div class="dialog-image"><img id="detail-image" alt=""></div><div class="dialog-meta" id="detail-meta"></div></dialog><script type="application/json" id="data">${payload}</script><script>
const data=JSON.parse(document.getElementById('data').textContent),grid=document.getElementById('grid'),search=document.getElementById('search'),cat=document.getElementById('category'),before=document.getElementById('before'),dialog=document.getElementById('detail');let showingBefore=false,active=null,detailBefore=false;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');const src=(v,old)=>'gallery-assets/'+(old?'original/':'current/')+v.path;
function render(){const q=search.value.trim().toLowerCase();const rows=data.filter(v=>(cat.value==='all'||cat.value===v.category)&&(!q||[v.id,v.title,...v.pageIds,...v.sources.map(s=>s.locator)].join(' ').toLowerCase().includes(q)));document.getElementById('count').textContent='显示 '+rows.length+' / '+data.length+' 张 · '+(showingBefore?'原图':'候选重绘图');grid.innerHTML=rows.map(v=>'<article class="card"><a class="image" href="'+esc(src(v,showingBefore))+'" data-id="'+esc(v.id)+'"><img loading="lazy" src="'+esc(src(v,showingBefore))+'" alt="'+esc(v.title)+'"></a><div class="body"><span class="pill">'+esc(v.id)+' · '+esc(v.layout)+'</span><h2>'+esc(v.title)+'</h2><p>正文：'+esc(v.pageIds.join(' / '))+'</p><div class="links"><a href="'+esc(src(v,false))+'" target="_blank">重绘 SVG ↗</a><a href="'+esc(src(v,true))+'" target="_blank">原图 SVG ↗</a></div></div></article>').join('');}
function show(v){active=v;detailBefore=showingBefore;document.getElementById('detail-title').textContent=v.id+' · '+v.title;document.getElementById('detail-meta').textContent='对应正文：'+v.pageIds.join(' / ')+'。来源定位：'+v.sources.map(s=>s.path+' · '+s.locator).join('；');updateDetail();dialog.showModal();}function updateDetail(){document.getElementById('detail-image').src=src(active,detailBefore);document.getElementById('detail-image').alt=active.title;document.getElementById('detail-before').textContent=detailBefore?'看重绘图':'看原图';}
grid.onclick=e=>{const a=e.target.closest('[data-id]');if(a){e.preventDefault();show(data.find(v=>v.id===a.dataset.id));}};search.oninput=render;cat.onchange=render;before.onclick=()=>{showingBefore=!showingBefore;before.setAttribute('aria-pressed',showingBefore);before.textContent=showingBefore?'切换为重绘图':'切换为原图';render();};document.getElementById('dark').onclick=function(){this.setAttribute('aria-pressed',document.body.classList.toggle('dark'))};document.getElementById('detail-before').onclick=()=>{detailBefore=!detailBefore;updateDetail()};document.getElementById('close').onclick=()=>dialog.close();render();
</script></html>`);
console.log(`Candidate gallery generated: ${data.length} comparisons; originals from ${hasZip ? 'backup ZIP' : 'Git baseline'}; review not implied.`);

return {count:data.length,original_source:hasZip?'backup ZIP':'Git baseline',review_status:'NOT_ASSESSED'};
}

if(isMain(import.meta.url)){
  try{
    assert.equal(process.argv.length,2,'Usage: node scripts/visuals/gallery.mjs');
    await generateGallery();
  }catch(error){console.error(error.message);process.exitCode=1;}
}
