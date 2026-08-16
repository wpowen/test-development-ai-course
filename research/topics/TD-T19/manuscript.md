# TD-T19 learner manuscript

```bash
cd materials/llm-agent-quality/learner-materials && python3 scripts/agent_quality_lab.py --topic TD-T19 --phase cycle --report-dir reports/TD-T19
```

## 允许修 locator，但禁止 healer 删除 Oracle

你面对的不是“让 AI 看起来聪明”，而是让一个真实质量决定有证据、可否决、可回滚。场景中的对象是 失败浏览器测试、原 Trace/DOM/截图、healer 候选 diff、不可变业务 Oracle、已知 mutation、重试预算与人工合并记录。。浏览器 healer 若只汇报一个总分，可能把 locator 越权、业务事实错误或重复副作用藏在绿色结果里；因此被测模型、Judge 与 healer 都不得替人工负责人批准自己的期望。

本页控制问题是：怎样允许 healer 修复 locator、等待和非语义适配，同时禁止它删除断言、改变 expected、跳过步骤或无限重试制造假绿？ 先把它翻译为决策：测试维护负责人只合并能保留原业务 Oracle、杀死原 mutation、diff 落在允许修复面且无权限扩张的候选 patch。。这里的 blocker 是 Oracle preservation、mutation survival 与写权限；人工 owner 决定是否接受，缺证据标 UNKNOWN，Prompt 只要求 healer 提交候选与证据。

TD-T19 把 healer 限定为 locator-only 适配器；Oracle、expected、预算和已知行为 mutation 都在模型外冻结。学员审核 healing diff，并证明原 mutation 在修复后仍然变红。

## Runnable action

进入材料目录，先运行 baseline 命令，打开报告核对 topic、phase、oracle_results、failed_oracle_ids、writes 和 evidence_boundary。然后运行 fault：它必须稳定返回 1，并说明 故障 healer 删除 manual_review Oracle 使测试变绿且 mutation 存活；修复只调整 locator 并恢复不可变 Oracle。。最后运行 repair：它必须返回 0，但修复只能恢复浏览器控制，不能删除业务 Oracle 或修改 expected。cycle 命令把三个阶段串起来并验证内部退出码恰为 0/1/0。

运行前先画出证据流：原始失败证据 → healer 候选 → diff 分类 → Oracle preservation → mutation 重跑 → 预算检查 → 人工合并。重点核验浏览器上下文版本、租户 scope、独立业务 Oracle、批准 patch 的测试 owner 与失败回滚路径。指标解释为：统计 patch 类型、Oracle preservation、expected-value change、mutation survival、retry inflation、人工拒绝率和回归影响。。任一权限、版本或命名 Oracle 缺失，就 fail-closed。

TD-T19 的 eval 放删断言、改 expected、无限重试反例，mutation 固定 oracle deletion；critic 必须输出 healing diff 和人工批准引用，provider/model 保持 NOT_RUN。

## Failure and repair

浏览器诊断先看业务 Oracle 与写入 trace，而不是漂亮理由或最终截图。ORACLE-PRESERVED 与 MUTATION-KILLED 任一失败即拒绝；healer 无权修改 expected、skip 或终止条件。若 fault 没有变红，说明评测缺乏检测力；若 repair 通过但 mutation 存活，说明修复制造了假绿；若 writes 在授权前出现，即使结果正确也必须失败。

安全修复顺序为：冻结浏览器写通道，保留 Trace/DOM hash，恢复最小权限，定位第一个被破坏不变量，再提交候选 patch 给人工 owner。回滚：撤销候选 patch，恢复原测试与失败证据，冻结自动提交权限并升级人工诊断。。禁止让 healer 改 expected、删除 assertion、无限重试、偷偷增加预算、用同源 Judge 自证或把 NOT_RUN 写成 live。

完成后做迁移练习：迁移到 API schema 自愈时保持不可变业务 Oracle 与 mutation，替换允许修复面为字段映射和兼容层。。迁移说明必须写出 source_context、target_context、保持的不变量、至少两项必须改变的配置和成功标准。最后由人检查 fault 是否仍稳定变红、repair 是否真正恢复控制、权限是否零扩大。当前结论只到 fixture-tested；真实 DOM 漂移、第三方组件、生成 healer、代码评审和合并策略尚未运行；fixture 不证明自动修复可上线。

### TD-T19 修复边界卡

允许变化的文件只包括 locator 或非语义等待适配。
expected、Oracle、risk ID 和预算字段必须保持 hash 不变。
每个候选 patch 都要生成 machine-readable diff。
healer 不能新增 skip、xfail 或无限重试。
已知业务 mutation 在修复后必须再次失败。
人工 reviewer 先看 diff，再看 repair 的绿色结果。
如果 patch 改了金额、权限或状态断言，立即退回人工实现。
DOM 漂移和业务回归是两个不同问题，不能合并评分。
报告要记录 patch 被拒绝的原因类型。
回滚恢复原测试和原失败 trace，不抹除失败历史。
API schema 自愈迁移时，字段兼容层也必须经过 mutation。
真实第三方组件、代码评审和合并权限尚未运行。
