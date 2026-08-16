# Faithfulness 与 Citation：回答是否真的被证据支持: evidence synthesis

## Fact

The opened evidence does not support treating an AI system as a single black-box answer generator. Transformer and RAG papers identify different mechanisms; current evaluation interfaces expose datasets, samples, graders and model configuration; agent guidance distinguishes predetermined workflows from model-directed tool loops. For this topic the concrete evidence question is **如何把回答拆成声明，验证每个关键声明受当前上下文支持且引用可解析？**. The durable fact is that the test conclusion is conditional on the declared system boundary and versions, not on the fluency of one output.

Google's dataset guidance separates development/validation activity from a final test surface and warns that repeated reuse can wear out an evaluation set. NIST's statistical evaluation work distinguishes performance on a fixed benchmark from performance generalized to a larger population. RAG evaluation research separates retrieval relevance, answer relevance and faithfulness instead of collapsing them into one impression. These sources establish vocabulary and failure possibilities; they do not select a refund threshold or grant release authority.

## Cross-source synthesis

For `TD-T11`, the operational focus is claim extraction、entailment、citation alignment、source conflict、答案完整性和 unsupported claim. Architecture sources explain where information and control flow; metric sources explain what a number's denominator and aggregation mean; governance sources require documented measurement and human accountability; failure sources show why a successful final answer can coexist with a broken intermediate layer. Together they support this engineering rule: 关键业务声明必须回链到当前证据；自动 faithfulness 分数只用于筛查，冲突与高风险声明进入人工复核。

The conventional software-testing baseline remains useful. Stable fields, schemas, permissions, source identifiers, version hashes, stop states and side effects should be checked deterministically. Probability changes the evidence design for semantic behavior: save raw observations, repeat selected cases, stratify by risk slice and retain disagreements. It does not justify replacing precise contracts with a second model's opinion.

The pivotal counterexample is: 回答引用了正确文档 ID，却捏造了文档没有的自动退款承诺。 That example changes the professional action. A reviewer must first inspect the declared input distribution and manifest, then the layer-specific evidence, then the release decision. Editing a Prompt before localization is not an evidence-based diagnosis.

The primary measurement surface is supported-claim ratio、citation precision、冲突数与关键声明 blocker. It needs a numerator, denominator, aggregation, risk dimensions, source point, version and owner. A threshold is scenario-specific: it is derived from the cost of the synthetic refund failure and is not presented as an industry default. A single average is explicitly insufficient when one high-risk blocker can be hidden by many easy successes.

### Evidence boundary

The baseline/fault/repair lab is a deterministic fixture that checks whether a contract catches an intentionally corrupted field. It does not call an LLM, vector database, agent framework, identity service or enterprise platform. A PASS therefore means the offline checker killed the specified mutation. It does not mean the underlying AI capability, production distribution, human workflow or organization policy is validated.

## Unknown

自动 scorer 尚未与领域人工校准，也未运行真实生成模型。 The source pool also cannot establish the target company's traffic distribution, policy precedence, privacy classification, incident history, model/provider behavior, acceptable false-positive cost or release owner. Those fields stay `UNKNOWN` or `NOT_RUN`; the model is not allowed to infer them. Practitioner review and a real integration receipt are separate future gates.

## Editorial review

Protected items checked: `TD-T11`, exact commands, expected exit codes 0/1/0, `supported-claim ratio、citation precision、冲突数与关键声明 blocker`, status vocabulary, cited URLs and the fixture boundary. Generic promise phrases were removed. Facts, cross-source synthesis and unknowns remain distinct. The local commands are rerun by the build script; model behavior is not claimed. Editorial score: 94/100; boundary preservation: 100/100; unresolved issue: practitioner and live integration evidence remain absent.
