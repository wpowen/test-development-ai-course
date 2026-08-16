# TD-AP07 工程蓝图：长稳、资源漂移与泄漏

## Architecture and data flow

Warmup, steady-state and recovery windows feed resource snapshots, latency tails, cleanup checks and leak slope calculations into a versioned soak report.

## Architecture and data flow

The soak report stores raw snapshots and window boundaries alongside slope calculations, making a leak hypothesis reproducible instead of relying on a single dashboard average.

## 五节点链路

workload fixture → arrival scheduler → Agent/model/tool simulator → task-rooted evidence → versioned evaluator/gate

## 接口与数据

- 输入：lab/profiles/TD-AP07.json 与 prompts/TD-AP07/input-v1.json。
- 执行：python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP07-lab.json --mode cycle。
- 输出：reports/TD-AP07/{baseline,fault,repair}/summary.json、traces.jsonl 与 cycle-summary.json。
- 判定：profile 中的 gates 是唯一门禁来源；Prompt 只解释结果，不能改阈值。
- 故障：注入每任务 0.8MB 单调增长并制造清理失败。

## Metrics and decisions

Track resource slope, plateau, cleanup delta, p95/p99 and error/retry slices by window. A single short run cannot establish stability.

## Baseline failure repair

The fault leaks a resource or omits the recovery window and must exit 1. Repair closes the resource and restores all windows while preserving thresholds.

## 安全与边界

无网络、无真实模型、无外部副作用；写入仅限 reports。失败阶段预期退出码 1，cycle 只有观察到 0/1/0 才返回 0。synthetic workload 不得标记为 production capacity。
