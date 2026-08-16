# AI Serving 瓶颈：Queue、GPU、KV Cache 与阶段诊断

## 用单变量实验区分 Queue、GPU 与 KV Cache

对高 TTFT 请求降低到达率，比较 queue 占比变化并反驳只看 GPU 利用率的归因。阶段 Trace 先定位 queue/prefill/decode，再把 GPU、KV 和工具 span 当支持或反证；相关性只有经过单变量翻转才可升级。

方法选择是：先按 TTFT/TPOT 症状分流，再把同一 request 的 queue、prefill、decode、GPU memory、KV eviction 和工具 span 对齐，最后用“降低到达率但保持请求形状”的单变量实验确认或推翻候选根因。独立 Oracle 为：高 TTFT 且 queue 占主要比例才指向排队；TPOT 高必须同时观察 decode/GPU 饱和；KV 高必须伴随 eviction/preemption 或对照实验；托管内部指标不可见时保持 UNKNOWN。这使学员能把一个用户投诉映射到可观察阶段，而不是只复制命令。学员最终交付瓶颈诊断树、Trace 对照、反证与单变量实验记录，并在工件中区分 desk-researched、fixture-tested、live-tested、practitioner-reviewed 与 production-validated。

### 对高 TTFT 请求降低到达率，比较 queue 占比变化并反驳只看 GPU 利用率的归因

先读取 page manifest 与批准输入；baseline 只验证本页 Oracle。随后注入：忽略 queue_time，仅因 GPU 利用率同步升高便把 root_cause 标为 gpu。门禁必须退出 1 并保存 expected/actual；repair 执行：恢复阶段占比判断，并用降低到达率的单变量结果确认 queue 根因。重放时 Oracle、Prompt/Input/Schema/Eval/Mutation 版本均不得漂移。

### 为什么采用这条 Oracle 链

阶段 Trace 先定位 queue/prefill/decode，再把 GPU、KV 和工具 span 当支持或反证；相关性只有经过单变量翻转才可升级。 受保护链条包括：慢请求 Trace、queue/prefill/decode 分解、GPU/KV 信号、支持与反证、单变量结果。

## 复制运行 TD-A05 的 0 → 1 → 0

```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-serving-career
python3 scripts/serving_lab.py --manifest manifests/TD-A05.json --mode baseline
python3 scripts/serving_lab.py --manifest manifests/TD-A05.json --mode fault
python3 scripts/serving_lab.py --manifest manifests/TD-A05.json --mode repair
python3 scripts/serving_lab.py --manifest manifests/TD-A05.json --mode cycle
```

预期内部结果为 `0 -> 1 -> 0`。打开 `evidence/TD-A05/` 下四份 JSON，核对 input hash、manifest hash、实际检查和 evidence level。先预测哪一个字段会变红，再运行；如果 fault 仍绿，立即判为测试资产无检测力。

## TD-A05 失败诊断与修复边界

失败：忽略 queue_time，仅因 GPU 利用率同步升高便把 root_cause 标为 gpu。 修复：恢复阶段占比判断，并用降低到达率的单变量结果确认 queue 根因。 若 baseline 阶段和总时长对不上先修 Trace；若 fault 把 GPU 相关性写成根因仍绿，cause gate 缺少对照实验；不可见 profiler 指标保持 UNKNOWN。

本页的 Remaining Unknown 是：托管服务内部队列、GPU profiler 和真实 KV cache eviction 不可见。本页只验证 TD-A05 的离线 mutation 能被门禁拒绝；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。模型、供应商、GPU、队列、集成环境、实践者复核、学习者完成、线上服务和生产系统均未运行；真实环境还必须取得 trace/profiler、流量切片和 owner 审批，不能把诊断树当成真实根因证据。

### Worked example、迁移条件与可复用工件

一批长上下文请求 TTFT 上升，但 TPOT 稳定，GPU 利用率也同步升高。学习者先把 queue_time、prefill_time、decode_time、KV eviction、batch_size 和工具 span 放到同一 Trace，再降低到达率而不改变请求形状；若 TTFT 随 queue 占比下降，才可把排队升级为候选根因。

真实服务通常看不到托管队列和 KV profiler，因此每个结论要区分直接证据、支持证据和反证。改变并发、Prompt 长度或 batch 时只能选一个变量，并保留前后 trace、资源快照、质量结果和回滚动作；没有对照实验，Dashboard 的相关性只能写 UNKNOWN。

交付症状分流表、慢请求 Trace 对照、候选根因账本和单变量实验记录。新人拿到一条“服务慢”告警时，按 TTFT/TPOT、queue、prefill/decode、GPU/KV、下游工具顺序填写下一检查与修复动作，而不是直接申请扩容。
