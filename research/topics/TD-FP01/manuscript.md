# Prompt 小白第一课：从一句指令到可验证 Prompt Package

## Wave-4 完整 worked walkthrough

以“评审退款需求是否具备测试入口”为例：system 声明只能依据输入、缺证据必须 BLOCKED；task 只提取行为、前置条件、边界、依赖、风险和未知项。context/input 固定 requirement_version、技术文档 locator、tenant 与三条脱敏材料，并把到账时限标为 Unknown。schema 要求 decision、behaviors、evidence、inferences、unknowns、source_refs、owner、stop_state，枚举只允许 READY_FOR_TEST、BLOCKED、SOURCE_CONFLICT、SEMANTIC_UNKNOWN。

Eval 分层检查：确定性规则检查 source_ref、Unknown 和 stop_state 一致；语义 Oracle 检查是否把人工复核误写为自动批准；人工 owner 只裁决政策冲突和风险接受。Mutation-1 删除 source_ref，Mutation-2 清空 unknowns，Mutation-3 把外部网页句子混入 system，Mutation-4 把人工复核改成自动退款；每次只改一个字段，四个 fault 都必须退出 1。Repair 恢复合同后用同一 manifest 重跑 0→1→0，保存 candidate、failed_checks、repair、manifest hash 和 owner receipt。

迁移到登录、发票或知识库场景时，只替换输入、locator、Oracle 和 owner；system 的证据分栏、停止枚举、独立判定和 mutation 仍保留。provider=none、model_status=NOT_RUN 时，所有模型效果、真实业务结论、learner 观察和生产发布仍是 Unknown/NOT_RUN。

## Wave-3 可迁移练习

把需求评审包迁移到新的技术文档时，保留 system 的权限与 Evidence/Inference/Unknown 规则，只替换业务目标、版本 locator、owner 和消费者。删除 source_ref、把 Unknown 改成确定结论、混入外部指令三个负例，必须分别命中追踪性、状态完整性和信任边界；交付差异表、失败报告和 NOT_RUN receipt。可复制的是包结构，Oracle、权限和业务停止条件必须重新定义。

## Professional problem

### Wave-2 learner reuse contract

把需求评审包迁移到退款场景时，保留 Evidence/Inference/Unknown 规则，只替换业务目标、权威 locator、风险 owner 与输出消费者。学习者必须提交 input.json、结构化候选、差异表和 receipt；没有真实模型调用时写 provider=none、model_status=NOT_RUN。可复制的是包的组合顺序和字段合同，必须重定义的是 Oracle、权限、业务规则与停止条件。

The release meeting begins with a tempting but weak statement: “the assistant answered correctly in my chat.” For `TD-FP01`, that statement cannot answer 如何把聊天式指令拆成可版本化、可评价、可故障注入且保留人工决定权的专业 Prompt Package？ The concrete failure is more useful: 把 system、任务、输入和自评混成一段提示词，模型补写缺失规则并把自己的输出再次判为正确。 A test developer must turn that failure into a stable artifact and a decision, not another conversation transcript.

Plain mental model: treat the AI application as a chain of evidence-bearing components. The relevant chain here is system、task、context/input、output/schema、eval、mutation、manifest、receipt 与 stop state 的责任分离. Each link has an input, a version, an observable result and an owner. If a link is unknown, downstream confidence must stop rather than be filled with plausible prose.

The key working rule is: 先冻结来源、输出 Schema、独立 Eval 与停止状态，再允许模型生成候选；静态包没有原始模型输出时保持 NOT_RUN。 This preserves ordinary testing ideas—test basis, independent Oracle, negative control and regression evidence—while adapting them to probabilistic output and AI-specific components.

### Smallest useful example

The package models a refund assistant with synthetic fields. Baseline observations satisfy three explicit expectations. The fault phase changes exactly one high-risk field; the checker must return exit 1 and save expected versus actual. Repair restores the observation and must return exit 0 without weakening the contract. The artifact is 版本化 Prompt Package、适配卡和 0/1/0 运行收据.

### What to inspect

Do not stop at `verdict`. Read the topic ID, phase, evidence level, model execution status, injected mutation, each field check, decision and remaining unknowns. The useful measurement is 角色分离、工件闭包、source_ref 覆盖、stop-state 保留与 mutation detection. Its meaning is bounded to the fixed fixture; it is not a universal quality score.

## Runnable action

Working directory: `site/public/materials/ai-foundations-eval`.

```bash
python3 scripts/run_lab.py --topic TD-FP01 --phase baseline
python3 scripts/run_lab.py --topic TD-FP01 --phase fault
python3 scripts/run_lab.py --topic TD-FP01 --phase repair
```

Expected sequence is exit `0 → 1 → 0`. The baseline and repair reports contain `verdict=PASS`; the fault report contains `verdict=FAIL` and names the injected mutation. Open all three JSON files and compare the same field. If the shell hides exit codes, run each command separately and inspect `$?` immediately.

Before revealing the fault report, predict which field should turn red and why it changes the release decision. This prediction prevents passive command copying and checks whether the learner understands the mechanism.

## Failure and repair

The meaningful failure is not a syntax error. It represents: 把 system、任务、输入和自评混成一段提示词，模型补写缺失规则并把自己的输出再次判为正确。 If the fault phase remains green, first verify that the manifest command and topic ID match, then confirm the mutation changed the intended field, then confirm exit 1 is propagated. Do not repair by changing the expected contract, deleting the case or relabelling FAIL as a warning.

Repair re-establishes the accepted observation. After the green rerun, compare hashes or the JSON diff and verify the expected values did not change. Record what the fixture still cannot prove: 不同模型对指令层级、长上下文和结构化输出的实际遵循度尚未运行。

### Transfer challenge

Source context is a synthetic refund assistant. Target context is an internal incident-summary assistant. The invariant is that the evidence chain, blocker and human authority remain explicit. Change at least two things: replace the refund risk slice with incident severity/containment, and replace policy evidence with runbook/telemetry references. Success criterion: the new fault changes a consequential field, returns exit 1, preserves raw evidence and does not invent an owner or threshold.

### Evidence boundary

This is `PASS-FIXTURE` only. No model, provider, retriever, tool, identity system or practitioner was run. The prompt package is inspectable but `NOT_RUN`; it demonstrates how inputs, Schema, eval and mutation should be versioned, not that a model follows it.

## Editorial review

The manuscript preserves commands, paths, status words, numbers, exact artifact and unknowns. It does not claim complete course, live validation, professional approval or production readiness. Topic-specific language was checked against other Wave-2 pages; shared viewer metadata remains shared, while the failure, decision, artifact and diagnosis are specific to `TD-FP01`.
