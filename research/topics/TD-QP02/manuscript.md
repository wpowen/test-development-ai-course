# TD-QP02 GitLab 运行与 JUnit 证据绑定

## 用当前 commit SHA 把 GitLab JUnit 证据钉回 MR

怎样证明 MR 门禁属于当前 commit SHA，并在 Pipeline、JUnit、必跑 suite 或 artifact 缺失时 fail-closed？ 新手常把局部绿灯当完整结果；真实质量结论必须绑定身份、权限、当前对象版本、测试证据、策略版本和可回滚副作用。本页以project 17、MR 9、pipeline 501、run-42、当前 SHA 与 unit/contract JUnit为贯穿样例，只用合成数据。

GitLab webhook → Inbox → 回读 MR HEAD/head pipeline → Jobs/JUnit/artifact → 确定性聚合 → 再查当前 SHA → status check → protected branch。触发器只要求拉取 pipeline，不能替代对 head SHA、artifact digest 和批准链的回读。缺少当前 SHA 或测试 artifact 时进入 BLOCKED/FAIL/INCONCLUSIVE，不能用上一次 pipeline 的绿灯跨阶段补证据。人类权力边界：测试 owner 定义 suite/聚合，GitLab owner 定义 status 与保护规则，MR approver 决定是否合并。

### 指标怎样支持决定

SHA 绑定率=current_sha_runs/runs；suite 完整率=present_required/required；报告延迟=p95(collected-finished)；旧 SHA 拒绝率=rejected_stale/stale_attempts。真实项目先由 sandbox 建基线，再由 owner 选择告警/阻断/waiver；fixture 只验证公式和分支，不虚构生产阈值。

## Runnable action

在公开 learner-materials 运行：python3 scripts/gitlab_sha_junit_gate.py cycle --report-dir reports/td-qp02。脚本生成 commit-baseline、stale-SHA fault、repair 和 cycle-summary；内部退出语义仍为 [0,1,0]，序列错位即阻断。先看 maturity/not_run，再看 failed_oracle_ids、checks、state 和 evidence_hash。

Prompt 包包含 system/task/critic、fixed input、JSON Schema、eval 与 version manifest。它把证据审查、fail-closed 和 human authority 固定下来；provider/model 均 NOT_RUN，表示提供可复用专业契约但没有伪造模型运行。

Mutation 是把 MR HEAD 改成旧 SHA；`CURRENT-SHA` 必须变红，repair 重建当前 SHA 绑定，不能跳过 JUnit 缺失检查。

## Failure and repair

故障：把 MR HEAD 改成另一个 SHA，CURRENT-SHA 变红。fault 必须红；若仍绿，说明 Oracle 漏检，必须停止。repair 从 canonical baseline 重建，不能覆盖 fault。诊断按 Gateway 身份/签名、平台当前事实、版本坐标、证据、adapter receipt、audit 顺序推进。

迁移到真实环境要先在隔离 project/namespace 做 capability probe，再配置最小权限并注入重复、乱序、403、429/5xx、响应丢失和 rollback。没有真实 API receipt、平台审计、人工审批和 practitioner review 时保持 NOT_RUN；本页完成只证明离线证据链，不代表 live integration。

### TD-QP02 SHA 绑定判断卡

评估输入先锁定 merge request 的 head SHA、目标分支和 pipeline source，不能用标题代替提交坐标。
JUnit 或等价测试报告必须声明运行套件、生成时间和对应 artifact digest。
CURRENT-SHA Oracle 同时比较 MR head、构建元数据与产物内嵌 SHA，任何一处漂移都应阻断。
artifact integrity 还要检查下载来源、大小和签名，单个绿色状态徽章不足以证明完整性。
mutation 把测试结果替换成旧 SHA 后，审计应指出 stale evidence 而不是接受历史成功。
repair 重新运行当前提交并生成新 receipt，不能手改旧 XML 的 commit 字段。
受保护分支的批准人、合并人和服务账号要分开列出，避免同一身份闭环自证。
重复回调通过 pipeline id 去重，重试不能产生第二个发布批准副作用。
失败报告保存原始 artifact digest 和 diff，便于 owner 复盘为什么绑定失效。
迁移到真实 CI 前需取得平台 API receipt、受保护分支配置和人工审批证据；未取得前保持 NOT_RUN。

## 页面专属迁移卡：当前 SHA 对账

以同一 MR 的两个 commit 构造旧 Pipeline 竞态，逐项对账 MR HEAD、Pipeline SHA、JUnit suite 和 artifact digest。任何一处漂移都必须阻断，并在修复后生成新的 receipt；禁止手改旧 XML 的 commit 字段。

Wave3 交付 SHA-bound manifest、JUnit 聚合摘要、stale evidence 诊断和保护分支检查清单；真实 GitLab API、Runner、provider/model、integration、practitioner review、learner observation、live 与 production 仍 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 concurrent build 的旧 SHA 回调、JUnit 截断、artifact digest 漂移和取消事件 fault/repair。裁决区分 code failure、evidence missing、stale evidence 与 platform failure；迁移交付 SHA manifest、竞态时间线、stale-evidence 报告、repair receipt，真实 Runner/CI integration 仍 NOT_RUN。
