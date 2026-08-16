# 检索评测：召回、排序与查询切片 research brief

## Controlling question

怎样把检索失败与生成失败分开，并用查询切片判断 recall 与 ranking？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: gold document、top-k、recall、precision、MRR、过滤条件、query reformulation 和难例切片. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: 检索 query set、gold document 映射和失败诊断报告. It is checked by `python3 scripts/run_lab.py --topic TD-T10 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 没有运行真实 embedding、向量库、reranker 或线上查询分布。
