# TD-P04：用资金、权限和状态风险选择测试方法

## Professional problem — 三十条 E2E 用例不等于风险被覆盖

订单取消至少包含资金重复、越权取消、已发货状态冲突和退款异步失败四类风险。若策略只写“生成 30 条用例并全部放到 UI E2E”，团队既不知道为何测试，也无法判断遗漏。TD-P04 的交付是 Risk Test Plan：每个风险记录 impact、likelihood、detectability、requirement/source_refs、测试层级、方法、独立 Oracle、生产监控和 residual-risk owner。

需求文档提供业务损失和验收边界，技术设计提供并发、事件、重试、存储与接口机制。两者共同说明失败模式，但不能互换权威。重复退款风险适合属性/不变量与并发测试，状态流适合状态转换，403/409 表面适合契约测试，跨服务补偿适合集成与故障注入；只有少数用户旅程需要 UI E2E。方法选择必须能解释“为什么能检出此失败”。

Oracle 独立于实现：`refund_count<=1`、`refund_total<=captured_amount` 来自批准规则，403 来自权限政策，SHIPPED→409 来自 Requirement Contract。case 绑定 risk_id/method/oracle_id。策略 Prompt 只能提出候选层级；Schema 要求 method/oracle/monitoring/owner；Eval 检查高风险是否全有控制；Mutation 删除关键风险的方法和 owner，期待 METHOD_GAP，而不是用总 case 数掩盖。

## Runnable action — 运行 TD-P04 方法缺口负控制

执行公开 manifest 中的 cycle：

```bash
python3 pipeline.py page-cycle --page TD-P04 --report reports/TD-P04-cycle.json
```

预期 baseline/fault/repair 为 0/1/0。fault 报告必须给出 `finding_id=METHOD_GAP`，finding 为 `Critical risk has no method, oracle, monitoring, or residual-risk owner`。这四项是一个决策单元：只补一个 E2E case、只写“人工观察”或只指定 owner 都不能修复。

学员还要检查 TD-P04 input 是否包含资金和权限风险，eval 是否按 risk_id 而非用例数量计数，mutation 是否真正命中关键风险。若 fault 只因文件缺失而红，说明负控制没有验证方法论。

## Failure and repair — 风险仍在但表格变绿怎么办

假绿常见原因是把空 method 默认成 E2E、允许 Oracle 引用当前响应、或把 monitoring/residual owner 设为可选。应让这些关键字段 fail-closed，并把风险保留为 BLOCKED。正确 repair 为关键风险补上与机制匹配的方法、独立 Oracle、监控信号和具名风险接受人，再重新生成选择集。

修复后退出 0 仅说明合成订单夹具的 METHOD_GAP 被检出。真实损失权重、发生概率、环境覆盖、发布阈值、模型输出、从业者评审、企业集成、live 与 production 均未运行，因此报告保持 fixture-tested 和 model_status NOT_RUN。
## 反例与诊断

把所有风险堆到 E2E 或按历史用例数量排序，看似稳妥却无法解释检测力和损失。测试很多仍漏缺陷时，回到 failure model、方法因果和独立 Oracle，检查高风险是否有 monitoring、residual owner 与可执行阻断条件。

