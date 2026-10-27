# course-1 第二轮独立复审

29 PASS / 0 REWORK；当前无 P1/P2 阻断；2 项非阻断 P3。首轮 15 项 P2 已逐项复核修复。

实际查看29张当前截图的62个原像素裁块，覆盖全部图面；核对58条sourceRefs（含同块不同引文）及新规格。SVG和截图均在报告写入前重新计算SHA。几何与边闭包PASS没有替代本轮看图。

P3：PS05 人工入口附近同色证据线交叉；PS06 恢复回程绕行并穿越其他路径。具体坐标及建议见逐项记录。

正文快照 SHA256：`4b85937ba7df233cec33c3647935009698e279174001cf428be59f61be96a42e`。

完整机器可读证据见 [course-1.json](course-1.json)。本报告仅覆盖course-1，未执行修改、替换或部署。

## TD-P01 — PASS

图：`visuals/course/TD-P01.svg`

SVG SHA256：`87de43a546964ce05cade0aacece0e003f695f8a8d8a45a4c44cc81f972c86a3`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-P01.png`

截图 SHA256：`507086ac84c21681886dd49fdf79e60cde847018f0f67cdf7f09c22ed5a4679a`

正文核对：核对已批准 PRD 与旧技术方案的相反 SHIPPED 规则；冲突保留双方 source_ref 并先 BLOCKED，owner 裁决写回后生成新版本/hash，下游旧收据失效。无来源或 authority 不明仍 UNKNOWN/BLOCKED，离线夹具不代表生产。

视觉核对：红色“存在未决冲突”已贴近 Basis Gate→SOURCE_CONFLICT；冲突升级、无冲突直通、裁决写回三个动作可分辨。下方两条橙色支路虽相交，但条件就近、箭头落点分离；标题、正文与 B/C 区层级清楚。

首轮复核：首轮 P2 条件归属已修复：红色条件回到风险出口；首轮孤立“用”现为完整“引用”尾行。

正文定位：TD-P01 / 把模型权限写进任务，不要靠一句‘请勿幻觉’；TD-P01 / 依据没冻结时，模型会自行调和矛盾并给出自洽答案。

实际查看：1600×2143，裁块 y 范围（含首尾像素）：0–1529、1450–2142。

当前 findings：无。

## TD-P02 — PASS

图：`visuals/course/TD-P02.svg`

SVG SHA256：`4ff1b236aa4dd283497088011d166097d6cf188a7c502256232d6da9468a8e0d`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-P02.png`

截图 SHA256：`66a9b0a5f58fbdbe0697774ad3597bf67c37a32fa82954035a97372eb720f19c`

正文核对：核对 PASS_SCHEMA 与 PASS_SEMANTIC 分别执行留痕，mutation 将无依据字段送入独立语义检查；两种收据与 owner 确认共同约束下游。结构合法不能掩盖业务语义或来源缺失。

视觉核对：结构、语义、负控制、未知清单、下游交接各自成块；关键节点可顺读，副作用、权限、确认、观察点不再连续出现单字尾行；双门禁的箭头与正文职责相符。

首轮复核：首轮 P2/P3 的“用、限、认、点”单字断行均已消除，当前保留短语或至少两字尾行。

正文定位：TD-P02 / 结构化输出只解决格式，不保证业务语义；TD-P02 / 阶段契约：S2 的字段不是为了好看，是为了支撑下游能力。

实际查看：1600×2423，裁块 y 范围（含首尾像素）：0–1529、1450–2422。

当前 findings：无。

## TD-P03 — PASS

图：`visuals/course/TD-P03.svg`

SVG SHA256：`504d851f609214f0133d331a3c08662f42361c16da2f65f11e75a9c90e6a8bfe`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-P03.png`

截图 SHA256：`a1748ba640b6c4f2ad86caa9ab1fb23113d98362163e1632eb179c4cf20950d5`

正文核对：核对第一次退款成功→ACK 丢失→同一幂等身份重投→不再产生第二次退款；订单、worker、支付账本分别取证，safe terminal 与幂等身份缺失须阻断。图为故障演练设计。

视觉核对：03 调用与 04 回执/超时分轨；05 ACK 丢失与 06 重投分轨；08/09/10 证据路径用独立编号入口。外轨和桥接保留连续性，长图中仍可逐边追到源、条件和终点。

首轮复核：首轮两组反向边重合及证据入口挤在一起的 P2 已修复；复、款的孤立尾字也已消除。

正文定位：TD-P03 / P03 工作示例：技术文档要把失败恢复画出来；TD-P03 / 阶段契约：S3 回答「结果如何发生、在哪里观察」。

实际查看：1600×2833，裁块 y 范围（含首尾像素）：0–1529、1450–2832。

当前 findings：无。

## TD-P04 — PASS

图：`visuals/course/TD-P04.svg`

SVG SHA256：`296e553fdcbd4f061384ec4c1d5eb443342743e41422b1700ca72ed66ea303e6`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-P04.png`

截图 SHA256：`5e3703eb2ab42149b6adbbf52faec58de35ff11f555125770c1b73d92fe1314b`

正文核对：核对已发货取消、重复退款、错误码变化三个不同失败机制及对应层级/Oracle；选择最小充分证据，方法缺口不能用堆 E2E 数量替代，残余风险有 owner。无通用风险阈值。

视觉核对：三列风险与方法上下对应，底部资源决定有明确汇入；标题、节点、检查卡和边界分层完整，留白服务列间比较，读图不需要回溯拥挤箭头。

首轮复核：首轮无缺陷；本轮重新看图和核正文后继续 PASS。

正文定位：TD-P04 / P04 工作示例：从损失倒推测试层级；TD-P04 / 策略门禁看覆盖关系，不看用例数量。

实际查看：1600×1865，裁块 y 范围（含首尾像素）：0–1529、1450–1864。

当前 findings：无。

## TD-P05 — PASS

图：`visuals/course/TD-P05.svg`

SVG SHA256：`b8c28ab600262b0fa54e9bcb0e91fc7b97020323b749cbe927a3b774553ce5dc`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-P05.png`

截图 SHA256：`1ca7c95a2278eba3f48e50b1d6c0a9f7569da45dde2f1a1b6dbb15d17a1a9941`

正文核对：核对 Oracle 独立于实现和本次模型输出，Registry 先冻结、case 引用 oracle_id；mutation 反转 SHIPPED 守卫应变红。补读工作示例，409/202 为教学例，金额/权限不能靠语义分独自放行。

视觉核对：规则/独立计算→Registry→expected 与实现→actual 分开进入断言；蓝色 actual 与紫色 receipt 在下部局部交叉，颜色和端点仍明确；教学数字与失败收据可读。

首轮复核：首轮孤立“入、例”已重新分行；本轮能读到教学示例限定与完整检查语句。

正文定位：TD-P05 / 阶段契约：六层 Oracle 与两条不可越过的红线；TD-P05 / P05 深度准出：独立 Oracle 要能抵抗实现变化。

实际查看：1600×2388，裁块 y 范围（含首尾像素）：0–1529、1450–2387。

当前 findings：无。

## TD-P06 — PASS

图：`visuals/course/TD-P06.svg`

SVG SHA256：`a475fa1b3ae11ea3f060bf24c451da3412f0142b7cd1a00d81c900b28084a618`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-P06.png`

截图 SHA256：`e99897326c556f3d2e0c60eedffd07e88990c0dd33aa63069e0ee295d5085650`

正文核对：核对 TestPackage、adapter、Runner、批准 Oracle、probe、报告的职责；adapter 不得改 expected、吞异常或无限重试；FAKE_GREEN_AUTOMATION 是负控制阻断，报告保留追溯索引。

视觉核对：动作适配与 Runner 判定分层；四类输入各自进 Runner，红色假绿负控制与独立判据可区分；结果报告、失败传播和禁止生产副作用的说明完整。

首轮复核：首轮孤立“败”现为“失败”完整尾行；当前 Runner 标题与说明可顺读。

正文定位：TD-P06 / P06 工作示例：把 Test Package 安全接入自动化；TD-P06 / 追溯索引让变更可以选择回归集。

实际查看：1600×2190，裁块 y 范围（含首尾像素）：0–1529、1450–2189。

当前 findings：无。

## TD-P07 — PASS

图：`visuals/course/TD-P07.svg`

SVG SHA256：`e588ed0bb7a496adf8ec6af951ef5a8e36c0cf273123b29b7497f90a18d173c4`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-P07.png`

截图 SHA256：`d387eec0bc109fc91bca2afa09e5201cd83ca857b7d5d832494f642c2692a033`

正文核对：核对 manifest/raw evidence 先冻结，再按版本选择、Oracle/actual、环境依赖、产品行为归因；TEST_FAIL、产品失败、环境阻断、UNKNOWN 分流，补证再分类，不把缺证据判成产品缺陷。

视觉核对：红色 UNKNOWN 出口与绿色补证回路已分开，绿色沿右侧外缘返回原始比较证据；四个分支条件各有邻近路径，分类与反馈方向可辨。

首轮复核：首轮 P2 下段去回程贴合已解除；本、试、为、用的孤立尾行均不再出现。

正文定位：TD-P07 / 失败先分类，修复 Agent 才能被约束；TD-P07 / TD-P07 反例与诊断：归因前先冻结运行事实。

实际查看：1600×2131，裁块 y 范围（含首尾像素）：0–1529、1450–2130。

当前 findings：无。

## TD-P08 — PASS

图：`visuals/course/TD-P08.svg`

SVG SHA256：`c6782300bf5d534095dd55712cfa1cd4d3f36dd40779c16e26ae0ed12d0ecd8a`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-P08.png`

截图 SHA256：`c7070d2c3d960888bdb4762d1f040a10fc7c7a4148c5380c20d727fe45611af4`

正文核对：核对变更→Impact Set→旧证据 stale→选择回归→新 Evidence Pack；仅 RELEASE_CANDIDATE 交给具名发布责任人，事后事件回灌 Impact Set，离线输出不等于批准。

视觉核对：06 的“仅 RELEASE_CANDIDATE”与证据交接轨相邻且完整；08 反馈走右外轨返回 Impact Set，不穿插中央发布交接；编号和方向可逐边核对。

首轮复核：首轮 P2 限制标签错位与反馈穿越交接区已修复；孤立“仅、件”已消除。

正文定位：TD-P08 / TD-P08 反例与诊断：旧 PASS 不是永久资产；TD-P08 / 修复后生成发布证据，而不是自动批准。

实际查看：1600×2740，裁块 y 范围（含首尾像素）：0–1529、1450–2739。

当前 findings：无。

## TD-PS01 — PASS

图：`visuals/course/TD-PS01.svg`

SVG SHA256：`e62da51f7379278d56c5fa1c4f467101ff4bf058b894d29e15258ac848845d49`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS01.png`

截图 SHA256：`260017b1263a550454449196422bc7f32539d6ddbab256a68fc2f774c2a1e80f`

正文核对：核对 202 仅表示受理，订单终态、独立账本、事件/审计、同次 Trace 共同组成取消证据；拒绝请求零副作用，重复退款/不守恒须阻断，缺终态仍 UNKNOWN。

视觉核对：协议、账本、副作用、Trace 证据标签已拉开；Trace→gate 有自己的短路径，各证据落点可区分。下部仍有局部紫线交叉，但标签未挤成一簇，可沿端点追踪来源。

首轮复核：首轮 P2 四层证据汇聚标签拥挤已改善到可直接辨认每层来源，非依据几何 PASS 判定。

正文定位：TD-PS01 / 把 202、状态与退款账本接成一次取消证据；TD-PS01 / 给一个接口补齐四层断言。

实际查看：1600×1987，裁块 y 范围（含首尾像素）：0–1529、1450–1986。

当前 findings：无。

## TD-PS02 — PASS

图：`visuals/course/TD-PS02.svg`

SVG SHA256：`9857d8fa8d351d50bb56297b3e2214d3f65a1d0812afd82bc7cd96dd1e1b173e`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS02.png`

截图 SHA256：`45a7df31cd97e380787710f40519e1d9935eca15ed9fbe50e7eb72ab20fa9bf9`

正文核对：核对 OpenAPI→结构校验与业务属性 Oracle 两条独立判据链；生成器保留正反例，mutation 输入实现，属性失败 shrink 后保留最小反例/seed；结构 PASS 不抵消金额/状态失败。

视觉核对：02 正反例输入、03 结构依据、04 请求响应结构分在独立轨并有编号端口；07 PASS_SCHEMA 与 08 PASS_SEMANTIC 单独入报告，反例收缩回路完整。

首轮复核：首轮 P2 标签贴到别的边旁已修复；三种输入与两类结果现在分别可追踪。

正文定位：TD-PS02 / 架构节点与交付物；TD-PS02 / 带走四类变异与一组业务属性。

实际查看：1600×2824，裁块 y 范围（含首尾像素）：0–1529、1450–2823。

当前 findings：无。

## TD-PS03 — PASS

图：`visuals/course/TD-PS03.svg`

SVG SHA256：`b88a7fb209b79c70c57bcea62441999cba71c1fae163886414c2d82b55a2ace8`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS03.png`

截图 SHA256：`a77f793ed9cd7ef8da2678887330519bd27ce23525c16514432ad48dd89527ac`

正文核对：核对消费者契约只证明已声明边界兼容；事件回放需验证重复 event_id 不产生第二支付意图、租户身份不丢失，库存/支付失败与补偿终态各有证据。

视觉核对：07 库存失败与 09 补偿回库存使用分离红/绿外轨；08 支付失败独立汇入恢复节点，端口编号和跨线桥可区分交叉与连接。

首轮复核：首轮 P2 库存失败/补偿反向边共线已修复；孤立“图”尾行也已消除。

正文定位：TD-PS03 / 消费者驱动契约凭什么比集成环境更早、更便宜；TD-PS03 / 实现：契约与兼容性。

实际查看：1600×2814，裁块 y 范围（含首尾像素）：0–1529、1450–2813。

当前 findings：无。

## TD-PS04 — PASS

图：`visuals/course/TD-PS04.svg`

SVG SHA256：`cdbdde297e5e34c3a09db35bf2676daf7589dc3b77bcea1bf7197237f7a1a064`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS04.png`

截图 SHA256：`88ae1d6df939e283eb16f0a9dd1a935956e84f3fc70e2d69b8587f4f51b30fd6`

正文核对：核对语义定位和自动等待仅保证动作可发生，不能替代业务终态；退款 UI、订单 API、审计一致才验收，stub 与真实依赖分别限定，未跑浏览器仍 NOT_RUN。

视觉核对：隔离前置、UI 动作、API 终态、失败 Trace 到验收的路径简洁；箭头、节点标题、检查项与边界文字均可顺读，空白没有切断主要关系。

首轮复核：首轮孤立“告”已合为“报告”；本轮未发现新增阻断。

正文定位：TD-PS04 / 语义定位器与自动等待凭什么把 UI 不稳定压下去；TD-PS04 / 让退款 UI 等到业务终态而不是文案出现。

实际查看：1600×2176，裁块 y 范围（含首尾像素）：0–1529、1450–2175。

当前 findings：无。

## TD-PS05 — PASS

图：`visuals/course/TD-PS05.svg`

SVG SHA256：`0dec420d6f69d868bd2ca5f2c72b457b5b504fa6424ea6552a854f98eb39b5e3`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS05.png`

截图 SHA256：`b8bba95eef1ed774f7ed53fdb0ae538fbb896d0e4bb69684473bd849e8145d55`

正文核对：核对 DOM 语义规则、真实键盘/读屏流程和冻结视觉骨架分别验收；incomplete、未分类差异交人工，视觉基线有 owner 批准；自动扫描不代表完整合规，未测组合须记录。

视觉核对：三路检查到人工/组合证据再到任务可用性门禁的职责完整。中央人工入口附近仍有同色证据线相交，记录 P3；文字、三路条件和端点仍可辨认，没有构成关系缺失。

首轮复核：首轮孤立“据、异”已消除；当前节点以“差异”等完整尾行结束。

正文定位：TD-PS05 / 无障碍能自动化到哪一步，剩下的为什么必须人来；TD-PS05 / 分开验证语义、键盘与视觉基线。

实际查看：1600×2354，裁块 y 范围（含首尾像素）：0–1529、1450–2353。

- P3：人工复核入口附近的紫色证据曲线仍局部交叉，读图需要短暂回追。 证据：当前截图 A 区 x≈530–620、y≈1030–1055：“键盘与焦点旅程”→“人工语义与差异复核”的斜线箭头，紧邻“DOM 与语义规则”→“按组合保存证据”的曲线；同色交叉处没有桥接。各线标签与最终落点仍可分辨，三类职责没有丢失。 建议：后续可给 DOM→组合证据单独下移的通道，或在该处加跨线桥，并为人工入口留出更清楚的端口间距。

## TD-PS06 — PASS

图：`visuals/course/TD-PS06.svg`

SVG SHA256：`f915f4d864a40dae4c5b74a4a7b36858bffc27c0398c8a7f5e9152d365cd068c`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS06.png`

截图 SHA256：`ac9cc695094af7ddcc598f6adaa67191b13788a7f0048aaafc2e0fed2d010855`

正文核对：核对权限拒绝不建记录，扫码状态持久化并按 receipt_id 去重；旋转/后台/回收后恢复或安全终止，联网重放用相同身份，独立服务端账本只入账一次；无设备不宣称兼容。

视觉核对：“注入生命周期故障”已贴在 queue→interrupt 的红色弧线上，与恢复标签分开。绿色回程可追到队列，但在恢复节点右上绕行并穿越其他路径，记录 P3。

首轮复核：首轮 P2 故障标签远离红色边、与恢复反馈混淆已修复；本轮 P3 仅针对回程绕行的精致程度。

正文定位：TD-PS06 / 场景：仓库收货不能丢扫描状态；TD-PS06 / 重放 Android 生命周期且不重复入账。

实际查看：1600×1983，裁块 y 范围（含首尾像素）：0–1529、1450–1982。

- P3：恢复待同步项的绿色回程绕行并穿越其他路径，局部线形不够简洁。 证据：当前截图 A 区 x≈1080–1240、y≈775–865：恢复节点→离线队列的绿色虚线先绕到右侧再向左返回，跨过橙色“恢复契约”和紫色“客户端故障现场”路径；标签仍各有所属，绿色方向可追回队列。 建议：后续将恢复节点→队列改走左侧独立外轨，减少回程折返与控制/证据线交叉，保持故障标签现有就近位置。

## TD-PS07 — PASS

图：`visuals/course/TD-PS07.svg`

SVG SHA256：`0a57f5a9e001233d55520470ec1d25cc3a0a180820e715bf5c7d00bc36a22562`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS07.png`

截图 SHA256：`b068dbfe11c0f5e9c9047053e78788b5db0ef7ed8381ed9aa8e1c62f56bfa3ed`

正文核对：核对真机签名/账号/状态清理为前置；前置失败环境阻断，通过后执行 UI/系统权限恢复、业务 API、预约账本及隐私网络证据；释放旧时段并占用新时段才算终态。

视觉核对：前置失败标签紧邻顶部红色弧线，系统权限与恢复位于 UI→权限节点的边旁；账本与隐私证据分别进入收据，跨层长引导标签已消失。

首轮复核：首轮 P2 两组条件标签错位已修复；据、足、功、证、传的孤立尾行均已修复。

正文定位：TD-PS07 / 这些地基不变；TD-PS07 / 架构节点与交付物。

实际查看：1600×2427，裁块 y 范围（含首尾像素）：0–1529、1450–2426。

当前 findings：无。

## TD-PS08 — PASS

图：`visuals/course/TD-PS08.svg`

SVG SHA256：`2c8eb5acac1c3523fe64c8963b56f2e2280200a41f7cba86867b25f318c45558`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS08.png`

截图 SHA256：`00431ddde2ef83274400598afdabfa9125f4843a5f728bd06d2d9225cceee905`

正文核对：核对 expand、dual write、backfill、CDC 到独立对账；对账和回滚演练共同作为切读准入，切读后保留旧结构，异常切回，回滚窗口结束再批准 Contract。Job exit 0 不证明守恒。

视觉核对：08 回滚就绪→切读和 09 切读→保留旧结构分轨；10 异常返回双写走外圈，11 收缩批准独立标注；编号/方向可查，图高没有造成双向条件混用。

首轮复核：首轮 P2 两条相反 control 边共线已修复；孤立“额”尾行已消除。

正文定位：TD-PS08 / 指标与门禁：守恒而不是 Job 成功；TD-PS08 / 数据测试与应用测试的根本差别：断言的是分布，不是单值。

实际查看：1600×2832，裁块 y 范围（含首尾像素）：0–1529、1450–2831。

当前 findings：无。

## TD-PS09 — PASS

图：`visuals/course/TD-PS09.svg`

SVG SHA256：`9b050baf07ea7c69d36459aa373043a535541f69ffdb2a7b83cce7c7153ca8f0`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS09.png`

截图 SHA256：`70796a9e319675264ad500b2323820afb7cc5a95f158c61a9015e252c2e80219`

正文核对：核对开放负载避免 coordinated omission，延迟与质量/安全必须在同一次压测联合判定 Goodput；重试、失败及工具成本计入 cost_per_success，容量决定依 SLO 和风险切片，不给虚构实测值。

视觉核对：workload→开放负载→一次运行后分三类证据，延迟与质量汇入 Goodput，Goodput 与成本再入容量决定；三路语义和箭头清楚，文字无孤立尾字。

首轮复核：首轮“降、告、阶”单字尾行已调整，当前“台阶”等短语可顺读。

正文定位：TD-PS09 / 用开放负载与 Goodput 找容量拐点；TD-PS09 / 用开放负载与 Goodput 找容量拐点。

实际查看：1600×2352，裁块 y 范围（含首尾像素）：0–1529、1450–2351。

当前 findings：无。

## TD-PS10 — PASS

图：`visuals/course/TD-PS10.svg`

SVG SHA256：`6329cef3696256665bc38e65acb752e1aa64f4fd508691b18b71bfc980209eb2`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS10.png`

截图 SHA256：`d7f12b2de161864e07d5372548c63dc297cc65c49a426fd24b14a19d45561ccd`

正文核对：核对 deadline 传播、幂等重试预算、CLOSED/OPEN/HALF_OPEN 转移；打开后只读降级需证明零写副作用，SLI/Trace 触发停止与回滚，恢复后另行复验，不能把隔离实验升级为生产结论。

视觉核对：04 OPEN→HALF_OPEN 与 06 失败返回 OPEN 使用独立路由；10 证据→停止和 11 停止→复验也分轨；每个状态触发条件邻近本轨，长轨中仍有明确方向。

首轮复核：首轮 P2 两组双向边重合已修复；应、染的孤立尾行已消除。

正文定位：TD-PS10 / 这些地基不变；TD-PS10 / 限制重试放大并验证只读降级。

实际查看：1600×3237，裁块 y 范围（含首尾像素）：0–1529、1450–2979、2900–3236。

当前 findings：无。

## TD-PS11 — PASS

图：`visuals/course/TD-PS11.svg`

SVG SHA256：`f47f5c6be2d84f88341f9f4c69d041f08c080f36ffc3094cb06082df2413d95f`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS11.png`

截图 SHA256：`5b93a85d3184da6a4dbff9e39ad8ab8a38e222436c5b2d793b54234b1768196c`

正文核对：核对同一 root Trace 串联 span、版本、延迟/成本与质量，先证明完整性再对齐故障窗口归因，冻结故障回归；默认 telemetry 不落敏感输入，内部不可见指标仍 UNKNOWN。

视觉核对：比首轮窄列布局更舒展，正文短语可连续读；质量/telemetry 与故障窗口输入有各自落点，冻结与回归回路可追踪。长纵向编排没有破坏证据层级，不单凭图高判缺陷。

首轮复核：首轮“务、因”孤立尾行已修复；首轮密度建议已重新评估，当前卡片行宽/证据分层可接受，关闭非阻断建议。

正文定位：TD-PS11 / 模型调用为什么不该另建一套观测体系；TD-PS11 / 先证明 Trace 完整，再做混沌归因。

实际查看：1600×2506，裁块 y 范围（含首尾像素）：0–1529、1450–2505。

当前 findings：无。

## TD-PS12 — PASS

图：`visuals/course/TD-PS12.svg`

SVG SHA256：`963d1c6998a78d9995266814f95f60c22d5d66fa4f3142d403231d8a9013cef6`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS12.png`

截图 SHA256：`bc3b9e668e2d4f0645d565a1e3e37bcc6634ed23ea768dbb7192b4ed1aaabc3a`

正文核对：核对模型只提议动作，工具边界核验 subject/tenant/object/action 与 allowlist；写前授权、负例零读写副作用、账本和审计留证，Prompt 不能扩大工具权限；攻击未命中不证明未知手法不存在。

视觉核对：允许路径自上向下，网关/权限/工具三类红色拒绝分支分别进入拒绝记录，再到审计；英文主体串按连字符分行，没有把 action 拆成 a/ction；允许与阻断层次清楚。

首轮复核：首轮“证、验、限、写、下”孤立尾行已消除，核心身份与权限术语当前可读。

正文定位：TD-PS12 / 安全测试的每一条老规矩都还在，只是多了一个会被说服的执行者；TD-PS12 / 在 API 与工具边界证明跨租户零副作用。

实际查看：1600×2422，裁块 y 范围（含首尾像素）：0–1529、1450–2421。

当前 findings：无。

## TD-X101 — PASS

图：`visuals/course/TD-X101.svg`

SVG SHA256：`b7c0e5195917f539bf604917a742ba2cde65214c8a6170012c8120de77b986aa`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-X101.png`

截图 SHA256：`5b895ed224103a911a66e94af75d823dd269e7d9e5ba70e49df5ccbf4e1ccb1f`

正文核对：核对变更/扩展 SBOM、架构静态约束、来源签名、漏洞扫描、critical owner 与合并门禁；未知来源、未签名、无 owner 或无期限例外须阻断；扫描和合成结果不等于生产安全。

视觉核对：架构发现走独立左下路径到合并，SBOM→签名为右侧短分支；两条紫色路径不再在中央混用标签；扫描到 owner 的链条完整可读。

首轮复核：首轮 P2 架构发现与签名核验路径归属混淆已修复；陷、化、性、间、置的孤立尾行也已消除。

正文定位：TD-X101 / 五道静态门禁各自拦什么；TD-X101 / TD-X101 停止表：哪些证据不能被平均值抵消。

实际查看：1600×2295，裁块 y 范围（含首尾像素）：0–1529、1450–2294。

当前 findings：无。

## TD-FP01 — PASS

图：`visuals/course/TD-FP01.svg`

SVG SHA256：`0156bac39197e82be7b9ca41d1614522766506bc5dd247fa4cfff91e95e81d31`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-FP01.png`

截图 SHA256：`b8503cbbe74d9cd16b7935bf1c649ffd6e6cfaaecf6918974c06e4e932d37e7b`

正文核对：核对七个 Prompt Package 组成面与独立 Oracle；任务/系统/上下文约束输出和评测，收据回到具名 owner；fault 阶段不能改 expected，包可复制不等于业务结论可复制，provider=none 保持 NOT_RUN。

视觉核对：10 条边各有编号轨和端口，系统/上下文对输出与评测的不同约束可辨认，owner 的独立判据输入及收据返回分开；三裁块覆盖到底部图例，无漏读长图下部。

首轮复核：首轮“布、策、口、表”孤立尾行已消除；本轮仍按长轨实际可追踪性评估。

正文定位：TD-FP01 / 先看完整包：七个组成面怎样共同阻止幻觉进入下游；TD-FP01 / 完整 worked walkthrough：从空白材料组装一个可验证 Prompt Package。

实际查看：1600×3037，裁块 y 范围（含首尾像素）：0–1529、1450–2979、2900–3036。

当前 findings：无。

## TD-F02 — PASS

图：`visuals/course/TD-F02.svg`

SVG SHA256：`f144c79d1112d4245146f767e1ff817ad8c94d5d8a510078cb05ae7509f8d34b`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-F02.png`

截图 SHA256：`20f36def1d513a5efd3c3d942b6b7a5e89914f45ec206ab0783ae4d19371ab1a`

正文核对：核对训练/模型快照、Prompt、编排、检索工具层的归因边界，先 manifest diff 再解释变化；各层版本和原始 Trace 冻结后由 owner 判断，缺可见依赖保持未知，托管不可固定须披露复现限制。

视觉核对：01–04 展示责任层输入，05–08 分别进入 Trace 的独立端口，09 到 owner；端口空间次序虽不按编号升序，源端/终端编号一致且路径连续，未混同模型和应用责任。

首轮复核：首轮孤立“果”现为“结果”；当前标题与节点正文可顺读。

正文定位：TD-F02 / Manifest 是回归的共同分母；TD-F02 / 同一个退款问题昨天对、今天错，先别怪模型。

实际查看：1600×3388，裁块 y 范围（含首尾像素）：0–1529、1450–2979、2900–3387。

当前 findings：无。

## TD-F03 — PASS

图：`visuals/course/TD-F03.svg`

SVG SHA256：`eff0c6343767e5ca72db58b69bf92e79f55b08d9b049fe934048b8982a16dddf`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-F03.png`

截图 SHA256：`e94ec2d30551122c768e8828d4702dd37540c959d76a4fd36578da3cba513d81`

正文核对：核对同义约束首/中/尾位置实验及非位置变量固定，边界 token 需实测；每组重复 k 次并存全部 raw，不挑最好输出；pass^k 表示连续全对稳定性，pass@k 表示至少一次，未预设中间必差。

视觉核对：上部六条配置/材料输入有局部交叉，但蓝色与橙色分工、三个落点及相邻条件可读；三组全部尝试分别进入 raw，再形成分布和合同判断，未用单次 PASS 冒充稳定性。

首轮复核：首轮“界、致、出”单字尾行已消除；“Token 与 Context / 边界”保留完整二字末行。

正文定位：TD-F03 / 非确定性从哪来，为什么单次 PASS 不构成证据；TD-F03 / 做一次位置敏感性与重复运行实验：约 45 分钟。

实际查看：1600×2325，裁块 y 范围（含首尾像素）：0–1529、1450–2324。

当前 findings：无。

## TD-F04 — PASS

图：`visuals/course/TD-F04.svg`

SVG SHA256：`6fda135c0d4070ed3df04fcf42e667fb1e868c3f636370e648b1e480813af4b8`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-F04.png`

截图 SHA256：`fd3ed35c49d67b0903c2a5ebca2bd272c4e1d24d39d0baa3fd29706fd64cdab9`

正文核对：核对以真实 Trace 的控制权区分 LLM/RAG/Workflow/Agent/Worker；固定 Workflow 可直接调用 Worker，分类不是必须依次经过的系统链；Verifier 独立核对步骤/终态，危险步骤不被正确输出抵消。

视觉核对：五类分类边 01–05 分别出轨，五类证据边 06–10 进入 Verifier 的不同编号端口，11 再到具名人审；源/端口一一可追踪，没有原先共用干线或贴合箭头。

首轮复核：首轮 P2 分类出口挤成干线与 LLM/RAG 证据落点贴合均已修复；文、偿、止、态孤立尾行已消除。

正文定位：TD-F04 / 把 Agent 当 LLM 测，会漏掉发生在中途和终态的失败；TD-F04 / 用独立 Verifier 检查业务终态。

实际查看：1600×3183，裁块 y 范围（含首尾像素）：0–1529、1450–2979、2900–3182。

当前 findings：无。

## TD-T01 — PASS

图：`visuals/course/TD-T01.svg`

SVG SHA256：`feb5a78e3396199ed1db5a11867f77d6e25a40c92df4c80d781619cf02b6c2dd`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T01.png`

截图 SHA256：`5cdc9c738aadab57716e7d631828179e6b5a443bf9caab5c77feca3bd6c5ee30`

正文核对：核对发布问题先于指标，风险切片→数据/Oracle→指标合同→报告→具名发布决定；停止条件与三类决定权先写清，完整率不替代质量、代表性或模型结论。

视觉核对：主流程可顺读，风险另达决定、报告分别触发停止或决定；橙色条件、红色停止与紫色证据区别清楚，最后 owner 责任未被画成自动发布。

首轮复核：首轮孤立“绿”现以“求绿”二字结尾；本轮无新增阻断。

正文定位：TD-T01 / 先选指标再想问题，是评测体系最常见的起点，也是最贵的；TD-T01 / 合同完整率不能替代质量结论。

实际查看：1600×2354，裁块 y 范围（含首尾像素）：0–1529、1450–2353。

当前 findings：无。

## TD-T02 — PASS

图：`visuals/course/TD-T02.svg`

SVG SHA256：`6325a3c306ee20c4fbe86316b7170dc536d649aef732498c1a0473d4d94ac52d`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T02.png`

截图 SHA256：`2c8c349e87478fc49732cd09ec2f989403199fe09fca6641488754890df82a59`

正文核对：核对先按用户/文档/时间分组再拆 dev/validation/holdout，调优前抽取并封存 holdout、候选冻结后开封；切片检查后裁决回流新版本题池，不能泄漏当前 holdout；合成比例不等于生产发生率。

视觉核对：三集合出口、候选冻结到 Holdout、validation/holdout 到切片检查的路径可区分；候选外弧虽较长，箭头和条件明确；人工裁决的回流沿左外缘到题池，未指向当前调优集。

首轮复核：首轮“染、本、理”孤立尾行已消除，封存和回流限定可读。

正文定位：TD-T02 / 开发集可见，Holdout 受控；TD-T02 / 按失败成本重构评测集：约 60 分钟。

实际查看：1600×2206，裁块 y 范围（含首尾像素）：0–1529、1450–2205。

当前 findings：无。

## TD-T03 — PASS

图：`visuals/course/TD-T03.svg`

SVG SHA256：`de4a8abe359375b376350c06b87f0f9c2fee6fe6d6e15f4e1f6d622181bfe3e7`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T03.png`

截图 SHA256：`f5065dee15dd1591cbb51189ce93faf7e1f007cbdea85aec0df1c1457c453506`

正文核对：核对 Schema→业务规则→权限/副作用三道硬门禁先于开放语义 Judge；硬失败不进平均，人工双标用于校准/分歧；补读校准与停止表，κ 无通用 0.7 放行线，缺证或关键切片不达标停自动判决回退人审。

视觉核对：04/05/06 失败分别进入红色侧轨和阻断节点不同端口；08 人工校准与 09 Judge 分歧回流分开；10/11/12 分别汇入分层报告，人工报告与校准路径不再重叠后才分叉。

首轮复核：首轮 P2 硬失败/人审回流拥挤已用外轨、端口和桥接修复；为、性、对、达、歧、工、分孤立尾行均已消除。

正文定位：TD-T03 / 先写失败动作，再写阈值；TD-T03 / 分歧是证据，不是噪声。

实际查看：1600×2980，裁块 y 范围（含首尾像素）：0–1529、1450–2979。

当前 findings：无。

## TD-T04 — PASS

图：`visuals/course/TD-T04.svg`

SVG SHA256：`75ef2da69e3ad3fa25c888a54529193e5d0ecd9ccb650b7746ee236126cdb11f`

截图：`output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-T04.png`

截图 SHA256：`fa330532a6268454e8352905941f4207862e738e8f8cabc079cc896a42ebe434`

正文核对：核对同题配对 A/B，先完整 raw ledger 再 scorer，再按任务聚类统计与 blocker 切片，owner 决定或证据不足；同任务多次重复非独立样本，不以总分抵消硬失败，也没有预设样本数/实测胜负。

视觉核对：共同 cases 到两候选、再到原始输出的顺序明确，统计和 blocker 分支各自进入结论；标题与节点行宽可接受，长图保留完整判定层次，不因纵向高度本身列 P2。

首轮复核：首轮“同、法、跑”尾字孤立已消除；关于长画布密度的 P3 经当前实图重新评估后关闭，当前语句和比较顺序可读。

正文定位：TD-T04 / 架构节点与交付物；TD-T04 / 把点估计当结论，是统计上最省事也最容易被推翻的做法。

实际查看：1600×2742，裁块 y 范围（含首尾像素）：0–1529、1450–2741。

当前 findings：无。
