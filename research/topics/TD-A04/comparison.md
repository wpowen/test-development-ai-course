# AI Serving 负载与容量：从 Token 分布到 SLO 拐点 independent comparison

## Agreements

Run A 从协议、标准和实现文档出发；Run B 从故障、测量、可靠性和职业责任出发。两者同意控制问题必须落到可观察字段：怎样固定到达率、Token 长度、缓存、场景和质量条件，找到 fixture 的 Goodput 拐点且不发生 coordinated omission？ 两者也同意方法为：open-loop 保持外部到达并记录 dropped arrivals；closed-loop 仅诊断单用户上限；阶梯实验每级只改到达率。，并要求 baseline-fault-repair 证明检测力。

两次研究都拒绝把一个流畅答案、一次延迟、一个 GPU 利用率或一个证书当完整证据。共同接受的 Oracle 是：计划到达数等于完成、失败、dropped 和仍排队之和；SLO 破坏后停止；容量以 Goodput 判定。。共同边界是 fixture-only，没有 live、practitioner 或 production 证据。

## Disagreements

Run A 更强调协议精确性和架构层次；Run B 更强调最小可执行工件、故障代价和 owner。Run A 希望先列完整指标；Run B 要求先写发布问题、错误成本和停止条件。对容量数字，Run B 进一步要求所有结果标记 fixture-only。对职业建议，Run B 要求显式 `employment_guarantee=false`。

来源也有张力：供应商文档较新但产品特定；标准和职业框架较稳定但不描述某一实现。最终不能把任一来源扩写成通用阈值、硬件承诺或就业结果。

## Adjudication

最终页先展示专业失败，再给最小机制、版本化 Prompt 包、确定性实验和迁移边界。主指标保留为 到达守恒、Goodput 拐点、安全余量、dropped arrivals，但从属于具名决策。fault 为“删除 dropped arrivals，并只用完成请求作为容量分母。”，repair 为“恢复到达账本和排队项，把失败与 dropped 纳入分母。”。比较 verdict 为 `ACCEPT-WITH-FIXTURE-BOUNDARY`。

未决项保持：没有网络、模型、GPU、调度器或生产流量，不能外推真实容量。。编辑审查确认命令、0/1/0、路径、数字、技术字段和成熟度没有被泛化正文覆盖。
