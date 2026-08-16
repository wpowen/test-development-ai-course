# TD-T14 LLM-as-judge 的校准和反例 research brief

**Controlling question:** 怎样用人工双标、顺序翻转、风格扰动和事实反例校准 LLM Judge，使其只能辅助可委托的评分，而不能批准自己的期望或绕过事实 blocker？

- Professional decision: 质量负责人基于人人一致性、人机分歧矩阵和反例命中率划定 Judge 可自动评分、需抽检和必须人工审批的范围；事实、安全、权限类永不由单一 Judge 放行。
- Work object: 30 对退款答复校准集：顺序对、冗长风格对、政策事实错误对，以及两名领域人员的独立标签和裁决记录。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.

