# CI 分层门禁：Validation

## Research coverage

12 个 opened 来源覆盖 official API/spec、repository、paper、government guidance、benchmark harness、task benchmark、governance、production quality 与 observability。

## Claim traceability

页面解释 `怎样让 Prompt、模型、知识库或工具的危险回归在合并前真正 exit 1？`；Fact 来自打开来源，工程决定 `先杀死 blocker，再检查风险切片阈值，最后才展示总体分。` 标为 synthesis，企业阈值保持 unknown。

## Runnable lab

Manifest 固定 required files、working directory、baseline/fault/repair 和 0/1/0 exit；Prompt/Input/Schema/Eval/Mutation 同版本。

## Independent comparison

两次独立研究 run 在 `research-runs.json` 登记并由 `comparison.md` 裁决，保留分歧与反证。

## Publication verdict

`CONTENT-READY / PASS-FIXTURE / RELEASE-BLOCKED`。Model/provider、企业集成、practitioner、publication、production 均 NOT_RUN。Unknown：真实云 CI、企业审批和模型执行未运行。
