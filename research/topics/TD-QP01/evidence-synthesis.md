# TD-QP01 Evidence Synthesis

## Fact

Jira webhook → 签名/时间窗/tenant gate → Inbox → REST v3 回读 issue/changelog/transitions → Basis Gate → 版本化候选 → 人工批准 → Outbox。官方资料支持 webhook 是触发器而非完整质量事实；处理器仍需以有权限身份回读当前对象，并把结果绑定 revision、commit SHA 或 environment。事件与动作保存 actor、tenant/project、run、policy_version、artifact_ref 和 trace。来源不支持把 2xx、Pipeline success、manifest 静态审阅或通知发送解释为端到端完成。

签名失败率=invalid/received；Basis 阻断率=blocked/evaluated；引用完整率=complete_source_refs/candidates；审批 lead time=p95(approved_at-proposed_at)。每个指标保留窗口、分母、维度、source point 和 decision owner，阈值从 sandbox 分布得出，不抄写通用数字。

## Cross-source synthesis

平台路线强调原生对象/API；失败路线强调重复、乱序、响应丢失、403/429/5xx 和部分成功。综合架构分三层：Gateway 可信入站；Orchestrator 用版本化状态机决定动作；Adapter 以幂等键执行并保存 receipt。AI 只做结构化候选、解释和分类，不拥有批准、waiver、合并、放宽权限或删除未知资源的权力。专业决定是：产品 owner 定义需求语义，技术 owner 定义实现约束，测试 owner 定义风险与 Oracle，授权 reviewer 决定是否执行。

一个可信报告必须回答谁以什么权限、对哪个版本对象、基于哪份证据、使用哪个策略、产生哪次可回滚副作用。大日志、JUnit 与敏感内容只保存授权 artifact reference。重试仅用于安全读或有幂等键的写，超限进入 DLQ/人工处理，不人工补绿。

## Inference

统一事件信封、精确 owner、source+id 去重、effect fingerprint、current-version check 与 append-only audit 很可能降低跨系统歧义，但仍需隔离租户/集群实验。确定性 fixture 可证明本地门禁分支，不证明真实 RBAC、网络 enforcement、模型质量、审批质量或生产延迟。

## Unknown

真实平台版本/tier、字段、权限、CNI/admission/audit backend、组织身份、密钥轮换、数据保留、模型 provider、审批 SLA 与 practitioner usability 均未知。最高成熟度为 fixture-tested。
