# TD-QP01 Jira 事件、身份、权限与人工批准

## 先回读 Jira 当前事实，再让人工批准副作用

Jira webhook 到达后，怎样回读当前需求、验证 actor/tenant/scope，并保证 AI 候选只有经有权 reviewer 批准后才能产生副作用？ Jira 回读的局部绿灯不能代表验收完成；结论必须绑定 Gateway 身份、项目权限、issue revision、changelog 和可撤销更新。本页以PROJ-42 revision 7、changelog、Basis Pack、候选测试和批准记录为贯穿样例，只用合成数据。

Jira webhook → 签名/时间窗/tenant gate → Inbox → REST v3 回读 issue/changelog/transitions → Basis Gate → 版本化候选 → 人工批准 → Outbox。触发器只发起 issue 回读，不能替代对 revision 与 changelog 的实际核验。缺少 Jira revision 或批准记录时，本阶段标记 BLOCKED/FAIL/INCONCLUSIVE，不得以状态字段补齐空证据。人类权力边界：产品 owner 定义需求语义，技术 owner 定义实现约束，测试 owner 定义风险与 Oracle，授权 reviewer 决定是否执行。

### 指标怎样支持决定

签名失败率=invalid/received；Basis 阻断率=blocked/evaluated；引用完整率=complete_source_refs/candidates；审批 lead time=p95(approved_at-proposed_at)。真实项目先在 sandbox 固化 issue 基线，再由 owner 决定告警、阻断或 waiver；fixture 只验证回读分支，不虚构 Jira 生产阈值。

## Runnable action

在公开 learner-materials 运行：python3 scripts/basis_gate_and_candidate_review.py cycle --report-dir reports/td-qp01。脚本生成 issue-baseline、stale-revision fault、repair 和 cycle-summary；内部退出语义仍为 [0,1,0]，只有顺序完整才算 cycle 通过。先看 maturity/not_run，再看 failed_oracle_ids、checks、state 和 evidence_hash。

Prompt 包包含 system/task/critic、fixed input、JSON Schema、eval 与 version manifest。它把证据审查、fail-closed 和 human authority 固定下来；provider/model 均 NOT_RUN，表示提供可复用专业契约但没有伪造模型运行。

Mutation 是删除 `BASIS-COMPLETE` 必需字段；fault 必须 exit 1，repair 从 canonical baseline 重建而不是覆盖 fault。

## Failure and repair

故障：删除必需验收字段，BASIS-COMPLETE 变红。fault 必须红；若仍绿，说明 Oracle 漏检，必须停止。repair 从 canonical baseline 重建，不能覆盖 fault。诊断按 Gateway 身份/签名、平台当前事实、版本坐标、证据、adapter receipt、audit 顺序推进。

迁移到真实环境要先在隔离 project/namespace 做 capability probe，再配置最小权限并注入重复、乱序、403、429/5xx、响应丢失和 rollback。没有真实 API receipt、平台审计、人工审批和 practitioner review 时保持 NOT_RUN；本页完成只证明离线证据链，不代表 live integration。

### TD-QP01 Jira 回读判断卡

每次回读先固定 project、issue key 和时间窗口，再保存请求签名与响应时间。
验收对象是 issue revision 与 changelog，而不是模型生成的“已完成”文字。
BASIS-COMPLETE 需要同时引用状态、必填字段、关联提交和最后修改人四类来源。
actor、tenant、scope 进入 receipt 后才能判断是否越权读取了相邻项目。
人工 reviewer 必须在 Jira 侧留下独立批准记录，模型自报批准不计数。
Outbox 记录发送意图，回读 adapter receipt 记录平台实际接受，两者不能互相替代。
mutation 删除 revision 或改写 changelog 时，独立 Oracle 应拒绝这条证据链。
遇到 stale revision，修复动作应重新拉取当前 issue，而不是覆盖服务器版本。
rollback 只撤销本次候选更新，保留原始 issue 与 audit trail 供 owner 对账。
迁移到真实 Jira 前需验证 API scope、签名轮换和限流处理；平台 receipt 与 practitioner review 未提供前仍为 UNKNOWN。

## 页面专属迁移卡：Basis Gate 的四个阻断检查

用一条合成需求事件分别验证 revision、source_ref、reviewer scope 和 webhook 回读。交付物必须能指出旧 revision 仍可执行、摘要无引用、批准无范围、payload 未回读四类失败，并把每类失败回链到对应 issue/changelog、身份或 adapter receipt。

Wave3 迁移还需交付 Basis Pack、冲突表、候选 provenance、review matrix 和 rollback SOP；真实 Jira 字段、权限、审批、provider/model、integration、practitioner review、learner observation、live 与 production 仍 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 Jira revision 争议、source_ref、actor/scope、transition 和 rollback 练习；批准与写入拆成独立门禁。迁移交付字段能力探针、Basis Gate、冲突表、review receipt 和 NOT_RUN 清单；真实租户仍未执行。
