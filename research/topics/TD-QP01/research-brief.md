# TD-QP01 Research Brief

## Controlling question

Jira webhook 到达后，怎样回读当前需求、验证 actor/tenant/scope，并保证 AI 候选只有经有权 reviewer 批准后才能产生副作用？

## Learner, task and failure cost

学习者已掌握 API、测试用例和 CI 基础，但没有设计跨系统质量控制面的经验。支持的专业决定是：产品 owner 定义需求语义，技术 owner 定义实现约束，测试 owner 定义风险与 Oracle，授权 reviewer 决定是否执行。 系统对象为PROJ-42 revision 7、changelog、Basis Pack、候选测试和批准记录。输入是脱敏事件、当前状态快照、策略版本、固定 Prompt 输入和离线 fixture。约束包括 tenant/project allowlist、最小权限、当前 revision/SHA/environment、不可变 artifact reference、人工权力和审计保留。失败会造成旧状态覆盖新状态、越权副作用、缺证据误判成功、资源泄漏或不可追责 waiver。

## Explain, demonstrate, do and diagnose

页面必须解释事件与事实回读的区别、身份和权限、状态/version 绑定、重试与幂等、审计和回滚；展示 baseline=0、fault=1、repair=0；让学习者运行命令、打开三份报告、比较 failed_oracle_ids/evidence_hash，并从症状定位 Gateway、Orchestrator 或 Adapter。故障为：删除必需验收字段，BASIS-COMPLETE 变红。

## Scope, freshness and artifact

范围只含合成数据、确定性 Oracle、版本化 Prompt/Schema/eval 和精确 owner。排除真实凭据、外部 API、集群、模型、ChatOps、生产 SLO 与组织审批；全部标为 NOT_RUN。来源于 2026-08-11 打开，覆盖官方 API、标准、实现、指标、失败、安全、审计与教学供给。产物是 reports/td-qp01 下四份 JSON 和 Prompt package；用 manifest 精确命令、0/1/0、命名 Oracle 和 NOT_RUN 边界验收。
