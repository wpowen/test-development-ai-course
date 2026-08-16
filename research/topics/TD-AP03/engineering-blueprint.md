# TD-AP03 工程蓝图：Trace 语义与因果证据

## Architecture and data flow

One task root links generation, tool, attempt, handoff and finalize spans; a versioned schema and privacy scrubber feed the independent trace evaluator.

## Architecture and data flow

The evaluator also records schema version, privacy policy and missing-span reason, so a learner can distinguish absent telemetry from a business failure before deciding whether to block release.

## 五节点链路

workload fixture → arrival scheduler → Agent/model/tool simulator → task-rooted evidence → versioned evaluator/gate

## 接口与数据

- 输入：lab/profiles/TD-AP03.json 与 prompts/TD-AP03/input-v1.json。
- 执行：python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP03-lab.json --mode cycle。
- 输出：reports/TD-AP03/{baseline,fault,repair}/summary.json、traces.jsonl 与 cycle-summary.json。
- 判定：profile 中的 gates 是唯一门禁来源；Prompt 只解释结果，不能改阈值。
- 故障：让 45% 模型/工具 Span 丢失父子关联。

## Metrics and decisions

Measure trace completeness, parent-child closure, tool attribution and redaction coverage by task, not by raw span count. Missing closure is a release blocker.

## Baseline failure repair

The fault drops a child span or breaks the parent link and must exit 1. Repair restores linkage and keeps the schema version and redaction policy unchanged.

## 安全与边界

无网络、无真实模型、无外部副作用；写入仅限 reports。失败阶段预期退出码 1，cycle 只有观察到 0/1/0 才返回 0。synthetic workload 不得标记为 production capacity。
