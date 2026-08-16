# 漂移、Waiver 与回滚：Validation

## Research coverage

12 个 opened 来源覆盖 official API/spec、repository、paper、government guidance、benchmark harness、task benchmark、governance、production quality 与 observability。

## Claim traceability

页面解释 `质量异常出现时怎样区分输入、模型、知识、Judge、性能和成本漂移？`；Fact 来自打开来源，工程决定 `高风险先回滚再调查；例外必须具名、受限并自动到期。` 标为 synthesis，企业阈值保持 unknown。

## Runnable lab

Manifest 固定 required files、working directory、baseline/fault/repair 和 0/1/0 exit；Prompt/Input/Schema/Eval/Mutation 同版本。

## Independent comparison

两次独立研究 run 在 `research-runs.json` 登记并由 `comparison.md` 裁决，保留分歧与反证。

## Publication verdict

`CONTENT-READY / PASS-FIXTURE / RELEASE-BLOCKED`。Model/provider、企业集成、practitioner、publication、production 均 NOT_RUN。Unknown：真实监控基线、值班流程和回滚演练未运行。
