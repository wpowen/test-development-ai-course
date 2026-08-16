# TD-PS09 Engineering Blueprint

## Architecture and data flow

控制问题：怎样在不发生 coordinated omission 的前提下测量队列、TTFT、TPOT、E2E、任务质量与成本，并给出容量而非单次速度？

数据流固定为：版本化输入 → 权威/范围检查 → 方法适配器 → 候选测试包 → 独立 Oracle → baseline/fault/repair runner → 证据报告 → 具名人工决策。open-loop arrival 保持外部到达，closed-loop 诊断单用户上限，分阶段 Trace 定位 queue/model/tool，风险切片阻止均值掩盖，Goodput 将质量安全纳入容量。输入 fixture、Prompt manifest、输出 schema、eval、mutation、页级 lab manifest 和 owner 映射全部放在 api-ai-automation 中；共享 runner 不含页面业务规则，只读取 TD-PS09 manifest。

| 层 | TD-PS09 的具体合同 | 失败语义 |
|---|---|---|
| 输入 | 客服 Agent 同时处理 FAQ 和高风险退款长对话，包含检索和工具 fan-out；记录版本、hash、数据分类和 owner | 缺关键输入为 BLOCKED |
| 方法 | open-loop arrival 保持外部到达，closed-loop 诊断单用户上限，分阶段 Trace 定位 queue/model/tool，风险切片阻止均值掩盖，Goodput 将质量安全纳入容量 | 方法与风险不匹配时停止生成 |
| Oracle | 到达率与 dropped iterations 可核对；每任务阶段时间相加可解释 E2E；只有质量安全延迟同时合格进入 Goodput；失败重试和工具调用计入 cost_per_success | 任一 blocker 失败即 FAIL |
| Prompt | 从 workload、任务切片、SLO 和成本模型生成 open/closed 场景、阶段指标和容量判定；禁止发明通用阈值或忽略失败成本 | 无 source_ref 或新增规则即拒绝 |
| 证据 | 三阶段 JSON、失败规则、manifest 和边界 | 缺报告不能升级状态 |
| 决策 | content owner、oracle owner、release owner 分离 | AI 无放行权限 |

## Metrics and decisions

页级指标不是“生成多少用例”，而是 Oracle 覆盖、mutation 被杀死、负控可复现、失败定位到具体层、材料 hash 完整、Unknown 是否保留。阻断条件包括：到达率与 dropped iterations 可核对；每任务阶段时间相加可解释 E2E；只有质量安全延迟同时合格进入 Goodput；失败重试和工具调用计入 cost_per_success。只有 runner 的 baseline=PASS、fault=FAIL、repair=PASS 才能证明离线门禁有检测力；它仍不能证明目标系统达标。

Prompt eval 检查五项：是否引用输入、是否区分 Evidence/Inference/Unknown、是否给出方法选择理由、是否绑定独立 Oracle、是否保留人工门禁。模型执行当前为 NOT_RUN，eval 文件只验证 Prompt 包结构和固定预期，不伪造模型质量。

## Baseline failure repair

Baseline：加载 TD-PS09 manifest 和固定 input fixture，四个 Oracle 全部 PASS，写出 baseline.json。Fault：只注入“工具 fan-out 翻倍”，目标 Oracle 失败，runner 退出 1 并写 fault.json；其余 Oracle 保持稳定以支持单变量归因。Repair：移除故障，使用相同输入、manifest 与 Oracle 再跑，写 repair.json 并恢复 exit 0。cycle 命令复核 0/1/0，同时生成 cycle.json。

诊断不得直接调阈值：先核对 input/hash 与 owner，再核对方法层输入，接着查看目标 Oracle 和 fault id，最后由人工决定修复、回滚或保留 Unknown。目标模型硬件、provider 内部队列、真实流量分布和价格 始终保留在证据边界中。
