# TD-QP03 Engineering Blueprint

## Architecture and data flow

Run request → 模板 resolver → provisioner → Namespace/RoleBinding/Quota/NetworkPolicy → runner Job → artifact → cleanup/expiry scan → Kubernetes audit。边界内只读合成 fixture，不调用外部平台、模型或通知。事件有 source_event_id/trace_id；对象有 revision/SHA/environment_id；副作用有 fingerprint/receipt。共享 bundle 的 exact owners 只有 TD-QP01..04。

## Metrics and decisions

Ready 延迟=p95(ready-requested)；RBAC deny 率=denied/authz；孤儿资源=count(expired_owner_resources)；cleanup 成功率=closed_without_residual/attempts。按 tenant/project/topic/policy_version 分层。阻断由测试/平台 owner，权限/隐私异常升级安全 owner，业务语义/waiver 返回授权人。无分母或 owner 的成功率不可发布。

## Version and schemas

Lab manifest v2.0.0 锁定 public working_directory、required_files、step 与 artifacts；Prompt manifest v1.0.0 锁定 system/task/critic、input、Schema、eval，并设置 provider/model=NOT_RUN。报告字段固定为 topic_id、mode、maturity、verdict、expected_exit_code、failed_oracle_ids、evidence_hash、checks、state、not_run。

## Baseline failure repair

Baseline 预期 0；Fault 为给 runner 增加 cluster-admin，LEAST-PRIVILEGE 变红，预期 1 且命名 Oracle 失败；Repair 从 canonical baseline 重建而不覆盖失败报告，预期 0。cycle 只有在观察序列精确为 [0,1,0] 时才退出 0，并保存 cycle-summary。

## SOP, diagnosis and rollback

检查 owner/manifest → 跑 cycle → fault 不红或 repair 不绿立即停止 → 比较报告和 evidence_hash → 确认 Prompt provider NOT_RUN → 禁止回写真实平台。诊断顺序为签名/身份/API 回读 → current version → evidence/schema → outbox/adapter → audit/reconciliation。回滚冻结新副作用、恢复上一版本、按当前事实对账，并保留原事件、失败报告、DLQ 和修复 receipt。
