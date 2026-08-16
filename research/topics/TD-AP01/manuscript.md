# TD-AP01 页面稿：工作负载模型与任务口径

## Professional problem — AP01 工作负载建模 method

性能工程师判断的是一项 Agent 任务是否在正确业务终态结束，而不是是否返回入口 2xx。丢步骤、误用工具或无限重试都会造成业务风险。

本页采用 **workload modeling + task-oracle decomposition** method：先按 task_type、tool path、terminal state 和风险切片建联合分布，再把每个任务映射到可回放输入。选择这个方法的理由是入口请求的分母无法表达“任务完成但工具路径错误”的风险。独立 Oracle 只读取 profile 的允许终态、任务输入和风险规则，不读取 evaluator 的预测结论。

精确命令是 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP01-lab.json --mode cycle`（cwd=`courses/td-ai-010-agent-load-stability/lab`）。实际 fixture 结果为 baseline exit 0 / fault exit 1 / repair exit 0。诊断 fault 时先查缺失的 task slice 和 terminal-state scorer，再查 trace 中的 tool path；repair 恢复数据切片和业务 Oracle，不能通过删除检查得到 0。

## 为什么要学

如何把真实 Agent 任务、路径、输入和业务终态转成可回放工作负载，而不是重复一个 HTTP 请求？ 初学者最容易把入口成功、平均延迟或一次短压测误写成系统能力。本页先给决策口径，再给可运行三阶段实验，最后要求 learner 用证据卡交付，而不是抄一个数字。

## 教学顺序

1. 用反例暴露假绿；2. 画出至少五节点架构；3. 解释来源定义与限制；4. 运行 baseline；5. 注入 删去一半任务切片并只保留入口 2xx Oracle；6. 保持阈值不变完成 repair；7. 对比摘要和一条 Trace；8. 把 Evidence / Inference / Unknown 写入工件。

## 专业提示词接口

Prompt v1.0.0 绑定 input-v1、output-schema-v1、eval-v1 和 mutation-v1。provider=none、model=NOT_RUN；实验的 fixture 通过不等于模型评审已运行。

## 常见错误

- 用 HTTP 2xx 替代任务业务终态。
- 用均值替代 p95/队列/重试/步骤。
- 为让 fault 变绿而删除 gate。
- 把 synthetic fixture 的吞吐写成生产容量。

## Runnable action

在显式 lab cwd 执行 TD-AP01 baseline、fault、repair，保存命令、退出码、summary、trace 与配置 hash；对一条红灯任务下钻到 task-rooted trace。

## Failure and repair

故障阶段删去任务切片并只保留入口 2xx oracle；修复必须补回业务终态和完整切片，不能通过删除检查或放宽阈值得到绿灯。

命令 walkthrough：在 `courses/td-ai-010-agent-load-stability/lab` 运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP01-lab.json --mode cycle`，实际结果按顺序为 baseline exit 0、fault exit 1、repair exit 0。诊断先看 fault summary，再下钻 traces.jsonl 的 task_id、tool path 与 terminal state；独立 Oracle 用 profile 的 allowed terminal state 判定，不使用脚本自己的 verdict。

## 完成条件

观察到 0/1/0；指出 fault 被哪些 gate 拒绝；解释 repair 改了什么且未删阈值；明确仍未知的生产环境变量。

## Wave3 worked example and transfer artifact

将客服 Agent 的一小时流量拆成退款、订单查询和转人工三类切片。退款包含检索与写工具，查询只有检索，转人工是合法终态；每类记录输入长度、工具路径、允许终态、业务 Oracle 与比例。交付 `workload-v2.json`、切片比例表和 Oracle 卡；迁移到新业务先替换终态与副作用，再重算分母。真实 provider/model、企业集成、practitioner review、learner observation、live 与 production 仍为 NOT_RUN。
## Wave4 计算与转移

200 条样本按退款 80、查询 90、转人工 30 固定分母；先排除无 Oracle 样本并记录 `excluded_reason`，再以 task_type、input_tokens、tool_hops 和终态分桶，输出 `sample-ledger.json`、`workload-v2.json` 与 decision record。迁移时重做合法终态和副作用规则，不复制比例；fixture-only，真实 provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 200 条样本的分母、业务切片、Oracle、profile hash、fault/repair 与交接验收；迁移需重做终态、副作用和采样窗口，真实业务流量、provider/model、integration、practitioner、learner、live、production 均 NOT_RUN。
