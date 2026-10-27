import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { moduleOverviews } from '../../content/module-overviews.ts';

// Review-only illustration: production assets and generated contracts are untouched.
const out = new URL('./assets/', import.meta.url);
await mkdir(out, { recursive: true });
const source = moduleOverviews['TD-M04'];
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const C = { ink:'#172b45', muted:'#50647c', line:'#d9e2ed', blue:'#215cbb', teal:'#087b76', amber:'#945c0b', purple:'#7045a4', red:'#ad3e4c', paper:'#f4f7fb' };
let p = [];
const add = s => p.push(s);
const rect = (x,y,w,h,fill,stroke='none',rx=16,extra='') => add(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" ${extra}/>`);
const text = (x,y,s,size=22,fill=C.ink,weight=400,extra='') => add(`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" ${extra}>${esc(s)}</text>`);
const line = (d,color=C.blue,dash='',marker=true) => add(`<path d="${d}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}${marker?` marker-end="url(#arrow-${Object.keys(C).find(k=>C[k]===color) || 'blue'})"`:''}/>`);
const box = (id,x,y,w,h,fill='#fff',stroke=C.line) => { add(`<g id="${id}" data-box="${x},${y},${w},${h}">`); rect(x,y,w,h,fill,stroke); };
const end = () => add('</g>');
function pill(x,y,w,label,fill,color,size=17) { rect(x,y,w,30,fill,'none',8); text(x+12,y+21,label,size,color,650); }
function icon(name,x,y,color) {
  const paths = {
    task:'M5 2H19V23H5Z M9 8H15 M9 13H15 M9 18H13',
    workflow:'M3 3H10V10H3Z M17 17H24V24H17Z M6 10V20H17 M10 6H20V17',
    agent:'M6 7H22V22H6Z M14 3V7 M10 13H10.1 M18 13H18.1 M10 18H18',
    shield:'M14 2L24 6V13C24 19 19 23 14 26C9 23 4 19 4 13V6Z M9 13L13 17L20 10',
    worker:'M3 8L14 2L25 8V22L14 28L3 22Z M3 8L14 14L25 8 M14 14V28',
    browser:'M2 4H26V24H2Z M2 10H26 M6 7H6.1 M10 7H10.1 M8 15L5 18L8 21 M20 15L23 18L20 21',
    heal:'M10 2V9H3V18H10V25H19V18H26V9H19V2Z M10 14L13 17L20 10',
    graph:'M4 4H11V11H4Z M19 18H26V25H19Z M3 20H10V27H3Z M11 8L22 18 M7 11V20',
    memory:'M5 3H23V25H5Z M9 8H19 M9 13H19 M9 18H15',
  };
  add(`<path d="${paths[name] || paths.shield}" transform="translate(${x} ${y})" fill="none" stroke="${color}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`);
}
add(`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1700" viewBox="0 0 1600 1700" role="img" aria-labelledby="title desc">`);
add(`<title id="title">测试 Agent、Worker 与 Workflow：运行链路、七个测试关注面与证据门禁</title><desc id="desc">以 TD-M04 七个教学阶段为依据重构。上方为一种受控系统的参考组合，不表示所有任务都需要 Agent；中部按原课程顺序覆盖三层评测、工具权限、安全边界、浏览器 Agent、自愈风险、控制权划分、编排记忆；下方区分 FAIL、BLOCKED、UNKNOWN 与人工发布判断。箭头只用于实际信息或控制关系，不把教学条目连接成虚假的执行顺序。此图是教学设计，不证明真实模型效果或生产验证。</desc>`);
add(`<style>text{font-family:'PingFang SC','Microsoft YaHei','Noto Sans CJK SC',system-ui,sans-serif} .mono{font-family:'SFMono-Regular',Consolas,monospace;letter-spacing:.5px}</style><defs>`);
for (const k of ['blue','teal','amber','purple','red']) add(`<marker id="arrow-${k}" markerWidth="12" markerHeight="12" refX="3" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L12 6L0 12L3 6Z" fill="${C[k]}"/></marker>`);
add('</defs>');
rect(0,0,1600,1700,C.paper,'none',0);
rect(0,0,12,174,C.blue,'none',0);
text(64,53,'QUALITY ENGINEERING   /   TD-M04',18,C.blue,750,'class="mono"');
text(64,111,'测试 Agent、Worker 与 Workflow',43,C.ink,750);
text(64,153,source.thesis,25,C.muted,450);
pill(1284,38,252,'样图 01 · 待确认', '#e7edf8',C.blue,18);
text(1297,118,'7 个测试关注面',20,C.ink,650);
text(1297,151,'10 页课程 · 1 条证据链',18,C.muted);

// A reference runtime: explicit links, rather than adjacency-generated edges.
box('runtime',64,194,1472,444,'#fff');
text(88,237,'A',22,C.blue,800,'class="mono"');
text(122,237,'先看运行链路：谁决定下一步，谁有权真正执行',25,C.ink,700);
text(88,271,'一种受控组合示意；固定流程可直接调用 Worker，是否引入 Agent 由任务需要决定。',20,C.muted);
const runtime = [
  ['task',88,'任务与依据','目标 · 业务判据 · 风险','固定输入与版本',C.blue,'#edf3ff'],
  ['workflow',374,'Workflow','代码控制状态与分支','恢复点 · 预算 · Handoff',C.amber,'#fff5e5'],
  ['agent',660,'Agent','模型提出下一步动作','选择工具与参数',C.purple,'#f4effb'],
  ['shield',946,'Policy Gate','独立校验身份与权限','参数 · 租户 · 必要审批',C.amber,'#fff5e5'],
  ['worker',1232,'Worker / Tool','执行获准的具体动作','幂等写入 · 执行回执',C.teal,'#e9f7f4'],
];
for (let i=0;i<runtime.length-1;i++) { const col=i===0?C.blue:C.amber; line(`M${runtime[i][1]+263} 363 L${runtime[i+1][1]-14} 363`,col,i===0?'':'6 5'); }
for (const [sym,x,title,a,b,col,fill] of runtime) {
  box(`runtime-${sym}`,x,306,258,116,fill,'none');
  icon(sym,x+218,324,col);
  text(x+18,341,title,25,col,750);
  text(x+18,374,a,19,C.ink,500);
  text(x+18,401,b,18,C.muted);
  end();
}
line('M1361 427 C1361 441 1361 447 1345 447 L868 447 C850 447 850 442 850 436',C.blue);
text(1001,473,'工具观察结果返回 Agent，继续或终止',18,C.blue,600);
line('M720 473 L720 436',C.amber,'6 5');
box('recovery',88,489,532,73,'#f8fafc','none');
text(106,516,'恢复与人工接管',19,C.ink,700);
text(106,545,'超时 / 重试 / Handoff 必须留下状态与终止原因',18,C.muted);
end();
box('memory',660,489,258,73,'#f4effb','none');
text(678,516,'Memory / Route',19,C.purple,700);
text(678,545,'读写隔离 · 降级再授权',18,C.muted);
end();
line('M720 484 L720 473',C.amber,'6 5',false);
box('gate-reject',946,489,544,73,'#fff0f0','none');
text(964,516,'拒绝与审批',19,C.red,700);
text(964,545,'未授权：阻断执行；需审批：等待 Owner 决定',18,C.muted);
end();
rect(88,586,1424,32,'#f2eef9','none',8);
text(106,609,'证据随每步同步记录：run_id  →  输入版本 / 状态快照 / 工具账本 / 授权回执 / 最终业务状态',19,C.purple,550);
end();

// Original seven-stage learning order is kept explicitly in numbering.
text(64,694,'B',22,C.blue,800,'class="mono"');
text(98,694,'按七个关注面建立测试，而不是只看最终回答',27,C.ink,700);
text(64,726,'01 → 07 为课程学习顺序；各关注面共同覆盖上方系统，并非一次运行的七个执行步骤。',20,C.muted);
box('stage-01',64,754,344,536,'#172e4c','none');
pill(88,776,54,'01','#2e496a','#fff',18);
text(88,851,source.stages[0].name,30,'#fff',700);
text(88,887,source.stages[0].question,21,'#cad8ea');
const levels=[['结果 Outcome','业务状态是否满足判据？','答案正确也要核对真实状态'],['步骤 Step','每次调用是否获得授权？','工具、参数、租户与副作用'],['轨迹 Trajectory','整条路径能否安全结束？','顺序、重试、预算与状态']];
for(let i=0;i<levels.length;i++) {
  const yy=916+i*92;
  rect(88,yy,296,84,'#233e5e','none',10);
  text(102,yy+25,levels[i][0],20,'#dce9fa',700);
  text(102,yy+54,levels[i][1],18,'#fff');
  text(102,yy+78,levels[i][2],15,'#d0dced');
}
text(88,1233,'产物：三层评测模型与证据映射',18,'#dce9fa',650);
text(88,1267,'TD-T15',17,'#b5c8e0',500,'class="mono"');
end();
const stages = [
 {n:2,x:440,y:754,col:C.blue,fill:'#edf3ff',sym:'shield',body:['错误工具 / 参数边界 / 越权调用','动作前授权；重复调用只生效一次'],output:['工具策略与故障注入集']},
 {n:3,x:816,y:754,col:C.red,fill:'#fff0f0',sym:'shield',body:['网页、邮件与工具返回均可能被注入','隔离数据与指令；策略在模型外执行'],output:['攻击集与红队报告']},
 {n:4,x:1192,y:754,col:C.teal,fill:'#e9f7f4',sym:'browser',body:['固定业务判据，审查生成的测试','注入已知缺陷，确认测试真的变红'],output:['生成测试包与审查记录']},
 {n:5,x:440,y:1030,col:C.red,fill:'#fff0f0',sym:'heal',body:['保存原失败、截图、Trace 与补丁','禁止删断言、改期望；重跑缺陷变异'],output:['反作弊检查与审计报告']},
 {n:6,x:816,y:1030,col:C.amber,fill:'#fff5e5',sym:'graph',body:['区分代码分支、模型决策、队列执行','验证恢复 / 重试 / 接管 / 停止不变量'],output:['控制权对照图与状态模型']},
 {n:7,x:1192,y:1030,col:C.purple,fill:'#f4effb',sym:'memory',body:['同预算比较单 Agent 与多 Agent','检查记忆隔离、删除与路由降级授权'],output:['同预算实验、记忆门禁','与路由矩阵']},
];
for (const s of stages) {
 const st=source.stages[s.n-1];
 box(`stage-0${s.n}`,s.x,s.y,344,s.n>=5?260:244,'#fff');
 pill(s.x+20,s.y+18,48,`0${s.n}`,s.fill,s.col,17);
 icon(s.sym,s.x+292,s.y+18,s.col);
 text(s.x+20,s.y+84,st.name,27,C.ink,700);
 text(s.x+20,s.y+121,s.body[0],18,C.muted);
 text(s.x+20,s.y+149,s.body[1],18,C.muted);
 rect(s.x+20,s.y+170,304,1,C.line,'none',0);
 text(s.x+20,s.y+195,`产物：${s.output[0]}`,18,s.col,600);
 if(s.output[1]) text(s.x+74,s.y+223,s.output[1],18,s.col,600);
 text(s.x+20,(s.n>=5?s.y+251:s.y+232),st.pages.join(' / '),15,C.muted,500,'class="mono"');
 end();
}

// Decision panel: qualification must be based on actual observations.
add('<g transform="translate(0 30)">');
text(64,1330,'C',22,C.blue,800,'class="mono"');
text(98,1330,'把证据变成判断；修复后回到最早失败点重跑',27,C.ink,700);
box('decisions',64,1358,1472,166,'#fff');
const decisions=[
 [88,C.purple,'#f4effb','汇总证据','版本一致 · 判据固定','输入与执行可追溯'],
 [452,C.red,'#fff0f0','异常先分类','断言不符 FAIL · 前置受阻 BLOCKED','证据不足 UNKNOWN'],
 [816,C.amber,'#fff5e5','Owner Gate','质量 / 业务 Owner 审阅','决定修复、接受风险或发布'],
 [1180,C.teal,'#e9f7f4','形成新回执','修复后重跑关联用例','保留旧证据与新结果'],
];
for(let i=0;i<decisions.length;i++) {
 const [x,col,fill,title,a,b]=decisions[i];
 rect(x,1380,332,120,fill,'none',12);
 text(x+16,1418,title,25,col,700);
 text(x+16,1451,a,17,C.ink);
 text(x+16,1478,b,18,C.muted);
 if(i<decisions.length-1) line(`M${x+337} 1440 L${decisions[i+1][0]-14} 1440`,C.purple);
}
end();
text(64,1564,'范围：性能与容量见 TD-M11；完整架构分域见 TD-M12。安全部分仅覆盖测试视角的攻击集。',19,C.muted);
text(64,1599,'证据边界：教学结构与离线夹具，不证明真实模型效果、企业集成或生产收益；未运行项保持 NOT_RUN。',19,C.muted);
// Small legend: type + color; never depend on color alone.
for(const [x,col,dash,label] of [[64,C.blue,'','数据 / 观察结果'],[410,C.amber,'6 5','控制 / 授权'],[730,C.purple,'','证据 / 判断'],[1040,C.red,'','红色区域：风险与阻断']]) {
 line(`M${x} 1634 L${x+42} 1634`,col,dash,false);
 text(x+56,1640,label,17,C.muted);
}
add('</g>');
add('</svg>');
const svg=p.join('\n')+'\n';
await writeFile(new URL('TD-M04.review.svg',out),svg);
const original = await readFile(new URL('TD-M04.original.svg',out)).catch(()=>readFile(new URL('../../public/visuals/modules/TD-M04.svg',import.meta.url)));
const prior = JSON.parse(await readFile(new URL('../sample-manifest.json',out),'utf8').catch(()=>'{}'));
await writeFile(new URL('TD-M04.original.svg',out),original);
const manifest = {
 status:prior.status||'REVIEW_PENDING', approval:prior.approval, target:'public/visuals/modules/TD-M04.svg', production_replaced:prior.production_replaced||false,
 source_refs:['content/module-overviews.ts#TD-M04','content/modules/llm-agent.ts#controls','content/modules/advanced-quality-gaps.ts#TD-X603-TD-X604'],
 source_sha256:createHash('sha256').update(await readFile(new URL('../../content/module-overviews.ts',import.meta.url))).digest('hex'),
 original_sha256:createHash('sha256').update(original).digest('hex'),
 sample_sha256:createHash('sha256').update(svg).digest('hex'),
 stages:source.stages,
 runtime_edges:[['task','workflow','data'],['workflow','agent','control'],['agent','policy','control'],['policy','worker','control'],['worker','agent','observation'],['memory-route','agent','controlled-context']],
 design_note:'Runtime is one illustrative composition, not a universal required chain. Seven curriculum stages retain learning order, not execution dependency.'
};
await writeFile(new URL('../sample-manifest.json',out),JSON.stringify(manifest,null,2)+'\n');
console.log(`Review sample written: ${svg.length} characters; ${source.stages.length} stages. Production untouched.`);
