# TD-T07 研究简报：测试数据方法选择

**Controlling question**：面对边界、离散规则交互、跨大量输入成立的不变量和未知输入攻击面时，如何在 boundary、combination、property 与 fuzz 之间做可解释选择，并保存 seed、约束、最小反例和回放环境？

研究不追求“多生成数据”，而是建立问题形状到方法的决策合同。覆盖专业测试技术、NIST 组合测试、Hypothesis/Schemathesis、AFL++、随机数可复现边界、AI 生成限制和教学案例。实验使用业务有效域与独立不变量，真实服务安全和生产代表性仍未知。
