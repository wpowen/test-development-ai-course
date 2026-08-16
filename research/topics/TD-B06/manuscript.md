# 公共到企业 Benchmark

## Professional problem — 翻译公开题目不会自动产生企业 Oracle

团队把公开 Benchmark 翻成中文就当客服发布 Gate，但题目没有企业政策引用、租户隔离、退款权限、事故回归或维护责任。可迁移的是任务卡、协议、逐题记录和透明报告方法，不是榜单结论。本页从业务 decision 与 failure cost 出发，建立 representative/challenge/regression/hidden 四类内部任务。

方法选择“公共 sanity + 内部风险基准双轨”。Prompt、adapter 与 Scorer 版本化；Eval 结合业务规则、权限 blocker、引用和人审校准；Mutation 令 enterprise_oracle_linked=false。独立 Oracle 由领域政策与权限 owner 维护，公共答案不能替代。

## Runnable action — 没有业务 Oracle 的仓库必须红

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-B06 --phase baseline
python3 scripts/run_lab.py --topic TD-B06 --phase fault
python3 scripts/run_lab.py --topic TD-B06 --phase repair
~~~

baseline exit 0 表示合成企业任务链接了 Oracle；fault exit 1 指向 enterprise_oracle_linked=false，说明它仍只是外部参考；repair exit 0 表示链接字段恢复。没有真实企业数据和 owner 签核时，状态不得晋级。

## Failure and repair — 从发布问题反查每个 task

fault 假绿时逐题询问“这个 case 支持哪项企业决定、失败成本是什么、谁维护 Oracle”，再检查 checker 是否消费这些引用。repair 仍红时核对政策版本、权限 owner 与报告 hash。不能用公开 scorer 默认值补内部风险，也不能把模型 Judge 当唯一裁判。

迁移到事故摘要时，公共任务测试通用抽取，内部任务覆盖 runbook 忠实性、P1 严重度、租户权限和事故回归。维护合同还需规定争议、轮换、弃用和重建 baseline。

### Evidence boundary

当前为 PASS-FIXTURE 的合成教学仓库。真实企业数据、标注团队、权限系统、模型、发布 Gate、从业者评审和 production 均 NOT_RUN。

## 公共 Benchmark 迁移复盘

计算式 walkthrough：内部基准 100 条样例分为 60 representative、20 challenge、15 regression、5 sealed holdout；15 条 regression 有 1 条权限 blocker 时，整体 99% 仍不可放行。迁移到支付或代码 Agent 重新定义副作用 Oracle，但保留事故回归一票否决、同预算 adapter、访问审计与 retire policy。

公共方法可借鉴任务卡、协议固定、逐题记录和可复现报告，但榜单不包含企业政策、租户隔离、退款权限和维护责任。迁移步骤是公共结构→业务四类数据→权限/副作用 blocker→版本轮换治理→同预算候选比较。翻译公开题不能称企业可用；公共分高但客服失败补中文长对话和低频风险；无 owner、真实数据或发布连接只能停在设计/fixture。

边界：本页仅 fixture/static 企业基准设计；真实 model/provider、enterprise integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN。

当前仅 fixture/static 合同；真实模型/provider、enterprise integration、practitioner、learner observation、live、production 和 publication 均 NOT_RUN，公共榜单不构成企业证据。
