# 重复运行与统计：从一次结果到可解释分布 research brief

## Controlling question

概率系统应该运行多少次、报告什么统计量，才能支撑有限而诚实的决定？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: 估计目标、重复运行、分母、切片分布、置信区间、配对比较和 blocker 分离. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: 重复运行报告、分布图和发布解释模板. It is checked by `python3 scripts/run_lab.py --topic TD-T04 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 教学中的五次运行不构成生产样本量建议，样本量取决于估计目标与错误成本。
