# TD-T13 Prompt、模型和知识库版本 A/B research brief

**Controlling question:** 当候选系统的 Prompt、模型、知识库和评分器都可能变化时，怎样证明观察到的差异来自唯一自变量，并把高风险切片 blocker 放在平均分之前？

- Professional decision: 发布负责人只能在 manifest diff 证明唯一自变量、重复运行分布稳定、退款等高风险切片没有 blocker 时批准候选；否则结论为混杂或 UNKNOWN。
- Work object: 客服 RAG 的 A/B 候选，包含固定 eval 集、Prompt、模型、检索索引、工具、Judge、随机参数、预算和逐条输出。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.

