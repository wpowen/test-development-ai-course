# AI Serving 韧性：限流、Timeout、Retry、Fallback 与 Degradation

## 用四类预算约束重试与降级

让 429 与工具超时叠加，核对 Retry-After、attempt/time/token-cost 与副作用预算。错误先分类，随后传播 deadline；次数、总时间、Token/费用和副作用共同限制恢复，fallback 还要经过独立质量门禁。

方法选择是：先分类错误并传播 deadline；次数、总时间、Token/费用和副作用共同限制重试；fallback 必须独立评测。 独立 Oracle 为：429 尊重 Retry-After；attempt/time/cost 均不超预算；同一幂等键副作用至多一；fallback quality gate 通过才可使用。 这使学员能解释为什么一个测试变红，而不是只复制命令。学员最终交付 韧性状态机、重试预算、故障矩阵与恢复证据，并在工件中区分 desk-researched、fixture-tested、live-tested、practitioner-reviewed 与 production-validated。

### 让 429 与工具超时叠加，核对 Retry-After、attempt/time/token-cost 与副作用预算

先读取 page manifest 与批准输入；baseline 只验证本页 Oracle。随后注入：忽略 Retry-After，重试八次，并静默启用未通过质量门禁的 fallback。门禁必须退出 1 并保存 expected/actual；repair 执行：恢复三次以内、deadline/cost budget、幂等查询和安全失败；未过质量门禁则转人工。重放时 Oracle、Prompt/Input/Schema/Eval/Mutation 版本均不得漂移。

### 为什么采用这条 Oracle 链

错误先分类，随后传播 deadline；次数、总时间、Token/费用和副作用共同限制恢复，fallback 还要经过独立质量门禁。 受保护链条包括：错误类别、Retry-After、四类 retry budget、幂等账本、fallback 质量和用户提示。

## 复制运行 TD-A06 的 0 → 1 → 0

```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-serving-career
python3 scripts/serving_lab.py --manifest manifests/TD-A06.json --mode baseline
python3 scripts/serving_lab.py --manifest manifests/TD-A06.json --mode fault
python3 scripts/serving_lab.py --manifest manifests/TD-A06.json --mode repair
python3 scripts/serving_lab.py --manifest manifests/TD-A06.json --mode cycle
```

预期内部结果为 `0 -> 1 -> 0`。打开 `evidence/TD-A06/` 下四份 JSON，核对 input hash、manifest hash、实际检查和 evidence level。先预测哪一个字段会变红，再运行；如果 fault 仍绿，立即判为测试资产无检测力。

## TD-A06 失败诊断与修复边界

失败：忽略 Retry-After，重试八次，并静默启用未通过质量门禁的 fallback。 修复：恢复三次以内、deadline/cost budget、幂等查询和安全失败；未过质量门禁则转人工。 若 baseline 已超预算先修策略；若八次重试与坏 fallback 未打红，检查所有预算是否进入 gate；repair 不得静默切模型，未过质量门禁就安全失败或转人工。

本页的 Remaining Unknown 是：真实供应商配额、Retry-After、fallback 模型质量和生产恢复没有运行。本页只验证 TD-A06 的离线 mutation 能被门禁拒绝；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。模型、供应商、GPU、队列、集成环境、实践者复核、学习者完成、线上服务和生产系统均未运行，不能把预算或降级结论外推为生产恢复保证。

### Worked example、迁移条件与可复用工件

主模型先返回 429，工具提交已成功但客户端超时，随后 fallback 质量门禁失败。学习者按错误类别建立状态机，计算 attempt、deadline、token、cost 和副作用四类预算，说明为什么查询既有 task 状态比再次提交安全，以及为什么 fallback 失败时必须安全失败或转人工。

真实限流策略要读取 Retry-After 并确认租户配额、幂等语义和 fallback 模型的质量/安全基线。预算必须在网关、SDK、工具层共享一个请求级 deadline；任何一层自行重试都会制造放大。恢复演练还要记录用户提示、降级原因、费用和回滚 owner，不能只看可用率。

交付错误矩阵、预算计算表、幂等副作用账本和降级质量切片。复盘者随机把 Retry-After 改短、把质量门禁置 false 或增加一次重试，cycle 应分别打红并指出放大、成本或质量原因；修复后再以同一 request_id 验证唯一终态。
