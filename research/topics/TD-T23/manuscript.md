# 质量—延迟—成本联合 Gate

## Professional problem — 平均更快，可能同时让高风险结果更差、更贵

候选把平均延迟降下来，却让 p99、重试次数和高风险退款正确率恶化。只优化一个总体均值会把用户尾部和失败成本藏起来。本页先定义硬底线：安全 blocker、高风险质量和最大尾延迟；只有全部满足的候选才进入成本与体验的 Pareto 权衡。

方法选择“约束优先、多目标比较”。Prompt/Model/Index 版本共同固定；Eval 按风险切片统计 quality、p50/p95/p99、cost per success 与 retry；Mutation 破坏 joint_gate_passed 或高风险底线。独立 Oracle 保证质量判定不由成本优化器决定。

## Runnable action — fault 的 1 表示突破底线，不是总体分少一点

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-T23 --phase baseline
python3 scripts/run_lab.py --topic TD-T23 --phase fault
python3 scripts/run_lab.py --topic TD-T23 --phase repair
~~~

baseline exit 0 表示合成候选满足联合合同；fault exit 1 应显示平均延迟改善也不能抵消 high-risk quality、p99 或 cost-per-success 破线；repair exit 0 说明 observation 回到约束内。Fixture 数字不是企业 SLO。

## Failure and repair — 先核对分母和超时处理

若 fault 假绿，检查失败请求是否被移出延迟/成本分母、重试是否只计最后一次，以及高风险 slice 是否在总平均前判定。repair 仍红时确认没有通过放宽阈值或删慢请求获得绿灯。真实优化可能需要路由、缓存、Context、模型或工具调整，但一次只改变一个主变量。

迁移到事故助手时，质量底线可设为严重度与证据准确，延迟看 on-call 场景的 p95/p99，成本按成功摘要计。阈值必须由目标组织的失败成本和容量数据确认。

报告不得只给三张独立图。每个 case-run 应共同记录质量判定、耗时、重试、token/工具成本和最终状态，才能计算 cost-per-success 并识别“便宜但失败”或“成功但超时”的候选。候选间比较应保持输入与版本可配对。

### Evidence boundary

PASS-FIXTURE 只杀死联合 Gate mutation。没有负载、Provider 计费、真实延迟分布、企业 SLO 或模型质量运行，production trade-off 仍未知。
