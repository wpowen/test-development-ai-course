# 质量—延迟—成本联合 Gate：Validation

## Research coverage

12 个 opened 来源覆盖 official API/spec、repository、paper、government guidance、benchmark harness、task benchmark、governance、production quality 与 observability。

## Claim traceability

页面解释 `怎样避免平均质量、更快或更便宜中的单指标优化伤害另两个维度？`；Fact 来自打开来源，工程决定 `先淘汰突破硬底线的候选，再在合格候选中讨论 Pareto 权衡。` 标为 synthesis，企业阈值保持 unknown。

## Runnable lab

Manifest 固定 required files、working directory、baseline/fault/repair 和 0/1/0 exit；Prompt/Input/Schema/Eval/Mutation 同版本。

## Independent comparison

两次独立研究 run 在 `research-runs.json` 登记并由 `comparison.md` 裁决，保留分歧与反证。

## Publication verdict

`CONTENT-READY / PASS-FIXTURE / RELEASE-BLOCKED`。Model/provider、企业集成、practitioner、publication、production 均 NOT_RUN。Unknown：真实模型价格、流量、缓存与 SLO 未测。
