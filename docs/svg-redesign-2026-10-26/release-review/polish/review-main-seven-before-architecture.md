# 七图独立 SVG 复审（round2）

7 图均 PASS；无 P1/P2。ARCHITECTURE、compat 各保留一条右侧外轨密集 P3。指定旧问题已实质关闭，不宣称 P3 清零。

已实际调用 view_image(detail=original) 查看 16 张全宽裁块，长图重叠 200px 覆盖全高。采用 round2 最新候选和 screenshots，未使用 round1 overview。主代理验证记录仅为绑定与几何佐证，不能代替目视。

仅写这两份报告及本组前缀裁块；未修改 SVG/spec/renderer/正式 release-review，未提交部署。

| ID | verdict | findings | 实看范围（x=0–1599，y 含首尾） |
| --- | --- | --- | --- |
| TD-PS05 | PASS | 无新发现 | 0–1799 / 1600–3240 |
| TD-PS06 | PASS | 无新发现 | 0–1799 / 1600–2697 |
| AG-DIM-GATE | PASS | 无新发现 | 0–1799 / 1600–3399 / 3200–4052 |
| AG-DIM-ARCHITECTURE | PASS | P3 外轨密集 | 0–1799 / 1600–3399 / 3200–4229 |
| TD-AG-00-compat | PASS | P3 外轨密集 | 0–1799 / 1600–3399 / 3200–4229 |
| AG-DIM-36 | PASS | 无新发现 | 0–1799 / 1600–3045 |
| career-evidence-gantt | PASS | 无新发现 | 0–1797 |

## TD-PS05 — PASS

- path：visuals/course/TD-PS05.svg
- candidate：[output/svg-release-20261027-polish/candidate/public/visuals/course/TD-PS05.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/visuals/course/TD-PS05.svg)
- sha256：bdb94e1aae2a42c575ff2ddfd1bab49fb1207329edda1991e6fbd5912b022c01
- screenshot：[output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS05.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS05.png)
- screenshot_sha256：9b17f96503dbb72b0e9cd3395d5fea77b42a22c79d241d5d58f1f4557a483626
- visual_inspected：true；body_checked：true；尺寸：1600×3241

正文核对：对照 course-1.json 的 TD-PS05：DOM 属性/规则、真实键盘与读屏任务、冻结视觉骨架分别取证；incomplete 与未分类差异进入具名人工；矩阵裁剪、基线审批和未测组合边界保留。图上 01/02/03 是同一矩阵分派的并行范围，不是三类检查的执行依赖。

视觉核对：07 规则结果、08 任务记录、09 快照与差异分别进入证据卡；05 名称与流程含义进入人工卡。人工卡上方 y≈1730–1820 的交叉有白底跨线桥，04/06/05 和 07/09/08 独立编号端口可回追，未再出现旧图中央两条紫色曲线无桥交叉。全图文字、边界与图例无裁切。

旧问题关闭证据：原 P3 已关闭：原人工复核入口附近同色证据线无桥交叉，已改为独立外轨、跨线桥和对应编号。实际沿 05 追到人工卡、沿 07/08/09 追到组合证据卡确认；结论来自新截图像素，不来自哈希变更。
旧问题来源：docs/svg-redesign-2026-10-26/release-review/course-1.json

当前 findings：

无新的视觉或图形语义问题。

实际查看范围（每块均实际调用 view_image，全部宽度 x=0–1599）：

- y=0–1799：[review-main-seven-TD-PS05-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-PS05-y0-1799.png)；裁块 SHA256：72301f1e08acf771276daf8990f6712bbb17f32124aac526869638125e6c675b
- y=1600–3240：[review-main-seven-TD-PS05-y1600-3240.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-PS05-y1600-3240.png)；裁块 SHA256：5b4a223e219c1da366c08f42bf39803be195aa97e0c240e6f5cf7dcfa0668a5d

当前 spec：scripts/visuals/specs/course-1.mjs；文件 SHA256：779abdbaa62ea1921f890adeaf1dfebd69af1243b6546642df4de245ec61d4bb
正文快照：docs/svg-redesign-2026-10-26/body-sources/course-1.json；SHA256：4b85937ba7df233cec33c3647935009698e279174001cf428be59f61be96a42e

正文定位（每个来源 SHA 见 JSON）：

- docs/svg-redesign-2026-10-26/body-sources/course-1.json → TD-PS05 / 无障碍能自动化到哪一步，剩下的为什么必须人来
- docs/svg-redesign-2026-10-26/body-sources/course-1.json → TD-PS05 / 分开验证语义、键盘与视觉基线

## TD-PS06 — PASS

- path：visuals/course/TD-PS06.svg
- candidate：[output/svg-release-20261027-polish/candidate/public/visuals/course/TD-PS06.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/visuals/course/TD-PS06.svg)
- sha256：0d6253d46477e9727d5da4b4c3e1b872f83330a5cb497643f59899563c171d28
- screenshot：[output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS06.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-PS06.png)
- screenshot_sha256：649394486ab487a699ecbb043cf82a2888342753036e24cf32e2ada8b19fc48f
- visual_inspected：true；body_checked：true；尺寸：1600×2698

正文核对：对照 TD-PS06 的仓库收货场景、生命周期恢复、权限与完成条件：拒绝不创建记录，扫描状态持久化，同一 receipt_id 重放只入账一次；客户端 logcat、服务 Trace 与独立库存账本分开；权限缺失不改发云端，设备未运行不宣称兼容。

视觉核对：06 青色恢复线自恢复卡顶端 x≈1018 向上，到 y≈1102 向左，再沿 x≈165 外轨上返队列底部独立 06 端口。05 恢复契约走右侧，08 客户端故障证据走右侧，04 故障标签仍贴红边。跨越 03 网络恢复线处有跨线处理，无合流歧义。

旧问题关闭证据：原 P3 已关闭：恢复待同步项不再先绕恢复节点右上并跨过控制/证据线；已实际确认 06 左侧独立外轨，且标签、箭头和队列端口对应一致。
旧问题来源：docs/svg-redesign-2026-10-26/release-review/course-1.json

当前 findings：

无新的视觉或图形语义问题。

实际查看范围（每块均实际调用 view_image，全部宽度 x=0–1599）：

- y=0–1799：[review-main-seven-TD-PS06-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-PS06-y0-1799.png)；裁块 SHA256：b1915e45bcf3f687c5855a330270609098c229b215fa786fbaee86c8a8dbc195
- y=1600–2697：[review-main-seven-TD-PS06-y1600-2697.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-PS06-y1600-2697.png)；裁块 SHA256：361b5d66f6c061b9f3a606075afcb6221fbbd8c8737ed8cef62536dc92c2b527

当前 spec：scripts/visuals/specs/course-1.mjs；文件 SHA256：779abdbaa62ea1921f890adeaf1dfebd69af1243b6546642df4de245ec61d4bb
正文快照：docs/svg-redesign-2026-10-26/body-sources/course-1.json；SHA256：4b85937ba7df233cec33c3647935009698e279174001cf428be59f61be96a42e

正文定位（每个来源 SHA 见 JSON）：

- docs/svg-redesign-2026-10-26/body-sources/course-1.json → TD-PS06 / 场景：仓库收货不能丢扫描状态
- docs/svg-redesign-2026-10-26/body-sources/course-1.json → TD-PS06 / 重放 Android 生命周期且不重复入账

## AG-DIM-GATE — PASS

- path：materials/agent-architecture-system/visuals/AG-DIM-GATE.svg
- candidate：[output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-GATE.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-GATE.svg)
- sha256：5ff7d24dfe5accd82e54802832a04887cae0bfb8a337462f93d8ff324ed1de46
- screenshot：[output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-GATE.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-GATE.png)
- screenshot_sha256：5796a4d4ceea7c1572e136f9da5e679a6af387cc4bcd01118f2c3c75fe417f30
- visual_inspected：true；body_checked：true；尺寸：1600×4053

正文核对：对照 material-pages.json 的 TD-AG-09、当前 sourceRefs 和三段门禁文档 11.5/11.6：硬红线或 D0 失效直接 BLOCKED；统计满足、充分但未满足、证据不足三分支可辨；不足保留原状态，经有效护栏后仅可具名有限决定；不由流水线签发布。

视觉核对：14 补新证据后再审走 x≈165 左侧外轨，15 修复并保留失败回灌走 x≈1456 右侧外轨，分别回到证据包底部 x≈539 和 x≈615 独立端口。顶端两反馈分层 y≈627/641，不再长段贴行；政策线穿越处有桥。06/07/08 的统计分支和 10/13 的拒绝分支端点均可追回。

旧问题关闭证据：原 P3 已关闭：两条回灌现在分走左右外围，并有 14/15 独立端口、标签与跨线桥。实际完整追踪至候选证据包，未用旧 round1 overview 代替。
旧问题来源：docs/svg-redesign-2026-10-26/release-review/materials.json

当前 findings：

无新的视觉或图形语义问题。

来源对齐备注：正文快照 TD-AG-09 的完成标准 caption 仍有“统计不过不进风险接受”的概括，可能将不足与 FAIL 混读；本图明确区分二者，符合当前 spec 引用的 11-three-stage-gate.md §11.5。该来源措辞是已有正文歧义，本轮未修改正文，也未把它误报为图中新引入的关系。

实际查看范围（每块均实际调用 view_image，全部宽度 x=0–1599）：

- y=0–1799：[review-main-seven-AG-DIM-GATE-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-GATE-y0-1799.png)；裁块 SHA256：cd36b76b1e72c6d183bba84a2d45bf63bedd8f4dd039364b09cbdd6c4ed46766
- y=1600–3399：[review-main-seven-AG-DIM-GATE-y1600-3399.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-GATE-y1600-3399.png)；裁块 SHA256：7c9f0c9a850447ac1cd92bbf7a345ff8264dca87e44efe7da3c0d2edb42a1b4f
- y=3200–4052：[review-main-seven-AG-DIM-GATE-y3200-4052.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-GATE-y3200-4052.png)；裁块 SHA256：daffcdc74ec265466c94db09e6dcabb9d2d500cccd69afa66a4a603754c55b52

当前 spec：scripts/visuals/specs/materials.mjs；文件 SHA256：1d4141e5703fb5bbdaaddb4350e111df51dd462231352478ff29dac22bf6a170
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位（每个来源 SHA 见 JSON）：

- content/modules/agent-architecture-system.ts → TD-AG-09 / workflow
- content/modules/agent-architecture-system.ts → TD-AG-05 / failure
- content/modules/agent-architecture-deep.ts → TD-AG-08 / voice.takeNote
- public/materials/agent-architecture-system/docs/11-three-stage-gate.md → 11.5 / 三段之间的关系

## AG-DIM-ARCHITECTURE — PASS

- path：materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg
- candidate：[output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg)
- sha256：42d937cb0cee473ae6e467465bf256ad1b85d9add9bcb8d944630140d0b6d46e
- screenshot：[output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-ARCHITECTURE.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-ARCHITECTURE.png)
- screenshot_sha256：150ea4853e9ef89bced19eb3a9442e4d0d711a224b3cb0b907c304311ee4ed15
- visual_inspected：true；body_checked：true；尺寸：1600×4230

正文核对：对照 TD-AG-00 的风险边界、八域表与四环反例及 TD-AG-09 的硬阻断：D0 约束所有域评分；四环 09/10/11/12 横向进入行为/D4/D5/D6；已证越权 19 和硬规则违规 20 独立进入决定，不经总分抵消；21/22 分别回灌输入与 D0。

视觉核对：决策卡实际为 x≈462–1142、宽 680px。顶边入端口依次 19/17/20/07/15/16/18，x≈550/676/739/802/865/928/992，相邻最小约 63px；21/22 输出另有竖轨。红线、责任和统计证据没有再挤在约 354px 卡上。正文、底部交付和图例可读。

旧问题关闭证据：共享架构的“决策节点顶边入端口过密”问题已实质修复：680px 卡及约 63px 的入端口间距可见。正式 materials 当前记录本图无独立 P3，此处复核的是同构 compat 旧 P3 与本轮指定的架构图风险，不伪造本图旧记录。右侧外轨密集另列为本轮 P3。
旧问题来源：docs/svg-redesign-2026-10-26/release-review/modules-aliases.json (shared architecture port issue)

当前 findings：

- **P3（OPEN，非阻断）：宽决策卡已疏开，但右侧同色控制外轨仍密集，长距离逐线回追费力。**
  证据：原尺寸截图 x≈1444–1486、y≈690–1566 的 D0 控制轨多次按约 6px 间距并行，02/03/04/05/06/07 标签到目标卡之间有多次桥接；下部 y≈2388–3200 的 14/17 控制和 15/16/18 证据外轨仍交织。编号和端点可查，未丢边，但加宽决策卡没有解决这段外围总线的追踪负担。SVG 路由中右轨 x=1356/1374/1380/1386/1392/1398，加图组 x=88 后为当前截图坐标。
  建议：为同色长轨增加水平间距，或按 D0 校准、证据入决策分设轨道组；长轨中段补重复编号，保留现有独立端口及跨线桥。不要只再加宽决策卡。

实际查看范围（每块均实际调用 view_image，全部宽度 x=0–1599）：

- y=0–1799：[review-main-seven-AG-DIM-ARCHITECTURE-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-ARCHITECTURE-y0-1799.png)；裁块 SHA256：0931f7ea287642437156962258fc3063c384d047954e2f51edef4e292db5b538
- y=1600–3399：[review-main-seven-AG-DIM-ARCHITECTURE-y1600-3399.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-ARCHITECTURE-y1600-3399.png)；裁块 SHA256：6d23a793234a13adc34adfc7b5df57ea91520e8b649a56344d3c31477f8febce
- y=3200–4229：[review-main-seven-AG-DIM-ARCHITECTURE-y3200-4229.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-ARCHITECTURE-y3200-4229.png)；裁块 SHA256：2b88fffe5b49d89303be360701c6a933059ebf01343f254861377c9c33029160

当前 spec：scripts/visuals/specs/materials.mjs；文件 SHA256：1d4141e5703fb5bbdaaddb4350e111df51dd462231352478ff29dac22bf6a170
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位（每个来源 SHA 见 JSON）：

- content/modules/agent-architecture-system.ts → TD-AG-00 / workflow
- content/modules/agent-architecture-system.ts → TD-AG-00 / expected
- content/modules/agent-architecture-deep.ts → TD-AG-00 / dimensions.caption
- content/modules/agent-architecture-deep.ts → TD-AG-00 / counter
- content/modules/agent-architecture-deep.ts → TD-AG-09 / failureModes
- docs/svg-redesign-2026-10-26/body-sources/material-pages.json → TD-AG-00 / summary

## TD-AG-00-compat — PASS

- path：visuals/course/TD-AG-00.svg
- candidate：[output/svg-release-20261027-polish/candidate/public/visuals/course/TD-AG-00.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/visuals/course/TD-AG-00.svg)
- sha256：db50bb1d1f10a2d895aeabc743da34c8b70b254c2366d86d3cc80b62ce0790dc
- screenshot：[output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AG-00.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/visuals__course__TD-AG-00.png)
- screenshot_sha256：7ee824480c06e36e5421cb816a5b8cfdfafc84548a195671b6748f8265282c56
- visual_inspected：true；body_checked：true；尺寸：1600×4230

正文核对：alias 由 materials 的 AG-DIM-ARCHITECTURE spec 派生；另对照 TD-AG-00 正文、四环反例和硬红线要求。兼容文件路径实际为 visuals/course/TD-AG-00.svg；没有把 materials/agent-architecture-system/visuals/TD-AG-00.svg 或当前正式公开 SVG 混作本轮候选。

视觉核对：独立查看 compat 的三张全宽裁块，未继承兄弟图查看结论。680px 决策卡端口 19/17/20/07/15/16/18 已拉开；09–12 四环、19/20 硬阻断、21/22 反馈均实际回追；除顶端 ID 外同构图形一致。

旧问题关闭证据：原 P3 已关闭：原决策节点顶边编号拥挤，现宽卡及约 63px 入端口间距使硬红线与统计/责任输入均能辨认。旧记录称八个入端口，本轮当前 spec 实际为七条入边，另有两条反馈出边；未凭旧计数机械验收。右侧外轨残余密集单列新 P3。
旧问题来源：docs/svg-redesign-2026-10-26/release-review/modules-aliases.json

当前 findings：

- **P3（OPEN，非阻断）：宽决策卡已疏开，但右侧同色控制外轨仍密集，长距离逐线回追费力。**
  证据：原尺寸截图 x≈1444–1486、y≈690–1566 的 D0 控制轨多次按约 6px 间距并行，02/03/04/05/06/07 标签到目标卡之间有多次桥接；下部 y≈2388–3200 的 14/17 控制和 15/16/18 证据外轨仍交织。编号和端点可查，未丢边，但加宽决策卡没有解决这段外围总线的追踪负担。SVG 路由中右轨 x=1356/1374/1380/1386/1392/1398，加图组 x=88 后为当前截图坐标。
  建议：为同色长轨增加水平间距，或按 D0 校准、证据入决策分设轨道组；长轨中段补重复编号，保留现有独立端口及跨线桥。不要只再加宽决策卡。

实际查看范围（每块均实际调用 view_image，全部宽度 x=0–1599）：

- y=0–1799：[review-main-seven-TD-AG-00-compat-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-AG-00-compat-y0-1799.png)；裁块 SHA256：c65bf77c9c798d6d252ff40943800a237ee020c439bac1c0b6e3434d07d65771
- y=1600–3399：[review-main-seven-TD-AG-00-compat-y1600-3399.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-AG-00-compat-y1600-3399.png)；裁块 SHA256：f4bc2cdec216b79bff42968e8a7449d068f85a6471f897e1dc06dfe7db1847d8
- y=3200–4229：[review-main-seven-TD-AG-00-compat-y3200-4229.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-TD-AG-00-compat-y3200-4229.png)；裁块 SHA256：edae3c3df2029171c1521455fcd3e9a0f37fa9273eb49ad6c83a1b47b877a28f

当前 spec：scripts/visuals/specs/aliases.mjs；文件 SHA256：ef80f74192bc486b4c31a7550dbd2de42a01c1b1df306d2c2db90eecb26ecdfe
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位（每个来源 SHA 见 JSON）：

- content/modules/agent-architecture-system.ts → TD-AG-00 / workflow
- content/modules/agent-architecture-system.ts → TD-AG-00 / expected
- content/modules/agent-architecture-deep.ts → TD-AG-00 / dimensions.caption
- content/modules/agent-architecture-deep.ts → TD-AG-00 / counter
- content/modules/agent-architecture-deep.ts → TD-AG-09 / failureModes

## AG-DIM-36 — PASS

- path：materials/agent-architecture-system/visuals/AG-DIM-36.svg
- candidate：[output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-36.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/materials/agent-architecture-system/visuals/AG-DIM-36.svg)
- sha256：439e037aee1713a5d03533798118e26dc4052d8006c9b46c20ad46214932c63a
- screenshot：[output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-36.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/materials__agent-architecture-system__visuals__AG-DIM-36.png)
- screenshot_sha256：88cd8d94c0bf95396a1cae600ec62c8a49b183e26be20f97e0ce5c2c803136a2
- visual_inspected：true；body_checked：true；尺寸：1600×3046

正文核对：对照当前 groups、body-sources/agent-visual-source.original.json、TD-AG-00 正文八域与四环说明，并实读项目私有原文 §四 L238–495 的完整 36 维；原文哈希与公开摘录声明一致。逐项核对 4+5+4+4+5+6+4+4=36，名称及域归属匹配；来源固定阈值没有变成图中通用门禁。

视觉核对：全宽八域清单和下方四条依赖带均已看完。第一条可见正文为“四环按各自输入与覆盖范围横向驱动 D1、D4、D5、D6”，不含“分别驱动”；说明 D1 对 D2/D3 的轨迹支撑、D4 重复证据、D5 护栏、D6/D7 具名决定和失败回灌，未执行 NOT_RUN 保留。

旧问题关闭证据：原 P3 已关闭：一一配对联想来自“分别驱动”，当前 spec 与可见 SVG 依赖带均换成按各自输入与覆盖范围横向驱动。不是只改 metadata 或 SHA；在 y≈1810–1935 的可见蓝色依赖带已读到新句。
旧问题来源：docs/svg-redesign-2026-10-26/release-review/materials.json

当前 findings：

无新的视觉或图形语义问题。

实际查看范围（每块均实际调用 view_image，全部宽度 x=0–1599）：

- y=0–1799：[review-main-seven-AG-DIM-36-y0-1799.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-36-y0-1799.png)；裁块 SHA256：f8d9ad4f150d660dd4b72b4ac141f555d783ffa3d00b16d4ef2ef955e1ec6784
- y=1600–3045：[review-main-seven-AG-DIM-36-y1600-3045.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-AG-DIM-36-y1600-3045.png)；裁块 SHA256：49a3e9aaed84faf46dd52e2c6551256bf4052468245b734809140c69ba0f3679

当前 spec：scripts/visuals/specs/materials.mjs；文件 SHA256：1d4141e5703fb5bbdaaddb4350e111df51dd462231352478ff29dac22bf6a170
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位（每个来源 SHA 见 JSON）：

- docs/svg-redesign-2026-10-26/body-sources/agent-architecture-original.txt → 四 / 36维明细
- docs/svg-redesign-2026-10-26/body-sources/agent-visual-source.original.json → agent-36-dimensions / caption
- content/modules/agent-architecture-deep.ts → TD-AG-00 / dimensions.caption
- content/modules/agent-architecture-deep.ts → TD-AG-00 / counter
- content/modules/agent-architecture-deep.ts → TD-AG-09 / failureModes

完整 36 维原文另读 output/svg-release-20261026/private-reference-originals/agent-architecture-original.txt，L238–495；SHA256：b38274bcc1ba2d8c6e721157765f1b64ae70b0cbc9cc2cdd0a703140a69b2b54，与公开摘录声明一致。未复制私有全文。

## career-evidence-gantt — PASS

- path：materials/career-evolution/visuals/career-evidence-gantt.svg
- candidate：[output/svg-release-20261027-polish/candidate/public/materials/career-evolution/visuals/career-evidence-gantt.svg](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/candidate/public/materials/career-evolution/visuals/career-evidence-gantt.svg)
- sha256：b933dd0aed51eb474c0ee3164f39db568b606d174a89a2a7ec9692551be6f92c
- screenshot：[output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-gantt.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-redesign-2026-10-26/screenshots/materials__career-evolution__visuals__career-evidence-gantt.png)
- screenshot_sha256：4d99e8bd0de5f3135bd105e06a75221c89fb868369397b94a7e01fd58e68929b
- visual_inspected：true；body_checked：true；尺寸：1600×1798

正文核对：对照 material-pages.json 的 TD-C03 与 career-evolution.ts：A/B/C 为基线、故障、独立复评的顺序证据窗口；缺高风险样本停补，故障未打红回 Oracle，复评分歧升级；30/60/90 是规划示例，不是实测工期或晋升承诺。next_review 与 reviewer 要由实际责任人补齐。

视觉核对：1600×1798 全图已查看。y≈900–1143 的下一轮计划独立蓝色条实际显示 next_artifact：待填写、reviewer：待具名、next_review：待填写、gap_route：待 Owner 确认；下方明确未填不代表已有个人计划或已通过复评。A/B/C 三列等宽，无伪数值条。

旧问题关闭证据：原 P3 已关闭：下一轮计划不再只有概括性的更新路由/日期说明，四个字段已进入可见蓝色填写入口，且保持待填而未捏造日期、姓名和完成状态。
旧问题来源：docs/svg-redesign-2026-10-26/release-review/materials.json

当前 findings：

无新的视觉或图形语义问题。

实际查看范围（每块均实际调用 view_image，全部宽度 x=0–1599）：

- y=0–1797：[review-main-seven-career-evidence-gantt-y0-1797.png](/Volumes/MACSSD/owen-home/Documents/ChatGPT/aitester/test-development-ai-course/output/svg-release-20261027-polish/review-main-seven-career-evidence-gantt-y0-1797.png)；裁块 SHA256：fcfeaa9852a62d79df89f8673a83fedab027b086d2576e066f9dd8019e2ef353

当前 spec：scripts/visuals/specs/materials.mjs；文件 SHA256：1d4141e5703fb5bbdaaddb4350e111df51dd462231352478ff29dac22bf6a170
正文快照：docs/svg-redesign-2026-10-26/body-sources/material-pages.json；SHA256：485a90d8e46825d2eede075921e70c2b1a0e8636aaee3342ae968b94b1612ce4

正文定位（每个来源 SHA 见 JSON）：

- content/modules/career-evolution.ts → TD-C03 / workedExample
- content/modules/career-evolution.ts → careerWave6Expansion / TD-C03

## 验证与边界

七图 SVG SHA 与最新 manifest/batch-verification 匹配；所有裁块逐像素等于所记 PNG 对应范围，覆盖首尾全高。round2 日志完成标志已确认。
报告生成前后 400 个共享输入文件聚合 SHA256 一致：cadc9518d069f87ce724bdf480c45ac6eef2079344434a26776fbde2250e9bbd。
PASS 仅表示本轮候选图视觉与正文复审通过，仍保留已列 P3；不是被描述系统的集成、用户、生产或部署验收。
