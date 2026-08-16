# TD-AP02 页面稿：TTFT、TPOT、Queue、Retry 与 Step 指标树

## Professional problem — AP02 指标分解 method

指标树必须把用户任务、队列、首 token、生成、工具、重试和最终终态分开，否则快的 token 可能掩盖慢的任务。

本页采用 **metric-tree decomposition + denominator audit** method：从 good task 向下拆 queue、TTFT、TPOT/ITL、tool、retry 和 cost。选择它的理由是不同指标回答不同阶段的等待问题，混用 request、step、task 分母会制造假绿。独立 Oracle 从原始事件重算一个任务成功率和尾延迟，禁止直接采信报告摘要。

精确命令是 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP02-lab.json --mode cycle`（cwd=`courses/td-ai-010-agent-load-stability/lab`）。实际结果为 0/1/0：fault 把 task 指标换成不完整分母时退出 1，诊断定位 metric schema/evaluator，repair 补回分母而不改阈值。

## 为什么要学

哪些指标能把用户等待拆成排队、首 Token、逐 Token、工具与重试，并保持可行动性？ 初学者最容易把入口成功、平均延迟或一次短压测误写成系统能力。本页先给决策口径，再给可运行三阶段实验，最后要求 learner 用证据卡交付，而不是抄一个数字。

## 教学顺序

1. 用反例暴露假绿；2. 画出至少五节点架构；3. 解释来源定义与限制；4. 运行 baseline；5. 注入 同时抬高首 Token、逐 Token、排队、重试和步骤数；6. 保持阈值不变完成 repair；7. 对比摘要和一条 Trace；8. 把 Evidence / Inference / Unknown 写入工件。

## 专业提示词接口

Prompt v1.0.0 绑定 input-v1、output-schema-v1、eval-v1 和 mutation-v1。provider=none、model=NOT_RUN；实验的 fixture 通过不等于模型评审已运行。

## 常见错误

- 用 HTTP 2xx 替代任务业务终态。
- 用均值替代 p95/队列/重试/步骤。
- 为让 fault 变绿而删除 gate。
- 把 synthetic fixture 的吞吐写成生产容量。

## Runnable action

运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP02-lab.json --mode cycle`，核对 baseline=0、fault=1、repair=0；用独立 task oracle 复算一个 p95 和 goodput。

## Failure and repair

fault 删除一个关键分母或把 task 指标换成 request 指标，诊断应定位 schema/evaluator 而不是调阈值；repair 补回字段后恢复 0。

命令 walkthrough：在 `courses/td-ai-010-agent-load-stability/lab` 运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP02-lab.json --mode cycle`，实际结果为 0/1/0。先比较 queue、TTFT、TPOT 与 goodput 的分母，再由独立 Oracle 重算一项 p95；若 fault 只留下 request 级数字，必须判为证据断裂而非性能通过。

## 完成条件

观察到 0/1/0；指出 fault 被哪些 gate 拒绝；解释 repair 改了什么且未删阈值；明确仍未知的生产环境变量。

## Wave3 worked example and transfer artifact

选一条客服 Agent 慢任务，按 queue、TTFT、TPOT、tool、retry 和编排空隙画时间线，分别写分子、分母、观测点、分桶和窗口。交付阶段指标卡；迁移到新 Agent 时只迁移定义，不复制阈值，先确认 trace、token、队列和工具延迟是否可见。真实 provider/model、企业集成、practitioner review、learner observation、live 与 production 仍为 NOT_RUN。
## Wave4 预算复盘

示例任务总时长 12 秒，queue/TTFT/TPOT/tool/retry/编排空隙分别为 1.5/2/3/4/1/0.5 秒，先验证阶段加总再按风险排序优化；缺失 queue 或 tool span 只能记 UNKNOWN。交付 metric-card、阶段 Trace 和 transfer note，fixture-only 边界保留。
## Wave5 页面裁决与迁移记录

页面新增 queue/TTFT/TPOT/tool/retry 六段预算、单变量 fault/repair、指标审查与 capability probe；迁移只复用定义，不复制阈值，真实 provider/model、integration、practitioner、learner、live、production 均 NOT_RUN。
