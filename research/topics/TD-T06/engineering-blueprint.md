# TD-T06 工程蓝图

## Architecture and data flow
系统分成不能互相替代的六层：冻结 basis 与 Oracle 注册表、候选测试生成器、schema/静态门禁、baseline runner、独立 mutation runner、人工处置台。basis 层记录需求、设计约束、批准 expected 与 owner；生成器只读取允许视图并输出 `CANDIDATE`。门禁验证 case ID、basis 引用、输入、expected、断言与清理步骤。baseline 在批准实现上运行，mutation runner 根据版本化 `mutation.json` 注入单一错误，再运行同一测试集合。结果收集器关联 mutant、case、Oracle、退出码和日志，最后由不同于生成器的 reviewer 处理 survived/等价项。

数据流为 `frozen oracle -> candidate generation -> structural gate -> baseline -> independent mutation -> outcome classification -> reviewer disposition -> regression suite`。Prompt/Input/Schema/Eval/Mutation 与 model-config 都固定版本和哈希；模型拒答、截断、越权或输出 invalid schema 时停止。生成器不能修改 mutation 清单、Oracle 或通过阈值。测试代码也不能直接从实现当前返回值产生 expected，否则 mutation 可能与候选一起共享错误。

## Metrics and decisions
最低指标包括 baseline pass rate、killed、survived、no coverage、timeout、invalid 与 equivalent-pending 数量。mutation score 只有在分母定义公开时计算，例如 `killed / (killed + survived)`，明确排除 no coverage 还是计入必须保持一致。还要记录 basis coverage、assertion specificity、unrelated-failure rate 和人工撤销率。代码覆盖是路由信息：no coverage 促使检查可达性，但不充当断言质量证据。

决策规则：baseline 不通过时先修 candidate 或 fixture，不运行 mutation；fault 被杀死且失败命中目标 Oracle时，记录 detection evidence；fault survived 时保持 FAIL，分析缺覆盖、断言弱、不可达或等价；工具错误、超时和冲突进入 UNKNOWN。评估集覆盖正例、边界、冲突、缺失、越权、拒答、截断和同义改写。任何模型自报的置信度不参与通过判定。

## Baseline failure repair
Baseline 对两个冻结用例运行退款逻辑，实际结果与独立 `fixtures/oracles.json` 一致，退出 0。Fault 使用 `M-INVERT-ACTIVATED-GUARD` 反转已激活数字商品的守卫；至少一个用例的 decision 由 `MANUAL_REVIEW` 变为错误值，报告列出 failed case，mutation outcome 为 KILLED，进程退出 1。若 fault 退出 0，说明候选测试没有检测该授权错误，门禁必须失败。

Repair 恢复批准实现而不是修改 expected 来迎合错误，重复相同输入、Oracle 与 runner，退出 0。报告保存 basis/oracle/prompt manifest 哈希，证明三阶段比较口径一致。当前实验没有调用模型，没有生成真实项目测试，也没有评估等价 mutant、性能、并发或 CI 成本；所以它是可执行教学 fixture，不是生产 mutation 平台或从业者认可结论。
