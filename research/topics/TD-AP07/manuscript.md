# TD-AP07 页面稿：长稳、资源漂移与泄漏

## Professional problem — AP07 长稳判定 method

短压测绿灯不能证明长稳；资源斜率、清理差分、尾延迟和恢复窗口才揭示泄漏与退化。

本页采用 **windowed soak + snapshot-diff diagnosis** method：分 warmup、steady、recovery 三窗，比较资源斜率、cleanup 前后差分、p99 和错误重试。选择它的理由是缓存热身、有界增长和泄漏只有在时间窗口与恢复动作中才能区分。独立 Oracle 检查窗口完整性、资源斜率和固定 gate。

精确命令是 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP07-lab.json --mode cycle`（cwd=`courses/td-ai-010-agent-load-stability/lab`）。实际结果为 0/1/0：fault 注入单调资源增长或缺 recovery 时退出 1，诊断落到 cleanup/窗口编排，repair 关闭资源并重跑完整窗口。

## 为什么要学

如何用 soak test 区分缓存热身、有界增长和真正的资源泄漏？ 初学者最容易把入口成功、平均延迟或一次短压测误写成系统能力。本页先给决策口径，再给可运行三阶段实验，最后要求 learner 用证据卡交付，而不是抄一个数字。

## 教学顺序

1. 用反例暴露假绿；2. 画出至少五节点架构；3. 解释来源定义与限制；4. 运行 baseline；5. 注入 注入每任务 0.8MB 单调增长并制造清理失败；6. 保持阈值不变完成 repair；7. 对比摘要和一条 Trace；8. 把 Evidence / Inference / Unknown 写入工件。

## 专业提示词接口

Prompt v1.0.0 绑定 input-v1、output-schema-v1、eval-v1 和 mutation-v1。provider=none、model=NOT_RUN；实验的 fixture 通过不等于模型评审已运行。

## 常见错误

- 用 HTTP 2xx 替代任务业务终态。
- 用均值替代 p95/队列/重试/步骤。
- 为让 fault 变绿而删除 gate。
- 把 synthetic fixture 的吞吐写成生产容量。

## Runnable action

运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP07-lab.json --mode cycle`，核对 0/1/0；独立 oracle 复核 warmup/steady/recovery 的资源快照和 p99。

## Failure and repair

fault 注入资源增长或删除 recovery，诊断应落到 cleanup/窗口编排；repair 关闭资源并保留完整窗口，不改变门禁。

命令 walkthrough：运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP07-lab.json --mode cycle`，实际结果为 0/1/0。按 warmup、steady、recovery 分窗查看资源斜率、snapshot diff 和 p99，再由独立 Oracle 检查窗口完整性；短跑平均值不能成为长稳结论。

## 诊断 walkthrough

学员先定位资源增长发生在哪个窗口，再对比 cleanup 前后快照和 p99；独立 Oracle 只依据窗口完整性、资源斜率和固定 gate 判定。若 fault 缺 recovery，任何只引用 warmup/steady 的报告都不得通过。

## 完成条件

观察到 0/1/0；指出 fault 被哪些 gate 拒绝；解释 repair 改了什么且未删阈值；明确仍未知的生产环境变量。

## Wave3 worked example and transfer artifact

固定 workload 运行八小时，记录内存、连接、句柄、临时文件、尾延迟和 cleanup 成功率。交付三条趋势线、首中尾快照和对象增长排序；平台期可能是有界缓存，持续正斜率才是泄漏候选。迁移到新运行时需说明 GC、缓存和连接池差异；真实 provider/model、企业集成、practitioner review、learner observation、live 与 production 长稳仍为 NOT_RUN。
## Wave4 长稳停止条件

固定版本和 70% SLO 拐点负载运行八小时，首中尾比较内存对象、连接、句柄、临时文件和 cleanup receipt；持续正斜率才是泄漏候选，中途部署或重启则整轮作废。交付趋势图、快照差分和停止记录，production soak 仍 NOT_RUN。
## Wave5 页面裁决与迁移记录

页面新增八小时固定版本 soak、首中尾快照、慢变量趋势、cleanup/资源 fault/repair 与停止条件；迁移重做运行时阈值，真实长稳、provider/model、integration、practitioner、learner、live、production 均 NOT_RUN。
