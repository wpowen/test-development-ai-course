# Trace-to-Regression：两次独立研究 Run 对比

## Agreements

Run A 从 OpenAI Evals、lm-eval、HELM、SWE-bench、NIST 与 OpenTelemetry 建立组件图，强调 Trace 隔离、字段脱敏、最小触发条件、领域 Oracle 与回归追踪 的可观察输入、版本和接口。Run B 从 `直接复制含 PII 的 Trace，或过度脱敏后丢失越权工具触发条件。` 反推 test basis、negative control、stop state、owner 与恢复动作。两次都接受：不能稳定重放或未获隐私/领域批准的事件只能作调查线索。；都拒绝流畅输出、自评 Judge、公共榜单或 exit 0 作为完整证明。

## Disagreements

Run A 主张使用 `conversion、redaction、replayability 与 recurrence 分开计算` 组织报告，并保留逐题 raw evidence；它的优势是机制清晰，风险是架构过多会延迟学员第一次看到红灯。Run B 要求先做 0→1→0，再扩展统计和平台；它的优势是行动明确，风险是一个 mutation 不能代表真实场景覆盖。分歧还包括先讲架构还是先跑负控，以及度量应围绕技术组件还是业务风险组织。

## Adjudication

裁决是先展示具体失败和最小红灯，再用架构解释红灯的位置；指标必须服务具名决定而非反过来。Run A 的官方/论文来源可解释机制，但不能定企业阈值。Run B 的本地运行可证明 mutation sensitivity，但不能证明模型或生产质量。共同未知：真实保留期限、隐私分类和生产 Trace 平台未接入。

Comparator verdict: `ACCEPT-WITH-FIXTURE-BOUNDARY`。拒绝的替代结论包括 universal threshold、一次 PASS 等于稳定、hidden test 等于无污染，以及 fixture RC 等于 publication/production。
