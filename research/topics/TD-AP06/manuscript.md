# TD-AP06 页面稿：超时、重试与安全降级

## Professional problem — AP06 预算与降级 method

跨层重试会放大流量、重复写副作用并掩盖 deadline；Agent 稳定性需要统一预算和明确的安全终态。

本页采用 **deadline propagation + retry-budget state machine** method：从 gateway 传递 deadline 和 attempt budget，并按 read-only、人工升级、对账和安全失败定义终态。选择它的理由是跨层独立重试会形成 retry storm，写操作还可能重复副作用。独立 Oracle 检查 attempts、幂等键和副作用类别，不把最终文本当作写成功证据。

精确命令是 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP06-lab.json --mode cycle`（cwd=`courses/td-ai-010-agent-load-stability/lab`）。实际结果为 0/1/0：fault 造成 retry storm 或 unsafe write 时退出 1，诊断按 gateway/SDK/Agent/tool 层定位预算传播，repair 限制 attempts 并进入安全终态。

## 为什么要学

如何设置总超时与重试预算，避免多层重试风暴，并在压力下安全降级？ 初学者最容易把入口成功、平均延迟或一次短压测误写成系统能力。本页先给决策口径，再给可运行三阶段实验，最后要求 learner 用证据卡交付，而不是抄一个数字。

## 教学顺序

1. 用反例暴露假绿；2. 画出至少五节点架构；3. 解释来源定义与限制；4. 运行 baseline；5. 注入 提高失败率并允许 3–5 次重试，移除压力降级；6. 保持阈值不变完成 repair；7. 对比摘要和一条 Trace；8. 把 Evidence / Inference / Unknown 写入工件。

## 专业提示词接口

Prompt v1.0.0 绑定 input-v1、output-schema-v1、eval-v1 和 mutation-v1。provider=none、model=NOT_RUN；实验的 fixture 通过不等于模型评审已运行。

## 常见错误

- 用 HTTP 2xx 替代任务业务终态。
- 用均值替代 p95/队列/重试/步骤。
- 为让 fault 变绿而删除 gate。
- 把 synthetic fixture 的吞吐写成生产容量。

## Runnable action

运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP06-lab.json --mode cycle`，核对 0/1/0；独立 oracle 检查 attempt budget、deadline 消耗和写操作幂等证据。

## Failure and repair

fault 制造 retry storm 或 unsafe write，诊断定位 gateway/SDK/Agent/tool 的预算传播；repair 限制 attempts 并进入只读/人工/对账终态。

命令 walkthrough：运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP06-lab.json --mode cycle`，实际结果为 0/1/0。先从 traces.jsonl 统计 attempts 与 deadline 消耗，再由独立 Oracle 检查幂等键和副作用类别；重试风暴不能被最后一句成功文本抵消。

## 完成条件

观察到 0/1/0；指出 fault 被哪些 gate 拒绝；解释 repair 改了什么且未删阈值；明确仍未知的生产环境变量。

## 页面专属迁移卡：任务级预算保护副作用

把 gateway、SDK、Agent、tool 的超时和重试配置抄成任务级预算表，计算最坏调用次数和总时长，再检查是否小于总 deadline。对每个可写工具标出幂等键、允许重试次数、超预算终态和账本复核动作；压力 fault 下只读、转人工或明确拒绝可以是合法终态，但重复扣款、重复退款和无审计写入必须阻断。
## Wave4 重试计算

总 deadline 30 秒、gateway/SDK/Agent/tool 次数 2×2×3×2=24；每次工具 2 秒则最坏 48 秒，必须削减预算或降级，不能延长外层 timeout。交付 attempt ledger、deadline timeline、幂等键和对账 receipt；fixture-only，真实 provider/model、integration、practitioner review、learner observation、live、production 均 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增 2×2×3×2 重试预算、deadline、幂等账本、未知写结果对账和降级 fault/repair；迁移需重做可写工具和错误码，真实 provider/model、integration、practitioner、learner、live、production 均 NOT_RUN。
