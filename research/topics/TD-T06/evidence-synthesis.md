# TD-T06 证据综合

## Fact
专业测试大纲把测试条件、测试用例与期望结果建立在测试依据上，支持“Oracle 先于候选生成”的顺序，但不规定具体生成模型。Playwright Test Agents 等官方工具证明代理能够规划和生成浏览器测试，GitHub Copilot 文档也展示代码生成能力；这些材料描述功能，不提供独立的缺陷检测效果。OpenAI eval 指南支持把输入、准则与运行版本化，有利于保存评估合同。

Stryker、PIT、mutmut 等 mutation 工具的官方材料共同定义了通过修改程序再运行测试来评估检测力的基本机制。Google Testing Blog 关于 mutation 的实践材料说明它可用于发现测试缺口，但工具语言、操作符、等价 mutant 和计算成本限制外推。覆盖率工具只能证明某行或分支被执行；没有失败断言时，高覆盖仍可放过错误。职业资料与教学供给说明测试设计、自动化维护和结果解释是岗位活动，却不能证明某个提示词已经达到从业者水平。

## Cross-source synthesis
可靠工作流先冻结批准的行为 Oracle，再给 AI 输入最少的接口、约束与候选范围。输出需要 `case_id`、basis 引用、输入、expected、assertion、setup、cleanup 和 candidate 状态。生成器不得看到 mutation 的具体答案，也不得把实现当前输出复制为 expected。结构检查后先跑 baseline：全部候选必须在批准实现上通过；随后由独立 mutation 配置改变单个业务行为，观察哪些测试失败。被杀死说明至少存在一个能区分基线与该错误的断言；survived 只说明当前测试没检测该 mutation，不能直接断言生产缺陷；no coverage 表示 mutant 未被测试执行。

评价不能只报一个总分。每个 mutant 应记录 operator、location、basis/Oracle、测试集合、结果和处置。等价 mutant 需要人工或独立语义审查，不能由生成器自判。对 survived 项，先判断无覆盖、断言弱、fixture 不可达还是 mutant 等价，再决定补测试、调整操作符或接受风险。对 killed 项仍需检查测试是否因无关异常失败，避免把脆弱性误当检测力。

本主题 fixture 的批准规则是：已激活的数字商品退款进入 `MANUAL_REVIEW`，并仅产生一次审计事件。baseline 按独立 `oracles.json` 通过；fault 反转 activated guard，已有测试用例失败，mutation 标记 KILLED 并退出 1；repair 恢复实现，退出 0。这个链路能证明 runner 和独立 Oracle 对一个明确错误敏感，但不证明所有错误类型或真实模型生成质量。

## Unknown
真实代码库的等价 mutant 比例、mutation 成本、语言支持、并发/异步不稳定性与隔离环境未知。未运行任何模型，因此候选质量、提示词对比和 token 成本没有实证；没有盲审金标准，不能报告召回率。也没有从业者审批、真实 CI 集成或生产缺陷回溯。状态必须保持 `fixture-tested`，不能写 live 或 practitioner。
