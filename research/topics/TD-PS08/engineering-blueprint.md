# TD-PS08 Engineering Blueprint

## Architecture and data flow

控制问题：怎样证明迁移前后行数、键、金额、状态语义和 CDC offset 一致，并在部分失败时安全停止或回滚？

数据流固定为：版本化输入 → 权威/范围检查 → 方法适配器 → 候选测试包 → 独立 Oracle → baseline/fault/repair runner → 证据报告 → 具名人工决策。expand-contract 降低兼容风险，约束与 checksum 验证静态完整性，分片回填和高水位验证进度，CDC 对账处理并发变化，影子读比较语义。输入 fixture、Prompt manifest、输出 schema、eval、mutation、页级 lab manifest 和 owner 映射全部放在 api-ai-automation 中；共享 runner 不含页面业务规则，只读取 TD-PS08 manifest。

| 层 | TD-PS08 的具体合同 | 失败语义 |
|---|---|---|
| 输入 | 订单表从 status 字符串迁移到 status_code 与状态维表，同时进行双读、回填和 CDC；记录版本、hash、数据分类和 owner | 缺关键输入为 BLOCKED |
| 方法 | expand-contract 降低兼容风险，约束与 checksum 验证静态完整性，分片回填和高水位验证进度，CDC 对账处理并发变化，影子读比较语义 | 方法与风险不匹配时停止生成 |
| Oracle | 主键集合与关键行数按分片守恒；金额汇总和状态语义映射一致；CDC 高水位前后的变更无丢失可容忍去重；旧新读路径差异低于零容忍 blocker | 任一 blocker 失败即 FAIL |
| Prompt | 读取 DDL、数据字典、约束、回填计划和 CDC manifest，输出前置检查、分片 Oracle、停机条件、回滚与对账 SQL；不得建议直接 DROP 生产列 | 无 source_ref 或新增规则即拒绝 |
| 证据 | 三阶段 JSON、失败规则、manifest 和边界 | 缺报告不能升级状态 |
| 决策 | content owner、oracle owner、release owner 分离 | AI 无放行权限 |

## Metrics and decisions

页级指标不是“生成多少用例”，而是 Oracle 覆盖、mutation 被杀死、负控可复现、失败定位到具体层、材料 hash 完整、Unknown 是否保留。阻断条件包括：主键集合与关键行数按分片守恒；金额汇总和状态语义映射一致；CDC 高水位前后的变更无丢失可容忍去重；旧新读路径差异低于零容忍 blocker。只有 runner 的 baseline=PASS、fault=FAIL、repair=PASS 才能证明离线门禁有检测力；它仍不能证明目标系统达标。

Prompt eval 检查五项：是否引用输入、是否区分 Evidence/Inference/Unknown、是否给出方法选择理由、是否绑定独立 Oracle、是否保留人工门禁。模型执行当前为 NOT_RUN，eval 文件只验证 Prompt 包结构和固定预期，不伪造模型质量。

## Baseline failure repair

Baseline：加载 TD-PS08 manifest 和固定 input fixture，四个 Oracle 全部 PASS，写出 baseline.json。Fault：只注入“回填跳过一个分片”，目标 Oracle 失败，runner 退出 1 并写 fault.json；其余 Oracle 保持稳定以支持单变量归因。Repair：移除故障，使用相同输入、manifest 与 Oracle 再跑，写 repair.json 并恢复 exit 0。cycle 命令复核 0/1/0，同时生成 cycle.json。

诊断不得直接调阈值：先核对 input/hash 与 owner，再核对方法层输入，接着查看目标 Oracle 和 fault id，最后由人工决定修复、回滚或保留 Unknown。目标数据规模、锁等待、复制延迟、业务可接受停机窗口 始终保留在证据边界中。
