# TD-X603 工程蓝图：长期 Memory、个性化与语义缓存

## Architecture and data flow

输入是批准的合成任务、版本 manifest、独立 owner 注册表和页面 Prompt 包。生成器只提出候选，确定性 runner 只验证机械合同；涉及语义、伤害、例外、用户体验或发布的结论交给独立 owner。技术主链：同意与目的 → 用户/租户隔离 → 写入与 TTL → 检索/缓存版本 → 冲突与删除 → 回执 → 回归。

## 数据、Prompt 与版本合同

每个输入携带 topic_id、schema_version、policy version、fixture hash、Prompt manifest hash 和 owner。Prompt 包固定 prompt-v1、critic-v1、input、schema、eval、mutation 与 model-config。model-config 明确 provider/model 为 NOT_RUN，避免离线 fixture 被误读成模型结果。报告只追加 phase、checks、failed_checks、fault_id 和 limitations，不覆盖原始证据。Critic 只能找缺口，不能批准 Oracle。

## Baseline failure repair

八类 eval 覆盖 positive、boundary、conflict、missing、unauthorized、refusal、truncation 和 paraphrase。它们检查合同与停止状态，不以语言流畅度代替职业判断。Fault 为：造成跨用户命中并让旧模型缓存继续返回。Fault 退出 1 是成功负控制；若退出 0，必须停止。Repair 要恢复来源、权限、版本或批准实现，禁止删断言、降阈值或改 Oracle。

工作目录 courses/td-ai-advanced-quality/lab。先 verify-packages，再逐页 baseline、fault、repair；报告写入 reports。公开投影使用相同相对路径，不访问源目录。归档由文件清单、owner 与 SHA-256 哈希闭合。

## Metrics and decisions

指标是 跨用户泄露、陈旧命中、删除传播、同意覆盖、cache bypass。每个指标都要分子、分母、切片、聚合、时间窗和 owner。阻断项失败立即停止，观察项只产生后续研究。无同意、隔离或删除回执时不得写入；模型、Prompt、知识版本变化时必须验证或失效语义缓存。。owner 必须访问原始证据、看到 UNKNOWN、拒绝候选并留下理由。同一模型不能同时生成候选和批准 Oracle。公平、伤害、安全、法律、生产发布或用户影响需要具名专业负责人与真实证据，离线 fixture 不构成批准依据。

## 恢复和迁移

迁移真实项目必须替换 fixture、风险模型、owner、阈值和工具适配器，并先捕获 live baseline。输入版本无法冻结、隐私授权缺失、样本代表性未知或回滚不可用时保持 BLOCKED。真实留存法律、用户预期、相似阈值、长期漂移和跨存储删除传播。只有真实集成、从业者复核和发布后读回完成，状态才可能继续提升。
