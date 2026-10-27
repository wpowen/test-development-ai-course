import {wrapText, createDotSource, renderRoutedGraph} from './routing.mjs';
/** Native SVG typography over explicit semantic graphs; no raster images. */
export const palette = {
 input: { ink:'#215cbb', fill:'#edf3ff' },
 process:{ink:'#344f70',fill:'#eff4fa'},
 ai:{ink:'#7045a4',fill:'#f4effb'},
 data:{ink:'#087b76',fill:'#e9f7f4'},
 control:{ink:'#945c0b',fill:'#fff5e5'},
 evidence:{ink:'#7045a4',fill:'#f4effb'},
 risk:{ink:'#ad3e4c',fill:'#fff0f0'},
};
export const colors={ink:'#172b45',muted:'#50647c',line:'#d9e2ed',paper:'#f4f7fb',...Object.fromEntries(Object.entries(palette).map(([k,v])=>[k,v.ink])),feedback:'#087b76'};
export const esc=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function widthOf(str,size){return [...String(str)].reduce((n,c)=>n+size*(/\p{Script=Han}|[\u3000-\u303f\uff00-\uffef]/u.test(c)?1.04:/[MW@%]/.test(c)?.9:/[ilI.,:;'!| ]/.test(c)?.34:/[A-Z0-9]/.test(c)?.65:.58),0);}
export function wrap(str,width,size){return wrapText(str,width,size,widthOf);}
export class Canvas {
 constructor(){this.p=[];this.serial=0;}
 add(s){this.p.push(s);}
 rect(x,y,w,h,fill,stroke='none',r=14,extra=''){this.add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" ${extra}/>`);}
 text(x,y,str,size=24,fill=colors.ink,weight=450,extra=''){this.add(`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${esc(str)}</text>`);}
 block(x,y,str,width,size=24,fill=colors.ink,weight=450,lineHeight=size*1.5){const lines=wrap(str,width,size);lines.forEach((s,i)=>this.text(x,y+i*lineHeight,s,size,fill,weight));return lines.length*lineHeight;}
 region(id,x,y,w,h,fill='#fff',stroke=colors.line,klass=''){this.add(`<g id="${esc(id)}"${klass?` class="${klass}"`:''} data-region="${x},${y},${w},${h}">`);this.rect(x,y,w,h,fill,stroke);}
 end(){this.add('</g>');}
 path(d,kind='data',extra=''){const col=kind==='data'?colors.input:colors[kind]||colors.evidence;this.add(`<path class="edge edge-${esc(kind)}" d="${d}" fill="none" stroke="${col}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" ${kind==='control'?'stroke-dasharray="8 6"':kind==='feedback'?'stroke-dasharray="12 5"':''} marker-end="url(#arr-${kind})" ${extra}/>`);}
}
const labelNames={flow:'流程与交付',layers:'分层系统',decision:'判断与分支',state:'状态与终止',metric:'实验与指标',comparison:'职责与对照',evidence:'证据谱系',sequence:'请求与回执',dimensions:'维度覆盖',donut:'来源权重',radar:'证据剖面',gantt:'阶段依赖',quadrant:'优先级判断'};
function header(c,s){
 c.text(64,53,`QUALITY ENGINEERING  /  ${s.id}`,18,colors.input,750,'class="mono"');
 const h=c.block(64,112,s.title,1456,40,colors.ink,750,56);
 const yy=112+h+2;c.block(64,yy,s.thesis,1456,24,colors.muted,450,36);
 return yy+wrap(s.thesis,1456,24).length*36+28;
}
function defs(){return `<defs>${['data','control','evidence','feedback','risk'].map(k=>`<marker id="arr-${k}" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="3" refY="6" orient="auto"><path d="M0 0L12 6L0 12L3 6Z" fill="${k==='data'?colors.input:colors[k]||colors.evidence}"/></marker>`).join('')}</defs>`;}
function rankPlan(s){
 if(s.ranks?.length)return s.ranks;
 const ids=s.nodes.map(n=>n.id);
 if(s.layout==='metric'&&ids.length>=6)return [ids.slice(0,1),ids.slice(1,3),ids.slice(3,6),ids.slice(6)].filter(a=>a.length);
 if(s.layout==='decision'&&ids.length>=6)return [ids.slice(0,1),ids.slice(1,3),ids.slice(3,6),ids.slice(6)].filter(a=>a.length);
 const size=s.layout==='comparison'?3:3;
 return Array.from({length:Math.ceil(ids.length/size)},(_,i)=>ids.slice(i*size,(i+1)*size));
}
function dotGraph(s,dimensions){
 if(!s.path.startsWith('visuals/modules/'))return createDotSource(s,dimensions,rankPlan(s),wrap,widthOf);
 const q=JSON.stringify;
 const ranks=rankPlan(s); const used=new Set(ranks.flat());for(const n of s.nodes)if(!used.has(n.id))ranks.push([n.id]);
 const rowHeights=ranks.map(r=>Math.max(...r.map(id=>dimensions.get(id)?.h||170)));
 const rowWidths=ranks.map(r=>r.length*354+Math.max(0,r.length-1)*146);const maxWidth=Math.max(...rowWidths);
 const totalHeight=rowHeights.reduce((a,b)=>a+b,0)+Math.max(0,ranks.length-1)*150;
 const pos=new Map();let offset=0;for(let i=0;i<ranks.length;i++){const yy=totalHeight-offset-rowHeights[i]/2;ranks[i].forEach((id,j)=>pos.set(id,[(maxWidth-rowWidths[i])/2+177+j*500,yy]));offset+=rowHeights[i]+150;}
 let d='digraph G { graph [splines=true, overlap=true, pad=0.12, margin=0]; node [label="", shape=box, fixedsize=true]; edge [fontname="Helvetica",fontsize=20,arrowsize=1.0];\n';
 for(const n of s.nodes){const m=dimensions.get(n.id);d+=`${q(n.id)} [width=${(m.w/72).toFixed(4)},height=${(m.h/72).toFixed(4)},pos="${pos.get(n.id).join(',')}!"];\n`;}
 for(const [i,e] of s.edges.entries()){
  const label=String(e.label||'');const wl=Math.max(1,Math.ceil(widthOf(label,21)/13.4));
  // Use only an ASCII proxy for layout metrics. The actual label is rendered below with a CJK font.
  d+=`${q(e.from)} -> ${q(e.to)} [id="e${i}", label=${q('X'.repeat(wl))}${e.kind==='feedback'?',constraint=false':''}];\n`;
 }

 return d+'}';
}
async function graph(c,s,y,viz){
 if(!s.path.startsWith('visuals/modules/'))return renderRoutedGraph(c,s,y,viz,{wrap,widthOf,palette,colors,esc,labelName:labelNames[s.layout],ranks:rankPlan(s),dotSource:dimensions=>dotGraph(s,dimensions)});
 const dimensions=new Map();
 for(const n of s.nodes){const w=354;const titles=wrap(n.title,w-44,28);const body=n.body.flatMap(t=>wrap(t,w-44,23));dimensions.set(n.id,{w,h:Math.max(170,64+titles.length*39+body.length*34),titles,body});}
 const result=viz.render(dotGraph(s,dimensions),{format:'json',engine:'nop2'});
 if(result.status!=='success')throw new Error(`${s.id}: Graphviz ${JSON.stringify(result.errors)}`);
 const g=JSON.parse(result.output);const [, ,bw,bh]=g.bb.split(',').map(Number);
 const paddingX=120,paddingY=80;const scale=Math.min(1,1360/(bw+paddingX*2));if(scale<0.60)throw new Error(`${s.id}: graph too wide (${bw}, scale ${scale.toFixed(2)}); fix ranks`);
 const gh=(bh+paddingY*2)*scale;const height=gh+170;
 c.region('system-graph',64,y,1472,height);
 c.text(88,y+42,'A',20,colors.input,800,'class="mono"');
 c.text(122,y+42,s.focus||labelNames[s.layout]||'系统与关系',25,colors.ink,700);
 c.text(88,y+77,labelNames[s.layout]||'显式关系图',18,colors.muted,550);
 const tx=800-bw*scale/2,ty=y+116+paddingY*scale;
 c.add(`<g transform="translate(${tx} ${ty}) scale(${scale})" data-graph-scale="${scale}">`);
 const coord=([x,yy])=>[x,bh-yy];
 // Spline paths are computed from the exact semantic edges, never generated from proximity.
 for(const ge of g.edges??[]){const index=Number(String(ge.id).slice(1));const e=s.edges[index];if(!e)throw Error(`${s.id}: edge mismatch`);
  for(const draw of ge._draw_??[]){if(draw.op!=='b')continue;const points=draw.points.map(coord);let d=`M${points[0].join(' ')}`;for(let i=1;i<points.length;i+=3)d+=` C${points.slice(i,i+3).map(p=>p.join(' ')).join(' ')}`;c.path(d,e.kind||'data',`data-from="${esc(e.from)}" data-to="${esc(e.to)}"`);}
 }
 for(const [index,n] of s.nodes.entries()){
  const obj=g.objects.find(o=>o.name===n.id);if(!obj)throw Error(`${s.id}: missing node ${n.id}`);
  const [cx,cy]=coord(obj.pos.split(',').map(Number));const m=dimensions.get(n.id);const x=cx-m.w/2,yy=cy-m.h/2;const tone=palette[n.tone]||palette.process;
  c.region(`node-${n.id}`,x,yy,m.w,m.h,tone.fill,'none',`node node-${n.tone||'process'}`);
  c.rect(x+18,yy+17,36,25,'#fff','none',7);c.text(x+25,yy+35,String(index+1).padStart(2,'0'),15,tone.ink,750,'class="mono"');
  let textY=yy+76;m.titles.forEach(t=>{c.text(x+22,textY,t,28,tone.ink,700);textY+=39;});textY+=4;
  m.body.forEach(t=>{c.text(x+22,textY,t,23,colors.ink);textY+=34;});
  c.end();
 }
 // Nop2 routes curves but does not avoid label collisions. Place actual CJK
 // labels against node geometry and already placed labels, near their own edge.
 const forbidden=g.objects.filter(o=>dimensions.has(o.name)).map(o=>{const [x,yy]=coord(o.pos.split(',').map(Number));const m=dimensions.get(o.name);return{x:x-m.w/2-12,y:yy-m.h/2-12,w:m.w+24,h:m.h+24};});
 const labelBoxes=[];
 const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 for(const ge of g.edges??[]){
  const e=s.edges[Number(String(ge.id).slice(1))];if(!e?.label||!ge.lp)continue;
  const [lx,ly]=coord(ge.lp.split(',').map(Number));const lines=wrap(e.label,240,21);const w=Math.max(...lines.map(t=>widthOf(t,21)))+24,h=lines.length*32+10;
  const samples=[];
  for(const draw of ge._draw_??[]){if(draw.op!=='b')continue;const ps=draw.points.map(coord);for(let j=1;j<ps.length;j+=3){const a=ps[j-1],b=ps[j],cc=ps[j+1],d=ps[j+2];for(let k=2;k<=8;k++){const t=k/10,u=1-t;samples.push([u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*cc[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*cc[1]+t*t*t*d[1]]);}}}
  const candidates=[];for(const a of [[lx,ly],...samples])for(const dx of [0,-30,30,-65,65,-100,100,-160,160,-230,230])for(const dy of [0,-34,34,-68,68,-102,102,-136,136,-184,184,-240,240]){
   const x=a[0]+dx,yy=a[1]+dy;const box={x:x-w/2-4,y:yy-h/2-4,w:w+8,h:h+8};
   if(box.x< -paddingX+6||box.x+box.w>bw+paddingX-6||box.y< -paddingY+6||box.y+box.h>bh+paddingY-6)continue;
   if(forbidden.some(b=>intersects(box,b))||labelBoxes.some(b=>intersects(box,b)))continue;
   let closest=samples[0]||[lx,ly],dist=Infinity;for(const p of samples){const d=(p[0]-x)**2+(p[1]-yy)**2;if(d<dist){dist=d;closest=p;}}
   const score=(x-lx)**2+(yy-ly)**2+dist*3;candidates.push({x,yy,box,score,closest,dist});
  }
  if(!candidates.length){for(let yy=-paddingY+40;yy<bh+paddingY-h/2-8;yy+=28)for(let x=-paddingX+w/2+8;x<bw+paddingX-w/2-8;x+=30){const box={x:x-w/2-4,y:yy-h/2-4,w:w+8,h:h+8};if(forbidden.some(b=>intersects(box,b))||labelBoxes.some(b=>intersects(box,b)))continue;let closest=samples[0]||[lx,ly],dist=Infinity;for(const p of samples){const d=(p[0]-x)**2+(p[1]-yy)**2;if(d<dist){dist=d;closest=p;}}candidates.push({x,yy,box,score:(x-lx)**2+(yy-ly)**2+dist*3,closest,dist});}}
  candidates.sort((a,b)=>a.score-b.score);const placed=candidates[0];if(!placed)throw Error(`${s.id}: no clear label position for ${e.from} → ${e.to}: ${e.label}`);
  const {x,yy,box,closest,dist}=placed;labelBoxes.push(box);
  if(dist>50*50)c.add(`<path d="M${closest[0]} ${closest[1]} L${x} ${yy}" stroke="#9aabc0" stroke-width="1.2" stroke-dasharray="3 4" fill="none"/>`);
  c.rect(x-w/2,yy-h/2,w,h,'#fff','none',6);lines.forEach((t,i)=>c.text(x,yy-(lines.length-1)*16+7+i*32,t,21,(e.kind==='data'?colors.input:colors[e.kind])||colors.muted,600,'text-anchor="middle" class="edge-label"'));
 }
 c.end();c.end();return y+height;
}
function special(c,s,y){
 if(s.id==='AG-DIM-FOUR-RINGS'){
  const titles=['01 离线 fixture','02 受控沙箱','03 影子 / 灰度','04 在线持续'];
  const rows=[
   ['输入：固定案例与独立 Oracle','执行：离线 CI 注入与回放','出口：坏版本被确定性拦下','责任：本环 owner 待具名','硬阻断：漏检已知故障','回滚：保留失败，修夹具'],
   ['输入：隔离工具与状态','执行：受控回放与重复运行','出口：副作用、恢复与重复证据','责任：本环 owner 待具名','硬阻断：隔离或副作用失守','回滚：停运行，恢复沙箱状态'],
   ['输入：获准的真实分布','影子：结果不生效、不执行动作','灰度：另审生效范围与回滚','出口：分布对比 Trace、评分与隔离证据','责任：业务与发布 owner 待具名','硬阻断：未经批准生效','回滚：撤回灰度并保留证据'],
   ['输入：批准范围内线上任务','执行：风险采样与高危捕获','出口：告警处置与漂移证据','责任：值班与风险 owner 待具名','硬阻断：安全与业务红线','回滚：隔离、停止并留存收据']
  ];
  const cardH=140+Math.max(...rows.map(row=>row.reduce((n,line)=>n+wrap(line,298,23).length*35+17,0)));
  const gateY=150+cardH+66,rollbackY=gateY+186,h=rollbackY+140;
  c.region('four-rings',64,y,1472,h);c.text(88,y+46,'四环证据比较：每列独立验收，成熟度不能合并',28,colors.ink,700);
  c.block(88,y+88,'共同输入：population / 版本 / 统计方法 / entry / exit / 具名 owner / hard block / rollback',1400,23,colors.muted,450,35);
  for(let i=0;i<4;i++){const x=88+i*362,col=[palette.input,palette.data,palette.ai,palette.control][i];c.region(`ring-${i}`,x,y+150,338,cardH,col.fill,'none','node');c.block(x+20,y+197,titles[i],298,28,col.ink,700,41);let yy=y+265;for(const line of rows[i])yy+=c.block(x+20,yy,line,298,23,colors.ink,450,35)+17;c.end();c.path(`M${x+169} ${y+150+cardH+6} L${x+169} ${y+150+cardH+47}`,'evidence');}
  c.region('ring-exit',88,y+gateY,1424,126,'#edf3ff','none');c.text(112,y+gateY+41,'逐环参数化门禁',27,colors.input,700);c.block(112,y+gateY+82,'硬政策 + 统计证据 + 具名风险接受；exit 合格只允许申请下一环，不能代替下一环真实运行。',1360,24,colors.ink,450,36);c.end();
  c.path(`M800 ${y+gateY+133} L800 ${y+gateY+169}`,'risk');c.region('ring-rollback',88,y+rollbackY,1424,108,'#fff0f0','none');c.text(112,y+rollbackY+40,'任一环失败 → 停止升级 / rollback → 保留失败 → 更新离线回归 fixture',25,colors.risk,700);c.text(112,y+rollbackY+83,'当前课程的本地模拟收据不代表真实沙箱、影子或线上验证；未运行环保持 NOT_RUN。',23,colors.muted);c.end();c.end();return y+h;
 }
 if(s.path.endsWith('career-evidence-radar.svg')){
  const actions=s.actions||[];const h=1510;c.region('evidence-matrix',64,y,1472,h);c.text(88,y+45,'五维证据矩阵：当前状态与目标要求分别记录',27,colors.ink,700);
  const columns=[{x:88,w:260,title:'能力域'},{x:372,w:510,title:'当前可打开的证据'},{x:906,w:604,title:'本次任务的目标要求'}];
  columns.forEach(k=>{c.rect(k.x,y+77,k.w,52,'#172e4c','none',8);c.text(k.x+18,y+111,k.title,22,'#fff',650);});
  for(let i=0;i<5;i++){const n=s.nodes[i];const yy=y+150+i*88;const col=Object.values(palette)[i];c.rect(88,yy,1424,74,i%2?'#f7f9fc':'#edf3fa','none',8);c.text(106,yy+44,n.title,24,col.ink,700);c.block(390,yy+43,n.body[0],460,22,colors.muted);c.block(924,yy+43,n.body[1],560,22,colors.ink);}
  c.block(88,y+635,'五维是覆盖分类，不是个人数值测量。缺 evidence_ref 的当前状态保留 UNKNOWN；目标须经任务 Owner 确认。',1400,23,colors.muted,500,35);
  c.text(88,y+739,'把缺口变成下一项可复核工件',28,colors.ink,700);c.text(88,y+782,'以下是待 Owner 选择的行动模板，尚未构成学习者的个人计划。',22,colors.muted);
  for(let i=0;i<5;i++){const a=actions[i]||{},n=s.nodes[i],yy=y+815+i*91;c.rect(88,yy,1424,76,i%2?'#f7f9fc':'#edf3fa','none',8);c.text(108,yy+30,n.title,23,colors.input,700);c.block(370,yy+30,a.artifact||'待任务 Owner 确认最小工件',1090,23,colors.ink,450,33);c.text(370,yy+61,`课页：${a.route_page||'待确认'} · 当前状态 UNKNOWN`,20,colors.muted);}
  c.region('reassessment',88,y+1300,1424,174,'#fff5e5','none');c.text(112,y+1341,'复评出口：工件 / evidence_ref → 独立 Reviewer → 分歧记录 → 下一轮',25,colors.control,700);c.text(112,y+1388,`Reviewer：${s.reassessment?.reviewer||'待填写'}   ·   review_date：${s.reassessment?.review_date||'待填写'}   ·   task_owner：待具名`,23,colors.ink);c.block(112,y+1430,'引用打不开、故障未检出或分歧未闭合时保留 UNKNOWN，修正 Oracle 或补工件后再复评。',1360,23,colors.muted,450,34);c.end();c.end();return y+h;
 }
 if(s.path.endsWith('career-evidence-gantt.svg')){
  const h=690;c.region('evidence-windows',64,y,1472,h);c.text(88,y+45,'用证据窗口安排工作：先验收前窗，再决定下一窗',27,colors.ink,700);c.text(88,y+83,'顺序示意 · 30 / 60 / 90 天属于可编辑规划，不是实际工期或晋升承诺',21,colors.muted);
  for(let i=0;i<3;i++){const n=s.nodes[i],x=88+i*482;const tone=Object.values(palette)[i];c.region(`window-${i}`,x,y+127,452,306,tone.fill,'none','node');c.text(x+24,y+174,`0${i+1}`,20,tone.ink,750,'class="mono"');c.block(x+24,y+228,n.title,400,30,tone.ink,700,42);let ly=y+284;for(const str of n.body){ly+=c.block(x+24,ly,str,400,24,colors.ink,450,36)+14;}c.end();if(i<2)c.path(`M${x+457} ${y+280} L${x+468} ${y+280}`,'evidence');}
  c.rect(88,y+474,1424,158,'#fff5e5','none',12);c.text(112,y+517,'进入下一窗的判据',26,colors.control,700);c.block(112,y+561,'先核对前窗工件、故障收据与 Reviewer；窗口到期不会自动授予能力或责任。故障未打红，回到 Oracle 设计；复评分歧未闭合，升级给 Owner。',1360,24,colors.ink,450,36);c.end();return y+h;
 }
 if(s.path.endsWith('career-responsibility-ladder.svg')){
  const h=850;c.region('responsibility-ladder',64,y,1472,h);c.text(88,y+45,'责任范围逐级扩大，决定权必须另有明确授权',27,colors.ink,700);c.text(88,y+83,'成长方向示意 · 不按年限、课程数量或 P5–P9 直接授予职级',21,colors.muted);
  for(let i=0;i<4;i++){const n=s.nodes[i],x=88+i*120,yy=y+130+i*143,w=1424-i*120;const col=Object.values(palette)[i];c.region(`responsibility-${i}`,x,yy,w,122,col.fill,'none','node');c.text(x+22,yy+43,`0${i+1}  ${n.title}`,29,col.ink,700);c.block(x+22,yy+87,n.body.join(' · '),w-44,22,colors.ink,450,34);c.end();}
  c.block(88,y+769,'工件、故障反证、真实消费者与独立 Reviewer 支持责任主张；组织映射须补内部 policy 与具名 Owner，缺失时 INTERNAL-UNKNOWN。',1400,23,colors.muted,450,35);c.end();return y+h;
 }
 if(s.layout==='quadrant'&&s.items?.length){
  const h=850;c.region('priority-quadrant',64,y,1472,h);c.text(88,y+45,'重要性 × 证据成熟度：四类行动规则',28,colors.ink,700);c.block(88,y+84,s.focus,1390,22,colors.muted,450,34);
  const x0=190,y0=y+164,w=1290,hh=570;const gap=30,cellw=(w-gap)/2,cellh=(hh-gap)/2;
  for(const item of s.items){const x=x0+item.x*(cellw+gap),yy=y0+(1-item.y)*(cellh+gap);const tone=item.y?(item.x?palette.data:palette.risk):(item.x?palette.ai:palette.process);c.region(`quadrant-${item.x}-${item.y}`,x,yy,cellw,cellh,tone.fill,'none','node');c.text(x+28,yy+64,item.title,34,tone.ink,750);c.block(x+28,yy+121,item.detail,cellw-56,25,colors.ink,450,39);c.end();}
  c.path(`M${x0-32} ${y0+hh+20} L${x0-32} ${y0-8}`,'control');c.path(`M${x0-34} ${y0+hh+20} L${x0+w+4} ${y0+hh+20}`,'evidence');
  c.text(97,y0+28,'高重要性',19,colors.control,650);c.text(97,y0+hh-8,'低重要性',19,colors.control,650);c.text(x0,y0+hh+64,'证据低 / 缺失',21,colors.evidence,650);c.text(x0+w,y0+hh+64,'证据高 / 可复核',21,colors.evidence,650,'text-anchor="end"');c.end();return y+h;
 }
 if(s.layout==='dimensions'&&s.groups?.length){
  const groupWidth=704;const heights=[];
  for(let i=0;i<s.groups.length;i+=2){const row=s.groups.slice(i,i+2);heights.push(Math.max(...row.map(g=>112+g.items.flatMap(t=>wrap(typeof t==='string'?t:JSON.stringify(t),650,22)).length*36))+24);}
  let yy=y+106;c.region('dimensions',64,y,1472,heights.reduce((a,b)=>a+b,0)+124);c.text(88,y+44,s.focus||'D0–D7：逐维绑定测试与证据',26,colors.ink,700);c.text(88,y+80,'D0 校准全部域的评分；确定性越权和硬红线直接阻断，不等待 Judge。',20,colors.muted);
  for(let i=0;i<s.groups.length;i+=2){for(let j=0;j<2&&i+j<s.groups.length;j++){const g=s.groups[i+j];const x=88+j*(groupWidth+24);const hh=heights[i/2]-24;const col=Object.values(palette)[(i+j)%7];c.region(`domain-${i+j}`,x,yy,groupWidth,hh,col.fill,'none','node');c.text(x+22,yy+42,g.title,27,col.ink,700);let ly=yy+86;for(const item of g.items){ly+=c.block(x+22,ly,typeof item==='string'?item:JSON.stringify(item),650,22,colors.ink,450,36);}c.end();}yy+=heights[i/2];}
  c.end();
  if(s.dependencyBands){
   const top=yy+46;const bandHeights=s.dependencyBands.map(b=>76+wrap(b.detail,1360,22).length*33);const hh=225+bandHeights.reduce((a,b)=>a+b,0);c.region('domain-dependencies',64,top,1472,hh);c.text(88,top+44,'域间依赖：清单之后，还要闭合执行、控制与决定',27,colors.ink,700);
   c.rect(88,top+82,1424,83,'#fff5e5','none',10);c.text(112,top+117,'D0 校准所有域的评分；校准失效使评分不可用',25,colors.control,700);c.text(112,top+150,'确定性越权与硬规则违反直接阻断，不等待 Judge 或统计结论。',22,colors.muted);
   const bands=s.dependencyBands;
   let by=top+195;for(let i=0;i<bands.length;i++){
    const b=bands[i],bh=bandHeights[i];c.region(`dependency-band-${i}`,88,by,1424,bh-16,i===1?'#fff0f0':'#edf3ff','none');c.text(112,by+32,b.title,24,i===1?colors.risk:colors.input,700);c.block(112,by+65,b.detail,1360,22,colors.ink,450,33);c.end();by+=bh;
   }
   c.end();return top+hh;
  }
  return yy+18;
 }
 if(s.layout==='donut'&&s.values?.length){
  const h=620;c.region('source-weights',64,y,1472,h);c.text(88,y+46,s.focus||'来源示例：先看结构，再决定组织参数',26,colors.ink,700);
  const vals=s.values;const total=vals.reduce((a,v)=>a+v.value,0);const r=156,circ=2*Math.PI*r;let off=0;
  const cols=Object.values(palette);
  for(let i=0;i<vals.length;i++){const n=vals[i];const len=circ*n.value/total;c.add(`<circle cx="400" cy="${y+310}" r="${r}" fill="none" stroke="${cols[i%7].ink}" stroke-width="70" stroke-dasharray="${len} ${circ-len}" stroke-dashoffset="${-off}" transform="rotate(-90 400 ${y+310})"/>`);off+=len;}
  c.text(400,y+303,'来源示例',32,colors.ink,700,'text-anchor="middle"');c.text(400,y+346,'SOURCE-EXAMPLE',18,colors.muted,600,'text-anchor="middle" class="mono"');
  vals.forEach((v,i)=>{const yy=y+128+i*75;c.rect(736,yy-19,20,20,cols[i%7].ink,'none',5);c.text(774,yy,v.label,25,colors.ink,650);c.text(1410,yy,`${v.value}%`,28,cols[i%7].ink,750,'text-anchor="end"');});
  c.block(88,y+568,'30 / 25 / 25 / 15 / 5 是来源示例；组织权重、适用岗位与 Owner 未确认时保持 INTERNAL-UNKNOWN。',1400,22,colors.muted);c.end();return y+h;
 }
 return null;
}
function sections(c,s,y){
 y+=54;c.text(64,y,'B',21,colors.input,800,'class="mono"');c.text(98,y,'把图中的关系落到可执行检查',27,colors.ink,700);y+=30;
 const blocks=s.sections||[];const contents=blocks.map(b=>b.body.flatMap(t=>wrap(t,408,23)));const hh=104+Math.max(2,...contents.map(a=>a.length))*35;
 for(let i=0;i<blocks.length;i++){const b=blocks[i];const x=64+i*501;const tone=palette[b.tone]||Object.values(palette)[i];c.region(`detail-${i}`,x,y,470,hh,'#fff');c.rect(x+20,y+22,7,30,tone.ink,'none',3);c.block(x+42,y+47,b.title,406,25,tone.ink,700,36);contents[i].forEach((t,j)=>c.text(x+24,y+102+j*35,t,23,colors.ink));c.end();}
 return y+hh;
}
function footer(c,s,y){
 y+=32;const failureLines=wrap(s.failure,1408,23);const outcomeLines=wrap(s.outcome,1408,23);const hh=58+(failureLines.length+outcomeLines.length)*35+20;c.region('failure-and-output',64,y,1472,hh,'#172e4c','none');c.text(88,y+39,'C  故障后的动作与本页交付',25,'#fff',700);let yy=y+84;for(const t of failureLines){c.text(88,yy,t,23,'#ffdce2');yy+=35;}yy+=8;for(const t of outcomeLines){c.text(88,yy,t,23,'#dce9fa');yy+=35;}c.end();y+=hh+48;
 y+=c.block(64,y,s.boundary||'教学设计与离线夹具不证明真实模型或生产效果；未运行项保持 NOT_RUN。',1470,20,colors.muted,450,31);
 const local=(s.primaryPageIds?.length?s.primaryPageIds:s.pageIds||[]).join(' / ');
 y+=c.block(64,y+8,`对应课程：${local} · ${s.title}`,1470,18,colors.muted,450,28)+20;
 const legends=[['data','数据'],['control','控制 / 授权'],['evidence','证据'],['feedback','反馈'],['risk','风险 / 阻断']];
 legends.forEach(([k,t],i)=>{const x=64+i*296;c.path(`M${x} ${y} L${x+37} ${y}`,k);c.text(x+56,y+6,t,18,colors.muted,550);});return y+39;
}
export async function renderSpec(s,viz){
 if(!s.id||!s.title||!s.thesis||!s.path)throw Error('Incomplete spec');
 const ids=new Set(s.nodes.map(n=>n.id));if(ids.size!==s.nodes.length)throw Error(`${s.id}: duplicate node`);
 for(const e of s.edges)if(!ids.has(e.from)||!ids.has(e.to))throw Error(`${s.id}: invalid edge ${e.from}→${e.to}`);
 const c=new Canvas();let y=header(c,s);const sp=special(c,s,y);y=sp??await graph(c,s,y,viz);y=sections(c,s,y);const h=Math.ceil(footer(c,s,y));
 const metadata={version:'2.0.0',id:s.id,pageIds:s.pageIds,primaryPageIds:s.primaryPageIds,layout:s.layout,sourceRefs:s.sourceRefs,supplementalSources:s.supplementalSources||[],nodes:s.nodes.map(({id,title})=>({id,title})),edges:s.edges};
 const desc=`${s.thesis} ${s.focus} ${s.boundary||''}`;
 return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${h}" viewBox="0 0 1600 ${h}" role="img" aria-labelledby="title desc" data-redraw-version="2">\n<title id="title">${esc(s.title)}</title><desc id="desc">${esc(desc)}</desc><metadata data-source-ref="${esc(s.sourceRefs?.map(r=>r.path+'#'+r.locator).join(';'))}">${esc(JSON.stringify(metadata))}</metadata>\n<style>text{font-family:'PingFang SC','Microsoft YaHei','Noto Sans CJK SC',system-ui,sans-serif}.mono{font-family:'SFMono-Regular',Consolas,monospace;letter-spacing:.25px}</style>${defs()}\n<rect width="1600" height="${h}" fill="${colors.paper}"/><rect width="10" height="174" fill="${colors.input}"/>\n${c.p.join('\n')}\n</svg>\n`;
}
