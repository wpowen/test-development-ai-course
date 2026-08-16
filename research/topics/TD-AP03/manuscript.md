# TD-AP03 页面稿：Trace 语义与因果证据

## Professional problem — AP03 Trace 因果 method

没有 task root 的 span 无法解释 Agent 是否调用了错误工具、重试了几次或在哪一步越权；最终文本正确也不能替代轨迹证据。

本页采用 **causal trace reconstruction + schema-closure audit** method：用 task root 串 generation、tool、attempt、handoff、finalize，并为每条 span 保存 parent_id、schema version 和脱敏状态。选择它的理由是最终文本不能证明中间权限和工具路径。独立 Oracle 根据任务输入、允许路径和 root-to-finalize closure 判定，不读取 trace evaluator 的 verdict。

精确命令是 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP03-lab.json --mode cycle`（cwd=`courses/td-ai-010-agent-load-stability/lab`）。实际结果为 0/1/0：fault 丢失父子关联时退出 1，诊断查看 parent_id/span_kind 与 redaction，repair 恢复 linkage 并保留版本化 schema。

## 为什么要学

如何用 task-rooted Trace 串起 generation、tool、retry、handoff 与终态，同时避免高基数和隐私泄漏？ 初学者最容易把入口成功、平均延迟或一次短压测误写成系统能力。本页先给决策口径，再给可运行三阶段实验，最后要求 learner 用证据卡交付，而不是抄一个数字。

## 教学顺序

1. 用反例暴露假绿；2. 画出至少五节点架构；3. 解释来源定义与限制；4. 运行 baseline；5. 注入 让 45% 模型/工具 Span 丢失父子关联；6. 保持阈值不变完成 repair；7. 对比摘要和一条 Trace；8. 把 Evidence / Inference / Unknown 写入工件。

## 专业提示词接口

Prompt v1.0.0 绑定 input-v1、output-schema-v1、eval-v1 和 mutation-v1。provider=none、model=NOT_RUN；实验的 fixture 通过不等于模型评审已运行。

## 常见错误

- 用 HTTP 2xx 替代任务业务终态。
- 用均值替代 p95/队列/重试/步骤。
- 为让 fault 变绿而删除 gate。
- 把 synthetic fixture 的吞吐写成生产容量。

## Runnable action

运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP03-lab.json --mode cycle`，观察 0/1/0；从 fault trace 找断裂的 parent-child link，并用独立 trace oracle 判定 closure。

## Failure and repair

fault 删除 tool child span 或破坏 handoff parent，诊断锁定 trace writer/schema；repair 恢复链接与脱敏，不得把缺证据改成 warning。

命令 walkthrough：运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP03-lab.json --mode cycle`，实际结果为 0/1/0。查看 fault trace 的 parent_id、span_kind、tool_name 和 redaction 状态，再由独立 Oracle 检查 root 到 finalize 的闭包；最终文本正确不能覆盖断链。

## 完成条件

观察到 0/1/0；指出 fault 被哪些 gate 拒绝；解释 repair 改了什么且未删阈值；明确仍未知的生产环境变量。

## 页面专属迁移卡：Trace 断链责任定位

拿到失败任务后先固定 `task_id`、`trace_id`、`workload_hash` 和 `schema_version`，再逐层检查 root、generation、tool、retry、handoff、terminal。字段缺口要归类为传播、采集、存储采样或脱敏策略，并为每类缺口写一个可观察的补证动作。只有同一 task 的 root-to-terminal 闭包恢复，才能将 fault 标记为已修复；最终回答文本不能替代轨迹证据。
## Wave4 闭包计算

退款 Trace 必须形成 root、retrieval、generation、tool、retry、handoff、terminal 的 parent_id 闭包；attempt 数与 ledger、schema hash、幂等键和脱敏状态逐项对账。迁移交付 schema diff、collector receipt 和可重放失败样例；真实 telemetry/model/integration 等均 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 root-to-terminal Trace 闭包、attempt ledger、schema hash、脱敏、replay 和结构 fault/repair；迁移交付 schema diff、collector receipt、隐私表和失败样例，真实 telemetry/provider/integration/practitioner/learner/live/production 均 NOT_RUN。
