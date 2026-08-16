# Faithfulness 与 Citation：回答是否真的被证据支持 research brief

## Controlling question

如何把回答拆成声明，验证每个关键声明受当前上下文支持且引用可解析？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: claim extraction、entailment、citation alignment、source conflict、答案完整性和 unsupported claim. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: 声明—证据矩阵、Citation 报告和反例集. It is checked by `python3 scripts/run_lab.py --topic TD-T11 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 自动 scorer 尚未与领域人工校准，也未运行真实生成模型。
