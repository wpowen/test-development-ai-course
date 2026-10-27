# 18项版式建议闭环 · 2026-10-27

18项旧P3和复审中新发现的3条问题记录均已修复（总架构与兼容副本各一条、A02断词一条）。19个SVG路径完成独立实看和正文复核；其余107个SVG及规格与已审版本字节一致，保留原实看截图哈希。当前所有报告均无未解决P1/P2/P3。

全部候选完成复审后，才签发本轮收据、备份133个受影响文件并替换；线上更新仍须以GitHub Pages当前提交成功和HTTP/UI读回为准。

| 图 | 原问题 | 最终复审 |
|---|---|---|
| TD-AG-00-compat | 决策节点顶边八个入端口过密，编号识别较费力。 | [已关闭](release-review/polish/review-main-seven.json) |
| TD-T06 | 两Runner对照布局的上半区右侧留白偏大。 | [已关闭](release-review/polish/review-course2.json) |
| TD-A02 | 四协议与工具子流程均可追踪，但证据汇总的外轨路程较长。 | [已关闭](release-review/polish/review-course2.json) |
| TD-T10 | 最终top-k与缺失原因的入边在局部贴近交叉，仍需沿色线追踪。 | [已关闭](release-review/polish/review-course2.json) |
| TD-T12 | 生成输出与无支撑交接支路仍有局部交叉。 | [已关闭](release-review/polish/review-course2.json) |
| TD-T15 | 三层并列评测的跨列紫色证据线仍有一次交叉。 | [已关闭](release-review/polish/review-course2.json) |
| TD-W03 | 并行实验输入与结果处仍有局部异色交叉。 | [已关闭](release-review/polish/review-course2.json) |
| TD-B04 | A/B同级实验臂仍分处不同行，比较布局不够直接。 | [已关闭](release-review/polish/review-course3.json) |
| TD-B05 | 历史兼容性长线仍穿过审计输入，局部线路不够利落。 | [已关闭](release-review/polish/review-course3.json) |
| TD-QP01 | Basis Gate的权限词组仍被拆行。 | [已关闭](release-review/polish/review-course3.json) |
| TD-AP01 | Oracle邻近区域仍有异色输入交叉，可进一步简化。 | [已关闭](release-review/polish/review-course3.json) |
| TD-AP02 | Goodput约束中的“副作用”仍跨行断词。 | [已关闭](release-review/polish/review-course3.json) |
| TD-AP03 | 根分支与独立对账线仍有交叉，树形层次可更简洁。 | [已关闭](release-review/polish/review-course3.json) |
| AG-DIM-GATE | 两条回灌反馈在上部贴近并多次穿越，仍有非阻断整理空间。 | [已关闭](release-review/polish/review-main-seven.json) |
| AG-DIM-36 | 四环依赖带“分别驱动”措辞容易被理解为环与域一一配对。 | [已关闭](release-review/polish/review-main-seven.json) |
| career-evidence-gantt | 下一轮计划仍缺明确的待填记录入口，首轮建议尚未实现。 | [已关闭](release-review/polish/review-main-seven.json) |
| TD-PS05 | 人工复核入口附近的紫色证据曲线仍局部交叉，读图需要短暂回追。 | [已关闭](release-review/polish/review-main-seven.json) |
| TD-PS06 | 恢复待同步项的绿色回程绕行并穿越其他路径，局部线形不够简洁。 | [已关闭](release-review/polish/review-main-seven.json) |

总架构主图 `AG-DIM-ARCHITECTURE` 与兼容副本同步更新。复杂关系按显式语义分成局部子图，同号引用不表示额外执行；所有语义边保留，未通过排版裁剪删掉授权、失败、拒绝、幂等或独立Oracle。

新增复审问题与返工前证据：[架构长轨](release-review/polish/review-main-seven-before-architecture.md)、[A02不变量断词](release-review/polish/review-course2-before-A02.md)。历史18项记录保留在[上一轮](release-review/round-3/)。

| 验证 | 结果 |
|---|---|
| 实际Chrome渲染 | 126/126；文字越界、重叠、标签遮挡和显式路由缺边均为0 |
| 本轮独立视觉/正文复审 | 19/19 PASS；107张相同版本及规格继承 |
| 正文与映射 | 103页、316条短引文、25项材料记录一致 |
| 发布与排版回归 | 142项通过 |
| 路由专项 | 25项通过 |
| 隔离候选站 test:site | 类型、内容、静态站、16包闭包、离线实验与10项测试通过 |
| 候选HTTP/UI读回 | 125图、2ZIP、18页桌面及390px手机，图内横向滚至右端通过 |

[逐条哈希闭环](polish-closure.json) · [已替换资源哈希与来源](published-release.json) · [维护方法](../../scripts/visuals/README.md)

这是AI辅助图形与正文复审，不冒充学习者或行业验收。课程模型与生产效果的原NOT_RUN边界保持。
