# Course 2 独立视觉与正文复审（A02返工复审）

**结论：本组6图 PASS，当前未关闭 P0/P1/P2/P3 均为0。** 本轮仅A02重新实看；其余5图经SVG及截图exact SHA比对不变，继承上一轮实看与正文结论，本轮未重新看这5图。

A02采用5个1600px原宽、重叠140px裁块，覆盖最新4572px截图全部像素行；实际调用 `view_image` 检查A1/A2/A3、B/C、页脚与图例。B区完整词组换行P3已关闭，未发现新P3。Chrome PASS仅作为截图/候选绑定证据。

返工前报告：[JSON](review-course2-before-A02.json) · [Markdown](review-course2-before-A02.md)。档案保持不变。

本组通过不等于全部18项或整体发布门禁已通过；未提交、未部署。

| 图 | 结论 | 本轮证据方式 | 截图 | 当前发现 |
|---|---|---|---|---|
| TD-T06 | PASS | 双exact SHA不变，继承实看 | 1600×2318 | 无 |
| TD-A02 | PASS | 新SHA全图实看 | 1600×4572 | 无 |
| TD-T10 | PASS | 双exact SHA不变，继承实看 | 1600×3192 | 无 |
| TD-T12 | PASS | 双exact SHA不变，继承实看 | 1600×3193 | 无 |
| TD-T15 | PASS | 双exact SHA不变，继承实看 | 1600×2640 | 无 |
| TD-W03 | PASS | 双exact SHA不变，继承实看 | 1600×3527 | 无 |

## A02换行P3关闭

最新1600×4572截图B区左卡实看：y=4119为“SSE 查顺序与结束”，y=4154为“JSON 查字段不变量”，y=4189为“Tool 查执行、结果回填与失败回退”。“不变量”完整，无单独“变量”孤行；采用主动语义换行，未缩略原有断言含义。5个全宽重叠裁块覆盖0–4571全部像素行，A1/A2/A3、B/C、边界与图例均复查，未发现新P3。

新SVG SHA256：`8ae8786f2e742857d1bfef3e8cf30dde11460881650bb7aa2b2a40b0fd0e029b`

新截图 SHA256：`d43a72aab816a0869bf38b07cd4e60946af8f551782b065d50ea4e33e26a0f4a`

[B区实看裁块](review-course2-crops/TD-A02-y3180-4379.png)。主动分行完整保留原意，没有语义缩略。


## TD-T06 — PASS

证据方式：**继承上一轮实看；本轮仅核对双exact SHA**。

候选：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-T06.svg`

SVG SHA256：`255affcf2432f34822436efd3667b13bd5605a23277a2562bfaee5bc769e209d`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T06.png`

截图 SHA256：`82cc6ef38a0798da39f790a62d74be4a70d0688c1a9856aa6f26637eb3554a77`

**原布局P3关闭证据：** 候选02居中放在两Runner上方，03 Baseline与04 Mutation同排等宽；输入边01/02左右对称。01 Oracle独立位于下排，经03固定期望向上供Baseline、04独立判据向右供检测；原上半区单侧空置已消除，未把Oracle改成候选产物。

**正文与语义：** 批准实现baseline全绿后才启动mutation；相同候选、独立expected与目标actual比较，相关断言杀死才进入review。未杀死/不确定单独分类，no coverage先补路径，等价与工具错误复核，Reviewer处置完整才入回归；baseline失败停止与不改expected均可见。

**视觉结论：** 候选02居中放在两Runner上方，03 Baseline与04 Mutation同排等宽；输入边01/02左右对称。01 Oracle独立位于下排，经03固定期望向上供Baseline、04独立判据向右供检测；原上半区单侧空置已消除，未把Oracle改成候选产物。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

**逐边证据：** 9/9；继承原轮追踪，无缺边或额外语义边。

**正文原文核对：** 3 工具与证据：三种变异结果各自的含义与处置；4 架构节点与交付物；6 这一页的验收口径：用检测力而不是通过率；8 TD-T06 工作示例：从一个业务守卫到可复用 Mutation 报告；9 用独立 Mutation 证明候选测试能杀错：证据如何流转与停止；17 杀死率很低时按什么顺序查；19 完成标准与停止条件。

**裁块覆盖（原轮实看，本轮继承）：** 全宽及全部像素行。

| 裁块 | 原图像素行（含首尾） |
|---|---|
| [TD-T06-y0-1199.png](review-course2-crops/TD-T06-y0-1199.png) | 0–1199 |
| [TD-T06-y1060-2259.png](review-course2-crops/TD-T06-y1060-2259.png) | 1060–2259 |
| [TD-T06-y2120-2317.png](review-course2-crops/TD-T06-y2120-2317.png) | 2120–2317 |

**边清单（原轮实看追踪，本轮继承）：**

- 01 / `e0`：`candidate → base`，正常代码；实际path及语义端点一致。
- 02 / `e1`：`candidate → mutate`，相同候选；实际path及语义端点一致。
- 03 / `e2`：`oracle → base`，固定期望；实际path及语义端点一致。
- 04 / `e3`：`oracle → detect`，独立判据；实际path及语义端点一致。
- 05 / `e4`：`base → mutate`，仅 baseline 全绿后；实际path及语义端点一致。
- 06 / `e5`：`mutate → detect`，变异运行证据；实际path及语义端点一致。
- 07 / `e6`：`detect → review`，相关断言杀死；实际path及语义端点一致。
- 08 / `e7`：`detect → classify`，未杀死 / 不确定；实际path及语义端点一致。
- 09 / `e8`：`classify → review`，逐项归因与处置；实际path及语义端点一致。

## TD-A02 — PASS

证据方式：**本轮新SHA实看**。

候选：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-A02.svg`

SVG SHA256：`8ae8786f2e742857d1bfef3e8cf30dde11460881650bb7aa2b2a40b0fd0e029b`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-A02.png`

截图 SHA256：`d43a72aab816a0869bf38b07cd4e60946af8f551782b065d50ea4e33e26a0f4a`

**原布局P3关闭证据：** A1四列分别接收请求，SSE/Schema/Async各自用14/15/16短边到09账本引用、17/18/19本列侧边到10门禁引用；工具细节移到A2，查账与汇总移到A3。原跨多排汇总外轨已消除，三分区标题、04/06/07/08/09/10同号与“同一节点”说明可对照。

**正文与语义：** 四协议分流没有串成同一执行链；SSE结束完整性、Schema与语义、Async唯一终态分别判定。工具05获准且幂等未命中才执行；06拒绝、09执行失败/超时/取消进入回退，08成功真实回填与11失败/未知真实回填都保留；07重复先查账、10超时未知先查幂等、12已有确认结果回填、13独立副作用读回、20回填时序和21至多一次副作用均保留。未观察到用自定义布局隐去成功/失败或引入重复执行。 本轮B区将原复合句按SSE/JSON主动分行，保留“顺序与结束”和“字段不变量”完整含义，正文快照及21条语义边未变化。

**视觉结论：** A1四列分别接收请求，SSE/Schema/Async各自用14/15/16短边到09账本引用、17/18/19本列侧边到10门禁引用；工具细节移到A2，查账与汇总移到A3。原跨多排汇总外轨已消除，三分区标题、04/06/07/08/09/10同号与“同一节点”说明可对照。 最新1600×4572截图B区左卡实看：y=4119为“SSE 查顺序与结束”，y=4154为“JSON 查字段不变量”，y=4189为“Tool 查执行、结果回填与失败回退”。“不变量”完整，无单独“变量”孤行；采用主动语义换行，未缩略原有断言含义。5个全宽重叠裁块覆盖0–4571全部像素行，A1/A2/A3、B/C、边界与图例均复查，未发现新P3。

**逐边证据：** 21/21；本轮重新追踪，无缺边或额外语义边。

**正文原文核对：** 3 四种协议形态各自必须断言的状态转移；4 架构节点与交付物；5 四种形态各自必须断言的状态转移；8 把流式、工具与异步过程建成状态机：用一个业务例子验证方法，并说明迁移条件；11 把流式、工具与异步过程建成状态机；12 把流式、工具与异步过程建成状态机：把协议和决策写成可检查模型；14 把流式、工具与异步过程建成状态机：重放 0 → 1 → 0；19 完成标准与停止条件。

**裁块覆盖（本轮实看）：** 全宽及全部像素行。

| 裁块 | 原图像素行（含首尾） |
|---|---|
| [TD-A02-y0-1199.png](review-course2-crops/TD-A02-y0-1199.png) | 0–1199 |
| [TD-A02-y1060-2259.png](review-course2-crops/TD-A02-y1060-2259.png) | 1060–2259 |
| [TD-A02-y2120-3319.png](review-course2-crops/TD-A02-y2120-3319.png) | 2120–3319 |
| [TD-A02-y3180-4379.png](review-course2-crops/TD-A02-y3180-4379.png) | 3180–4379 |
| [TD-A02-y4240-4571.png](review-course2-crops/TD-A02-y4240-4571.png) | 4240–4571 |

**边清单（本轮实看追踪）：**

- 01 / `e0`：`request → sse`，流式；实际path及语义端点一致。
- 02 / `e1`：`request → structured`，结构化；实际path及语义端点一致。
- 03 / `e2`：`request → tool`，工具请求；实际path及语义端点一致。
- 04 / `e3`：`request → async`，异步；实际path及语义端点一致。
- 05 / `e4`：`tool → execute`，获准且幂等未命中；实际path及语义端点一致。
- 06 / `e5`：`tool → fallback`，授权拒绝或前置缺失；实际path及语义端点一致。
- 07 / `e6`：`tool → ledger`，重复请求：先查已有状态；实际path及语义端点一致。
- 08 / `e7`：`execute → refill`，执行成功：先回填真实结果；实际path及语义端点一致。
- 09 / `e8`：`execute → fallback`，失败、超时或取消；实际path及语义端点一致。
- 10 / `e9`：`fallback → ledger`，超时未知：查询幂等状态；实际path及语义端点一致。
- 11 / `e10`：`fallback → refill`，回填失败/未知并安全回退；实际path及语义端点一致。
- 12 / `e11`：`ledger → refill`，工具重复请求已有已确认结果；实际path及语义端点一致。
- 13 / `e12`：`execute → ledger`，独立核对执行副作用；实际path及语义端点一致。
- 14 / `e13`：`sse → ledger`，终态对应的业务状态；实际path及语义端点一致。
- 15 / `e14`：`structured → ledger`，字段对应的业务状态；实际path及语义端点一致。
- 16 / `e15`：`async → ledger`，任务与回调终态核对；实际path及语义端点一致。
- 17 / `e16`：`sse → gate`，事件顺序与结束完整性；实际path及语义端点一致。
- 18 / `e17`：`structured → gate`，结构与语义分别出分；实际path及语义端点一致。
- 19 / `e18`：`async → gate`，状态集合与回调顺序；实际path及语义端点一致。
- 20 / `e19`：`refill → gate`，执行→回填→后续内容的时序；实际path及语义端点一致。
- 21 / `e20`：`ledger → gate`，业务终态与至多一次副作用；实际path及语义端点一致。

## TD-T10 — PASS

证据方式：**继承上一轮实看；本轮仅核对双exact SHA**。

候选：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-T10.svg`

SVG SHA256：`6f92c26f9e69e5dab8b1055d8b30a20b2509585830416880e9256e71dce31b65`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T10.png`

截图 SHA256：`1d59d2ad6c8046a66940a642297f1f31959c04c20b4f2a111125f4c2e75ee094`

**原布局P3关闭证据：** A2左列语料→召回→排序→Context→生成构成连续主链；07最终top-k竖直进入Context。03/06/08/10四条缺失边在各自排向右进入07 Miss引用，不再穿越top-k成功边。A1独立qrels分别约束02/03，引用不表示重跑。

**正文与语义：** 独立qrels与语料/chunk lineage、raw query/rewrite/filters、候选doc_id/score/索引版本、top-k、最终Context分层。语料不存在、召回/过滤误伤、排序压出窗口、组装丢失各有实际出口到Miss/Owner。Context充分后才进入生成/引用；检索未召回不能靠最终答案正确借分，无gold/争议未裁决保留UNKNOWN。

**视觉结论：** A2左列语料→召回→排序→Context→生成构成连续主链；07最终top-k竖直进入Context。03/06/08/10四条缺失边在各自排向右进入07 Miss引用，不再穿越top-k成功边。A1独立qrels分别约束02/03，引用不表示重跑。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

**逐边证据：** 10/10；继承原轮追踪，无缺边或额外语义边。

**正文原文核对：** 4 架构节点与交付物；5 四类 miss reason 各自的修法；8 先测 candidate generation，再测 ranking；9 Miss reason 决定修哪一层；10 知识库里明明有答案，RAG 为什么还是搜不到 的 Prompt 只生成候选，Oracle 独立判定；16 完成标准与停止条件；18 检索 miss 的逐层排查：从 query 到 ranking。

**裁块覆盖（原轮实看，本轮继承）：** 全宽及全部像素行。

| 裁块 | 原图像素行（含首尾） |
|---|---|
| [TD-T10-y0-1199.png](review-course2-crops/TD-T10-y0-1199.png) | 0–1199 |
| [TD-T10-y1060-2259.png](review-course2-crops/TD-T10-y1060-2259.png) | 1060–2259 |
| [TD-T10-y2120-3191.png](review-course2-crops/TD-T10-y2120-3191.png) | 2120–3191 |

**边清单（原轮实看追踪，本轮继承）：**

- 01 / `e0`：`gold → corpus`，查必要证据；实际path及语义端点一致。
- 02 / `e1`：`corpus → retrieval`，存在于当前语料；实际path及语义端点一致。
- 03 / `e2`：`corpus → miss`，不存在；实际path及语义端点一致。
- 04 / `e3`：`gold → retrieval`，独立 relevant 判断；实际path及语义端点一致。
- 05 / `e4`：`retrieval → ranking`，候选已召回；实际path及语义端点一致。
- 06 / `e5`：`retrieval → miss`，未召回 / 过滤误伤；实际path及语义端点一致。
- 07 / `e6`：`ranking → context`，最终 top-k；实际path及语义端点一致。
- 08 / `e7`：`ranking → miss`，排序压出窗口；实际path及语义端点一致。
- 09 / `e8`：`context → generation`，上下文充分再测生成；实际path及语义端点一致。
- 10 / `e9`：`context → miss`，组装丢失；实际path及语义端点一致。

## TD-T12 — PASS

证据方式：**继承上一轮实看；本轮仅核对双exact SHA**。

候选：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-T12.svg`

SVG SHA256：`e2b687d04e6a1708c6ae1a19f2c9c35e0eab60a7516db5db0007886c16cf4bd3`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T12.png`

截图 SHA256：`6b8b852bd8d7761b11509d0253020f77f8a7f8f6914905fd636ce0d11233db22`

**原布局P3关闭证据：** 生成04→05回答与引用竖直向下，04→06工具意图横向右行；05→07无支撑/冲突在下一排右行，原蓝红交叉消除。ACL→Gate的11号硬否决在ACL同排单独出边，A2分别汇总faith/policy/handoff。

**正文与语义：** ACL在检索之前限定可见集合，空结果不得扩权；answerability gold独立，非空也可能不足。可用证据才生成，不足/冲突转具名Handoff，生成后逐claim核验；工具意图进入模型之外的Side-effect policy，独立副作用断言进Gate。跨租户/未授权写入单独阻断，质量总分不可抵消。

**视觉结论：** 生成04→05回答与引用竖直向下，04→06工具意图横向右行；05→07无支撑/冲突在下一排右行，原蓝红交叉消除。ACL→Gate的11号硬否决在ACL同排单独出边，A2分别汇总faith/policy/handoff。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

**逐边证据：** 11/11；继承原轮追踪，无缺边或额外语义边。

**正文原文核对：** 2 上线前最后一道门，拦的不是答得好不好；3 五道关卡：哪些是硬红线，哪些进统计门禁；5 五道关卡各自的 blocker 判据；8 端到端 Gate 不等于一个总分；9 停止是一种正确结果；10 RAG 上线前，哪些检索、拒答和权限问题必须拦住 的 Prompt 只生成候选，Oracle 独立判定；16 完成标准与停止条件；18 端到端 RAG Gate：已知、无答案与越权必须分开；19 RAG Gate 项目交付：把拒答也当作可验证产物。

**裁块覆盖（原轮实看，本轮继承）：** 全宽及全部像素行。

| 裁块 | 原图像素行（含首尾） |
|---|---|
| [TD-T12-y0-1199.png](review-course2-crops/TD-T12-y0-1199.png) | 0–1199 |
| [TD-T12-y1060-2259.png](review-course2-crops/TD-T12-y1060-2259.png) | 1060–2259 |
| [TD-T12-y2120-3192.png](review-course2-crops/TD-T12-y2120-3192.png) | 2120–3192 |

**边清单（原轮实看追踪，本轮继承）：**

- 01 / `e0`：`corpus → acl`，语料与身份；实际path及语义端点一致。
- 02 / `e1`：`acl → retrieval`，授权可见集合；实际path及语义端点一致。
- 03 / `e2`：`retrieval → generate`，有可用证据；实际path及语义端点一致。
- 04 / `e3`：`retrieval → handoff`，不足 / 冲突 / no-answer；实际path及语义端点一致。
- 05 / `e4`：`generate → faith`，回答与引用；实际path及语义端点一致。
- 06 / `e5`：`generate → policy`，动作承诺与工具意图；实际path及语义端点一致。
- 07 / `e6`：`faith → handoff`，无支撑或冲突；实际path及语义端点一致。
- 08 / `e7`：`faith → gate`，逐条证据；实际path及语义端点一致。
- 09 / `e8`：`policy → gate`，独立副作用断言；实际path及语义端点一致。
- 10 / `e9`：`handoff → gate`，交接完整性；实际path及语义端点一致。
- 11 / `e10`：`acl → gate`，越权独立 blocker；实际path及语义端点一致。

## TD-T15 — PASS

证据方式：**继承上一轮实看；本轮仅核对双exact SHA**。

候选：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-T15.svg`

SVG SHA256：`513562b55ba2b70282b5c565eb8e8d6bfd0928409ff6e8a7f1a5fd63133574c9`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T15.png`

截图 SHA256：`f953696e1661e009f3dd4a2486124ec5a3def137deb357dc7456bfe48c44b58f`

**原布局P3关闭证据：** state→outcome与ledger→step分别沿左/中列直下；右列用同号01/02引用单独接入Trajectory，03状态迁移沿右列左缘，04动作与观察序列沿右列内部，原跨三列同色交叉消除。三层并列进入同一Human decision，Policy另区写前约束与独立否决。

**正文与语义：** State支撑业务终态，ledger支撑单步，两者共同支撑Trajectory；三层分别向Human decision出结论，未改成先结果再单步的递进审批。Policy→Step写前约束与Policy→Human独立否决均保留；被后端拒绝的refund_order尝试仍记录且失败。缺轨迹/终态UNKNOWN；合法替代路径不被唯一黄金序列错杀。

**视觉结论：** state→outcome与ledger→step分别沿左/中列直下；右列用同号01/02引用单独接入Trajectory，03状态迁移沿右列左缘，04动作与观察序列沿右列内部，原跨三列同色交叉消除。三层并列进入同一Human decision，Policy另区写前约束与独立否决。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

**逐边证据：** 9/9；继承原轮追踪，无缺边或额外语义边。

**正文原文核对：** 3 三层判定各自靠什么观测；5 三层各自判什么、各自漏什么；8 架构、输入契约与可观察证据；9 运行 baseline、故障与修复；11 人工门禁与迁移；15 完成标准与停止条件。

**裁块覆盖（原轮实看，本轮继承）：** 全宽及全部像素行。

| 裁块 | 原图像素行（含首尾） |
|---|---|
| [TD-T15-y0-1199.png](review-course2-crops/TD-T15-y0-1199.png) | 0–1199 |
| [TD-T15-y1060-2259.png](review-course2-crops/TD-T15-y1060-2259.png) | 1060–2259 |
| [TD-T15-y2120-2639.png](review-course2-crops/TD-T15-y2120-2639.png) | 2120–2639 |

**边清单（原轮实看追踪，本轮继承）：**

- 01 / `e0`：`state → outcome`，独立终态读回；实际path及语义端点一致。
- 02 / `e1`：`ledger → step`，逐调用核验；实际path及语义端点一致。
- 03 / `e2`：`state → trajectory`，状态迁移；实际path及语义端点一致。
- 04 / `e3`：`ledger → trajectory`，动作与观察序列；实际path及语义端点一致。
- 05 / `e4`：`policy → step`，写前禁止约束；实际path及语义端点一致。
- 06 / `e5`：`step → human`，单步合法性；实际path及语义端点一致。
- 07 / `e6`：`outcome → human`，业务完成性；实际path及语义端点一致。
- 08 / `e7`：`trajectory → human`，整条路径可接受性；实际path及语义端点一致。
- 09 / `e8`：`policy → human`，任一禁止动作独立否决；实际path及语义端点一致。

## TD-W03 — PASS

证据方式：**继承上一轮实看；本轮仅核对双exact SHA**。

候选：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-W03.svg`

SVG SHA256：`23aadfda3d42f203de2a049ff4c9f3486f94c63eb365ad4af6e0d0c569f5f9e9`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-W03.png`

截图 SHA256：`2cc01f1cd4c843b307234a5bf274f61b7c5bd7f842d26beff589f5006fb0b07b`

**原布局P3关闭证据：** 任务顶栏经01/02左右外侧进入两臂，预算经03/04内部短支路进入两臂；05/06结果向中间Repeated trials汇总，07/08消耗沿两侧到成本卡。结果与成本无串联假边，原输入和中段交叉均消除。A2用同号引用作决策与混杂判定，未表示再次运行。

**正文与语义：** 两臂共享任务、模型、工具、成功Oracle、总Token/时间/调用/重试及可比人工干预与调优投入；不因多角色增加scope。两臂重复结果分别进入配对差值分析，消耗分别进入协作/单位成功成本，blocker/p95/费用不被成功率吞掉。预算不齐或证据不足分别进Confounded/UNKNOWN，配对收益和代价共同支持按切片架构决定；不使用边际CI重叠判断优胜。

**视觉结论：** 任务顶栏经01/02左右外侧进入两臂，预算经03/04内部短支路进入两臂；05/06结果向中间Repeated trials汇总，07/08消耗沿两侧到成本卡。结果与成本无串联假边，原输入和中段交叉均消除。A2用同号引用作决策与混杂判定，未表示再次运行。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

**逐边证据：** 12/12；继承原轮追踪，无缺边或额外语义边。

**正文原文核对：** 3 必须锁定的四项与必须报告的四项；4 架构节点与交付物；5 必须锁定的六项与必须报告的四项；6 这一页的验收口径：同预算下的可重复收益；8 架构、输入契约与可观察证据；9 运行 baseline、故障与修复；11 人工门禁与迁移；12 公平对照复盘：多 Agent 的收益必须可归因；16 完成标准与停止条件。

**裁块覆盖（原轮实看，本轮继承）：** 全宽及全部像素行。

| 裁块 | 原图像素行（含首尾） |
|---|---|
| [TD-W03-y0-1199.png](review-course2-crops/TD-W03-y0-1199.png) | 0–1199 |
| [TD-W03-y1060-2259.png](review-course2-crops/TD-W03-y1060-2259.png) | 1060–2259 |
| [TD-W03-y2120-3319.png](review-course2-crops/TD-W03-y2120-3319.png) | 2120–3319 |
| [TD-W03-y3180-3526.png](review-course2-crops/TD-W03-y3180-3526.png) | 3180–3526 |

**边清单（原轮实看追踪，本轮继承）：**

- 01 / `e0`：`tasks → single`，相同任务与工具；实际path及语义端点一致。
- 02 / `e1`：`tasks → multi`，相同任务与工具；实际path及语义端点一致。
- 03 / `e2`：`budget → single`，相同资源上限；实际path及语义端点一致。
- 04 / `e3`：`budget → multi`，相同资源上限；实际path及语义端点一致。
- 05 / `e4`：`single → trials`，原始重复结果；实际path及语义端点一致。
- 06 / `e5`：`multi → trials`，同任务配对结果；实际path及语义端点一致。
- 07 / `e6`：`single → cost`，消耗与耗时；实际path及语义端点一致。
- 08 / `e7`：`multi → cost`，消耗与协作故障；实际path及语义端点一致。
- 09 / `e8`：`budget → invalid`，实际预算不对齐；实际path及语义端点一致。
- 10 / `e9`：`trials → invalid`，证据不足；实际path及语义端点一致。
- 11 / `e10`：`trials → decision`，配对差值区间；实际path及语义端点一致。
- 12 / `e11`：`cost → decision`，代价与可维护性；实际path及语义端点一致。

## 继承与证据边界

TD-T06、TD-T10、TD-T12、TD-T15、TD-W03 的SVG和截图哈希逐项与返工前JSON相同，正文快照未变，故依用户指令继承。JSON保留原实看时间，另记录本轮哈希验证时间及 `visually_reinspected_this_round=false`，不会把继承写成本轮重看。

A02当前spec、manifest、候选、Chrome重拍记录和新截图哈希已核对；21条边与原轮一致，工具成功/失败回填、授权幂等、独立账本与协议门禁未丢失。任何候选或截图哈希再变化，受影响项须重新审查。真实模型、工具、学习者接受与生产均不由本报告证明。

回读补注：全量 manifest 在并行工作期间发生变化；本组6图的 SVG/spec SHA 均逐项核对未变，实际截图 SHA 也未变，本组结论保持有效。
