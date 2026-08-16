# TD-T06 研究简报：候选测试与变异检测力

**Controlling question**：如何把 AI 生成的测试限定为候选，并用独立 Oracle、基线与 mutation 证明它确实能检测行为错误，而不是只追求代码覆盖或让生成器自我批准？

研究覆盖专业测试设计、生成式工具、mutation 框架、覆盖率反证、职业与教学证据。产物必须版本化 Prompt/Input/Schema/Eval/Mutation，区分 killed、survived、no coverage，并保留人工处置。实验只验证确定性 fixture；真实模型、真实代码库与生产收益不在本次证据范围。
