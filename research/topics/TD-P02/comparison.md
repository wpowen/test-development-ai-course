# TD-P02 comparison and adjudication

## Agreements

## Disagreements

## Adjudication

路线 A 的标准/官方材料强调 schema、test basis、traceability、稳定 locator；路线 B 的实践材料强调冲突阻断、未知状态、负例和运行收据。二者一致：AI 产物不能绕过业务 owner，结构正确不等于语义正确。分歧是“优先级是否可以按文档类型默认推断”：本课裁决不允许默认顺序，而在合成夹具中显式批准 PRD/OpenAPI/技术方案 policy，并要求 owner/evidence。这个裁决仅适用于教学 fixture，不外推企业治理。

替代方案“直接生成测试用例”更短，但无法提供稳定输入、source_ref、状态传播和独立 oracle；替代方案“让模型自评”成本低，却违反独立性。最终采用 source-bound extraction + software-testing adapter + deterministic offline gates，保留真实模型与企业集成为 Unknown。比较依据记录在 `research/methodology/comparison-and-factory-contract.md`、`route-a-standards.md`、`route-b-practice.md`，没有把搜索 snippet 当作打开来源或实测证据。

该裁决改变 learner action：先检查 authority 与 source hash，再读取 prompt/schema，随后运行 baseline、注入失败并修复；不能因为结果看起来合理就跳过 independent oracle。若路线 A 与路线 B 后续出现新冲突，旧结果标为 SUPERSEDED，回到 owner review，而不是覆盖历史收据。比较结论仍限于 fixture，不能升级为现场方法标准。
