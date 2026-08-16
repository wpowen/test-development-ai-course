# TD-P08：变更后让旧 PASS 自动失效，而不是自动继承

## Professional problem — OpenAPI 变了，昨天的绿灯还能用吗

当 OpenAPI 的 409 response Schema、退款事件字段或 PRD 规则发生变化，旧报告仍可能显示 PASS。若流水线只按文件名相邻选择回归，或者把上一版本 receipt 复制到新候选，发布方会收到过期证据。TD-P08 的 Impact Set 从 source locator、requirement/risk/oracle/case IDs 和依赖关系计算受影响集合；Evidence Pack 明确哪些证据失效、哪些需重跑、哪些仍 UNKNOWN。

变更分析从需求与技术文档 diff 开始：业务规则变化重开 authority 和 Review Question；接口/事件变化重跑契约与消费者测试；实现/配置变化按依赖图选回归；Prompt、模型、Dataset、Tool 或 Scorer 变化使相应 AI Eval 失效。风险决定重跑优先级，方法保持与失败机制匹配，Oracle 必须引用当前批准版本。

case 与 Prompt/Eval/Mutation 都不能脱离版本：TestPackage 引用当前 requirement/risk/oracle；Prompt manifest 固定版本和 input hash；Eval 保存 selected cases；Mutation 确认新候选仍能检出旧故障。流水线只生成 RELEASE_CANDIDATE 证据，不能自动替具名 owner 作 Go/No-Go、Waiver 或回滚决定。

## Runnable action — 运行 TD-P08 过期证据负控制

执行本页 manifest 的 cycle：

```bash
python3 pipeline.py page-cycle --page TD-P08 --report reports/TD-P08-cycle.json
```

预期 baseline/fault/repair=0/1/0。fault 报告必须出现 `finding_id=STALE_EVIDENCE` 与 `Changed contract was allowed to inherit an obsolete PASS receipt`。如果 fault 因新测试失败而红、却没有标记旧 receipt 失效，诊断仍未命中本页问题。

检查 repair report 时，应看到新 contract/basis hash 触发新的 Impact Set 和重跑结果；旧 PASS 保留审计但状态为 STALE/SUPERSEDED。页面 Prompt 的 provider 仍为 none，模型状态 NOT_RUN。

## Failure and repair — 什么时候可以保留未受影响证据

fault 未红通常表示 lineage 只记录文件路径、不记录内容 hash，或 release aggregator 默认继承最近一次 PASS。正确 repair 是重建 requirement→risk→oracle→case→run→evidence 关系，对受影响节点递归失效，并要求新版本 receipt。未受影响证据只有在依赖图和版本范围能证明时才可复用，不能按前缀或目录猜测。

repair 退出 0 仅证明确定性订单夹具能阻止 stale PASS。真实变更分布、回归选择准确率、发布 owner、模型/企业集成、从业者、live 与 production 均未验证；Evidence Pack 必须继续声明 fixture-tested、human release decision required。
## 反例与诊断

接口 409→422 却只重跑 happy path，或 Prompt/模型变更仍复用旧 Eval receipt，都会把 stale PASS 当新证据。影响分析要沿 source→requirement→risk→oracle→case→result 传播；回归不足查追踪，模型更新查新 hash，残余风险无人接受则 BLOCKED。

