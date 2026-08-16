# Harness 敏感性：研究 Brief

## Controlling question

固定模型和数据时，Prompt、工具、Context、超时与重试如何改变分数？

学习者是第一次系统学习 AI Quality 的测试开发，职业任务发生在合成退款 RAG+Agent 的发布候选审查。系统边界包含需求风险、版本化输入、模型/检索/工具候选、独立 Oracle、运行报告和人工决定；本页重点是 单变量实验、锁定 Manifest、paired task flips 与资源差异。业务失败成本是错误政策、越权副作用、无法重放的证据或依据错误 Benchmark 作发布决定。

## 范围和交付

纳入：机制、失效模式、指标合同、版本、owner、三阶段实验和迁移挑战。排除：训练模型、真实企业数据、凭证、自动批准、公共排名时效结论和生产阈值。学员交付 Harness 单变量敏感性报告。核心专业决定：一次只归因一个协议变量；多变量变化输出 CONFOUNDED。

## 研究问题

1. 哪些组件会改变观察？2. 原始事实、工程推断和未知怎样分开？3. 指标 paired flips、effect size、variance、tool calls、timeouts 与 cost delta 的单位、分母、聚合和失败动作是什么？4. 负控怎样模拟 `同时开放工具、延长超时和改 system prompt 后，把提升归因给模型。`？5. 哪些权限必须留给人？

来源需要覆盖官方 API/规范、开源 Harness、公开 Benchmark、论文、治理与观测；至少十二个页面实际打开的来源。公开 Harness 与真实模型适配器均未运行。
