# TD-PS04 Engineering Blueprint

## Architecture and data flow

控制问题：怎样让 UI 测试等待业务终态、隔离数据并保存可诊断 Trace，而不是靠 sleep 和文本出现判绿？

数据流固定为：版本化输入 → 权威/范围检查 → 方法适配器 → 候选测试包 → 独立 Oracle → baseline/fault/repair runner → 证据报告 → 具名人工决策。用户感知 locator 与显式 test id 负责定位，auto-wait 负责 actionability，API/账本负责业务 Oracle，独立上下文负责隔离，Trace 负责诊断。输入 fixture、Prompt manifest、输出 schema、eval、mutation、页级 lab manifest 和 owner 映射全部放在 ui-mobile-automation 中；共享 runner 不含页面业务规则，只读取 TD-PS04 manifest。

| 层 | TD-PS04 的具体合同 | 失败语义 |
|---|---|---|
| 输入 | 后台退款审批需跨 UI、订单 API、异步状态和审计记录完成；记录版本、hash、数据分类和 owner | 缺关键输入为 BLOCKED |
| 方法 | 用户感知 locator 与显式 test id 负责定位，auto-wait 负责 actionability，API/账本负责业务 Oracle，独立上下文负责隔离，Trace 负责诊断 | 方法与风险不匹配时停止生成 |
| Oracle | 批准控件角色名称与权限一致；重复点击只产生一次退款意图；UI 终态与订单 API 和审计记录一致；失败包含 DOM 网络控制台和 trace | 任一 blocker 失败即 FAIL |
| Prompt | 读取旅程、角色、网络契约和风险矩阵，输出 locator 选择、等待信号、隔离数据、业务 Oracle 与失败证据；不得生成 fixed sleep | 无 source_ref 或新增规则即拒绝 |
| 证据 | 三阶段 JSON、失败规则、manifest 和边界 | 缺报告不能升级状态 |
| 决策 | content owner、oracle owner、release owner 分离 | AI 无放行权限 |

## Metrics and decisions

页级指标不是“生成多少用例”，而是 Oracle 覆盖、mutation 被杀死、负控可复现、失败定位到具体层、材料 hash 完整、Unknown 是否保留。阻断条件包括：批准控件角色名称与权限一致；重复点击只产生一次退款意图；UI 终态与订单 API 和审计记录一致；失败包含 DOM 网络控制台和 trace。只有 runner 的 baseline=PASS、fault=FAIL、repair=PASS 才能证明离线门禁有检测力；它仍不能证明目标系统达标。

Prompt eval 检查五项：是否引用输入、是否区分 Evidence/Inference/Unknown、是否给出方法选择理由、是否绑定独立 Oracle、是否保留人工门禁。模型执行当前为 NOT_RUN，eval 文件只验证 Prompt 包结构和固定预期，不伪造模型质量。

## Baseline failure repair

Baseline：加载 TD-PS04 manifest 和固定 input fixture，四个 Oracle 全部 PASS，写出 baseline.json。Fault：只注入“退款 API 延迟后返回 500”，目标 Oracle 失败，runner 退出 1 并写 fault.json；其余 Oracle 保持稳定以支持单变量归因。Repair：移除故障，使用相同输入、manifest 与 Oracle 再跑，写 repair.json 并恢复 exit 0。cycle 命令复核 0/1/0，同时生成 cycle.json。

诊断不得直接调阈值：先核对 input/hash 与 owner，再核对方法层输入，接着查看目标 Oracle 和 fault id，最后由人工决定修复、回滚或保留 Unknown。目标浏览器流量占比、第三方沙箱稳定性和真实页面可访问名称 始终保留在证据边界中。
