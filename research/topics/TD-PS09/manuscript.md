# TD-PS09 · 用开放负载与 Goodput 找容量拐点

## 用开放负载与 Goodput 找容量拐点

客服 Agent 在长退款对话下可能排队、工具 fan-out 并增加 token 成本；封闭并发会在系统变慢时自动降速，从而隐去真实到达和丢弃请求。

open-loop 保持外部压力，分阶段 Trace 拆开 queue/model/tool，Goodput 再把质量、安全和延迟同时纳入容量。 交付 workload hash、到达守恒、风险切片分位数和含失败成本的 fixture 容量报告。

四个 Oracle 分别是：

1. 到达率与 dropped iterations 可核对
2. 每任务阶段时间相加可解释 E2E
3. 只有质量安全延迟同时合格进入 Goodput
4. 失败重试和工具调用计入 cost_per_success

## 复制运行 TD-PS09 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/api-ai-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS09.json --mode cycle
```

TD-PS09 的 cycle 应严格记录 `0 → 1 → 0`；容量 fault 若仍为绿，应确认 dropped arrivals Mutation 是否进入到达守恒与 Goodput 分母，而不是只读取已完成请求。


进入材料目录后运行 TD-PS09 的 cycle 命令。性能实验先固定短问答、长退款、工具调用的 Token 分布与开放到达率，再运行基准、隐藏 dropped 的 fault 和完整分母修复。Repair 必须恢复 queue/TTFT/TPOT/Goodput/cost 的可重算关系并 exit 0；负载 Manifest、原始事件、分位数和 cycle receipt 一并保存。

Prompt 包的任务是：从 workload、任务切片、SLO 和成本模型生成 open/closed 场景、阶段指标和容量判定；禁止发明通用阈值或忽略失败成本。容量页 system 禁止发明通用 SLO 或忽略失败成本，task 生成 open/closed 场景和切片指标，critic 检查 coordinated omission 与平均值掩盖。模型是 NOT_RUN，Eval 固定 Prompt/Input/Schema/Mutation；真实接入还需记录模型、硬件、缓存、价格与原始响应质量。

目标 serving 迁移先替换流量切片、Token 分布、质量门槛和成本表，同时保留到达守恒 Oracle；先验证负载发生器自身能力，再逐级加压找真实 SLO 拐点。目标模型硬件、provider 内部队列、真实流量分布和价格 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS09 的假绿与恢复失败

本页的三类代表故障是：工具 fan-out 翻倍；队列饱和并丢迭代；重试掩盖失败并放大成本。每级只改到达率，fault 只隐藏 dropped 项，观察守恒与 Goodput。若所有指标同时异常先查虚拟时钟和 workload hash；Fault 绿说明分母残缺，Repair 红则排查排队项、质量判定或成本事件未恢复。

AI 可建议工作负载和聚类慢请求，但不能制定生产容量、删掉失败成本或批准扩容。现有数据只说明合成到达账本可检测遗漏，模型硬件、provider 队列、真实流量与价格均为 Unknown；交付包括 Prompt/Eval/Mutation、0/1/0 和 fixture-only 容量声明。

TD-PS09 的 fixture-tested 报告还要解释每个风险 slice 的 planned、dropped、queued 与 completed 如何守恒，并说明质量失败与重试费用为何不能从 Goodput/cost 分母消失。

## Wave5 证据边界

本页的 static workload 表、指标公式和离线到达账本 fixture 只证明 TTFT/TPOT、Goodput 分母及成本守恒的计算方法。provider/model、目标硬件与供应商 integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN；容量、阈值和价格必须另行实测。
