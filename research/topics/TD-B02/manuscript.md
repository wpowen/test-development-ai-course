# Dataset、Split 与 Sealed Holdout

## Professional problem — 按行随机切分会把同一事故的改写泄漏到两边

客服样本 99% 是简单 FAQ，少量高风险退款又被自然频率淹没；同一 incident 的改写跨 dev/holdout 出现，候选看似进步。这里把数据分成 representative、challenge、regression 和 sealed holdout 四种角色，并按 entity/time 分组切分，而不是按行打乱。

方法选择“风险抽样 + 实体去重 + 受审计封存”。Prompt 只能使用开放数据角色；Eval 检查 provenance、split、overlap、slice coverage 与 access log；Mutation 令 holdout_sealed=false。独立 Oracle 由标签规范、双人争议记录和领域 adjudication 组成，模型不能批准自己的标签。

## Runnable action — 泄漏使旧结论失效

~~~bash
cd site/public/materials/ai-quality-benchmark
python3 scripts/run_lab.py --topic TD-B02 --phase baseline
python3 scripts/run_lab.py --topic TD-B02 --phase fault
python3 scripts/run_lab.py --topic TD-B02 --phase repair
~~~

baseline exit 0 表示合成 split 满足封存合同；fault exit 1 指向 holdout_sealed=false，动作是停止比较、记录耗损并重建 split；repair exit 0 只是恢复合同字段，不会逆转真实数据已经暴露的事实。

## Failure and repair — 同时查近重复和访问次数

fault 假绿时核对 manifest、injected mutation、entity_id/time grouping 与 access log 是否进入 Eval。repair 仍红时确认 dataset hash 与报告一致。不能简单把 leaked 标志改回 true、重命名文件或删除争议标签；真实修复还需轮换 holdout 并使旧 baseline 过期。

迁移到事故摘要时，以 incident/service/time 为分组单位，高严重度与越权事件单建 challenge/regression。Dataset Card 还需说明隐私许可、纳入排除、标签分歧和维护 owner。

### Evidence boundary

当前 PASS-FIXTURE 使用合成数据。企业数据、隐私审查、领域双标、真实访问控制、近重复检测和模型运行全部 NOT_RUN。

## Dataset 分层复盘

计算式 walkthrough：2,000 条样例发现 18 个近重复跨 split，overlap rate=18/2,000=0.9%，应使 holdout 结论失效。修复是重建 split、轮换 holdout 并重算，不是扣分；迁移到 Agent 按 session_id 去重，四类角色与 hash 规则保持不变。

Representative 看常见流量，challenge 放大边界，regression 锁住事故，sealed holdout 防过拟合。每条样例保存 provenance、incident_id、tenant、policy_version、split_role，按事件/实体/时间去重。Holdout 异常高查近重复，高风险样本过少补 challenge，标注争议保存双标与 adjudication，反复访问则冻结并轮换；迁移到 Agent 只替换实体与 Oracle，四类角色和 hash 绑定不变。
