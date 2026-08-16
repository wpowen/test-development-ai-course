# TD-PS11 Engineering Blueprint

## Architecture and data flow

控制问题：怎样让 symptom、fault event、跨服务 Trace、质量切片和恢复检查属于同一证据链，并在 telemetry 缺失时保持 UNKNOWN？

数据流固定为：版本化输入 → 权威/范围检查 → 方法适配器 → 候选测试包 → 独立 Oracle → baseline/fault/repair runner → 证据报告 → 具名人工决策。OTel/W3C 传播连接任务，版本字段区分变化，trace completeness 先验证观测能力，Chaos Experiment Card 固定授权和 blast radius，单变量注入支持归因。输入 fixture、Prompt manifest、输出 schema、eval、mutation、页级 lab manifest 和 owner 映射全部放在 reliability-chaos-observability 中；共享 runner 不含页面业务规则，只读取 TD-PS11 manifest。

| 层 | TD-PS11 的具体合同 | 失败语义 |
|---|---|---|
| 输入 | 生产客服 Agent 质量下降可能来自索引、工具、模型、队列或观测丢失，需要在隔离范围内验证；记录版本、hash、数据分类和 owner | 缺关键输入为 BLOCKED |
| 方法 | OTel/W3C 传播连接任务，版本字段区分变化，trace completeness 先验证观测能力，Chaos Experiment Card 固定授权和 blast radius，单变量注入支持归因 | 方法与风险不匹配时停止生成 |
| Oracle | task trace 覆盖 gateway retrieval model tool 和 terminal；敏感输入不进入默认 telemetry；fault start/end 与异常窗口可关联；停止回滚后同一切片恢复且无残留 | 任一 blocker 失败即 FAIL |
| Prompt | 读取 Trace schema、脱敏策略、实验授权和 SLO，输出单变量实验卡、观测字段、停止条件与复验；生产 selector 缺失时必须 BLOCKED | 无 source_ref 或新增规则即拒绝 |
| 证据 | 三阶段 JSON、失败规则、manifest 和边界 | 缺报告不能升级状态 |
| 决策 | content owner、oracle owner、release owner 分离 | AI 无放行权限 |

## Metrics and decisions

页级指标不是“生成多少用例”，而是 Oracle 覆盖、mutation 被杀死、负控可复现、失败定位到具体层、材料 hash 完整、Unknown 是否保留。阻断条件包括：task trace 覆盖 gateway retrieval model tool 和 terminal；敏感输入不进入默认 telemetry；fault start/end 与异常窗口可关联；停止回滚后同一切片恢复且无残留。只有 runner 的 baseline=PASS、fault=FAIL、repair=PASS 才能证明离线门禁有检测力；它仍不能证明目标系统达标。

Prompt eval 检查五项：是否引用输入、是否区分 Evidence/Inference/Unknown、是否给出方法选择理由、是否绑定独立 Oracle、是否保留人工门禁。模型执行当前为 NOT_RUN，eval 文件只验证 Prompt 包结构和固定预期，不伪造模型质量。

## Baseline failure repair

Baseline：加载 TD-PS11 manifest 和固定 input fixture，四个 Oracle 全部 PASS，写出 baseline.json。Fault：只注入“collector 丢 span”，目标 Oracle 失败，runner 退出 1 并写 fault.json；其余 Oracle 保持稳定以支持单变量归因。Repair：移除故障，使用相同输入、manifest 与 Oracle 再跑，写 repair.json 并恢复 exit 0。cycle 命令复核 0/1/0，同时生成 cycle.json。

诊断不得直接调阈值：先核对 input/hash 与 owner，再核对方法层输入，接着查看目标 Oracle 和 fault id，最后由人工决定修复、回滚或保留 Unknown。目标 collector 采样、生产权限、托管模型内部 span 和真实恢复时间 始终保留在证据边界中。
