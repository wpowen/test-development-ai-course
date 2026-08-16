# 无答案、权限与端到端 RAG Gate research brief

## Controlling question

没有证据、没有权限或来源冲突时，系统如何安全停止并留下可审计证据？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: no-answer、拒答、Handoff、tenant ACL、prompt injection、工具副作用和端到端发布 Gate. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: RAG 端到端 Gate、权限攻击集和人工升级 Runbook. It is checked by `python3 scripts/run_lab.py --topic TD-T12 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 真实身份链、租户隔离、策略引擎与人工 SLA 未集成验证。
