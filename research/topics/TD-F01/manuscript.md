# TD-F01 Course Manuscript

## Professional problem

很多小白把测试开发理解成三个片段：读别人写好的用例、在页面上执行、再学一门自动化工具。这个理解漏掉职业真正承担的责任：在需求还不完整、设计仍有取舍、环境和数据存在约束时，识别什么失败会伤害用户或业务；把依据和未知变成可测试条件；选择能检出相应失败的方法；形成独立于实现的 Oracle；保存可复现证据；让具名责任人能决定发布、豁免或回滚。

职业入口先画完整研发测试链。需求阶段读业务参与者、触发、前置、规则、边界、例外、验收和权威 owner。技术设计阶段读组件、接口、状态、数据、一致性、幂等、超时、重试、降级、安全和可观测性。两份文档回答不同问题：PRD 不能替代可执行接口，技术设计也不能静默修改业务规则。发现冲突时记录精确引用和影响，状态 BLOCKED，等待权威裁决。

接着把风险、方法、Oracle、工件与发布责任分开。状态转换、决策表、边界值、契约、属性/变形、探索、性能和故障注入都是方法；它们是否合适取决于失败机制。Oracle 来自批准规则、独立计算、不变量、参考实现、人工金标或多重证据；若直接使用被测实现或本次模型输出，独立性不足。工件必须有 owner、version、source、acceptance 和 consumer。发布、Waiver 和回滚由具名人类责任人决定，AI 只能在权限边界内生成候选和聚合证据。

传统能力随后迁移到 AI 质量工程。需求和场景变成任务定义、风险切片、拒答与 Handoff；测试数据变成有来源、许可、标签 owner、开发集与封存 Holdout 的 Dataset；Oracle 变成 Schema、不变量、参考答案、Rubric、Judge 校准和人工升级；自动化变成重复 Eval、版本比较和回滚；日志变成 Prompt、模型、检索、工具、状态和副作用 Trace；安全变成注入、泄漏、过度代理和跨租户权限。迁移增加了对象，没有取消职业责任。

## Runnable action

学习者下载公开材料包，进入 `materials/profession-reality`，运行：

`python3 profession_self_check.py cycle --report reports/TD-F01-cycle.json`

脚本首先读取 baseline profile，检查九项最低责任契约；然后读取 fault profile，确认危险误解会被门禁拒绝；最后读取 repair profile，确认修复恢复通过。预期 observed_exit_codes 恰好为 baseline 0、fault 1、repair 0，总体 exit 0。报告同时声明 provider none、model_status NOT_RUN 和 fixture-only 边界。

运行后，学习者打开自己的最近一次脱敏需求，填写九阶段链：每站的 actor、input、artifact、decision 与 consumer。分别列出需求文档和技术文档的问题，制造一个冲突并练习 BLOCKED；选择一个最高风险失败，说明为什么采用该方法；写一个不依赖实现输出的 Oracle；给交付工件填 owner/version/source/acceptance/consumer；最后说出谁决定发布、Waiver 和回滚。

再运行版本化 Prompt 之前，先读 manifest。它声明 provider none 和 model_status NOT_RUN，所以页面只提供可以复制的 Prompt 契约，不提供虚假的模型通过报告。若未来运行模型，必须保存实际 provider/model/version、输入哈希、原始输出、Schema 结果、逐案例 Eval、Mutation 与拒答状态；未完成这些步骤不得提升状态。

## Failure and repair

第一个故障是“技术设计写了什么就测什么”。修复方法是同时读取需求依据和设计依据，建立权威矩阵；冲突时停止下游生成，由业务/产品与技术 owner 裁决。第二个故障是“实现返回什么就是预期什么”。修复方法是从批准规则、独立计算、不变量或金标建立 Oracle，并用故障注入证明它能检出错误。

第三个故障是“生成很多用例说明 Prompt 很专业”。修复方法是绑定固定输入、输出 Schema、风险切片、方法理由、Oracle、至少五个 Eval case 和至少三个 Mutation；模型没有运行就写 NOT_RUN。第四个故障是“AI 汇总通过就自动发布”。修复方法是把 AI 权限限制为候选与证据聚合，明确发布、Waiver、回滚的具名人类责任人和升级条件。

第五个故障是“完成这页就具备真实岗位能力”。修复方法是保持证据分层：确定性脚本只能给 PASS_FIXTURE；Prompt 契约只是 static-reviewed；从业者盲审、真实公司流程、CI 集成、线上运行、发布和生产效果需要各自独立任务和证据。学习路线以需求到证据八页为第一阶段，再进入 AI 基础、LLM/RAG/Agent 测试、质量系统与生产治理；每一步以工件和变红门禁结束。

课程完成不是记住术语，而是能在一个真实脱敏场景中说清责任、依据、方法、Oracle、工件、决定与未知，并用自测故障证明边界不是口号。

## 职业责任反例与诊断

用用例数和覆盖率替代风险与独立 Oracle，或让 AI 在 PRD 与技术设计冲突时选择更顺口的规则，看似专业却隐藏了业务 owner、发布 owner 和回滚责任。遇到返工时先查 authority/source_ref，再查 Oracle 与 mutation，最后查 Run Manifest/Trace；没有具名裁决或原始执行证据时保持 BLOCKED/UNKNOWN。
