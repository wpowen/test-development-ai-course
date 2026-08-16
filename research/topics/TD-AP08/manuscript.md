# TD-AP08 页面稿：SLO、告警与事故证据

## Professional problem — AP08 SLO 闭环 method

SLO 必须围绕 good task 而非平均延迟；没有 owner、止血动作和事故回流，burn-rate 只是一个漂亮数字。

本页采用 **good-task SLI + multi-window burn-rate incident loop** method：冻结 eligible task 分母，计算窗口 SLI，再绑定 burn-rate、owner、止血、恢复和事故样例。选择它的理由是平均延迟无法表达任务正确性和副作用风险。独立 Oracle 从原始任务事件重算 numerator/denominator，不使用告警组件自己的 verdict。

精确命令是 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP08-lab.json --mode cycle`（cwd=`courses/td-ai-010-agent-load-stability/lab`）。实际结果为 0/1/0：fault 删除 good-task 或 owner/action 证据时退出 1，诊断定位 SLI/路由，repair 恢复告警与事故闭环而不降低阈值。

## 为什么要学

如何把任务正确性、时延、成本和副作用安全写成 SLI，并连接 burn-rate 告警与事故 Runbook？ 初学者最容易把入口成功、平均延迟或一次短压测误写成系统能力。本页先给决策口径，再给可运行三阶段实验，最后要求 learner 用证据卡交付，而不是抄一个数字。

## 教学顺序

1. 用反例暴露假绿；2. 画出至少五节点架构；3. 解释来源定义与限制；4. 运行 baseline；5. 注入 降低 good-task rate，并移除告警动作和事故证据；6. 保持阈值不变完成 repair；7. 对比摘要和一条 Trace；8. 把 Evidence / Inference / Unknown 写入工件。

## 专业提示词接口

Prompt v1.0.0 绑定 input-v1、output-schema-v1、eval-v1 和 mutation-v1。provider=none、model=NOT_RUN；实验的 fixture 通过不等于模型评审已运行。

## 常见错误

- 用 HTTP 2xx 替代任务业务终态。
- 用均值替代 p95/队列/重试/步骤。
- 为让 fault 变绿而删除 gate。
- 把 synthetic fixture 的吞吐写成生产容量。

## Runnable action

运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP08-lab.json --mode cycle`，核对 0/1/0；独立 oracle 检查 numerator/denominator、窗口、owner 和恢复证据。

## Failure and repair

fault 删除 good-task 证据或 owner/action 字段，诊断定位 SLI/路由；repair 恢复多窗口告警和事故闭环，不降低阈值。

命令 walkthrough：运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP08-lab.json --mode cycle`，实际结果为 0/1/0。由原始任务事件重算 good-task SLI，核对窗口、burn-rate、owner、止血与恢复，再由独立 Oracle 检查事故样例是否回流；缺 owner 的告警必须阻断。

## 完成条件

观察到 0/1/0；指出 fault 被哪些 gate 拒绝；解释 repair 改了什么且未删阈值；明确仍未知的生产环境变量。

## Wave3 worked example and transfer artifact

为订单 Agent 定义 good task：终态正确、端到端 p95 不超预算、成本不超上限且没有未授权副作用；再用短窗与长窗 burn-rate 绑定止血、降级、回滚和复盘。交付 SLO 卡、错误预算表、告警规则、owner 路径和回归样例。真实 provider/model、企业集成、practitioner review、learner observation、live 与 production SLO 仍为 NOT_RUN。
## Wave4 告警动作

订单 Agent 的 good-task 同时要求终态正确、p95≤10 秒、cost/success 在预算内且非法副作用为零；短窗/长窗 burn-rate 分别绑定止血、降级、回滚和 owner。交付 SLO 卡、错误预算、owner matrix 与回归样例；live/production 验证仍 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 good-task、p95、cost/success、副作用、burn-rate、owner、降级、回滚和 regression 事故练习；迁移重做合法终态与成本，真实 provider/model、integration、practitioner、learner、live、production 均 NOT_RUN。
