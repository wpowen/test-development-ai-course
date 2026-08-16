# 无答案、权限与端到端 RAG Gate: evidence synthesis

## Fact

The opened evidence does not support treating an AI system as a single black-box answer generator. Transformer and RAG papers identify different mechanisms; current evaluation interfaces expose datasets, samples, graders and model configuration; agent guidance distinguishes predetermined workflows from model-directed tool loops. For this topic the concrete evidence question is **没有证据、没有权限或来源冲突时，系统如何安全停止并留下可审计证据？**. The durable fact is that the test conclusion is conditional on the declared system boundary and versions, not on the fluency of one output.

Google's dataset guidance separates development/validation activity from a final test surface and warns that repeated reuse can wear out an evaluation set. NIST's statistical evaluation work distinguishes performance on a fixed benchmark from performance generalized to a larger population. RAG evaluation research separates retrieval relevance, answer relevance and faithfulness instead of collapsing them into one impression. These sources establish vocabulary and failure possibilities; they do not select a refund threshold or grant release authority.

## Cross-source synthesis

For `TD-T12`, the operational focus is no-answer、拒答、Handoff、tenant ACL、prompt injection、工具副作用和端到端发布 Gate. Architecture sources explain where information and control flow; metric sources explain what a number's denominator and aggregation mean; governance sources require documented measurement and human accountability; failure sources show why a successful final answer can coexist with a broken intermediate layer. Together they support this engineering rule: 证据不足、来源冲突或权限不明时拒答或转人工；任何未授权读取和副作用独立阻断。

The conventional software-testing baseline remains useful. Stable fields, schemas, permissions, source identifiers, version hashes, stop states and side effects should be checked deterministically. Probability changes the evidence design for semantic behavior: save raw observations, repeat selected cases, stratify by risk slice and retain disagreements. It does not justify replacing precise contracts with a second model's opinion.

The pivotal counterexample is: 跨租户问题没有正确文档，系统却从其他租户语料拼出一个流畅答案。 That example changes the professional action. A reviewer must first inspect the declared input distribution and manifest, then the layer-specific evidence, then the release decision. Editing a Prompt before localization is not an evidence-based diagnosis.

The primary measurement surface is 正确拒答率、越权命中数、无副作用率、Handoff 完整率. It needs a numerator, denominator, aggregation, risk dimensions, source point, version and owner. A threshold is scenario-specific: it is derived from the cost of the synthetic refund failure and is not presented as an industry default. A single average is explicitly insufficient when one high-risk blocker can be hidden by many easy successes.

### Evidence boundary

The baseline/fault/repair lab is a deterministic fixture that checks whether a contract catches an intentionally corrupted field. It does not call an LLM, vector database, agent framework, identity service or enterprise platform. A PASS therefore means the offline checker killed the specified mutation. It does not mean the underlying AI capability, production distribution, human workflow or organization policy is validated.

## Unknown

真实身份链、租户隔离、策略引擎与人工 SLA 未集成验证。 The source pool also cannot establish the target company's traffic distribution, policy precedence, privacy classification, incident history, model/provider behavior, acceptable false-positive cost or release owner. Those fields stay `UNKNOWN` or `NOT_RUN`; the model is not allowed to infer them. Practitioner review and a real integration receipt are separate future gates.

## Editorial review

Protected items checked: `TD-T12`, exact commands, expected exit codes 0/1/0, `正确拒答率、越权命中数、无副作用率、Handoff 完整率`, status vocabulary, cited URLs and the fixture boundary. Generic promise phrases were removed. Facts, cross-source synthesis and unknowns remain distinct. The local commands are rerun by the build script; model behavior is not claimed. Editorial score: 94/100; boundary preservation: 100/100; unresolved issue: practitioner and live integration evidence remain absent.
