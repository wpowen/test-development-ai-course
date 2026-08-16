# TD-P03：把“需求不清楚”改写成可关闭的评审问题

## Professional problem — 没有 owner 的问题不会推动任何决定

AI 很容易总结订单取消需求“存在歧义”，但这句话没有指向具体来源、风险或回答人。TD-P03 要交付 Review Question Pack：问题必须引用 PRD-v3#R17 与 TECH-a13f#S04，说明 SHIPPED 状态冲突会改变 409 Oracle、退款副作用和仓配回滚，并给出 product-owner-order、block_level 与 close_with。缺少任一项，问题只能停留在会议纪要里。

评审从已冻结的需求/技术文档开始，不重新发明规则。它按五类缺口检查：来源冲突、状态分支缺失、不可观察结果、副作用/幂等缺失、未定义 NFR。每个缺口映射到失败代价，再选择澄清、状态模型审查、事件/账本可观测性审查或 NFR 量化等方法。独立 Oracle 是“批准后的规则加可观察证据”，不是评审 Agent 自己的改写。

链路继续落到测试资产：关闭后的 question 更新 Requirement Contract；风险记录 block_level；方法记录为什么选状态转换或决策表；Oracle Registry 固定 403/409、refund_count≤1 等判断；case 引用 question/requirement/oracle IDs。Prompt 只能生成问题候选，Schema 强制 owner/close_with，Eval 检查问题能否被回答，Mutation 删除 owner 与关闭证据，验证流程出现 UNOWNED_BLOCKER。

## Runnable action — 运行 TD-P03 无责任人问题负控制

从 `materials/requirements-to-evidence` 运行：

```bash
python3 pipeline.py page-cycle --page TD-P03 --report reports/TD-P03-cycle.json
```

预期三相退出码是 0/1/0。fault 报告应精确出现 `finding_id=UNOWNED_BLOCKER` 和 `Review question has no accountable owner or close_with evidence`。如果只显示 Schema 缺字段，诊断还不够：课程需要证明缺少这些字段会让 RELEASE_BLOCKER 无法被关闭，而非只是不符合 JSON 格式。

随后核对 `page-prompts/TD-P03/{prompt-v1.md,input.json,schema.json,eval.json}`。Eval 至少要覆盖来源、影响、owner、block_level 与 close_with；Prompt 不得代替 product/security/data owner 作裁决。provider 仍为 none，任何示例输出都不是模型通过证据。

## Failure and repair — 问题太泛、无法关闭时怎么修

如果 fault 没有失败，检查 validator 是否把空 owner 当成默认团队、把 close_with 当可选描述，或在 BLOCKED 状态后仍允许生成 case。正确修复不是把问题改成“请完善需求”，而是补上精确 locator、受影响 Oracle、具名 owner、截止条件和会产生的新契约版本。

repair 应保留原始 OPEN 问题和裁决历史，生成新 Requirement Contract 并让下游引用新版本；不得覆盖历史或假装问题从未存在。最终 PASS 只证明离线夹具能检测无人负责的 blocker，不代表目标组织的评审 SLA、从业者认可、模型表现、集成、live 或 production 已验证。
## 反例与诊断

只画同步调用链会漏掉 Worker 重试、死信和重复退款；设计里写了 trace_id 也不代表异步事件真的可关联。遇到异常先核对状态转换，再查幂等键与重试/死信，接着确认 Trace、事件和审计证据，最后检查需求—技术矩阵双向引用。

