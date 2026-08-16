# TD-AG-10 Research Brief

## Controlling question
如何把“高风险交易 Agent 适配器”从概念拆成小白能读懂、专业测试开发可执行、且不把 fixture 证据伪装成 live 的 Agent 测试闭环？

## Scope
本页只研究 D0-D7/四证据环中与 `TD-AG-10` 对应的边界：风险、输入、版本、trace、独立 Oracle、故障、修复、owner 和 stop_state。研究结论服务于课程页面、Prompt 包、确定性 runner 和迁移作业。

## Evidence boundary
Evidence 包括用户提供的 Agent 架构材料、已打开来源和仓库 fixture；Inference 是将这些原则映射到本页；Unknown 包括真实模型、企业流量、从业者评审和学习者迁移。
