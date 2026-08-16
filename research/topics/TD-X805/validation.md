# TD-X805 验证记录

## Research coverage

十个打开来源覆盖职业、度量、反证、治理、实现与 AI 技术 lane；来源只支持局部机制。

## Claim traceability

每个采用结论能够回到 source-pack、双 run、comparison、Prompt manifest 和三阶段报告。

## Runnable lab

逐页 baseline/fault/repair 预期退出 0/1/0，fault 不得吞异常或改 Oracle。

## Independent comparison

R1 与 R2 来源不重叠，独立 reviewer 记录共识、分歧、裁决与 Unknown。

## Publication verdict

仅为 fixture-tested；模型、从业者、公平/安全专业审查、真实集成和生产发布均 NOT_RUN。

- source-pack：10 个来源均为 opened；覆盖至少 5 个 evidence lane、5 个 source family 和 4 类 source type。
- research-runs：R1/R2 来源不重叠，comparison 由独立 reviewer 合并。
- Prompt 包：Prompt/Input/Schema/Eval/Mutation/Critic/model-config 全部版本化；eval 覆盖八类；owner 在包外。
- 可执行性：baseline 预期 0，fault 预期 1，repair 预期 0；不得吞 fault 退出码。
- 边界：model_evidence=NOT_RUN；真实模型、用户、生产、公平/安全/合规与从业者复核未完成。
- UNKNOWN：真实流量、MDE、实验伦理、标签容量、长期效果和业务阈值。
