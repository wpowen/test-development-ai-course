# TD-PS07 Engineering Blueprint

## Architecture and data flow

控制问题：怎样区分 XCUITest 可见状态、系统权限、签名环境与服务端预约结果，并确保测试后无状态残留？

数据流固定为：版本化输入 → 权威/范围检查 → 方法适配器 → 候选测试包 → 独立 Oracle → baseline/fault/repair runner → 证据报告 → 具名人工决策。accessibility identifier 保持定位契约，launch arguments 注入可控状态，XCTest expectation 等待业务信号，环境 manifest 固定签名和设备，后端预约版本作 Oracle。输入 fixture、Prompt manifest、输出 schema、eval、mutation、页级 lab manifest 和 owner 映射全部放在 ui-mobile-automation 中；共享 runner 不含页面业务规则，只读取 TD-PS07 manifest。

| 层 | TD-PS07 的具体合同 | 失败语义 |
|---|---|---|
| 输入 | 医疗预约改期跨日期控件、通知权限、后台恢复、模拟器/真机和后端预约版本；记录版本、hash、数据分类和 owner | 缺关键输入为 BLOCKED |
| 方法 | accessibility identifier 保持定位契约，launch arguments 注入可控状态，XCTest expectation 等待业务信号，环境 manifest 固定签名和设备，后端预约版本作 Oracle | 方法与风险不匹配时停止生成 |
| Oracle | 稳定 identifier 不依赖本地化文字；权限拒绝仍可完成安全替代路径；同一预约版本只应用一次改期；清理后通知日历 keychain 与后端状态回到基线 | 任一 blocker 失败即 FAIL |
| Prompt | 读取预约状态机、XCUITest preflight、权限与环境清单，生成 launch state、等待条件、清理和后端 Oracle；不得把模拟器通过写成真机通过 | 无 source_ref 或新增规则即拒绝 |
| 证据 | 三阶段 JSON、失败规则、manifest 和边界 | 缺报告不能升级状态 |
| 决策 | content owner、oracle owner、release owner 分离 | AI 无放行权限 |

## Metrics and decisions

页级指标不是“生成多少用例”，而是 Oracle 覆盖、mutation 被杀死、负控可复现、失败定位到具体层、材料 hash 完整、Unknown 是否保留。阻断条件包括：稳定 identifier 不依赖本地化文字；权限拒绝仍可完成安全替代路径；同一预约版本只应用一次改期；清理后通知日历 keychain 与后端状态回到基线。只有 runner 的 baseline=PASS、fault=FAIL、repair=PASS 才能证明离线门禁有检测力；它仍不能证明目标系统达标。

Prompt eval 检查五项：是否引用输入、是否区分 Evidence/Inference/Unknown、是否给出方法选择理由、是否绑定独立 Oracle、是否保留人工门禁。模型执行当前为 NOT_RUN，eval 文件只验证 Prompt 包结构和固定预期，不伪造模型质量。

## Baseline failure repair

Baseline：加载 TD-PS07 manifest 和固定 input fixture，四个 Oracle 全部 PASS，写出 baseline.json。Fault：只注入“动画和异步回调延迟”，目标 Oracle 失败，runner 退出 1 并写 fault.json；其余 Oracle 保持稳定以支持单变量归因。Repair：移除故障，使用相同输入、manifest 与 Oracle 再跑，写 repair.json 并恢复 exit 0。cycle 命令复核 0/1/0，同时生成 cycle.json。

诊断不得直接调阈值：先核对 input/hash 与 owner，再核对方法层输入，接着查看目标 Oracle 和 fault id，最后由人工决定修复、回滚或保留 Unknown。目标签名配置、真实通知服务和 iOS 版本分布 始终保留在证据边界中。
