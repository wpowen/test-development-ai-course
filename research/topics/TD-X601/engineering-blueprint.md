# TD-X601 工程蓝图：公平、伤害与 HITL 有效性

## Architecture and data flow

输入是批准的合成任务、版本 manifest、独立 owner 注册表和页面 Prompt 包。生成器只提出候选，确定性 runner 只验证机械合同；涉及语义、伤害、例外、用户体验或发布的结论交给独立 owner。技术主链：使用情境与伤害模型 → 合法切片 → 分组结果 → 最坏切片与 blocker → 独立人工样本 → 分歧/申诉 → 具名决策。

## 数据、Prompt 与版本合同

每个输入携带 topic_id、schema_version、policy version、fixture hash、Prompt manifest hash 和 owner。Prompt 包固定 prompt-v1、critic-v1、input、schema、eval、mutation 与 model-config。model-config 明确 provider/model 为 NOT_RUN，避免离线 fixture 被误读成模型结果。报告只追加 phase、checks、failed_checks、fault_id 和 limitations，不覆盖原始证据。Critic 只能找缺口，不能批准 Oracle。

## Baseline failure repair

八类 eval 覆盖 positive、boundary、conflict、missing、unauthorized、refusal、truncation 和 paraphrase。它们检查合同与停止状态，不以语言流畅度代替职业判断。Fault 为：只保留汇总平均，并让同一模型自评。Fault 退出 1 是成功负控制；若退出 0，必须停止。Repair 要恢复来源、权限、版本或批准实现，禁止删断言、降阈值或改 Oracle。

工作目录 courses/td-ai-advanced-quality/lab。先 verify-packages，再逐页 baseline、fault、repair；报告写入 reports。公开投影使用相同相对路径，不访问源目录。归档由文件清单、owner 与 SHA-256 哈希闭合。

## Metrics and decisions

指标是 最坏切片、伤害 blocker、人工覆盖率、评审一致率、override 时延。每个指标都要分子、分母、切片、聚合、时间窗和 owner。阻断项失败立即停止，观察项只产生后续研究。总体提升不能抵消严重伤害；没有独立性、授权、抽样覆盖和可追踪 override 的 HITL 不是有效控制。。owner 必须访问原始证据、看到 UNKNOWN、拒绝候选并留下理由。同一模型不能同时生成候选和批准 Oracle。公平、伤害、安全、法律、生产发布或用户影响需要具名专业负责人与真实证据，离线 fixture 不构成批准依据。

## 恢复和迁移

迁移真实项目必须替换 fixture、风险模型、owner、阈值和工具适配器，并先捕获 live baseline。输入版本无法冻结、隐私授权缺失、样本代表性未知或回滚不可用时保持 BLOCKED。受保护属性处理合法性、因果公平、真实伤害、评审负担与申诉效果。只有真实集成、从业者复核和发布后读回完成，状态才可能继续提升。
