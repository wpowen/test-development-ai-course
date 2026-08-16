# Capstone Fixture Release Candidate：研究 Brief

## Controlling question

怎样消费全链工件，让一个坏 AI 版本可重复失败、定位和恢复？

学习者是第一次系统学习 AI Quality 的测试开发，职业任务发生在合成退款 RAG+Agent 的发布候选审查。系统边界包含需求风险、版本化输入、模型/检索/工具候选、独立 Oracle、运行报告和人工决定；本页重点是 PRD/Risk→Dataset/Trace→Prompt/Schema→Oracle→Benchmark/CI→Rollback 的闭环。业务失败成本是错误政策、越权副作用、无法重放的证据或依据错误 Benchmark 作发布决定。

## 范围和交付

纳入：机制、失效模式、指标合同、版本、owner、三阶段实验和迁移挑战。排除：训练模型、真实企业数据、凭证、自动批准、公共排名时效结论和生产阈值。学员交付 AI Quality Engineering Fixture RC 与评审包。核心专业决定：闭包最多证明 fixture release candidate，不得晋级 publication、production 或 practitioner。

## 研究问题

1. 哪些组件会改变观察？2. 原始事实、工程推断和未知怎样分开？3. 指标 trace coverage、artifact closure、mutation kill、0→1→0 与 unknown completeness 的单位、分母、聚合和失败动作是什么？4. 负控怎样模拟 `只交文档、聊天截图或最终绿报告，没有首次红灯、trace、owner 或 hash closure。`？5. 哪些权限必须留给人？

来源需要覆盖官方 API/规范、开源 Harness、公开 Benchmark、论文、治理与观测；至少十二个页面实际打开的来源。模型、真实 RAG/Agent、企业集成、人审和发布全部 NOT_RUN。
