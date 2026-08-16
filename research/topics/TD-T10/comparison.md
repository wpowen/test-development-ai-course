# 检索评测：召回、排序与查询切片: independent research comparison

## Agreements

Run A approached `TD-T10` through architecture, primary technical documentation and durable papers. Run B approached it through measurement, failure cases, implementation contracts and learner execution. Both agree that gold document、top-k、recall、precision、MRR、过滤条件、query reformulation 和难例切片 must be separated into observable fields and versions. Both reject a final fluent answer as sufficient evidence. Both also agree on the professional decision: 先确认相关文档是否进入候选集，再评价排序；最终回答正确不能替代检索层证据。

The runs independently converge on a negative-control requirement. The page must show an accepted baseline, inject `模型凭参数记忆回答正确，但检索完全漏掉最新政策；上线后政策更新即失效。`, obtain a reproducible red result, repair without relaxing the Oracle, and preserve all three reports. They also agree that the fixture cannot prove model quality, enterprise integration or practitioner utility.

## Disagreements

Run A preferred precise mechanism vocabulary and a broader architecture map. Run B warned that too much architecture could delay the first learner-visible result and preferred an executable contract first. Run A treated `Recall@k、Precision@k、MRR 与逐查询 miss reason` as the organizing measurement; Run B insisted that the metric remain subordinate to a risk decision and named owner. A further tension concerns sources: vendor documentation is current and executable but product-specific, whereas papers and government guidance are durable but may not map to one implementation.

The comparison rejects two claims. First, it rejects any universal threshold or run count because the sources do not establish the target business distribution or error cost. Second, it rejects “temperature zero equals deterministic” or equivalent certainty; the local fixture is deterministic, but provider execution remains NOT_RUN.

## Adjudication

The final page opens with the specific professional failure, then teaches the minimum mechanism needed to localize it, then runs the contract. Architecture and measurement are both retained, but neither is allowed to imply maturity. Vendor-specific interfaces appear as examples, while the artifact and decision remain provider-neutral.

Evidence hierarchy: primary papers and current official documentation support mechanism/interface claims; NIST and dataset guidance support measurement/governance boundaries; RAG evaluation papers support component separation; the repository fixture supports only the exact 0/1/0 mutation chain. Unknowns remain: 没有运行真实 embedding、向量库、reranker 或线上查询分布。

Comparator: independent validation-contract reviewer. Verdict: `ACCEPT-WITH-FIXTURE-BOUNDARY`. Rejected claims, disagreement and unknowns are preserved rather than silently averaged.

## Editorial review

Protected items include the exact question, decision, metric, failure, commands, exit codes and NOT_RUN model boundary. Reviewer score 94/100; boundary preservation 100/100. Publication maturity remains internal pending the full catalog/promotion/executability/solution gates.
