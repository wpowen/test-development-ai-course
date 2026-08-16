# TD-T08 教学稿：聚类不是根因，证据缺口要写 UNKNOWN

## 保留原始失败，再让 AI 提出候选簇
CI 一次失败数百条时，把相似日志聚成几组很有价值，但“相似”只说明排查入口。相同 timeout 可能来自连接池、依赖服务、网络、资源竞争或测试隔离；不同堆栈也可能共享一个上游原因。AI 的摘要越流畅，越容易让团队跳过原始证据和控制实验。专业目标是降低噪声同时保全可回放证据，并严格区分观察、聚类、假设、实验和已验证原因。

采集必须先于摘要。每个事件保存 run/test、trace/span、commit、环境、依赖版本、时间、日志和工件哈希；派生字段引用原始事件而不覆盖。cluster 输出包含成员列表、分组理由、冲突、异常值和版本。模型可以提出“可能是连接池耗尽”与下一实验，却不能写“根因已确认”。缺 trace、混合 commit、环境不一致或采样未知时，状态就是 UNKNOWN。

## 运行 TD-T08 并核对引用链


```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-assisted-testing
python3 ai_assisted_lab.py run --topic TD-T08 --phase baseline --report reports/td-t08-baseline.json
python3 ai_assisted_lab.py run --topic TD-T08 --phase fault --report reports/td-t08-fault.json
python3 ai_assisted_lab.py run --topic TD-T08 --phase repair --report reports/td-t08-repair.json
```

TD-T08 预期退出码为 `0 → 2 → 0`；本页 fault 非零是检测力证据，不得用 shell 吞掉。

在材料目录运行 TD-T08 baseline，检查 cluster 的 `raw_event_refs`、commit/environment set 和 next experiment。打开 `page-prompts/TD-T08/`，确认 manifest、Prompt、Input、Schema、Eval、Mutation 与模型配置均为版本化文件；schema 将 symptom、hypothesis 和 cause_status 分开；eval 覆盖冲突、缺失、越权、拒答、截断等输入；critic 负责查证据缺口，不替聚类器批准因果。

运行 fault：runner 清空 trace 并混合 commit。虽然异常文本可以被归到一起，报告仍返回 UNKNOWN、`raw_evidence_preserved=false`、实验 NOT_RUN，退出 2。这个“停止”比猜测根因更专业。执行 repair 后恢复引用与版本一致性，再读取退出 0。真实系统还需要做控制变量实验，例如仅改变连接池参数、在同 commit/environment 重放，并保存症状是否翻转。

## 诊断 TD-T08 的错误批准路径
失败一是聚类后删除原始日志，只留摘要；修复是 append-only 原始工件、哈希和双向引用。失败二是按异常文本直接宣布根因；修复是状态机和独立实验门禁。失败三是把不同 commit/environment 混成一组；修复是先分层并标记 confounder。失败四是隐藏未归组事件；修复是保留 outlier，因为它可能是另一个缺陷或反证。失败五是让同一模型分组又审批，修复是独立 reviewer 与真实实验。

完成标准是 fault 阶段缺证据时确实输出 UNKNOWN，repair 后保留原始引用并能说明下一实验；不是生成一段漂亮 RCA。当前材料只用合成事件，没有连接 OpenTelemetry、Sentry 或真实 CI，也未运行模型、从业者评审或生产修复。因此本页仅 `fixture-tested`，迁移必须重新验证采样、隐私、保留、聚类质量和因果升级规则。
