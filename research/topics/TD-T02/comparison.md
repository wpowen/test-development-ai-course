# Dataset、Slice 与 Holdout：让评测数据不会越调越假: independent research comparison

## Agreements

Run A approached `TD-T02` through architecture, primary technical documentation and durable papers. Run B approached it through measurement, failure cases, implementation contracts and learner execution. Both agree that 样例来源、风险切片、标签 owner、去重、时间切分、开发集和封存 Holdout must be separated into observable fields and versions. Both reject a final fluent answer as sufficient evidence. Both also agree on the professional decision: 日常调试只看 development 集；Holdout 封存并限制访问，重复使用后必须记录耗损与更新计划。

The runs independently converge on a negative-control requirement. The page must show an accepted baseline, inject `开发者反复针对最终回归集调 Prompt，总分持续上升，真实新问题却没有改善。`, obtain a reproducible red result, repair without relaxing the Oracle, and preserve all three reports. They also agree that the fixture cannot prove model quality, enterprise integration or practitioner utility.

## Disagreements

Run A preferred precise mechanism vocabulary and a broader architecture map. Run B warned that too much architecture could delay the first learner-visible result and preferred an executable contract first. Run A treated `切片覆盖率、重复率、Holdout 访问次数、标签分歧率` as the organizing measurement; Run B insisted that the metric remain subordinate to a risk decision and named owner. A further tension concerns sources: vendor documentation is current and executable but product-specific, whereas papers and government guidance are durable but may not map to one implementation.

The comparison rejects two claims. First, it rejects any universal threshold or run count because the sources do not establish the target business distribution or error cost. Second, it rejects “temperature zero equals deterministic” or equivalent certainty; the local fixture is deterministic, but provider execution remains NOT_RUN.

## Adjudication

The final page opens with the specific professional failure, then teaches the minimum mechanism needed to localize it, then runs the contract. Architecture and measurement are both retained, but neither is allowed to imply maturity. Vendor-specific interfaces appear as examples, while the artifact and decision remain provider-neutral.

Evidence hierarchy: primary papers and current official documentation support mechanism/interface claims; NIST and dataset guidance support measurement/governance boundaries; RAG evaluation papers support component separation; the repository fixture supports only the exact 0/1/0 mutation chain. Unknowns remain: 合成数据的分布代表性与领域标签一致性尚未通过生产样本校准。

Comparator: independent validation-contract reviewer. Verdict: `ACCEPT-WITH-FIXTURE-BOUNDARY`. Rejected claims, disagreement and unknowns are preserved rather than silently averaged.

## Editorial review

Protected items include the exact question, decision, metric, failure, commands, exit codes and NOT_RUN model boundary. Reviewer score 94/100; boundary preservation 100/100. Publication maturity remains internal pending the full catalog/promotion/executability/solution gates.
