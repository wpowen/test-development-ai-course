# TD-F05 Evidence Synthesis

## Fact

The source document names common AI tasks and quality dimensions: input/output validity, boundary coverage, classification and recognition, summarization and generation, RAG retrieval, throughput, latency, resource consumption, stability, robustness, security, usability, explainability, and business measures. Professional, official, and standard references support measuring a defined population, choosing an observable signal, assigning an owner, and using a decision action. They do not make F1, ROUGE, Recall@k, QPS, or latency a universal threshold.

## Cross-source synthesis

Route A starts with task definitions and metric documentation. Route B tests common misuse: overall accuracy hides a high-risk slice, ROUGE is treated as factual correctness, QPS is treated as Agent success, or latency is optimized after a safety failure. Agreement: the metric needs an independent oracle, population, denominator, slice, version, uncertainty, owner, and failure action. Adjudication: a Metric Card is the required artifact, and an auxiliary signal must state what it cannot prove.

The method is: business task → error cost → population and risk slice → independent oracle → metric formula → uncertainty → owner and threshold → release/investigate action. Prompt output is candidate-only. The fixture runner mutates denominator, oracle, and universal-threshold fields; if the card remains green, the metric contract has no detection power.

## Inference

Task-first selection should be more reusable than tool-first selection because the same metric name changes meaning with the denominator, slice, and decision. Separating retrieval, evidence support, end-to-end answer, trajectory, and side-effect outcomes is an engineering synthesis, not a claim that one composite score is sufficient.

## Unknown

Real business loss, population distribution, regulatory obligations, production traffic, model version, target threshold, uncertainty interval, and decision owner remain unknown. Fixture values are not production or industry commitments.
