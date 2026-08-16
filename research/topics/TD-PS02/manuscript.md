# TD-PS02 · 用业务 Mutation 审问 Schema 样例

## 用业务 Mutation 审问 Schema 样例

支付意图 JSON 即使完全满足 Schema，也可能允许零金额、错币种或过期确认。学习者要证明测试能杀死破坏性契约变化，而不是展示生成器产出了多少合法对象。

Schema、属性与 mutation 分工，是因为结构合法、业务不变量和检测力是三种不同结论；固定 seed 与 shrink 只负责复现反例。 首个交付物是约束来源表、最小正反例、独立属性 Oracle 和被杀死的 mutation 记录。

四个 Oracle 分别是：

1. amount 必须大于零且币种受商户支持
2. 客户只能操作自己的支付意图
3. 过期意图不能确认且状态不变
4. 删除 required 或放宽金额必须杀死 mutation

## 复制运行 TD-PS02 的三阶段证据链


```bash
cd outputs/test-development-ai-v2/site/public/materials/api-ai-automation
python3 scripts/specialty_lab.py --manifest manifests/TD-PS02.json --mode cycle
```

TD-PS02 的 cycle 应严格记录 `0 → 1 → 0`；支付 Schema 的 fault 若没有变红，应检查删除 required 或放宽 amount 的 Mutation 是否进入属性断言，而不是继续增加随机样例。


进入材料目录后运行 TD-PS02 的 cycle 命令。支付意图实验先锁定商户币种、金额合法域、过期状态和独立属性 Oracle，再执行批准契约、破坏性 Schema fault 与原契约修复。Repair 只有在同一 seed 下重新拒绝零金额和过期确认时才算 exit 0；必须同时保存生成样例、最小反例、mutation outcome 与 cycle receipt。

Prompt 包的任务是：读取 OpenAPI 和历史缺陷，只输出风险约束、最小正反例、固定 seed 与 mutation 映射；不得把 Schema 通过写成业务通过。本页 system 禁止把 JSON 合法等同业务合法，task 只生成带约束来源的正反例和属性候选，critic 查找自造币种、复制实现 expected 与未覆盖 mutation。模型输出保持 NOT_RUN，Eval 使用固定 Input/Schema/Mutation 验证拒答与边界；真实接入需记录生成工具版本、seed、原始样例和 shrink 过程。

换成目标 API 时先重写 amount/currency/merchant 的合法域，再保持属性 Oracle 与 mutation 分类不变；只有在隔离服务中复现并收缩同一破坏性变更后，才把反例固化为回归，而不能沿用课程币种表。目标生成器对 OAS dialect 的实现差异和生产商户配置 不能由学习者猜测，必须向具名 owner 获取或保留 Unknown。

## 诊断 TD-PS02 的假绿与恢复失败

本页的三类代表故障是：删除 merchant_id required；允许 amount 等于零；改变错误模型。一次只破坏一个 Schema 或跨字段约束，观察对应属性是否杀死变化。若全部 case 同时失败，先核对生成域和 fixture；Fault 绿通常表示断言只看结构，Repair 红则检查 seed、过期时钟或 shrink 后反例没有复原。

AI 可以建议字段边界与候选属性，但无权定义商户规则、更新独立 expected 或宣布 mutation 等价。现有结果仅说明支付意图 fixture 能杀死声明变化，目标 OAS dialect、商户配置与生成器行为仍是 Unknown；完成物应包含约束来源、Prompt/Eval/Mutation 包、0/1/0 报告和真实契约替换步骤。

TD-PS02 的 fixture-tested 验收要求学习者展示被 shrink 的最小支付反例、对应属性来源以及破坏性 Schema 变化为何被特定断言杀死，而不是汇报生成数量。

## Wave5 证据边界

本页的 static schema/属性清单与支付意图 mutation fixture 只证明 required、跨字段约束及反例 shrink 的 Oracle 形状。provider/model、目标 API integration、practitioner review、learner observation、live、production、publication 均 NOT_RUN；生成分布和业务覆盖率不能从样例推断。
