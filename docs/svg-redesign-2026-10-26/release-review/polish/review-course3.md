# 六图独立视觉与正文复审

审查时间：2026-10-27T01:48:09.094649+00:00

结论：6/6 PASS；本组六项旧 P3 均关闭，新增 P1/P2/P3 为 0。仅覆盖指定六图，不能据此宣布全部 18 项 P3 清零。未提交、未部署；未修改 SVG、spec、renderer、正式文件或正式 release-review。

实际用 `view_image(detail=original)` 查看 12 张全宽裁块，160px 重叠覆盖全部像素行。共核对 48 条语义边、18 条引用原文；候选与当前 candidate/batch-verification 的 SVG SHA、渲染输入 SHA、截图尺寸一致。历史 docs/batch-verification 是旧轮数据，不用于当前绑定。

| 图 | 结论 | 旧 P3 | 实看像素行（含端点，宽1600px） |
|---|---|---|---|
| TD-B04 | PASS | CLOSED | 0–1439；1280–2197 |
| TD-B05 | PASS | CLOSED | 0–1439；1280–2307 |
| TD-QP01 | PASS | CLOSED | 0–1439；1280–2634 |
| TD-AP01 | PASS | CLOSED | 0–1439；1280–2567 |
| TD-AP02 | PASS | CLOSED | 0–1439；1280–1739 |
| TD-AP03 | PASS | CLOSED | 0–1439；1280–2172 |

## TD-B04

路径：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-B04.svg`
SVG SHA256：`da3c224195aabcb49540a2fbf687ab5114b4cdffc6060eeead1d1c8e17f6f72a`
截图 SHA256：`7952f485ee3e38353bf6f6e6f0d425674011295a3ebec4433fdc1215738870e5`

旧 P3 关闭证据：实看 y684–864：A/B 卡片同高、同宽、同色，左右对称；Locked Dataset/Model 同处上层，分别沿左右外轨约束同一 Harness。两臂各自向 Harness 输入控制条件，没有 A→B 执行边。快照完整成词。

实看：标题、共享控制、两臂与逐题结果层级清楚；7 条边逐条可追踪，底部 raw→paired→有限归因方向明确。无文字遮挡、裁切或关键短语断词。

正文与语义：单模型单数据集下只改变一项协议变量；共享 Harness 不表示先执行 A 再执行 B。原始 A/B 逐题结果落盘后按 case 配对，再以差值与噪声支持有限归因；跨 harness 版本另建基线，不把分辨不出解释为等效。

布局复核：自定义布局仅将控制输入和 A/B 做对称排布；8 个节点和 7 条语义边保持完整。

正文检查范围：架构节点与交付物；五个扰动变量怎么测、往哪个方向偏；先量出协议敏感度，再谈模型差异；完成标准与停止条件。来源 `docs/svg-redesign-2026-10-26/body-sources/course-3.json`，SHA256 `dc88904f97e29a0b3a02eae67e65856d27a91499265b7284275926e1019eb9c8`。

边检查：7 条全部真实存在且有对应箭头；逐边坐标和引用定位见 JSON。

新增 findings：无。

裁块：
- [TD-B04-y0-1439.png](review-course3-crops/TD-B04-y0-1439.png)：x=0，y=0–1439，全宽1600px。
- [TD-B04-y1280-2197.png](review-course3-crops/TD-B04-y1280-2197.png)：x=0，y=1280–2197，全宽1600px。

## TD-B05

路径：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-B05.svg`
SVG SHA256：`d12cedd448cb27bc6e182b5e68c689e3b482ed4996b58a471fe56cf122a2f5a9`
截图 SHA256：`53cda74792e967118b28dcea2716546666e63e44c88b6d1f2f4fdcde92b559b2`

旧 P3 关闭证据：实看 y944–1224：历史可比性橙色虚线从最左审计卡向下，经左外侧转入分类左端；暴露/金丝雀紫线从中部独立落入分类，不确定性从右侧落入。橙线不再穿越 Candidate 审计输入或其他分类入边。

实看：四类审计同层分列，候选下发总线与分类汇入分离；四个分类端口间隔清楚，分类→具名 owner 连续。各卡文字留在边界内，底部停止条件与未知边界可读。

正文与语义：版本兼容、污染暴露、封存泄露与配对不确定性均有独立输入/输出边；并列审计没有相互依赖箭头，不制造一项通过即可跳过其他项的旁路。分类仍共同消费四项证据并交具名 owner；未检出重复不能排除间接泄漏。

布局复核：自定义布局把四类审计改为并列输入，完整保留9条语义边；共享 Candidate 出线是同源分叉，不是审计结果互传。

正文检查范围：三种污染形态的可检出程度差了两个量级；隐藏测试集挡得住过拟合，挡不住训练污染；架构节点与交付物；完成标准与停止条件。来源 `docs/svg-redesign-2026-10-26/body-sources/course-3.json`，SHA256 `dc88904f97e29a0b3a02eae67e65856d27a91499265b7284275926e1019eb9c8`。

边检查：9 条全部真实存在且有对应箭头；逐边坐标和引用定位见 JSON。

新增 findings：无。

裁块：
- [TD-B05-y0-1439.png](review-course3-crops/TD-B05-y0-1439.png)：x=0，y=0–1439，全宽1600px。
- [TD-B05-y1280-2307.png](review-course3-crops/TD-B05-y1280-2307.png)：x=0，y=1280–2307，全宽1600px。

## TD-QP01

路径：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-QP01.svg`
SVG SHA256：`b4bbf7463b86354da482d5c5c929886a0a54866a01bb67d30f7ea2eaf840ccc3`
截图 SHA256：`a579176f90d18293a7ecfe4cf3ebb94627bab7261a14d61da3910c923a821a56`

旧 P3 关闭证据：实看 Basis Gate y832–1102：第一行“批准、冻结、无冲突、”，下一行完整“有权限”，再一行 revision 冻结依据；不再出现“有 / 权限”跨行。

实看：01–07 节点/连线编号清楚，轨道可连续跟到箭头。01 通知进入 Inbox，02 控制回读与03 Jira权威事实分轨，04–07依次进入冻结、候选、具权限批准和执行请求；正文卡片与端口没有遮盖。

正文与语义：Webhook只触发，Jira REST回读当前事实和权限；Basis Gate含批准、冻结、无冲突、有权限四条件。冻结来源包才进入AI，候选必须source_ref，人工按明确范围批准后才进入审计执行请求；冲突、越权、未冻结或缺引用停止下游。没有 webhook→执行旁路。

布局复核：使用编号外轨布局；7条spec边均为真实path。编号指代连线，图中没有把同号引用当作多次执行，也没有新增业务节点。

正文检查范围：架构节点与交付物；从需求事件到可执行方案的四道关卡；SOP：回读、校验、生成、评审、冻结；完成标准与停止条件。来源 `docs/svg-redesign-2026-10-26/body-sources/course-3.json`，SHA256 `dc88904f97e29a0b3a02eae67e65856d27a91499265b7284275926e1019eb9c8`。

边检查：7 条全部真实存在且有对应箭头；逐边坐标和引用定位见 JSON。

新增 findings：无。

裁块：
- [TD-QP01-y0-1439.png](review-course3-crops/TD-QP01-y0-1439.png)：x=0，y=0–1439，全宽1600px。
- [TD-QP01-y1280-2634.png](review-course3-crops/TD-QP01-y1280-2634.png)：x=0，y=1280–2634，全宽1600px。

## TD-AP01

路径：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-AP01.svg`
SVG SHA256：`b36933affbb5f0aa9e9a61e5dc4c53fb48505c6146243bf09fc4f031b2c35b61`
截图 SHA256：`1cf9aea24008a8f32082b7b114cf8cb30118dec00700d3b278b0b2c484706324`

旧 P3 关闭证据：实看 y914–1744：三个切片的紫色证据分别进入 Oracle 顶部独立端口；Oracle 向下以橙色控制线绑定 workload 成功定义；workload 再向下送带 hash 合同到检查。样本分布蓝线沿最左外缘直接接 workload 左侧，不穿 Oracle 或检查输入。

实看：三类切片同层，Oracle→workload→检查垂直排列；样本分布长线虽绕外侧，但连续、无交叉，标签靠近其终点。标题、节点、正文和交付区域清楚。

正文与语义：保留 eligible/excluded、退款账本与幂等、查询引用不足可转人工、转人工合法终态由owner定义。三切片共同提供Oracle证据，样本分布和成功定义分别输入workload，hash变化即新合同；缺Oracle不得纳入成功率，fixture不外推生产容量。

布局复核：自定义布局完整保留7节点9边，改变空间位置而未改变退款/查询/转人工的并列切片关系；未新增Oracle绕过路径。

正文检查范围：架构节点与交付物；建 workload 时必须分开建模的六个变量；AP01 Project lab：从业务样本生成负载契约；AP01 验收标准。来源 `docs/svg-redesign-2026-10-26/body-sources/course-3.json`，SHA256 `dc88904f97e29a0b3a02eae67e65856d27a91499265b7284275926e1019eb9c8`。

边检查：9 条全部真实存在且有对应箭头；逐边坐标和引用定位见 JSON。

新增 findings：无。

裁块：
- [TD-AP01-y0-1439.png](review-course3-crops/TD-AP01-y0-1439.png)：x=0，y=0–1439，全宽1600px。
- [TD-AP01-y1280-2567.png](review-course3-crops/TD-AP01-y1280-2567.png)：x=0，y=1280–2567，全宽1600px。

## TD-AP02

路径：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-AP02.svg`
SVG SHA256：`295d8b6f151805d7e6c4c61acc293ba9a623bb3235c802986ba4c8ee9f39ac1e`
截图 SHA256：`4439c624ef89569799480133edf5d5669a94dda8651747fc53690e7bb770dd2e`

旧 P3 关闭证据：实看 Task Goodput Gate y875–1065：“同时检查质量、成本、”后整词“副作用”占下一行；无“副 / 作用”或孤字“用”。

实看：阶段观测紫线从队列分到模型/工具，模型/工具/retry分别汇入关键路径，末端橙色预算线进入Goodput。关键路径附近三路可辨，无相互交叉或文本压线；正文与底部边界完整。

正文与语义：以计划到达时间为起点，queue/model/tool/retry分列证据；模型卡保留TTFT/TPOT，重叠阶段不重复计时，缺等待UNKNOWN。Goodput按达标完成任务/时间，同时受质量、成本、副作用约束；QPS升而good-task降阻断。

布局复核：当前使用证据谱系曲线布局而非本组自定义plans；7节点7边未新增先后承诺，分支是阶段观测证据，非要求模型与工具串行。

正文检查范围：一个端到端时长说明不了任何事，因为它不是各 span 的算术和；架构节点与交付物；AP02 Project lab：阶段预算驱动的优化决策；AP02 最终练习：从指标卡做一次决策。来源 `docs/svg-redesign-2026-10-26/body-sources/course-3.json`，SHA256 `dc88904f97e29a0b3a02eae67e65856d27a91499265b7284275926e1019eb9c8`。

边检查：7 条全部真实存在且有对应箭头；逐边坐标和引用定位见 JSON。

新增 findings：无。

裁块：
- [TD-AP02-y0-1439.png](review-course3-crops/TD-AP02-y0-1439.png)：x=0，y=0–1439，全宽1600px。
- [TD-AP02-y1280-1739.png](review-course3-crops/TD-AP02-y1280-1739.png)：x=0，y=1280–1739，全宽1600px。

## TD-AP03

路径：`output/svg-release-20261027-polish/candidate/public/visuals/course/TD-AP03.svg`
SVG SHA256：`3812df21dcc9e8bc348b6b016cfff6c3b53171df0ab91c71c1a6fe7253139973`
截图 SHA256：`3df0022c808cd4e0dd75e3c288b5a0513c78d98361bca7eec1badbc71f211382`

旧 P3 关闭证据：实看 y544–1444：root 下方用同源横向分叉总线分别指向三个子span和根上的终态事件；ledger紫线自右侧外缘下行，单独从审计右侧进入，不穿父子总线或四路审计输入。四路证据从左至右依次转入审计顶部，互不交叉。

实看：root与ledger同层分开，三个子span与finalize事件同层且边标签区分“子span”和“根上的终态事件”。独立对账端口与四个顶部审计端口可辨；标题明确边表示归属与核对，未画成步骤序列。

正文与语义：root→queue/generation/attempt仅表示归属；root→terminal明确为根上的事件，非第四个子span。没有queue→generation→attempt→terminal调用顺序边。ledger不从root生成、无root→ledger边，与tool尝试数独立对账；terminal缺失UNKNOWN，账本不一致先修writer/collector，不伪造parent或删失败span。

布局复核：自定义布局采用同源总线；每条语义边仍有独立path/edge-id。总线共线不代表子节点互为父子，更不代表执行先后。终态事件与span按边标签区别；ledger保持独立审计证据源。

正文检查范围：架构节点与交付物；AP03 Project lab：Trace 闭包与重放审计；AP03 最终练习：修复一条断链 Trace；AP03 验收标准。来源 `docs/svg-redesign-2026-10-26/body-sources/course-3.json`，SHA256 `dc88904f97e29a0b3a02eae67e65856d27a91499265b7284275926e1019eb9c8`。

边检查：9 条全部真实存在且有对应箭头；逐边坐标和引用定位见 JSON。

新增 findings：无。

裁块：
- [TD-AP03-y0-1439.png](review-course3-crops/TD-AP03-y0-1439.png)：x=0，y=0–1439，全宽1600px。
- [TD-AP03-y1280-2172.png](review-course3-crops/TD-AP03-y1280-2172.png)：x=0，y=1280–2172，全宽1600px。

## 证据边界

本报告是指定六张候选 SVG 的视觉与正文概念复核，不是全站正文重写或全量业务门禁验收。允许保留正文细节多于总览图的情况；检查重点是关键关系、准入条件、判据与停止动作不被遗漏或画反。本次未发现改变原意的缺项。Chrome几何和语义闭包PASS仅作辅助；真实模型、企业集成、从业者/学习者接受、生产证据仍依各页NOT_RUN边界。其余图的审查及全部18项P3的最终汇总由主审独立完成。
