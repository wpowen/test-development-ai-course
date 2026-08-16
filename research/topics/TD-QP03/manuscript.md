# TD-QP03 Kubernetes 临时环境隔离与回收

## 让临时 Kubernetes 环境可隔离、可回收、可审计

怎样证明 provisioner、runner、cleaner 的身份权限、资源/网络隔离、环境状态、失败回收和审计闭环？ 新手常把局部绿灯当完整结果；真实质量结论必须绑定身份、权限、当前对象版本、测试证据、策略版本和可回滚副作用。本页以run-42 namespace、三个 ServiceAccount、Quota、NetworkPolicy、Job TTL、owner 标签与 cleanup receipt为贯穿样例，只用合成数据。

Run request → 模板 resolver → provisioner → Namespace/RoleBinding/Quota/NetworkPolicy → runner Job → artifact → cleanup/expiry scan → Kubernetes audit。触发器只要求创建 namespace，不能替代对 RBAC、Quota、NetworkPolicy 和清理回读。缺少 namespace UID 或删除 receipt 时进入 BLOCKED/FAIL/INCONCLUSIVE，不能用 kubectl 成功码跨过环境证据缺口。人类权力边界：平台 owner 批准模板，安全 owner 批准 RBAC/网络，cluster owner 批准准入/审计/回收，测试 owner 定义测试行为。

### 指标怎样支持决定

Ready 延迟=p95(ready-requested)；RBAC deny 率=denied/authz；孤儿资源=count(expired_owner_resources)；cleanup 成功率=closed_without_residual/attempts。真实项目先由 sandbox 建基线，再由 owner 选择告警/阻断/waiver；fixture 只验证公式和分支，不虚构生产阈值。

## Runnable action

在公开 learner-materials 运行：python3 scripts/ephemeral_namespace_cleanup.py cycle --report-dir reports/td-qp03。脚本生成 namespace-baseline、cluster-admin fault、repair 和 cycle-summary；内部退出语义保持 [0,1,0]，顺序不符即失败。先看 maturity/not_run，再看 failed_oracle_ids、checks、state 和 evidence_hash。

Prompt 包包含 system/task/critic、fixed input、JSON Schema、eval 与 version manifest。它把证据审查、fail-closed 和 human authority 固定下来；provider/model 均 NOT_RUN，表示提供可复用专业契约但没有伪造模型运行。

Mutation 是给 runner 增加 `cluster-admin`；`LEAST-PRIVILEGE` 必须变红，repair 恢复最小 RBAC 并保留 cleanup receipt。

## Failure and repair

故障：给 runner 增加 cluster-admin，LEAST-PRIVILEGE 变红。fault 必须红；若仍绿，说明 Oracle 漏检，必须停止。repair 从 canonical baseline 重建，不能覆盖 fault。诊断按 Gateway 身份/签名、平台当前事实、版本坐标、证据、adapter receipt、audit 顺序推进。

迁移到真实环境要先在隔离 project/namespace 做 capability probe，再配置最小权限并注入重复、乱序、403、429/5xx、响应丢失和 rollback。没有真实 API receipt、平台审计、人工审批和 practitioner review 时保持 NOT_RUN；本页完成只证明离线证据链，不代表 live integration。

### TD-QP03 临时环境判断卡

每个临时 namespace 必须有 owner、purpose、创建时间和过期时间标签，缺标签就不能进入测试池。
runner 与应用使用不同 service account，权限差异由 RoleBinding 快照直接证明。
Quota、NetworkPolicy 和 Secret 引用都要进入环境 receipt，不能只记录 kubectl apply 成功。
TTL 到期后应产生删除 receipt，并由 orphan scan 检查残留 PVC、LB 和云资源。
LEAST-PRIVILEGE mutation 给 runner 加 cluster-admin 时，独立 RBAC Oracle 必须立即报红。
repair 仅撤销新增绑定并重新导出权限快照，不允许把违规权限藏进通配符 Role。
环境 owner 负责批准扩容，但不能同时修改 expected 权限集合。
故障报告关联 namespace UID 和审计时间线，防止名称复用掩盖旧环境。
并发创建使用唯一租约键，重复请求只能返回已有环境而不能泄漏第二组 Secret。
迁移到真实集群前需核对 admission、审计日志、清理控制器和平台配额；这些证据缺失时保持 UNKNOWN。

## 页面专属迁移卡：临时环境闭环

用 run-42 合成 namespace 验证 runner、provisioner、cleaner 三种身份、Quota、NetworkPolicy、TTL 和 owner 标签。故障注入覆盖读 Secret、跨 namespace、超 quota 和 cleanup 残留；学习者必须提交 authz/audit、policy 命中和删除 receipt，而不能只提交 Pod Running。

Wave3 交付 Environment Manifest、身份矩阵、Quota/NetworkPolicy、TTL/cleanup SOP 和残留清单；真实集群、provider/model、integration、practitioner review、learner observation、live 与 production 仍 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 namespace/RBAC/Quota/NetworkPolicy/Secret/TTL/cleanup 的 worked decision 与 fault-repair：越权不能用 cluster-admin 掩盖，残留不能直接删除证据。迁移交付 Environment Manifest、身份矩阵、policy hit、Quota 报告、cleanup receipt、残留清单和 owner 签收；真实集群与 production cleanup 仍 NOT_RUN。
