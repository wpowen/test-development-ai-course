# TD-PS02 Engineering Blueprint

## Architecture and data flow

控制问题：怎样证明 Schema 生成的用例具备业务检测力，而不是生成大量合法 JSON？

数据流固定为：版本化输入 → 权威/范围检查 → 方法适配器 → 候选测试包 → 独立 Oracle → baseline/fault/repair runner → 证据报告 → 具名人工决策。Schema 正反例负责结构，属性测试负责不变量，固定 seed 与 shrink 负责复现，mutation 负责检测力；四者职责不能合并。输入 fixture、Prompt manifest、输出 schema、eval、mutation、页级 lab manifest 和 owner 映射全部放在 api-ai-automation 中；共享 runner 不含页面业务规则，只读取 TD-PS02 manifest。

| 层 | TD-PS02 的具体合同 | 失败语义 |
|---|---|---|
| 输入 | 支付意图 amount currency merchant customer 与过期状态形成跨字段约束；记录版本、hash、数据分类和 owner | 缺关键输入为 BLOCKED |
| 方法 | Schema 正反例负责结构，属性测试负责不变量，固定 seed 与 shrink 负责复现，mutation 负责检测力；四者职责不能合并 | 方法与风险不匹配时停止生成 |
| Oracle | amount 必须大于零且币种受商户支持；客户只能操作自己的支付意图；过期意图不能确认且状态不变；删除 required 或放宽金额必须杀死 mutation | 任一 blocker 失败即 FAIL |
| Prompt | 读取 OpenAPI 和历史缺陷，只输出风险约束、最小正反例、固定 seed 与 mutation 映射；不得把 Schema 通过写成业务通过 | 无 source_ref 或新增规则即拒绝 |
| 证据 | 三阶段 JSON、失败规则、manifest 和边界 | 缺报告不能升级状态 |
| 决策 | content owner、oracle owner、release owner 分离 | AI 无放行权限 |

## Metrics and decisions

页级指标不是“生成多少用例”，而是 Oracle 覆盖、mutation 被杀死、负控可复现、失败定位到具体层、材料 hash 完整、Unknown 是否保留。阻断条件包括：amount 必须大于零且币种受商户支持；客户只能操作自己的支付意图；过期意图不能确认且状态不变；删除 required 或放宽金额必须杀死 mutation。只有 runner 的 baseline=PASS、fault=FAIL、repair=PASS 才能证明离线门禁有检测力；它仍不能证明目标系统达标。

Prompt eval 检查五项：是否引用输入、是否区分 Evidence/Inference/Unknown、是否给出方法选择理由、是否绑定独立 Oracle、是否保留人工门禁。模型执行当前为 NOT_RUN，eval 文件只验证 Prompt 包结构和固定预期，不伪造模型质量。

## Baseline failure repair

Baseline：加载 TD-PS02 manifest 和固定 input fixture，四个 Oracle 全部 PASS，写出 baseline.json。Fault：只注入“删除 merchant_id required”，目标 Oracle 失败，runner 退出 1 并写 fault.json；其余 Oracle 保持稳定以支持单变量归因。Repair：移除故障，使用相同输入、manifest 与 Oracle 再跑，写 repair.json 并恢复 exit 0。cycle 命令复核 0/1/0，同时生成 cycle.json。

诊断不得直接调阈值：先核对 input/hash 与 owner，再核对方法层输入，接着查看目标 Oracle 和 fault id，最后由人工决定修复、回滚或保留 Unknown。目标生成器对 OAS dialect 的实现差异和生产商户配置 始终保留在证据边界中。
