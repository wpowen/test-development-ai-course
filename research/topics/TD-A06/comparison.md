# AI Serving 韧性：限流、Timeout、Retry、Fallback 与 Degradation independent comparison

## Agreements

Run A 从协议、标准和实现文档出发；Run B 从故障、测量、可靠性和职业责任出发。两者同意控制问题必须落到可观察字段：怎样保证 429、5xx、超时和断流下重试有界、工具副作用不重复，fallback 不会无声突破质量与安全底线？ 两者也同意方法为：先分类错误并传播 deadline；次数、总时间、Token/费用和副作用共同限制重试；fallback 必须独立评测。，并要求 baseline-fault-repair 证明检测力。

两次研究都拒绝把一个流畅答案、一次延迟、一个 GPU 利用率或一个证书当完整证据。共同接受的 Oracle 是：429 尊重 Retry-After；attempt/time/cost 均不超预算；同一幂等键副作用至多一；fallback quality gate 通过才可使用。。共同边界是 fixture-only，没有 live、practitioner 或 production 证据。

## Disagreements

Run A 更强调协议精确性和架构层次；Run B 更强调最小可执行工件、故障代价和 owner。Run A 希望先列完整指标；Run B 要求先写发布问题、错误成本和停止条件。对容量数字，Run B 进一步要求所有结果标记 fixture-only。对职业建议，Run B 要求显式 `employment_guarantee=false`。

来源也有张力：供应商文档较新但产品特定；标准和职业框架较稳定但不描述某一实现。最终不能把任一来源扩写成通用阈值、硬件承诺或就业结果。

## Adjudication

最终页先展示专业失败，再给最小机制、版本化 Prompt 包、确定性实验和迁移边界。主指标保留为 attempt/time/token/cost budget、call amplification、fallback quality，但从属于具名决策。fault 为“忽略 Retry-After，重试八次，并静默启用未通过质量门禁的 fallback。”，repair 为“恢复三次以内、deadline/cost budget、幂等查询和安全失败；未过质量门禁则转人工。”。比较 verdict 为 `ACCEPT-WITH-FIXTURE-BOUNDARY`。

未决项保持：真实供应商配额、Retry-After、fallback 模型质量和生产恢复没有运行。。编辑审查确认命令、0/1/0、路径、数字、技术字段和成熟度没有被泛化正文覆盖。
