# Token、Context 与非确定性：为什么一次 PASS 不够 research brief

## Controlling question

怎样把 Token、Context、解码和非确定性变成可控的测试变量？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: 上下文预算、位置影响、采样配置、重复运行和单变量实验. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: 推理变量—测试设计矩阵和重复运行计划. It is checked by `python3 scripts/run_lab.py --topic TD-F03 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 不同硬件、内核、批处理与服务端路由对确定性的影响需要当前环境实测。
