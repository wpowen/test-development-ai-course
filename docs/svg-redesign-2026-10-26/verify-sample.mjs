import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { moduleOverviews } from '../../content/module-overviews.ts';

// Accept a pre-existing Playwright installation; do not add project dependencies.
const { chromium } = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : 'playwright');
const sampleUrl = new URL('./assets/TD-M04.review.svg', import.meta.url);
const svg = await readFile(sampleUrl, 'utf8');
const original = await readFile(new URL('../../public/visuals/modules/TD-M04.svg',import.meta.url));
const manifest = JSON.parse(await readFile(new URL('./sample-manifest.json',import.meta.url),'utf8'));
const sha = b => createHash('sha256').update(b).digest('hex');
const frozenOriginal=await readFile(new URL('./assets/TD-M04.original.svg',import.meta.url));
assert.equal(sha(frozenOriginal),manifest.original_sha256,'Original review snapshot changed');
if(manifest.status!=='APPROVED')assert.equal(sha(original),manifest.original_sha256,'Production asset changed before approval');
assert.equal(sha(svg),manifest.sample_sha256,'Sample manifest drift');
for (const stage of moduleOverviews['TD-M04'].stages) {
  assert.ok(svg.includes(stage.name),`Missing stage: ${stage.name}`);
  for(const id of stage.pages) assert.ok(svg.includes(id),`Missing page: ${id}`);
}
assert.doesNotMatch(svg,/<(?:script|image|foreignObject)\b|(?:href|src)=["'](?:https?:|data:)/i);
const browser = await chromium.launch({channel:'chrome',headless:true});
const output = new URL('../../output/playwright/svg-redesign-2026-10-26/', import.meta.url);
await mkdir(output, {recursive:true});
const page = await browser.newPage({ viewport:{width:1600,height:1660},deviceScaleFactor:1 });
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0}</style>${svg.replace(/<\?xml[^>]*>/,'')}`);
await page.evaluate(()=>document.fonts.ready);
const geometry = await page.evaluate(()=>{
  const root=document.querySelector('svg');
  const v=root.viewBox.baseVal;
  const outside=[];const containerOverflow=[];const overlaps=[];
  const texts=[...root.querySelectorAll('text')];
  const rects=texts.map(el=>({el,r:el.getBoundingClientRect(),t:el.textContent}));
  const bounds=root.getBoundingClientRect();
  for(const {el,r,t} of rects){
    if(r.left < bounds.left-1 || r.top<bounds.top-1 || r.right>bounds.right+1 || r.bottom>bounds.bottom+1)outside.push(t);
    let g=el.closest('[data-box]');
    if(g){const [x,y,w,h]=g.dataset.box.split(',').map(Number);const b=el.getBBox();if(b.x<x+5||b.y<y+5||b.x+b.width>x+w-5||b.y+b.height>y+h-5)containerOverflow.push({text:t,box:g.id,bbox:[b.x,b.y,b.width,b.height]});}
  }
  for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){
    const a=rects[i],b=rects[j];const w=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left);const h=Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);
    if(w>1&&h>1)overlaps.push([a.t,b.t]);
  }
  return {viewBox:[v.width,v.height],textCount:texts.length,stageCount:root.querySelectorAll('[id^="stage-"]').length,outside,containerOverflow,textOverlaps:overlaps};
});
await page.locator('svg').screenshot({path:new URL('TD-M04.review.png',output).pathname});
// Keep the original for an actual before/after image, not just source inspection.
await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0}</style>${frozenOriginal.toString('utf8')}`);
await page.locator('svg').screenshot({path:new URL('TD-M04.original.png',output).pathname});
await page.goto('http://127.0.0.1:4179/preview.html',{waitUntil:'load'});
await page.locator('#toggle').click();
assert.equal(await page.locator('#original').isVisible(),true);
await page.locator('#toggle').click();
await page.locator('#reading').click();
assert.equal(await page.locator('#sample').evaluate(el=>el.getBoundingClientRect().width),760);
await page.screenshot({path:new URL('desktop-reading.png',output).pathname,fullPage:true});
await page.locator('#dark').click();
await page.screenshot({path:new URL('desktop-dark.png',output).pathname,fullPage:true});
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:new URL('mobile.png',output).pathname,fullPage:true});
const mobile = await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,imageWidth:document.querySelector('#sample').getBoundingClientRect().width,scrollRegionWidth:document.querySelector('.image-scroll').clientWidth}));
assert.ok(mobile.document <= mobile.viewport,'Page overflows on mobile');
assert.equal(errors.length,0);
const report={status:'PASS',review_status:manifest.status,production_unchanged:sha(original)===manifest.original_sha256,source_stage_coverage:'7/7',source_page_coverage:'10/10',geometry,mobile,pageErrors:errors,notes:['Chrome rendering and screenshot capture completed.','Mobile image intentionally stays 760px inside a horizontal scroll region, matching the existing site convention.','Original and sample visually inspected separately; geometry checks do not establish content acceptance.']};
if(geometry.outside.length||geometry.containerOverflow.length||geometry.textOverlaps.length)report.status='FAIL';
await writeFile(new URL('./verification.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
await browser.close();
assert.equal(report.status,'PASS','Fix sample layout before showing');
