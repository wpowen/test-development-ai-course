# TD-R01 Independent Comparison

## Agreements
来源普遍要求直接打开原始页面、记录日期/版本，并区分权威文档、实现参考和社区线索。可复用性取决于限制说明和上下文，而不是链接数量。

## Disagreements
不同资料对 freshness 窗口、版本优先级和转载是否算独立来源处理不一。教程常省略 publisher group，供应商页面又可能把营销更新误当技术变更。我们保留不确定性，以内容指纹和来源层级裁决。

## Adjudication
reviewer: librarian + technical-editor。采用 canonical URL、publisher/family 去重、打开状态和 superseded 状态四道门；缺日期、owner 或限制即 `BLOCKED`。课程只引用已打开、可追溯条目，fixture 通过不等于链接长期有效。
reviewer: librarian + technical-editor。比较保留来源层级、版本冲突、断链和 fallback；不能打开的内容不进入 KEEP。

补充判断：最新、权威、可复用是三个不同维度，必须分别记录。转载文章可以提供解释，但不能替代原始规范或实现文档。

两条研究路线对“最新”与“稳定”排序不同：官方文档可能更新快但迁移说明不足，教学资料解释充分却可能滞后。裁决不选单一赢家，而是为每条 claim 同时保留规范来源、实现证据和学习解释，并用版本桥接记录变化；任何一类缺失都显式写限制。

反证场景包括官方页面重定向但语义已变、社区文章仍可访问却引用过期 API、以及多个镜像制造虚假独立性。最终 Oracle 同时核对 canonical URL、内容指纹、版本和 publisher group，reviewer 再决定 KEEP、REFRESH 或 SUPERSEDED。
