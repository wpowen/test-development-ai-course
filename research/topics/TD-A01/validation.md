# 普通 API 与 AI API：从确定性响应到版本化生成服务 validation

## Research coverage

十二个打开来源覆盖协议、Schema、事件、实现、指标、负载、可靠性、治理和职业框架；不少于五个 lane、五个 family 和四种 source type。

## Claim traceability

协议和指标定义来自原始标准或官方文档；“保留 HTTP、鉴权、错误和幂等共同契约，再增加生成 Manifest、行为 Oracle、Token/成本和可靠性层。”属于跨来源工程推论。Unknown 保留：供应商内部模型修订、路由、限额和区域实现没有公开可观察证据。

## Runnable lab

本页 manifest 指向版本化 Prompt/Input/Schema/Eval/Mutation 和标准库 runner。baseline/fault/repair 期望退出 0/1/0；cycle 验证内部实际码。

## Independent comparison

两次独立研究运行在 `research-runs.json` 中绑定，分歧和裁决保存在 `comparison.md`。

## Publication verdict

`CONTENT-READY / PASS-FIXTURE / RELEASE-BLOCKED`。未通过 practitioner、live、production 和出版门禁。
