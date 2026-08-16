# TD-AG-06 Engineering Blueprint｜D5 注入/MCP 投毒/沙箱与爆炸半径

## Architecture and data flow
输入风险切片 → 版本 manifest → Agent/Workflow/工具边界 → trace/state → 独立 Oracle → failure receipt → owner 决策。TD-AG-06 的页面 artifact 是 `site/public/materials/agent-architecture-system/prompts/TD-AG-06/` 下的 Prompt/Input/Schema/Eval/Mutation，以及 `reports/td-ag-xx/` 下的 baseline/fault/repair。模型只在候选整理位置，策略和业务 Oracle 在模型外。

数据流必须携带 source_refs、版本 hash、tenant/scope、tool 参数、状态快照、stop_state 和限制。高危动作先过能力沙箱、额度、审批和幂等检查；缺少权限或回滚证据时停止，不以重试制造绿色。

## Metrics and decisions
Metric Card 最少记录 metric_id、owner、version、population、unit、numerator、denominator、aggregation、slice、reset rule、统计方法、hard redline、失败动作和 rollback。TD-AG-06 只允许把固定 fixture 的合同检查作为 `fixture-tested`；任何真实模型或线上指标均保持 `NOT_RUN`。

决策顺序：先检查硬红线（越权、秘密泄露、错误资金动作、无限循环、D0 Judge 失效），再检查统计充分性，最后才讨论质量/效率趋势。pass@k、pass^k、P95/P99、goodput、成本尾部和 ASR 不得无总体、版本和场景直接比较。

## Baseline failure repair
Baseline 使用固定合同，预期退出 0；fault 只注入一个命名故障并预期退出 1；repair 恢复 canonical state 并预期退出 0。独立 Oracle 必须输出 `failed_oracle_ids` 和状态 hash。若 fault 没有变红，修复 runner/Oracle，而不是删除 expected；若 repair 依赖扩大权限、降低阈值或无限重试，则保持 BLOCKED。

## Ownership and rollback
内容 owner 维护页面与源映射，Oracle owner 维护判定和不变量，安全/业务 owner 维护高危红线，release owner 维护证据环和回滚。四环由 Offline CI → Sandbox Replay → Shadow/Canary → Online Sampling 升级；未执行环必须写 `NOT_RUN`，不得继承上一环 PASS。

## Operational limits
本蓝图不包含真实凭证、生产数据、资金或自动发布。接入目标项目时要重新锁定依赖、provider、数据、工具 manifest、网络和人工审批；保存 raw trace、失败报告和审计链接。
