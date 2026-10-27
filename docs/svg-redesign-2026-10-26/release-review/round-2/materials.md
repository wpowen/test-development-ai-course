# Materials 第二轮独立复审

25/25图已完成本轮实看与正文核查：PASS 24，REWORK 1。当前P1 0、P2 1、P3 3。

唯一部署阻断：AG-DIM-FOUR-RINGS 的影子／灰度列缺少明确出口证据。字体过小的旧问题已修复，但不能因此忽略新增内容缺口。

本轮按fresh materials-inputs.json的实际candidate SVG和新截图独立审查。长图用sharp在/tmp做不缩放的1400px裁块，邻块重叠80px；共60个view_image视图，覆盖25张截图所有像素。没有修改图、spec、源代码、round-1或其他组报告。报告记录SVG和原始PNG各自SHA-256、正文摘要、来源定位与每次查看的纵向范围。

Chrome几何、显式边闭包及引文核验仅为辅助，不作为PASS依据。图长本身不算P2；编号端口、独立外轨、跨线桥经实看能够追踪时予以通过。与TD-M04参考相比，色系、字号层级、B/C分区延续一致；密集图转为长图后内容仍可辨。

首轮19项记录中，18项已核实解决；仅gantt下一轮计划入口P3仍保留。首轮12项P2均已修复。本轮四环图另发现1项P2；门禁反馈和36维措辞各列1项P3。

| ID | 本轮结论 | 活跃P1/P2 |
|---|---|---|
| TD-AG-00 | PASS | 0 |
| TD-AG-01 | PASS | 0 |
| TD-AG-02 | PASS | 0 |
| TD-AG-03 | PASS | 0 |
| TD-AG-04 | PASS | 0 |
| TD-AG-05 | PASS | 0 |
| TD-AG-06 | PASS | 0 |
| TD-AG-07 | PASS | 0 |
| TD-AG-08 | PASS | 0 |
| TD-AG-09 | PASS | 0 |
| TD-AG-10 | PASS | 0 |
| AG-DIM-ARCHITECTURE | PASS | 0 |
| AG-DIM-FOUR-RINGS | REWORK | 1 |
| AG-DIM-GATE | PASS | 0 |
| AG-DIM-36 | PASS | 0 |
| AG-DIM-RELIABILITY | PASS | 0 |
| career-role-comparison | PASS | 0 |
| career-capability-mindmap | PASS | 0 |
| career-capability-allocation | PASS | 0 |
| career-evidence-lifecycle | PASS | 0 |
| career-responsibility-ladder | PASS | 0 |
| career-evidence-radar | PASS | 0 |
| career-evidence-gantt | PASS | 0 |
| career-background-paths | PASS | 0 |
| career-priority-quadrant | PASS | 0 |

## TD-AG-00 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-00.svg`
- 当前SVG SHA：`ee8eeabbad75a8400f46863a2acd70dd53cc12d67e27978dbf5cc27333f1deff`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-00.png`
- 截图SHA：`3ef0c2663c4c9cf29a682c7fee0fef947ea28b4236b219630aa0833aa58dd857`
- 实看覆盖：1600×4938，4视图，完整覆盖。
- 正文检查：核对退款越权示例、D0全域校准、四环横向驱动D1/D4/D5/D6、红线独立阻断与NOT_RUN边界；25条显式关系与正文一致。
- 视觉检查：逐块追踪01-25；20常规控制与23硬阻断已分线分端口，24/25反馈可回溯。右侧外轨仍密，但编号可辨，未因4938px高度判阻断。
- 首轮复核（resolved=true）：D7常规规则/具名接受与硬规则直接阻断使用完全同一路径；中央D0扇出与反馈也过密。 复核证据：逐块追踪01-25；20常规控制与23硬阻断已分线分端口，24/25反馈可回溯。右侧外轨仍密，但编号可辨，未因4938px高度判阻断。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-00 / problem，匹配行44）；content/modules/agent-architecture-deep.ts（TD-AG-00 / counter，匹配行129）；content/modules/agent-architecture-deep.ts（TD-AG-00 / dimensions.caption，匹配行90）；content/modules/agent-architecture-deep.ts（TD-AG-09 / failureModes，匹配行799）

## TD-AG-01 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-01.svg`
- 当前SVG SHA：`49e2392071403df6237be86a487a5d112534d3a3a909f3900328e02de8c70a83`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-01.png`
- 截图SHA：`3208d5c6e18bea07f734a4b212ba73260444ff943c66894c21d9e7b9a4c060a6`
- 实看覆盖：1600×2015，2视图，完整覆盖。
- 正文检查：金标、人人/人机一致性、偏置探针、确定性事实blocker、换版重校准和人工回退完整，未引入通用数值门槛。
- 视觉检查：逐样本判定贴Judge到分歧矩阵的短边；金标/probe输入和两条回退各自可追踪，字号与卡片层级清楚。
- 首轮复核（resolved=true）：Judge到分歧矩阵的主证据标签离所属边过远，并与回退/校准标签混在中央。 复核证据：逐样本判定贴Judge到分歧矩阵的短边；金标/probe输入和两条回退各自可追踪，字号与卡片层级清楚。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-01 / repair，匹配行65）；content/modules/agent-architecture-deep.ts（TD-AG-01 / failureModes.caption，匹配行177）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-01 / summary，匹配行5471）

## TD-AG-02 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-02.svg`
- 当前SVG SHA：`d5094c1d9bd27b7f6f2804fa43567dac5ee9608ab4c614259c50cb2356030628`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-02.png`
- 截图SHA：`b4aca79e03b4dc77081e1c6b6b35f0818838b7082cc1c7340e401b4ba23193f4`
- 实看覆盖：1600×2233，2视图，完整覆盖。
- 正文检查：查询/政策/转人工任务中的refund_order即Step失败；三层Oracle不抵消，首错回指span并保留安全替代路径，和正文一致。
- 视觉检查：Step blocker标签紧贴首错到Trajectory的红边；终态、完整序列和安全不变量各入端口，外围反馈可读。
- 首轮复核（resolved=true）：Step blocker标签与水平红线分离过远。 复核证据：Step blocker标签紧贴首错到Trajectory的红边；终态、完整序列和安全不变量各入端口，外围反馈可读。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-02 / scenario，匹配行78）；content/modules/agent-architecture-deep.ts（TD-AG-02 / terms，匹配行271）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-02 / summary，匹配行6181）

## TD-AG-03 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-03.svg`
- 当前SVG SHA：`7dfae662af28f141ba8c30d308fec56f3d8d45001b9e3395944b76bc8f199c9b`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-03.png`
- 截图SHA：`fae3aadb137126672692973abc7c6c3a6c3be37a46679c3d027ce06aeaafcde7`
- 实看覆盖：1600×2766，3视图，完整覆盖。
- 正文检查：五事实三跳、handoff语义契约、上下文隔离、三类预算和Owner仲裁保留；未把客户声称已验证改成事实。
- 视觉检查：源头事实08与终点09分别进入核对节点，注入04/05和修复11独立外绕，跨线桥不作为连接；旧中央交叉已消除。
- 首轮复核（resolved=true）：事实核对、故障注入与修复回路形成多重交叉，审计路径难以追踪。 复核证据：源头事实08与终点09分别进入核对节点，注入04/05和修复11独立外绕，跨线桥不作为连接；旧中央交叉已消除。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-deep.ts（TD-AG-03 / dimensions，匹配行306）；content/modules/agent-architecture-system.ts（TD-AG-03 / workflow，匹配行93）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-03 / summary，匹配行6882）

## TD-AG-04 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-04.svg`
- 当前SVG SHA：`9b0677dd483e7caf70325f882ec1d7d8878b16ef9cc98a6c0a1e6eecd1695698`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-04.png`
- 截图SHA：`d8c60198230ac8bc0bb643d3c519ea07545f52382d00a0b4cd986638648cc63b`
- 实看覆盖：1600×1978，2视图，完整覆盖。
- 正文检查：写前零副作用、写后补偿或人工、交回后读取新状态和重授权、确认信息四要素均与正文一致。
- 视觉检查：写前/写后分支、补偿到接管、新状态到恢复均可追踪，字号/留白适中。恢复反馈弯线跨过其他线，但颜色与端点清楚。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-04 / problem，匹配行108）；content/modules/agent-architecture-deep.ts（TD-AG-04 / failureModes，匹配行394）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-04 / summary，匹配行7583）

## TD-AG-05 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-05.svg`
- 当前SVG SHA：`4229304fd195e8b743b76431b64ace893990dc61e19bc66bb50f0bac9eccfb21`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-05.png`
- 截图SHA：`43e3e0c877498a4780b1b1c439009a90646f0b5832b7972fdcae712d137d88b6`
- 实看覆盖：1600×2286，2视图，完整覆盖。
- 正文检查：pass@k/pass^k按任务聚合，区间匹配任务聚类/配对，状态重置和时长桶未知边界完整；高危blocker不被重试掩盖。
- 视觉检查：两种可靠性口径并列，聚类区间与Horizon分区清晰；原先中文末字孤行已修正，Metric Card短语完整换行。
- 首轮复核（resolved=true）：卡片中文短语出现单字孤行，精致度弱于参考。 复核证据：两种可靠性口径并列，聚类区间与Horizon分区清晰；原先中文末字孤行已修正，Metric Card短语完整换行。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-05 / workflow，匹配行125）；content/modules/agent-architecture-system.ts（TD-AG-05 / repair，匹配行129）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-05 / summary，匹配行8277）

## TD-AG-06 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-06.svg`
- 当前SVG SHA：`63b7a380bc28ebb3482b58550d4a47986a70e3f9f7a46d9561b13597447562cc`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-06.png`
- 截图SHA：`5cee471a84cb4988b8eeed9c17ea73dee2b8b5fc1950a1237e366951d5accc10`
- 实看覆盖：1600×1990，2视图，完整覆盖。
- 正文检查：不可信数据、rug-pull、记忆污染与委托分开；工具写前强制授权、manifest hash、实际回执、阻断层及零攻击成功的限制正确。
- 视觉检查：攻击入口、候选、策略、动作/停止和回执分区清楚；授权与模型文本拒绝未混同，标签就近可读。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-06 / workflow，匹配行141）；content/modules/agent-architecture-deep.ts（TD-AG-06 / artifactNote，匹配行574）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-06 / summary，匹配行9009）

## TD-AG-07 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-07.svg`
- 当前SVG SHA：`10f2bb32a320013ce000292acbc0c9f050b545493d6b58a65405b5a9a681bf29`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-07.png`
- 截图SHA：`6861cae0dbbe59ef604d814c41a14d79e8a682770bcc67724407071d212e1136`
- 实看覆盖：1600×3219，3视图，完整覆盖。
- 正文检查：queue/LLM/tool attempt按任务归因，独立成功分母、P95/P99/goodput、复核成本与四类硬预算正确；超限截断而非仅告警。
- 视觉检查：调用04与返回05分离，预算06/07和观测09-12独立端口且有桥接；字不缩小，成本关系可逐条追踪。
- 首轮复核（resolved=true）：LLM与Tool请求/返回反向共线，下一层预算和观测线集中交叉。 复核证据：调用04与返回05分离，预算06/07和观测09-12独立端口且有桥接；字不缩小，成本关系可逐条追踪。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-07 / workflow，匹配行157）；content/modules/agent-architecture-deep.ts（TD-AG-07 / artifactNote，匹配行649）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-07 / summary，匹配行9739）

## TD-AG-08 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-08.svg`
- 当前SVG SHA：`dbdf96d0fbabc5c96e55f734b76d6ec93807c2eed6d656192fdd92b889c397a3`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-08.png`
- 截图SHA：`28d4f2407953ba352fd751ec69e06cfe98306e8352785d4a2c23b0771aee2cf8`
- 实看覆盖：1600×3105，3视图，完整覆盖。
- 正文检查：模型/Prompt/工具/Memory版本、规则/委托审计、具名接受及四维回滚齐全；审计缺失UNKNOWN，硬业务规则独立BLOCKED。
- 视觉检查：版本改变07、审计04、恢复11分轨；硬规则09与不接受/到期10分别进入回滚，主要标签都在所属边上。
- 首轮复核（resolved=true）：回滚恢复反馈贯穿版本与审计线群，标签引线较长。 复核证据：版本改变07、审计04、恢复11分轨；硬规则09与不接受/到期10分别进入回滚，主要标签都在所属边上。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-08 / expected，匹配行175）；content/modules/agent-architecture-deep.ts（TD-AG-08 / failureModes.caption，匹配行704）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-08 / summary，匹配行10451）

## TD-AG-09 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-09.svg`
- 当前SVG SHA：`49415044ae6612298ef57cccc608e65f71a71cc0697fb6729e5d6d521824db98`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-09.png`
- 截图SHA：`800252f6a2eef28e0830e07f93c13c9dafd8b3749bf5f000e73dbd39f1564f23`
- 实看覆盖：1600×3038，3视图，完整覆盖。
- 正文检查：四环成熟度与三段决策分开；统计FAIL阻断，不足可有限具名决定但仍非PASS，无护栏不得接受，真实环NOT_RUN正确。
- 视觉检查：充分07和不足09分别进入风险节点，无护栏10与到期11分轨；FAIL08单独红线，首轮两组重合已修复。
- 首轮复核（resolved=true）：不同门禁条件被同路径叠画，无法逐线区分。 复核证据：充分07和不足09分别进入风险节点，无护栏10与到期11分轨；FAIL08单独红线，首轮两组重合已修复。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-09 / scenario，匹配行190）；content/modules/agent-architecture-deep.ts（TD-AG-09 / thesis，匹配行759）；content/modules/agent-architecture-deep.ts（TD-AG-08 / voice.takeNote，匹配行718）；public/materials/agent-architecture-system/docs/11-three-stage-gate.md（11.5 / 三段之间的关系，匹配行96）

## TD-AG-10 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-10.svg`
- 当前SVG SHA：`453f64d8e7f996fdabb9b961d3d5332fb02e7c2bcfb8ec6ccf6b81693be7282a`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-10.png`
- 截图SHA：`adcd4d9fcd1b61fb9fd5f61a430742d01afb6109d37d898eeb3e39f26c174a64`
- 实看覆盖：1600×3029，3视图，完整覆盖。
- 正文检查：建议/执行物理隔离，陈旧数据建议UNKNOWN而执行写前拒绝；硬额度、双人审批、补偿对账和分钟级演练目标待验证正确。
- 视觉检查：工具额度04和有效签字06已就近标在短控制边；超时07/超额08/拒批09分别到停止端口。
- 首轮复核（resolved=true）：主控制链的短标签被移到远处。 复核证据：工具额度04和有效签字06已就近标在短控制边；超时07/超额08/拒批09分别到停止端口。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-10 / scenario，匹配行206）；content/modules/agent-architecture-system.ts（TD-AG-10 / workflow，匹配行205）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-10 / summary，匹配行11895）

## AG-DIM-ARCHITECTURE - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg`
- 当前SVG SHA：`0c0379deba67d04701b1bcbcdc18d5ef409413e480bc29e7f1aecb5ae0aa30e5`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-ARCHITECTURE.png`
- 截图SHA：`84fac9dd67179e43d1549635411887c5e7898861e8f3cfb77d904e52db6bf5b6`
- 实看覆盖：1600×4230，4视图，完整覆盖。
- 正文检查：核对D0、行为/可靠性/安全/成本/治理、护栏与反馈；新增四环到D4的重复/回放边已呈现，硬规则与具名责任分开。
- 视觉检查：重复与回放10明确进入D4，17责任与20硬阻断独立；决策输入端口可编号查找，反馈21/22分轨，4230px高度不构成阻断。
- 首轮复核（resolved=true）：D7责任证据与硬规则blocker叠画；决策输入箭头过密。 复核证据：重复与回放10明确进入D4，17责任与20硬阻断独立；决策输入端口可编号查找，反馈21/22分轨，4230px高度不构成阻断。
- 首轮复核（resolved=true）：四证据环缺少明确驱动D4可靠性的执行关系。 复核证据：重复与回放10明确进入D4，17责任与20硬阻断独立；决策输入端口可编号查找，反馈21/22分轨，4230px高度不构成阻断。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-00 / workflow，匹配行45）；content/modules/agent-architecture-system.ts（TD-AG-00 / expected，匹配行47）；content/modules/agent-architecture-deep.ts（TD-AG-00 / dimensions.caption，匹配行90）；content/modules/agent-architecture-deep.ts（TD-AG-00 / counter，匹配行129）；content/modules/agent-architecture-deep.ts（TD-AG-09 / failureModes，匹配行799）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-00 / summary，匹配行4659）

## AG-DIM-FOUR-RINGS - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-FOUR-RINGS.svg`
- 当前SVG SHA：`01ef84e9d65aef077d0a4a51dc1f748b065a5ffa6994cfd2810eee4ec782d933`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-FOUR-RINGS.png`
- 截图SHA：`200b65c3dd5ee7e4f7d3147a29af7a45e33f18f5672e7af1912f3a33b9a64ebd`
- 实看覆盖：1600×1968，2视图，完整覆盖。
- 正文检查：四列的隔离、owner、hard block、rollback与NOT_RUN边界正确；完整原文要求影子落Trace并形成真实分布对比数据，第三列遗漏明确出口产物。
- 视觉检查：四列正文大而清楚，原先0.65倍缩图问题已解决；第三列实际没有出口行，属于内容遗漏，不是字体或几何问题。
- 首轮复核（resolved=true）：主图整体缩小造成细字，主体与B/C区字号明显失衡。 复核证据：四列正文大而清楚，原先0.65倍缩图问题已解决；第三列实际没有出口行，属于内容遗漏，不是字体或几何问题。

1. **P2：影子／灰度列遗漏交给门禁的出口证据，四环独立出口未完整表达。**
   - 证据：已查看当前1600×1968截图全部像素。第三列x812-1150、y384-972依次只有输入、影子不生效、灰度另审范围、责任、硬阻断、回滚，没有“出口”或明确对比Trace/评分产物；其余三列都写了出口。fresh spec 的 r3→gate 边标为“真实分布证据”，私有完整原文“环3影子模式做法”要求落Trace、打分并形成真实分布对比数据。下方通用门禁条不能代替第三环自身的出口定义。
   - 建议：在第三列增加“出口：真实分布对比 Trace / 评分及隔离证据”或等价的明确产物，并保留影子不生效、灰度需批准与NOT_RUN边界；按当前字号重新排高后复审。

正文来源：content/modules/agent-architecture-deep.ts（TD-AG-09 / artifactNote，匹配行797）；docs/svg-redesign-2026-10-26/body-sources/agent-architecture-original.txt（五 / 环3影子模式，匹配行8）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-09 / summary，匹配行11159）

## AG-DIM-GATE - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-GATE.svg`
- 当前SVG SHA：`5e31beb0fa2d6d90d475ad784aecb0e08139e783cf5e28104c1c22fef7843577`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-GATE.png`
- 截图SHA：`600d8b18ba5e741db8dff59f1d349ccca2d3811d2bc929ff7ad12144f24d246c`
- 实看覆盖：1600×2812，3视图，完整覆盖。
- 正文检查：三段独立、D0失效阻断、统计满足/未满足/不足三分支、护栏覆盖及有限决定仍非PASS均对照实际门禁正文。
- 视觉检查：统计FAIL红标签紧贴实际边，三种统计结论主支路清楚；两条青色回灌上部较近且多次穿越，仍有P3整理空间。
- 首轮复核（resolved=true）：统计FAIL标签离所属边过远，补证回路穿越主门禁分支。 复核证据：统计FAIL红标签紧贴实际边，三种统计结论主支路清楚；两条青色回灌上部较近且多次穿越，仍有P3整理空间。

1. **P3：两条回灌反馈在上部贴近并多次穿越，仍有非阻断整理空间。**
   - 证据：当前统计FAIL标签已贴近红边，满足/未满足/不足主支路可读；但青色“补新证据后再审”与“修复并保留失败回灌”在候选证据包下方长段近乎平行，并绕过BLOCKED区域交叉。需要比主流程更仔细追踪，尚未造成关键决策条件不可辨。
   - 建议：两条反馈分别沿左右外围返回证据包，保持独立端口与就近标签。

正文来源：content/modules/agent-architecture-system.ts（TD-AG-09 / workflow，匹配行189）；content/modules/agent-architecture-system.ts（TD-AG-05 / failure，匹配行128）；content/modules/agent-architecture-deep.ts（TD-AG-08 / voice.takeNote，匹配行718）；public/materials/agent-architecture-system/docs/11-three-stage-gate.md（11.5 / 三段之间的关系，匹配行96）

## AG-DIM-36 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-36.svg`
- 当前SVG SHA：`6b76e5912d9af2abef90370bebbed59353d86b2ef5a5e64608b9b5c3f74898c1`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-36.png`
- 截图SHA：`8887dc347749069ed45a17a58ac84a88dc5f845c54a1a8786e2cff128c6d2343`
- 实看覆盖：1600×3046，3视图，完整覆盖。
- 正文检查：逐项对照私有完整原文36维名称与数量(4+5+4+4+5+6+4+4)，未把来源固定阈值变成门禁；新增D0/四环/护栏/具名决定/回灌可见。
- 视觉检查：36项八域列表可读；下方独立依赖区含D0说明和四条可读关系带，首轮只列清单的缺陷已修复。
- 首轮复核（resolved=true）：36维列表完整，但spec要求的域间依赖、四环、护栏、具名决定和失败回灌未渲染。 复核证据：36项八域列表可读；下方独立依赖区含D0说明和四条可读关系带，首轮只列清单的缺陷已修复。

1. **P3：四环依赖带“分别驱动”措辞容易被理解为环与域一一配对。**
   - 证据：当前第一条依赖带写“离线、沙箱、影子、在线分别驱动D1/D4/D5/D6”。正文强调四环横向驱动这些域，且各环覆盖范围不同；总架构当前四条执行边已清楚，因此不构成遗漏，但这里的“分别”可产生不必要的一对一联想。
   - 建议：改为“四环按各自输入与覆盖范围横向驱动D1、D4、D5、D6”，避免把四环与四域逐一对应。

正文来源：docs/svg-redesign-2026-10-26/body-sources/agent-architecture-original.txt（四 / 36维明细，匹配行12）；docs/svg-redesign-2026-10-26/body-sources/agent-visual-source.original.json（agent-36-dimensions / caption，匹配行97）；content/modules/agent-architecture-deep.ts（TD-AG-00 / dimensions.caption，匹配行90）；content/modules/agent-architecture-deep.ts（TD-AG-00 / counter，匹配行129）；content/modules/agent-architecture-deep.ts（TD-AG-09 / failureModes，匹配行799）

## AG-DIM-RELIABILITY - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-RELIABILITY.svg`
- 当前SVG SHA：`a3dda4216b1fef770c5d7575987671e0d4d89099e129250fd1b25f209a92e3a1`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-RELIABILITY.png`
- 截图SHA：`520ddb2e20cf561258bec5201b0a2a7c0c5c5d21b3f414cad294c5aa23936e4c`
- 实看覆盖：1600×2489，2视图，完整覆盖。
- 正文检查：经验pass@k与pass^k按N个任务计，iid幂假设与经验计算分开；聚类、可配置Wilson、时长桶、三种结论和未知边界正确。
- 视觉检查：至少一次/全部成功并列，区间和时长桶各自入结论，未知承诺边界可见；未画虚构测量曲线。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/agent-architecture-deep.ts（TD-AG-05 / terms，匹配行498）；content/modules/agent-architecture-deep.ts（TD-AG-05 / terms，匹配行499）；content/modules/agent-architecture-system.ts（TD-AG-05 / expected，匹配行127）

## career-role-comparison - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-role-comparison.svg`
- 当前SVG SHA：`7a2eeb0434dc43629d07c20ca84bac2ff9197e67dde80e47fa3dadbda351b69f`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-role-comparison.png`
- 截图SHA：`bdcb811babbd30c627e0f9d0f84a84f0f7b02407222404033b3185f3e82fcbb5`
- 实看覆盖：1600×2728，3视图，完整覆盖。
- 正文检查：三类角色的对象和目标与原文一致；共同底座、独立Oracle及具名发布责任明确，未以岗位名称替代风险责任。
- 视觉检查：共同底座01-03、被测版本04和质量证据05/06分轨，发布责任07可追踪；旧中央交叉已修复。
- 首轮复核（resolved=true）：共同底座和质量证据斜线中央交叉，可进一步精简。 复核证据：共同底座01-03、被测版本04和质量证据05/06分轨，发布责任07可追踪；旧中央交叉已修复。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（1.0 / 核心职责，匹配行8）；content/modules/career-evolution.ts（TD-C02 / control，匹配行79）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-F01 / summary，匹配行10）

## career-capability-mindmap - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-capability-mindmap.svg`
- 当前SVG SHA：`71457d8dbfea0f5dfbc4746c06e6213f3a238ece32e9bca9c2ebfe848f82c4bf`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-capability-mindmap.png`
- 截图SHA：`4137b5116b8e86aeff2b20061d3b12a6a607321d6c61d22cf91421b14f10135d`
- 实看覆盖：1600×3056，3视图，完整覆盖。
- 正文检查：五类知识到工件/故障/复评再到限定任务主张，缺证据UNKNOWN与下一工件路由完整；不把分类作为个人评分。
- 视觉检查：五条输入01-05进入不同端口；主张06和补件反馈07分两侧，旧共线和中心线束已修复。
- 首轮复核（resolved=true）：三条证据输入接近粘合，证据中心与项目决定的正反向边共线。 复核证据：五条输入01-05进入不同端口；主张06和补件反馈07分两侧，旧共线和中心线束已修复。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（1.1 / 能力维度框架，匹配行12）；content/modules/career-evolution.ts（TD-C03 / action，匹配行108）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-F05 / summary，匹配行2766）

## career-capability-allocation - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-capability-allocation.svg`
- 当前SVG SHA：`21a754095414ad73c33e2e0ec76051630ef3e48dca963c760f703fba58dc0e94`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-capability-allocation.png`
- 截图SHA：`0f3ac0738ccc76b87bb5c164b39924898030e2386721a55abd405e41e534dbcb`
- 实看覆盖：1600×1493，1视图，完整覆盖。
- 正文检查：完整原文核实30/25/25/15/5及五类名称，合计100%；SOURCE-EXAMPLE、内部policy/owner与INTERNAL-UNKNOWN边界正确。
- 视觉检查：环图比例、颜色图例与百分比相符；标题、说明、B/C层级及留白良好，状态长词换行仍可读。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（1.1 / 能力占比图，匹配行16）；docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（1.1 / 能力占比图，匹配行20）；content/modules/career-evolution.ts（TD-C04 / expected，匹配行134）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-C04 / summary，匹配行2158）

## career-evidence-lifecycle - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-evidence-lifecycle.svg`
- 当前SVG SHA：`ef71f937946c6cc3a76d88d1305948beb1182f097329f9285c1f81e88eb698ce`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-lifecycle.png`
- 截图SHA：`e91759630a65c791a98908c2d4b11f62ae3c59bd2f2385f2a2ab22d543c49849`
- 实看覆盖：1600×2776，3视图，完整覆盖。
- 正文检查：主张到原始工件、mutation、独立review、限定应用和反馈复评闭合；总工时含生成/复核/返工，未用候选数充当提效证据。
- 视觉检查：收据03、接受04、未知07-09和反馈06/10均有独立编号边，旧标签长引线问题已修复。
- 首轮复核（resolved=true）：失败收据和接受范围标签集中在中部，需长点引线辨认。 复核证据：收据03、接受04、未知07-09和反馈06/10均有独立编号边，旧标签长引线问题已修复。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/career-evolution.ts（TD-T26 / counterexample，匹配行182）；content/modules/career-evolution-deep.ts（TD-T26 / mechanism，匹配行1894）；content/modules/career-evolution-deep.ts（TD-C03 / mechanism，匹配行775）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-T26 / summary，匹配行3376）

## career-responsibility-ladder - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-responsibility-ladder.svg`
- 当前SVG SHA：`ef4d80f81a1b9dd87b22c5dece0146e76d3b656cd0d5ffcb6c8c21ca6081caa6`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-responsibility-ladder.png`
- 截图SHA：`18804820d2f7b90b171de6db9680259fd0e935ddc8f21a89b802e65dea23d228`
- 实看覆盖：1600×1723，1视图，完整覆盖。
- 正文检查：四态采用当前canonical命名，按领域分别判断，决定权需授权；未按年限或P5-P9授级，组织映射保持INTERNAL-UNKNOWN。
- 视觉检查：四状态递进缩进有层次，正文和授权边界清楚；列宽充足，无年限数值暗示。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/career-evolution.ts（TD-C02 / workedExample，匹配行81）；content/modules/career-evolution-deep.ts（TD-C02 / mechanism，匹配行408）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-C02 / summary，匹配行855）

## career-evidence-radar - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-evidence-radar.svg`
- 当前SVG SHA：`22ac1043b8230268319d927a7ce851eefc2d6461fa56db427669bea6d9110a6e`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-radar.png`
- 截图SHA：`983c214e7743dc7cd69bd9fd37bb969e93df0d7d691508e4a16f08ac30c4ca2b`
- 实看覆盖：1600×2383，2视图，完整覆盖。
- 正文检查：五维当前状态均UNKNOWN；五项工件均待产出，路由对应TD-F05/TD-T01/TD-AG-01/TD-AG-02/TD-C02；reviewer/date和owner均待填，无虚构个人结果。
- 视觉检查：三列证据矩阵下新增五行行动模板及复评出口；工件、课页、UNKNOWN与待填身份日期全可读，分区层次清楚。
- 首轮复核（resolved=true）：矩阵缺少承诺的下一工件和复评出口。 复核证据：三列证据矩阵下新增五行行动模板及复评出口；工件、课页、UNKNOWN与待填身份日期全可读，分区层次清楚。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：content/modules/career-evolution-deep.ts（TD-C03 / counter，匹配行892）；content/modules/career-evolution.ts（TD-C03 / expected，匹配行109）；docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（3.1 / 职级能力雷达图对比，匹配行24）；content/modules/career-evolution.ts（TD-C03 / action，匹配行108）；content/modules/ai-quality-foundations.ts（TD-T01 / summary，匹配行355）；content/modules/career-evolution.ts（TD-F05 / artifact，匹配行153）；content/modules/agent-architecture-system.ts（TD-AG-01 / artifact，匹配行59）；content/modules/agent-architecture-system.ts（TD-AG-02 / artifact，匹配行75）；content/modules/career-evolution.ts（TD-C02 / artifact，匹配行78）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-C03 / summary，匹配行1494）

## career-evidence-gantt - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-evidence-gantt.svg`
- 当前SVG SHA：`bb8abf02a1fe5ed39d8899226e3bf5b1b6886117575d3b70a57acb1299a57fd5`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-gantt.png`
- 截图SHA：`9452d9360e699ab4be38d8e3cd5f6ce11ca3329b967049eeaf6e1337e293f4e1`
- 实看覆盖：1600×1528，1视图，完整覆盖。
- 正文检查：A/B/C依次交基线、故障和独立复评；30/60/90为规划示例，缺样本停补、mutation未打红回Oracle、分歧升级均与正文一致。
- 视觉检查：三窗口等宽、入口/工件和失败分叉可读，无伪工期条；下一轮计划仍没有具体待填记录入口，保留P3。
- 首轮复核（resolved=false）：下一轮计划记录入口偏概括。 复核证据：三窗口等宽、入口/工件和失败分叉可读，无伪工期条；下一轮计划仍没有具体待填记录入口，保留P3。

1. **P3：下一轮计划仍缺明确的待填记录入口，首轮建议尚未实现。**
   - 证据：当前截图仍是A/B/C工件和通用进入下一窗判据；spec next节点要求更新路由与复评日期，但没有next_artifact/reviewer/next_review待填条目。入口/失败动作已清楚，非部署阻断。
   - 建议：在判据条或底部增加下一工件、复评人和复评日期待填入口，不编造日期或个人完成状态。

正文来源：content/modules/career-evolution.ts（TD-C03 / workedExample，匹配行106）；content/modules/career-evolution.ts（careerWave6Expansion / TD-C03，匹配行271）

## career-background-paths - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-background-paths.svg`
- 当前SVG SHA：`e6569745976b8825ee20fb3ec1e8b5c6541f4dfba7683cc20e1f6554fc5bfbe7`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-background-paths.png`
- 截图SHA：`ad46aae76f5e54c9157e6bcb5f69a039a2b178996e8ba63a0b58ca0aed9d9048`
- 实看覆盖：1600×2696，2视图，完整覆盖。
- 正文检查：三种背景仅改先修，资源有版本/checked_at/limits/fallback，共用项目和复评出口；未以月份保证达标或就业。
- 视觉检查：背景01-03汇入缺口、资源04、项目05、复评06及反馈07可分辨；跨线桥与端口清楚。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（4 / 不同背景的学习路径图，匹配行28）；content/modules/career-evolution.ts（TD-R01 / action，匹配行208）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-R01 / summary，匹配行4031）

## career-priority-quadrant - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-priority-quadrant.svg`
- 当前SVG SHA：`a729f0dfe8d948520e897a0c98f55e337d82199eb736839cc0d4299c85af97a3`
- 原始截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-priority-quadrant.png`
- 截图SHA：`559279c00bf42f6ad6b4fd9c2b57ee727321c62204779b42b91a76fd278bbd04`
- 实看覆盖：1600×1688，1视图，完整覆盖。
- 正文检查：重要性由owner、成熟度由可复核证据定义；四类行动、两轴高低方向、定性单位和未知待定位边界正确。
- 视觉检查：低/高类别与行动卡位置一致，轴向明确，无个人测量点；字号和留白舒适。

当前未发现需列出的P1/P2/P3缺陷。

正文来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（5.1 / 能力发展四象限图，匹配行32）；docs/svg-redesign-2026-10-26/body-sources/career-visual-source.original.json（career-priority-quadrant / caption，匹配行245）

结论仅适用于上述当前SVG/截图SHA。修复后需新截图复审对应缺陷；本报告未将任何局部/fixture结果升级为真实集成、人工接受或生产有效性。私有原文只用于核对，不在本报告复制全文。
