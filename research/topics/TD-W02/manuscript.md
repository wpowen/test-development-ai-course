# TD-W02 learner manuscript

## Wave-5 recovery walkthrough

为 msg-42 画状态转移、checkpoint、owner、scope 和副作用；制造写入后崩溃并重复投递，幂等账本应保证写入总数仍为 1。再注入无限循环和错误 handoff，检查预算守卫、stop reason 与权限不扩张。迁移到履约流程只替换业务状态和补偿动作，真实队列事务与生产恢复仍需集成演练。

```bash
cd materials/llm-agent-quality/learner-materials && python3 scripts/agent_quality_lab.py --topic TD-W02 --phase cycle --report-dir reports/TD-W02
```

## 用 checkpoint、幂等与 stop reason 让 Workflow 可恢复

你面对的不是“让 AI 看起来聪明”，而是让一个真实质量决定有证据、可否决、可回滚。场景中的对象是 msg-42 审计任务、checkpoint、attempt、idempotency ledger、handoff payload、iteration/token/time budget、stop reason 和人工接管。。如果团队只看一个总分或最终回答，可能把混杂变量、越权动作、事实错误或重复副作用藏在绿色数字里。业务后果由人工负责人承担，因此被测模型、Judge 或 healer 不能批准自己的期望。

本页控制问题是：怎样把 checkpoint、循环预算、消息重投、幂等 receipt、handoff 契约和 stop reason 组成可恢复工作流，避免重复副作用、孤儿状态和无限循环？ 先把它翻译为决策：Workflow owner 仅在重复消息无重复写、checkpoint 可恢复、handoff 不扩权、循环在预算内终止并记录 stop reason 时批准流程。。这一步决定哪些证据是 blocker，谁能批准，什么情况必须 UNKNOWN，也决定后续 Prompt 应要求模型输出“候选与证据”，而不是“替负责人下结论”。

TD-W02 围绕 msg-42 的重复投递、checkpoint、幂等 ledger 和 handoff payload 验证状态所有权；循环必须有上限和可读 stop reason，重复消息只能产生一次副作用。

## Runnable action

进入材料目录，先运行 baseline 命令，打开报告核对 topic、phase、oracle_results、failed_oracle_ids、writes 和 evidence_boundary。然后运行 fault：它必须稳定返回 1，并说明 故障对重复 msg-42 写入两次且循环超过 max_iterations 无 stop reason；修复用 idempotency ledger 与预算守卫终止。。最后运行 repair：它必须返回 0，但修复只能恢复控制，不能删除 Oracle 或修改 expected。cycle 命令把三个阶段串起来并验证内部退出码恰为 0/1/0。

运行前先画出证据流：加载 checkpoint → 校验消息/身份 → 幂等 Worker → 更新状态 → handoff → 预算守卫 → 终止或人工接管。接着问五个问题：输入版本是否冻结；身份与 scope 是否在写之前核验；哪个 Oracle 独立于模型；哪个人工 owner 能批准；失败后如何回滚。指标解释为：统计 duplicate-effect、checkpoint recovery、handoff error、orphan task、budget breach、stop-reason completeness 和人工接管。。只要权限、版本或命名 Oracle 缺失，就 fail-closed。

TD-W02 的 eval 放重复消息、超预算循环和无 owner handoff，mutation 固定双写与 `stop_reason=null`；provider/model 仍 NOT_RUN。

## Failure and repair

故障症状可能是绿色总分、漂亮理由或成功最终文本，但第一诊断入口永远是命名 Oracle 与副作用日志。IDEMPOTENT-EFFECT、BOUNDED-LOOP、STOP-RECORDED 三个 Oracle 独立阻断；Agent 理由不能豁免重复写。 若 fault 没有变红，说明评测缺乏检测力；若 repair 通过但 mutation 存活，说明修复制造了假绿；若 writes 在授权前出现，即使结果正确也必须失败。

安全修复顺序为：冻结写通道，保留原始报告与 hash，恢复最小权限，定位第一个被破坏不变量，再提交候选修复给人工 owner。回滚：暂停消费者，恢复最后 checkpoint，依据幂等 ledger 对账副作用，并把孤儿任务交人工 owner。。禁止做法包括让模型改 expected、删除 assertion、无限重试、偷偷增加预算、用另一个同源 Judge 自证或把 NOT_RUN 写成 live。

完成后做迁移练习：迁移到订单履约时保持 checkpoint、幂等、handoff、预算和终止不变量，替换消息与补偿动作。。迁移说明必须写出 source_context、target_context、保持的不变量、至少两项必须改变的配置和成功标准。最后由人检查 fault 是否仍稳定变红、repair 是否真正恢复控制、权限是否零扩大。当前结论只到 fixture-tested；真实 broker 至少一次投递、并发竞争、持久化故障和补偿事务尚未集成；不声称 live workflow reliability。

### TD-W02 恢复判断卡

checkpoint 必须同时记录输入版本、已完成步骤和待执行副作用，缺一项就不能安全恢复。
同一个 message_id 只能在 ledger 中留下一个 effect，重复消费只产生可审计的 no-op。
loop budget 要作为运行字段输出，不能只写在提示词里而不进入报告。
stop_reason 采用有限枚举，例如 completed、budget_exhausted、owner_required 和 invariant_failed。
handoff 记录接收者、上下文摘要与剩余预算，交接动作本身不得偷偷消耗额外 token。
恢复测试从中间 checkpoint 启动，预期结果是继续未完成步骤，而不是重新发送已确认的付款。
对副作用做 mutation 时删除 ledger 记录，Oracle 应在下游审计或重复效果处报红。
repair 只补回缺失记录并重新核对下游，不得把 retry 次数改成无限。
孤儿任务要包含 owner、创建时间和最后心跳，超过阈值才进入人工队列。
故障报告保存 mutation 前后的 checkpoint hash，便于证明修复没有改写原始事实。
迁移到履约系统时，补偿动作的业务 Oracle 应核对库存和订单状态，而不是只核对消息已发送。
真实 broker、并发竞争、持久化崩溃与 exactly-once 语义仍是 UNKNOWN；当前材料只证明离线 fixture 的恢复协议。

## Workflow 恢复演练

状态转移、checkpoint、队列投递和副作用必须出现在同一时间线。应在写入后、确认前制造崩溃，再重复投递同一 message，检查幂等 receipt、恢复 owner 和 stop reason；最终状态正确不能证明中间没有重复写。迁移到履约或发布流程时保持重放不重复副作用、handoff 不扩权、checkpoint 可定位、预算可终止四个不变量。

诊断顺序：重复消息造成两次写入，按业务 key 对账并恢复唯一 receipt；恢复从头执行，查 checkpoint 原子性和版本；Agent 无限重试，设置 iteration/time/token 上限；handoff 后权限扩大，重新计算目标 scope。真实队列、事务和生产恢复均 NOT_RUN，fixture 只证明合同。

交接工件：写入后确认前崩溃，再重放同一 message；提交 checkpoint hash、幂等 receipt、stop reason 和 owner。迁移到履约时替换补偿动作，但保留重放不重复、handoff 不扩权、预算可终止。
