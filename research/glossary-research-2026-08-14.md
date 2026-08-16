# 术语表多维解释研究记录

## 目的

把站点原有的「一句话定义」升级为可学习、可测试、可复用的术语卡。每个核心术语保留课程定义，再补充：机制、测试开发关注点、可复用例子、常见误区、关联词和来源。逐页术语使用同一字段契约，但不伪造逐词外部研究；它们明确标为“逐页术语”，并给出软件测试与 AI 风险框架的起始读物。

## 证据边界

- **Evidence**：来源页面提供概念、协议或框架层解释；课程把它们转成学习辅助材料，并保留 URL、来源类型和访问日期。
- **Inference**：`mechanism`、`testFocus`、`example` 和 `pitfalls` 是面向测试开发学习者的课程化解释，不是来源原文的逐字翻译。
- **Unknown**：来源不会替课程项目定义组织阈值、生产 SLO、业务损失或模型上线结论。所有这些仍必须由 Metric Card、业务 owner 和真实运行证据决定。

## 来源索引

| ID | 类型 | 用途 |
| --- | --- | --- |
| WIKI_AI / WIKI_LLM / WIKI_PROMPT / WIKI_RAG | 百科 | 解释 AI、LLM、Prompt、RAG 的基础概念和边界 |
| WIKI_SOFTWARE_TEST / WIKI_MUTATION / WIKI_FAULT | 百科 | 解释测试、变异测试、故障注入及其可证伪闭环 |
| WIKI_FSCORE / WIKI_CONFUSION / WIKI_ROC | 百科 | 为分类指标术语提供导航入口；不把页面数字直接当课程阈值 |
| NIST_AI_RMF / NIST_GENAI | 官方框架 | 风险管理、生成式 AI 风险与治理边界 |
| OTEL_OBS / OTEL_TRACE | 官方规范/文档 | 可观测性、Trace/Span 与重放字段 |
| MCP_SPEC | 官方规范 | 工具、资源、能力边界与服务端协议 |
| OWASP_MCP | 安全资料 | MCP 工具投毒和供应链风险的攻击视角 |

完整 URL、标题、访问日期及每个术语的 source ID 见 `methodology/glossary-deep.json`；生成后的 `site/content/glossary.ts` 只作为站点投影，不应直接编辑。

## 生成与复核

1. 修改 `methodology/glossary-core.json` 或 `methodology/glossary-deep.json`。
2. 运行 `node scripts/build-glossary.mjs`，确保 45 个核心词与 297 个逐页词均生成六维解释字段。
3. 站点 UI 只在每页底部提供术语超链接；设计思路不再进入公开参考导航。
4. 运行 glossary schema/字段测试，检查来源 URL、字段完整性、页面回跳和静态/动态投影一致。

## 不应做的事

- 不把百科或框架中的示例数字自动提升为组织发布门禁。
- 不把“有来源链接”写成“课程已完成真实模型、企业集成、从业者或生产验证”。
- 不用统一的模板段落掩盖不同术语的不同机制；核心词必须有主题化解释，逐页词必须回到出现页面。
