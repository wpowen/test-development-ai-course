# TD-T07 工程蓝图

## Architecture and data flow
系统由 failure-model registry、domain/constraint schema、method selector、generator adapter、Oracle/invariant evaluator、shrinker、replay ledger 与安全控制器组成。registry 先记录阈值、离散交互、不变量或未知输入面；selector 根据可解释规则选择 boundary、combination、property 或 fuzz。domain schema 定义合法值、互斥条件和不可触碰资源；AI 只能提出候选因子或属性，owner 审批后才进入生成。每次运行冻结 seed、budget、工具版本、系统 commit、依赖与环境标签。失败先写原始输入，再由 shrinker 产生最小反例并重新验证同一 invariant。

数据流是 `approved failure model -> typed domain and constraints -> method decision -> deterministic generation -> independent invariant -> raw failure -> shrink -> replay -> regression`。fuzz 分支必须额外经过授权、沙箱、速率和副作用门禁。外部时间、队列或第三方服务不能冻结时，在 ledger 标 UNKNOWN，不能用 seed 掩盖。Prompt/Input/Schema/Eval/Mutation 和模型配置均版本化；拒答、截断、非法状态或越权建议进入 BLOCKED。

## Metrics and decisions
boundary 报告边界点覆盖与非法邻域；combination 报告因子、约束、t 强度和覆盖数组；property 报告生成次数、discard 比例、失败数、最小反例与 shrink 步数；fuzz 报告 corpus、coverage signal、unique crash、超时、资源和安全中止。所有方法共同记录 reproducibility rate、invalid generated rate、Oracle unknown count 与副作用事故数。行覆盖只作为辅助信号，不是完成门禁。

决策表：清晰阈值优先 boundary；有限枚举交互优先 constrained combination；可表达全称 invariant 选 property；无法枚举的解析/语法空间且有沙箱授权时才选 fuzz。若没有可信 Oracle 或合法域，停止生成。失败必须在同版本环境重放；重放失败保持 FLAKY/UNKNOWN，不自动归因。AI 推荐的方法必须给出 failure model、约束和反例计划，否则拒绝。

## Baseline failure repair
Baseline 使用 seed 20260811 生成合法退款案例并验证 `refund_count<=1`，退出 0。Fault 把实现切换为重复请求触发重复退款，25 个案例中出现违反属性的输入，runner 保存原输入、seed、fixture 版本并收缩出 idempotency key 与 repeat，退出 1。若只打印随机数据或没有最小反例，不满足门禁。

Repair 恢复幂等保护，用相同 seed、域、Oracle 和版本重放，退出 0；最小反例应转为明确回归。该 runner 是标准库合成实验，没有真实 property/fuzz 工具、服务权限、网络、数据库或个人数据。它证明方法选择和失败回放的合同可以执行，不证明生产分布、长期稳定性或安全性，所有外推保持 Unknown。
