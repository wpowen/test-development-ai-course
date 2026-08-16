# TD-AP04 页面稿：开放与封闭负载模型

## Professional problem — AP04 负载模型选择 method

开放到达率和封闭并发测量不同的系统问题；只用封闭用户循环会把等待隐藏为较低到达率，产生 coordinated omission。

本页采用 **open-vs-closed controlled comparison** method：冻结同一任务集合，只切换 arrival scheduler 与 concurrency executor。选择它的理由是 open 模型回答容量和排队，closed 模型回答受限用户体验，二者不能用一个吞吐数字替代。独立 Oracle 只判断任务终态、截止时间和 queue evidence。

精确命令是 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP04-lab.json --mode cycle`（cwd=`courses/td-ai-010-agent-load-stability/lab`）。实际结果为 0/1/0：fault 隐藏 queue 或错误声明 executor 时退出 1，诊断比较 offered/achieved rate、queue、p99，repair 恢复采集而不删等待样本。

## 为什么要学

什么时候用 open arrival rate，什么时候用 closed concurrency，如何发现 coordinated omission？ 初学者最容易把入口成功、平均延迟或一次短压测误写成系统能力。本页先给决策口径，再给可运行三阶段实验，最后要求 learner 用证据卡交付，而不是抄一个数字。

## 教学顺序

1. 用反例暴露假绿；2. 画出至少五节点架构；3. 解释来源定义与限制；4. 运行 baseline；5. 注入 把容量实验换成封闭负载并制造服务变慢；6. 保持阈值不变完成 repair；7. 对比摘要和一条 Trace；8. 把 Evidence / Inference / Unknown 写入工件。

## 专业提示词接口

Prompt v1.0.0 绑定 input-v1、output-schema-v1、eval-v1 和 mutation-v1。provider=none、model=NOT_RUN；实验的 fixture 通过不等于模型评审已运行。

## 常见错误

- 用 HTTP 2xx 替代任务业务终态。
- 用均值替代 p95/队列/重试/步骤。
- 为让 fault 变绿而删除 gate。
- 把 synthetic fixture 的吞吐写成生产容量。

## Runnable action

运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP04-lab.json --mode cycle`，确认 0/1/0；分别读取 offered rate、achieved rate、queue 和 p99，并由独立 task oracle 核对。

## Failure and repair

fault 让执行器与声明模型不一致或丢 queue 字段，诊断应指向调度器/采集器；repair 恢复模型声明与证据而不是删除排队样本。

命令 walkthrough：运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP04-lab.json --mode cycle`，实际结果为 0/1/0。分别读取 offered rate、achieved rate、queue 和 p99，并由独立 task Oracle 判断是否在截止时间内完成；隐藏 queue 的 fault 必须阻断。

## 完成条件

观察到 0/1/0；指出 fault 被哪些 gate 拒绝；解释 repair 改了什么且未删阈值；明确仍未知的生产环境变量。

## 页面专属迁移卡：把协调遗漏算进用户等待

冻结 `workload_hash`、目标到达率、计划到达时间和截止时间后，分别运行 open 与 closed。交付 offered-versus-achieved 对照卡：每个时间桶记录计划请求、实际发出、完成、队列深度和超时；若系统变慢时实际发出量下降，必须把遗漏样本标红，不能将下降后的速率当成承载力。closed 只回答固定并发下的局部表现，对外 SLO 要以 open 的截止时间分布为依据。
## Wave4 时间桶复盘

以 offered rate 60 task/min、deadline 10 秒、5 秒桶记录计划/实际/完成/队列/超时；计划 5 而实际仅 3 时，遗漏样本仍进入分母。迁移交付 offered-achieved 表、executor 资源曲线、queue timeline；provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 offered/achieved 时间桶、open/closed 对照、coordinated omission fault/repair 和 executor 资源排查；迁移保留 arrival clock 与 workload hash，真实容量、provider/model、integration、practitioner、learner、live、production 均 NOT_RUN。
