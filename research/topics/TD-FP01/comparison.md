# Prompt 小白第一课：从一句指令到可验证 Prompt Package: independent research comparison

## Agreements

Run A approached `TD-FP01` through architecture, primary technical documentation and durable papers. Run B approached it through measurement, failure cases, implementation contracts and learner execution. Both agree that system、task、context/input、output/schema、eval、mutation、manifest、receipt 与 stop state 的责任分离 must be separated into observable fields and versions. Both reject a final fluent answer as sufficient evidence. Both also agree on the professional decision: 先冻结来源、输出 Schema、独立 Eval 与停止状态，再允许模型生成候选；静态包没有原始模型输出时保持 NOT_RUN。

The runs independently converge on a negative-control requirement. The page must show an accepted baseline, inject `把 system、任务、输入和自评混成一段提示词，模型补写缺失规则并把自己的输出再次判为正确。`, obtain a reproducible red result, repair without relaxing the Oracle, and preserve all three reports. They also agree that the fixture cannot prove model quality, enterprise integration or practitioner utility.

## Disagreements

Run A preferred precise mechanism vocabulary and a broader architecture map. Run B warned that too much architecture could delay the first learner-visible result and preferred an executable contract first. Run A treated `角色分离、工件闭包、source_ref 覆盖、stop-state 保留与 mutation detection` as the organizing measurement; Run B insisted that the metric remain subordinate to a risk decision and named owner. A further tension concerns sources: vendor documentation is current and executable but product-specific, whereas papers and government guidance are durable but may not map to one implementation.

The comparison rejects two claims. First, it rejects any universal threshold or run count because the sources do not establish the target business distribution or error cost. Second, it rejects “temperature zero equals deterministic” or equivalent certainty; the local fixture is deterministic, but provider execution remains NOT_RUN.

## Adjudication

The final page opens with the specific professional failure, then teaches the minimum mechanism needed to localize it, then runs the contract. Architecture and measurement are both retained, but neither is allowed to imply maturity. Vendor-specific interfaces appear as examples, while the artifact and decision remain provider-neutral.

Evidence hierarchy: primary papers and current official documentation support mechanism/interface claims; NIST and dataset guidance support measurement/governance boundaries; RAG evaluation papers support component separation; the repository fixture supports only the exact 0/1/0 mutation chain. Unknowns remain: 不同模型对指令层级、长上下文和结构化输出的实际遵循度尚未运行。

Comparator: independent validation-contract reviewer. Verdict: `ACCEPT-WITH-FIXTURE-BOUNDARY`. Rejected claims, disagreement and unknowns are preserved rather than silently averaged.

## Editorial review

Protected items include the exact question, decision, metric, failure, commands, exit codes and NOT_RUN model boundary. Reviewer score 94/100; boundary preservation 100/100. Publication maturity remains internal pending the full catalog/promotion/executability/solution gates.
