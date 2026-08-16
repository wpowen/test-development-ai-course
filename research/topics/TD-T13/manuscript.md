# TD-T13 learner manuscript

## Wave-5 worked example

复制 A manifest 后只将 model_sha 从 m-17 改为 m-18，冻结 dataset、Prompt、retriever、tool scope、Judge、随机参数和预算。按 case_id 保存 raw output、blocker、延迟与成本；退款切片出现旧政策引用时，即使 FAQ 提升也只能低风险分流并保留 A 回退 manifest。迁移到新知识库时重新定义 gold、owner 和阈值，不复制业务结论。

## 先锁住唯一变量，再解释 A/B 差异

你面对的不是“让 AI 看起来聪明”，而是让一个真实质量决定有证据、可否决、可回滚。场景中的对象是 客服 RAG 的 A/B 候选，包含固定 eval 集、Prompt、模型、检索索引、工具、Judge、随机参数、预算和逐条输出。。如果团队只看一个总分或最终回答，可能把混杂变量、越权动作、事实错误或重复副作用藏在绿色数字里。业务后果由人工负责人承担，因此被测模型、Judge 或 healer 不能批准自己的期望。

本页控制问题是：当候选系统的 Prompt、模型、知识库和评分器都可能变化时，怎样证明观察到的差异来自唯一自变量，并把高风险切片 blocker 放在平均分之前？ 先把它翻译为决策：发布负责人只能在 manifest diff 证明唯一自变量、重复运行分布稳定、退款等高风险切片没有 blocker 时批准候选；否则结论为混杂或 UNKNOWN。。这一步决定哪些证据是 blocker，谁能批准，什么情况必须 UNKNOWN，也决定后续 Prompt 应要求模型输出“候选与证据”，而不是“替负责人下结论”。

本页的具体方法是把 `model`、`retriever`、Prompt、评测集和工具 scope 写成一张可 diff 的 manifest；先用单变量 Oracle 杀掉混杂实验，再把高风险退款切片单独交给人工 owner。学员交付的是 manifest diff、重复运行分布和发布/回滚决定，而不是一个脱离输入版本的总分。

## Runnable action

在公开材料中运行下面的确定性实验；TD-T13 的 fault 故意同时改 `model` 和 `retriever`，因此 `SINGLE-VARIABLE` 必须变红，repair 只恢复实验隔离：

```bash
cd materials/llm-agent-quality/learner-materials
python3 scripts/agent_quality_lab.py --topic TD-T13 --phase baseline --report reports/TD-T13/baseline.json
python3 scripts/agent_quality_lab.py --topic TD-T13 --phase fault --report reports/TD-T13/fault.json
python3 scripts/agent_quality_lab.py --topic TD-T13 --phase repair --report reports/TD-T13/repair.json
```

预期退出码为 `0 / 1 / 0`；逐份核对 `failed_oracle_ids`、state hash 与 `not_run`，不要用 cycle 的绿色替代三份原始报告。

先把版本 manifest 画成证据流：候选变量 → 锁定字段 → 三次重复 → 风险切片 → blocker → 人工决定。只报告 win-rate 分布、切片失败率、p95 延迟和单位成功成本；若 diff 超过一个字段、分母丢失或退款 Oracle 缺失，结论直接为 `UNKNOWN`，不能由均值补回。

TD-T13 的 Prompt 包要求候选只输出 manifest diff 与证据引用：`system.md` 禁止模型宣布胜者，`critic.md` 检查多变量变化，`eval.json` 覆盖缺锁、分母漂移和未授权写，`mutation.json` 固定“同时改 model/retriever”这一必须杀死的变异；provider/model 仍是 `NOT_RUN`。

## Failure and repair

TD-T13 的首个诊断点是 manifest diff，而不是模型理由：看到两个锁定字段变化时，`SINGLE-VARIABLE` 必须 exit 1；如果总分上涨但该 Oracle 没有失败，说明评测漏掉了归因风险。再检查报告 hash、重复次数与退款 blocker，确认 repair 没有把 fault 报告覆盖掉。

修复顺序是保存 baseline/fault 原件、撤掉混杂候选、恢复单变量 manifest，再让 owner 复核新一轮差异；回滚时恢复完整的 A 版本和索引快照，退款切片不进入试验流量。严禁改 expected、删 assertion、增加预算或把 NOT_RUN 误写为 live。

迁移练习把退款知识库换成编译器/仓库快照，但保留单变量、固定任务集、重复次数和 blocker 优先级；明确哪些数据与 Oracle 必须改变。完成条件是 fault 稳定变红、repair 恢复控制且所有 live/provider/真实用户分布仍标为 `NOT_RUN`；fixture 只证明实验契约能抓混杂，不能证明某模型更优。

## A/B 复盘与迁移

将一次升级拆成变量唯一性、可重放性、风险切片三个决定。先导出 candidate_sha、dataset_sha、retriever_sha、scorer_sha 和 run_id，再按任务 ID 配对，最后按退款、权限、引用正确性聚合。普通 FAQ 提升而退款事实错误增加时，交付应写成“低风险切片候选、退款切片回退”，并把完整 A manifest 交给 owner。若缓存命中、上下文截断或工具超时不同，差异只能标 UNKNOWN。

诊断顺序：总分上涨但高风险下降，查切片分母和逐题 flip；两组不可复现，查模型快照、Prompt、缓存、随机参数和工具响应；多字段同时变化，拒绝 run 后恢复单变量；重复运行胜负反转，增加预先约定的重复并报区间。迁移到编译器或仓库快照时只替换风险目录和独立 Oracle，保持单变量、分母和 NOT_RUN 边界。

交接工件：候选 B 更换模型后退款切片 48 条有 3 条旧政策引用；学员提交带 hash 的 ledger、回退 manifest 和 owner receipt。若供应商仅给浮动别名，必须标 UNKNOWN；后续工程师按 case_id 重放，不凭聊天记录复原。
