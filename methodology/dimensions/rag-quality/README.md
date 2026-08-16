# 测试 LLM 和 RAG（TD-M03）深度内容

> 本目录由 `scripts/build-dimension-docs.mjs` 从 `methodology/dimensions/_sources/` 渲染生成。
> 单一事实来源是那份 JSON；站点模块与本文档都是它的投影，请修改 JSON 而不是本文件。

共 8 页。渲染顺序与站点 `deep-layer.ts` 完全一致，两个投影读同一份结构：
失效点 → 术语前置 → 能力机理与演进对照 → 工具链 → 架构索引 → 判断表 → 指标卡 →
反例（含「为什么它看起来是对的」）→ 诊断树 → 演练 → 三段式门禁 → 带走物 → 来源与延伸阅读。

页内「*依据：…*」与页尾来源清单里的版本号、许可证与最近提交，由
`scripts/build-reference-library.py` 调 GitHub API 在构建时抓取，不是手写的。

| 页面 | 文档 |
| --- | --- |
| TD-T09 | [TD-T09.md](TD-T09.md) |
| TD-T10 | [TD-T10.md](TD-T10.md) |
| TD-T11 | [TD-T11.md](TD-T11.md) |
| TD-T12 | [TD-T12.md](TD-T12.md) |
| TD-X501 | [TD-X501.md](TD-X501.md) |
| TD-X502 | [TD-X502.md](TD-X502.md) |
| TD-T13 | [TD-T13.md](TD-T13.md) |
| TD-T14 | [TD-T14.md](TD-T14.md) |

## 证据边界

所有数值为结构占位或来源观测，不得直接作为你系统的验收阈值。
整体成熟度 `fixture-tested`；真实模型、企业集成、从业者评审与生产验证均 `NOT_RUN`。

