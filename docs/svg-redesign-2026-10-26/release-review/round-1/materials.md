# Materials 独立内容与视觉审查

25/25 张已完成真实审查：PASS 14，REWORK 11。P1 0 项，P2 12 项，P3 7 项。P1/P2 为部署阻断；P3 为非阻断优化。

审查对象为隔离的 output/svg-release-20261026/candidate/public 新图。逐张通过 view_image 查看 materials-inputs.json 指定截图，并读取每条 sourceRefs 的实际正文/快照。未以正式 public 旧图代替新图，也未沿用批量报告的PASS作为结论。

每条 JSON 记录实际 candidate SVG SHA-256、截图 PNG SHA-256、去 metadata 后的渲染输入 SHA-256。25张候选与既有batch的候选/渲染输入hash均匹配；PNG自身hash是单独记录，并不等同于render_input_sha256。

与已确认TD-M04实际截图比较：色系、蓝色页首、白底分区和B/C层级整体统一；特殊比较图的层次、留白较好。复杂自动路由图存在主线与反馈未分层、条件标签长引线、同路径不同条件叠画及过度缩图问题。几何0重叠不能代替这些视觉判断。

示例/未知边界整体正确保留：fixture不冒充真实模型/集成/生产，权重只作来源示例，学习窗口不等于个人工期或晋升保证。主要内容缺口是AG-DIM-36的依赖与反馈图、架构总图四环到D4的明确执行关系、career-evidence-radar的下一工件和复评出口。

| ID | 结论 | P1/P2项数 |
|---|---|---|
| TD-AG-00 | REWORK | 1 |
| TD-AG-01 | REWORK | 1 |
| TD-AG-02 | PASS | 0 |
| TD-AG-03 | REWORK | 1 |
| TD-AG-04 | PASS | 0 |
| TD-AG-05 | PASS | 0 |
| TD-AG-06 | PASS | 0 |
| TD-AG-07 | REWORK | 1 |
| TD-AG-08 | PASS | 0 |
| TD-AG-09 | REWORK | 1 |
| TD-AG-10 | PASS | 0 |
| AG-DIM-ARCHITECTURE | REWORK | 2 |
| AG-DIM-FOUR-RINGS | REWORK | 1 |
| AG-DIM-GATE | REWORK | 1 |
| AG-DIM-36 | REWORK | 1 |
| AG-DIM-RELIABILITY | PASS | 0 |
| career-role-comparison | PASS | 0 |
| career-capability-mindmap | REWORK | 1 |
| career-capability-allocation | PASS | 0 |
| career-evidence-lifecycle | PASS | 0 |
| career-responsibility-ladder | PASS | 0 |
| career-evidence-radar | REWORK | 1 |
| career-evidence-gantt | PASS | 0 |
| career-background-paths | PASS | 0 |
| career-priority-quadrant | PASS | 0 |

## TD-AG-00 - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-00.svg`
- SHA-256：`13e69cc11729886cbdb86df8c14aeaad9d91f0a01fe2c758d3b12713c6492c0e`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-00.png`
- 内容/视觉核对：退款越权、D0全域校准、四环执行和确定性红线均有正文依据；中央扇出拥挤，D7两种决策语义叠线。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-00 / problem，匹配行44）；content/modules/agent-architecture-deep.ts（TD-AG-00 / counter，匹配行129）；content/modules/agent-architecture-deep.ts（TD-AG-00 / dimensions.caption，匹配行90）；content/modules/agent-architecture-deep.ts（TD-AG-09 / failureModes，匹配行799）

1. **P2：D7常规规则/具名接受与硬规则直接阻断使用完全同一路径；中央D0扇出与反馈也过密。**
   - 证据：截图D7下方只有一条竖直红线；candidate的d7→decision控制边与风险边d完全相同（M677 1134.1至677 1272.27）。D0下多条棕虚线与青反馈近并行，D5/护栏周围又交叉。正文要求红线独立于具名接受；TD-M04把短主链与外围反馈分层。
   - 建议：分开规则证据与硬阻断的端口/路径；把D0校准作为上层控制总线，反馈绕外缘，红线独立走线。

## TD-AG-01 - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-01.svg`
- SHA-256：`c97a91147be9b7e940febfd0a85f2de944fb9f4a24ba18f39dcbf83e5eeb0f52`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-01.png`
- 内容/视觉核对：人工金标、人人/人机一致性、换版重校准与停用回退一致；中央主证据线的标签与实际路径分离。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-01 / repair，匹配行65）；content/modules/agent-architecture-deep.ts（TD-AG-01 / failureModes.caption，匹配行177）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-01 / summary，匹配行5471）

1. **P2：Judge到分歧矩阵的主证据标签离所属边过远，并与回退/校准标签混在中央。**
   - 证据：实际主边为两框之间的水平紫线；“逐样本判定”却在其上方，与“扰动候选”“独立人类标签”“回退人审”集中，需靠细点引线查归属；stop→human也穿同一区域。正文TD-AG-01要求分开评分、金标与停用回退。
   - 建议：逐样本判定就近标在水平边；gold/probe分侧进入，停用回退和修rubric回路走外围。

## TD-AG-02 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-02.svg`
- SHA-256：`faa94e5532c97c09594f7a5575ac1d6d5ac88d79cb16a19776bd47eedfaa509e`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-02.png`
- 内容/视觉核对：refund_order即Step失败、安全替代路径及三层Oracle不互相抵消均正确；主体可读，单个标签位置可优化。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-02 / scenario，匹配行78）；content/modules/agent-architecture-deep.ts（TD-AG-02 / terms，匹配行271）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-02 / summary，匹配行6181）

1. **P3：Step blocker标签与水平红线分离过远。**
   - 证据：首错位置→Trajectory是水平红线，“Step blocker不可抵消”却在两框下方、跨过青色长反馈线，需细点引线回找；内容正确。
   - 建议：把标签放回红线附近，长反馈移至外缘。

## TD-AG-03 - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-03.svg`
- SHA-256：`185e37574fa6f1e770a420330f468a8fa24df853444b30a0e27ea69b0139b7d5`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-03.png`
- 内容/视觉核对：五事实三跳、语义契约、隔离、三重熔断及Owner职责一致；中部多重交叉妨碍事实链追溯。
- 实际读取来源：content/modules/agent-architecture-deep.ts（TD-AG-03 / dimensions，匹配行306）；content/modules/agent-architecture-system.ts（TD-AG-03 / workflow，匹配行93）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-03 / summary，匹配行6882）

1. **P2：事实核对、故障注入与修复回路形成多重交叉，审计路径难以追踪。**
   - 证据：A区“源头事实锚点”“最小上下文”“空结果或超时”附近，A→facts紫线、fault→handoff红线、owner→handoff青线及fault→B红线交叉；两条紫核对箭头挤在facts左上角。正文重点是逐跳核对五个事实，当前难区分证据与注入。
   - 建议：事实核对放独立审计侧栏，A/B短接；故障从另一侧进入，Owner修复沿外缘返回handoff。

## TD-AG-04 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-04.svg`
- SHA-256：`751355baa76839d4724e1947095d84557ffd51e6c005288bbcb7eaf86113842a`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-04.png`
- 内容/视觉核对：写前零副作用、写后撤销/补偿或人工接管、交回后新状态及确认四要素均正确；分支、留白和字号清楚。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-04 / problem，匹配行108）；content/modules/agent-architecture-deep.ts（TD-AG-04 / failureModes，匹配行394）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-04 / summary，匹配行7583）

未发现明确阻断或需单列的偏好问题。

## TD-AG-05 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-05.svg`
- SHA-256：`948da4f375a93469f7dcdde114dc6a2501486596572973e58ab93b4770edbb34`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-05.png`
- 内容/视觉核对：至少一次/全部成功均按任务聚合；状态重置、聚类/配对区间及Horizon未知边界正确；中文孤字换行略粗糙。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-05 / workflow，匹配行125）；content/modules/agent-architecture-system.ts（TD-AG-05 / repair，匹配行129）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-05 / summary，匹配行8277）

1. **P3：卡片中文短语出现单字孤行，精致度弱于参考。**
   - 证据：任务集“四维版本”的“本”单独换行；Metric Card“样本量理由”的“由”和“配置”的“置”成为孤行。可读，未改变统计语义。
   - 建议：按短语手动断行或略增宽，避免中文末字独占行。

## TD-AG-06 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-06.svg`
- SHA-256：`80af7b288e2d77a34d6e7ad4199bfcf749bad73f751f8c6371304bc7a2aaddbe`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-06.png`
- 内容/视觉核对：不可信输入、rug-pull、记忆污染与委托边界一致；工具写前授权、实际回执、阻断层和零成功限制齐备；分层可读。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-06 / workflow，匹配行141）；content/modules/agent-architecture-deep.ts（TD-AG-06 / artifactNote，匹配行574）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-06 / summary，匹配行9009）

未发现明确阻断或需单列的偏好问题。

## TD-AG-07 - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-07.svg`
- SHA-256：`15d8560b223c420712f61dc8fb1a3399f4b15eff495a9129baa225753b87ae1b`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-07.png`
- 内容/视觉核对：workload、queue、LLM、tool attempt、成功分母、成本尾部与四类硬预算均正确；双向共线及成本线群拥挤。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-07 / workflow，匹配行157）；content/modules/agent-architecture-deep.ts（TD-AG-07 / artifactNote，匹配行649）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-07 / summary，匹配行9739）

1. **P2：LLM与Tool请求/返回反向共线，下一层预算和观测线集中交叉。**
   - 证据：candidate的llm→tool和tool→llm都沿y=440.5；截图蓝/青线叠在两框之间。其下“生成消耗”“累计工具与重试成本”“调用与重试账本”挤在预算/尾部框上方的交叉区。正文要求逐attempt分清重试与消耗。
   - 建议：请求/返回设置上下分开的短边；预算累计与指标观测分泳道，标签靠各自路径。

## TD-AG-08 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-08.svg`
- SHA-256：`9ad97dca7a54ff6647374be188356cbdc7a3d86aafe3508d46f4495d2bed1bb9`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-08.png`
- 内容/视觉核对：四维版本、具名接受、硬规则阻断、审计缺失UNKNOWN与成组回滚正确；中央反馈线可精简，主体仍可追踪。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-08 / expected，匹配行175）；content/modules/agent-architecture-deep.ts（TD-AG-08 / failureModes.caption，匹配行704）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-08 / summary，匹配行10451）

1. **P3：回滚恢复反馈贯穿版本与审计线群，标签引线较长。**
   - 证据：“四维成组回滚→四维版本”青竖线穿过“调用与状态回执”“任一维改变”“锁Judge可比证据”区域，“恢复已测四维组合”用长点引线连接；主体仍可辨。
   - 建议：恢复反馈绕外侧，缩短引线。

## TD-AG-09 - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-09.svg`
- SHA-256：`c2b93e2263a47ac31445279d4488342c7599e5852c22d60fdbb1f90ecbe454d7`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-09.png`
- 内容/视觉核对：四环成熟度、D0失效、统计FAIL、不足仍非PASS和无护栏不得接受均正确；两组不同条件被同路径叠画。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-09 / scenario，匹配行190）；content/modules/agent-architecture-deep.ts（TD-AG-09 / thesis，匹配行759）；content/modules/agent-architecture-deep.ts（TD-AG-08 / voice.takeNote，匹配行718）；public/materials/agent-architecture-system/docs/11-three-stage-gate.md（11.5 / 三段之间的关系，匹配行96）

1. **P2：不同门禁条件被同路径叠画，无法逐线区分。**
   - 证据：stats→risk的“证据充分且满足合同”与“证据不足，仅作有限具名决定”d完全相同；risk→stop的“无护栏覆盖，强制拒绝接受”风险边与“不接受或到期回滚”控制边也d完全相同。截图两组条件被挤到共享路径两侧。正文11-three-stage-gate.md §11.5区分统计不足和署名决定，无护栏必须拒绝。
   - 建议：充分/不足分出口或合并成清楚枚举条件；强制拒绝与到期回滚分开走线，风险红线不得被控制虚线盖住。

## TD-AG-10 - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/TD-AG-10.svg`
- SHA-256：`5d4dc5662575770600e77fea86ed71cf3132642f5d2178232c7869aa75cdb046`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__TD-AG-10.png`
- 内容/视觉核对：陈旧行情建议UNKNOWN/执行拒绝、物理隔离、工具额度、双人审批、停止补偿对账正确；主链可读，少数标签引线过长。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-10 / scenario，匹配行206）；content/modules/agent-architecture-system.ts（TD-AG-10 / workflow，匹配行205）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-10 / summary，匹配行11895）

1. **P3：主控制链的短标签被移到远处。**
   - 证据：“工具强制额度”在沙箱→额度水平边下一整层；“有效签字后”也在审批→执行边下方，邻近新鲜度失败长红线。内容正确但需点引线回找。
   - 建议：标签贴各自水平短边，超时失败线绕外围。

## AG-DIM-ARCHITECTURE - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg`
- SHA-256：`0290c24e8de6f9eb33000a1416f7ff1997dd4ba064734b8d567316c0f9788f50`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-ARCHITECTURE.png`
- 内容/视觉核对：D0、行为域、安全、成本、治理与责任均保留；四环直接驱动D4缺失，D7双语义叠线和底部线束需修。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-00 / workflow，匹配行45）；content/modules/agent-architecture-system.ts（TD-AG-00 / expected，匹配行47）；content/modules/agent-architecture-deep.ts（TD-AG-00 / dimensions.caption，匹配行90）；content/modules/agent-architecture-deep.ts（TD-AG-09 / failureModes，匹配行799）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-00 / summary，匹配行4659）

1. **P2：D7责任证据与硬规则blocker叠画；决策输入箭头过密。**
   - 证据：candidate中business→decision的control与risk两条path完全同d。截图D4/D6/D7的紫棕红线和两条青反馈都挤在决策上沿，“已证硬规则违规直接阻断”远移至右上，以长点引线连回。
   - 建议：D7责任证据/硬阻断用独立端口，决策输入按证据/红线分组，反馈绕外缘。

2. **P2：四证据环缺少明确驱动D4可靠性的执行关系。**
   - 证据：截图与candidate paths中rings只连behavior、security、cost，没有rings→distribution。实际agent-architecture-deep.ts TD-AG-00 counter明确“四个环是横向驱动D1/D4/D5/D6的”；当前D4只有校准、轨迹输入与决策输出。
   - 建议：补四环→D4的重复/回放执行边，并保证能独立追踪。

## AG-DIM-FOUR-RINGS - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-FOUR-RINGS.svg`
- SHA-256：`9cd3e866a18179dac79252c8d9ef6efb41254deb0976ba43e8f80707a9832805`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-FOUR-RINGS.png`
- 内容/视觉核对：entry/exit/owner/rollback、影子不生效、灰度另需边界与真实环NOT_RUN正确；主图细字过小，与B/C字号失衡。
- 实际读取来源：content/modules/agent-architecture-deep.ts（TD-AG-09 / artifactNote，匹配行797）；docs/svg-redesign-2026-10-26/body-sources/agent-architecture-original.txt（五 / 环3影子模式，匹配行517）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-AG-09 / summary，匹配行11159）

1. **P2：主图整体缩小造成细字，主体与B/C区字号明显失衡。**
   - 证据：原尺寸1600×1871截图四环节点约230px宽，内部字和边标签约14-16px；A区上下仍有大块空白。batch minGraphScale=0.64947与观察一致。判定来自实际查看：主图细项辨读比B/C明显费力，弱于TD-M04主链的字号层级。
   - 建议：A区做真正四列比较卡并放大正文，合同/出口用短连接或分行条带，避免整张自动路由统一缩小。

## AG-DIM-GATE - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-GATE.svg`
- SHA-256：`08f48ceb7b1c60d88a00deb2eb897aaa1e26818f95c9738b5123bffd884111b9`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-GATE.png`
- 内容/视觉核对：三段、D0失效直接阻断、统计不足仍非PASS与护栏再接受均核对正文；统计分支标签与补证回路需整理。
- 实际读取来源：content/modules/agent-architecture-system.ts（TD-AG-09 / workflow，匹配行189）；content/modules/agent-architecture-system.ts（TD-AG-05 / failure，匹配行128）；content/modules/agent-architecture-deep.ts（TD-AG-08 / voice.takeNote，匹配行718）；public/materials/agent-architecture-system/docs/11-three-stage-gate.md（11.5 / 三段之间的关系，匹配行96）

1. **P2：统计FAIL标签离所属边过远，补证回路穿越主门禁分支。**
   - 证据：截图统计证据→BLOCKED为水平红线，“证据充分但未满足”却在下方、靠近统计→证据不足的斜红线；青色补证反馈又穿过“红线通过”和“预声明统计合同”区域，三种统计结论难快速对应。
   - 建议：统计满足/未满足/不足采用同一层三个出口，就近标条件；补证回路绕左外侧，BLOCKED保持右侧独立通道。

## AG-DIM-36 - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-36.svg`
- SHA-256：`475c07fa0573ea1ca8d98749d900bfb22d43be6a47cb3715a1d9b13836819727`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-36.png`
- 内容/视觉核对：已逐项对照原文36维：4+5+4+4+5+6+4+4=36，名称齐全且未搬用默认数值阈值；缺依赖和运行反馈图。
- 实际读取来源：docs/svg-redesign-2026-10-26/body-sources/agent-architecture-original.txt（四 / 36维明细，匹配行242）；docs/svg-redesign-2026-10-26/body-sources/agent-visual-source.original.json（agent-36-dimensions / caption，匹配行97）；content/modules/agent-architecture-deep.ts（TD-AG-00 / dimensions.caption，匹配行90）；content/modules/agent-architecture-deep.ts（TD-AG-09 / failureModes，匹配行799）

1. **P2：36维列表完整，但spec要求的域间依赖、四环、护栏、具名决定和失败回灌未渲染。**
   - 证据：截图只有D0-D7八张列表卡；candidate除页脚5条图例path外没有实际关系path，也无四环/护栏/具名决定节点。spec包含11个nodes、22条edges，outcome要求“36项逐维覆盖、八域依赖及运行反馈索引”；agent-visual-source.original.json也明确要求上述结构。页首一句说明不能替代关系图。
   - 建议：保留36维清单，在上方或下方另补紧凑依赖图，包含D0校准、四环执行、D5护栏、D7决定及失败回灌，不把长边穿进列表。

## AG-DIM-RELIABILITY - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-RELIABILITY.svg`
- SHA-256：`68eb8a69d200f9acd0bec5836b03b9fd2ab924768de6c39cd8a1fc6c00534703`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-RELIABILITY.png`
- 内容/视觉核对：按N个任务聚合经验pass@k/pass^k，iid幂假设、任务聚类、Wilson可配置、配对区间与Horizon未知边界正确；版面清楚且无伪造曲线。
- 实际读取来源：content/modules/agent-architecture-deep.ts（TD-AG-05 / terms，匹配行498）；content/modules/agent-architecture-deep.ts（TD-AG-05 / terms，匹配行499）；content/modules/agent-architecture-system.ts（TD-AG-05 / expected，匹配行127）

未发现明确阻断或需单列的偏好问题。

## career-role-comparison - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-role-comparison.svg`
- SHA-256：`a19cdb762027f4525be5efe1c5edda26585f854ffd6126af5a3230adeb4cef69`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-role-comparison.png`
- 内容/视觉核对：角色目标与原文一致，共同工程底座、独立Oracle与发布责任边界正确；三角色清楚，中央短交叉可精简。
- 实际读取来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（1.0 / 核心职责，匹配行24）；content/modules/career-evolution.ts（TD-C02 / control，匹配行79）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-F01 / summary，匹配行10）

1. **P3：共同底座和质量证据斜线中央交叉，可进一步精简。**
   - 证据：base→AI开发蓝线与传统测试→质量证据紫线相交，“支撑工程实现”“软件控制证据”位于交叉两侧；当前仍能追踪，角色边界未改变。
   - 建议：底座改为上方横条，三角色短接，质量证据置于下方汇总。

## career-capability-mindmap - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-capability-mindmap.svg`
- SHA-256：`29abe656af9927abd254b815ed322a32f7dc23d596e7e07538125842c031bdaf`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-capability-mindmap.png`
- 内容/视觉核对：五类能力到工件、故障、独立复评连接正确，未作为个人评分；中央输入线束和双向共线需修。
- 实际读取来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（1.1 / 能力维度框架，匹配行80）；content/modules/career-evolution.ts（TD-C03 / action，匹配行108）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-F05 / summary，匹配行2766）

1. **P2：三条证据输入接近粘合，证据中心与项目决定的正反向边共线。**
   - 证据：截图测试专业直线与两侧紫色曲线在证据中心上方汇成细密束，“检测依据与用例”位于汇聚处。candidate evidence→decision与decision→evidence均沿x=677反向绘制，棕/青虚线同位置，独立复评与补件反馈难分。
   - 建议：五条输入用分开端口或径向布局；决定/补件两方向分左右路由并各自贴近标签。

## career-capability-allocation - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-capability-allocation.svg`
- SHA-256：`49c89b3a74735104619c19e86f9863d8e99e46cb8032268d46bbaf50cf3c7a44`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-capability-allocation.png`
- 内容/视觉核对：30/25/25/15/5与实际来源一致且合计100%；SOURCE-EXAMPLE、policy/owner和INTERNAL-UNKNOWN明确；比例、图例、对齐及留白良好。
- 实际读取来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（1.1 / 能力占比图，匹配行200）；docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（1.1 / 能力占比图，匹配行204）；content/modules/career-evolution.ts（TD-C04 / expected，匹配行134）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-C04 / summary，匹配行2158）

未发现明确阻断或需单列的偏好问题。

## career-evidence-lifecycle - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-evidence-lifecycle.svg`
- SHA-256：`dd49ad7e21bacb9ba3a7d849a25c34be049be41c26abfe07d9852850f8f211a4`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-lifecycle.png`
- 内容/视觉核对：主张、原始工件、mutation、独立review、限定应用与复评闭合；总工时含复核返工，未以候选数证明提效；局部标签可优化。
- 实际读取来源：content/modules/career-evolution.ts（TD-T26 / counterexample，匹配行182）；content/modules/career-evolution-deep.ts（TD-T26 / mechanism，匹配行1894）；content/modules/career-evolution-deep.ts（TD-C03 / mechanism，匹配行775）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-T26 / summary，匹配行3376）

1. **P3：失败收据和接受范围标签集中在中部，需长点引线辨认。**
   - 证据：“失败与修复收据”实际对应fault→review水平紫线，却在fault→UNKNOWN红线、review→apply斜虚线附近；可读但检索成本较高。
   - 建议：成功证据/失败出口分两侧，缩短收据与接受范围引线。

## career-responsibility-ladder - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-responsibility-ladder.svg`
- SHA-256：`c2eb1f367720f25f6f8bd9a0e9083e77494974c359e572003eb4bbba7d1e8afd`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-responsibility-ladder.png`
- 内容/视觉核对：四状态采用当前canonical命名，按领域判断、明确授权与组织policy未知边界均保留；递进缩进易读，未按年限/P5-P9授级。
- 实际读取来源：content/modules/career-evolution.ts（TD-C02 / workedExample，匹配行81）；content/modules/career-evolution-deep.ts（TD-C02 / mechanism，匹配行408）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-C02 / summary，匹配行855）

未发现明确阻断或需单列的偏好问题。

## career-evidence-radar - REWORK

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-evidence-radar.svg`
- SHA-256：`219895f49788019dd067f3ffe030377ce0d673789e0e89e7a3e855f4233b176a`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-radar.png`
- 内容/视觉核对：没有实测而保留UNKNOWN矩阵正确，目标需owner确认；表格对齐清晰，但缺下一工件/路由/reviewer/复评日期出口。
- 实际读取来源：content/modules/career-evolution-deep.ts（TD-C03 / counter，匹配行892）；content/modules/career-evolution.ts（TD-C03 / expected，匹配行109）；docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（3.1 / 职级能力雷达图对比，匹配行591）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-C03 / summary，匹配行1494）

1. **P2：矩阵缺少承诺的下一工件和复评出口。**
   - 证据：截图只有“能力域/当前可打开的证据/本次任务的目标要求”三列，五行UNKNOWN没有next_artifact、route_page、reviewer、review_date位置。spec gap节点和outcome明确含下一工件；career-evolution.ts TD-C03 action要求gap_route/next_artifact/reviewer，summary要求复评日期。B区泛称补工件不能使矩阵直接闭合行动。
   - 建议：增加逐维“下一最小工件/页面路由”列或五行行动表，提供reviewer/复评日期待填字段；未知信息不虚构。

## career-evidence-gantt - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-evidence-gantt.svg`
- SHA-256：`21e3d6a6cd0947b5a8a3339df3d2294b33d1b2f720f54ca7ac356e12c8e9de47`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-gantt.png`
- 内容/视觉核对：A/B/C和TD-C03示例一致，30/60/90非工期或晋升承诺；缺样本停止、mutation未打红回Oracle、分歧升级均保留；等宽窗口清楚。
- 实际读取来源：content/modules/career-evolution.ts（TD-C03 / workedExample，匹配行106）；content/modules/career-evolution.ts（careerWave6Expansion / TD-C03，匹配行271）

1. **P3：下一轮计划记录入口偏概括。**
   - 证据：A/B/C入口和失败条件已表达，但spec next节点的更新路由/复评日期未形成记录条目；C区只泛称交付复评计划。
   - 建议：底部判据条补next_artifact/reviewer/next_review待填入口，保留顺序窗口非工期边界。

## career-background-paths - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-background-paths.svg`
- SHA-256：`0ec364358ebad68a93701d5fde7ffc51e691d90d573e35ca3a439adaa0ac3d43`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-background-paths.png`
- 内容/视觉核对：三类背景只改先修顺序，checked_at/limits/fallback与共同项目复评出口正确；无月份达标保证，箭头、字号和留白可接受。
- 实际读取来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（4 / 不同背景的学习路径图，匹配行1272）；content/modules/career-evolution.ts（TD-R01 / action，匹配行208）；docs/svg-redesign-2026-10-26/body-sources/material-pages.json（TD-R01 / summary，匹配行4031）

未发现明确阻断或需单列的偏好问题。

## career-priority-quadrant - PASS

- SVG：`output/svg-release-20261026/candidate/public/materials/career-evolution/visuals/career-priority-quadrant.svg`
- SHA-256：`a729f0dfe8d948520e897a0c98f55e337d82199eb736839cc0d4299c85af97a3`
- 截图：`output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-priority-quadrant.png`
- 内容/视觉核对：重要性由owner、成熟度由证据定义；轴向与四类行动一致，未知待定位；定性类别和非个人测量边界明确，版面清楚。
- 实际读取来源：docs/svg-redesign-2026-10-26/body-sources/career-development-original.md（5.1 / 能力发展四象限图，匹配行1360）；docs/svg-redesign-2026-10-26/body-sources/career-visual-source.original.json（career-priority-quadrant / caption，匹配行245）

未发现明确阻断或需单列的偏好问题。

修复与发布由主代理负责。审查者只写指定materials.json/materials.md，未修改图片、源码、正式资源或他人文件。修订后应重新生成截图并按新hash复审阻断项；当前不应替换部署。
