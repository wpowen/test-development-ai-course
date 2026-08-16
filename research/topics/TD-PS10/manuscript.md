# TD-PS10 · 限制重试放大并验证只读降级

## 限制重试放大并验证只读降级

模型 429 与退款工具超时叠加时，多层 retry 会放大队列、费用和副作用；一个最终成功响应不能证明链路安全。课程要求每层 deadline、预算和降级权限可追踪。

deadline 约束等待，jitter 减少同步重试，retry budget 限制调用放大，load shedding 与只读 fallback 保护不可逆写操作。 交付错误分类、调用放大计算、降级权限矩阵和恢复窗口证据。

四个 Oracle 分别是：

1. 端到端 deadline 不小于子调用但总链有界
2. call amplification 不超过预算
3. 过载拒绝不产生退款写操作
4. 恢复窗口队列与错误率回到基线

## 复制运行 TD-PS10 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/reliability-chaos-observability
python3 scripts/specialty_lab.py --manifest manifests/TD-PS10.json --mode cycle
```

TD-PS10 的 cycle 应严格记录 `0 → 1 → 0`；韧性 fault 若退出 0，要检查多层重试 Mutation 是否真正增加 call amplification，以及只读降级 Oracle 是否观察到退款写入。


进入材料目录后运行 TD-PS10 的 cycle 命令。韧性实验先锁定依赖图、总 deadline、retry budget 与退款副作用，再运行健康基线、429+工具超时 fault 和有界恢复。Repair 必须恢复 Retry-After、退避、调用预算与零写降级后 exit 0；每次 attempt、费用、队列和 cycle receipt 均需留档。

Prompt 包的任务是：读取依赖图、deadline、retry policy、队列和副作用规则，生成故障矩阵与降级断言；禁止建议无限重试或放宽写权限。本页 system 禁止无限重试与写权限回退，task 生成错误分类、预算和故障矩阵，critic 计算调用放大并拒绝静默 fallback。模型尚未运行，Eval 使用 Prompt/Input/Schema/Mutation 验证策略；真实模型接入需保存供应商错误、实际费用、原始输出与安全 owner 决定。

替换真实依赖时先重画 deadline 树、重试责任与只读能力，再保留 call amplification 和零副作用 Oracle；按单层超时、模型限流、组合过载逐步验证，不能复制课程重试次数。目标供应商 Retry-After、真实队列容量和业务降级文案 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS10 的假绿与恢复失败

本页的三类代表故障是：模型 429 与工具超时叠加；多层同时重试；恢复时流量洪峰。单次只注入 429、工具超时或队列过载，确认预算或副作用 Oracle 精确变红。若所有依赖同时失败先查 deadline fixture；Fault 绿说明重试未被计数，Repair 红则排查熔断半开、队列积压或幂等状态未复位。

AI 能整理故障矩阵和候选降级，却不能扩大退款工具权限、调整业务预算或批准生产实验。当前仅证明离线重试放大可检测，目标 Retry-After、真实队列容量和降级文案为 Unknown；结课交付需含 Prompt/Eval/Mutation、0/1/0 和恢复窗口证据。

TD-PS10 的 fixture-tested 验收要能逐 attempt 重算 deadline、调用次数、Token/费用和副作用预算，并证明只读 fallback 没有借恢复路径执行退款写操作。

## Wave5 证据边界

本页的 static Chaos Experiment Card、deadline/retry fixture 只证明超时预算、停止条件、降级和清理检查的设计可判定。provider/model、Kubernetes/依赖 integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN；恢复时间与 blast radius 不得写成实测结果。
