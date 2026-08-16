# TD-P08 engineering blueprint

## Architecture and data flow

输入层接收版本化 PRD、技术设计、OpenAPI、authority policy 与变更记录；解析层只做段落定位、hash 和字段候选；裁决层检查 authority、冲突、Unknown 与 owner；工件层生成 Impact Set and Evidence Pack；验证层运行 schema、source_refs、独立 Oracle、eval 与 mutation；证据层写 baseline/fault/repair report，并用 traceability 连接 source→claim→risk→method→oracle→case→result。共享 bundle 通过 manifest 的 exact owner_page_ids 声明页面所有权，禁止按 TD-P0 前缀继承。

关键状态为 ACCEPTED、UNKNOWN、BLOCKED、FAIL、PASS_FIXTURE 与 NOT_RUN。ACCEPTED 表示规则由当前 authority 支持；UNKNOWN 表示资料不足；BLOCKED 表示关键冲突；FAIL 表示负控制命中；PASS_FIXTURE 仅说明确定性 fixture 满足契约；NOT_RUN 表明模型或集成没有执行。状态不能向上猜测。

page-prompts/TD-P08 保存 v1.0.0 Prompt、input、schema、eval 与 provider none manifest；page-manifests/TD-P08.json 保存 baseline/fault/repair/cycle 命令和预期退出码；pipeline.py 负责 deterministic fixture；reports 保存逐相位证据；课程页只复制 manifest 精确声明的命令和完整 Prompt，不复制公式、图或伪代码。

## Metrics and decisions

门禁看关键 claim 的 source_ref 完整率、冲突阻断率、高风险到 method/oracle/monitoring/owner 的映射率、mutation detection、跳过与重试透明度、变更后 stale evidence 清理率。当前验收是 baseline=0、fault=1、repair=0、cycle=0；fault 报告 STALE_EVIDENCE，model_status 始终 NOT_RUN。

AI 可生成字段、问题、风险和失败聚类候选；产品 owner 决定业务规则，技术 owner 确认接口与实现约束，测试 owner 批准方法与 Oracle，release owner 决定 Go/No-Go。缺 owner、缺 Oracle、缺版本或缺原始证据时 fail-closed。

## Baseline failure repair

Baseline 运行 page-phase baseline，期望退出 0 与 PASS。Fault 在同一固定输入中注入 STALE_EVIDENCE，期望退出 1 与 FAIL；若仍绿，说明门禁没有检测力。Repair 恢复 authority、来源、独立 Oracle 或证据字段，期望退出 0。Cycle 汇总三相收据，但只给 fixture-tested，不把 provider none 解释为模型运行。

禁止删除失败断言、把 UNKNOWN 改成默认值、添加 skip、只保留最终重试成功、让生成器改写 Oracle、复制旧 PASS 到新版本。正确修复作用于根因，并保留 fault receipt 作为回归样例。
