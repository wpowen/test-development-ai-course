# AI Serving 指标：TTFT、TPOT、ITL、Goodput 与单位成功成本 independent comparison

## Agreements

Run A 从协议、标准和实现文档出发；Run B 从故障、测量、可靠性和职业责任出发。两者同意控制问题必须落到可观察字段：怎样让 TTFT、TPOT、ITL、Goodput 和 cost_per_success 的时间点、分母、切片与质量条件都可重算？ 两者也同意方法为：从请求、首 Token、逐 Token 和终态时间戳计算延迟；Goodput 只计质量、安全、完整性和 SLO 同时合格的请求。，并要求 baseline-fault-repair 证明检测力。

两次研究都拒绝把一个流畅答案、一次延迟、一个 GPU 利用率或一个证书当完整证据。共同接受的 Oracle 是：TTFT、TPOT、ITL 可由原始事件重算；Goodput 分母含所有到达；单位成功成本含失败和重试。。共同边界是 fixture-only，没有 live、practitioner 或 production 证据。

## Disagreements

Run A 更强调协议精确性和架构层次；Run B 更强调最小可执行工件、故障代价和 owner。Run A 希望先列完整指标；Run B 要求先写发布问题、错误成本和停止条件。对容量数字，Run B 进一步要求所有结果标记 fixture-only。对职业建议，Run B 要求显式 `employment_guarantee=false`。

来源也有张力：供应商文档较新但产品特定；标准和职业框架较稳定但不描述某一实现。最终不能把任一来源扩写成通用阈值、硬件承诺或就业结果。

## Adjudication

最终页先展示专业失败，再给最小机制、版本化 Prompt 包、确定性实验和迁移边界。主指标保留为 TTFT、TPOT、ITL、Goodput、cost_per_success，但从属于具名决策。fault 为“把质量失败请求计入 Goodput，并从单位成功成本中删除失败尝试费用。”，repair 为“恢复全部到达分母、quality_pass 条件和所有尝试成本。”。比较 verdict 为 `ACCEPT-WITH-FIXTURE-BOUNDARY`。

未决项保持：fixture 时间戳和成本不代表任何模型、GPU、地区或供应商。。编辑审查确认命令、0/1/0、路径、数字、技术字段和成熟度没有被泛化正文覆盖。
