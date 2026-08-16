# AI Serving 负载与容量：从 Token 分布到 SLO 拐点 validation

## Research coverage

十二个打开来源覆盖协议、Schema、事件、实现、指标、负载、可靠性、治理和职业框架；不少于五个 lane、五个 family 和四种 source type。

## Claim traceability

协议和指标定义来自原始标准或官方文档；“open-loop 保持外部到达并记录 dropped arrivals；closed-loop 仅诊断单用户上限；阶梯实验每级只改到达率。”属于跨来源工程推论。Unknown 保留：没有网络、模型、GPU、调度器或生产流量，不能外推真实容量。

## Runnable lab

本页 manifest 指向版本化 Prompt/Input/Schema/Eval/Mutation 和标准库 runner。baseline/fault/repair 期望退出 0/1/0；cycle 验证内部实际码。

## Independent comparison

两次独立研究运行在 `research-runs.json` 中绑定，分歧和裁决保存在 `comparison.md`。

## Publication verdict

`CONTENT-READY / PASS-FIXTURE / RELEASE-BLOCKED`。未通过 practitioner、live、production 和出版门禁。
