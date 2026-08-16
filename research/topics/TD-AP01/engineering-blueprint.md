# TD-AP01 工程蓝图：工作负载模型与任务口径

## Architecture and data flow

The page owns a versioned workload profile, prompt/input contract, deterministic simulator, task-rooted trace writer and evaluator. Every transition carries page_id, workload_version and configuration_hash for reproducible offline evidence.

## 五节点链路

workload fixture → arrival scheduler → Agent/model/tool simulator → task-rooted evidence → versioned evaluator/gate

## 接口与数据

- 输入：lab/profiles/TD-AP01.json 与 prompts/TD-AP01/input-v1.json。
- 执行：python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP01-lab.json --mode cycle。
- 输出：reports/TD-AP01/{baseline,fault,repair}/summary.json、traces.jsonl 与 cycle-summary.json。
- 判定：profile 中的 gates 是唯一门禁来源；Prompt 只解释结果，不能改阈值。
- 故障：删去一半任务切片并只保留入口 2xx Oracle。

## Metrics and decisions

Use task success and allowed terminal states as the primary denominator. Record arrival rate, concurrency, queue delay, tail latency, retry count, tool path coverage and goodput with units, slice, aggregation, owner and failure action. A terminal-state blocker dominates an acceptable average.

## Baseline failure repair

Baseline is intact; fault removes task slices and keeps only an entry 2xx oracle, so the evaluator returns FAIL with exit code 1. Repair restores the workload and oracle without deleting thresholds; the fixture pattern remains 0/1/0.

## 安全与边界

无网络、无真实模型、无外部副作用；写入仅限 reports。失败阶段预期退出码 1，cycle 只有观察到 0/1/0 才返回 0。synthetic workload 不得标记为 production capacity。
