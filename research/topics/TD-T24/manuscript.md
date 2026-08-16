# 漂移、Waiver 与回滚

## Professional problem — 放宽阈值只能让告警消失，不能让质量恢复

退款正确率下降而 Judge 分保持稳定，可能是输入、知识、模型、Judge 或性能成本任一层漂移。若团队直接调低门槛，就丢失了定位信号。本页先冻结当前版本和原始证据，再用诊断树分层排查；高风险影响优先回滚，短期例外必须具名、限定范围、有补偿控制并自动到期。

方法选择“多信号监测 + 有期限 waiver”。Prompt、Dataset、Knowledge、Judge 和 Runtime 都进入基线；Eval 使用固定黄金集与切片窗口；Mutation 删除 waiver_has_expiry。独立 Oracle 检查到期和回滚完整性，不让异常候选自行延长例外。

## Runnable action — 无到期时间的例外必须 exit 1

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-T24 --phase baseline
python3 scripts/run_lab.py --topic TD-T24 --phase fault
python3 scripts/run_lab.py --topic TD-T24 --phase repair
~~~

baseline exit 0 表示合成 waiver 满足最小合同；fault exit 1 指向 waiver_has_expiry=false，专业动作是保持阻断或回滚；repair exit 0 说明到期约束恢复。0→1→0 不是一次真实生产回滚演练。

## Failure and repair — 分清信号漂移与裁判漂移

fault 假绿时检查 expiry 是否是可解析时间、owner 与 compensating control 是否存在、到期 job 是否消费该字段。repair 仍红时核对回滚 manifest 是否覆盖模型、Prompt、索引、工具和路由。禁止静默换 Judge、延长窗口或沿用过期 waiver。

迁移到事故摘要时，可用输入严重度分布、runbook freshness、固定黄金集、p99 和 cost-per-success 组成诊断面。恢复标准是回到已知版本并重新通过事故 regression，而不只是指标回到线内。

waiver 记录至少包含 owner、reason、affected scope、compensating control、issued_at、expires_at 和 rollback target；到期 job 必须重新阻断。漂移结论还要区分 Evidence（观测变化）、Inference（可能组件）与 Unknown（未接入原因），避免过早归因。

### Evidence boundary

当前 PASS-FIXTURE 没有生产基线、告警、审批系统或真实回滚。MTTD/MTTR、漂移阈值和 waiver 流程均需企业集成与从业者验证。

## 漂移与 Waiver 复盘

漂移可能来自数据、引用新鲜度、Prompt/模型、工具延迟或 Judge。先分质量、性能、数据、评测器再查首个变化；Waiver 必须有 owner、理由、补偿控制、到期和回滚触发器。分数下降但线上无变化查版本兼容，引用下降查索引，过期 waiver 自动阻断，回滚后仍错则核对完整 manifest 和 regression。迁移只替换信号与 owner，冻结→诊断→短期接受→回滚闭环不变。

边界：本页仅 fixture/static 漂移合同；真实 model/provider、integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN。

案例工件：引用命中率下降但模型未变，先查文档更新时间和索引构建。提交 drift signal、waiver expiry、补偿控制和 rollback receipt。模型/provider、integration、practitioner、learner observation、live/production/publication 均 NOT_RUN；仅 fixture/static evidence。
