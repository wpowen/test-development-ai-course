# 职业能力迁移：岗位路径、自评证据与作品集边界 engineering blueprint

## Architecture and data flow

数据流为 `approved input fixture -> page manifest -> candidate observation -> independent exact-field Oracle -> JSON evidence -> human decision`。Prompt 包包含 system、task、critic、manifest、Schema、eval 和 mutation；默认 provider 为 none，模型执行为 NOT_RUN。runner 读取本页 manifest 和 input fixture；baseline 使用批准观察，fault 只应用 `fault_patch`，repair 恢复批准观察。每个阶段都保存输入 hash、manifest hash、检查字段、预期值、实际值、退出码和边界。

架构边界至少包括客户端、协议、模型/Prompt/Tool、Serving 阶段、Telemetry、可靠性和人类 Gate。对 TD-C01，边界替换为当前能力、目标责任、证据作品、差距计划和独立招聘决定。关键决策为：用 O*NET、SFIA、ISTQB、NIST 建责任基线，再按风险、代码/数据、AI Eval、Serving/Reliability、沟通治理五维自评。 任何 required file 缺失、hash 漂移或 Oracle 不一致都停止，禁止模型补写 UNKNOWN。

## Metrics and decisions

指标目录：有证据能力项比例、UNKNOWN 数、岗位边界完整率、红绿作品覆盖率。字段级 Oracle 是：岗位负责/协作/禁止边界清楚；自评分有 evidence_ref 或 UNKNOWN；90 天计划含 baseline-fault-repair；employment_guarantee=false。。fixture 判定采用精确相等，因为它的任务是证明合同检测力；真实系统必须改为基于业务损失、历史分布、风险切片和置信度的门槛。Goodput 只计质量、安全、完整性和 SLO 同时满足的请求，单位成功成本包含失败和重试。职业能力分数必须绑定 evidence_ref，否则为 UNKNOWN。

决策次序是输入与版本完整性、确定性 blocker、协议/过程、语义或质量、成本/容量、人工 Gate。平均分不得覆盖越权、重复副作用、安全拒绝错误、到达不守恒或就业承诺。报告 owner 是 page oracle owner；真实风险接受 owner 需要目标组织重新指定。

## Baseline failure repair

工作目录为 `site/public/materials/ai-serving-career`。运行 `python3 scripts/serving_lab.py --manifest manifests/TD-C01.json --mode baseline`，期望 exit 0；运行 fault，期望 exit 1；运行 repair，期望 exit 0；运行 cycle，外层 exit 0 且内部码严格为 `[0,1,0]`。反例：把证书数量当能力证据，并加入完成课程即可就业的承诺。 修复：删除就业承诺，把能力等级绑定可复验作品和 30/60/90 天复评。

诊断先检查 page_id、required files 和 hash，再检查 fault_patch 是否只改变声明字段，然后核对 expected/actual。禁止通过修改 expected、删除检查、吞掉 exit 1 或把 NOT_RUN 写成 PASS 来修复。本页实验为确定性离线 fixture：没有调用模型、供应商、GPU、队列、工具或招聘系统；PASS 只证明声明的 mutation 被门禁杀死。
