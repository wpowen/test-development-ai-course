# TD-T07 证据综合

## Fact
ISTQB CTFL 列出等价类、边界值、决策表与状态迁移等技术，支持按输入结构选择方法，但不自动决定项目工具。NIST ACTS FAQ 和研究论文说明 t-way 覆盖与 covering array 能系统处理多因子交互，并支持约束；它们不保证所有业务有效组合或给出普适强度。Hypothesis 文档和仓库描述 property-based generation 与 shrinking，Schemathesis 文档描述 API 数据生成、示例、覆盖、fuzz、stateful 阶段以及失败回放，这些是具体实现能力，不会自动发现业务不变量。

AFL++ 文档证明覆盖引导 fuzz 需要 instrumentation、corpus 与 campaign 生命周期；它更接近低层输入探索，不能直接替代结构化业务属性。Python random 文档提供伪随机 seed 与状态接口，同时不能冻结外部时间、依赖或并发调度。Playwright Test Agents 能提出计划和测试，但不拥有合法数据域与 invariant 权威。Google 关于覆盖率的实践反证提醒，即使行被执行，边界和断言仍可能缺失。工具教程能教会一次命令流，不等于学习迁移或生产效果经验证。

## Cross-source synthesis
方法选择应从失败模型开始。连续或有序值的 off-by-one、包含/排除错误，选 boundary 并覆盖 min-1/min/min+1、max 邻域及合法性；多个离散规则相互作用，选 decision table 或 constrained pairwise/t-way；当“对所有合法输入都应成立”的 invariant 可明确表达，选 property-based generation，并要求 shrink 和 replay；解析器、协议或未知语法攻击面，在隔离、安全预算和授权充分时选 fuzz。一个主题可以组合方法，但不能用“生成 1000 条”替代覆盖定义。

每个生成合同必须记录域、约束、分布、seed、budget、Oracle、不允许副作用和停止条件。AI 可以建议候选边界、因子和属性，却不能凭空定义业务合法域；候选由 basis owner 审批。失败输出要保存原始输入和环境，再收缩最小反例；收缩结果必须重新验证仍触发相同 invariant。只保存 seed 不够，需同时保存工具/系统版本、依赖、时间与外部状态，无法冻结时明确 UNKNOWN。

fixture 将退款金额、状态、幂等 key 与重复次数建模。baseline 的属性 `refund_count<=1` 对固定 seed 产生的合法输入成立；fault 让重复请求重复退款，报告捕获失败并收缩为 `{idempotency_key, repeat}`，退出 1；repair 恢复幂等逻辑后通过。报告明确拒绝 unconstrained random fuzz，因为它不能保证业务有效状态或稳定 Oracle。这是可复现方法示例，不是生产代表性证明。

## Unknown
真实流量分布、隐藏约束、生产数据隐私、接口副作用、并发调度、最合适的 t 强度与 fuzz 预算未知。未运行 Hypothesis、Schemathesis 或 AFL++ 真实集成，也未调用模型。fixture 的 Python PRNG 不代表真实工具的 shrink/replay；没有从业者审阅不变量，也无生产缺陷发现率。因此状态保持 `fixture-tested`。
