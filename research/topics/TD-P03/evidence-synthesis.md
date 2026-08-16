# TD-P03 evidence synthesis

## Fact

本页的职业问题是“可测试性评审与权威冲突”，最终工件是 Review Question Pack。路线 A 从 ISO、ISTQB、NASA 等规范建立职业基线：输入必须版本化，需求、风险、测试和结果要可追溯，变更不能覆盖历史，责任人与停止状态必须明确。路线 B 从 OpenAPI、JSON Schema、结构化输出、eval、contract testing 与 mutation testing 建立工程基线：格式约束不能证明业务语义，测试只有在已知坏样例上稳定失败，才开始具有检测力。

初学者必须区分 Evidence、Inference、Unknown。Evidence 是当前版本来源中能定位的规则、fixture 实际退出码和报告 hash；Inference 是基于架构提出的候选风险、方法或回归范围，需 owner 接受；Unknown 是退款时限、真实服务行为、模型质量、从业者认可和生产效果等当前没有证据的事项。课程裁决：评审与提取角色分离；每个问题带 source_refs、impact、owner、block_level、close_with。

订单取消案例给出 PRD-v3、TECH-a13f 与 OpenAPI-v7。PRD 定义业务允许与拒绝条件，OpenAPI 定义传输结构，技术设计只说明当前实现。当技术设计与 PRD 对 SHIPPED 状态冲突时，AI 不得投票或按多数决定；必须保留两条引用、标记 BLOCKED、提出 product-owner-order 要回答的问题，并停止生成下游测试。

研究不支持三种夸大：Schema 合法不等于业务正确；离线 fixture PASS 不等于模型、集成、从业者或生产 PASS；用例数量不等于风险覆盖。当前可确认的只有版本化输入、独立负控制和可复现报告。

直接来源共同支持 test basis、traceability、风险、方法和验证活动的分离；OpenAPI/JSON Schema 可把结构变成机器检查；eval 数据集和 mutation 可检查输出或测试是否有检测力。任何外部来源都不能替本项目决定订单取消的业务 authority。页面使用 exact source_refs、owner_page_ids 和版本化 artifact，不以文件名前缀推断所有权。

## Cross-source synthesis

路线 A 说明应该保留哪些专业判断，路线 B 说明如何把判断变成可执行门禁。二者结合后的链路是：来源与 authority → 冲突/未知 → 结构化工件 → 风险与方法 → 独立 Oracle → Prompt/Schema → eval/mutation → baseline/fault/repair → trace graph → 具名 owner 决策。Review Question Pack 不是孤立模板，而是版本化节点；parent IDs、消费者、stop state 与 evidence boundary 必须一起保存。

标准倾向稳定术语和审查责任，AI 工具文档强调结构、迭代和自动评分。独立裁决为：标准约束 authority 与责任；工具只执行已批准契约。Prompt 生成候选，critic/eval 找越权与孤儿引用，最终业务与发布状态不能由同一生成器批准。

## Unknown

未运行真实模型或外部 API，无法声称 Prompt 跨模型稳定；未接企业 Jira、GitLab、测试环境、支付账本与生产 telemetry，无法声称 integration/live；没有从业者盲评和学员完成数据，无法声称 practitioner 或课程效果；也无发布授权。当前最高级别是 fixture-tested。后续 validation lane 需用固定模型矩阵、代表性样本、独立人工标签和真实 integration receipt 逐级提升，任一门禁失败都保持 blocked。

