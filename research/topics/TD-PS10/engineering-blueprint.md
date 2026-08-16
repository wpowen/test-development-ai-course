# TD-PS10 Engineering Blueprint

## Architecture and data flow

控制问题：怎样证明每层 deadline 和 retry budget 有界，过载时安全拒绝或只读降级，恢复后不会产生洪峰与重复副作用？

数据流固定为：版本化输入 → 权威/范围检查 → 方法适配器 → 候选测试包 → 独立 Oracle → baseline/fault/repair runner → 证据报告 → 具名人工决策。deadline 传播控制等待，指数退避+jitter 降低同步重试，retry budget 限制放大，熔断和 load shedding 保护容量，只读 fallback 保护资金副作用。输入 fixture、Prompt manifest、输出 schema、eval、mutation、页级 lab manifest 和 owner 映射全部放在 reliability-chaos-observability 中；共享 runner 不含页面业务规则，只读取 TD-PS10 manifest。

| 层 | TD-PS10 的具体合同 | 失败语义 |
|---|---|---|
| 输入 | 订单助手依赖模型、检索和退款工具，局部超时可能触发多层重试与队列级联；记录版本、hash、数据分类和 owner | 缺关键输入为 BLOCKED |
| 方法 | deadline 传播控制等待，指数退避+jitter 降低同步重试，retry budget 限制放大，熔断和 load shedding 保护容量，只读 fallback 保护资金副作用 | 方法与风险不匹配时停止生成 |
| Oracle | 端到端 deadline 不小于子调用但总链有界；call amplification 不超过预算；过载拒绝不产生退款写操作；恢复窗口队列与错误率回到基线 | 任一 blocker 失败即 FAIL |
| Prompt | 读取依赖图、deadline、retry policy、队列和副作用规则，生成故障矩阵与降级断言；禁止建议无限重试或放宽写权限 | 无 source_ref 或新增规则即拒绝 |
| 证据 | 三阶段 JSON、失败规则、manifest 和边界 | 缺报告不能升级状态 |
| 决策 | content owner、oracle owner、release owner 分离 | AI 无放行权限 |

## Metrics and decisions

页级指标不是“生成多少用例”，而是 Oracle 覆盖、mutation 被杀死、负控可复现、失败定位到具体层、材料 hash 完整、Unknown 是否保留。阻断条件包括：端到端 deadline 不小于子调用但总链有界；call amplification 不超过预算；过载拒绝不产生退款写操作；恢复窗口队列与错误率回到基线。只有 runner 的 baseline=PASS、fault=FAIL、repair=PASS 才能证明离线门禁有检测力；它仍不能证明目标系统达标。

Prompt eval 检查五项：是否引用输入、是否区分 Evidence/Inference/Unknown、是否给出方法选择理由、是否绑定独立 Oracle、是否保留人工门禁。模型执行当前为 NOT_RUN，eval 文件只验证 Prompt 包结构和固定预期，不伪造模型质量。

## Baseline failure repair

Baseline：加载 TD-PS10 manifest 和固定 input fixture，四个 Oracle 全部 PASS，写出 baseline.json。Fault：只注入“模型 429 与工具超时叠加”，目标 Oracle 失败，runner 退出 1 并写 fault.json；其余 Oracle 保持稳定以支持单变量归因。Repair：移除故障，使用相同输入、manifest 与 Oracle 再跑，写 repair.json 并恢复 exit 0。cycle 命令复核 0/1/0，同时生成 cycle.json。

诊断不得直接调阈值：先核对 input/hash 与 owner，再核对方法层输入，接着查看目标 Oracle 和 fault id，最后由人工决定修复、回滚或保留 Unknown。目标供应商 Retry-After、真实队列容量和业务降级文案 始终保留在证据边界中。
