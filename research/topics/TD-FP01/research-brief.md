# Prompt 小白第一课：从一句指令到可验证 Prompt Package research brief

## Controlling question

如何把聊天式指令拆成可版本化、可评价、可故障注入且保留人工决定权的专业 Prompt Package？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: system、task、context/input、output/schema、eval、mutation、manifest、receipt 与 stop state 的责任分离. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: 版本化 Prompt Package、适配卡和 0/1/0 运行收据. It is checked by `python3 scripts/run_lab.py --topic TD-FP01 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 不同模型对指令层级、长上下文和结构化输出的实际遵循度尚未运行。
