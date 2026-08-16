# Eval Contract：先写发布问题，再选指标 research brief

## Controlling question

一个能决定发布的 Eval Contract 必须固定哪些字段和停止状态？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: system-under-test、风险、数据、Oracle、阈值、owner、版本与 stop state. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: 版本化 Eval Contract 和决策表. It is checked by `python3 scripts/run_lab.py --topic TD-T01 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 真实业务的错误成本、发布阈值和风险接受人只能由目标组织确认。
