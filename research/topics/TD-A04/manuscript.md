# AI Serving 负载与容量：从 Token 分布到 SLO 拐点

## 用到达守恒寻找 fixture 容量拐点

逐级核对 planned=completed+failed+dropped+queued，再以 Goodput 判断停止点。open-loop 才能保持外部到达并暴露 coordinated omission；closed-loop 只适合观察单用户上限，不能单独给出容量。

方法选择是：open-loop 保持外部到达并记录 dropped arrivals；closed-loop 仅诊断单用户上限；阶梯实验每级只改到达率。 独立 Oracle 为：计划到达数等于完成、失败、dropped 和仍排队之和；SLO 破坏后停止；容量以 Goodput 判定。 这使学员能解释为什么一个测试变红，而不是只复制命令。学员最终交付 工作负载 Manifest、阶梯实验与 fixture-only 容量报告，并在工件中区分 desk-researched、fixture-tested、live-tested、practitioner-reviewed 与 production-validated。

### 逐级核对 planned=completed+failed+dropped+queued，再以 Goodput 判断停止点

先读取 page manifest 与批准输入；baseline 只验证本页 Oracle。随后注入：删除 dropped arrivals，并只用完成请求作为容量分母。门禁必须退出 1 并保存 expected/actual；repair 执行：恢复到达账本和排队项，把失败与 dropped 纳入分母。重放时 Oracle、Prompt/Input/Schema/Eval/Mutation 版本均不得漂移。

### 为什么采用这条 Oracle 链

open-loop 才能保持外部到达并暴露 coordinated omission；closed-loop 只适合观察单用户上限，不能单独给出容量。 受保护链条包括：workload hash、planned arrivals、dropped/queued、风险切片、Goodput 和停止恢复窗口。

## 复制运行 TD-A04 的 0 → 1 → 0

```bash
cd outputs/test-development-ai-v2/site/public/materials/ai-serving-career
python3 scripts/serving_lab.py --manifest manifests/TD-A04.json --mode baseline
python3 scripts/serving_lab.py --manifest manifests/TD-A04.json --mode fault
python3 scripts/serving_lab.py --manifest manifests/TD-A04.json --mode repair
python3 scripts/serving_lab.py --manifest manifests/TD-A04.json --mode cycle
```

预期内部结果为 `0 -> 1 -> 0`。打开 `evidence/TD-A04/` 下四份 JSON，核对 input hash、manifest hash、实际检查和 evidence level。先预测哪一个字段会变红，再运行；如果 fault 仍绿，立即判为测试资产无检测力。

## TD-A04 失败诊断与修复边界

失败：删除 dropped arrivals，并只用完成请求作为容量分母。 修复：恢复到达账本和排队项，把失败与 dropped 纳入分母。 若 baseline 到达不守恒先修生成器账本；若 fault 隐去 dropped 仍绿，容量门禁没有消费完整分母；repair 恢复 dropped/queued 后只报告 fixture 拐点。

本页的 Remaining Unknown 是：没有网络、模型、GPU、调度器或生产流量，不能外推真实容量。本页只验证 TD-A04 的离线 mutation 能被门禁拒绝；model、integration、practitioner、learner、live 与 production 均 NOT_RUN。模型、供应商、GPU、队列、集成环境、实践者复核、学习者完成、线上服务和生产系统均未运行，容量拐点与安全余量只属于本 fixture。

### Worked example、迁移条件与可复用工件

容量阶梯包含短聊天、长报告和工具请求三种 Token 分布，open-loop 每秒计划到达数固定，closed-loop 只作为单用户诊断。学习者每一级记录 completed、failed、dropped、queued，并解释为何 dropped 被隐藏时 Goodput 会虚高，以及为何变慢后 closed-loop 会自动减小压力。

迁移到真实压测前锁定 workload hash、输入/输出 Token 分布、缓存命中、到达率、并发、稳态时长、恢复窗口和停止条件。容量报告要把裸 RPS、SLO 合格吞吐和质量约束 Goodput 分开，并明确安全余量属于该版本、该流量切片，不能写成机器或供应商承诺。

交付 workload Manifest、每级到达守恒表、阶梯曲线和停止/恢复记录。复盘者应能从计划到达数重新加总四类结果，并定位第一条 SLO 破坏发生在哪一级；若总数对不上，先修负载生成器或账本，不得继续解释拐点。
