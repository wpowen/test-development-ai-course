# TD-P06：把测试用例 Prompt 做成可回归的软件包

## Professional problem — “生成 Playwright 脚本”不是专业提示词

直接把 PRD 交给模型并要求“生成完整 UI 自动化”，通常会跳过技术契约、风险层级和独立 Oracle；脚本失败后 healer 还可能按实际响应改断言、吞异常或加入 skip。TD-P06 的对象不是一段聊天文本，而是 Versioned Test-Generation Prompt Package：system/task/critic、固定 input、输出 Schema、Eval、Mutation、adapter contract 和 model manifest 必须共同版本化。

输入链必须从需求与技术文档经过前五页工件：Test Basis 确定 authority；Requirement Contract 固定规则；Review Questions 关闭 blocker；Risk Test Plan 选择方法与层级；Oracle Registry 提供独立 expected；TestPackage 给出 case 结构。Prompt 只能把这些批准字段转成代码候选，不能重新解释业务规则。adapter contract 约束允许访问的环境、数据、工具和副作用。

Schema 检查生成脚本元数据包含 test_id/requirement_ids/risk_ids/oracle_ids；静态 Eval 检查空断言、宽泛 catch、固定 sleep、条件 skip 与 mock 自证；运行 Eval 用权限、状态、重复副作用和超时 Mutation 检查检测力。Prompt 的质量由坏实现是否让测试变红衡量，不由代码长度或一次运行成功衡量。

## Runnable action — 运行 TD-P06 假绿自动化负控制

执行本页公开 cycle：

```bash
python3 pipeline.py page-cycle --page TD-P06 --report reports/TD-P06-cycle.json
```

预期 baseline=0、fault=1、repair=0，cycle 总体退出 0。fault 必须报告 `finding_id=FAKE_GREEN_AUTOMATION` 与 `Adapter swallowed an assertion or changed the approved oracle`。诊断时查看 adapter 是否吞掉 assertion、将失败改为 retry-success、或覆盖 Oracle；这些行为即使让测试绿，也必须判失败。

再检查 `page-prompts/TD-P06/manifest.json`：version 1.0.0，owner 仅 TD-P06，provider none、model_status NOT_RUN。Eval/Mutation 是版本化规范，不是已经运行过模型的证据。

## Failure and repair — healer 改测试还是改产品

若 fault 未红，先确认生成代码是否真的引用批准的 oracle_id，再检查 runner 是否只保存最终重试结果、是否忽略 skipped/assertion_count。正确 repair 是恢复断言传播和 adapter 权限，或修复产品实现；不得删除失败 case、放宽阈值、用当前响应重写 expected。

repair 后应保留 fault receipt 作为回归样例，使下一版 Prompt 或 adapter 仍需检出同类错误。该结果只证明离线 pipeline 的负控制可运行；没有真实模型生成、代码审查、浏览器/服务集成、从业者评审、live 或 production 证据，状态仍为 fixture-tested 与 NOT_RUN。
## 反例与诊断

adapter 捕获断言异常后继续执行，或 locator 变化后按实际文本改 expected，都能让流水线变绿却失去检测力。审查顺序是断言是否引用 oracle_id、异常是否向上传播、selected/skipped/retries 是否保留，最后用 TD-T06 mutation 验证目标缺陷确实打红。

