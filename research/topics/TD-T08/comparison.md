# TD-T08 双运行比较

## Agreements
两次运行都同意，失败聚类首先是降噪和路由，不是根因证明。trace/span ID、run ID、commit、环境、测试 case、时间和原始工件必须在聚类前保留；标准化视图只能引用原始事件，不能覆盖它。一个 cluster 可以有共同症状和候选假设，但只有控制变量实验、修复重放或等价独立证据才能把 cause 状态提升为 VERIFIED。缺 trace、混合版本、采样洞或互相冲突的信号应写 UNKNOWN。

## Disagreements
观测构建运行强调 W3C Trace Context 与 OpenTelemetry 字段能把分布式事件连接起来；因果审查指出传播中断、采样和错误 instrumentation 会让链路残缺。前者认可语义或 AI grouping 可降低重复 issue；后者引用供应商自己的误分说明，fingerprint 可能错误合并或拆分。前者希望自动输出根因摘要，后者坚持流畅解释可能掩盖缺证据，应该只输出假设和下一实验。

## Adjudication
裁决把状态机固定为 `OBSERVATION -> CLUSTER -> HYPOTHESIS -> EXPERIMENT -> VERIFIED_CAUSE`。模型可生成 cluster label 与 hypothesis，但不得跳过实验，也不得删除不合群事件。原始工件采用只追加、哈希和保留策略；派生 cluster 保存所有 `raw_event_refs`、算法/提示版本和输入版本。fixture 的 fault 删除 trace ID 并混合 commit，runner 返回 UNKNOWN 和退出 2；这证明 fail-closed 行为，不证明真实系统的 grouping 精度或根因识别能力。

在运营取舍上，宁可保留一个暂时较大的 UNKNOWN 队列，也不能靠过度合并制造虚假的处理效率。待办优先级可以结合影响、复现率和证据质量，但不能让模型 confidence 单独决定关闭。任何自动聚类版本变化都应在独立标注集上比较 false merge 与 false split，并保留回滚；没有标注集时，只报告路由吞吐和引用完整性，不报告准确率。
