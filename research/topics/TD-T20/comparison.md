# CI 分层门禁：两次独立研究 Run 对比

## Agreements

Run A 从 OpenAI Evals、lm-eval、HELM、SWE-bench、NIST 与 OpenTelemetry 建立组件图，强调 PR smoke、nightly regression 和 release-candidate Gate 的依赖顺序 的可观察输入、版本和接口。Run B 从 `high-risk refund 已错误承诺，但报告 job 未传播非零退出码。` 反推 test basis、negative control、stop state、owner 与恢复动作。两次都接受：先杀死 blocker，再检查风险切片阈值，最后才展示总体分。；都拒绝流畅输出、自评 Judge、公共榜单或 exit 0 作为完整证明。

## Disagreements

Run A 主张使用 `blocker count、high-risk pass rate、Gate latency 与当前 SHA 绑定` 组织报告，并保留逐题 raw evidence；它的优势是机制清晰，风险是架构过多会延迟学员第一次看到红灯。Run B 要求先做 0→1→0，再扩展统计和平台；它的优势是行动明确，风险是一个 mutation 不能代表真实场景覆盖。分歧还包括先讲架构还是先跑负控，以及度量应围绕技术组件还是业务风险组织。

## Adjudication

裁决是先展示具体失败和最小红灯，再用架构解释红灯的位置；指标必须服务具名决定而非反过来。Run A 的官方/论文来源可解释机制，但不能定企业阈值。Run B 的本地运行可证明 mutation sensitivity，但不能证明模型或生产质量。共同未知：真实云 CI、企业审批和模型执行未运行。

Comparator verdict: `ACCEPT-WITH-FIXTURE-BOUNDARY`。拒绝的替代结论包括 universal threshold、一次 PASS 等于稳定、hidden test 等于无污染，以及 fixture RC 等于 publication/production。
