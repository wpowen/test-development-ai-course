# LLM、RAG、Agent、Worker 与 Workflow 的被测边界: independent research comparison

## Agreements

Run A approached `TD-F04` through architecture, primary technical documentation and durable papers. Run B approached it through measurement, failure cases, implementation contracts and learner execution. Both agree that 生成、检索、工具、状态、Handoff、终止和副作用的分层架构 must be separated into observable fields and versions. Both reject a final fluent answer as sufficient evidence. Both also agree on the professional decision: 按谁决定下一步、状态存在哪里、是否能产生副作用来分类，不按产品营销名称分类。

The runs independently converge on a negative-control requirement. The page must show an accepted baseline, inject `最终文本写着未退款，但 Agent 已尝试调用退款工具；只看回复导致严重假绿。`, obtain a reproducible red result, repair without relaxing the Oracle, and preserve all three reports. They also agree that the fixture cannot prove model quality, enterprise integration or practitioner utility.

## Disagreements

Run A preferred precise mechanism vocabulary and a broader architecture map. Run B warned that too much architecture could delay the first learner-visible result and preferred an executable contract first. Run A treated `Trace 层覆盖率、禁止动作命中数、人工 Gate 前置率` as the organizing measurement; Run B insisted that the metric remain subordinate to a risk decision and named owner. A further tension concerns sources: vendor documentation is current and executable but product-specific, whereas papers and government guidance are durable but may not map to one implementation.

The comparison rejects two claims. First, it rejects any universal threshold or run count because the sources do not establish the target business distribution or error cost. Second, it rejects “temperature zero equals deterministic” or equivalent certainty; the local fixture is deterministic, but provider execution remains NOT_RUN.

## Adjudication

The final page opens with the specific professional failure, then teaches the minimum mechanism needed to localize it, then runs the contract. Architecture and measurement are both retained, but neither is allowed to imply maturity. Vendor-specific interfaces appear as examples, while the artifact and decision remain provider-neutral.

Evidence hierarchy: primary papers and current official documentation support mechanism/interface claims; NIST and dataset guidance support measurement/governance boundaries; RAG evaluation papers support component separation; the repository fixture supports only the exact 0/1/0 mutation chain. Unknowns remain: 目标框架对 Agent、Worker 和 Workflow 的命名、重试和状态语义尚未接入。

Comparator: independent validation-contract reviewer. Verdict: `ACCEPT-WITH-FIXTURE-BOUNDARY`. Rejected claims, disagreement and unknowns are preserved rather than silently averaged.

## Editorial review

Protected items include the exact question, decision, metric, failure, commands, exit codes and NOT_RUN model boundary. Reviewer score 94/100; boundary preservation 100/100. Publication maturity remains internal pending the full catalog/promotion/executability/solution gates.
