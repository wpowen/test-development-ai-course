# 普通 API 与 AI API：从确定性响应到版本化生成服务

## 给一次生成请求建立可重放版本指纹

用 request_id 与可见版本字段识别一次生成，而不伪造内部模型版本。普通 API Oracle 保留协议与副作用层；AI API 额外冻结 Prompt、Schema、Tool、采样和区域，因为这些变量会改变行为。

方法选择是：保留 HTTP、鉴权、错误和幂等共同契约，再增加生成 Manifest、行为 Oracle、Token/成本和可靠性层。 独立 Oracle 为：request_id 必须存在；公开版本变量齐全；不可见内部版本为 UNKNOWN；错误类别能驱动 retryable 决策。 这使学员能解释为什么一个测试变红，而不是只复制命令。学员最终交付 AI API 五层测试面、版本 Manifest 与错误分类表，并在工件中区分 desk-researched、fixture-tested、live-tested、practitioner-reviewed 与 production-validated。

### 用 request_id 与可见版本字段识别一次生成，而不伪造内部模型版本

先读取 page manifest 与批准输入；baseline 只验证本页 Oracle。随后注入：删除 request_id，并把不可见内部模型版本伪造为固定值。门禁必须退出 1 并保存 expected/actual；repair 执行：恢复 request_id，把内部版本改回 UNKNOWN，同时保留可见模型别名、Prompt、Schema 和 Tool 版本。重放时 Oracle、Prompt/Input/Schema/Eval/Mutation 版本均不得漂移。

### 为什么采用这条 Oracle 链

普通 API Oracle 保留协议与副作用层；AI API 额外冻结 Prompt、Schema、Tool、采样和区域，因为这些变量会改变行为。 受保护链条包括：request_id、公开模型别名、Prompt/Schema/Tool hash、错误分类和内部版本 UNKNOWN。

## 复制运行 TD-A01 的 0 → 1 → 0

```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-serving-career
python3 scripts/serving_lab.py --manifest manifests/TD-A01.json --mode baseline
python3 scripts/serving_lab.py --manifest manifests/TD-A01.json --mode fault
python3 scripts/serving_lab.py --manifest manifests/TD-A01.json --mode repair
python3 scripts/serving_lab.py --manifest manifests/TD-A01.json --mode cycle
```

预期内部结果为 `0 -> 1 -> 0`。打开 `evidence/TD-A01/` 下四份 JSON，核对 input hash、manifest hash、实际检查和 evidence level。先预测哪一个字段会变红，再运行；如果 fault 仍绿，立即判为测试资产无检测力。

## TD-A01 失败诊断与修复边界

失败：删除 request_id，并把不可见内部模型版本伪造为固定值。 修复：恢复 request_id，把内部版本改回 UNKNOWN，同时保留可见模型别名、Prompt、Schema 和 Tool 版本。 若 baseline 缺 request_id，先修采集；若 fault 未因伪造版本变红，检查 version visibility 规则是否进入 Oracle；repair 只能恢复 UNKNOWN 标记，不能捏造供应商内部值。

本页的 Remaining Unknown 是：供应商内部模型修订、路由、限额和区域实现没有公开可观察证据。本页只验证 TD-A01 的离线 mutation 能被门禁拒绝；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。模型、供应商、GPU、队列、集成环境、实践者复核、学习者完成、线上服务和生产系统均未运行，不能把 fixture 结果外推为真实行为或 SLA。

### Worked example、迁移条件与可复用工件

退款解释接口同一请求连续出现两个不同结果时，先把 request_id、model_alias、prompt_hash、schema_hash、tool_version 和 region 写入一行 Manifest，再把每次差异归因到可见变量或 UNKNOWN。若只保存最终文本，无法判断是 Prompt 改动、动态路由还是模型内部修订；五层测试面必须分别给出 owner 和证据链接。

把 fixture 迁移到真实 SDK 前，先固定 SDK 版本、鉴权租户、模型别名解析时间、采样参数与区域，并约定哪些供应商字段永远不可见。测试报告必须把“可复现”拆成协议可复现、输入可复现、路由可见性和行为复现四个结论，任何一个缺证据都只能写 UNKNOWN。

交付一份带 hash 的 Manifest、一张错误分类表和一张版本可见性矩阵。复盘时抽查三条失败请求，确认每条都能从 request_id 找到原始输入、Oracle、重试决定和负责人；不能用 200、非空或漂亮文本替代版本证据。
