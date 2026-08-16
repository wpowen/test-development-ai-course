# TD-T05 教学稿：让 AI 做风险候选，不做需求权威

## 把 PRD、设计、Diff 与 Oracle 分开解读
测试开发收到一个 PR 时，最危险的误区不是“没有让 AI 读 diff”，而是把三种不同材料揉成一段自然语言：需求说系统应该做什么，技术设计说明当前方案如何实现，diff 只显示这次直接改了什么。模型可以把它们连接起来，却没有权力决定哪个版本生效，也无法从未出现的上下文推出业务损失。专业工作的目标因此不是得到一份漂亮风险清单，而是得到一组可复核、可拒绝、可停下的风险候选。

先冻结输入。为 PRD、设计说明、Oracle 注册表和 commit 记录版本、哈希、owner 与时间；若需求和设计冲突，原样保留两个引用。再读 diff 的 rename、文件状态和 hunk，不用修改行数代表风险。每个候选必须回答四个问题：哪条已批准要求可能受影响、哪段直接变更触发该判断、用哪个独立 Oracle 判断、谁有权批准。任何答案缺失都写 UNKNOWN，不允许提示词要求“自行合理补齐”。

## 运行 TD-T05 并核对引用链


```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-assisted-testing
python3 ai_assisted_lab.py run --topic TD-T05 --phase baseline --report reports/td-t05-baseline.json
python3 ai_assisted_lab.py run --topic TD-T05 --phase fault --report reports/td-t05-fault.json
python3 ai_assisted_lab.py run --topic TD-T05 --phase repair --report reports/td-t05-repair.json
```

TD-T05 预期退出码为 `0 → 2 → 0`；本页 fault 非零是检测力证据，不得用 shell 吞掉。

下载材料包，进入 `materials/ai-assisted-testing`。先运行 TD-T05 baseline，查看报告中的 `basis_hash`、`oracle_hash`、两条候选及 `human_decision_required=true`。然后打开 `page-prompts/TD-T05/`：manifest 把 Prompt/Input/Schema/Eval/Mutation 固定为 1.0.0；input 只含允许材料；schema 规定引用字段；eval 覆盖正常、边界、冲突、缺失、越权、拒答、截断和同义改写；mutation 描述必须被挡住的错误。critic 负责找证据缺口，不是给生成器自批 Oracle。

执行 fault。报告会显示一条缺 diff 引用的风险，以及一条模型式虚构 SLA；退出码 2 是预期结果。检查为什么 schema 外形完整仍不够：字符串存在不代表引用权威，所以 runner 还要对照独立 `fixtures/oracles.json`。最后执行 repair，确认不是把 UNKNOWN 换成编造值，而是删除不受支持的候选、恢复真实引用后通过。

## 诊断 TD-T05 的错误批准路径
常见失败一是把 PR 摘要当完整影响分析；修复是明确 diff 只提供直接变化，并添加依赖图、静态分析或历史事故作为独立证据 lane。失败二是让同一模型生成测试、定义 Oracle、再评价自己；修复是冻结独立 Oracle，让机器只做结构与引用门禁，最终交给有权限的 owner。失败三是使用无依据的 0.87 风险分；修复是先定义损失维度和权重，没有就保持未排序。

完成标准不是“AI 输出了十条风险”，而是 fault 确实被杀死、repair 可复现、每条被接受候选都有闭合引用、未知没有被吞掉。当前实验是离线合成 fixture：它没有连接真实仓库、没有调用模型、没有从业者签字，也没有生产效果。学习者应把报告作为迁移合同，在真实环境中重新采集基线与独立评审，而不是把本页状态提升为 live。
