# AI Serving 指标：TTFT、TPOT、ITL、Goodput 与单位成功成本

## 从 Token 事件重算延迟、Goodput 与成本

从首 Token、相邻 Token 与所有到达记录手工复算 TTFT、ITL、Goodput 和 cost_per_success。只有原始时间戳和完整到达分母能区分排队、生成和质量失败；GPU 利用率或平均总耗时不能替代用户与业务口径。

方法选择是：从请求、首 Token、逐 Token 和终态时间戳计算延迟；Goodput 只计质量、安全、完整性和 SLO 同时合格的请求。 独立 Oracle 为：TTFT、TPOT、ITL 可由原始事件重算；Goodput 分母含所有到达；单位成功成本含失败和重试。 这使学员能解释为什么一个测试变红，而不是只复制命令。学员最终交付 指标定义卡、Token 事件夹具与单位成功成本报告，并在工件中区分 desk-researched、fixture-tested、live-tested、practitioner-reviewed 与 production-validated。

### 从首 Token、相邻 Token 与所有到达记录手工复算 TTFT、ITL、Goodput 和 cost_per_success

先读取 page manifest 与批准输入；baseline 只验证本页 Oracle。随后注入：把质量失败请求计入 Goodput，并从单位成功成本中删除失败尝试费用。门禁必须退出 1 并保存 expected/actual；repair 执行：恢复全部到达分母、quality_pass 条件和所有尝试成本。重放时 Oracle、Prompt/Input/Schema/Eval/Mutation 版本均不得漂移。

### 为什么采用这条 Oracle 链

只有原始时间戳和完整到达分母能区分排队、生成和质量失败；GPU 利用率或平均总耗时不能替代用户与业务口径。 受保护链条包括：首/末 Token 时间戳、ITL 分布、全到达分母、质量条件和全部尝试成本。

## 复制运行 TD-A03 的 0 → 1 → 0

```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-serving-career
python3 scripts/serving_lab.py --manifest manifests/TD-A03.json --mode baseline
python3 scripts/serving_lab.py --manifest manifests/TD-A03.json --mode fault
python3 scripts/serving_lab.py --manifest manifests/TD-A03.json --mode repair
python3 scripts/serving_lab.py --manifest manifests/TD-A03.json --mode cycle
```

预期内部结果为 `0 -> 1 -> 0`。打开 `evidence/TD-A03/` 下四份 JSON，核对 input hash、manifest hash、实际检查和 evidence level。先预测哪一个字段会变红，再运行；如果 fault 仍绿，立即判为测试资产无检测力。

## TD-A03 失败诊断与修复边界

失败：把质量失败请求计入 Goodput，并从单位成功成本中删除失败尝试费用。 修复：恢复全部到达分母、quality_pass 条件和所有尝试成本。 若 baseline 公式不可复算，先修事件单调性和 token_count；若 fault 仍绿，检查质量失败是否错误进入 Goodput、失败尝试费用是否被遗漏；repair 重算分母而不改阈值。

本页的 Remaining Unknown 是：fixture 时间戳和成本不代表任何模型、GPU、地区或供应商。本页只验证 TD-A03 的离线 mutation 能被门禁拒绝；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。模型、供应商、GPU、队列、集成环境、实践者复核、学习者完成、线上服务和生产系统均未运行，不能把分位数或成本数字外推。

### Worked example、迁移条件与可复用工件

同一批请求中，短聊天首 Token 很快但长报告 TPOT 变慢；不要用平均总延迟覆盖差异。学习者从 raw event 逐行标出 arrival、queue_end、first_token、last_token、quality_pass 和 cost_attempt，再计算 TTFT、TPOT、ITL、Goodput 与 cost_per_success，最后按场景和质量切片。

接入真实 telemetry 前先定义时钟来源、Token 计数口径、流式空事件、重试归属和质量判定 owner。p95 只有在样本量、时间窗、请求类型和失败分母一起固定时才可比较；指标卡要写明统计窗口和缺失字段的 UNKNOWN 处理，不能拿 GPU 利用率替代用户体感。

交付公式卡、原始事件 CSV、机器可读重算报告和一张分母审计表。审查者随机删除一条失败费用或一个质量标记，报告应立即显示 Goodput 或单位成功成本变化；如果删除字段仍然不影响结论，说明指标 Oracle 没有真正消费证据。
