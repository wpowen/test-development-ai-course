# TD-T17 Prompt injection、泄露与 excessive agency research brief

**Controlling question:** 怎样把外部内容视为不可信数据，并用模型外授权、最小权限和 DLP 阻止 prompt injection 变成跨租户读取、秘密泄露或写副作用？

- Professional decision: 安全负责人依据 tenant enforcement、工具 allowlist、secret isolation、DLP 与零未授权写决定是否继续；模型是否识别攻击只作次级信号。
- Work object: 含恶意网页指令的客服检索上下文、tenant A/B 数据、系统秘密占位符、读写工具 allowlist、scope 与输出审计。
- Evidence boundary: all learner execution is deterministic offline fixture; model, browser, external tool, queue, live traffic and practitioner review are NOT_RUN.
- Stop rule: any missing version, permission receipt, independent Oracle, named fault, rollback owner or opened source blocks promotion.


