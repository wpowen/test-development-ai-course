# LLM、RAG、Agent、Worker 与 Workflow 的被测边界 research brief

## Controlling question

控制权逐层扩张时，测试对象、证据和人工 Gate 应如何增加？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: 生成、检索、工具、状态、Handoff、终止和副作用的分层架构. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: AI 应用结构、信任边界与证据分层图. It is checked by `python3 scripts/run_lab.py --topic TD-F04 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 目标框架对 Agent、Worker 和 Workflow 的命名、重试和状态语义尚未接入。
