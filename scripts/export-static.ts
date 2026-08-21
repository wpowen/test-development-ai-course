import { access, cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getTechnicalBlockPresentation, pages, publicModules, releaseScope, sourceNotes } from "../content/course.ts";
import { glossary, glossaryCategories } from "../content/glossary.ts";
import { moduleOverviews } from "../content/module-overviews.ts";
import { references, referencesByPage, resolveReferences } from "../content/references.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(here, "../dist-github-pages");
const publicDir = resolve(here, "../public");
const publicPages = pages.map((page) => {
  const orderedReferenceIds: string[] = [];
  const pushReference = (id: string) => {
    if (references[id] && !orderedReferenceIds.includes(id)) orderedReferenceIds.push(id);
  };
  page.blocks.forEach((block) => block.refs?.forEach(pushReference));
  (page.references ?? referencesByPage[page.id] ?? []).forEach(pushReference);
  return {
    ...page,
    blocks: page.blocks.map((block) => ({
      ...block,
      technicalPresentation: getTechnicalBlockPresentation(block),
    })),
    resolvedReferences: resolveReferences(orderedReferenceIds),
  };
});
const indexPages = publicPages.map(({ id, title, summary, artifact, moduleId, type, status, duration, display_number, prerequisites, documentContract }) => ({
  id,
  title,
  summary,
  artifact,
  moduleId,
  type,
  status,
  duration,
  display_number,
  prerequisites,
  documentType: documentContract?.documentType,
  readerJob: documentContract?.readerJob,
  audience: documentContract?.audience,
}));
const indexPayload = JSON.stringify({
  defaultPageId: pages[0]?.id ?? "",
  modules: publicModules,
  pages: indexPages,
  releaseScope,
  sourceNotes,
  moduleOverviews,
  glossaryCount: glossary.length,
})
  .replaceAll("<", "\\u003c")
  .replaceAll("\u2028", "\\u2028")
  .replaceAll("\u2029", "\\u2029");
const modulePayloads = new Map(publicModules.map((module) => [
  module.id,
  JSON.stringify({ pages: publicPages.filter((page) => page.moduleId === module.id) })
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029"),
]));
const glossaryPayload = JSON.stringify({ glossary, glossaryCategories })
  .replaceAll("<", "\\u003c")
  .replaceAll("\u2028", "\\u2028")
  .replaceAll("\u2029", "\\u2029");
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character] ?? character);
const initialPage = pages[0];
const initialModule = publicModules.find((module) => module.id === initialPage.moduleId);
const initialContent = `<div class="crumb">${escapeHtml(initialModule?.title ?? "课程首页")} › ${escapeHtml(initialPage.id)}</div>
<div class="meta"><span>资料已审</span><span>${escapeHtml(initialPage.type)}</span><span>${escapeHtml(initialPage.duration)}</span></div>
<h1>${escapeHtml(initialPage.title)}</h1><p class="lead">${escapeHtml(initialPage.summary)}</p>
<section class="why"><b>为什么测试开发需要这一页</b><p>${escapeHtml(initialPage.why)}</p></section>
<section class="practice"><b>完整目录和交互正在载入</b><p>首课正文已经可读；课程数据加载完成后会自动显示目录、脚本物料、架构流程与学习进度。</p></section>`;

const staticModuleNavigation = String.raw`function renderNav(){const q=document.getElementById("tutorial-search").value.trim().toLowerCase();const current=currentId();const done=completed();let out="";for(const m of DATA.modules){const group=DATA.pages.filter(p=>p.moduleId===m.id&&(readerJobFilter==="all"||p.readerJob===readerJobFilter)&&(!q||(p.id+" "+p.title+" "+p.summary+" "+p.artifact).toLowerCase().includes(q)));if(!group.length)continue;out+="<section><button data-id=\""+esc(m.id)+"\" class=\"module-overview "+(m.id===current?"active":"")+"\"><span><b>"+esc(m.title)+"</b><small>"+esc(m.subtitle)+"</small></span><i>模块全景 · "+group.length+" 页</i></button>"+group.map(p=>"<button data-id=\""+esc(p.id)+"\" class=\""+(p.id===current?"active":"")+"\"><span class=num>"+String(p.display_number).padStart(2,"0")+"</span><span><b>"+esc(p.title)+"</b><small>"+esc(readerJobLabels[p.readerJob]||p.type)+" · "+statusLabel[p.status]+"</small></span><i class=\"dot "+(done.includes(p.id)?"done":p.status)+"\"></i></button>").join("")+"</section>"}document.getElementById("course-nav").innerHTML=out;document.querySelectorAll("#course-nav button").forEach(b=>b.onclick=()=>go(b.dataset.id));document.querySelectorAll("#reference-nav button").forEach(b=>{b.classList.toggle("active",b.dataset.reference===current);b.onclick=()=>go(b.dataset.reference)});document.querySelectorAll("#document-job-nav button").forEach(b=>b.classList.toggle("active",b.dataset.readerJob===readerJobFilter))}`;

const staticModuleProjection = String.raw`function renderModuleOverview(){const m=DATA.modules.find(module=>module.id===currentId());const overview=DATA.moduleOverviews[m.id];if(!overview){location.hash=DATA.defaultPageId;return}const byId=new Map(DATA.pages.filter(page=>page.moduleId===m.id).map(page=>[page.id,page]));let body="<div class=crumb>模块全景 › "+esc(m.id)+"</div><div class=meta><span>"+esc(m.id)+"</span><span>"+byId.size+" 页</span><span>"+overview.stages.length+" 个阶段</span></div><h1>"+esc(m.title)+"</h1><p class=lead>"+esc(overview.thesis)+"</p>";body+="<section class=module-panorama><div class=eyebrow>全景：架构与流程</div><figure class=course-visual><a href=\""+esc(overview.panorama.src)+"\" target=_blank rel=noreferrer aria-label=\"打开高清原图："+esc(overview.panorama.alt)+"\"><img loading=lazy src=\""+esc(overview.panorama.src)+"\" alt=\""+esc(overview.panorama.alt)+"\"></a><figcaption>"+esc(m.subtitle)+" 手机端可在图内左右滑动，点击图片可打开高清原图。</figcaption></figure></section>";body+="<section class=module-logic><h2>这个模块是怎么组织的</h2>"+overview.logic.map(paragraph=>"<p>"+esc(paragraph)+"</p>").join("")+"</section><section class=module-stages><h2>逐段导览</h2><p>阶段顺序即依赖顺序。每一段的出口工件是下一段的输入。</p><ol>"+overview.stages.map((stage,index)=>"<li><div class=stage-head><b>"+String(index+1).padStart(2,"0")+"</b><div><h3>"+esc(stage.name)+"</h3><p>"+esc(stage.question)+"</p></div></div><p class=stage-output><span>出口工件</span>"+esc(stage.output)+"</p><div class=stage-pages>"+stage.pages.map(pageId=>{const page=byId.get(pageId);return page?"<button data-go=\""+esc(pageId)+"\"><span class=num>"+String(page.display_number).padStart(2,"0")+"</span><span><b>"+esc(page.title)+"</b><small>"+esc(page.duration)+" · "+esc(page.artifact)+"</small></span></button>":""}).join("")+"</div></li>").join("")+"</ol></section><section class=module-boundary><h2>这个模块不负责什么</h2><ul>"+overview.boundary.map(item=>"<li>"+esc(item)+"</li>").join("")+"</ul></section>";document.getElementById("tutorial-content").innerHTML=body;document.querySelectorAll("[data-go]").forEach(button=>button.onclick=()=>go(button.dataset.go))}`;

const html = String.raw`<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="测试开发 × AI：需求生命周期、接口与 Web/移动端自动化、AI 性能可靠性，以及 Jira/GitLab/K8s 质量平台实战。">
<link rel="icon" href="data:,">
<title>测试开发 × AI 专业教程</title>
<style>
:root{--forest:#174a3a;--dark:#0e3026;--lime:#93bd2c;--paper:#fffefa;--canvas:#f3f1e9;--line:#dfe3df;--ink:#1c2924;--muted:#66736d;--orange:#fff1dd}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.75 system-ui,-apple-system,"PingFang SC",sans-serif}.top{position:fixed;z-index:10;inset:0 0 auto;height:68px;display:flex;align-items:center;border-bottom:1px solid var(--line);background:rgba(255,254,250,.97)}.brand{width:330px;padding:0 22px;color:var(--dark);font-weight:850;font-size:18px}.brand small{display:block;color:var(--muted);font-weight:500;font-size:11px}.progress{flex:1;padding:0 24px;font-size:12px}.bar{height:5px;margin-top:5px;background:#e7ebe8;border-radius:9px;overflow:hidden}.bar i{display:block;height:100%;background:var(--forest)}.github-star{margin-right:18px;padding:7px 12px;border:1px solid #d7dfda;border-radius:9px;background:white;color:var(--dark);font-size:11px;font-weight:800;text-decoration:none;white-space:nowrap}.github-star span{color:#d99a17;margin-right:5px}.github-star:hover{border-color:var(--forest)}.menu{display:none}.nav-toggle{flex:none;margin-left:12px;width:30px;height:30px;display:grid;place-items:center;border:1px solid var(--line);border-radius:8px;background:white;color:var(--muted);cursor:pointer}.nav-toggle:hover{color:var(--ink);border-color:var(--forest)}.side{position:fixed;top:68px;bottom:0;left:0;width:330px;overflow:auto;border-right:1px solid var(--line);background:var(--canvas)}.summary{padding:24px;background:var(--dark);color:white}.summary h2{margin:3px 0 8px;font-size:19px}.summary p{margin:0;color:#cbd9d3;font-size:12px}.stats{display:flex;gap:8px;margin-top:14px}.stats span{padding:5px 8px;border:1px solid #ffffff2c;border-radius:6px;font-size:11px}.search{margin:14px 16px 6px}.search>span{display:block;margin:0 0 5px 2px;color:var(--dark);font-size:11px;font-weight:800;letter-spacing:.04em}.search input{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:white}.document-job-nav{padding:8px 12px 0;display:flex;flex-wrap:wrap;gap:5px}.document-job-nav button{padding:5px 8px;border:1px solid var(--line);border-radius:99px;background:white;color:var(--muted);font-size:10px;cursor:pointer}.document-job-nav button:hover,.document-job-nav button.active{border-color:var(--forest);color:var(--forest)}.document-job-nav button.active{background:#edf5f1;font-weight:800}.reference-nav{padding:10px 12px 0;display:grid;gap:6px}.reference-nav button{width:100%;padding:9px 10px;display:block;text-align:left;border:1px solid var(--line);border-radius:8px;background:white;cursor:pointer}.reference-nav button:hover,.reference-nav button.active{border-color:var(--forest)}.reference-nav button.active{box-shadow:inset 3px 0 0 var(--forest)}.reference-nav b{display:block;font-size:12px}.reference-nav small{display:block;color:var(--muted);font-size:10px}.nav section{padding:8px 13px}.nav h3{margin:9px 5px 0;font-size:12px}.nav section>p{margin:0 5px 7px;color:var(--muted);font-size:10px}.nav button{width:100%;display:grid;grid-template-columns:28px 1fr 8px;gap:7px;padding:8px;border:0;border-radius:7px;background:transparent;text-align:left;cursor:pointer}.nav button:hover,.nav button.active{background:white}.nav .num{color:#8a958f;font:10px ui-monospace}.nav b{font-size:12px}.nav small{display:block;color:var(--muted);font-size:9px}.dot{width:7px;height:7px;margin-top:6px;border-radius:50%;background:#779be1}.dot.planned{border:1px solid #abb4b0;background:transparent}.dot.done{background:var(--lime);box-shadow:0 0 0 3px #93bd2c2c}.reader{margin-left:330px;padding:105px 7vw 80px}.inner{max-width:850px;margin:auto}.crumb,.eyebrow{color:var(--forest);font-size:11px;font-weight:800;letter-spacing:.08em}.meta{display:flex;gap:10px;color:var(--muted);font-size:11px}.meta span{padding-right:10px;border-right:1px solid var(--line)}h1{max-width:760px;margin:16px 0 8px;font-size:38px;line-height:1.16;letter-spacing:-.03em}.lead{color:#53615b;font-size:18px}.outcomes{display:grid;grid-template-columns:1.4fr .8fr;gap:22px;margin:32px 0;padding:24px;border-radius:13px;background:var(--dark);color:white}.outcomes strong{font-size:19px}.why{padding:16px 19px;border-left:4px solid var(--lime);background:#f4f8eb}.architecture,.materials{margin:28px 0;padding:23px;border:1px solid var(--line);border-radius:12px}.flow{display:flex;gap:21px;overflow:auto;margin:17px 0}.step{position:relative;min-width:112px;padding:12px;border:1px solid #cfdbd5;border-radius:8px;background:#f5f9f7;font-weight:750;font-size:12px}.step:not(:last-child):after{content:"→";position:absolute;right:-16px;color:var(--forest)}.materials{background:#f7f9f6}.materials>summary{display:flex;align-items:center;justify-content:space-between;gap:18px;cursor:pointer;list-style:none}.materials>summary::-webkit-details-marker{display:none}.materials>summary span{display:grid;gap:4px}.materials>summary b{font-size:18px}.materials>summary small{color:var(--forest);font-size:11px;font-weight:800}.materials>summary small:after{content:" · 展开"}.materials[open]>summary small:after{content:" · 收起"}.material-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.material-grid a{padding:14px;border:1px solid var(--line);border-radius:8px;color:inherit;text-decoration:none;background:white}.material-grid span,.material-grid i{display:block;color:var(--forest);font-size:10px}.material-grid p{margin:5px 0;color:var(--muted);font-size:11px}.prereq button{margin:6px 6px 0 0;padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:white;color:var(--forest);cursor:pointer}.block{display:grid;grid-template-columns:38px 1fr;gap:10px;padding:34px 0;border-top:1px solid var(--line)}.block h2{margin:0 0 13px;font-size:23px}.idx{color:#91a098;font:11px ui-monospace}.block li{margin:5px 0}.block-refs{display:flex;flex-wrap:wrap;gap:7px;margin-top:16px;padding-top:12px;border-top:1px dashed var(--line);font-size:11px}.block-refs b{width:100%;color:var(--forest)}.block-refs a{padding:3px 7px;border:1px solid var(--line);border-radius:6px;color:var(--forest);text-decoration:none}.references-card{margin:34px 0;padding:24px;border:1px solid var(--line);border-radius:13px;background:#f7f9f6}.reference-list{display:grid;gap:10px}.reference-list article{padding:15px;border:1px solid var(--line);border-radius:9px;background:white}.reference-list h3{margin:5px 0}.reference-list a{color:var(--forest)}.reference-list p{margin:7px 0}.reference-meta{display:flex;gap:6px}.reference-meta span{padding:2px 7px;border-radius:99px;background:#edf3ef;color:var(--forest);font-size:10px}.reference-limit{padding:8px 10px;border-left:3px solid #d89b42;background:var(--orange)}.table{overflow:auto}.table table{width:100%;border-collapse:collapse;font-size:12px}.table th,.table td{padding:9px;border:1px solid var(--line);text-align:left;vertical-align:top}.table th{background:#edf3ef}.code{position:relative;margin:18px 0;padding:18px;border-radius:9px;background:#11241d;color:#d9e7e0;overflow:auto}.code button{position:absolute;right:8px;top:8px}.expected,.warning{margin:15px 0;padding:14px 16px;border-radius:8px}.expected{background:#edf6f1}.warning{background:var(--orange)}.practice,.complete,.planned{margin:34px 0;padding:24px;border:1px solid var(--line);border-radius:13px}.practice{background:var(--canvas)}.complete label{display:block;margin:8px 0}.complete>button{width:100%;padding:11px;border:0;border-radius:7px;background:var(--forest);color:white;font-weight:800;cursor:pointer}.pager{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:38px;padding-top:20px;border-top:1px solid var(--line)}.pager button{padding:13px;border:1px solid var(--line);border-radius:8px;background:white;text-align:left;cursor:pointer}.pager button:last-child{text-align:right}.glossary-controls{margin:28px 0 14px;display:grid;gap:12px}.glossary-filters{display:flex;flex-wrap:wrap;gap:6px}.glossary-filters button{padding:5px 11px;border:1px solid var(--line);border-radius:99px;background:white;font-size:11px;cursor:pointer}.glossary-filters button.active{background:var(--forest);border-color:var(--forest);color:white}.glossary-count{color:var(--muted);font-size:12px}.glossary-list{display:grid;gap:14px}.glossary-entry{padding:18px 20px;border:1px solid var(--line);border-radius:12px;background:white}.glossary-entry.core{border-left:3px solid var(--forest)}.glossary-entry h2{margin:0 0 8px;font-size:16px}.glossary-entry h2 small{margin-left:8px;color:var(--muted);font-size:11px}.glossary-plain{margin:0}.glossary-why{padding:10px 12px;border-radius:8px;background:#f2f6f2}.glossary-why b{display:block;color:var(--forest)}.glossary-pages{display:flex;flex-wrap:wrap;gap:5px;color:var(--muted);font-size:11px}.glossary-pages button{padding:2px 7px;border:1px solid var(--line);border-radius:6px;background:transparent;color:var(--forest);cursor:pointer}.design-section{margin:34px 0;padding-top:26px;border-top:1px solid var(--line)}.design-section p{line-height:1.85}.design-layers{padding:0;list-style:none;display:grid;gap:10px}.design-layers li{padding:15px 18px;border:1px solid var(--line);border-radius:11px;background:white}.design-layers b,.design-layers span{display:block}.design-layers span{color:var(--forest)}.design-sections div{display:grid;grid-template-columns:118px minmax(0,1fr);gap:14px;padding:9px 0;border-bottom:1px dashed var(--line)}.design-sections dt{font-weight:750}.design-sections dd{margin:0;color:var(--muted)}@media(min-width:801px){.side,.reader,.brand{transition:transform .18s ease,margin-left .18s ease,width .18s ease}.nav-collapsed .side{transform:translateX(-100%);visibility:hidden}.nav-collapsed .reader{margin-left:0}.nav-collapsed .brand{width:auto}.nav-collapsed .nav-toggle{margin-left:18px}}@media(max-width:800px){.top{height:62px}.brand{width:auto;flex:1}.progress{display:none}.github-star{margin-right:10px;padding:6px 8px;font-size:10px}.menu{display:block;margin-left:12px}.nav-toggle{display:none}.side{top:62px;transform:translateX(-100%);transition:.2s;z-index:9}.side.open{transform:none}.reader{margin:0;padding:88px 18px 55px}h1{font-size:30px}.outcomes,.material-grid{grid-template-columns:1fr}}
.architecture{min-width:0;max-width:100%;overflow:hidden}.flow{width:100%;max-width:100%;min-width:0}.course-visual{min-width:0;max-width:100%;margin:18px 0 8px;overflow:hidden}.course-visual>a{display:block;width:100%;max-width:100%;overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:#f7faf8}.course-visual img{display:block;width:100%;height:auto;border:0;border-radius:11px;background:#f7faf8}.course-visual figcaption{margin-top:9px;color:var(--muted);font-size:12px}.block{grid-template-columns:38px minmax(0,1fr);min-width:0}.block>div,.inner,.reader,.code,.code pre{min-width:0;max-width:100%}.inner,.reader{overflow-x:clip}@media(max-width:800px){.block{grid-template-columns:minmax(0,1fr)}.course-visual img{width:760px;max-width:none}}
</style></head><body>
<header class="top"><button class="menu" id="menu">目录</button><button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="true" aria-controls="side" aria-label="收起课程目录" title="收起课程目录">«</button><div class="brand">测试开发 × AI<small>从传统测试到 AI 质量工程</small></div><div class="progress"><span id="progressText"></span><div class="bar"><i id="progress-bar"></i></div></div><a class="github-star" href="https://github.com/wpowen/test-development-ai-tutorial" target="_blank" rel="noreferrer" aria-label="前往 GitHub 为测试开发 AI 教程点 Star"><span>★</span>GitHub Star · 支持项目</a></header>
<aside class="side" id="side"><div class="summary"><div class="eyebrow">公开学习版</div><h2>测试开发 × AI 实战</h2><p>这里只展示已通过本地内容、结构和离线夹具门禁的页面；逐命题 Deep Research、独立审阅和生产验证尚未完成。</p><div class="stats" id="stats"></div></div><label class="search" for="tutorial-search"><span>搜索课程</span><input id="tutorial-search" aria-label="搜索课程" placeholder="输入需求、执行证据、TTFT、Agent…"></label><nav class="document-job-nav" id="document-job-nav" aria-label="按阅读任务筛选"><button type="button" data-reader-job="all" class="active">全部</button><button type="button" data-reader-job="learn">Learn · 学会</button><button type="button" data-reader-job="do">Do · 完成任务</button><button type="button" data-reader-job="look-up">Look up · 查证</button><button type="button" data-reader-job="understand">Understand · 理解</button><button type="button" data-reader-job="report-decide">Report / Decide · 报告决策</button></nav><nav class="reference-nav" id="reference-nav" aria-label="参考"><button type="button" data-reference="glossary"><b>术语表</b><small>${glossary.length} 条 · 不懂的词先查这里</small></button></nav><nav class="nav" id="course-nav"></nav></aside>
<main class="reader"><article class="inner" id="tutorial-content">${initialContent}</article><aside id="page-toc" hidden></aside></main>
<script>const COURSE_INDEX=${indexPayload};const DATA={...COURSE_INDEX,glossary:[],glossaryCategories:[]};const moduleCache=new Map();let glossaryLoaded=false;
async function loadModule(moduleId){if(moduleCache.has(moduleId))return moduleCache.get(moduleId);const response=await fetch("course-modules/"+moduleId+".json");if(!response.ok)throw new Error("无法加载模块数据："+moduleId);const data=await response.json();moduleCache.set(moduleId,data.pages);return data.pages}
async function loadPage(id){const meta=DATA.pages.find(page=>page.id===id)||DATA.pages[0];const pagesForModule=await loadModule(meta.moduleId);return pagesForModule.find(page=>page.id===meta.id)||pagesForModule[0]}
async function loadGlossary(){if(glossaryLoaded)return;const response=await fetch("glossary.json");if(!response.ok)throw new Error("无法加载术语表");const data=await response.json();DATA.glossary=data.glossary;DATA.glossaryCategories=data.glossaryCategories;glossaryLoaded=true}
const statusLabel={"desk-researched":"资料已审","fixture-tested":"实验已跑"};
const readerJobLabels={learn:"Learn · 学会",do:"Do · 完成任务","look-up":"Look up · 查证",understand:"Understand · 理解","report-decide":"Report / Decide · 报告决策"};
let readerJobFilter="all";
const referenceKindLabels={repo:"开源实现",spec:"规范",standard:"标准 / RFC",doc:"官方文档"};
const referenceReuseLabels={"code-quotable":"可引用代码","quote-with-share-alike":"署名后短引","link-only":"仅链接"};
const esc=(v)=>String(v??"").replace(/[&<>\"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;","'":"&#39;"}[c]));
function renderBlockReferences(ids,entries){const wanted=(ids||[]).map(id=>entries.find(entry=>entry.id===id)).filter(Boolean);if(!wanted.length)return"";return"<aside class=block-refs><b>本段依据</b>"+wanted.map(entry=>"<a href=\""+esc(entry.url||entry.repoUrl||entry.anchor?.url||"#")+"\" target=_blank rel=noreferrer>"+esc(entry.title)+"</a>").join("")+"</aside>"}
function renderReferenceCards(entries){if(!entries?.length)return"";return"<section class=references-card><div class=eyebrow>引用与证据边界</div><h2>本页引用</h2><p>引用用于限定结论边界；工具或规范存在，不等于你的系统已经满足结论。</p><div class=reference-list>"+entries.map(entry=>"<article><div class=reference-meta><span>"+esc(referenceKindLabels[entry.kind]||entry.kind)+"</span><span>"+esc(referenceReuseLabels[entry.reuse]||entry.reuse)+"</span></div><h3><a href=\""+esc(entry.url||entry.repoUrl||entry.anchor?.url||"#")+"\" target=_blank rel=noreferrer>"+esc(entry.title)+"</a></h3><p><b>可支持：</b>"+esc(entry.whatItProves)+"</p><p class=reference-limit><b>不能证明：</b>"+esc(entry.whatItDoesNotProve)+"</p></article>").join("")+"</div></section>"}
function setReaderJob(value){readerJobFilter=value;renderNav()}
const completed=()=>JSON.parse(localStorage.getItem("career-ai-completed")||"[]");
const referenceIds=["glossary"];
const currentId=()=>{const id=location.hash.slice(1);return DATA.pages.some(p=>p.id===id)||referenceIds.includes(id)?id:DATA.defaultPageId};
function go(id){location.hash=id==="__glossary__"?"glossary":id;window.scrollTo({top:0,behavior:"smooth"});document.getElementById("side").classList.remove("open")}
function updateProgress(){const done=completed();const count=done.filter(id=>DATA.pages.some(page=>page.id===id)).length;document.getElementById("progressText").textContent="已标记完成 "+count+"/"+DATA.pages.length+" 页";document.getElementById("progress-bar").style.width=(count/DATA.pages.length*100)+"%"}
function renderNav(){const q=document.getElementById("tutorial-search").value.trim().toLowerCase();const current=currentId();const done=completed();let out="";for(const m of DATA.modules){const group=DATA.pages.filter(p=>p.moduleId===m.id&&(!q||(p.id+" "+p.title+" "+p.summary+" "+p.artifact).toLowerCase().includes(q)));if(!group.length)continue;out+="<section><h3>"+esc(m.title)+"</h3><p>"+esc(m.subtitle)+"</p>"+group.map(p=>"<button data-id=\""+esc(p.id)+"\" class=\""+(p.id===current?"active":"")+"\"><span class=num>"+String(p.display_number).padStart(2,"0")+"</span><span><b>"+esc(p.title)+"</b><small>"+esc(p.type)+" · "+statusLabel[p.status]+"</small></span><i class=\"dot "+(done.includes(p.id)?"done":p.status)+"\"></i></button>").join("")+"</section>"}document.getElementById("course-nav").innerHTML=out;document.querySelectorAll("#course-nav button").forEach(b=>b.onclick=()=>go(b.dataset.id));document.querySelectorAll("#reference-nav button").forEach(b=>{b.classList.toggle("active",b.dataset.reference===current);b.onclick=()=>go(b.dataset.reference)})}
function renderGlossary(){const coreCount=DATA.glossary.filter(x=>x.kind==="core").length;document.getElementById("tutorial-content").innerHTML="<div class=crumb>参考 › 术语表</div><h1>术语表</h1><p class=lead>共 "+DATA.glossary.length+" 条。其中 "+coreCount+" 条是贯穿全站的核心词；点页号可以跳回它第一次出现的地方。</p><section class=glossary-controls><label class=search><span>搜索术语</span><input id=glossary-search aria-label=\"搜索术语\" placeholder=\"搜索术语、别名或解释…\"></label><div class=glossary-filters id=glossary-filters></div></section><p class=glossary-count id=glossary-count></p><div class=glossary-list id=glossary-list></div>";let category="全部";const draw=()=>{const keyword=document.getElementById("glossary-search").value.trim().toLowerCase();const filtered=DATA.glossary.filter(x=>(category==="全部"||x.category===category)&&(!keyword||(x.term+" "+(x.aka||"")+" "+x.plain+" "+(x.why||"")).toLowerCase().includes(keyword))).sort((a,b)=>a.kind===b.kind?0:a.kind==="core"?-1:1);document.getElementById("glossary-count").textContent=filtered.length+" 条匹配";document.getElementById("glossary-list").innerHTML=filtered.map(x=>"<article class=\"glossary-entry "+x.kind+"\"><h2>"+esc(x.term)+(x.aka?"<small>又称 "+esc(x.aka)+"</small>":"")+"</h2><p class=glossary-plain>"+esc(x.plain)+"</p><div class=glossary-detail-grid><section><b>机制</b><p>"+esc(x.mechanism||"")+"</p></section><section><b>测试开发看什么</b><ul>"+(x.testFocus||[]).map(item=>"<li>"+esc(item)+"</li>").join("")+"</ul></section><section><b>可复用例子</b><p>"+esc(x.example||"")+"</p></section><section><b>常见误区</b><ul>"+(x.pitfalls||[]).map(item=>"<li>"+esc(item)+"</li>").join("")+"</ul></section></div>"+(x.sources?.length?"<p class=glossary-sources><b>延伸来源</b> "+x.sources.map(s=>"<a href=\""+esc(s.url)+"\" target=_blank rel=noreferrer>"+esc(s.title)+"</a>").join(" · ")+"</p>":"")+(x.why?"<p class=glossary-why><b>为什么要关心它</b>"+esc(x.why)+"</p>":"")+(x.pages.length?"<p class=glossary-pages>出现在："+x.pages.slice(0,6).map(id=>"<button data-go=\""+esc(id)+"\">"+esc(id)+"</button>").join("")+(x.pages.length>6?"<span>等 "+x.pages.length+" 页</span>":"")+"</p>":"")+"</article>").join("")||"<p>没有匹配的术语。</p>";document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));document.querySelectorAll("#glossary-filters button").forEach(b=>b.classList.toggle("active",b.dataset.category===category))};document.getElementById("glossary-filters").innerHTML=["全部",...DATA.glossaryCategories].map(name=>"<button type=button data-category=\""+esc(name)+"\">"+esc(name)+"</button>").join("");document.querySelectorAll("#glossary-filters button").forEach(b=>b.onclick=()=>{category=b.dataset.category;draw()});document.getElementById("glossary-search").oninput=draw;draw()}
function render(){const id=currentId();if(id==="glossary"){renderGlossary();return}const p=DATA.pages.find(x=>x.id===id)||DATA.pages[0];const m=DATA.modules.find(x=>x.id===p.moduleId);const idx=DATA.pages.findIndex(x=>x.id===p.id);let body="<div class=crumb>"+esc(m.title)+" › "+esc(p.id)+"</div><div class=meta><span>"+statusLabel[p.status]+"</span><span>"+esc(p.type)+"</span><span>"+esc(p.duration)+"</span><span>更新于 "+esc(DATA.releaseScope.validatedAt)+"</span></div><h1>"+esc(p.title)+"</h1><p class=lead>"+esc(p.summary)+"</p>";
body+="<section class=outcomes><div><b>学完能做到</b><ul>"+p.outcomes.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul></div><div><b>本页必须交付</b><br><strong>"+esc(p.artifact)+"</strong></div></section>";
body+="<section class=why><b>为什么测试开发需要这一页</b><p>"+esc(p.why)+"</p></section>";
if(p.architecture)body+="<section class=architecture><div class=eyebrow>架构 / 流程</div><h2>"+esc(p.architecture.title)+"</h2>"+(p.architecture.visual?"<figure class=course-visual><a href=\""+esc(p.architecture.visual.src)+"\" target=_blank rel=noreferrer aria-label=\"打开高清原图："+esc(p.architecture.visual.alt)+"\"><img loading=lazy src=\""+esc(p.architecture.visual.src)+"\" alt=\""+esc(p.architecture.visual.alt)+"\"></a><figcaption>"+esc(p.architecture.caption)+" 手机端可在图内左右滑动，点击图片可打开高清原图。</figcaption></figure>":"")+"<div class=flow>"+p.architecture.nodes.map((x,i)=>"<div class=step>"+String(i+1).padStart(2,"0")+" · "+esc(x)+"</div>").join("")+"</div>"+(!p.architecture.visual?"<p>"+esc(p.architecture.caption)+"</p>":"")+"</section>";
if(p.prerequisites.length)body+="<section class=prereq><b>前置页面</b><div>"+p.prerequisites.map(id=>"<button data-go=\""+esc(id)+"\">"+esc(id)+"</button>").join("")+"</div></section>";
body+=p.blocks.map((b,i)=>{const t=b.technicalPresentation;const technical=t?"<div class=code data-technical-kind=\""+esc(t.kind)+"\"><small>"+esc(t.label)+(t.workingDirectory?" · 工作目录："+esc(t.workingDirectory):"")+"</small>"+(t.copyable?"<button data-copy=\""+i+"\">复制使用</button>":"<span aria-label=\"不可复制\">不可复制</span>")+"<pre>"+esc(t.content)+"</pre><small>"+esc(t.reason)+"</small></div>":"";return "<section class=block><div class=idx>"+String(i+1).padStart(2,"0")+"</div><div><h2>"+esc(b.title)+"</h2>"+b.body.map(x=>"<p>"+esc(x)+"</p>").join("")+(b.bullets?"<ul>"+b.bullets.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>":"")+(b.table?"<div class=table><table><thead><tr>"+b.table.headers.map(x=>"<th>"+esc(x)+"</th>").join("")+"</tr></thead><tbody>"+b.table.rows.map(row=>"<tr>"+row.map(x=>"<td>"+esc(x)+"</td>").join("")+"</tr>").join("")+"</tbody></table></div>":"")+technical+(b.expected?"<div class=expected><b>预期结果</b><p>"+esc(b.expected)+"</p></div>":"")+(b.warning?"<div class=warning><b>常见误区</b><p>"+esc(b.warning)+"</p></div>":"")+renderBlockReferences(b.refs,p.resolvedReferences)+"</div></section>"}).join("");
body+="<section class=practice><div class=eyebrow>实操</div><h2>练习与项目替换</h2><ol>"+p.practice.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ol></section><section class=complete><h2>满足这些条件才算学完</h2>"+p.completion.map(x=>"<label><input type=checkbox> "+esc(x)+"</label>").join("")+"<button id=complete>"+(completed().includes(p.id)?"✓ 已标记完成":"标记本页完成")+"</button></section>";
if(p.materials?.length)body+="<details class=materials><summary><span><span class=eyebrow>随课物料</span><b>需要时再展开下载</b></span><small>"+p.materials.length+" 项物料</small></summary><div class=material-grid>"+p.materials.map(x=>"<a target=_blank rel=noreferrer href=\""+esc(x.href)+"\"><span>"+esc(x.kind)+" · "+esc(x.validation)+"</span><b>"+esc(x.title)+"</b><p>"+esc(x.description)+"</p><i>打开 / 下载物料 →</i></a>").join("")+"</div></details>";
body+=renderReferenceCards(p.resolvedReferences);
body+="<nav class=pager>"+(idx>0?"<button data-go=\""+DATA.pages[idx-1].id+"\">← 上一页<br><b>"+esc(DATA.pages[idx-1].title)+"</b></button>":"<span></span>")+(idx<DATA.pages.length-1?"<button data-go=\""+DATA.pages[idx+1].id+"\">下一页 →<br><b>"+esc(DATA.pages[idx+1].title)+"</b></button>":"")+"</nav>";document.getElementById("tutorial-content").innerHTML=body;
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>navigator.clipboard.writeText(p.blocks[Number(b.dataset.copy)].technicalPresentation.content));const cb=document.getElementById("complete");if(cb)cb.onclick=()=>{let d=completed();d=d.includes(p.id)?d.filter(x=>x!==p.id):d.concat(p.id);localStorage.setItem("career-ai-completed",JSON.stringify(d));renderAll()}}
function renderAll(){document.getElementById("stats").innerHTML="<span><b>"+DATA.pages.length+"</b> 可学习页面</span><span><b>"+DATA.modules.length+"</b> 已交付模块</span>";updateProgress();renderNav();render()}
function setNavCollapsed(collapsed){document.body.classList.toggle("nav-collapsed",collapsed);const toggle=document.getElementById("nav-toggle");toggle.textContent=collapsed?"»":"«";toggle.setAttribute("aria-expanded",String(!collapsed));toggle.setAttribute("aria-label",collapsed?"展开课程目录":"收起课程目录");toggle.title=collapsed?"展开课程目录":"收起课程目录";localStorage.setItem("career-ai-nav-collapsed",collapsed?"1":"0")}
document.getElementById("tutorial-search").oninput=renderNav;document.querySelectorAll("#document-job-nav button").forEach(button=>button.onclick=()=>setReaderJob(button.dataset.readerJob));document.getElementById("menu").onclick=()=>document.getElementById("side").classList.toggle("open");document.getElementById("nav-toggle").onclick=()=>setNavCollapsed(!document.body.classList.contains("nav-collapsed"));window.addEventListener("hashchange",renderAll);setNavCollapsed(localStorage.getItem("career-ai-nav-collapsed")==="1");renderAll();
</script></body></html>`;

await rm(outputDir, { recursive: true, force: true });
await cp(publicDir, outputDir, { recursive: true });
await mkdir(outputDir, { recursive: true });
await mkdir(resolve(outputDir, "course-modules"), { recursive: true });
await writeFile(resolve(outputDir, "course-index.json"), indexPayload, "utf8");
await writeFile(resolve(outputDir, "glossary.json"), glossaryPayload, "utf8");
await Promise.all([...modulePayloads].map(([moduleId, modulePayload]) => writeFile(
  resolve(outputDir, "course-modules", `${moduleId}.json`),
  modulePayload,
  "utf8",
)));
const publishedHtml = html
  // The static renderer is intentionally kept as a single-file artifact; these small
  // projection edits keep its visible surface aligned with the dynamic app.
  .replaceAll("esc(x.plain)", "esc(x.staticExplanation||x.plain)")
  .replace('function renderGlossary(){const', 'async function renderGlossary(){await loadGlossary();if(currentId()!=="glossary")return;const')
  .replace(/function renderNav\(\)\{[\s\S]*?\}\n(?:async )?function renderGlossary\(\)/, `${staticModuleNavigation}\nasync function renderGlossary()`)
  .replace(
    'const currentId=()=>{const id=location.hash.slice(1);return DATA.pages.some(p=>p.id===id)||referenceIds.includes(id)?id:DATA.defaultPageId};',
    'const currentId=()=>{const id=location.hash.slice(1);return DATA.pages.some(p=>p.id===id)||DATA.modules.some(module=>module.id===id)||referenceIds.includes(id)?id:DATA.defaultPageId};',
  )
  .replace(
    'function render(){const id=currentId();if(id==="glossary")',
    `${staticModuleProjection}\nasync function render(){const id=currentId();if(DATA.modules.some(module=>module.id===id)){renderModuleOverview();return}if(id==="glossary")`,
  )
  .replace('if(id==="glossary"){renderGlossary();return}', 'if(id==="glossary"){await renderGlossary();return}')
  .replace(
    'const p=DATA.pages.find(x=>x.id===id)||DATA.pages[0];',
    'const pageMeta=DATA.pages.find(x=>x.id===id)||DATA.pages[0];document.getElementById("tutorial-content").innerHTML="<section class=practice><b>正在载入课程页面</b><p>按模块加载内容，避免首次下载整套 103 页课程。</p></section>";const p=await loadPage(pageMeta.id);if(currentId()!==id)return;',
  )
  .replace('renderNav();render()}', 'renderNav();void render().catch(error=>{document.getElementById("tutorial-content").innerHTML="<section class=practice><b>页面载入失败</b><p>"+esc(error.message)+"</p></section>"})}')
  .replace('<article class=\\"glossary-entry "+x.kind+"\\"><h2>', '<article class=\\"glossary-entry "+x.kind+"\\"><div class=glossary-category-label>"+esc(x.category)+"<small>"+(x.kind==="core"?"核心术语":"页面术语")+"</small></div><h2>')
  .replace('body+="<nav class=pager>"', 'body+="<section class=glossary-footer><span class=eyebrow>阅读辅助</span><p>遇到不熟的词？打开完整术语表，查看机制、测试关注点、例子、误区和来源。</p><a href=#glossary>打开术语表（"+DATA.glossaryCount+" 条） →</a></section>";body+="<nav class=pager>"')
  .replace("</style>", ".glossary-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.glossary-detail-grid section{padding:12px 14px;border-radius:9px;background:#f7f9f6}.glossary-category-label{display:flex;align-items:center;gap:8px;margin-bottom:7px;color:var(--forest);font-size:11px;font-weight:800}.glossary-category-label small{padding:2px 7px;border:1px solid var(--line);border-radius:99px;color:var(--muted);font-size:10px;font-weight:600}.glossary-footer{margin:32px 0 8px;padding:18px 20px;border:1px solid #cfdcd6;border-radius:12px;background:#f5f9f7}.glossary-footer p{margin:4px 0 8px;color:var(--muted);font-size:13px}.glossary-footer a{color:var(--forest);font-size:12px;font-weight:800}.nav button.module-overview{display:block;margin:5px 0;padding:10px;border:1px solid #c8d7d0;background:#f7faf8}.nav button.module-overview span{display:block}.nav button.module-overview small{margin-top:2px}.nav button.module-overview i{display:block;margin-top:4px;color:var(--forest);font-size:10px;font-style:normal;font-weight:800}.module-panorama,.module-logic,.module-stages,.module-boundary{margin:30px 0;padding:22px;border:1px solid var(--line);border-radius:12px;background:white}.module-stages ol{display:grid;gap:14px;padding:0;list-style:none}.module-stages li{padding:16px;border:1px solid #d8e2dd;border-radius:10px;background:#f8faf8}.stage-head{display:flex;gap:12px}.stage-head>b{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--forest);color:white;font:11px ui-monospace}.stage-head h3,.stage-head p{margin:0}.stage-head p{color:var(--muted);font-size:13px}.stage-output{margin:12px 0}.stage-output span{display:inline-block;margin-right:8px;color:var(--forest);font-size:11px;font-weight:800}.stage-pages{display:grid;gap:6px}.stage-pages button{display:grid;grid-template-columns:28px 1fr;gap:8px;padding:9px;border:1px solid var(--line);border-radius:7px;background:white;text-align:left;cursor:pointer}.stage-pages button:hover{border-color:var(--forest)}</style>");
await writeFile(resolve(outputDir, "index.html"), publishedHtml, "utf8");

const localMaterialPaths = [...new Set(
  pages.flatMap((page) => page.materials ?? [])
    .map((material) => material.href)
    .filter((href) => !/^(?:[a-z]+:)?\/\//i.test(href))
    .map((href) => href.split(/[?#]/, 1)[0]),
)];
const allowedMaterialRoots = new Set(
  localMaterialPaths
    .filter((href) => href.startsWith("materials/"))
    .map((href) => href.slice("materials/".length).split("/", 1)[0]),
);
const staticMaterialsDir = resolve(outputDir, "materials");
const staticMaterialEntries = await readdir(staticMaterialsDir, { withFileTypes: true });
const staticMaterialNames = new Set(staticMaterialEntries.map((entry) => entry.name));
for (const root of [...allowedMaterialRoots]) {
  if (root.endsWith(".zip")) {
    const directoryName = root.slice(0, -4);
    if (staticMaterialNames.has(directoryName)) allowedMaterialRoots.add(directoryName);
  } else if (staticMaterialNames.has(`${root}.zip`)) {
    allowedMaterialRoots.add(`${root}.zip`);
  }
}
for (const entry of staticMaterialEntries) {
  if (!allowedMaterialRoots.has(entry.name)) {
    await rm(resolve(staticMaterialsDir, entry.name), { recursive: true, force: true });
  }
}
await Promise.all(localMaterialPaths.map((href) => access(resolve(outputDir, href))));
console.log(`Static tutorial exported: ${pages.length} pages -> ${resolve(outputDir, "index.html")}`);
