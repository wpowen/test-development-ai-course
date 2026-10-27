# course-3 第二轮独立内容与视觉复审

审阅者：Feynman — 独立内容与视觉复审。范围 27 张；25 PASS / 2 REWORK。

全部当前截图经view_image实际查看；逐项按fresh inputs/sourceRefs核对实际正文或正文快照，复核首轮缺陷。Chrome几何/路由闭包仅作辅助，未据其PASS替代目检。长图长度本身不作为阻断。只评审隔离candidate，未以public旧图作为待审版本。

大多数rail图已把控制、证据、反馈分轨，23px正文与18px端口仍可读；较TD-M04疏长但有明确阅读规则。B02与AP07的紧凑曲线版仍保留核心同色交点，形成实际追踪障碍。模块图保持清楚的学习路线和一致层级。

P1/P2 阻断替换和部署；P3 不阻断。首轮报告保留于 round-1，以下结论均来自本轮实际查看。

| ID | 结论 | 当前发现 |
| --- | --- | --- |
| TD-X601 | PASS | 无当前缺陷 |
| TD-T20 | PASS | 无当前缺陷 |
| TD-T21 | PASS | 无当前缺陷 |
| TD-T22 | PASS | 无当前缺陷 |
| TD-T23 | PASS | 无当前缺陷 |
| TD-T24 | PASS | 无当前缺陷 |
| TD-X805 | PASS | 无当前缺陷 |
| TD-B01 | PASS | 无当前缺陷 |
| TD-B02 | REWORK | P2 采样四分支与审计汇聚仍在集合间同色交叉、贴行，核心职责关系难以连续追踪。 |
| TD-B03 | PASS | 无当前缺陷 |
| TD-B04 | PASS | P3 A/B同级实验臂仍分处不同行，比较布局不够直接。 |
| TD-B05 | PASS | P3 历史兼容性长线仍穿过审计输入，局部线路不够利落。 |
| TD-B06 | PASS | 无当前缺陷 |
| TD-QP01 | PASS | P3 Basis Gate的权限词组仍被拆行。 |
| TD-QP02 | PASS | 无当前缺陷 |
| TD-QP03 | PASS | 无当前缺陷 |
| TD-QP04 | PASS | 无当前缺陷 |
| TD-T25 | PASS | 无当前缺陷 |
| TD-C01 | PASS | 无当前缺陷 |
| TD-AP01 | PASS | P3 Oracle邻近区域仍有异色输入交叉，可进一步简化。 |
| TD-AP02 | PASS | P3 Goodput约束中的“副作用”仍跨行断词。 |
| TD-AP03 | PASS | P3 根分支与独立对账线仍有交叉，树形层次可更简洁。 |
| TD-AP04 | PASS | 无当前缺陷 |
| TD-AP05 | PASS | 无当前缺陷 |
| TD-AP06 | PASS | 无当前缺陷 |
| TD-AP07 | REWORK | P2 趋势→泄漏和快照→平台两条同色证据线仍相交并贴行，平台/泄漏的核心条件归属不清。 |
| TD-AP08 | PASS | 无当前缺陷 |

## TD-X601 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-X601.svg`

SVG SHA-256：`7da4276901ff02ebc3a28abeb21af53262c1c2759c400451d6c98ff807f18bc2`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-X601.png`

PNG SHA-256：`6559f49d1134ff637281f6ffccb8be6104a4933493558b069c743dc24b3e2908`

正文核对：已核对伤害模型、合法切片、分母和区间、最坏组 blocker、独立人工复核及具名风险接受；平均分不得抵消严重伤害，fixture 不作公平证明。

视觉核对：两条独立证据链及红线均可辨；底部回流有少量交点，颜色、条件和终点仍能连续追踪。

实际查看范围：1600×1685；y=0..1684；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-X601 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-X601 / 完成标准与停止条件。

## TD-T20 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T20.svg`

SVG SHA-256：`4a8553d5c1b8487c597688937f72ff76303f0ffd1283df41a24305339a389ed8`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T20.png`

PNG SHA-256：`a555195aa86255023b71caea7c86e8af183d241da40234975a97af2d0a658153`

正文核对：逐一核对 PR/主干/夜间/发布的四层触发、各自产物、Artifact 绑定与失败关闭；不把工具运行成功当门禁有效。

视觉核对：编号01–04触发和05–08证据分别走轨；桥线说明明确，四层虽分行仍能逐路匹配，原中央穿插阻断已消除。

实际查看范围：1600×2656；y=0..1549 / y=1430..2655；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T20 / CI 里有评测但从不阻断，等于把评测做成了一份日报。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T20 / 架构节点与交付物。

首轮问题 resolved=true：四层证据汇聚与触发线混在同一中央走廊，主线难以连续追踪。 触发01–04与汇聚05–08已分轨并编号，实看能逐条匹配；不再挤在中央走廊。

## TD-T21 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T21.svg`

SVG SHA-256：`eb40afad0f10cf9de1e79c428aadf5e160cc36e6c61248e21449c146c10b9fdf`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T21.png`

PNG SHA-256：`bcf76206a5c821d4cbd68aa024d1f2b92dd5e86508d1669bad7c53a0cb040eae`

正文核对：六类冻结输入均进入 Manifest；版本与 hash、receipt、来源和复跑边界齐全，未把模型名当完整版本。

视觉核对：六路紫色轨道及端口可按编号配对；Manifest 顶部较密但没有混接或无法辨认的落点。

实际查看范围：1600×2817；y=0..1549 / y=1430..2816；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T21 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T21 / 七要素各自记录什么、记在哪。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T21 / 架构节点与交付物。

首轮问题 resolved=true：六路同色证据汇聚的局部弯线不够简洁。 六输入各有编号和独立轨道，旧弯线交叉不再需要猜测连接。

## TD-T22 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T22.svg`

SVG SHA-256：`657198cd207199c43452ff4d2b404b679fac51f108f1dc87ec5a7ee4b2f87901`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T22.png`

PNG SHA-256：`d52e50d9f8de68b850ce8188512a8fc26de31d916b44abac0320074548420889`

正文核对：核对最小原始故障、字段分类/脱敏、保留预期、CI重放与同一故障红绿证据；修复不能篡改Oracle。

视觉核对：差异、回绿已完整排入行内；分类、故障证据、修复和重放的线路分开，阅读顺序明确。

实际查看范围：1600×2586；y=0..1549 / y=1430..2585；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T22 / Trace-to-Regression 实操：从一条事故到稳定回归。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T22 / 回灌六步与各自的产出。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T22 / 架构节点与交付物。

首轮问题 resolved=true：节点正文出现单字尾行，降低排版精致程度。 当前“差异”“回绿”均完整成词排入行内。

## TD-T23 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T23.svg`

SVG SHA-256：`26ab112e2d51a34e822c4cffd5139766cf8015df89ccbabb22a059934a6b6aa0`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T23.png`

PNG SHA-256：`b3a815ac768a776e3187c440c46d0327a5faacc2e487478ac899580fe9e5fe24`

正文核对：同一 workload 的质量、延迟、成本独立约束后才做 Pareto 与具名选择；没有虚构实测收益。

视觉核对：三个门槛与后续决策分区清楚，卡片正文可读，汇入点和失败条件可辨。

实际查看范围：1600×1822；y=0..1821；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T23 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T23 / 三个维度各自的判据与它们的冲突点。

## TD-T24 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T24.svg`

SVG SHA-256：`90c70af0a1ee637c52492799f727c7e487d8a01843bf147df85b516406c421ea`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T24.png`

PNG SHA-256：`cdf7ec92f62f77da52a46b2da367c3c939a11b3679d569961ab055a9cf84626d`

正文核对：核对基线版本、豁免到期、冻结条件、完整Manifest回滚、恢复证据与回归关闭；恢复不是删掉原失败。

视觉核对：绿色复基线回流走外围，红橙决策线分离；Closure 无原先孤立尾字。

实际查看范围：1600×2747；y=0..1549 / y=1430..2746；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T24 / 漂移诊断复盘：Waiver 必须可到期、可回滚。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T24 / 漂移诊断复盘：Waiver 必须可到期、可回滚。

首轮问题 resolved=true：复基线反馈线穿过下层决策线，且 Closure 卡片有单字尾行。 绿色Closure反馈改走外侧；恢复证据不再以单字独占尾行。

## TD-X805 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-X805.svg`

SVG SHA-256：`8b050e37aca7f7bb8dc59307b27c411d77120120fd839b5391439d4b26089378`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-X805.png`

PNG SHA-256：`b611dc4e8a6d432d5e9633fabdb87111069451098b9debf23cc4f3bf4bc29dd4`

正文核对：稳定用户分配、实验准入、护栏、人工证据、具名裁决及下一轮回灌齐全；未以总体收益掩盖风险。

视觉核对：06/07输入决策及08回流端口能独立追踪；编号、颜色和外轨把实验与反馈区分开。

实际查看范围：1600×2917；y=0..1549 / y=1430..2916；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-X805 / 灰度如果没有预设的回滚触发条件，它只是把事故推迟了几小时。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-X805 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-X805 / 架构节点与交付物。

## TD-B01 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B01.svg`

SVG SHA-256：`bdb2c27471bcb46a5c9f34eaf8deb986d05d1ed988b34282b63bd7dafdf63d44`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-B01.png`

PNG SHA-256：`97ebfe546bf1b458e67fd91891c92d6537c95d925e1890f712f3618f6c630e6b`

正文核对：核对任务、数据、协议、Harness、Scorer、Aggregation、Report七段及元数据绑定、业务距离和逐题证据；分数依赖版本合同。

视觉核对：核心链连续；任务/协议到报告的07/08元数据长线已移到外轨，业务距离标签不再借位。

实际查看范围：1600×2534；y=0..1549 / y=1430..2533；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B01 / 一个分数是七个组件的函数，报告里通常只写了一个。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B01 / 一个分数是七个组件的函数，报告里通常只写了一个。

首轮问题 resolved=true：两条直接到报告的长程证据线打断了核心实验流水线。 任务/协议元数据07/08已走外轨，业务距离标签归属清楚，核心七段主线连续。

## TD-B02 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B02.svg`

SVG SHA-256：`5754ee8c2d8098eaeb9c0277132cba0569f4293d61279a8d1646f83d93557a3b`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-B02.png`

PNG SHA-256：`10356063d89244a733a228d634d9aeb463c7d827efb5c734a522fc457061814b`

正文核对：四类数据的代表性、边界风险、历史回归与封存验收职责均与正文一致；回归集只增不改且不用于调优，holdout开封合同不保证无偏。

视觉核对：节点与正文可读，但采样分流及审计汇聚仍在两排集合间同色交叉、贴行，关键四分支不能顺畅追踪，维持REWORK。

实际查看范围：1600×1843；y=0..1842；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B02 / 一份数据集回答不了两个方向相反的问题。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B02 / 四种角色的更新纪律与失效方式。

- P2：采样四分支与审计汇聚仍在集合间同色交叉、贴行，核心职责关系难以连续追踪。
  证据：当前A区采样/去重卡下方，通往Regression的蓝色长弧横切其余蓝色分支；Representative与Challenge下方到访问审计上方的走廊内，采样→Sealed Holdout的蓝色回弯穿过Representative→审计及Regression→审计紫线，紫色审计输入又在“重采与版本 / 来源与更新纪律”附近交叉。四种同级角色虽然已文字声明为并列，仍需跨多个无编号/无跨线桥的交点追踪。
  建议：把采样输入和审计输出分到两侧独立走廊；四集合可保持2×2，但每个集合分配独立入/出端口，避免蓝色长弧与紫色审计汇聚共用中间窄带。修复后重渲染并复看该区。

首轮问题 resolved=false：四种并列数据角色被拆成两层，采样分流与审计汇聚在中间交错。 仅部分改善：四角色已声明并列，但采样蓝线及审计紫线仍交错，见本轮P2。

## TD-B03 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B03.svg`

SVG SHA-256：`5c12ab006c9eea4d6f7f09be08fffef5dff39a6e0b98393c8b8a18341d7818c8`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-B03.png`

PNG SHA-256：`0767d3ecd5ea6121444382bee9aec81c9e721851c8db2b23bd9183ea475c8338`

正文核对：核对逐题ledger、两种Oracle输入、指标分母、pass@k/pass^k、聚类区间与元评估边界；未混淆至少一次成功与连续可靠。

视觉核对：两路判据与计算器端口可辨；分别定义、可查的孤字尾行已修复。

实际查看范围：1600×2642；y=0..1549 / y=1430..2641；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B03 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B03 / 指标的分母决定了它在回答什么。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B03 / 完成标准与停止条件。

首轮问题 resolved=true：指标卡片的自动断行割裂定义短语。 分别定义与可查的单字尾行已消除；两种指标口径仍完整。

## TD-B04 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B04.svg`

SVG SHA-256：`87ffa786514166cd8537bc7ec53f4e310be0bc93ecec9a809d5c36796d90fcff`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-B04.png`

PNG SHA-256：`73447f4cbccf6539b050d86237d2604eff8abc540a0bff982dbd81de757e079d`

正文核对：锁定模型和数据，只改变单一Harness因素；A/B共同执行、逐题差分、配对不确定性和结论范围均有正文支持。

视觉核对：新外轨使A/B输入与证据可追踪，快照已完整；两臂仍在不同行，保留非阻断的对称布局建议。

实际查看范围：1600×2827；y=0..1549 / y=1430..2826；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B04 / 五个扰动变量怎么测、往哪个方向偏。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B04 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B04 / 先量出协议敏感度，再谈模型差异。

- P3：A/B同级实验臂仍分处不同行，比较布局不够直接。
  证据：新图Variant A在上层中部，Variant B在下一层左侧；线路可按编号追踪，但识别对照关系仍依赖文字而非空间对称。原“快照”孤字已修复。
  建议：后续可将A/B做成同层对称两列，共享模型和数据控制居上。

首轮问题 resolved=false：A/B 并列实验条件在空间上缺少对称性。 部分修复：快照断词已消除；A/B仍不在同一水平层，保留P3。

## TD-B05 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B05.svg`

SVG SHA-256：`b9044db11c2b29a8fe581b8dbd7cf0559088d0de21a7920acfa9c4718611aa10`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-B05.png`

PNG SHA-256：`490510bb3f8b14f03631d918139552cd28f5966c70ac4bacac540239922ddec0`

正文核对：污染重叠审计、密封canary、配对不确定性、历史版本兼容与可信度分类一致；没有把检测不到重叠写成已证无污染。

视觉核对：历史兼容橙线仍穿过部分蓝/紫线，但颜色及标签分离、目标明确，属于局部精致度问题。

实际查看范围：1600×1867；y=0..1866；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B05 / 三种污染形态的可检出程度差了两个量级。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B05 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B05 / 隐藏测试集挡得住过拟合，挡不住训练污染。

- P3：历史兼容性长线仍穿过审计输入，局部线路不够利落。
  证据：Version Compatibility到可信度分类的橙线仍穿过Candidate到Paired Uncertainty的蓝线并靠近分类紫线；颜色、标签及目标仍可辨，未形成核心关系歧义。
  建议：把历史兼容性长线移到外侧独立走廊或缩短接入分类的支线。

首轮问题 resolved=false：历史可比性长线穿过两条审计输入线，局部不够利落。 历史兼容性橙线仍穿过审计输入，保留P3而非阻断。

## TD-B06 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-B06.svg`

SVG SHA-256：`6c46d7643e8d6d50f55d71713ef4b44c7af21a40180901b9acf7a00484cba814`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-B06.png`

PNG SHA-256：`8095a54abdb86c3abcccd351c62c9c5ad77f595f1c0f10f931a0296411f62d58`

正文核对：内部业务风险、Dataset、Adapter、Scorer、版本报告与owner维护闭环一致；公开方法只能迁移方法，内部员工基线和独立blocker保留。

视觉核对：公共方法控制轨已移出内部执行区，报告和09维护反馈分开；旧控制线贯穿问题已修复。

实际查看范围：1600×2695；y=0..1549 / y=1430..2694；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B06 / 六项里哪些能从公共基准搬过来，哪些必须自建。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B06 / 公共 Benchmark 迁移复盘：结构可借鉴，结论不能照搬。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-B06 / 架构节点与交付物。

首轮问题 resolved=true：公共方法控制线贯穿内部输入链，反馈与报告证据再次交叉。 外部公共方法控制与内部执行链已分轨，09反馈也有独立走廊。

## TD-QP01 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-QP01.svg`

SVG SHA-256：`fca008cd6734d98d92832b8cddcf823a4b38bb14b15dd8a284d27206bb9e6a29`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-QP01.png`

PNG SHA-256：`50ddb4c4cfd73765c9ac874d14b01d24e8b071040e06748d64a689ac2243a355`

正文核对：需求事件的授权、冻结、冲突、source_ref及正文可访问性均需检查；无正文引用不得由摘要替代，失败不得准入。

视觉核对：来源和Basis Gate路径清楚，控制与证据分轨；有权限词组仍被跨行切开，留P3排版建议。

实际查看范围：1600×2635；y=0..1549 / y=1430..2634；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP01 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP01 / 从需求事件到可执行方案的四道关卡。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP01 / 架构节点与交付物。

- P3：Basis Gate的权限词组仍被拆行。
  证据：当前Basis Gate准入正文一行以“有”结尾，下一行从“权限”起；含义能读出，但关键准入词组被割裂。
  建议：按批准、冻结、无冲突、有权限等完整条件主动换行。

首轮问题 resolved=false：关键准入条件的断行不够整齐。 部分改善：不再孤立“限”，但当前“有 / 权限”仍跨行，保留P3。

## TD-QP02 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-QP02.svg`

SVG SHA-256：`bdbb5751c6a54379a93908f6ac60493b2c495c5abae6049093adc618d2ad3e95`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-QP02.png`

PNG SHA-256：`dbd32dcf6372f8febd0d645b2bd0ce6f1b9905797104d7b0b4a9ec86a29dc8dd`

正文核对：当前HEAD SHA、事件幂等、Artifact摘要、status/TTL和最终Gate fail-closed与正文一致；旧SHA或过期证据不能绿灯。

视觉核对：01/05/08绑定轨与流水线分离，HEAD和聚合器控制线不再形成旧同色X，最终状态落点清楚。

实际查看范围：1600×2867；y=0..1549 / y=1430..2866；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP02 / 旧 SHA 的绿色 Pipeline 不能放行当前 MR。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP02 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP02 / 证据聚合必须回答的四个问题。

首轮问题 resolved=true：HEAD 控制线穿越证据链，且与聚合结论线同色相交。 HEAD绑定及聚合器输出改为独立编号轨，旧同色X已消除。

## TD-QP03 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-QP03.svg`

SVG SHA-256：`29ed23e4cedbffae656bf80f9803a3a40809a881af1cb1b9026985456e0eeb35`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-QP03.png`

PNG SHA-256：`6f0e0395114ed580d0df5536d0f9c8d2f3391bda9a1aa8a9977d75d393409a7c`

正文核对：核对请求、Provisioner、身份/RBAC、Quota、Runner、TTL、Cleanup和Audit；环境串号与回收缺证据不得通过，真实集成保持NOT_RUN。

视觉核对：生命周期主链、07 TTL与08/09审计外轨可分开阅读；ServiceAccount 不再从词中间断裂。

实际查看范围：1600×2851；y=0..1549 / y=1430..2850；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP03 / 临时环境必须配齐的五项。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP03 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP03 / 临时环境必须配齐的五项。

首轮问题 resolved=true：环境生命周期、准入和审计线路混用中央走廊。 生命周期、TTL、审计线分开；ServiceAccount完整单词显示。

首轮问题 resolved=true：技术标识符被从单词中间截断。 生命周期、TTL、审计线分开；ServiceAccount完整单词显示。

## TD-QP04 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-QP04.svg`

SVG SHA-256：`464ed176783465c179d7d6d1d38052cb8c69dce20dc4ad00e63eeebf9aec8599`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-QP04.png`

PNG SHA-256：`188eaa1be8c81178e67ac27919b1bca63d22a37151c0406a02fc659a3d16e83f`

正文核对：Inbox去重、状态机、Outbox及处理同事务、适配器副作用幂等/回读、DLQ和补偿闭环一致；没有承诺外部exactly-once，真实集成NOT_RUN。

视觉核对：04请求、05回执与10补偿为不同通道和端口；原双向共线问题已消除，边方向可逐条确认。

实际查看范围：1600×2791；y=0..1549 / y=1430..2790；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP04 / 重复事件与部分成功需要两本账。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP04 / 重复事件与部分成功需要两本账。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-QP04 / 架构节点与交付物。

首轮问题 resolved=true：状态机请求与适配器回执两条相反方向的线完全共线，无法独立阅读。 04橙请求、05绿回执为不同通道，10补偿另走轨道；原相反方向共线已消除。

## TD-T25 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-T25.svg`

SVG SHA-256：`b15b6f9c7e17d246ef68bd8b0c7fff4c8d744ab9643a63f925dabc52bda0b1f8`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T25.png`

PNG SHA-256：`adf76e36bd060ff5d5c7d40e06e61e5a47a039820cc0abd376b7f4f731639007`

正文核对：PRD/风险、独立分层Oracle、CI红绿证据、具名owner到Fixture RC链齐全；RC不冒充已部署结果。

视觉核对：需求追踪08走外围，Oracle→CI不再被长斜线切穿；底部故障和交付区层次清楚。

实际查看范围：1600×2669；y=0..1549 / y=1430..2668；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T25 / 一个可复核的 RC 必须包含的六类工件。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T25 / Capstone 复盘：用一条追踪链证明交付边界。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-T25 / Capstone 复盘：用一条追踪链证明交付边界。

首轮问题 resolved=true：风险到 RC 的长斜线切过 Oracle→CI 控制线。 08需求追踪改走外围；分层已完整，负责人不再孤立末字成行。

## TD-C01 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-C01.svg`

SVG SHA-256：`69b2305e12bc7939ac179fc0e359bc9d87f280ec3fde0c2aab35b24d188d4abf`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-C01.png`

PNG SHA-256：`164844d795e61cbbdcf7fbcc9d3d8e2a323be3376d218a4ef5ebb7c70992af23`

正文核对：五类能力缺口、90天工件、作品集、独立复评与反馈一致；未把练习证据写成招聘/晋升承诺。

视觉核对：缺口、任务、证据和06回流路径明确，文字层级与留白适中。

实际查看范围：1600×2544；y=0..1549 / y=1430..2543；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-C01 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-C01 / 能力迁移最常见的失败，是把「学过」当成「能证明」。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-C01 / 架构节点与交付物。

## TD-AP01 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP01.svg`

SVG SHA-256：`8dddb7818b82db6044a9d7d3223382c6ec36c2f2456c400e9f0937b198e54c2e`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AP01.png`

PNG SHA-256：`57b696f34f22cede1bdd89769af91a8207049652247c8bb9e3dc638bdef374db`

正文核对：业务切片、样本分布、Oracle、workload hash合同、压测前提与验收一致；转人工不是成功终态，synthetic证据不升级生产能力。

视觉核对：workload上行合同与下行验收已分走廊，标签不再落在样本分层线上；Oracle附近仍有少量异色交叉，保留P3。

实际查看范围：1600×1708；y=0..1707；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP01 / AP01 Project lab：从业务样本生成负载契约。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP01 / AP01 验收标准。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP01 / 建 workload 时必须分开建模的六个变量。

- P3：Oracle邻近区域仍有异色输入交叉，可进一步简化。
  证据：压测前提检查的紫色输入与Oracle附近的橙色绑定线仍有局部交叉；当前已分出上下行走廊且标签归属清楚，原P2不再成立。
  建议：后续将Oracle与样本分层合并为同层输入，减少局部曲线穿插。

首轮问题 resolved=true：workload 的上行绑定与下行验收线挤在同一走廊，标签还落在另一条分层线上。 上行Oracle绑定与下行workload验收已分开，hash合同标签归属正确；余下局部异色交叉降为P3。

## TD-AP02 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP02.svg`

SVG SHA-256：`9b6a2452616b59faad0a05e1c0f1d90d0c7e220ba9a782f421dd56f5a3e7b2c2`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AP02.png`

PNG SHA-256：`3201eedb4924c42681119c9713f2ac21f007ca1a9eee71d12090cec65b58a974`

正文核对：任务/步骤/调用指标、关键路径、排队、模型、工具与重试口径及goodput约束一致；并发span不能简单相加，真实运行未知边界保留。

视觉核对：层级与连接可追踪，副作用已不再以单个用字独占尾行；词组仍可进一步整行排版。

实际查看范围：1600×1740；y=0..1739；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP02 / 一个端到端时长说明不了任何事，因为它不是各 span 的算术和。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP02 / AP02 Project lab：阶段预算驱动的优化决策。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP02 / AP02 最终练习：从指标卡做一次决策。

- P3：Goodput约束中的“副作用”仍跨行断词。
  证据：当前Task Goodput Gate正文一行以“副”结尾，下一行以“作用”开头；旧单字“用”尾行已消除，约束含义仍可读。
  建议：把质量、成本、副作用按完整词组换行。

首轮问题 resolved=true：Goodput 卡片正文存在单字尾行。 旧单字“用”尾行已消除；仍有“副 / 作用”断词，作为本轮P3继续建议。

## TD-AP03 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP03.svg`

SVG SHA-256：`24854bec89eb757e4067faa9cfed587ddcacc7ada6dc51ccfc32ff3321396f0d`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AP03.png`

PNG SHA-256：`50c337c8ff3cc2fd35291676d8b08ce3dd65ad2783bfcf4c8699a6d08da0b406`

正文核对：Task Root、队列/模型/工具attempt、terminal事件和独立副作用ledger对账一致；父子关系、终态唯一性和隐私边界均保留。

视觉核对：根分支及审计交点仍存在，但根节点同父关系和异色对账可辨；保留P3减少交叉建议。

实际查看范围：1600×1723；y=0..1722；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP03 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP03 / AP03 Project lab：Trace 闭包与重放审计。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP03 / AP03 最终练习：修复一条断链 Trace。

- P3：根分支与独立对账线仍有交叉，树形层次可更简洁。
  证据：Task Root的蓝色父子分支在根下方交叉，ledger到审计的紫线仍穿过蓝色归属线；同父关系、颜色和终点足以区分，没有误接证据。
  建议：根节点对子span采用分叉总线，ledger与审计移到同一侧。

首轮问题 resolved=false：父子归属线与独立对账线发生交叉。 根分支与ledger审计交叉仍存在但可辨，保留P3。

## TD-AP04 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP04.svg`

SVG SHA-256：`4a5677f7066be916ae048a0fa0c52d65d2fdc522de9c9f043f8db51674aaa990`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AP04.png`

PNG SHA-256：`7a8c857ff3900178b69769034043ace0a5e6c829452f5ede9328677db1e9689d`

正文核对：同合同的Closed/Open对照、scheduled/sent时钟、Coordinated Omission、背压/拒绝及fixture观测一致；未把两臂当同时叠加负载。

视觉核对：01/02合同、03/04实验和05/06时钟各有编号轨道；两臂虽分行但可独立追踪，旧关键穿插已修复。

实际查看范围：1600×3036；y=0..1549 / y=1430..2979 / y=2860..3035；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP04 / 架构节点与交付物。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP04 / AP04 验收标准。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP04 / AP04 Project lab：open/closed 到达时钟对账。

首轮问题 resolved=true：对照实验没有形成两条清晰的并列阅读路径。 两臂合同、实验、时钟均有独立编号轨和端口，旧关键路径穿插已消除。

## TD-AP05 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP05.svg`

SVG SHA-256：`61f1a7511b7c4e8f847b0987b592268d8e02395e6b296e5447e1311480b41554`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AP05.png`

PNG SHA-256：`f7972265470e6ddec6c297337d5ee70edbff91f6e9b30f078ff8747cbf1bfc72`

正文核对：首失败前稳定台阶形成容量结论，观测信号仅支持瓶颈候选且需反证复跑；SLO/Oracle与合成负载边界齐全。

视觉核对：容量04和瓶颈05走不同外轨，首失败下方不再同色交叉；07复跑反馈可辨。

实际查看范围：1600×2611；y=0..1549 / y=1430..2610；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP05 / 先理解系统边界与假绿。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP05 / AP05 验收标准。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP05 / AP05 Project lab：SLO 阶梯容量卡。

首轮问题 resolved=true：容量结论与瓶颈归因两条同色证据线在关键失败节点下相交。 04容量与05瓶颈证据不再同色交叉，复跑07独立回流。

## TD-AP06 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP06.svg`

SVG SHA-256：`cc30125a6affa3d1a864eb820a3f59603d4035472e14bc3c6267faca94c5351d`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AP06.png`

PNG SHA-256：`c60a01f11ade5fc0b016fdcfc5926220e15274f914f01e6b58f323eaac686962`

正文核对：共享预算、有限重试、Retry-After、未知写对账与安全终态一致；不可幂等副作用不能盲重试，预算耗尽必须停止。

视觉核对：03/04/05三个出口和06预算回扣已分开，条件标签与端口对应，原中央穿插消除。

实际查看范围：1600×2942；y=0..1549 / y=1430..2941；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP06 / 跨层重试会把一次抖动放大成事故。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP06 / AP06 Project lab：重试预算与副作用账本。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP06 / AP06 最终练习：拒绝危险重试。

首轮问题 resolved=true：重试闸门的长程分支与分类线/预算反馈交错，版面可进一步简化。 03重试、04未知写、05安全终态和06预算回扣已分轨。

## TD-AP07 — REWORK

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP07.svg`

SVG SHA-256：`1896b09a07445205b56d3da54910a65d46a5fd499449e9a125a7c2b908675c06`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AP07.png`

PNG SHA-256：`b184e6b2837e8bc095d63fc460cb5046170e0115e64be5ac649bea38e2ce69de`

正文核对：不变版本/负载、热身稳态恢复窗口、斜率区间、首中尾快照与cleanup联合支持候选；平台不直接判无泄漏，条件改变废弃本轮结论，production soak NOT_RUN。

视觉核对：条件改变红线已外移；趋势→泄漏和快照→平台的同色紫线仍在核心判读区相交并近乎贴行，维持REWORK。

实际查看范围：1600×1858；y=0..1857；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP07 / AP07 Project lab：八小时 soak 的慢变量证据。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP07 / AP07 验收标准。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP07 / 完成标准与停止条件。

- P2：趋势→泄漏和快照→平台两条同色证据线仍相交并贴行，平台/泄漏的核心条件归属不清。
  证据：当前A区资源与任务趋势、首中尾快照差分的下方，“稳态持续正斜率”对应的趋势→泄漏紫线与“检查有界性”对应的快照→平台紫线相交，并在两候选卡上方近乎共享一段水平走廊；无编号端口或跨线桥。右侧条件改变红线已外移，但未消除这个核心同色交点。
  建议：将趋势与快照先接入明确的联合判读区，再以互不交叉的条件出口分别接平台期候选与泄漏候选；或使用独立轨道、端口编号和跨线桥，保持正斜率与有界性标签贴近各自路径。

首轮问题 resolved=false：平台期与泄漏候选的证据线同色交叉，关键条件贴近交点。 部分修复：红色条件污染线已外移，但核心两条紫色判读线仍相交/贴行，旧P2未闭合。

## TD-AP08 — PASS

候选：`output/svg-release-20261026/candidate/public/visuals/course/TD-AP08.svg`

SVG SHA-256：`ca73b3e985676a162974402003211824518f1fd142434af0a0928e2d519b9f79`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AP08.png`

PNG SHA-256：`341bd4ff82adbb22e3c1d85e1ce3c2950ef6753ec743295171385e412aa0e802`

正文核对：任务级good-event分母、质量与副作用、误差预算、多窗口告警、事故动作、恢复和回归一致；HTTP200不能自动视为任务成功。

视觉核对：01–06主链连续，07回归回流在外围；恢复与回归节点、责任动作可读。

实际查看范围：1600×2717；y=0..1549 / y=1430..2716；已确认裁块像素与当前PNG一致。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP08 / AP08 Project lab：good-task SLO 到告警动作。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP08 / 给一次真实事故补完告警链：约 40 分钟。

正文依据：`docs/svg-redesign-2026-10-26/body-sources/course-3.json` → TD-AP08 / 这一页的验收口径：SLI 定义与闭环率。

首轮问题 resolved=true：事故回流反馈穿过三段主流程。 07绿色回归反馈已移到外围，01–06主链不再被贯穿。
