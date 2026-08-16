# TD-PS01 · 把 202、状态与退款账本接成一次取消证据

## 把 202、状态与退款账本接成一次取消证据

订单接口最容易制造的假绿，是客户端看见 202 后便提前宣布退款完成。这里必须沿 request、领域状态、退款账本和消费事件逐段取证，超时重放仍只能落下一笔退款。

分层取证的理由是协议成功与资金副作用可能分离；先用状态机限定合法转移，再用账本和 Trace 证明最终结果。 先提交取消请求证据图、四个 Oracle 与幂等重放 Manifest，再讨论是否能进入集成环境。

四个 Oracle 分别是：

1. 响应错误模型与状态码一致
2. 非法状态和非 owner 请求零副作用
3. 同一 Idempotency-Key 的退款计数增量最多一
4. request trace event ledger 可关联

## 复制运行 TD-PS01 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/api-ai-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS01.json --mode cycle
```

TD-PS01 的 cycle 应严格记录 `0 → 1 → 0`；取消接口的 fault 若仍退出 0，优先核对超时重放 Mutation 是否真的改变退款计数，以及账本 Oracle 是否读取了重放后的 ledger。


进入材料目录后运行 TD-PS01 的 cycle 命令。取消实验启动时先校验订单 owner、幂等键、OpenAPI、退款 Schema 与账本夹具，再依次观察 baseline、超时重放 fault 和幂等修复。Repair 必须恢复同一 Idempotency-Key 下的单笔退款规则并回到 exit 0；交付物是请求、账本、事件三份报告与 cycle receipt，聊天截图不构成资金副作用证据。

Prompt 包的任务是：从 OpenAPI、状态机和账本夹具生成带 source_ref 的四层 API 测试包；未知规则输出 UNKNOWN，冲突输出 BLOCKED。取消测试的 system 只允许引用 OpenAPI、状态机和账本，task 要求每条候选携带 request/event/ledger source_ref，critic 专门拒绝自造退款规则或自批 Oracle。模型调用仍为 NOT_RUN，Eval 只验证 Prompt/Input/Schema/Mutation 合同；接入真实模型时还要保存模型别名、采样参数、原始候选和人工取舍。

迁移时先把订单状态与退款 fixture 换成目标团队批准样本，同时保留幂等账本和零副作用 Oracle；随后在隔离支付沙箱重放客户端超时，确认 request_id、event_id 与 ledger entry 闭合后才接下一项依赖。目标支付网关幂等窗口、真实账本可查询性和业务延迟阈值 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS01 的假绿与恢复失败

本页的三类代表故障是：服务端提交后客户端超时；重复退款事件；非 owner 取消。只注入一次提交后超时，并检查失败是否落在退款计数 Oracle。若四层断言同时红，先修订单初态或 Manifest；若 Fault 绿，检查 mutation 未命中账本读取；若 Repair 仍红，排查幂等记录或事件消费残留。

AI 可从 OpenAPI 和 Trace 提议取消边界，却不能决定退款语义、放宽 owner 权限或批准上线。当前证据仅支持订单取消 fixture-tested 合同，真实网关幂等窗口、账本可查询性和业务延迟仍为 Unknown；结课交付必须包含四层 Oracle、Prompt/Eval/Mutation 版本、0/1/0 收据与沙箱迁移清单。

验收人应能从 TD-PS01 的退款计数失败回到同一幂等键、请求 Trace 和事件账本，并说明为什么单独一个 `202` 不能解除资金风险门禁。

## Wave5 证据边界

本页的 static OpenAPI/Pact 片段与离线取消、重放 fixture 只证明四层断言、幂等键和账本差异的判定结构。provider/model、真实 API/事件总线 integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN；不得把 fixture 结果写成目标退款链路可用。
