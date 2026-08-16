# TD-C04 Manuscript: 把通用职业建议适配到你的组织

## 你要解决的专业问题
网上的职级、年限和 P5-P9 表格不是你的公司制度。直接复制会把推测当事实，造成错误自评、错误承诺和不可审计的晋升材料。你要区分公共证据、组织事实和未知项，并让任何结论都能回到来源。

## 跟做：生成一张适配卡
在终端执行 `cd site/public/materials/career-evolution && python3 scripts/career_evolution_lab.py --manifest manifests/TD-C04.json --mode cycle`，打开 fixture，填写岗位、团队、证据链接和日期。对每条要求填写 `claim / source / owner / version / confidence`。没有内部文档的字段写 `INTERNAL-UNKNOWN`，不要用“一般”代替。再分别运行 `--mode fault` 观察缺来源时 Oracle 如何拒绝，最后运行 `--mode repair` 补齐字段。

## 失败与修复
常见失败包括把年限当阈值、把同名职级跨公司比较、遗漏复核人。故障结果应为 exit code 1，且输出缺口列表；修复后 exit code 0，并在 Metric Card 中留下证据 URI 和时间窗口。若组织仍未确认，状态保持 `BLOCK`。

## 可复用工件与自评
输出 `organization-adapter.json`、一页责任矩阵和 30/60/90 计划。自评只统计可展示的责任证据：我做了什么、影响谁、如何测量、谁复核。把每项绑定到下一次评审 artifact，不绑定假定职级编号。fixture-tested 不证明公司规则或晋升结果。
## 检查清单
提交前逐项确认：每个 claim 有来源和日期；每个阈值有 owner；公共框架与组织规则分开；未知项写 `INTERNAL-UNKNOWN`；fault 的失败原因可读；repair 的 diff 可追溯；30/60/90 目标有可交付 artifact 和复核人。你可以把模板复制到下一家公司，但必须重新填写适配字段。若只是看到了 fixture 的绿色结果，不得把它写成真实组织通过。

## 小练习
任选一个公共职级描述，故意删掉来源和有效日期，预测 Oracle 应该如何反应，再补回字段重跑。最后写一句边界声明：本页证明的是适配流程和失败处理，不是任何公司的晋升承诺。

迁移到新组织时，先复制空白适配卡，不复制旧结论。替换岗位语境、内部制度、复核人和有效日期后，重新运行 Prompt、Eval 与 mutation；旧组织的 PASS 只能作为历史输入。若两份内部制度冲突，独立 Oracle 应保留冲突并要求 owner 裁决，而不是让模型选择更像真的一份。

交付时把适配卡、运行 receipt 和未决问题一起交给经理复核。复核人应能看到每个结论来自哪份制度、何时失效、缺什么证据，以及下一次验证命令。这样即使岗位名称相同，责任范围变化也不会被旧模板掩盖；这才是可迁移，而不是把一张职级表复制到所有公司。
