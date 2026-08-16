# 模型生命周期：一次错误究竟来自哪里 research brief

## Controlling question

一次 AI 回答失败后，测试开发如何先定位生命周期层，再选择修复对象？

Learner level is L1. The professional actor is a test developer reviewing a synthetic refund-assistant change before release. The system boundary includes model input, context, retrieval or tool evidence, deterministic checks and a named human decision owner. The business object is a versioned refund request. The failure cost is a false release decision, unsafe side effect, policy misstatement or evidence that cannot be reproduced.

In scope: 数据、预训练、后训练、部署、推理和监控之间的责任边界. The page must explain the mechanism, expose a repository-owned artifact, run baseline/fault/repair, and show the exact signal that changes the decision. Out of scope: training a foundation model, claiming universal thresholds, production efficacy, legal interpretation, or approval on behalf of a business/security owner.

Learner artifact: 模型生命周期—测试责任图和版本 Manifest. It is checked by `python3 scripts/run_lab.py --topic TD-F02 --phase baseline|fault|repair`. Freshness requirement: current primary technical documentation plus durable papers and evaluation guidance. Required families span architecture, implementation, metrics, governance, failure/counterevidence and learning supply. 基础模型训练数据、后训练配方及提供方内部发布变更通常不可见。
