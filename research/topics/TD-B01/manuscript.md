# Benchmark 七段流水线

## Professional problem — leaderboard 名次省略了真正被测的系统

选择客服模型时只看公开总分，却不知道任务版本、Dataset、Prompt/few-shot、工具预算、超时、Scorer 和聚合规则。Benchmark 测量的不是孤立模型，而是 task × data × protocol × system × scorer × aggregation × report 的组合。任一关键组件未知，结论就不可复现，也不能自动迁移为企业 Gate。

方法选择“七段审计后再解释性能”。Prompt 与 Harness 作为协议版本保存；Eval 从逐题 record 计算结果；Mutation 令 pipeline_components_complete=false；独立 Oracle 检查必备组件与失败处理。超时、拒答和缺失必须保留在分母，不能只展示成功题。

## Runnable action — 红灯表示报告缺组件，不表示模型低分

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-B01 --phase baseline
python3 scripts/run_lab.py --topic TD-B01 --phase fault
python3 scripts/run_lab.py --topic TD-B01 --phase repair
~~~

baseline exit 0 表示 Fixture manifest 的七段字段完整；fault exit 1 应显示 pipeline_components_complete=false，专业结论是 INCOMPLETE/NOT_REPRODUCIBLE；repair exit 0 表示字段恢复。因为 model_execution=NOT_RUN，这里不存在任何模型排名。

## Failure and repair — 从总分逆向追到逐题 record

fault 假绿时检查报告是否只校验 title/score，而未消费 task、dataset、protocol、system、scorer、aggregation 与 limitations。repair 仍红时核对版本与逐题结果引用。不得复制 leaderboard 截图补证据，也不能删除 timeout 题使分母变小。

迁移到企业事故摘要时，公共 Benchmark 只作 sanity；内部任务还要加入 runbook 引用、权限、严重度与维护 owner。通过条件是每个总分都能回链到逐题观察和当前 Harness 版本。

### Evidence boundary

PASS-FIXTURE 仅证明流水线完整性字段可检查。未复现 HELM、SWE-bench 或任何公开榜单，真实模型、适配器、工具和企业场景均 NOT_RUN。
