# TD-PS08 · 用守恒与高水位阻断迁移静默丢数

## 用守恒与高水位阻断迁移静默丢数

订单状态迁移期间，行数相等仍可能隐藏键丢失、金额偏差、语义错映射或 CDC offset 回退。课程要求按分片、高水位和影子读逐项证明守恒。

expand-contract 保持读写兼容，checksum 证明静态完整，CDC 对账覆盖迁移窗口中的并发变化，影子读专门比较语义。 交付迁移不变量、分片回填收据、CDC 高水位对账与明确的停止/回滚条件。

四个 Oracle 分别是：

1. 主键集合与关键行数按分片守恒
2. 金额汇总和状态语义映射一致
3. CDC 高水位前后的变更无丢失可容忍去重
4. 旧新读路径差异低于零容忍 blocker

## 复制运行 TD-PS08 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/api-ai-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS08.json --mode cycle
```

TD-PS08 的 cycle 应严格记录 `0 → 1 → 0`；数据迁移 fault 若退出 0，应核对跳过分片或 offset 回退 Mutation 是否改变守恒结果，而不是只比较总行数。


进入材料目录后运行 TD-PS08 的 cycle 命令。迁移实验先冻结 DDL、状态映射、分片范围和 CDC 高水位，再执行完整回填、缺分片 fault 与同计划修复。Repair 必须恢复主键集合、金额汇总、语义映射和 offset 对账后 exit 0；分片收据、影子读差异、CDC 账本与 cycle receipt 全部保留。

Prompt 包的任务是：读取 DDL、数据字典、约束、回填计划和 CDC manifest，输出前置检查、分片 Oracle、停机条件、回滚与对账 SQL；不得建议直接 DROP 生产列。迁移页 system 禁止直接 DROP 和猜测停机窗，task 生成前置检查、分片 SQL、停止/回滚与对账候选，critic 查找只看行数或忽略并发写。模型仍为 NOT_RUN，Eval 验证 Prompt/Input/Schema/Mutation；真实接入需保存数据库版本、执行计划、原始 SQL 和 DBA 审批。

换成目标库时先替换数据字典、状态映射和分片策略，再保留键/金额/语义/高水位四类 Oracle；在影子库证明回填与 CDC 并行守恒后，才申请受控切流。目标数据规模、锁等待、复制延迟、业务可接受停机窗口 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS08 的假绿与恢复失败

本页的三类代表故障是：回填跳过一个分片；CDC offset 回退产生重复；旧消费者读取已删除字段。一次只跳过一个分片、回退一个 offset 或删除一条映射，检查目标守恒规则。全部规则同时失败先查 snapshot 与 Manifest；Fault 绿表示对账只看总量，Repair 红则检查 CDC 重复、旧读缓存或回填状态残留。

AI 可辅助生成对账 SQL 和迁移清单，但不能决定删除列、容忍金额差或批准回滚窗口。当前只证明小型 fixture 的门禁，目标规模、锁等待、复制延迟和停机窗口仍为 Unknown；完成物需含 Prompt/Eval/Mutation、0/1/0 与 DBA 迁移门禁。

TD-PS08 的 fixture-tested 验收需要逐分片展示主键集合、金额汇总、状态映射和 CDC 高水位；总行数相等却缺少语义或并发窗口证据时，迁移不得进入切流讨论。

每个停止条件还要绑定 rollback owner 和可定位的分片收据。
