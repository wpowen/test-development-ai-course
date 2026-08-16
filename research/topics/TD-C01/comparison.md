# 职业能力迁移：岗位路径、自评证据与作品集边界 independent comparison

## Agreements

Run A 从协议、标准和实现文档出发；Run B 从故障、测量、可靠性和职业责任出发。两者同意控制问题必须落到可观察字段：怎样把已有测试能力迁移到可验证的新责任，并用作品证明，而不承诺就业、薪资或某一岗位必然存在？ 两者也同意方法为：用 O*NET、SFIA、ISTQB、NIST 建责任基线，再按风险、代码/数据、AI Eval、Serving/Reliability、沟通治理五维自评。，并要求 baseline-fault-repair 证明检测力。

两次研究都拒绝把一个流畅答案、一次延迟、一个 GPU 利用率或一个证书当完整证据。共同接受的 Oracle 是：岗位负责/协作/禁止边界清楚；自评分有 evidence_ref 或 UNKNOWN；90 天计划含 baseline-fault-repair；employment_guarantee=false。。共同边界是 fixture-only，没有 live、practitioner 或 production 证据。

## Disagreements

Run A 更强调协议精确性和架构层次；Run B 更强调最小可执行工件、故障代价和 owner。Run A 希望先列完整指标；Run B 要求先写发布问题、错误成本和停止条件。对容量数字，Run B 进一步要求所有结果标记 fixture-only。对职业建议，Run B 要求显式 `employment_guarantee=false`。

来源也有张力：供应商文档较新但产品特定；标准和职业框架较稳定但不描述某一实现。最终不能把任一来源扩写成通用阈值、硬件承诺或就业结果。

## Adjudication

最终页先展示专业失败，再给最小机制、版本化 Prompt 包、确定性实验和迁移边界。主指标保留为 有证据能力项比例、UNKNOWN 数、岗位边界完整率、红绿作品覆盖率，但从属于具名决策。fault 为“把证书数量当能力证据，并加入完成课程即可就业的承诺。”，repair 为“删除就业承诺，把能力等级绑定可复验作品和 30/60/90 天复评。”。比较 verdict 为 `ACCEPT-WITH-FIXTURE-BOUNDARY`。

未决项保持：课程不能证明招聘需求、薪资、晋升、地区机会或个体适配。。编辑审查确认命令、0/1/0、路径、数字、技术字段和成熟度没有被泛化正文覆盖。
