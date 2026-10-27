# course-3 · 本轮最终复审

27 PASS，0 REWORK；本轮新实看 6，相同 SVG/规格继承 21。当前 P1/P2/P3 均为0。原报告保留在 round-3，独立实看及返工记录保留在 polish。

## TD-X601 — PASS

图：`visuals/course/TD-X601.svg`

SHA：`7da4276901ff02ebc3a28abeb21af53262c1c2759c400451d6c98ff807f18bc2`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T20 — PASS

图：`visuals/course/TD-T20.svg`

SHA：`4a8553d5c1b8487c597688937f72ff76303f0ffd1283df41a24305339a389ed8`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T21 — PASS

图：`visuals/course/TD-T21.svg`

SHA：`eb40afad0f10cf9de1e79c428aadf5e160cc36e6c61248e21449c146c10b9fdf`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T22 — PASS

图：`visuals/course/TD-T22.svg`

SHA：`657198cd207199c43452ff4d2b404b679fac51f108f1dc87ec5a7ee4b2f87901`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T23 — PASS

图：`visuals/course/TD-T23.svg`

SHA：`26ab112e2d51a34e822c4cffd5139766cf8015df89ccbabb22a059934a6b6aa0`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T24 — PASS

图：`visuals/course/TD-T24.svg`

SHA：`90c70af0a1ee637c52492799f727c7e487d8a01843bf147df85b516406c421ea`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-X805 — PASS

图：`visuals/course/TD-X805.svg`

SHA：`8b050e37aca7f7bb8dc59307b27c411d77120120fd839b5391439d4b26089378`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-B01 — PASS

图：`visuals/course/TD-B01.svg`

SHA：`bdb2c27471bcb46a5c9f34eaf8deb986d05d1ed988b34282b63bd7dafdf63d44`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-B02 — PASS

图：`visuals/course/TD-B02.svg`

SHA：`5f996f7b4c88ddb383427f517b736d211c17a41e696f02368691748c47117ada`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-B03 — PASS

图：`visuals/course/TD-B03.svg`

SHA：`5c12ab006c9eea4d6f7f09be08fffef5dff39a6e0b98393c8b8a18341d7818c8`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-B04 — PASS

图：`visuals/course/TD-B04.svg`

SHA：`da3c224195aabcb49540a2fbf687ab5114b4cdffc6060eeead1d1c8e17f6f72a`

本轮独立实看与正文核对：[报告](polish/review-course3.json)。

[{"severity": "P3", "issue": "A/B同级实验臂仍分处不同行，比较布局不够直接。", "resolved": true, "status": "CLOSED", "old_report": "output/svg-release-20261027-polish/review-before/course-3.json", "old_sha256": "87ffa786514166cd8537bc7ec53f4e310be0bc93ecec9a809d5c36796d90fcff", "evidence": "实看 y684–864：A/B 卡片同高、同宽、同色，左右对称；Locked Dataset/Model 同处上层，分别沿左右外轨约束同一 Harness。两臂各自向 Harness 输入控制条件，没有 A→B 执行边。快照完整成词。"}]

标题、共享控制、两臂与逐题结果层级清楚；7 条边逐条可追踪，底部 raw→paired→有限归因方向明确。无文字遮挡、裁切或关键短语断词。

单模型单数据集下只改变一项协议变量；共享 Harness 不表示先执行 A 再执行 B。原始 A/B 逐题结果落盘后按 case 配对，再以差值与噪声支持有限归因；跨 harness 版本另建基线，不把分辨不出解释为等效。

当前发现：无。

## TD-B05 — PASS

图：`visuals/course/TD-B05.svg`

SHA：`d12cedd448cb27bc6e182b5e68c689e3b482ed4996b58a471fe56cf122a2f5a9`

本轮独立实看与正文核对：[报告](polish/review-course3.json)。

[{"severity": "P3", "issue": "历史兼容性长线仍穿过审计输入，局部线路不够利落。", "resolved": true, "status": "CLOSED", "old_report": "output/svg-release-20261027-polish/review-before/course-3.json", "old_sha256": "b9044db11c2b29a8fe581b8dbd7cf0559088d0de21a7920acfa9c4718611aa10", "evidence": "实看 y944–1224：历史可比性橙色虚线从最左审计卡向下，经左外侧转入分类左端；暴露/金丝雀紫线从中部独立落入分类，不确定性从右侧落入。橙线不再穿越 Candidate 审计输入或其他分类入边。"}]

四类审计同层分列，候选下发总线与分类汇入分离；四个分类端口间隔清楚，分类→具名 owner 连续。各卡文字留在边界内，底部停止条件与未知边界可读。

版本兼容、污染暴露、封存泄露与配对不确定性均有独立输入/输出边；并列审计没有相互依赖箭头，不制造一项通过即可跳过其他项的旁路。分类仍共同消费四项证据并交具名 owner；未检出重复不能排除间接泄漏。

当前发现：无。

## TD-B06 — PASS

图：`visuals/course/TD-B06.svg`

SHA：`6c46d7643e8d6d50f55d71713ef4b44c7af21a40180901b9acf7a00484cba814`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-QP01 — PASS

图：`visuals/course/TD-QP01.svg`

SHA：`b4bbf7463b86354da482d5c5c929886a0a54866a01bb67d30f7ea2eaf840ccc3`

本轮独立实看与正文核对：[报告](polish/review-course3.json)。

[{"severity": "P3", "issue": "Basis Gate的权限词组仍被拆行。", "resolved": true, "status": "CLOSED", "old_report": "output/svg-release-20261027-polish/review-before/course-3.json", "old_sha256": "fca008cd6734d98d92832b8cddcf823a4b38bb14b15dd8a284d27206bb9e6a29", "evidence": "实看 Basis Gate y832–1102：第一行“批准、冻结、无冲突、”，下一行完整“有权限”，再一行 revision 冻结依据；不再出现“有 / 权限”跨行。"}]

01–07 节点/连线编号清楚，轨道可连续跟到箭头。01 通知进入 Inbox，02 控制回读与03 Jira权威事实分轨，04–07依次进入冻结、候选、具权限批准和执行请求；正文卡片与端口没有遮盖。

Webhook只触发，Jira REST回读当前事实和权限；Basis Gate含批准、冻结、无冲突、有权限四条件。冻结来源包才进入AI，候选必须source_ref，人工按明确范围批准后才进入审计执行请求；冲突、越权、未冻结或缺引用停止下游。没有 webhook→执行旁路。

当前发现：无。

## TD-QP02 — PASS

图：`visuals/course/TD-QP02.svg`

SHA：`bdbb5751c6a54379a93908f6ac60493b2c495c5abae6049093adc618d2ad3e95`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-QP03 — PASS

图：`visuals/course/TD-QP03.svg`

SHA：`29ed23e4cedbffae656bf80f9803a3a40809a881af1cb1b9026985456e0eeb35`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-QP04 — PASS

图：`visuals/course/TD-QP04.svg`

SHA：`464ed176783465c179d7d6d1d38052cb8c69dce20dc4ad00e63eeebf9aec8599`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T25 — PASS

图：`visuals/course/TD-T25.svg`

SHA：`b15b6f9c7e17d246ef68bd8b0c7fff4c8d744ab9643a63f925dabc52bda0b1f8`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-C01 — PASS

图：`visuals/course/TD-C01.svg`

SHA：`69b2305e12bc7939ac179fc0e359bc9d87f280ec3fde0c2aab35b24d188d4abf`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-AP01 — PASS

图：`visuals/course/TD-AP01.svg`

SHA：`b36933affbb5f0aa9e9a61e5dc4c53fb48505c6146243bf09fc4f031b2c35b61`

本轮独立实看与正文核对：[报告](polish/review-course3.json)。

[{"severity": "P3", "issue": "Oracle邻近区域仍有异色输入交叉，可进一步简化。", "resolved": true, "status": "CLOSED", "old_report": "output/svg-release-20261027-polish/review-before/course-3.json", "old_sha256": "8dddb7818b82db6044a9d7d3223382c6ec36c2f2456c400e9f0937b198e54c2e", "evidence": "实看 y914–1744：三个切片的紫色证据分别进入 Oracle 顶部独立端口；Oracle 向下以橙色控制线绑定 workload 成功定义；workload 再向下送带 hash 合同到检查。样本分布蓝线沿最左外缘直接接 workload 左侧，不穿 Oracle 或检查输入。"}]

三类切片同层，Oracle→workload→检查垂直排列；样本分布长线虽绕外侧，但连续、无交叉，标签靠近其终点。标题、节点、正文和交付区域清楚。

保留 eligible/excluded、退款账本与幂等、查询引用不足可转人工、转人工合法终态由owner定义。三切片共同提供Oracle证据，样本分布和成功定义分别输入workload，hash变化即新合同；缺Oracle不得纳入成功率，fixture不外推生产容量。

当前发现：无。

## TD-AP02 — PASS

图：`visuals/course/TD-AP02.svg`

SHA：`295d8b6f151805d7e6c4c61acc293ba9a623bb3235c802986ba4c8ee9f39ac1e`

本轮独立实看与正文核对：[报告](polish/review-course3.json)。

[{"severity": "P3", "issue": "Goodput约束中的“副作用”仍跨行断词。", "resolved": true, "status": "CLOSED", "old_report": "output/svg-release-20261027-polish/review-before/course-3.json", "old_sha256": "9b6a2452616b59faad0a05e1c0f1d90d0c7e220ba9a782f421dd56f5a3e7b2c2", "evidence": "实看 Task Goodput Gate y875–1065：“同时检查质量、成本、”后整词“副作用”占下一行；无“副 / 作用”或孤字“用”。"}]

阶段观测紫线从队列分到模型/工具，模型/工具/retry分别汇入关键路径，末端橙色预算线进入Goodput。关键路径附近三路可辨，无相互交叉或文本压线；正文与底部边界完整。

以计划到达时间为起点，queue/model/tool/retry分列证据；模型卡保留TTFT/TPOT，重叠阶段不重复计时，缺等待UNKNOWN。Goodput按达标完成任务/时间，同时受质量、成本、副作用约束；QPS升而good-task降阻断。

当前发现：无。

## TD-AP03 — PASS

图：`visuals/course/TD-AP03.svg`

SHA：`3812df21dcc9e8bc348b6b016cfff6c3b53171df0ab91c71c1a6fe7253139973`

本轮独立实看与正文核对：[报告](polish/review-course3.json)。

[{"severity": "P3", "issue": "根分支与独立对账线仍有交叉，树形层次可更简洁。", "resolved": true, "status": "CLOSED", "old_report": "output/svg-release-20261027-polish/review-before/course-3.json", "old_sha256": "24854bec89eb757e4067faa9cfed587ddcacc7ada6dc51ccfc32ff3321396f0d", "evidence": "实看 y544–1444：root 下方用同源横向分叉总线分别指向三个子span和根上的终态事件；ledger紫线自右侧外缘下行，单独从审计右侧进入，不穿父子总线或四路审计输入。四路证据从左至右依次转入审计顶部，互不交叉。"}]

root与ledger同层分开，三个子span与finalize事件同层且边标签区分“子span”和“根上的终态事件”。独立对账端口与四个顶部审计端口可辨；标题明确边表示归属与核对，未画成步骤序列。

root→queue/generation/attempt仅表示归属；root→terminal明确为根上的事件，非第四个子span。没有queue→generation→attempt→terminal调用顺序边。ledger不从root生成、无root→ledger边，与tool尝试数独立对账；terminal缺失UNKNOWN，账本不一致先修writer/collector，不伪造parent或删失败span。

当前发现：无。

## TD-AP04 — PASS

图：`visuals/course/TD-AP04.svg`

SHA：`4a5677f7066be916ae048a0fa0c52d65d2fdc522de9c9f043f8db51674aaa990`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-AP05 — PASS

图：`visuals/course/TD-AP05.svg`

SHA：`61f1a7511b7c4e8f847b0987b592268d8e02395e6b296e5447e1311480b41554`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-AP06 — PASS

图：`visuals/course/TD-AP06.svg`

SHA：`cc30125a6affa3d1a864eb820a3f59603d4035472e14bc3c6267faca94c5351d`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-AP07 — PASS

图：`visuals/course/TD-AP07.svg`

SHA：`d3217afc4400e11d3a0438d54c4935e29a3db91acbcbdf27af0e33230b4cd324`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-AP08 — PASS

图：`visuals/course/TD-AP08.svg`

SHA：`ca73b3e985676a162974402003211824518f1fd142434af0a0928e2d519b9f79`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。
