# TD-F01 Engineering Blueprint

## Architecture and data flow

入口页采用双链结构。知识链是“职业责任 → 研发测试九阶段 → 需求/技术双文档 → 风险与方法 → 独立 Oracle → 工件与消费者 → 发布责任 → 生产回流 → AI 能力迁移”。执行链是“learner profile → deterministic self-check → baseline report → fault mutation → expected failure → repair profile → repaired report → learning route”。两条链在职业责任地图汇合，确保课程讲解与脚本验证同一组边界。

公开材料目录固定为 `materials/profession-reality`。`manifest.json` 精确声明 owner_page_ids 仅为 TD-F01、工作目录、required_files、baseline/fault/repair/cycle 命令、退出码和报告。`profession_self_check.py` 只用 Python 标准库，不访问网络、不读取隐含 cwd 之外资源、不调用模型。三个输入分别表示合格基线、故障注入与修复。报告保存 checks、failed_checks、provider none、model_status NOT_RUN 与证据边界。

Prompt 包位于 `prompts/TD-F01`，版本 1.0.0。manifest 精确绑定 prompt、input、schema、eval，并声明 provider none。Prompt 要求先重建职业、后提出 AI 方案；输出生命周期、双文档读法、方法/Oracle、工件、发布边界、AI 迁移、学习路线和内部未知。Schema 使用 JSON Schema 2020-12，生命周期至少九项、工件至少六项、AI 迁移至少五项。Eval 有六个正常案例和四个 Mutation，但当前只定义评测契约，不伪造模型结果。

页面所有技术内容使用 typed block。Prompt block 必须同时提供 version/promptPath/manifestPath/inputFixturePath/outputSchemaPath/evaluationPath；command block 必须精确匹配公开 manifest 的 cycle step、workingDirectory、expectedExitCode 和 expectedArtifacts；职业责任 JSON 使用 config block；生命周期图使用不可运行 diagram，明确 verification 而不提供复制按钮。

## Metrics and decisions

确定性执行的第一指标是 failure cycle：baseline exit 0、fault exit 1、repair exit 0，cycle exit 0。第二指标是责任检查覆盖：九个 checks 都必须在 baseline/repair 为 true，在 fault 中至少 independent_oracle 和 human_release_owner 为 false。第三指标是契约完整性：manifest owner 必须恰好为 TD-F01，Prompt provider=none、model_status=NOT_RUN，Eval cases≥5、mutations≥3。

课程内容指标不是字符数，而是决策覆盖。学习者必须能说明五类角色边界，重建九阶段链，分别给出需求与技术文档阅读问题，选择一个风险匹配方法，建立一个独立 Oracle，为一个工件填写 owner/version/source/acceptance/consumer，并指定发布/Waiver/回滚责任。每个学习路线步骤必须交付工件并通过故障注入，不以“阅读完毕”作为完成。

状态决策 fail-closed。脚本失败、公开材料缺失、manifest 不精确、typed block 退化、Prompt 契约缺项、研究来源少于十个或材料 ZIP 与 canonical 不一致时，TD-F01 不得保持 fixture-tested。即便所有确定性门禁通过，也只能声明 PASS_FIXTURE；模型效果、从业者适用性、公司集成、线上表现、发布成熟度全部保持 NOT_RUN/Unknown。

## Baseline failure repair

Baseline 输入把职业责任写成“让质量风险可见并可决定”，同时把 requirements 与 technical_design 纳入 test basis，冲突 action 为 BLOCKED，Oracle 来源为批准的规则，方法由 risk_and_failure_mode 决定，工件有 owner/consumer，发布由 named_human_owner 决定，AI 只做 candidate_generation_and_evidence_aggregation，生产反馈进入 regression_and_eval_assets。脚本应退出 0 并写 PASS_FIXTURE。

Fault 输入模拟课程最危险的九个误解：用例计数代替职业责任；只读取技术设计；让模型裁决权威冲突；把 implementation_output 当 Oracle；根据 favorite_tool 选择方法；工件没有 owner/consumer；由 ai_agent 发布；赋予 unbounded_autonomy；事故后只 close_ticket。脚本应退出 1，写 FAIL_EXPECTED，并列出所有失败检查。若 fault 返回 0，说明门禁无法检测课程自己警告的错误，整个页面应失败。

Repair 输入不仅恢复 baseline，还加入 production_history 作为补充 test basis。脚本再次退出 0。Cycle 总报告保存三阶段 observed_exit_codes 和 phase 详细证据。此红绿修复证明的是规则检查器对确定性夹具的敏感性，不证明学习者在真实工作中会作出正确判断，也不证明模型 Prompt 输出会满足 Schema/Eval。

材料闭包通过 canonical、public、ZIP 三份成员清单与逐字节内容比较验证。ZIP 顶层必须是 `profession-reality/`，不得额外包含缓存或临时文件。页面 executability audit 必须确认公开 manifest 和 required_files 存在，命令精确绑定，不引用 `courses/`，工作目录显式。最后运行 typecheck 与内容验证，任何上层失败都记录实际阻断，不用旧 PASS 覆盖。
