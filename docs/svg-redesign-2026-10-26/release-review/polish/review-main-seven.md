# 七图独立 SVG 复审：round4 架构返工复审

AG-DIM-ARCHITECTURE 与 TD-AG-00-compat 均新实看 1600×5352 全宽全高，并逐项核对 22 条实际边和 10 个完整节点正文。两条旧外轨 P3 实质关闭；当前两图未发现新的 P1/P2/P3。其余五图按 SVG、PNG、scoped spec、正文和来源 exact SHA 继承上轮实看结论。七图均 PASS。

本轮只对两图新调用 view_image：每图四张裁块 y=0–1799 / 1600–3399 / 3200–4999 / 4800–5351，x=0–1599，重叠 200px。其他五图未冒充本轮新实看。旧报告及旧图 SHA 由 before-architecture 存档保留。

未修改任何 SVG/spec/renderer/正式 release-review/历史存档，未提交部署。

| ID | verdict | 证据方式 | 当前 findings |
| --- | --- | --- | --- |
| TD-PS05 | PASS | exact SHA 继承 round2 | 无 |
| TD-PS06 | PASS | exact SHA 继承 round2 | 无 |
| AG-DIM-GATE | PASS | exact SHA 继承 round2 | 无 |
| AG-DIM-ARCHITECTURE | PASS | round4 新实看 | 无 |
| TD-AG-00-compat | PASS | round4 新实看 | 无 |
| AG-DIM-36 | PASS | exact SHA 继承 round2 | 无 |
| career-evidence-gantt | PASS | exact SHA 继承 round2 | 无 |

## TD-PS05 — PASS

- path：visuals/course/TD-PS05.svg
- 候选：[output/svg-release-20261027-polish/candidate/public/visuals/course/TD-PS05.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/visuals/course/TD-PS05.svg)
- sha256：bdb94e1aae2a42c575ff2ddfd1bab49fb1207329edda1991e6fbd5912b022c01
- 截图：[output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS05.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS05.png)
- screenshot_sha256：9b17f96503dbb72b0e9cd3395d5fea77b42a22c79d241d5d58f1f4557a483626
- visual_inspected：true；body_checked：true；本轮新实看：false
- 证据方式：EXACT_SHA_INHERITED

正文核对（继承上轮实读，来源 SHA 再确认一致）：对照 course-1.json 的 TD-PS05：DOM 属性/规则、真实键盘与读屏任务、冻结视觉骨架分别取证；incomplete 与未分类差异进入具名人工；矩阵裁剪、基线审批和未测组合边界保留。图上 01/02/03 是同一矩阵分派的并行范围，不是三类检查的执行依赖。

视觉核对（继承上轮实看）：07 规则结果、08 任务记录、09 快照与差异分别进入证据卡；05 名称与流程含义进入人工卡。人工卡上方 y≈1730–1820 的交叉有白底跨线桥，04/06/05 和 07/09/08 独立编号端口可回追，未再出现旧图中央两条紫色曲线无桥交叉。全图文字、边界与图例无裁切。

旧问题关闭证据：

- resolved=true：原 P3 已关闭：原人工复核入口附近同色证据线无桥交叉，已改为独立外轨、跨线桥和对应编号。实际沿 05 追到人工卡、沿 07/08/09 追到组合证据卡确认；结论来自新截图像素，不来自哈希变更。 来源：docs/svg-redesign-2026-10-26/release-review/course-1.json

当前 findings：[]。本次检查未发现新的视觉或图形语义问题。

继承依据：output/svg-release-20261027-polish/review-main-seven-before-architecture.json；报告 SHA256：74638444fd2d8f33effd2f0c97cec650788cc4ebb2bb37755fa610cbb1000250。SVG、PNG、scoped spec、正文快照及每个来源 SHA 均已重新核验一致；以下是 round2 的实际查看范围。

实际查看范围（全宽 x=0–1599，继承 round2）：

- y=0–1799：[review-main-seven-TD-PS05-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-PS05-y0-1799.png)；SHA256：72301f1e08acf771276daf8990f6712bbb17f32124aac526869638125e6c675b
- y=1600–3240：[review-main-seven-TD-PS05-y1600-3240.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-PS05-y1600-3240.png)；SHA256：5b4a223e219c1da366c08f42bf39803be195aa97e0c240e6f5cf7dcfa0668a5d

spec：scripts/visuals/specs/course-1.mjs；scoped spec SHA256：ac271f54375f3def7e50bd8131bf9d06b4e8e3f4676157706830e75c6c17ac01
正文快照：docs/svg-redesign-2026-10-26/body-sources/course-1.json；SHA256：4b85937ba7df233cec33c3647935009698e279174001cf428be59f61be96a42e

正文定位与来源 SHA 详见 JSON：

- docs/svg-redesign-2026-10-26/body-sources/course-1.json → TD-PS05 / 无障碍能自动化到哪一步，剩下的为什么必须人来
- docs/svg-redesign-2026-10-26/body-sources/course-1.json → TD-PS05 / 分开验证语义、键盘与视觉基线

## TD-PS06 — PASS

- path：visuals/course/TD-PS06.svg
- 候选：[output/svg-release-20261027-polish/candidate/public/visuals/course/TD-PS06.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/visuals/course/TD-PS06.svg)
- sha256：0d6253d46477e9727d5da4b4c3e1b872f83330a5cb497643f59899563c171d28
- 截图：[output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS06.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS06.png)
- screenshot_sha256：649394486ab487a699ecbb043cf82a2888342753036e24cf32e2ada8b19fc48f
- visual_inspected：true；body_checked：true；本轮新实看：false
- 证据方式：EXACT_SHA_INHERITED

正文核对（继承上轮实读，来源 SHA 再确认一致）：对照 TD-PS06 的仓库收货场景、生命周期恢复、权限与完成条件：拒绝不创建记录，扫描状态持久化，同一 receipt_id 重放只入账一次；客户端 logcat、服务 Trace 与独立库存账本分开；权限缺失不改发云端，设备未运行不宣称兼容。

视觉核对（继承上轮实看）：06 青色恢复线自恢复卡顶端 x≈1018 向上，到 y≈1102 向左，再沿 x≈165 外轨上返队列底部独立 06 端口。05 恢复契约走右侧，08 客户端故障证据走右侧，04 故障标签仍贴红边。跨越 03 网络恢复线处有跨线处理，无合流歧义。

旧问题关闭证据：

- resolved=true：原 P3 已关闭：恢复待同步项不再先绕恢复节点右上并跨过控制/证据线；已实际确认 06 左侧独立外轨，且标签、箭头和队列端口对应一致。 来源：docs/svg-redesign-2026-10-26/release-review/course-1.json

当前 findings：[]。本次检查未发现新的视觉或图形语义问题。

继承依据：output/svg-release-20261027-polish/review-main-seven-before-architecture.json；报告 SHA256：74638444fd2d8f33effd2f0c97cec650788cc4ebb2bb37755fa610cbb1000250。SVG、PNG、scoped spec、正文快照及每个来源 SHA 均已重新核验一致；以下是 round2 的实际查看范围。

实际查看范围（全宽 x=0–1599，继承 round2）：

- y=0–1799：[review-main-seven-TD-PS06-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-PS06-y0-1799.png)；SHA256：b1915e45bcf3f687c5855a330270609098c229b215fa786fbaee86c8a8dbc195
- y=1600–2697：[review-main-seven-TD-PS06-y1600-2697.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-PS06-y1600-2697.png)；SHA256：361b5d66f6c061b9f3a606075afcb6221fbbd8c8737ed8cef62536dc92c2b527

spec：scripts/visuals/specs/course-1.mjs；scoped spec SHA256：72ea5686d2ab8dd6ee994707c6ffc85bfe2066c4bf7c4cccdca7e18fff0a22e3
正文快照：docs/svg-redesign-2026-10-26/body-sources/course-1.json；SHA256：4b85937ba7df233cec33c3647935009698e279174001cf428be59f61be96a42e

正文定位与来源 SHA 详见 JSON：

- docs/svg-redesign-2026-10-26/body-sources/course-1.json → TD-PS06 / 场景：仓库收货不能丢扫描状态
- docs/svg-redesign-2026-10-26/body-sources/course-1.json → TD-PS06 / 重放 Android 生命周期且不重复入账

## AG-DIM-GATE — PASS

- path：materials/agent-architecture-system/visuals/AG-DIM-GATE.svg
- 候选：[output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-GATE.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-GATE.svg)
- sha256：5ff7d24dfe5accd82e54802832a04887cae0bfb8a337462f93d8ff324ed1de46
- 截图：[output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-GATE.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-GATE.png)
- screenshot_sha256：5796a4d4ceea7c1572e136f9da5e679a6af387cc4bcd01118f2c3c75fe417f30
- visual_inspected：true；body_checked：true；本轮新实看：false
- 证据方式：EXACT_SHA_INHERITED

正文核对（继承上轮实读，来源 SHA 再确认一致）：对照 material-pages.json 的 TD-AG-09、当前 sourceRefs 和三段门禁文档 11.5/11.6：硬红线或 D0 失效直接 BLOCKED；统计满足、充分但未满足、证据不足三分支可辨；不足保留原状态，经有效护栏后仅可具名有限决定；不由流水线签发布。

视觉核对（继承上轮实看）：14 补新证据后再审走 x≈165 左侧外轨，15 修复并保留失败回灌走 x≈1456 右侧外轨，分别回到证据包底部 x≈539 和 x≈615 独立端口。顶端两反馈分层 y≈627/641，不再长段贴行；政策线穿越处有桥。06/07/08 的统计分支和 10/13 的拒绝分支端点均可追回。

旧问题关闭证据：

- resolved=true：原 P3 已关闭：两条回灌现在分走左右外围，并有 14/15 独立端口、标签与跨线桥。实际完整追踪至候选证据包，未用旧 round1 overview 代替。 来源：docs/svg-redesign-2026-10-26/release-review/materials.json

当前 findings：[]。本次检查未发现新的视觉或图形语义问题。

继承依据：output/svg-release-20261027-polish/review-main-seven-before-architecture.json；报告 SHA256：74638444fd2d8f33effd2f0c97cec650788cc4ebb2bb37755fa610cbb1000250。SVG、PNG、scoped spec、正文快照及每个来源 SHA 均已重新核验一致；以下是 round2 的实际查看范围。

继承的来源对齐备注：正文快照 TD-AG-09 的完成标准 caption 仍有“统计不过不进风险接受”的概括，可能将不足与 FAIL 混读；本图明确区分二者，符合当前 spec 引用的 11-three-stage-gate.md §11.5。该来源措辞是已有正文歧义，本轮未修改正文，也未把它误报为图中新引入的关系。

实际查看范围（全宽 x=0–1599，继承 round2）：

- y=0–1799：[review-main-seven-AG-DIM-GATE-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-GATE-y0-1799.png)；SHA256：cd36b76b1e72c6d183bba84a2d45bf63bedd8f4dd039364b09cbdd6c4ed46766
- y=1600–3399：[review-main-seven-AG-DIM-GATE-y1600-3399.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-GATE-y1600-3399.png)；SHA256：7c9f0c9a850447ac1cd92bbf7a345ff8264dca87e44efe7da3c0d2edb42a1b4f
- y=3200–4052：[review-main-seven-AG-DIM-GATE-y3200-4052.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-GATE-y3200-4052.png)；SHA256：daffcdc74ec265466c94db09e6dcabb9d2d500cccd69afa66a4a603754c55b52

spec：scripts/visuals/specs/materials.mjs；scoped spec SHA256：cc009d7da1c02eb2ed65a246115547c24129d3360397847600d25709b8ee082a
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位与来源 SHA 详见 JSON：

- content/modules/agent-architecture-system.ts → TD-AG-09 / workflow
- content/modules/agent-architecture-system.ts → TD-AG-05 / failure
- content/modules/agent-architecture-deep.ts → TD-AG-08 / voice.takeNote
- public/materials/agent-architecture-system/docs/11-three-stage-gate.md → 11.5 / 三段之间的关系

## AG-DIM-ARCHITECTURE — PASS

- path：materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg
- 候选：[output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg)
- sha256：8816c2511554538ea65c243bee14620bcc9f4ee90d369d6730fba8daa41dde19
- 截图：[output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-ARCHITECTURE.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-ARCHITECTURE.png)
- screenshot_sha256：9b3a690b56982d6310da0392a04e4975e27a3592c7c64149b5d6f729fa23cf79
- visual_inspected：true；body_checked：true；本轮新实看：true
- 证据方式：ROUND4_FRESH_VISUAL_AND_SEMANTIC_REVIEW

正文核对（本轮重新核对）：对照本轮当前 spec 的 10 个节点、22 条关系及 SHA 未变的 TD-AG-00 正文来源重新核对：D0 校准所有域评分，失准则全部评分不可用；四环按各自输入和覆盖范围横向驱动 D1–D3/D4/D5/D6；决策回灌输入并重校准 D0；安全越权和业务硬规则违规各自独立否决，不等待 Judge，也不以统计证据、总分或具名接受抵消。具名决定、独立 Oracle、停止状态与 owner 缺口以及 NOT_RUN 边界保留。

视觉核对（本轮实看）：本轮独立调用 view_image(detail=original) 查看四张 1600px 全宽裁块，覆盖 y=0–5351、每段重叠 200px。A1 校准五类评分并另列 07 失准限制；A2 09–12 从同一四环节点横向驱动四类对象，没有把四环逐一配给四域；A3 01/08、21/22 分别画输入轨迹和两种反馈；A4 13/14 接护栏，19/20 用左右独立红箭头直接进入同号决定；A5 15–18 为区间、成本、责任、停止回执的分离输入。顶端明确同号卡片是同一节点，不表示重复执行或先后放行。全图未见文字裁切、遮挡或标签归属不清；5352px 虽更长，分区标题和节点编号支持查找，未发现新的需优化 P3。

旧问题关闭证据：

- resolved=true：早期“决定入口过密”问题在当前五分区保持关闭：A4 的 19/20 硬阻断各走独立端口，A5 的 15–18 四条证据/责任输入落在 1100px 决策卡的分离端口；07 失准限制在 A1 独立显示。复用的是同一个 10 号语义节点，而不是多个先后放行关卡。 来源：docs/svg-redesign-2026-10-26/release-review/modules-aliases.json (shared architecture port issue)
- resolved=true：上一轮两图各一条“右侧同色外轨密集、长距离追线费力”P3 已实质关闭：五分区取消原 x≈1444–1486 的纵贯外轨，各边只在所属分区内短距离连接。独立解析实际 SVG 确认 22/22 条边都完全落在单个分区，最大纵向跨度为 233px；编号、边类型、标签和物理端点均与当前 spec 一一匹配。不是仅换 SHA 或删除长边：22 条关系每条恰绘一次，十个语义节点完整正文各至少呈现一次。 来源：output/svg-release-20261027-polish/review-main-seven-before-architecture.json

当前 findings：[]。本次检查未发现新的视觉或图形语义问题。

独立结构检查：22/22 条实际边的 ID、from/to、kind、可见标签及物理端点逐条匹配当前 spec，每边恰绘一次，无额外边；29 张引用卡对应 10 个语义节点，每个完整节点的全部正文至少可见一次。所有边均局限在一个分区，最大纵向跨度 233px。
同号节点解释：顶端可见文字明确“重复引用不表示重复执行或先后放行”。A1 失准限制、A4 两项独立硬否决、A5 具名决定是同一 10 号节点的不同局部关系，没有把硬否决变成评分权重或多个串行放行节点。
旧 SVG SHA256：42d937cb0cee473ae6e467465bf256ad1b85d9add9bcb8d944630140d0b6d46e；旧 PNG SHA256：150ea4853e9ef89bced19eb3a9442e4d0d711a224b3cb0b907c304311ee4ed15。新哈希与旧哈希不同，关闭依据是实际图面与关系核对。

实际查看范围（全宽 x=0–1599，round4）：

- y=0–1799：[review-main-seven-round4-AG-DIM-ARCHITECTURE-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-round4-AG-DIM-ARCHITECTURE-y0-1799.png)；SHA256：85fbf27682fea34ad2e2182ab3187d174a3c8366a21943536b877db821b8ca12
- y=1600–3399：[review-main-seven-round4-AG-DIM-ARCHITECTURE-y1600-3399.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-round4-AG-DIM-ARCHITECTURE-y1600-3399.png)；SHA256：b3be0d19981b0a7a032e7378310dbba97466ea3549d32ca32f927e13c6c84795
- y=3200–4999：[review-main-seven-round4-AG-DIM-ARCHITECTURE-y3200-4999.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-round4-AG-DIM-ARCHITECTURE-y3200-4999.png)；SHA256：45e2ebcfb08c2a56d655e6c02ca23e2b63e3dcfcfa43624c2aeb1ef305cda224
- y=4800–5351：[review-main-seven-round4-AG-DIM-ARCHITECTURE-y4800-5351.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-round4-AG-DIM-ARCHITECTURE-y4800-5351.png)；SHA256：bdaaa7939ef670520b123c80748994227fb2fb70780bd305c3f7a6dbe9008a83

spec：scripts/visuals/specs/materials.mjs；scoped spec SHA256：a132f32ddaf216cd1290d7e4e2a3f0b086435443a957fa864baaa03657199f5d
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位与来源 SHA 详见 JSON：

- content/modules/agent-architecture-system.ts → TD-AG-00 / workflow
- content/modules/agent-architecture-system.ts → TD-AG-00 / expected
- content/modules/agent-architecture-deep.ts → TD-AG-00 / dimensions.caption
- content/modules/agent-architecture-deep.ts → TD-AG-00 / counter
- content/modules/agent-architecture-deep.ts → TD-AG-09 / failureModes
- docs/svg-redesign-2026-10-26/body-sources/material-pages.json → TD-AG-00 / summary

22 条实际关系闭包：

| 编号 | from → to | kind | 可见标签 |
| --- | --- | --- | --- |
| 01 | input → behavior | data | 任务与状态流 |
| 02 | d0 → distribution | control | 校准分数使用 |
| 03 | d0 → behavior | control | 校准行为各域评分 |
| 04 | d0 → security | control | 校准安全评分 |
| 05 | d0 → cost | control | 校准资源评分 |
| 06 | d0 → business | control | 校准治理评分 |
| 07 | d0 → decision | control | 失准则所有评分不可用 |
| 08 | behavior → distribution | evidence | 完整轨迹 |
| 09 | rings → behavior | data | 各环执行 |
| 10 | rings → distribution | data | 各环重复与回放执行 |
| 11 | rings → security | data | 各环对抗 |
| 12 | rings → cost | data | 各环负载观测 |
| 13 | security → guard | control | 风险映射强制控制 |
| 14 | business → guard | control | 业务硬规则 |
| 15 | distribution → decision | evidence | 区间与失败切片 |
| 16 | cost → decision | evidence | 成本与暴露量 |
| 17 | business → decision | control | 规则与责任 |
| 18 | guard → decision | evidence | 拒绝与停止回执 |
| 19 | security → decision | risk | 已证越权直接 BLOCKED |
| 20 | business → decision | risk | 已证硬规则违规直接阻断 |
| 21 | decision → input | feedback | 失败回灌 |
| 22 | decision → d0 | feedback | Judge 重校准 |

## TD-AG-00-compat — PASS

- path：visuals/course/TD-AG-00.svg
- 候选：[output/svg-release-20261027-polish/candidate/public/visuals/course/TD-AG-00.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/visuals/course/TD-AG-00.svg)
- sha256：b6ec2fc298064c728e13d619e7a1c12b76b0b5ece0d3c2bae1be4949003241da
- 截图：[output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AG-00.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AG-00.png)
- screenshot_sha256：1c656e8996dff2a53397c310113515584587b73b18921f4b0644a3ff7e3ea23b
- visual_inspected：true；body_checked：true；本轮新实看：true
- 证据方式：ROUND4_FRESH_VISUAL_AND_SEMANTIC_REVIEW

正文核对（本轮重新核对）：对照本轮当前 spec 的 10 个节点、22 条关系及 SHA 未变的 TD-AG-00 正文来源重新核对：D0 校准所有域评分，失准则全部评分不可用；四环按各自输入和覆盖范围横向驱动 D1–D3/D4/D5/D6；决策回灌输入并重校准 D0；安全越权和业务硬规则违规各自独立否决，不等待 Judge，也不以统计证据、总分或具名接受抵消。具名决定、独立 Oracle、停止状态与 owner 缺口以及 NOT_RUN 边界保留。

视觉核对（本轮实看）：本轮独立调用 view_image(detail=original) 查看四张 1600px 全宽裁块，覆盖 y=0–5351、每段重叠 200px。A1 校准五类评分并另列 07 失准限制；A2 09–12 从同一四环节点横向驱动四类对象，没有把四环逐一配给四域；A3 01/08、21/22 分别画输入轨迹和两种反馈；A4 13/14 接护栏，19/20 用左右独立红箭头直接进入同号决定；A5 15–18 为区间、成本、责任、停止回执的分离输入。顶端明确同号卡片是同一节点，不表示重复执行或先后放行。全图未见文字裁切、遮挡或标签归属不清；5352px 虽更长，分区标题和节点编号支持查找，未发现新的需优化 P3。

旧问题关闭证据：

- resolved=true：早期“决定入口过密”问题在当前五分区保持关闭：A4 的 19/20 硬阻断各走独立端口，A5 的 15–18 四条证据/责任输入落在 1100px 决策卡的分离端口；07 失准限制在 A1 独立显示。复用的是同一个 10 号语义节点，而不是多个先后放行关卡。 来源：docs/svg-redesign-2026-10-26/release-review/modules-aliases.json
- resolved=true：上一轮两图各一条“右侧同色外轨密集、长距离追线费力”P3 已实质关闭：五分区取消原 x≈1444–1486 的纵贯外轨，各边只在所属分区内短距离连接。独立解析实际 SVG 确认 22/22 条边都完全落在单个分区，最大纵向跨度为 233px；编号、边类型、标签和物理端点均与当前 spec 一一匹配。不是仅换 SHA 或删除长边：22 条关系每条恰绘一次，十个语义节点完整正文各至少呈现一次。 来源：output/svg-release-20261027-polish/review-main-seven-before-architecture.json

当前 findings：[]。本次检查未发现新的视觉或图形语义问题。

独立结构检查：22/22 条实际边的 ID、from/to、kind、可见标签及物理端点逐条匹配当前 spec，每边恰绘一次，无额外边；29 张引用卡对应 10 个语义节点，每个完整节点的全部正文至少可见一次。所有边均局限在一个分区，最大纵向跨度 233px。
同号节点解释：顶端可见文字明确“重复引用不表示重复执行或先后放行”。A1 失准限制、A4 两项独立硬否决、A5 具名决定是同一 10 号节点的不同局部关系，没有把硬否决变成评分权重或多个串行放行节点。
旧 SVG SHA256：db50bb1d1f10a2d895aeabc743da34c8b70b254c2366d86d3cc80b62ce0790dc；旧 PNG SHA256：7ee824480c06e36e5421cb816a5b8cfdfafc84548a195671b6748f8265282c56。新哈希与旧哈希不同，关闭依据是实际图面与关系核对。

实际查看范围（全宽 x=0–1599，round4）：

- y=0–1799：[review-main-seven-round4-TD-AG-00-compat-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-round4-TD-AG-00-compat-y0-1799.png)；SHA256：99ee1973626efd94bf3ae750ae7c742307385372637583398acfd2a7e75f62dd
- y=1600–3399：[review-main-seven-round4-TD-AG-00-compat-y1600-3399.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-round4-TD-AG-00-compat-y1600-3399.png)；SHA256：b3be0d19981b0a7a032e7378310dbba97466ea3549d32ca32f927e13c6c84795
- y=3200–4999：[review-main-seven-round4-TD-AG-00-compat-y3200-4999.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-round4-TD-AG-00-compat-y3200-4999.png)；SHA256：45e2ebcfb08c2a56d655e6c02ca23e2b63e3dcfcfa43624c2aeb1ef305cda224
- y=4800–5351：[review-main-seven-round4-TD-AG-00-compat-y4800-5351.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-round4-TD-AG-00-compat-y4800-5351.png)；SHA256：bdaaa7939ef670520b123c80748994227fb2fb70780bd305c3f7a6dbe9008a83

spec：scripts/visuals/specs/aliases.mjs；scoped spec SHA256：eaa36fdc7918f22a6da9cd865e89c3fa87fa0ed803cdae0d9a83c3ad05142d46
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位与来源 SHA 详见 JSON：

- content/modules/agent-architecture-system.ts → TD-AG-00 / workflow
- content/modules/agent-architecture-system.ts → TD-AG-00 / expected
- content/modules/agent-architecture-deep.ts → TD-AG-00 / dimensions.caption
- content/modules/agent-architecture-deep.ts → TD-AG-00 / counter
- content/modules/agent-architecture-deep.ts → TD-AG-09 / failureModes

22 条实际关系闭包：

| 编号 | from → to | kind | 可见标签 |
| --- | --- | --- | --- |
| 01 | input → behavior | data | 任务与状态流 |
| 02 | d0 → distribution | control | 校准分数使用 |
| 03 | d0 → behavior | control | 校准行为各域评分 |
| 04 | d0 → security | control | 校准安全评分 |
| 05 | d0 → cost | control | 校准资源评分 |
| 06 | d0 → business | control | 校准治理评分 |
| 07 | d0 → decision | control | 失准则所有评分不可用 |
| 08 | behavior → distribution | evidence | 完整轨迹 |
| 09 | rings → behavior | data | 各环执行 |
| 10 | rings → distribution | data | 各环重复与回放执行 |
| 11 | rings → security | data | 各环对抗 |
| 12 | rings → cost | data | 各环负载观测 |
| 13 | security → guard | control | 风险映射强制控制 |
| 14 | business → guard | control | 业务硬规则 |
| 15 | distribution → decision | evidence | 区间与失败切片 |
| 16 | cost → decision | evidence | 成本与暴露量 |
| 17 | business → decision | control | 规则与责任 |
| 18 | guard → decision | evidence | 拒绝与停止回执 |
| 19 | security → decision | risk | 已证越权直接 BLOCKED |
| 20 | business → decision | risk | 已证硬规则违规直接阻断 |
| 21 | decision → input | feedback | 失败回灌 |
| 22 | decision → d0 | feedback | Judge 重校准 |

## AG-DIM-36 — PASS

- path：materials/agent-architecture-system/visuals/AG-DIM-36.svg
- 候选：[output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-36.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-36.svg)
- sha256：439e037aee1713a5d03533798118e26dc4052d8006c9b46c20ad46214932c63a
- 截图：[output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-36.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-36.png)
- screenshot_sha256：88cd8d94c0bf95396a1cae600ec62c8a49b183e26be20f97e0ce5c2c803136a2
- visual_inspected：true；body_checked：true；本轮新实看：false
- 证据方式：EXACT_SHA_INHERITED

正文核对（继承上轮实读，来源 SHA 再确认一致）：对照当前 groups、body-sources/agent-visual-source.original.json、TD-AG-00 正文八域与四环说明，并实读项目私有原文 §四 L238–495 的完整 36 维；原文哈希与公开摘录声明一致。逐项核对 4+5+4+4+5+6+4+4=36，名称及域归属匹配；来源固定阈值没有变成图中通用门禁。

视觉核对（继承上轮实看）：全宽八域清单和下方四条依赖带均已看完。第一条可见正文为“四环按各自输入与覆盖范围横向驱动 D1、D4、D5、D6”，不含“分别驱动”；说明 D1 对 D2/D3 的轨迹支撑、D4 重复证据、D5 护栏、D6/D7 具名决定和失败回灌，未执行 NOT_RUN 保留。

旧问题关闭证据：

- resolved=true：原 P3 已关闭：一一配对联想来自“分别驱动”，当前 spec 与可见 SVG 依赖带均换成按各自输入与覆盖范围横向驱动。不是只改 metadata 或 SHA；在 y≈1810–1935 的可见蓝色依赖带已读到新句。 来源：docs/svg-redesign-2026-10-26/release-review/materials.json

当前 findings：[]。本次检查未发现新的视觉或图形语义问题。

继承依据：output/svg-release-20261027-polish/review-main-seven-before-architecture.json；报告 SHA256：74638444fd2d8f33effd2f0c97cec650788cc4ebb2bb37755fa610cbb1000250。SVG、PNG、scoped spec、正文快照及每个来源 SHA 均已重新核验一致；以下是 round2 的实际查看范围。

实际查看范围（全宽 x=0–1599，继承 round2）：

- y=0–1799：[review-main-seven-AG-DIM-36-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-36-y0-1799.png)；SHA256：f8d9ad4f150d660dd4b72b4ac141f555d783ffa3d00b16d4ef2ef955e1ec6784
- y=1600–3045：[review-main-seven-AG-DIM-36-y1600-3045.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-36-y1600-3045.png)；SHA256：49a3e9aaed84faf46dd52e2c6551256bf4052468245b734809140c69ba0f3679

spec：scripts/visuals/specs/materials.mjs；scoped spec SHA256：55b763b0a522325796e88753e1aadd8e58c0a909a49abd9d5d97caee68f3d964
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位与来源 SHA 详见 JSON：

- docs/svg-redesign-2026-10-26/body-sources/agent-architecture-original.txt → 四 / 36维明细
- docs/svg-redesign-2026-10-26/body-sources/agent-visual-source.original.json → agent-36-dimensions / caption
- content/modules/agent-architecture-deep.ts → TD-AG-00 / dimensions.caption
- content/modules/agent-architecture-deep.ts → TD-AG-00 / counter
- content/modules/agent-architecture-deep.ts → TD-AG-09 / failureModes

## career-evidence-gantt — PASS

- path：materials/career-evolution/visuals/career-evidence-gantt.svg
- 候选：[output/svg-release-20261027-polish/candidate/public/materials/career-evolution/visuals/career-evidence-gantt.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/materials/career-evolution/visuals/career-evidence-gantt.svg)
- sha256：b933dd0aed51eb474c0ee3164f39db568b606d174a89a2a7ec9692551be6f92c
- 截图：[output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-gantt.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-gantt.png)
- screenshot_sha256：4d99e8bd0de5f3135bd105e06a75221c89fb868369397b94a7e01fd58e68929b
- visual_inspected：true；body_checked：true；本轮新实看：false
- 证据方式：EXACT_SHA_INHERITED

正文核对（继承上轮实读，来源 SHA 再确认一致）：对照 material-pages.json 的 TD-C03 与 career-evolution.ts：A/B/C 为基线、故障、独立复评的顺序证据窗口；缺高风险样本停补，故障未打红回 Oracle，复评分歧升级；30/60/90 是规划示例，不是实测工期或晋升承诺。next_review 与 reviewer 要由实际责任人补齐。

视觉核对（继承上轮实看）：1600×1798 全图已查看。y≈900–1143 的下一轮计划独立蓝色条实际显示 next_artifact：待填写、reviewer：待具名、next_review：待填写、gap_route：待 Owner 确认；下方明确未填不代表已有个人计划或已通过复评。A/B/C 三列等宽，无伪数值条。

旧问题关闭证据：

- resolved=true：原 P3 已关闭：下一轮计划不再只有概括性的更新路由/日期说明，四个字段已进入可见蓝色填写入口，且保持待填而未捏造日期、姓名和完成状态。 来源：docs/svg-redesign-2026-10-26/release-review/materials.json

当前 findings：[]。本次检查未发现新的视觉或图形语义问题。

继承依据：output/svg-release-20261027-polish/review-main-seven-before-architecture.json；报告 SHA256：74638444fd2d8f33effd2f0c97cec650788cc4ebb2bb37755fa610cbb1000250。SVG、PNG、scoped spec、正文快照及每个来源 SHA 均已重新核验一致；以下是 round2 的实际查看范围。

实际查看范围（全宽 x=0–1599，继承 round2）：

- y=0–1797：[review-main-seven-career-evidence-gantt-y0-1797.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-career-evidence-gantt-y0-1797.png)；SHA256：fcfeaa9852a62d79df89f8673a83fedab027b086d2576e066f9dd8019e2ef353

spec：scripts/visuals/specs/materials.mjs；scoped spec SHA256：dd322fcf8cdcb90a8641db20a7d3caf15bf2f22eb951bd728b458ee6733e23f3
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位与来源 SHA 详见 JSON：

- content/modules/career-evolution.ts → TD-C03 / workedExample
- content/modules/career-evolution.ts → careerWave6Expansion / TD-C03

## 版本、存档与保留核验

round4 日志完成标志已读到；两图最新候选 SHA 与 manifest/batch-verification 匹配。八张新裁块逐像素等于最新 PNG 对应范围；其余五图继续与 before-architecture 存档的 exact SHA 一致。
报告更新前后 406 个共享输入文件聚合 SHA256 均为 3a78dcb279175893bfd1ad38336d014ed09f08db31e2d21a6b1faf9f1015731b；历史 JSON/MD 存档、源实现及正式复审报告未改。
本结论仅覆盖记录 SHA 下的图形视觉与语义，不代表系统集成、用户验收、生产有效性或部署批准。
