# 普通 API 与 AI API：从确定性响应到版本化生成服务 independent comparison

## Agreements

Run A 从协议、标准和实现文档出发；Run B 从故障、测量、可靠性和职业责任出发。两者同意控制问题必须落到可观察字段：怎样证明一次 AI API 结果来自哪组协议、模型、Prompt、上下文、采样、Schema、工具和区域变量，而不伪造供应商内部版本？ 两者也同意方法为：保留 HTTP、鉴权、错误和幂等共同契约，再增加生成 Manifest、行为 Oracle、Token/成本和可靠性层。，并要求 baseline-fault-repair 证明检测力。

两次研究都拒绝把一个流畅答案、一次延迟、一个 GPU 利用率或一个证书当完整证据。共同接受的 Oracle 是：request_id 必须存在；公开版本变量齐全；不可见内部版本为 UNKNOWN；错误类别能驱动 retryable 决策。。共同边界是 fixture-only，没有 live、practitioner 或 production 证据。

## Disagreements

Run A 更强调协议精确性和架构层次；Run B 更强调最小可执行工件、故障代价和 owner。Run A 希望先列完整指标；Run B 要求先写发布问题、错误成本和停止条件。对容量数字，Run B 进一步要求所有结果标记 fixture-only。对职业建议，Run B 要求显式 `employment_guarantee=false`。

来源也有张力：供应商文档较新但产品特定；标准和职业框架较稳定但不描述某一实现。最终不能把任一来源扩写成通用阈值、硬件承诺或就业结果。

## Adjudication

最终页先展示专业失败，再给最小机制、版本化 Prompt 包、确定性实验和迁移边界。主指标保留为 Manifest 完整率、UNKNOWN 诚实率、错误分类覆盖率，但从属于具名决策。fault 为“删除 request_id，并把不可见内部模型版本伪造为固定值。”，repair 为“恢复 request_id，把内部版本改回 UNKNOWN，同时保留可见模型别名、Prompt、Schema 和 Tool 版本。”。比较 verdict 为 `ACCEPT-WITH-FIXTURE-BOUNDARY`。

未决项保持：供应商内部模型修订、路由、限额和区域实现没有公开可观察证据。。编辑审查确认命令、0/1/0、路径、数字、技术字段和成熟度没有被泛化正文覆盖。
