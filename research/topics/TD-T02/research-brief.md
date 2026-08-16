# Dataset、Slice 与 Holdout：让评测数据不会越调越假 research brief

## Controlling question

如何从业务风险构造 Eval dataset，并阻止切片缺失、重复和 Holdout 泄漏？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: 样例来源、风险切片、标签 owner、去重、时间切分、开发集和封存 Holdout. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: Eval dataset、数据卡、切片矩阵和 Holdout 清单. It is checked by `python3 scripts/run_lab.py --topic TD-T02 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 合成数据的分布代表性与领域标签一致性尚未通过生产样本校准。
