# Metrics 与区间

## Professional problem — pass@5 很高，不等于单次可靠或可承受

十道题各尝试五次，八道至少成功一次，pass@5 看起来很好；但单次 resolved rate 低、重试成本高，并出现一次越权调用。Accuracy、pass@k、resolved rate 与 Judge score 的样本单位、分母和 Oracle 不同，不能放进一句“性能提升”。

方法选择“逐题逐次 ledger + Metric Card”。Prompt、Dataset、Harness 与 Scorer 固定；Eval 声明 numerator、denominator、k、missing policy、aggregation、slice 和区间方法；Mutation 删除 metric_denominator_declared。独立安全 Oracle 在均值之前判 blocker。

## Runnable action — 没有分母的指标必须从 0 变 1

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-B03 --phase baseline
python3 scripts/run_lab.py --topic TD-B03 --phase fault
python3 scripts/run_lab.py --topic TD-B03 --phase repair
~~~

baseline exit 0 表示 Fixture Metric Card 字段齐全；fault exit 1 应显示 metric_denominator_declared=false，说明数值不可解释；repair exit 0 表示分母声明恢复。脚本没有抽样模型、计算 bootstrap 或产出真实性能区间。

## Failure and repair — 把超时、拒答和失败放回正确分母

fault 假绿时确认 checker 消费 Metric Card 而非只看 score，随后核对超时/缺失是否被静默过滤、k 与运行次数是否记录。repair 仍红时检查 numerator 和 denominator 的样本单位一致。不得通过删失败请求、改成功定义或把安全 blocker 平均掉取得绿灯。

迁移到事故摘要时，resolved 可定义为“关键事实均有证据且无越权”；pass@k 仍需同时报告单次成功、延迟与成本。小样本区间宽应留在结论里，不输出虚假精确排名。

### Evidence boundary

PASS-FIXTURE 只验证 Metric Card 合同。没有真实随机运行、Judge 校准、置信区间计算或企业阈值，从这些字段不能推出模型性能。

## 指标复盘

计算式 walkthrough：10 题各跑 5 次，共 50 次；40 次成功则 resolved rate=80%，8 题至少成功一次则 pass@5=80%，两者相同也不代表单次可靠。一次越权调用仍是独立 blocker；迁移到 RAG 加 citation 分母，Agent 加 prohibited-action 分母，超时不得从分母删除。

Accuracy、pass@k、resolved rate 和 Judge score 不能互相替代；逐题 ledger 保留超时、拒答、成本、工具调用和 blocker，失败不可从分母删除。pass@5 高但单次低要报告重试和成本，超时被排除要放回分母，Judge 高但越权由独立 Oracle 一票否决，差异很小时增加预先约定重复并报区间；不足则 UNKNOWN。迁移到 Agent 加工具 blocker，RAG 加引用新鲜度切片。

边界：本页仅 fixture/static Metric Card；真实 model/provider、integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN。

当前仅 fixture/static Metric Card 合同；真实模型/provider、integration、practitioner、learner observation、live、production 和 publication 均 NOT_RUN，数字不能外推模型能力。
