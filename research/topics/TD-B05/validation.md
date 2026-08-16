# 污染与不确定性：Validation

## Research coverage

12 个 opened 来源覆盖 official API/spec、repository、paper、government guidance、benchmark harness、task benchmark、governance、production quality 与 observability。

## Claim traceability

页面解释 `怎样审计近重复、公开曝光、隐藏测试泄漏、样本波动和版本可比性？`；Fact 来自打开来源，工程决定 `证据不足时输出 SUSPECT/INCOMPARABLE，不宣布整体能力提升。` 标为 synthesis，企业阈值保持 unknown。

## Runnable lab

Manifest 固定 required files、working directory、baseline/fault/repair 和 0/1/0 exit；Prompt/Input/Schema/Eval/Mutation 同版本。

## Independent comparison

两次独立研究 run 在 `research-runs.json` 登记并由 `comparison.md` 裁决，保留分歧与反证。

## Publication verdict

`CONTENT-READY / PASS-FIXTURE / RELEASE-BLOCKED`。Model/provider、企业集成、practitioner、publication、production 均 NOT_RUN。Unknown：无法确认闭源模型训练数据，污染检测仍可能假阴性。
