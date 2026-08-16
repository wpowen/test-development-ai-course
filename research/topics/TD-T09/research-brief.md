# RAG 语料治理：来源、版本、分块与权限 research brief

## Controlling question

进入索引前，怎样证明语料是当前、可引用、可授权和可撤销的？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: source document、chunk、metadata、effective date、ACL、索引版本和删除传播. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: RAG corpus manifest、chunk schema 和索引准入报告. It is checked by `python3 scripts/run_lab.py --topic TD-T09 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 真实文档系统的 ACL、删除 SLA、OCR 和分块质量尚未连接。
