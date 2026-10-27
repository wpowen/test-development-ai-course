# Body-bound SVG design contract

Approved reference: docs/svg-redesign-2026-10-26/assets/TD-M04.review.svg. Main agent owns renderer, generation, public SVG writes, manifests, ZIPs and integration. Workers own only their assigned spec module. No overlapping writes.

Spec modules export default an array of objects:
```js
{
 id: 'TD-T16',
 path: 'visuals/course/TD-T16.svg', // relative public/
 pageIds: ['TD-T16'],
 layout: 'flow', // flow | layers | decision | state | metric | comparison | evidence | sequence
 title: '工具调用前的独立授权链', // meaningful, concise, unique
 thesis: '模型提出动作，代码策略裁决权限；成功回包还须核对副作用。',
 focus: '跟踪一次工具调用：输入、写前校验、执行回执与拒绝路径',
 nodes: [ // 5–8 nodes normally; max 12; explicit connections only
   {id:'input',title:'候选工具调用',body:['工具名 / 参数 / 调用身份','模型提出候选，不授予权限'],tone:'input'},
   // tone: input | process | ai | data | control | evidence | risk
 ],
 edges:[{from:'input',to:'policy',label:'校验',kind:'control'}],
 // kind: data | control | evidence | feedback | risk
 sections:[ // exactly 3, each 2–3 short useful lines, drawn beneath the graph
   {title:'怎样故障注入',body:['越界金额与伪造身份','重复请求共用同一幂等键'],tone:'risk'},
   {title:'观察什么证据',body:['policy_version 与拒绝原因','回执与业务写入对账'],tone:'evidence'},
   {title:'何时允许继续',body:['写前策略拦截且零越权写入','Owner 复核高风险动作'],tone:'control'}
 ],
 failure:'越权、越界或重复写入时冻结工具，保存原始 Trace 后复测。',
 outcome:'交付工具策略、故障注入集与轨迹报告。',
 boundary:'离线夹具不证明真实模型或生产有效性；未运行保持 NOT_RUN。',
 sourceRefs:[{path:'content/modules/llm-agent.ts',locator:'TD-T16 / 写前授权链',quote:'用户身份、tenant、最小 scope、参数界限、幂等键与人类批准全部在 refund 写入之前执行。'}],
 supplementalSources:[] // {url,title,usedFor} when external factual expansion was actually needed
}
```

Read full assigned page body in docs/svg-redesign-2026-10-26/body-sources/course-N.json, especially architecture, actual method tables, failure and worked example. Do NOT just map title/outcomes to identical boxes. Keep relationships honest. A comparison branch is not an execution dependency. All technical nouns and behaviors must be traceable to body or cited primary source. Avoid fabricating measurements and universal fixed thresholds.

Each body[] line <=26 CJK-ish characters or about 44 Latin chars; renderer will wrap. Titles ideally <=16 CJK-ish chars. Sections can carry page-specific formula, state invariants, workload, controlled variable, schema/ACL etc. Preserve exact architecture node concepts where meaningful, but original generic node list does not forbid replacing false generic topology with a faithful diagram. Do not stuff keywords into hidden metadata to satisfy tests.

Use layouts semantically: flow=ordered pipeline; layers=system layers; decision=conditional gates; state=valid/failed terminal transitions; metric=parallel controlled experiment and aggregation (not invented chart values); comparison=parallel responsibility/component columns; evidence=lineage and version binding; sequence=request/action/ack interactions. The renderer positions nodes, routes typed edges and sizes canvas from content. Unique primary content and graph matter more than file count.

Worker checks: exact one spec per assigned public/visuals/course file, matching path; unique node ids; all edge endpoints exist; local sourceRefs with direct quote; exactly three detailed sections; no invented live results. Main will inspect screenshots and integrate. JSON-like JS specs may use helper functions for repeated source retrieval, but must include manually curated per-page topology and explanations.

`routing: "outer-rails"`可为经目视审查发现交叉歧义的图显式启用独立外轨、端口编号和跨线桥。此布局提示不添加语义边；修改后必须重新截图并复审。
