# Capstone Fixture Release Candidate：Validation

## Research coverage

12 个 opened 来源覆盖 official API/spec、repository、paper、government guidance、benchmark harness、task benchmark、governance、production quality 与 observability。

## Claim traceability

页面解释 `怎样消费全链工件，让一个坏 AI 版本可重复失败、定位和恢复？`；Fact 来自打开来源，工程决定 `闭包最多证明 fixture release candidate，不得晋级 publication、production 或 practitioner。` 标为 synthesis，企业阈值保持 unknown。

## Runnable lab

Manifest 固定 required files、working directory、baseline/fault/repair 和 0/1/0 exit；Prompt/Input/Schema/Eval/Mutation 同版本。

## Independent comparison

两次独立研究 run 在 `research-runs.json` 登记并由 `comparison.md` 裁决，保留分歧与反证。

## Publication verdict

`CONTENT-READY / PASS-FIXTURE / RELEASE-BLOCKED`。Model/provider、企业集成、practitioner、publication、production 均 NOT_RUN。Unknown：模型、真实 RAG/Agent、企业集成、人审和发布全部 NOT_RUN。
