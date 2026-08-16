# Composite Oracle：规则、语义 Judge 与人工如何组合 research brief

## Controlling question

怎样组合确定性规则、语义评分与人工复核，避免 Judge 自证和平均分掩盖 blocker？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: Schema、业务不变量、权限、引用、语义 rubric、Judge 校准和人工升级. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: 风险—Oracle 决策表和分歧升级记录. It is checked by `python3 scripts/run_lab.py --topic TD-T03 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 模型 Judge 在目标领域的偏差、位置效应和一致性尚未用人工双标集校准。
