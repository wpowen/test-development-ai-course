import { moduleOverviews } from '../../../content/module-overviews.ts';
import { publicModules } from '../../../content/course.ts';
const sentence = t=>String(t).match(/[^。！？]+[。！？]?/g)||[String(t)];
export default Object.entries(moduleOverviews).map(([id,m])=>{
 const title=publicModules.find(x=>x.id===id)?.title || ({'TD-M13':'补充研究与待验证主题'}[id]) || id;
 const nodes=m.stages.map((s,i)=>({id:`s${i+1}`,title:s.name,body:[s.question,`产物：${s.output}`,s.pages.join(' / ')],tone:['input','control','ai','data','evidence','process','risk'][i%7]}));
 const sections=m.logic.slice(0,3).map((t,i)=>({title:['为什么先学这一步','怎样承接下一步','如何判断学会了'][i],body:sentence(t).slice(0,1),tone:['input','evidence','control'][i]}));
 while(sections.length<3)sections.push({title:'内容范围',body:m.boundary,tone:'control'});
 return {id,...(id==='TD-M04'?{approvedAsset:'docs/svg-redesign-2026-10-26/assets/TD-M04.review.svg'}:{}),path:`visuals/modules/${id}.svg`,pageIds:m.stages.flatMap(s=>s.pages),layout:'flow',title:`${title}｜模块全景`,thesis:m.thesis,
 focus:'本模块学习路径 · 箭头表示学习先后与交付承接',nodes,
 edges:nodes.slice(1).map((n,i)=>({from:nodes[i].id,to:n.id,label:'学习次序',kind:'data'})),
 ranks:Array.from({length:Math.ceil(nodes.length/3)},(_,i)=>(i%2?nodes.slice(i*3,(i+1)*3).reverse():nodes.slice(i*3,(i+1)*3)).map(n=>n.id)),
 sections,failure:'阶段所需输入、判据或证据缺失时，先返回相应课页补齐；不能把练习执行成功直接当作生产能力证明。',
 outcome:`带走物：${m.stages.map(s=>s.output).join('；')}。`,boundary:m.boundary.join('；')+'。教学路线不证明真实模型或生产效果，未执行环节保持 NOT_RUN。',
 sourceRefs:[{path:'content/module-overviews.ts',locator:`${id} / stages + logic + boundary`,quote:m.thesis}], supplementalSources:[]};
});
