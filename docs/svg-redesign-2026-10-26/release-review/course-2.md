# course-2 · 本轮最终复审

29 PASS，0 REWORK；本轮新实看 6，相同 SVG/规格继承 23。当前 P1/P2/P3 均为0。原报告保留在 round-3，独立实看及返工记录保留在 polish。

## TD-T05 — PASS

图：`visuals/course/TD-T05.svg`

SHA：`561e199ffc7e1144025d7b6d773ae357822cfe9e1434582e61d34f52d459399e`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T06 — PASS

图：`visuals/course/TD-T06.svg`

SHA：`255affcf2432f34822436efd3667b13bd5605a23277a2562bfaee5bc769e209d`

本轮独立实看与正文核对：[报告](polish/review-course2.json)。

{"status": "OLD_P3_CLOSED", "historical_report": "output/svg-release-20261027-polish/review-before/course-2.json", "old_findings": [{"issue": "两Runner对照布局的上半区右侧留白偏大。", "severity": "P3", "resolved": true, "closure_evidence": "候选02居中放在两Runner上方，03 Baseline与04 Mutation同排等宽；输入边01/02左右对称。01 Oracle独立位于下排，经03固定期望向上供Baseline、04独立判据向右供检测；原上半区单侧空置已消除，未把Oracle改成候选产物。"}], "new_findings_count": 0, "closure_does_not_waive_new_findings": true}

候选02居中放在两Runner上方，03 Baseline与04 Mutation同排等宽；输入边01/02左右对称。01 Oracle独立位于下排，经03固定期望向上供Baseline、04独立判据向右供检测；原上半区单侧空置已消除，未把Oracle改成候选产物。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

批准实现baseline全绿后才启动mutation；相同候选、独立expected与目标actual比较，相关断言杀死才进入review。未杀死/不确定单独分类，no coverage先补路径，等价与工具错误复核，Reviewer处置完整才入回归；baseline失败停止与不改expected均可见。

当前发现：无。

## TD-T07 — PASS

图：`visuals/course/TD-T07.svg`

SHA：`857939ec942d745f81fea6c1e50d1220f356b51a9a77305e032f5d928ae61115`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T08 — PASS

图：`visuals/course/TD-T08.svg`

SHA：`a3b66f860b6169b593a6399da67627409ccd135edde89d85045b7569173f5670`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-A01 — PASS

图：`visuals/course/TD-A01.svg`

SHA：`b1977fcd64cb992f0ee6e988ecb85526f5fd88d0e05be3f60ac4c29b5cac8b8c`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-A02 — PASS

图：`visuals/course/TD-A02.svg`

SHA：`8ae8786f2e742857d1bfef3e8cf30dde11460881650bb7aa2b2a40b0fd0e029b`

本轮独立实看与正文核对：[报告](polish/review-course2.json)。

{"status": "OLD_P3_CLOSED", "historical_report": "output/svg-release-20261027-polish/review-before/course-2.json", "old_findings": [{"issue": "四协议与工具子流程均可追踪，但证据汇总的外轨路程较长。", "severity": "P3", "resolved": true, "closure_evidence": "A1四列分别接收请求，SSE/Schema/Async各自用14/15/16短边到09账本引用、17/18/19本列侧边到10门禁引用；工具细节移到A2，查账与汇总移到A3。原跨多排汇总外轨已消除，三分区标题、04/06/07/08/09/10同号与“同一节点”说明可对照。"}], "new_findings_count": 0, "closure_does_not_waive_new_findings": true, "A02_B_typography_P3_recheck": {"severity": "P3", "issue": "B区“过程断言在哪里”将“不变量”拆开，续行只剩“变量”。", "resolved": true, "status": "CLOSED", "closure_evidence": "最新1600×4572截图B区左卡实看：y=4119为“SSE 查顺序与结束”，y=4154为“JSON 查字段不变量”，y=4189为“Tool 查执行、结果回填与失败回退”。“不变量”完整，无单独“变量”孤行；采用主动语义换行，未缩略原有断言含义。5个全宽重叠裁块覆盖0–4571全部像素行，A1/A2/A3、B/C、边界与图例均复查，未发现新P3。", "previous_report": "output/svg-release-20261027-polish/review-course2-before-A02.json", "previous_svg_sha256": "0e9b358bf0dd0decae42db78165c1c8edcdbb09f67e9cc928c273451575d965d", "previous_screenshot_sha256": "ae1c7b194d4d498ba4c09383da0fd20edd4f88344d10e1664ccf2f712d919308", "current_svg_sha256": "8ae8786f2e742857d1bfef3e8cf30dde11460881650bb7aa2b2a40b0fd0e029b", "current_screenshot_sha256": "d43a72aab816a0869bf38b07cd4e60946af8f551782b065d50ea4e33e26a0f4a"}}

A1四列分别接收请求，SSE/Schema/Async各自用14/15/16短边到09账本引用、17/18/19本列侧边到10门禁引用；工具细节移到A2，查账与汇总移到A3。原跨多排汇总外轨已消除，三分区标题、04/06/07/08/09/10同号与“同一节点”说明可对照。 最新1600×4572截图B区左卡实看：y=4119为“SSE 查顺序与结束”，y=4154为“JSON 查字段不变量”，y=4189为“Tool 查执行、结果回填与失败回退”。“不变量”完整，无单独“变量”孤行；采用主动语义换行，未缩略原有断言含义。5个全宽重叠裁块覆盖0–4571全部像素行，A1/A2/A3、B/C、边界与图例均复查，未发现新P3。

四协议分流没有串成同一执行链；SSE结束完整性、Schema与语义、Async唯一终态分别判定。工具05获准且幂等未命中才执行；06拒绝、09执行失败/超时/取消进入回退，08成功真实回填与11失败/未知真实回填都保留；07重复先查账、10超时未知先查幂等、12已有确认结果回填、13独立副作用读回、20回填时序和21至多一次副作用均保留。未观察到用自定义布局隐去成功/失败或引入重复执行。 本轮B区将原复合句按SSE/JSON主动分行，保留“顺序与结束”和“字段不变量”完整含义，正文快照及21条语义边未变化。

当前发现：无。

## TD-A03 — PASS

图：`visuals/course/TD-A03.svg`

SHA：`2f06920a533ff0b68dee643279c0a1e705852aeb39be82cc61a5619e68605d06`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-A04 — PASS

图：`visuals/course/TD-A04.svg`

SHA：`5a06a3d1a18352796d304b140a3cdfdbd8baad8bb458c08467fae71fe65246e3`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-A05 — PASS

图：`visuals/course/TD-A05.svg`

SHA：`645ccd88f528bb4e9d21e7fd5cad8a35fd36f621d37b36c0da092bc9fc8cc123`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-A06 — PASS

图：`visuals/course/TD-A06.svg`

SHA：`d472a78b358828f67c297a02841b624c7751232e080b60165d98e913259d9ce6`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T09 — PASS

图：`visuals/course/TD-T09.svg`

SHA：`aef15259a958a8aa1115ff353469712abd97ee2b19a06e469d8d6f5850d0b61e`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T10 — PASS

图：`visuals/course/TD-T10.svg`

SHA：`6f92c26f9e69e5dab8b1055d8b30a20b2509585830416880e9256e71dce31b65`

本轮独立实看与正文核对：[报告](polish/review-course2.json)。

{"status": "OLD_P3_CLOSED", "historical_report": "output/svg-release-20261027-polish/review-before/course-2.json", "old_findings": [{"issue": "最终top-k与缺失原因的入边在局部贴近交叉，仍需沿色线追踪。", "severity": "P3", "resolved": true, "closure_evidence": "A2左列语料→召回→排序→Context→生成构成连续主链；07最终top-k竖直进入Context。03/06/08/10四条缺失边在各自排向右进入07 Miss引用，不再穿越top-k成功边。A1独立qrels分别约束02/03，引用不表示重跑。"}], "new_findings_count": 0, "closure_does_not_waive_new_findings": true}

A2左列语料→召回→排序→Context→生成构成连续主链；07最终top-k竖直进入Context。03/06/08/10四条缺失边在各自排向右进入07 Miss引用，不再穿越top-k成功边。A1独立qrels分别约束02/03，引用不表示重跑。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

独立qrels与语料/chunk lineage、raw query/rewrite/filters、候选doc_id/score/索引版本、top-k、最终Context分层。语料不存在、召回/过滤误伤、排序压出窗口、组装丢失各有实际出口到Miss/Owner。Context充分后才进入生成/引用；检索未召回不能靠最终答案正确借分，无gold/争议未裁决保留UNKNOWN。

当前发现：无。

## TD-T11 — PASS

图：`visuals/course/TD-T11.svg`

SHA：`f33a842f0541eeff79cc8b826c269de517ccb2d0a62e361eecebf52353457a83`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T12 — PASS

图：`visuals/course/TD-T12.svg`

SHA：`e2b687d04e6a1708c6ae1a19f2c9c35e0eab60a7516db5db0007886c16cf4bd3`

本轮独立实看与正文核对：[报告](polish/review-course2.json)。

{"status": "OLD_P3_CLOSED", "historical_report": "output/svg-release-20261027-polish/review-before/course-2.json", "old_findings": [{"issue": "生成输出与无支撑交接支路仍有局部交叉。", "severity": "P3", "resolved": true, "closure_evidence": "生成04→05回答与引用竖直向下，04→06工具意图横向右行；05→07无支撑/冲突在下一排右行，原蓝红交叉消除。ACL→Gate的11号硬否决在ACL同排单独出边，A2分别汇总faith/policy/handoff。"}], "new_findings_count": 0, "closure_does_not_waive_new_findings": true}

生成04→05回答与引用竖直向下，04→06工具意图横向右行；05→07无支撑/冲突在下一排右行，原蓝红交叉消除。ACL→Gate的11号硬否决在ACL同排单独出边，A2分别汇总faith/policy/handoff。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

ACL在检索之前限定可见集合，空结果不得扩权；answerability gold独立，非空也可能不足。可用证据才生成，不足/冲突转具名Handoff，生成后逐claim核验；工具意图进入模型之外的Side-effect policy，独立副作用断言进Gate。跨租户/未授权写入单独阻断，质量总分不可抵消。

当前发现：无。

## TD-X501 — PASS

图：`visuals/course/TD-X501.svg`

SHA：`214347126a5d328adcc2ab8711f67b98899e6deba9ede8ef5d1b5efcb8c0b513`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-X502 — PASS

图：`visuals/course/TD-X502.svg`

SHA：`db8a5afcc874136157e79ab4018cb3f8f84d709a40b25946c667b372412bc81a`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T13 — PASS

图：`visuals/course/TD-T13.svg`

SHA：`6408860ed2bedfe22f9dd23f5ca36279296836b5b989ed2efe5d7917aef9f6d8`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T14 — PASS

图：`visuals/course/TD-T14.svg`

SHA：`bf506e1f4023ea56ad134afd2421508d23d6bac30ff2e322b9e9294b8cc4d346`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T15 — PASS

图：`visuals/course/TD-T15.svg`

SHA：`513562b55ba2b70282b5c565eb8e8d6bfd0928409ff6e8a7f1a5fd63133574c9`

本轮独立实看与正文核对：[报告](polish/review-course2.json)。

{"status": "OLD_P3_CLOSED", "historical_report": "output/svg-release-20261027-polish/review-before/course-2.json", "old_findings": [{"issue": "三层并列评测的跨列紫色证据线仍有一次交叉。", "severity": "P3", "resolved": true, "closure_evidence": "state→outcome与ledger→step分别沿左/中列直下；右列用同号01/02引用单独接入Trajectory，03状态迁移沿右列左缘，04动作与观察序列沿右列内部，原跨三列同色交叉消除。三层并列进入同一Human decision，Policy另区写前约束与独立否决。"}], "new_findings_count": 0, "closure_does_not_waive_new_findings": true}

state→outcome与ledger→step分别沿左/中列直下；右列用同号01/02引用单独接入Trajectory，03状态迁移沿右列左缘，04动作与观察序列沿右列内部，原跨三列同色交叉消除。三层并列进入同一Human decision，Policy另区写前约束与独立否决。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

State支撑业务终态，ledger支撑单步，两者共同支撑Trajectory；三层分别向Human decision出结论，未改成先结果再单步的递进审批。Policy→Step写前约束与Policy→Human独立否决均保留；被后端拒绝的refund_order尝试仍记录且失败。缺轨迹/终态UNKNOWN；合法替代路径不被唯一黄金序列错杀。

当前发现：无。

## TD-T16 — PASS

图：`visuals/course/TD-T16.svg`

SHA：`e33bac53d461f184574845b057c6488ef8d718e161f980eac860d5926f2ab5d2`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T17 — PASS

图：`visuals/course/TD-T17.svg`

SHA：`e1ff365c2e05a565e1b624dc0581dfb5b916be35afc3ac5c9b4f87cc77280a9a`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T18 — PASS

图：`visuals/course/TD-T18.svg`

SHA：`f55d7d5e9b3863304057999f2b97a53163ba2aea8d8d4428d156737f2777611b`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-T19 — PASS

图：`visuals/course/TD-T19.svg`

SHA：`7ec37be89c85e4b098e002852096df2ad9b9b4e72bb89ef9c8fdd2fe4c88dbde`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-W01 — PASS

图：`visuals/course/TD-W01.svg`

SHA：`e176b7bfc0fdb4bb954145f8559e4749c522f02309480d5d964d1d35fd47f458`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-W02 — PASS

图：`visuals/course/TD-W02.svg`

SHA：`10c031eaa03a4cf39b59006014bd5a156657772b695a5d25451b50ef28b44eb6`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-W03 — PASS

图：`visuals/course/TD-W03.svg`

SHA：`23aadfda3d42f203de2a049ff4c9f3486f94c63eb365ad4af6e0d0c569f5f9e9`

本轮独立实看与正文核对：[报告](polish/review-course2.json)。

{"status": "OLD_P3_CLOSED", "historical_report": "output/svg-release-20261027-polish/review-before/course-2.json", "old_findings": [{"issue": "并行实验输入与结果处仍有局部异色交叉。", "severity": "P3", "resolved": true, "closure_evidence": "任务顶栏经01/02左右外侧进入两臂，预算经03/04内部短支路进入两臂；05/06结果向中间Repeated trials汇总，07/08消耗沿两侧到成本卡。结果与成本无串联假边，原输入和中段交叉均消除。A2用同号引用作决策与混杂判定，未表示再次运行。"}], "new_findings_count": 0, "closure_does_not_waive_new_findings": true}

任务顶栏经01/02左右外侧进入两臂，预算经03/04内部短支路进入两臂；05/06结果向中间Repeated trials汇总，07/08消耗沿两侧到成本卡。结果与成本无串联假边，原输入和中段交叉均消除。A2用同号引用作决策与混杂判定，未表示再次运行。 B区三张检查卡、C区停止与交付、证据边界及图例均已实看，未见新的遮挡、歧义交叉或短孤行。

两臂共享任务、模型、工具、成功Oracle、总Token/时间/调用/重试及可比人工干预与调优投入；不因多角色增加scope。两臂重复结果分别进入配对差值分析，消耗分别进入协作/单位成功成本，blocker/p95/费用不被成功率吞掉。预算不齐或证据不足分别进Confounded/UNKNOWN，配对收益和代价共同支持按切片架构决定；不使用边际CI重叠判断优胜。

当前发现：无。

## TD-X603 — PASS

图：`visuals/course/TD-X603.svg`

SHA：`80524533c927f7e665e697e227534d118e087438a7c93272f61a7099b32a377b`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-X604 — PASS

图：`visuals/course/TD-X604.svg`

SHA：`331f1600b8ec2a9c21fd220bb84b51e98c2768da9ea8a1d1257d13e9f62b8961`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。

## TD-X602 — PASS

图：`visuals/course/TD-X602.svg`

SHA：`30c97a19ebe88bdaaa65b6205378f2a9486c4ace8c1221e7b515fc95128fbcf2`

本项 SVG 和规格字节未变，核验原实看 PNG 的 SHA 后继承已有 PASS；本轮新渲染仅作几何/QC检查，未冒充重新实看。

当前发现：无。
