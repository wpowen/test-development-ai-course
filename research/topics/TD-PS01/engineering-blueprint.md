# TD-PS01 Engineering Blueprint

## Architecture and data flow

控制问题：怎样证明 202 响应、订单状态、退款账本和事件消费属于同一次合法取消，而不是只证明 HTTP 成功？

数据流固定为：版本化输入 → 权威/范围检查 → 方法适配器 → 候选测试包 → 独立 Oracle → baseline/fault/repair runner → 证据报告 → 具名人工决策。分层使用 HTTP 语义、OpenAPI Schema、领域状态机、副作用账本和 Trace；因为任一单层都无法证明异步资金结果。输入 fixture、Prompt manifest、输出 schema、eval、mutation、页级 lab manifest 和 owner 映射全部放在 api-ai-automation 中；共享 runner 不含页面业务规则，只读取 TD-PS01 manifest。

| 层 | TD-PS01 的具体合同 | 失败语义 |
|---|---|---|
| 输入 | 已支付未发货订单取消后异步退款，客户端超时重试不能生成第二笔退款；记录版本、hash、数据分类和 owner | 缺关键输入为 BLOCKED |
| 方法 | 分层使用 HTTP 语义、OpenAPI Schema、领域状态机、副作用账本和 Trace；因为任一单层都无法证明异步资金结果 | 方法与风险不匹配时停止生成 |
| Oracle | 响应错误模型与状态码一致；非法状态和非 owner 请求零副作用；同一 Idempotency-Key 的退款计数增量最多一；request trace event ledger 可关联 | 任一 blocker 失败即 FAIL |
| Prompt | 从 OpenAPI、状态机和账本夹具生成带 source_ref 的四层 API 测试包；未知规则输出 UNKNOWN，冲突输出 BLOCKED | 无 source_ref 或新增规则即拒绝 |
| 证据 | 三阶段 JSON、失败规则、manifest 和边界 | 缺报告不能升级状态 |
| 决策 | content owner、oracle owner、release owner 分离 | AI 无放行权限 |

## Metrics and decisions

页级指标不是“生成多少用例”，而是 Oracle 覆盖、mutation 被杀死、负控可复现、失败定位到具体层、材料 hash 完整、Unknown 是否保留。阻断条件包括：响应错误模型与状态码一致；非法状态和非 owner 请求零副作用；同一 Idempotency-Key 的退款计数增量最多一；request trace event ledger 可关联。只有 runner 的 baseline=PASS、fault=FAIL、repair=PASS 才能证明离线门禁有检测力；它仍不能证明目标系统达标。

Prompt eval 检查五项：是否引用输入、是否区分 Evidence/Inference/Unknown、是否给出方法选择理由、是否绑定独立 Oracle、是否保留人工门禁。模型执行当前为 NOT_RUN，eval 文件只验证 Prompt 包结构和固定预期，不伪造模型质量。

## Baseline failure repair

Baseline：加载 TD-PS01 manifest 和固定 input fixture，四个 Oracle 全部 PASS，写出 baseline.json。Fault：只注入“服务端提交后客户端超时”，目标 Oracle 失败，runner 退出 1 并写 fault.json；其余 Oracle 保持稳定以支持单变量归因。Repair：移除故障，使用相同输入、manifest 与 Oracle 再跑，写 repair.json 并恢复 exit 0。cycle 命令复核 0/1/0，同时生成 cycle.json。

诊断不得直接调阈值：先核对 input/hash 与 owner，再核对方法层输入，接着查看目标 Oracle 和 fault id，最后由人工决定修复、回滚或保留 Unknown。目标支付网关幂等窗口、真实账本可查询性和业务延迟阈值 始终保留在证据边界中。
