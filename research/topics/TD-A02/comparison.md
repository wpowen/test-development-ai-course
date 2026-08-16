# AI API 协议：Streaming、Structured、Tool 与 Async independent comparison

## Agreements

Run A 从协议、标准和实现文档出发；Run B 从故障、测量、可靠性和职业责任出发。两者同意控制问题必须落到可观察字段：怎样证明 streaming、structured output、tool call 和 async job 的过程与终态都合法，且取消或重试不会重复副作用？ 两者也同意方法为：为 SSE、结构化输出、工具调用、异步任务建立四个独立状态机，分别检查过程和终态。，并要求 baseline-fault-repair 证明检测力。

两次研究都拒绝把一个流畅答案、一次延迟、一个 GPU 利用率或一个证书当完整证据。共同接受的 Oracle 是：事件顺序合法且唯一终态；Schema 与业务语义均通过；工具副作用至多一次；异步部分失败不得汇总为完成。。共同边界是 fixture-only，没有 live、practitioner 或 production 证据。

## Disagreements

Run A 更强调协议精确性和架构层次；Run B 更强调最小可执行工件、故障代价和 owner。Run A 希望先列完整指标；Run B 要求先写发布问题、错误成本和停止条件。对容量数字，Run B 进一步要求所有结果标记 fixture-only。对职业建议，Run B 要求显式 `employment_guarantee=false`。

来源也有张力：供应商文档较新但产品特定；标准和职业框架较稳定但不描述某一实现。最终不能把任一来源扩写成通用阈值、硬件承诺或就业结果。

## Adjudication

最终页先展示专业失败，再给最小机制、版本化 Prompt 包、确定性实验和迁移边界。主指标保留为 非法序列数、语义不变量失败数、副作用重复数、唯一终态率，但从属于具名决策。fault 为“模拟断流重试后再次执行同一工具，使 side_effect_count 从 1 变成 2。”，repair 为“恢复幂等键和状态查询，重放同一 request_id 只读取已有终态。”。比较 verdict 为 `ACCEPT-WITH-FIXTURE-BOUNDARY`。

未决项保持：真实代理缓冲、网络分片、工具服务和任务队列没有运行。。编辑审查确认命令、0/1/0、路径、数字、技术字段和成熟度没有被泛化正文覆盖。
