# course-2 第二轮独立复审

结论：29/29已实际查看并核对正文；28 PASS、1 REWORK。P1=0、P2=1；TD-T16阻断本组整体替换与部署。

本轮从fresh inputs重新审查当前candidate/public候选及刚刷新的截图。20张原截图直接查看；9张超过3000px的长图使用sharp生成重叠原宽裁块后逐块view_image，覆盖全部像素行；TD-T16另看完整原截图。正文逐条按sourceRefs定位，另核对新spec。没有把Chrome几何/路由闭包PASS、引用数量或首轮PASS作为视觉/内容放行依据；图长本身不作为P2。

首轮报告保存在round-1，未修改。21项旧发现中19项已解决、2项P3仍保留；8项旧P2的原问题均已解决。TD-T16旧线束拥挤虽已解决，本轮独立识别03号执行控制边的绕过语义，整图仍REWORK。

总体风格延续TD-M04的标题、语义色、卡片与深蓝交付栏。新外轨/同号端口/跨线桥对复杂图的路径追踪有实质改善；仍有6项非阻断P3，主要是简单图局部交叉与少量留白、长轨翻阅成本。

## 当前部署阻断

### TD-T16 — P2：动作匹配直连adapter可能绕过安全链

03号橙色控制边“正向基线还须工具与参数匹配”从02动作正确性评测直接进入08 Sandbox adapter，跳过Identity、Tool registry、Policy engine、幂等与审批节点。正文“写前授权链的七个环节”明确每个可写工具都必须走完七环，且不能跳过任何一环；“专业问题、失败成本与决策权”要求所有检查在refund写入之前执行。正文没有说明03是已完成全部授权的正向夹具注入；adapter卡片前提文字也未将多条入边画成AND汇合。因此图可被合理读为动作匹配即可执行，列P2。

精确修复：把03号action匹配通过控制边接Identity verifier，再沿完整七环到adapter；17号action→receipt保留为独立评测结果。负控candidate→identity可保留，明确不预筛坏参数。若必须直连，改为非执行证据，并设置显式授权AND汇合，不能让动作匹配单独触发执行。

## 证据边界

JSON逐项记录当前候选SHA-256、实际查看截图SHA-256、正文检查摘要、视觉检查摘要与首轮问题的resolved状态。候选与fresh inputs/manifest/batch哈希绑定一致，29条fresh inputs与当前course-2.mjs全部相关字段一致；复审开始至写报告前SVG/PNG/inputs均未漂移。通过结论仅适用于所记录的当前版本，不代表真实模型、集成、从业者/学习者或生产接受。

## 逐图结果

| ID | Verdict | Current findings |
| --- | --- | --- |
| TD-T05 | PASS | - |
| TD-T06 | PASS | P3 |
| TD-T07 | PASS | - |
| TD-T08 | PASS | - |
| TD-A01 | PASS | - |
| TD-A02 | PASS | P3 |
| TD-A03 | PASS | - |
| TD-A04 | PASS | - |
| TD-A05 | PASS | - |
| TD-A06 | PASS | - |
| TD-T09 | PASS | - |
| TD-T10 | PASS | P3 |
| TD-T11 | PASS | - |
| TD-T12 | PASS | P3 |
| TD-X501 | PASS | - |
| TD-X502 | PASS | - |
| TD-T13 | PASS | - |
| TD-T14 | PASS | - |
| TD-T15 | PASS | P3 |
| TD-T16 | REWORK | P2 |
| TD-T17 | PASS | - |
| TD-T18 | PASS | - |
| TD-T19 | PASS | - |
| TD-W01 | PASS | - |
| TD-W02 | PASS | - |
| TD-W03 | PASS | P3 |
| TD-X603 | PASS | - |
| TD-X604 | PASS | - |
| TD-X602 | PASS | - |

### TD-T05 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T05.svg
SVG SHA-256: 561e199ffc7e1144025d7b6d773ae357822cfe9e1434582e61d34f52d459399e
Screenshot SHA-256: fd4ffbd516d83454ea84b06dc1c38afed60d3d44c1bb8f0ff150aba6cb25cd70

核对“架构节点与交付物”“Fault预期退出2”及四类输入表：需求/设计、Diff、独立Oracle与生成器分权，缺diff_ref/虚构Oracle阻断，Owner接受后入Backlog；图未声称完整召回。

完整查看新截图：三输入分列，04→05标签贴边，05→06/07条件明确，Owner→Backlog可见；原顶部/底部大块留白已收紧，字号与深浅层级清楚。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 主图纵向留白偏多，节点间距大于理解这条短证据链所需。
当前图顶部三输入已靠近A区标题，底部Backlog有独立竖链，原大块上下空白已收紧，剩余空白服务于分支。

### TD-T06 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T06.svg
SVG SHA-256: 14edde3ac3150a0bb850e45b8f823cb3a02e59c3647e533df29fa6ad5d46c474
Screenshot SHA-256: bee45162d081bf13f828c8c780dacff49cd2134501948cbb58f0fd4f673dab13

核对两个Runner表、工作示例及停止表：批准baseline全绿在先，同一候选反转退款守卫，独立expected因目标行为而KILLED；survived/no-coverage分类并由Reviewer处置，合成0→1→0边界可见。

完整查看新截图：Oracle独立供Baseline和检测，Baseline全绿后才Mutation，detect两出口明确；“退款”完整换行，原孤字已消失；上部右侧留白记P3。

- P3: 两Runner对照布局的上半区右侧留白偏大。
  Evidence: Oracle与候选都位于上方左半，Mutation Runner上方右侧为空；主链可追踪且不影响通过。
  Suggested fix: 在保持两个Runner并列的前提下，将输入卡片居中或减少A区宽度。

Prior finding resolved=true: 关键业务规则出现单字孤行。
当前Oracle中的“退款”作为完整词换行，原“款”单字孤行已消失。

### TD-T07 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T07.svg
SVG SHA-256: 857939ec942d745f81fea6c1e50d1220f356b51a9a77305e032f5d928ae61115
Screenshot SHA-256: 4e78b0b6fa9018559b07ef0f9baf5ae8c59aba9b0853b841551d80c14cc6f74d

核对四方法失败模型表及Fault：阈值→边界、交互→组合、不变量→属性、未知输入面→授权Fuzz；方法非互斥，固定seed、refund_count>1反例、shrink后验证及高阶盲区均保留。

完整查看新截图：四条橙色条件分别指向四方法，四条蓝色样本边在06汇入且终点可分辨，Shrink在下方；原上下排交叉已消除，非互斥说明可读。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 四条方法分支上下两排，长边与采样汇入线交叉，增加追踪成本。
四方法分支从同一上方节点展开，四个采样出口独立进入06，原跨排橙/蓝交叉已消除。

### TD-T08 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T08.svg
SVG SHA-256: a3b66f860b6169b593a6399da67627409ccd135edde89d85045b7569173f5670
Screenshot SHA-256: 669d2638e15c150ddff0f9fdaa4ab5ac2bb3f90b780fcd4ad563aed93dd53a1b

核对架构表与证据流转：raw只追加、视图只读、候选簇不等于根因，控制实验与Owner后升级；缺trace/混合版本→UNKNOWN，修复用原始失败回放。

完整查看新截图：只读引用→候选簇→假设→实验→Cause Gate主链及版本核验支流可追踪，UNKNOWN和修复分支独立，底部故障和边界完整。

No current concrete P1/P2/P3 finding.

### TD-A01 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A01.svg
SVG SHA-256: b1977fcd64cb992f0ee6e988ecb85526f5fd88d0e05be3f60ac4c29b5cac8b8c
Screenshot SHA-256: 0b1068cabff7ca672d3f82ab08819d225447ae3ed47517053048098c6ad55cc0

核对五层合同及0→1→0示例：protocol/generation_manifest/behavior/serving_metrics/reliability各有独立证据；缺request_id与伪造内部revision被阻断，不可见版本为UNKNOWN。

用两个重叠原宽裁块覆盖0至3113全部像素行。01/02/04/05分发、03版本绑定、06内部不可见、07至10汇证和11限制传播均可按同号端口追踪；旧中心交叉束已拆外轨。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 五层独立证据在中心交叉成束，难以把各判据与来源逐一对应。
01/02/04/05输入和07至10汇证移至外轨，同号标签与端口能逐条对照；无原中央交叉束。

### TD-A02 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A02.svg
SVG SHA-256: b48bd21f9085f1b1799f6be70ef5978b8793d3ca3da22c10c18315e9dcb8cc8d
Screenshot SHA-256: d7bf2484d229e9752afa534023ebb23ccb80508b452c00cd33eea0b772a42b57

核对两张四协议状态转移表、业务例子和重放：SSE终止、JSON语义、Tool授权→执行→真实回填、Async唯一终态分别判定；未知先查幂等，side_effect_count=2必须失败，独立账本不依赖最终文本。

用三个重叠原宽裁块覆盖0至4638全部像素行。05授权幂等→执行、08成功→回填、09失败→07、10未知→账本、11失败真实回填、12已有结果→回填和20时序→门禁均实查；旧核心交叉已解，长证据轨仍费翻阅记P3。

- P3: 四协议与工具子流程均可追踪，但证据汇总的外轨路程较长。
  Evidence: 14/15/16号业务状态证据与17/18/19号过程证据跨多排进入09/10，需按端口编号来回查看；未发现断路或标签错配。
  Suggested fix: 后续可用四列协议概览配单独工具放大图减少查线距离，保留当前明确编号。

Prior finding resolved=true: 工具成功/失败/重复请求与四种协议证据汇总挤在同一中心，安全回填链难以追踪。
05执行前提、08成功回填、09失败、10查询状态、11失败回填、12已有结果均有独立轨道/编号，工具时序可逐边确认。

### TD-A03 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A03.svg
SVG SHA-256: 2f06920a533ff0b68dee643279c0a1e705852aeb39be82cc61a5619e68605d06
Screenshot SHA-256: 805bd5804726316a43496e0d615bfe31a0f870b5241bbfe9dc7523ab9772b2a2

核对时间戳公式表及失败费用例子：TTFT起点按图声明，TPOT=(last−first)/(tokens−1)，ITL保留分布；图正确使用达标完成数/时间窗作为Goodput，所有失败重试费用在成本分子，缺字段UNKNOWN。

完整查看新截图：TPOT numerator/denominator分行但tokens−1保持完整，四指标汇总路径各有清楚箭头，Goodput/成本使用不同分母，图例及缺失边界可读。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 公式英文被机械拆词，削弱指标卡精致度。
当前TPOT公式分行保留完整(tokens−1)，不再将tokens拆成toke/ns。

### TD-A04 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A04.svg
SVG SHA-256: 5a06a3d1a18352796d304b140a3cdfdbd8baad8bb458c08467fae71fe65246e3
Screenshot SHA-256: da8e3a528d2358464c65c5edfa8d65ab0f847f64a47eb8e11c80c8ecb26b667c

核对守恒与双模式实验：固定workload，open-loop外部到达，closed-loop诊断；planned=completed+failed+dropped+queued，先守恒再判断拐点，SLO失守停止并验证排空，fixture不代表真实容量。

完整查看新截图：open/closed并列进入Serving，守恒与SLO分流再汇Goodput，停止恢复处条件贴边；所有计划结果和排空条件可读，未见假数据图形。

No current concrete P1/P2/P3 finding.

### TD-A05 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A05.svg
SVG SHA-256: 645ccd88f528bb4e9d21e7fd5cad8a35fd36f621d37b36c0da092bc9fc8cc123
Screenshot SHA-256: be50d315c681ed514e06a5cf5bfe510c1e788a4f9cb54024b83d7a9856e09ab1

核对诊断合同及错误GPU归因故障：Queue/Prefill、Decode/GPU、KV及下游是候选分支；单变量、反证与同负载复跑在先，缺telemetry为UNKNOWN，GPU相关性不升级根因。

用两个重叠原宽裁块覆盖0至3123全部行。01至04候选分支、05缺证UNKNOWN、06至09单变量实验和10结论逐号追踪；原实验汇入交叉集中已消除。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 候选分支与实验汇入线交叉，单变量实验标签偏集中。
06至09单变量实验边分轨进入实验，旧候选汇入区的集中交叉已移外侧。

### TD-A06 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-A06.svg
SVG SHA-256: d472a78b358828f67c297a02841b624c7751232e080b60165d98e913259d9ce6
Screenshot SHA-256: c8f543b2752227a69bc61e90c3f6bac856f250b13f1f8c1650d37df60c6a054c

重新核对“四类预算”正文与0→1→0故障：当前error→safe覆盖400/401/策略拒绝，budget→safe为共享预算硬耗尽，budget→fallback仅主模型不可用且总预算尚足；fallback→recover也要求总预算未越界且质量/安全复核达标。图中这些条件与正文共享deadline和安全失败要求一致，首轮P2已修复。

完整查看新截图并逐边比对新spec。硬耗尽红边实际终点为06安全失败，05Fallback入口明确总预算尚足；拒绝/重试/状态查询和质量失败出口均可辨，没有沿用旧候选。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 预算耗尽仍连接可恢复成功的 Fallback，和本页共享预算硬停止条件矛盾。
当前硬耗尽直接连safe；fallback入口写明主模型不可用且总预算尚足，恢复出口再核总预算，首轮语义矛盾已修复。

### TD-T09 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T09.svg
SVG SHA-256: aef15259a958a8aa1115ff353469712abd97ee2b19a06e469d8d6f5850d0b61e
Screenshot SHA-256: 4d8b33d321e7c0d8b6b5b636b00d08bc63e60365f977142fd2335100b51281f6

核对embedding前准入和变更清单：owner/版本/ACL/冲突先核验，chunk保留lineage，current view可重建；删除与权限撤销传播索引缓存并负向验证，0→1→0仅字段合同。

完整查看新截图：01至04准入/分块/ACL/索引主链，06撤销传播、07current view及05/08正负Trace证据按端口独立追踪，当前版本与副本边界清楚。

No current concrete P1/P2/P3 finding.

### TD-T10 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T10.svg
SVG SHA-256: 3a3b7626c3504c9656de5cec88eedf1a12a0fc627f254cb357a5044294c11e81
Screenshot SHA-256: 65b7f79099ea264e657502b19e9fdc8048faf112f946c03654d837bed1635f71

核对miss reason与mutation段：gold/qrels独立，先查语料→召回→排名→最终Context，丢失定位到对应层；Context有证据仍答错才转生成，relevant_doc_recalled=false即FAIL。

完整查看新截图：不存在分支贴红边，候选已召回贴蓝边；语料/召回/排序/组装四类丢失均有出口。最终top-k和miss入线仍局部交叉记P3，关键终点可辨。

- P3: 最终top-k与缺失原因的入边在局部贴近交叉，仍需沿色线追踪。
  Evidence: 04→05蓝色“最终top-k”在05/07上方穿过02/03→07的红色缺失分支；箭头终点明确，标签已不再漂移。
  Suggested fix: 将top-k蓝边走05上方独立通道，避免贴着红色miss汇入边。

Prior finding resolved=true: 召回成功与缺失分支的标签离实际边较远，首读时需要二次定位。
候选已召回与不存在标签已分别贴各自蓝/红边；另记当前top-k/miss近邻交叉P3。

### TD-T11 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T11.svg
SVG SHA-256: f33a842f0541eeff79cc8b826c269de517ccb2d0a62e361eecebf52353457a83
Screenshot SHA-256: bcadc282d5f21ea71acf5397438b7ba11c2311cce22b9d2fdf9dfb4b4f7165b9

核对三层正文、验收表及术语：ID存在性、实际citation/span对齐、整份Context faithfulness独立；引用A但仅B支持仍对齐失败，关键无支撑/冲突独立阻断，Judge失准回人审。

用三个重叠原宽裁块覆盖0至4111全部行。04/05/06进入实际引用片段，07/08进引用对齐；09/10/11进整份Context忠实度；12/13/14/15/16进入blocker，18/19/20/21/22进分层报告。旧同色中央线束已被编号和跨线桥拆开。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 三层独立判据的连接过密，整份上下文与实际被引片段两条证据线难以区分。
实际被引片段04/05/06→07/08与整份Context09/10/11分开编号，blocker12至16与三层报告18至22端口明确。

### TD-T12 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T12.svg
SVG SHA-256: a752b1fd1f30bde82a127087333b5a065952f7f50a0ac967d0180f56118e1f72
Screenshot SHA-256: c5a74c13c97a606371f6d1afce95576e58b20e2a4150cd261364b24991daaa95

核对上线停止与mutation段：answerability有独立gold，非空也可能不足，无证据拒答或Handoff；跨租户和副作用独立blocker，acl_denied=false不能以扩权修复。

完整查看新截图：ACL→生成许可和越权blocker外侧边分开；无证据→Handoff、逐claim→Gate、工具意图→policy都可追踪，生成与冲突返向支路局部交叉仍记P3。

- P3: 生成输出与无支撑交接支路仍有局部交叉。
  Evidence: 04→05/06蓝边在05上方与05→07红色回返边相交，但红蓝色与终点可辨，越权长边已移到外侧。
  Suggested fix: 把05→07支路走左外缘后进入Handoff，避开生成输出分叉。

Prior finding resolved=false: RAG 主链与交接/越权支路在中央交叉。
越权blocker边已移外侧，但05→07红色无支撑返向边仍与04生成输出分叉局部交叉，保留P3。

### TD-X501 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-X501.svg
SVG SHA-256: 214347126a5d328adcc2ab8711f67b98899e6deba9ede8ef5d1b5efcb8c0b513
Screenshot SHA-256: 646f081e60129bcec3be903f269d45c2f0d6612c04e1d8197fdd041c95fba3e0

核对关系正文与Fault：自然一致样本、单关系翻转、缺模态三组，pair/group指标独立于单模态；受保护Oracle与争议复核，alignment/independent同红，关键缺失无有效降级则阻断。

完整查看新截图：自然/关系翻转/缺模态三个对照并列，Oracle单独供判据，结果分pair/group后人工；不再有关键文字孤行，语义色和留白协调。

No current concrete P1/P2/P3 finding.

### TD-X502 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-X502.svg
SVG SHA-256: db8a5afcc874136157e79ab4018cb3f8f84d709a40b25946c667b372412bc81a
Screenshot SHA-256: 93823e6ae3e0cdbaa6f811c0006b2283138cd11bdcc5e1ddaa55fb327c328a13

核对逐slice验收与Fault：locale/script/task、语义独立标注、键盘/名称/辅助技术分别留证；claimed−verified为空集，缺必要locale/可访问性阻断支持声明，不外推英文或整体包容性。

完整查看新截图：locale/语义/键盘与名称三分支清楚进入slice证据，Owner和支持集合分别约束声明；claimed−verified公式、未验证状态和WCAG/AT边界可读。

No current concrete P1/P2/P3 finding.

### TD-T13 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T13.svg
SVG SHA-256: 6408860ed2bedfe22f9dd23f5ca36279296836b5b989ed2efe5d7917aef9f6d8
Screenshot SHA-256: edea12e2080ec8e2db560551f31c1d00ed487f4e7c511fee6e34294821160ede

核对配对差值验收和架构合同：同任务同Judge/预算重复运行，组件归因唯一变量，锁定字段混杂否决；高风险退款blocker不被总分抵消，保留完整A组合回滚。

完整查看新截图：A/B重复臂共用合同，锁定字段不一致红边走外侧，结果/台账分别汇Owner；存在少量曲线交叉但色彩与箭头可追踪，不构成P2。

No current concrete P1/P2/P3 finding.

### TD-T14 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T14.svg
SVG SHA-256: bf506e1f4023ea56ad134afd2421508d23d6bac30ff2e322b9e9294b8cc4d346
Screenshot SHA-256: b9adb72b0bf4dee2d0170f0e95e4482f1bfd675bc57acecf251a13d684ba11f4

核对五步校准及架构：先人人一致与rubric裁决、盲评/顺序交换/偏差探针、版本Judge、分歧矩阵；低可靠或关键错误停自动评分，金标复审与人审常设。

完整查看新截图：07人工共识走右外轨至matrix，09复审走左外轨至gold，已不再同路径双向贴合；01至08校准/停止顺序与正文一致。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 人工参考与复审反馈复用近乎同一条长曲线，双向关系不够清楚。
07人工参考走右侧，09反馈走左侧，不再复用同一条双向贴合曲线。

### TD-T15 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T15.svg
SVG SHA-256: 552b3c6ada9517775eca39053e70094650aa6d5e30e11dacac2fa4734576fae5
Screenshot SHA-256: 8688aaa3e65bd23f6015ad2740e83bd22555e2bba90a60694e98e2f60054ff1e

核对三层判定并列表及退款反例：outcome终态、step调用、trajectory状态序列分开，禁止refund_order即使最终转人工仍失败；允许安全替代路径，证据缺失UNKNOWN。

完整查看新截图：Outcome/Step/Trajectory三卡并列，Policy blocker单独否决，允许替代路径的文字完整；两条紫色跨列证据线相交记P3，不影响三层分别判定。

- P3: 三层并列评测的跨列紫色证据线仍有一次交叉。
  Evidence: 01 state→05 trajectory 与02 ledger→04 step 在三层节点上方相交，同为紫色，需要沿终点箭头确认；三个判据卡与结果出口仍清楚。
  Suggested fix: 使state与ledger各自分叉后沿外侧进入对应判据，减少同色交叉。

### TD-T16 - REWORK

output/svg-release-20261026/candidate/public/visuals/course/TD-T16.svg
SVG SHA-256: 2158d50dbcc2c3c35c9870ba4f12560bdc55b19540d0b41735fa06b24a8184aa
Screenshot SHA-256: 389532f899f3aaef79bbda15190cc07969d11064d51902be89a0a66f48416861

重新核对sourceRefs四段，并加读“写前授权链的四个环节”“写前授权链的七个环节”“绕过模型直接测授权链”：工具/参数匹配独立出分，所有可写调用仍须identity/tenant/scope/Schema/边界/幂等/审批在写前执行；正文没有为action→adapter建立预先授权夹具例外。03号直连控制边与完整链关系未明确，当前列P2；不能因首轮布局改善继承通过。

完整新图及三个重叠原宽裁块均实际查看，覆盖0至3795全部行。写前控制/拒绝/审批编号端口可追踪，旧视觉拥挤已解；但03号橙色控制边明确绕过03至07直接到08，正文未建立预授权夹具例外，因此新P2仍阻断。

- P2: 03号控制边将动作匹配直接连到Sandbox adapter，合理读法会绕过写前安全链。
  Evidence: 当前截图03“正向基线还须工具与参数匹配”从02动作正确性独立评测沿外轨直接进入08 Sandbox adapter，未经过03 Identity→04 registry→05 policy→06幂等→07审批。正文“写前授权链的七个环节”要求每个可写工具执行前走完七环且不能跳过；“专业问题”同样要求全部在refund写入前执行。正文未声明03为预先完成授权的正向夹具注入；adapter节点文字也未把多入边明确画成AND汇合。
  Suggested fix: 把action匹配通过的03号控制边接identity，沿完整授权链再到adapter；17号action→receipt保留为独立评测证据。负控candidate→identity可并列保留并标明不预筛坏参数。若必须保留直连，需改成非执行证据边并设置显式AND授权汇合，不能让动作匹配单独触发执行。

Prior finding resolved=true: 写前控制链的拒绝边及双审批条件拥挤，无法快速定位哪一门禁阻断哪个动作。
首轮拥挤/远距标签问题由独立外轨和拒绝/审批编号端口解决；本轮03号直连执行的语义问题单独列P2，不据此整图放行。

### TD-T17 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T17.svg
SVG SHA-256: e1ff365c2e05a565e1b624dc0581dfb5b916be35afc3ac5c9b4f87cc77280a9a
Screenshot SHA-256: 23ff1cb2f2c7957b06b66f113fc93bf4c8dcb8ed732d3777b8083413648b27f6

核对污染文档export_orders示例：数据不升级系统权限，检索、模型、工具授权和输出日志DLP分层；测试身份仅单订单，记录到达层与真实后果，口头拒绝不能抵消泄密。

完整查看新截图：不可信内容→隔离→模型后分工具授权/输出DLP，执行事实和阻断记录双路汇安全审查；局部线交叉可沿色与箭头识别，日志泄漏与口头拒绝边界可读。

No current concrete P1/P2/P3 finding.

### TD-T18 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T18.svg
SVG SHA-256: f55d7d5e9b3863304057999f2b97a53163ba2aea8d8d4428d156737f2777611b
Screenshot SHA-256: 4c452cd7cf2af946b37e6c8296c5fcebf804226bedaa796ec68e423e0042528b

核对风险PRD及业务变异：已激活商品manual_review_required，同候选先baseline再auto_refunded；独立状态Oracle，timeout/locator错误不计杀死，人工review且healer不得削弱期望。

完整查看新截图：同候选两臂、baseline先绿条件、Oracle独立expected均可追踪；Generator审查旁路已移右侧不再穿两Runner间核心区，业务变异/误报说明完整。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 审查旁路穿越正常/故障对照的核心区域。
Generator→Human审查旁路已放右侧，避开baseline→mutation之间的中心交叉，独立expected从右侧进入检测。

### TD-T19 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-T19.svg
SVG SHA-256: 7ec37be89c85e4b098e002852096df2ad9b9b4e72bb89ef9c8fdd2fe4c88dbde
Screenshot SHA-256: f3a362295229f70ceb761df8e893cfba97ac6664fcfd2582d159da51da548bcc

核对DOM改名/业务按钮交换和重放：仅非语义定位器候选，业务变化/不明转人工；anti-cheat拒删断言/改expected/跳步，原auto_refunded变异仍须被杀死，否则回滚补丁。

完整查看新截图：纯DOM/业务变化分叉、反作弊通过/拒绝、原变异杀死/存活双出口清楚；产品回归人工旁路已独立沿右侧到合并门禁，旧交叉点已移开。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 产品回归人工处理旁路穿过变异回退区域。
产品缺陷人工处理旁路移到右侧外缘，未再穿过变异重跑/补丁回退局部区域。

### TD-W01 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-W01.svg
SVG SHA-256: e176b7bfc0fdb4bb954145f8559e4749c522f02309480d5d964d1d35fd47f458
Screenshot SHA-256: 59c2db16ac014fae2b7257ffb4d369437c18b5ecd1e89dc7a0c939034135cbd7

核对三类测法与权限分型：按代码/模型/队列的决定权区分，可同产品混合；副作用与幂等点、共享状态、Agent不继承Worker写权限及真实Trace边界均保留。

用两个重叠原宽裁块覆盖0至3130全部行。01/02/03控制权分型、04queue→Worker、05/06/07状态及08至11证据各有同号端口；旧共享状态中心交叉已解。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 分类图中证据与共享状态连线仍有集中交叉。
控制分型、共享状态与Owner证据边均以外轨和编号进入节点，不再中心交叉汇束。

### TD-W02 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-W02.svg
SVG SHA-256: 10c031eaa03a4cf39b59006014bd5a156657772b695a5d25451b50ef28b44eb6
Screenshot SHA-256: b77151c17d4dec50d20d165b9e8fbafb14b549a9ac04ab6d4c5e9a2102dfdcb7

核对msg-42完整回放与交付/最终检查：动作receipt不等于任务完成，重投先checkpoint+receipt+当前scope，写后崩溃跳过已写；预算、审批超时handoff、损坏stopped与completed分开。

用三个重叠原宽裁块覆盖0至3959全部行。03重投→恢复、04/05/06输入证据、07completed、08stopped、09预算、10新动作、11跳过已提交、12预算停、13handoff、14至18回执/反馈/拒绝逐号核查，旧回返长线交叉已被外轨和跨线桥分隔。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 恢复状态机多条回返线跨越主链并交叉，关键“跳过已提交写入”路径难以追踪。
11跳过已提交写入、15崩溃重投、16正常确认、17有效handoff各有独立编号轨；07/08/12/13终止/交接条件可逐项核查。

### TD-W03 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-W03.svg
SVG SHA-256: 23efc8f1b2b882f32aafdb8dfbe8626c52673f2266f7b50784b8f52f3259b7b7
Screenshot SHA-256: 42900079d44c5f74a6fb932d21a00902f37fab0f6dd308e547d5026eea021b61

核对并行实验架构及故障：冻结任务/工具、两臂相同总预算与重复数，配对差值及协作成本；预算工具干预不齐confounded，噪声内UNKNOWN，不以教学任务量代统计功效。

完整查看新截图：同资源实验两臂与逐任务配对结果、成本双流明确，混杂红边已移外侧；输入/结果的局部交叉保留P3，不把图高或轨线长度当阻断。

- P3: 并行实验输入与结果处仍有局部异色交叉。
  Evidence: 01→04蓝边与02→03橙边在实验臂上方贴合，03→06蓝边与04→05紫边在中段交叉；预算混杂长红边已走外侧，箭头可追踪。
  Suggested fix: 将共享任务和共享预算顶栏分开下发，再把两臂结果在底部汇总。

Prior finding resolved=false: 两臂输入与结果交叉，削弱并行对照的清晰度。
混杂长红边已移外侧，但任务/预算和结果/成本两处局部异色交叉仍存在，保留P3；路径与条件可追踪。

### TD-X603 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-X603.svg
SVG SHA-256: 80524533c927f7e665e697e227534d118e087438a7c93272f61a7099b32a377b
Screenshot SHA-256: 30933ad1a9a6eaf190a61206e09999e5dfe2a9fbdbe14c5542e155c35018da1c

核对五环表、授权隔离反例、删除演练：隔离拒绝不授删除权，陈旧/污染失效且回溯历史；遗忘请求另核目标归属，主存/索引/缓存副本逐项读回与相似查询。

用三个重叠原宽裁块覆盖0至4062全部行。06隔离拒绝、07纠错、09单独删除鉴权、10无权拒绝、11获准清副本、08纠错反馈及12至15回归证据逐号可查；三路不再在中心交叉，删除权限前提明确。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 三路治理主题在主图中被交叉长边重新混在一起。
隔离06、纠错07/08、删除09/10/11独立成轨，回归12至15各自入端口，旧中央交叉不再出现。

### TD-X604 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-X604.svg
SVG SHA-256: 331f1600b8ec2a9c21fd220bb84b51e98c2768da9ea8a1d1257d13e9f62b8961
Screenshot SHA-256: 4e701f065d7c11dfcc15490faeeec1d36b24dc4300a44a2b21db18e59b04b129

核对fallback安全链、四项重测及停止表：能力区域、Schema、重新授权、共同输入/输出检查与工具写前控制均保留；主路径失效重新选择，拒绝独立留痕，工具结果另查Oracle与账本。

用三个重叠原宽裁块覆盖0至3696全部行。01至08完整主/备用安全链按顺序可查，04重新选择反馈独立，11至16拒绝标签紧贴源出线且在09分别有端口，09无工具/10工具结果分别进Trace。旧远距漂移和中心拒绝线束已解。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 安全链被多条长拒绝边贯穿，条件标签远离所属门禁，难以逐级核对。
11至16拒绝条件贴对应节点出线，09拒绝有分端口；主链01至08与反馈04可独立追踪。

### TD-X602 - PASS

output/svg-release-20261026/candidate/public/visuals/course/TD-X602.svg
SVG SHA-256: 30c97a19ebe88bdaaa65b6205378f2a9486c4ace8c1221e7b515fc95128fbcf2
Screenshot SHA-256: b73d483d2b52e1ea675cd6f7ba9fe0b742b3e26e04c6abd5221a408759879c4e

核对Fault及回滚排查：基座/代码/超参/lineage可定位，封存holdout独立，污染使旧结论作废；配对切片、独立Owner和模型/Prompt/索引成组回滚，训练及生产NOT_RUN。

完整查看新截图：lineage/快照/holdout三路进comparison，回滚组合独立供Owner，污染/许可失败红边独立到决定；回滚标题完整词换行，旧拆字已修。

No current concrete P1/P2/P3 finding.

Prior finding resolved=true: 决策节点标题“回滚”被拆字。
08决策标题将“回滚”完整换行，不再拆为“回/滚”。

Only current course-2.json/md updated. Round-1 reports, assets, source code and deployment unchanged.
