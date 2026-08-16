# TD-QP04 跨系统重试、幂等、审计与回滚

## 用 Inbox/Outbox 与幂等键处理跨系统重放

Jira、GitLab、Kubernetes 和通知系统出现重复、乱序、部分成功或响应丢失时，怎样保持状态可解释、副作用幂等且可回滚？ 新手常把局部绿灯当完整结果；真实质量结论必须绑定身份、权限、当前对象版本、测试证据、策略版本和可回滚副作用。本页以CloudEvents 信封、Inbox/Outbox/DLQ、run/trace graph、三类副作用与 rollback plan为贯穿样例，只用合成数据。

Platform events → signature/schema Gateway → Inbox → versioned orchestrator → Outbox → adapters → notice/audit → DLQ/reconciliation → rollback。触发器只要求接收 CloudEvent，不能替代对去重账本、远端 issue key 和 trace 的回读。缺少 event id 或 adapter receipt 时进入 BLOCKED/FAIL/INCONCLUSIVE，不能用重试成功跨过对账证据缺口。人类权力边界：平台 owner 定义 schema/retry/reconciliation，各系统 owner 定义写权限，隐私 owner 定义通知 allowlist，审计 owner 定义保留。

### 指标怎样支持决定

重复抑制率=suppressed/duplicates；重复副作用率=keys_with_count_gt1/keys；Outbox age=p95(now-created)；对账修复率=repaired/mismatches；trace 完整率=complete_traces/runs。真实项目先由 sandbox 建基线，再由 owner 选择告警/阻断/waiver；fixture 只验证公式和分支，不虚构生产阈值。

## Runnable action

在公开 learner-materials 运行：python3 scripts/event_replay_and_reconcile.py cycle --report-dir reports/td-qp04。脚本生成 event-baseline、duplicate-effect fault、repair 和 cycle-summary；内部退出语义仍为 [0,1,0]，乱序即阻断。先看 maturity/not_run，再看 failed_oracle_ids、checks、state 和 evidence_hash。

Prompt 包包含 system/task/critic、fixed input、JSON Schema、eval 与 version manifest。它把证据审查、fail-closed 和 human authority 固定下来；provider/model 均 NOT_RUN，表示提供可复用专业契约但没有伪造模型运行。

Mutation 是同一 CloudEvent 创建两个 Jira defect；`EXACTLY-ONCE-EFFECT` 必须变红，repair 依据 Inbox/Outbox ledger 对账，不删除 mutation。

## Failure and repair

故障：同一事件创建两个 Jira defects，EXACTLY-ONCE-EFFECT 变红。fault 必须红；若仍绿，说明 Oracle 漏检，必须停止。repair 从 canonical baseline 重建，不能覆盖 fault。诊断按 Gateway 身份/签名、平台当前事实、版本坐标、证据、adapter receipt、audit 顺序推进。

迁移到真实环境要先在隔离 project/namespace 做 capability probe，再配置最小权限并注入重复、乱序、403、429/5xx、响应丢失和 rollback。没有真实 API receipt、平台审计、人工审批和 practitioner review 时保持 NOT_RUN；本页完成只证明离线证据链，不代表 live integration。

### TD-QP04 重放与对账判断卡

事件入口先固定 CloudEvent id、source 和 subject，adapter 不得只用自然语言标题去重。
Inbox 记录接收事实，Outbox 记录待发送事实，两个 ledger 的关联键必须可回读。
下游 Jira receipt 要包含创建结果、远端 issue key 和请求 trace，不能把 HTTP 200 当作业务成功。
EXACTLY-ONCE-EFFECT mutation 重放同一事件时，Oracle 应看到一个缺陷与一条可解释的 no-op。
超时后进入 DLQ 的事件必须保留原 payload hash 和最后错误，禁止静默丢弃。
trace graph 将事件、adapter、远端响应和人工处置串联，便于区分重复投递与重复业务效果。
对账任务按事件 id、远端 key 和本地 ledger 三方比对，任何孤儿记录都进入 owner 队列。
repair 先暂停重放，再补写缺失 ledger，最后由独立 Oracle 重新检查远端数量。
rollback 只撤销本次候选缺陷并保留原始事件，不能删除 DLQ 作为“清理”。
迁移到真实 webhook 前需验证签名、重试语义、DLQ 运维和人工审批；没有这些 live receipt 时保持 NOT_RUN。

## 页面专属迁移卡：两本账的重放对账

重放同一 CloudEvent，分别检查 Inbox 接收事实、Outbox 发送意图、adapter receipt 和远端业务副作用。若响应超时，用 event id、远端 key 和本地 ledger 判定已创建但未回执还是尚未创建，并保留 DLQ payload hash 与 rollback 记录。

Wave3 交付 CloudEvents schema、Inbox/Outbox/DLQ 状态机、幂等键表、对账报告和 rollback runbook；真实事件总线、provider/model、integration、practitioner review、learner observation、live 与 production 仍 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 Inbox/Outbox/receipt/远端业务 key 的事件状态裁决、幂等重放、DLQ 和 rollback 练习。迁移交付 schema、状态机、幂等键表、对账报告、脱敏策略和 owner 签收；真实事件总线与 live delivery 仍 NOT_RUN。
