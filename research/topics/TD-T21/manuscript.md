# 版本 Lineage

## Professional problem — 同时换四个组件，分数变化没有可归因对象

A/B 比较同时更新模型、Prompt、知识索引和 Judge，却把提升写成“模型更强”。这种实验不是信息少，而是结论在逻辑上不可识别。本页用 lineage manifest 把 Dataset、Prompt、Model、Knowledge、Tool、Scorer、Runtime 和 Harness 版本绑定到 run_id；比较前先做字段 diff。

方法选择“单主变量 + 混杂显式状态”。Prompt、输入 Fixture、Schema、Eval 与 Mutation 均有版本；独立 Oracle 检查被锁字段是否相等。Mutation 将 single_variable_isolated 或等价 lineage 字段改坏时，结果必须成为 CONFOUNDED，而不是硬选 winner。

## Runnable action — 红灯表示比较无效，不表示候选更差

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-T21 --phase baseline
python3 scripts/run_lab.py --topic TD-T21 --phase fault
python3 scripts/run_lab.py --topic TD-T21 --phase repair
~~~

exit 0 表示合成 run 的 lineage 满足比较合同；fault exit 1 对应多字段同时变化，专业解释是 INVALID_COMPARISON/CONFOUNDED；repair exit 0 说明锁定字段恢复。不得把 fault 的 1 解释为模型质量下降，因为 Fixture 没有模型输出。

## Failure and repair — 先做 manifest diff，再打开总分

fault 假绿时核对 run_id 是否引用同一份 manifest、hash 是否在复制时丢失、checker 是否真的比较全部 locked fields。repair 仍红时按 dataset→prompt→model→knowledge→tool→scorer→runtime 顺序找剩余差异。不能用“版本差不多”合并，也不能覆盖 raw result 让历史 run 指向新文件。

迁移到 RAG 事故摘要时，可将主变量设为 reranker，其余索引快照、Prompt、模型、工具和 Judge 全部冻结；若 Provider 浮动别名无法固定，必须在报告中降级因果结论。

### Evidence boundary

PASS-FIXTURE 只验证 lineage 字段 mutation。Provider 快照、真实回放、模型重复运行和企业制品库尚未连接，replayability 仍需集成证据。
