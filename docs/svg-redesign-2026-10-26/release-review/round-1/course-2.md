# course-2 独立内容与视觉审阅

完成29/29：PASS 21，REWORK 8。P1/P2为部署阻断；本组未全部通过，不能整体替换或部署。

29条均以view_image逐张查看inputs指定的原尺寸截图，并按sourceRefs定位正文快照，核对标题、关键节点、方向/条件、完整性、故障例子与UNKNOWN/NOT_RUN边界。仅审阅隔离candidate/public新图；未把public旧图作为待审版本，未采用batch PASS直接放行。

风格参照：实际查看output/playwright/svg-redesign-2026-10-26/TD-M04.review.png。候选延续深蓝标题、语义分色与卡片体系；复杂图多用纵向模板，交叉长边及远距条件标签使7张图达不到参考的路径清晰度。简单图层级及留白可用，孤字断行、过大留白与可追踪的轻微交叉记P3；妨碍关键路径追踪记P2，没有用“0重叠”替代目视判断。

哈希绑定：全部当前候选SHA-256与manifest及batch记录一致；按verify.mjs去除metadata后的render_sha256也逐项核对。render_sha256是渲染输入SVG哈希，JSON另存实际查看PNG的SHA-256。

## 部署阻断

| ID | 级别 | 明确缺陷 |
| --- | --- | --- |
| TD-A01 | P2 | 五层独立证据在中心交叉成束，难以把各判据与来源逐一对应。 |
| TD-A02 | P2 | 工具成功/失败/重复请求与四种协议证据汇总挤在同一中心，安全回填链难以追踪。 |
| TD-A06 | P2 | 预算耗尽仍连接可恢复成功的 Fallback，和本页共享预算硬停止条件矛盾。 |
| TD-T11 | P2 | 三层独立判据的连接过密，整份上下文与实际被引片段两条证据线难以区分。 |
| TD-T16 | P2 | 写前控制链的拒绝边及双审批条件拥挤，无法快速定位哪一门禁阻断哪个动作。 |
| TD-W02 | P2 | 恢复状态机多条回返线跨越主链并交叉，关键“跳过已提交写入”路径难以追踪。 |
| TD-X603 | P2 | 三路治理主题在主图中被交叉长边重新混在一起。 |
| TD-X604 | P2 | 安全链被多条长拒绝边贯穿，条件标签远离所属门禁，难以逐级核对。 |

TD-A06是内容条件矛盾，其余7张是关键连线/条件归属不清。修复后须生成新截图、核对新SVG哈希并逐张复审；旧哈希PASS不覆盖新版本。

## 逐图结果

### TD-T05 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T05.svg
SHA-256: c12f37dc4db840f4faa6b39e1d679e64b56b3c1c42ff7ce7091a3f80dd303699

核对“架构节点与交付物”“Fault预期退出2”及四类输入表：需求/设计、Diff、独立Oracle与生成器分权，缺diff_ref/虚构Oracle阻断，Owner接受后入Backlog；图未声称完整召回。

- P3: 主图纵向留白偏多，节点间距大于理解这条短证据链所需。
  Evidence: A 区顶部到第一排节点、08 Backlog 下方均有大块空白；相较 TD-M04 的紧凑分区，主体占高却信息密度偏低。
  Suggested fix: 压缩 A 区上下内边距，保留三类输入并行及门禁分支。

### TD-T06 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T06.svg
SHA-256: 43a317e8bd036e14c8b6be7c9bcbc383024425c8b80dfe0f5741ae0c514707e8

核对两个Runner表、工作示例及停止表：批准baseline全绿在先，同一候选反转退款守卫，独立expected因目标行为而KILLED；survived/no-coverage分类并由Reviewer处置，合成0→1→0边界可见。

- P3: 关键业务规则出现单字孤行。
  Evidence: 01 Oracle 中“不得自动退款”的“款”独占下一行；其余卡片仍有横向调整空间。
  Suggested fix: 为 Oracle 加宽或主动将“不得自动退款”整体换行。

### TD-T07 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T07.svg
SHA-256: 3dd990ca72e2f6b1694abff4b36384405023689da348ea5923bf06c60bf3042b

核对四方法失败模型表及Fault：阈值→边界、交互→组合、不变量→属性、未知输入面→授权Fuzz；方法非互斥，固定seed、refund_count>1反例、shrink后验证及高阶盲区均保留。

- P3: 四条方法分支上下两排，长边与采样汇入线交叉，增加追踪成本。
  Evidence: 01→04/05 的橙色长边穿过 02/03→06 的蓝色汇入线；仍可按颜色与箭头追踪，未改变条件。
  Suggested fix: 四种方法同排或分列成四条短泳道，失败样本在下方统一汇合。

### TD-T08 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T08.svg
SHA-256: aaa03a8348e2cf584448dafb2958c77d9f72de60e46b5ad427f81ae25c5a382f

核对架构表与证据流转：raw只追加、视图只读、候选簇不等于根因，控制实验与Owner后升级；缺trace/混合版本→UNKNOWN，修复用原始失败回放。

No concrete content or visual defect identified.

### TD-A01 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-A01.svg
SHA-256: f18e78fc3e485127e0652d527165399958c2f3bb78670b0408d25385f9c464a9

核对五层合同及0→1→0示例：protocol/generation_manifest/behavior/serving_metrics/reliability各有独立证据；缺request_id与伪造内部revision被阻断，不可见版本为UNKNOWN。

- P2: 五层独立证据在中心交叉成束，难以把各判据与来源逐一对应。
  Evidence: 02 协议、03 Manifest 下方，“版本绑定”“内部变量不可见”“生命周期”“协议证据”与 01→05 调用记账线路集中交叉；同为紫色的 request→reliability 与 protocol→gate 穿过其他分支，视觉上无法直接读出五层并列关系。
  Suggested fix: 改为协议/Manifest/行为/资源/可靠性五条明确泳道，UNKNOWN 放在 Manifest 旁，汇总复核置于统一底部；让每条证据连线短且不跨其他泳道。

### TD-A02 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-A02.svg
SHA-256: da4d95ab398dfeec0b7fa4a54c01d76272f0294953bc36d827ccf9f31a8c691c

核对两张四协议状态转移表、业务例子和重放：SSE终止、JSON语义、Tool授权→执行→真实回填、Async唯一终态分别判定；未知先查幂等，side_effect_count=2必须失败，独立账本不依赖最终文本。

- P2: 工具成功/失败/重复请求与四种协议证据汇总挤在同一中心，安全回填链难以追踪。
  Evidence: 06 Tool 执行、07 失败/未知、08 结果回填、09 副作用账本之间有多条紫线和橙虚线交叉；“获准且幂等未命中”标签远离 04→06 水平边，“回填失败/未知并安全回退”落到图右侧，而执行→回填→后续内容是本页必须清楚展示的时序。
  Suggested fix: 将工具子流程独立为横向请求→授权/幂等→执行→回填→后续内容，失败与未知走下方支路，账本独立核验；SSE/结构化/异步分列汇入协议门禁。

### TD-A03 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A03.svg
SHA-256: ec5ef712744be1ab74f78ddb77d2fd0373b7972574990f626f02851174fec844

核对时间戳公式表及失败费用例子：TTFT起点按图声明，TPOT=(last−first)/(tokens−1)，ITL保留分布；图正确使用达标完成数/时间窗作为Goodput，所有失败重试费用在成本分子，缺字段UNKNOWN。

- P3: 公式英文被机械拆词，削弱指标卡精致度。
  Evidence: 03 TPOT 中 tokens 拆为“toke / ns−1”，使本应一眼核对的分母跨两行。
  Suggested fix: 给公式独立行并使用完整 tokens−1，或统一使用输出 Token 数−1。

### TD-A04 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A04.svg
SHA-256: 8cd3559fc6dcd89306eba431912ca1c3c3d46d569a56c27d77a9c59098f238a6

核对守恒与双模式实验：固定workload，open-loop外部到达，closed-loop诊断；planned=completed+failed+dropped+queued，先守恒再判断拐点，SLO失守停止并验证排空，fixture不代表真实容量。

No concrete content or visual defect identified.

### TD-A05 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A05.svg
SHA-256: 95139c458771c7da2b98bce2dd3f8894fd1bf930f9f17cbaba7d25771a8c072d

核对诊断合同及错误GPU归因故障：Queue/Prefill、Decode/GPU、KV及下游是候选分支；单变量、反证与同负载复跑在先，缺telemetry为UNKNOWN，GPU相关性不升级根因。

- P3: 候选分支与实验汇入线交叉，单变量实验标签偏集中。
  Evidence: 02/03→06 的蓝线在 04/05 之间交叉；“改变到达率或输入长度”“改变单一生成变量”聚在 06 上方，读者需沿曲线回溯来源。
  Suggested fix: 把四类候选排成独立短泳道，在下方汇入实验，UNKNOWN 走外侧。

### TD-A06 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-A06.svg
SHA-256: 2a1ff180edc3cf8ae2627289b2ef69e6ba7bb9e93a02b955ab7dcab96f3b315c

核对四类预算、错误分类及重放：400/401/策略拒绝不重试，429尊重Retry-After，已提交先查幂等，fallback独立质量门禁；发现预算耗尽仍可转fallback成功的图示与硬停止合同冲突，列P2。

- P2: 预算耗尽仍连接可恢复成功的 Fallback，和本页共享预算硬停止条件矛盾。
  Evidence: 02 请求级共享预算→05 Fallback 的红边明确标“预算耗尽”，05 又可经“达标且恢复验证”进入 07 恢复正常；正文要求 attempt/time/cost 均不超预算，图 C 区也写“任一共享预算越界…安全停止”。
  Suggested fix: 将共享 deadline/费用/次数硬上限耗尽直接连到06安全失败；如仅主模型配额耗尽而请求总预算尚足可 fallback，拆开这两种条件，并在 fallback 前显示总预算复核。

### TD-T09 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T09.svg
SHA-256: 82c6a47b6762e13b12cad68f65f2e0742de01599faa6ea76ba4331aadd4a41b7

核对embedding前准入和变更清单：owner/版本/ACL/冲突先核验，chunk保留lineage，current view可重建；删除与权限撤销传播索引缓存并负向验证，0→1→0仅字段合同。

No concrete content or visual defect identified.

### TD-T10 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T10.svg
SHA-256: 329f8ca4631525f604dcd35114f6938ed893a05964a47dec6c13bc221bb0d2c1

核对miss reason与mutation段：gold/qrels独立，先查语料→召回→排名→最终Context，丢失定位到对应层；Context有证据仍答错才转生成，relevant_doc_recalled=false即FAIL。

- P3: 召回成功与缺失分支的标签离实际边较远，首读时需要二次定位。
  Evidence: 03→04 的水平蓝边由细引线关联上方“候选已召回”；“不存在”红标签落在该水平蓝边附近，而实际关联 02→07 长红边。
  Suggested fix: 把“候选已召回”贴回蓝色水平边，把“不存在”放到红边外侧靠近02分支处。

### TD-T11 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-T11.svg
SHA-256: 721e6cbd5b4bd88023c44789c2a26534c03897ff4f234e8682b3676c98ae097f

核对三层正文、验收表及术语：ID存在性、实际citation/span对齐、整份Context faithfulness独立；引用A但仅B支持仍对齐失败，关键无支撑/冲突独立阻断，Judge失准回人审。

- P2: 三层独立判据的连接过密，整份上下文与实际被引片段两条证据线难以区分。
  Evidence: 01 Retrieved Context 下方多条紫线与 03 Claims 的蓝线交叉，04/05/07 之间标签堆叠；“整份冻结上下文”“声明内容”“证据间矛盾须单独检查”跨越同一狭长通道，且多条长边最终聚到08。正文特别要求实际被引片段和整份 Context 分开判定，但图形未形成可直接辨认的并行路径。
  Suggested fix: 按存在性→实际引用对齐/整份上下文忠实度两条并行泳道布局，claims 分叉就近送入两判据；冲突作为单独底栏，汇总结果使用短边。

### TD-T12 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T12.svg
SHA-256: 1d107eb1cc594d2ce6a2fcc1b15c7852febcace7073b69601af92f710f32a7d1

核对上线停止与mutation段：answerability有独立gold，非空也可能不足，无证据拒答或Handoff；跨租户和副作用独立blocker，acl_denied=false不能以扩权修复。

- P3: RAG 主链与交接/越权支路在中央交叉。
  Evidence: 04→06 蓝边、05→07 红边和02→08长红边在“动作承诺与工具意图/无支撑或冲突”附近交叉；箭头仍可追踪，但比 TD-M04 的外侧回路费力。
  Suggested fix: 将越权 blocker 移到主链外侧，Handoff 单独成右列，缩短主链跨列连接。

### TD-X501 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-X501.svg
SHA-256: e39ec63cbd76b58b5490e3462cade30b82a9d43ee1ade4d4244a781b25392e06

核对关系正文与Fault：自然一致样本、单关系翻转、缺模态三组，pair/group指标独立于单模态；受保护Oracle与争议复核，alignment/independent同红，关键缺失无有效降级则阻断。

No concrete content or visual defect identified.

### TD-X502 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-X502.svg
SHA-256: 7909370376b9fc7c704264939dcaf931fab229378df4aa093c30067e81cd3c5e

核对逐slice验收与Fault：locale/script/task、语义独立标注、键盘/名称/辅助技术分别留证；claimed−verified为空集，缺必要locale/可访问性阻断支持声明，不外推英文或整体包容性。

No concrete content or visual defect identified.

### TD-T13 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T13.svg
SHA-256: 851d47a309a6eb31e934ba15bc4b3cf1b4ba3987b3ad2e8ccc7e6c3bb918a46d

核对配对差值验收和架构合同：同任务同Judge/预算重复运行，组件归因唯一变量，锁定字段混杂否决；高风险退款blocker不被总分抵消，保留完整A组合回滚。

No concrete content or visual defect identified.

### TD-T14 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T14.svg
SHA-256: f351b8a7c07dc14586a7ecc0b8ad96276cdcb0d558cc82e4e369ec408eaed464

核对五步校准及架构：先人人一致与rubric裁决、盲评/顺序交换/偏差探针、版本Judge、分歧矩阵；低可靠或关键错误停自动评分，金标复审与人审常设。

- P3: 人工参考与复审反馈复用近乎同一条长曲线，双向关系不够清楚。
  Evidence: 02→06 的“人工共识参考”橙线和06→02“复审 rubric 与争议 gold”绿色反馈线在03左下至02间贴合，端部箭头方向相反而中段难以分辨。
  Suggested fix: 将人工金标参考放在 Judge 右侧独立下行，将复审反馈走 A 区外缘。

### TD-T15 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T15.svg
SHA-256: 004d02f819adff36d7ac1cb09f14941070824aa1bfb00899d5756ce269d0af9b

核对三层判定并列表及退款反例：outcome终态、step调用、trajectory状态序列分开，禁止refund_order即使最终转人工仍失败；允许安全替代路径，证据缺失UNKNOWN。

No concrete content or visual defect identified.

### TD-T16 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-T16.svg
SHA-256: 71e422d7a7df2e87314670d54ea5cb94fb60980dbb9446c05f434f92b9ef51ff

核对动作验收、写前顺序与zero-write演练：工具选择/参数匹配分开，identity/tenant/scope/参数/幂等/审批先于写；绕过模型直测控制，重复键查收据，未批准拒绝且write_count=0独立读回。

- P2: 写前控制链的拒绝边及双审批条件拥挤，无法快速定位哪一门禁阻断哪个动作。
  Evidence: 03/04/05/02→10 的红色拒绝线在07右侧收束成束；身份、scope、金额和任务错误标签跨数排分散，07→08 的“需要审批且批准已核验/契约明确无需人工审批”被放在远处并用细引线关联，主安全链失去顺序层次。
  Suggested fix: 将身份→registry→policy→幂等→审批→adapter排成单向链；拒绝边就近接独立红色侧栏，审批处画清需要/无需/缺批准三分支，评测证据独立放底栏。

### TD-T17 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T17.svg
SHA-256: a5a9ed5e74ebe0602700e803099d2bdce17b410aa9f99e3df5919c261ed7ab5c

核对污染文档export_orders示例：数据不升级系统权限，检索、模型、工具授权和输出日志DLP分层；测试身份仅单订单，记录到达层与真实后果，口头拒绝不能抵消泄密。

No concrete content or visual defect identified.

### TD-T18 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T18.svg
SHA-256: c493c1b711ffea2dcc9f2762a0cb82130f2db767a77b3adc6357368876eb2d0d

核对风险PRD及业务变异：已激活商品manual_review_required，同候选先baseline再auto_refunded；独立状态Oracle，timeout/locator错误不计杀死，人工review且healer不得削弱期望。

- P3: 审查旁路穿越正常/故障对照的核心区域。
  Evidence: 03 Generator→08 Human review 长蓝线跨过04→05批准基线虚线及06→07独立 expected，形成中心三线交叉。
  Suggested fix: 将代码审查旁路走右侧外缘，或把Human review置于Generator旁后再汇总证据。

### TD-T19 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T19.svg
SHA-256: 9eb10d5292376fbd48fa9e03cf11bed5d032d29bccc34459ecba7248c22a854f

核对DOM改名/业务按钮交换和重放：仅非语义定位器候选，业务变化/不明转人工；anti-cheat拒删断言/改expected/跳步，原auto_refunded变异仍须被杀死，否则回滚补丁。

- P3: 产品回归人工处理旁路穿过变异回退区域。
  Evidence: 07→06 的长橙色虚线在04/05/08附近与红色回退边交叉，人工流程需追踪到图底部才能读完。
  Suggested fix: 让产品缺陷分支独立放右列并沿外缘进入人工门禁。

### TD-W01 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-W01.svg
SHA-256: e0e6266c4f9f6ae2fc7679cf24e30e6bbe76692a1b654309c26bb3712f1514fe

核对三类测法与权限分型：按代码/模型/队列的决定权区分，可同产品混合；副作用与幂等点、共享状态、Agent不继承Worker写权限及真实Trace边界均保留。

- P3: 分类图中证据与共享状态连线仍有集中交叉。
  Evidence: 02/03/04到05/06及07的蓝紫线在Worker上方和中间交叉；三类组件虽然分列，证据输出在中间共用狭窄通道。
  Suggested fix: 把三类测试证据保持在各自列底部，共享状态单列，最终再汇入Owner。

### TD-W02 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-W02.svg
SHA-256: 1c06318a496aefdd875c048c50499b06756cb89c2ce1e88b0e78b99d1d09b3b8

核对msg-42完整回放与交付/最终检查：动作receipt不等于任务完成，重投先checkpoint+receipt+当前scope，写后崩溃跳过已写；预算、审批超时handoff、损坏stopped与completed分开。

- P2: 恢复状态机多条回返线跨越主链并交叉，关键“跳过已提交写入”路径难以追踪。
  Evidence: 06→01、07→01、10→01 的绿虚线与checkpoint/receipt→05紫线集中穿过03/04/05之间；“动作已提交：跳过写并恢复后续状态”置于中央，07→03红色崩溃重投曲线又绕过整个左侧。正文要求接手者仅凭工件判断继续/暂停/交接，当前图需逐线猜读。
  Suggested fix: 将投递→恢复判定→预算→执行排成单向主链；已提交/未提交、任务已终结/未终结在判定节点显式分叉，所有回返线走外缘并分开轨道；三种终态并排。

### TD-W03 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-W03.svg
SHA-256: 723caa05d755d308b8120a2a87505f4a01be2db6be908b59ab559772264ce006

核对并行实验架构及故障：冻结任务/工具、两臂相同总预算与重复数，配对差值及协作成本；预算工具干预不齐confounded，噪声内UNKNOWN，不以教学任务量代统计功效。

- P3: 两臂输入与结果交叉，削弱并行对照的清晰度。
  Evidence: 01→04与02→03在上方交叉，04→05和03→06在中段交叉，02→07红色混杂边又穿过结果区。
  Suggested fix: 任务与预算用共享顶栏下发，两臂各自垂直输出结果，再在底部配对比较；混杂边沿外侧走。

### TD-X603 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-X603.svg
SHA-256: 856772b9ff8a9e06d22f96d33d675795bfdb86093b6723b66df12e8b863b14fa

核对五环表、授权隔离反例、删除演练：隔离拒绝不授删除权，陈旧/污染失效且回溯历史；遗忘请求另核目标归属，主存/索引/缓存副本逐项读回与相似查询。

- P2: 三路治理主题在主图中被交叉长边重新混在一起。
  Evidence: 01→08撤回请求长橙线穿过03/04附近；07→03纠错绿反馈横穿中央；05/06/07→10的紫线在08/09之间交叉汇束，“目标归属与删除范围获准”标签又落在汇束处。隔离拒绝、纠错与授权删除虽文字分开，视觉上难以逐路执行。
  Suggested fix: 将拒绝隔离、陈旧纠错、获准删除分别做三条泳道；同意/存储/读取为共享顶栏，删除鉴权留在删除泳道内，三路证据底部统一回归，反馈走外缘。

### TD-X604 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-X604.svg
SHA-256: 951e561090eb761e33440655f86d5027056a6f52a9210799238ff2fdcc2c13da

核对fallback安全链、四项重测及停止表：能力区域、Schema、重新授权、共同输入/输出检查与工具写前控制均保留；主路径失效重新选择，拒绝独立留痕，工具结果另查Oracle与账本。

- P2: 安全链被多条长拒绝边贯穿，条件标签远离所属门禁，难以逐级核对。
  Evidence: 02/04/05/06/07/08→09 的红边集中在中线并跨越03→04、05→06、07→08；“授权、幂等或副作用状态未知”靠近05上方，实际来自08，“身份/区域/scope拒绝”却放到07下方。读者需要细引线反查，破坏安全链的逐级审阅。
  Suggested fix: 将能力→协议→再授权→输入→Provider→输出→工具门禁排成短边主链；各拒绝条件紧贴来源节点接红色侧栏，无工具输出单独短分支通往Trace；禁止远距漂移标签。

### TD-X602 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-X602.svg
SHA-256: 7b9b110945f9e7ed8e18d2a8d5460d5c3c278086a75780f9d737acbcaeae2cf3

核对Fault及回滚排查：基座/代码/超参/lineage可定位，封存holdout独立，污染使旧结论作废；配对切片、独立Owner和模型/Prompt/索引成组回滚，训练及生产NOT_RUN。

- P3: 决策节点标题“回滚”被拆字。
  Evidence: 08标题显示“注册 / BLOCKED / 回”后换行仅“滚”；其他卡片标题也受窄列影响。
  Suggested fix: 决策卡加宽或将“回滚”作为完整词换行。

Only course-2.json and course-2.md created. No SVG, source, public resource, other review or deployment modified.
