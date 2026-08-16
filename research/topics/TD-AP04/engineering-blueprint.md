# TD-AP04 工程蓝图：开放与封闭负载模型

## Architecture and data flow

The harness runs identical task fixtures under an open arrival scheduler and a closed concurrency executor, then sends both streams to the same task oracle and latency evaluator.

## 五节点链路

workload fixture → arrival scheduler → Agent/model/tool simulator → task-rooted evidence → versioned evaluator/gate

## 接口与数据

- 输入：lab/profiles/TD-AP04.json 与 prompts/TD-AP04/input-v1.json。
- 执行：python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP04-lab.json --mode cycle。
- 输出：reports/TD-AP04/{baseline,fault,repair}/summary.json、traces.jsonl 与 cycle-summary.json。
- 判定：profile 中的 gates 是唯一门禁来源；Prompt 只解释结果，不能改阈值。
- 故障：把容量实验换成封闭负载并制造服务变慢。

## Metrics and decisions

Record offered rate, achieved rate, concurrency, queue time and tail latency separately. The decision must state which model answers which operational question and whether omission was controlled.

## Baseline failure repair

The fault uses the wrong executor or hides queue time; it must exit 1. Repair restores the declared model and evidence, yielding fixture-only 0/1/0.

## 安全与边界

无网络、无真实模型、无外部副作用；写入仅限 reports。失败阶段预期退出码 1，cycle 只有观察到 0/1/0 才返回 0。synthetic workload 不得标记为 production capacity。
