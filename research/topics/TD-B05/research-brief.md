# 污染与不确定性：研究 Brief

## Controlling question

怎样审计近重复、公开曝光、隐藏测试泄漏、样本波动和版本可比性？

学习者是第一次系统学习 AI Quality 的测试开发，职业任务发生在合成退款 RAG+Agent 的发布候选审查。系统边界包含需求风险、版本化输入、模型/检索/工具候选、独立 Oracle、运行报告和人工决定；本页重点是 duplicate/exposure audit、sealed canary、成对区间、访问日志与 rebaseline。业务失败成本是错误政策、越权副作用、无法重放的证据或依据错误 Benchmark 作发布决定。

## 范围和交付

纳入：机制、失效模式、指标合同、版本、owner、三阶段实验和迁移挑战。排除：训练模型、真实企业数据、凭证、自动批准、公共排名时效结论和生产阈值。学员交付 污染、不确定性与版本审计报告。核心专业决定：证据不足时输出 SUSPECT/INCOMPARABLE，不宣布整体能力提升。

## 研究问题

1. 哪些组件会改变观察？2. 原始事实、工程推断和未知怎样分开？3. 指标 overlap、canary exposure、paired interval、variance 与 version compatibility 的单位、分母、聚合和失败动作是什么？4. 负控怎样模拟 `候选只在污染题提升，Harness 又更新，却仍宣布显著进步。`？5. 哪些权限必须留给人？

来源需要覆盖官方 API/规范、开源 Harness、公开 Benchmark、论文、治理与观测；至少十二个页面实际打开的来源。无法确认闭源模型训练数据，污染检测仍可能假阴性。
