# TD-AP05 工程蓝图：容量曲线与瓶颈归因

## Architecture and data flow

Step load through controlled levels, capture queue/prefill/decode/tool/retry evidence, and pass a bottleneck report to an independent gate evaluator.

## Architecture and data flow

The bottleneck report keeps the controlled input, first failing gate, raw evidence references and uncertainty note together, preventing a single aggregate from hiding a queue or tool-path failure.

## 五节点链路

workload fixture → arrival scheduler → Agent/model/tool simulator → task-rooted evidence → versioned evaluator/gate

## 接口与数据

- 输入：lab/profiles/TD-AP05.json 与 prompts/TD-AP05/input-v1.json。
- 执行：python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP05-lab.json --mode cycle。
- 输出：reports/TD-AP05/{baseline,fault,repair}/summary.json、traces.jsonl 与 cycle-summary.json。
- 判定：profile 中的 gates 是唯一门禁来源；Prompt 只解释结果，不能改阈值。
- 故障：压低 worker、加快到达并隐藏 bottleneck 标签。

## Metrics and decisions

Report first failing level, goodput, p95/p99, queue, error and resource slices with the controlled variable and owner. A synthetic curve is not a production capacity claim.

## Baseline failure repair

The fault masks the first failing gate or changes the step size; it must exit 1. Repair restores the fixed threshold and attribution fields.

## 安全与边界

无网络、无真实模型、无外部副作用；写入仅限 reports。失败阶段预期退出码 1，cycle 只有观察到 0/1/0 才返回 0。synthetic workload 不得标记为 production capacity。
