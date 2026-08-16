# TD-AP06 工程蓝图：超时、重试与安全降级

## Architecture and data flow

Deadlines and attempt budgets propagate from gateway to SDK, Agent and tool; a terminal-state policy records retry, read-only fallback, human handoff and reconciliation evidence.

## 五节点链路

workload fixture → arrival scheduler → Agent/model/tool simulator → task-rooted evidence → versioned evaluator/gate

## 接口与数据

- 输入：lab/profiles/TD-AP06.json 与 prompts/TD-AP06/input-v1.json。
- 执行：python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP06-lab.json --mode cycle。
- 输出：reports/TD-AP06/{baseline,fault,repair}/summary.json、traces.jsonl 与 cycle-summary.json。
- 判定：profile 中的 gates 是唯一门禁来源；Prompt 只解释结果，不能改阈值。
- 故障：提高失败率并允许 3–5 次重试，移除压力降级。

## Metrics and decisions

Measure deadline consumption, attempts, backoff, duplicate prevention, terminal state and side-effect class. Write actions require idempotency and human authority.

## Baseline failure repair

The fault creates an unbounded retry or unsafe write path and must exit 1. Repair bounds attempts and restores a safe terminal state without swallowing the error.

## 安全与边界

无网络、无真实模型、无外部副作用；写入仅限 reports。失败阶段预期退出码 1，cycle 只有观察到 0/1/0 才返回 0。synthetic workload 不得标记为 production capacity。
