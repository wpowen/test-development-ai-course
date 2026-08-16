# TD-T18 evidence synthesis

## Fact

公开材料共同说明，AI 质量不能只看最后一段自然语言。评分接口可以提供结构化结果，Judge 论文展示了与人工偏好的相关性，也同时暴露位置偏差、自偏好与领域边界。NIST 把风险测量放进治理语境；LangGraph 和 Agent SDK 文档把暂停、恢复、handoff 与工具边界变成可观察控制点；Playwright 与 WebArena 则提供可执行测试和可复现实验环境的工程形状。这些是来源能直接支持的事实，不等于本地已经连接任何模型或生产系统。

对 TD-T18，直接工作对象是：退款审核页面的需求风险、seed 数据、Planner 场景、Generator 测试、浏览器 Trace、后端状态与 auto_refunded 业务变异。 控制问题不是“分数是否更高”，而是“证据是否足以让指定的人作出可撤销决定”。本页决策规则是：测试负责人只接受能追溯风险 ID、在隔离账户执行、验证后端业务状态并杀死已知 mutation 的候选测试；生成模型无合并权。 这个规则把权限与 blocker 放在聚合指标之前，也把 expected 的批准权留给独立人工 owner。

来源的支持强度不同。官方文档适合确认接口、状态与运行语义；论文适合确认评测方法与已观察偏差；标准适合确认风险治理；仓库适合确认复现实物。任何一类都不能单独证明生产有效性。因此 source-pack 明确写出 supports、does_not_support 和 limitations，避免把“可实现”误写成“已验证”。

## Cross-source synthesis

两次独立研究运行从不同方向收敛。职业与风险运行认为应先声明业务失败成本、决策人和不可委托权力，再挑指标；系统与对抗运行则要求把输入版本、权限检查、轨迹、命名 Oracle、故障注入和回滚做成机器可查工件。二者在本页汇合成证据流：需求风险 → Planner 计划 → Generator 候选 → 隔离浏览器 → 后端状态 Oracle → mutation 重跑 → 人工评审。

指标采用分层而非单总分：统计 risk-to-test trace、business-Oracle coverage、known-mutation kill、flaky retry、Trace completeness 和人工拒绝原因。 对应的对抗故障是：故障测试只断言页面出现“已提交”，却放过后端 auto_refunded 变异；修复增加 manual_review 业务状态 Oracle。 因而最小可执行证据必须包含 baseline、fault、repair 三份互不覆盖的 JSON；fault 要以非零退出并列出 failed_oracle_ids，repair 再次通过，但不能删除原 Oracle 或改变 expected 来制造假绿。

安全分析同样不是附录。先验证身份、tenant、scope、预算和 human approval，再允许工具产生任何可写副作用。模型可以提出候选判断、理由或修复，但不能批准自己的 expected、reference、权限扩张或上线结论。BUSINESS-ORACLE 与 MUTATION-KILLED 都必须通过；页面可见性、截图或模型解释不能替代后端业务状态。 若真实环境无法提供这些 receipt，状态必须保持 NOT_RUN 或 blocked，而非用 fixture 成功填充。

反例也被保留：基准上的 Judge 相关性并不消除位置偏差；有 healer 或 Agent SDK 不等于业务 Oracle 正确；可复现 Web 环境不等于企业权限已验证。裁决因此采用“来源互补 + 可执行负例 + 人工决定”，而不是多数来源投票。

## Unknown

真实浏览器、企业页面、认证、网络波动和生成模型尚未执行；fixture 不代表 E2E 稳定或业务覆盖完整。 还未知真实数据漂移、供应商限流、组织审批时延、审计保留周期以及从业者对工件可读性的评价。下一成熟度只能由真实集成回读、独立安全审查和 practitioner sign-off 推进；本包不声称 live-tested、practitioner-reviewed 或 production-validated。


