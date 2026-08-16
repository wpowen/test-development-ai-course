# TD-AP05 页面稿：容量曲线与瓶颈归因

## Professional problem — AP05 容量归因 method

容量不是“最大并发”一个数字，而是逐级加压时第一个门禁失败的位置及其可解释瓶颈。没有控制变量就不能归因。

本页采用 **step-load experiment + first-failing-gate attribution** method：固定步长、输入和阈值，只改变负载水平，再按 queue、prefill、decode、tool、retry 切片归因。选择它的理由是没有控制变量的容量曲线无法解释失败来源。独立 Oracle 依据冻结 gate 和风险分母重算首个失效级别，不接受“最大并发”替代证据。

精确命令是 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP05-lab.json --mode cycle`（cwd=`courses/td-ai-010-agent-load-stability/lab`）。实际结果为 0/1/0：fault 隐藏 bottleneck label 或改步长时退出 1，诊断回到实验设计和第一失效点，repair 恢复固定阈值与归因字段。

## 为什么要学

如何从阶梯负载找到 SLO 首次失效点，并用 queue、prefill、decode、tool 信号定位瓶颈？ 初学者最容易把入口成功、平均延迟或一次短压测误写成系统能力。本页先给决策口径，再给可运行三阶段实验，最后要求 learner 用证据卡交付，而不是抄一个数字。

## 教学顺序

1. 用反例暴露假绿；2. 画出至少五节点架构；3. 解释来源定义与限制；4. 运行 baseline；5. 注入 压低 worker、加快到达并隐藏 bottleneck 标签；6. 保持阈值不变完成 repair；7. 对比摘要和一条 Trace；8. 把 Evidence / Inference / Unknown 写入工件。

## 专业提示词接口

Prompt v1.0.0 绑定 input-v1、output-schema-v1、eval-v1 和 mutation-v1。provider=none、model=NOT_RUN；实验的 fixture 通过不等于模型评审已运行。

## 常见错误

- 用 HTTP 2xx 替代任务业务终态。
- 用均值替代 p95/队列/重试/步骤。
- 为让 fault 变绿而删除 gate。
- 把 synthetic fixture 的吞吐写成生产容量。

## Runnable action

运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP05-lab.json --mode cycle`，读取 baseline=0、fault=1、repair=0；独立 oracle 复查第一失效级别和 goodput 曲线。

## Failure and repair

fault 隐藏第一失效点或改步长，诊断应回到 gate 和实验设计；repair 恢复固定阈值及 queue/prefill/decode/tool/retry 归因。

命令 walkthrough：运行 `python3 scripts/agent_performance_lab.py --manifest manifests/TD-AP05-lab.json --mode cycle`，实际结果为 0/1/0。对阶梯曲线标出首个失败级别，查看 queue/prefill/decode/tool/retry 的受控切片，并用独立 Oracle 重算 goodput；不允许用最大并发替代容量解释。

## 完成条件

观察到 0/1/0；指出 fault 被哪些 gate 拒绝；解释 repair 改了什么且未删阈值；明确仍未知的生产环境变量。

## 页面专属迁移卡：容量卡与瓶颈归因

容量卡必须写 `workload_hash`、模型/服务版本、SLO、台阶稳定时长和首个失败门禁。最大吞吐不是容量；先标出第一个违反 SLO 的台阶，再用 queue、prefill、decode、tool、retry 五个信号排除候选。每次只改一层并复测，交付一张说明适用条件、失败原因和单变量变更的瓶颈证据卡。
## Wave4 阶梯判定

固定 SLO=p95≤8 秒按 20/40/60/80 task/min 加压；示例 60 级 goodput 55、p95 7.8 秒，80 级 goodput 62、p95 11 秒，容量取首个硬门禁失败前的 60。交付阶梯曲线、首失败表和 UNKNOWN 清单，禁止把 fixture 数字写入生产门禁。
## Wave5 页面裁决与迁移记录

页面新增 20/40/60/80 阶梯、SLO 首失败、goodput/p95 计算、单变量瓶颈和容量卡；迁移重做 workload、SLO、硬件与成本，production capacity、provider/model、integration、practitioner、learner、live 均 NOT_RUN。
