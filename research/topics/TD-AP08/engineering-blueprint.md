# TD-AP08 工程蓝图：SLO、告警与事故证据

## Architecture and data flow

Good-task events aggregate into SLI windows, burn-rate evaluator, owner routing, mitigation record and incident-example feedback loop.

## Architecture and data flow

The SLO path stores raw good-task events, window aggregates, burn-rate result, owner routing, mitigation and recovery links so an alert can be audited back to a concrete task.

## 五节点链路

workload fixture → arrival scheduler → Agent/model/tool simulator → task-rooted evidence → versioned evaluator/gate

## 接口与数据

- 输入：lab/profiles/TD-AP08.json 与 prompts/TD-AP08/input-v1.json。
- 执行：python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP08-lab.json --mode cycle。
- 输出：reports/TD-AP08/{baseline,fault,repair}/summary.json、traces.jsonl 与 cycle-summary.json。
- 判定：profile 中的 gates 是唯一门禁来源；Prompt 只解释结果，不能改阈值。
- 故障：降低 good-task rate，并移除告警动作和事故证据。

## Metrics and decisions

Define numerator, denominator, window, burn threshold, owner, stop action and recovery evidence. Alerting must not be based on average latency alone.

## Baseline failure repair

The fault drops good-task evidence or owner/action fields and must exit 1. Repair restores the SLO and incident closure chain without lowering thresholds.

## 安全与边界

无网络、无真实模型、无外部副作用；写入仅限 reports。失败阶段预期退出码 1，cycle 只有观察到 0/1/0 才返回 0。synthetic workload 不得标记为 production capacity。
