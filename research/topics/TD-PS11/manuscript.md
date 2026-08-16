# TD-PS11 · 先证明 Trace 完整，再做混沌归因

## 先证明 Trace 完整，再做混沌归因

质量下降可能来自索引、模型、工具或队列，也可能只是 collector 丢 span；没有完整 telemetry 时，任何流畅的根因解释都只能是候选。

先用 trace completeness 验证观测能力，再用带授权和 blast radius 的单变量实验把 fault window 与同一风险切片关联。 交付脱敏 Trace 合同、实验卡、停止回滚收据与明确保留 UNKNOWN 的反证。

四个 Oracle 分别是：

1. task trace 覆盖 gateway retrieval model tool 和 terminal
2. 敏感输入不进入默认 telemetry
3. fault start/end 与异常窗口可关联
4. 停止回滚后同一切片恢复且无残留

## 复制运行 TD-PS11 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/reliability-chaos-observability
python3 scripts/specialty_lab.py --manifest manifests/TD-PS11.json --mode cycle
```

TD-PS11 的 cycle 应严格记录 `0 → 1 → 0`；混沌 fault 若没有打红，应检查 collector 丢 span 的 Mutation 是否降低 trace completeness，并确认 Cause Gate 未用相关性补齐缺口。


进入材料目录后运行 TD-PS11 的 cycle 命令。可观测性实验先固定 span schema、采样、脱敏和实验授权，再执行完整 Trace、collector 缺口 fault 与链路恢复。Repair 必须让 gateway/retrieval/model/tool/terminal 重新闭合且 exit 0；fault event、风险切片、停止回滚和 cycle receipt 必须同 trace_id 关联。

Prompt 包的任务是：读取 Trace schema、脱敏策略、实验授权和 SLO，输出单变量实验卡、观测字段、停止条件与复验；生产 selector 缺失时必须 BLOCKED。混沌页 system 限定授权、blast radius 与敏感字段，task 生成单变量实验卡和观测候选，critic 拒绝在 span 缺失时宣布根因。模型保持 NOT_RUN，Eval 检查 Prompt/Input/Schema/Mutation；真实接入还要保存 collector、采样策略、原始假设和 on-call 审批。

进入目标集群前先替换 Trace schema、生产 selector、SLO 和 rollback owner，再保留 completeness 与恢复 Oracle；先在隔离范围证明观测无缺口，之后才允许单变量故障注入。目标 collector 采样、生产权限、托管模型内部 span 和真实恢复时间 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS11 的假绿与恢复失败

本页的三类代表故障是：collector 丢 span；检索网络延迟；非关键 Pod kill。一次只丢一个关键 span 或注入一个授权 fault，观察 completeness 与恢复切片。若全链同时红先查 collector 配置；Fault 绿代表 Cause Gate 绕过缺证据，Repair 红则排查采样缓存、实验 flag 或队列残留。

AI 可聚类 Trace 和提出候选实验，却不能授权混沌、处理原始 PII 或在缺 span 时确认根因。当前证据只覆盖离线 telemetry fixture，目标采样、生产权限、托管内部 span 与恢复时间均 Unknown；完成物含 Prompt/Eval/Mutation、0/1/0、实验卡和回滚收据。

TD-PS11 的 fixture-tested 结论要求 fault event、gateway/retrieval/model/tool/terminal spans 和同一风险切片的恢复结果闭合；collector 缺口本身必须作为阻断证据保存。

## 页面专属诊断卡：先证据完整，再谈质量下降

用户先发现质量问题时，按质量采样、Trace root/tool/terminal 覆盖、Judge 与检索版本、task token/attempt 对账、脱敏字段扫描、UNKNOWN 清单顺序排查。每一步都写症状、怀疑层、下一项检查和复验动作；不能因 Judge 稳定或 dashboard 无红灯就推断业务正确。
