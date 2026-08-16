# LLM、RAG、Agent、Worker 与 Workflow 的被测边界: evidence synthesis

## Fact

The opened evidence does not support treating an AI system as a single black-box answer generator. Transformer and RAG papers identify different mechanisms; current evaluation interfaces expose datasets, samples, graders and model configuration; agent guidance distinguishes predetermined workflows from model-directed tool loops. For this topic the concrete evidence question is **控制权逐层扩张时，测试对象、证据和人工 Gate 应如何增加？**. The durable fact is that the test conclusion is conditional on the declared system boundary and versions, not on the fluency of one output.

Google's dataset guidance separates development/validation activity from a final test surface and warns that repeated reuse can wear out an evaluation set. NIST's statistical evaluation work distinguishes performance on a fixed benchmark from performance generalized to a larger population. RAG evaluation research separates retrieval relevance, answer relevance and faithfulness instead of collapsing them into one impression. These sources establish vocabulary and failure possibilities; they do not select a refund threshold or grant release authority.

## Cross-source synthesis

For `TD-F04`, the operational focus is 生成、检索、工具、状态、Handoff、终止和副作用的分层架构. Architecture sources explain where information and control flow; metric sources explain what a number's denominator and aggregation mean; governance sources require documented measurement and human accountability; failure sources show why a successful final answer can coexist with a broken intermediate layer. Together they support this engineering rule: 按谁决定下一步、状态存在哪里、是否能产生副作用来分类，不按产品营销名称分类。

The conventional software-testing baseline remains useful. Stable fields, schemas, permissions, source identifiers, version hashes, stop states and side effects should be checked deterministically. Probability changes the evidence design for semantic behavior: save raw observations, repeat selected cases, stratify by risk slice and retain disagreements. It does not justify replacing precise contracts with a second model's opinion.

The pivotal counterexample is: 最终文本写着未退款，但 Agent 已尝试调用退款工具；只看回复导致严重假绿。 That example changes the professional action. A reviewer must first inspect the declared input distribution and manifest, then the layer-specific evidence, then the release decision. Editing a Prompt before localization is not an evidence-based diagnosis.

The primary measurement surface is Trace 层覆盖率、禁止动作命中数、人工 Gate 前置率. It needs a numerator, denominator, aggregation, risk dimensions, source point, version and owner. A threshold is scenario-specific: it is derived from the cost of the synthetic refund failure and is not presented as an industry default. A single average is explicitly insufficient when one high-risk blocker can be hidden by many easy successes.

### Evidence boundary

The baseline/fault/repair lab is a deterministic fixture that checks whether a contract catches an intentionally corrupted field. It does not call an LLM, vector database, agent framework, identity service or enterprise platform. A PASS therefore means the offline checker killed the specified mutation. It does not mean the underlying AI capability, production distribution, human workflow or organization policy is validated.

## Unknown

目标框架对 Agent、Worker 和 Workflow 的命名、重试和状态语义尚未接入。 The source pool also cannot establish the target company's traffic distribution, policy precedence, privacy classification, incident history, model/provider behavior, acceptable false-positive cost or release owner. Those fields stay `UNKNOWN` or `NOT_RUN`; the model is not allowed to infer them. Practitioner review and a real integration receipt are separate future gates.

## Editorial review

Protected items checked: `TD-F04`, exact commands, expected exit codes 0/1/0, `Trace 层覆盖率、禁止动作命中数、人工 Gate 前置率`, status vocabulary, cited URLs and the fixture boundary. Generic promise phrases were removed. Facts, cross-source synthesis and unknowns remain distinct. The local commands are rerun by the build script; model behavior is not claimed. Editorial score: 94/100; boundary preservation: 100/100; unresolved issue: practitioner and live integration evidence remain absent.
