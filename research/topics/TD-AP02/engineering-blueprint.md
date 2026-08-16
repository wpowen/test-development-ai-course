# TD-AP02 工程蓝图：TTFT、TPOT、Queue、Retry 与 Step 指标树

## Architecture and data flow

Metric events flow from task root through queue, generation, tool and retry spans into a versioned evaluator; each metric records denominator, slice, aggregation and owner.

## 五节点链路

workload fixture → arrival scheduler → Agent/model/tool simulator → task-rooted evidence → versioned evaluator/gate

## 接口与数据

- 输入：lab/profiles/TD-AP02.json 与 prompts/TD-AP02/input-v1.json。
- 执行：python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP02-lab.json --mode cycle。
- 输出：reports/TD-AP02/{baseline,fault,repair}/summary.json、traces.jsonl 与 cycle-summary.json。
- 判定：profile 中的 gates 是唯一门禁来源；Prompt 只解释结果，不能改阈值。
- 故障：同时抬高首 Token、逐 Token、排队、重试和步骤数。

## Metrics and decisions

Use task success, queue delay, TTFT, TPOT/ITL, end-to-end latency, retries and goodput together. A blocker in task outcome or safety cannot be hidden by a fast average.

## Baseline failure repair

The fault removes a required metric or changes its denominator; the checker must return exit 1. Repair restores the metric contract without changing thresholds and returns 0.

## 安全与边界

无网络、无真实模型、无外部副作用；写入仅限 reports。失败阶段预期退出码 1，cycle 只有观察到 0/1/0 才返回 0。synthetic workload 不得标记为 production capacity。
