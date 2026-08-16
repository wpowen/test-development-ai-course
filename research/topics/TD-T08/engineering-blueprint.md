# TD-T08 工程蓝图

## Architecture and data flow
流水线包含 append-only evidence store、normalizer、feature extractor、cluster candidate engine、hypothesis workspace、experiment ledger 与 cause gate。采集器把测试报告、日志、trace、截图和环境清单写入原始存储，计算哈希并绑定 run/test/trace/commit/environment。normalizer 只能建立标准字段和引用，不能覆盖 raw payload。cluster engine 保存算法或 prompt 版本、使用特征、成员 raw refs、异常值和冲突字段。hypothesis workspace 允许模型提出症状摘要、可能机制与下一实验，但 cause gate 只接受独立实验结果。

数据流为 `raw immutable events -> normalized linked view -> candidate cluster -> hypothesis -> controlled experiment -> repair/replay -> verified or unknown`。缺 trace、版本混合、环境混合、采样未知或原始工件不可读取时，cluster 可以用于路由，但 cause 状态锁定 UNKNOWN。隐私过滤在采集入口执行，并保存字段删除策略；不可逆脱敏不能伪装成完整原始证据。Prompt/Input/Schema/Eval/Mutation 与 model config 版本化，模型拒答或截断不触发自动因果结论。

## Metrics and decisions
数据质量指标包括 raw reference completeness、hash verification、trace coverage、version purity、environment purity 和 retention availability。存在独立标注集时，聚类指标报告 pair precision/recall、false merge、false split、unclustered 与 unknown preservation；没有标注集不写准确率。诊断指标包括 time-to-hypothesis、experiment completion、replay success、verified-cause rate 和 rollback contradiction。任何节省时间指标都必须有真实工作流基线。

决策状态机不可跳级：OBSERVATION 可进入 CLUSTER；cluster 产生 HYPOTHESIS；只有预先定义、可重放的控制实验或修复翻转证据才能进入 VERIFIED_CAUSE。症状相似、模型置信度或同一个异常文本不足以升级。冲突或缺证据进入 UNKNOWN，并列出下一采集动作。生成模型和 reviewer 不得是同一审批主体；聚类器无权删除异常值。

## Baseline failure repair
Baseline 读取合成 failure events，按 trace 分组；同组事件 raw refs 完整、commit/environment 单一，报告保留成员并安排 pool-size-only replay，退出 0。Fault 清空 trace ID 并把 commit 改为 mixed，所有事件表面症状仍相似，但证据闭合失败；runner 返回 cause_status UNKNOWN、next experiment NOT_RUN 和退出 2。若此时输出“连接池耗尽已确认”，门禁失败。

Repair 恢复真实 trace、commit 与环境引用，在相同 fixture 上重放后退出 0。这里的 verified 仅是合成实验状态机达到条件，不代表生产根因能力。真实 OpenTelemetry 接入、采样洞、时钟偏移、隐私、AI grouping 精度、事故修复与从业者审批均未运行，发布前必须独立验证。
