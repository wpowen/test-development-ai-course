# TD-P07：让每次运行可复现、可归因、可审计

## Professional problem — 绿色截图无法回答测了什么

一次“全部通过”的截图若没有 code SHA、basis/package 版本、环境、数据 hash、selected tests、skipped、retries 和原始结果，就不能支持发布决定。TD-P07 的 Run Manifest 固定运行身份，Attribution Pack 则把失败区分为 PRODUCT_FAIL、TEST_FAIL、ENV_BLOCKED、DEPENDENCY_BLOCKED 或 UNKNOWN；证据不足时不允许 healer 猜根因。

运行仍依赖上游链：需求与技术文档确定当前 basis；风险和方法决定 selection；Oracle Registry 决定 expected；TestPackage 与版本化 Prompt 生成候选实现；Eval 和 Mutation 证明 case 有检测力。Runner 必须保存每项 ID 与 hash，才能回答“是规则变了、实现坏了、测试坏了，还是环境阻断”。技术文档中的 Trace/日志位置用于观察，不自动成为业务 Oracle。

AI 可以聚合同一失败的日志、Trace 和历史模式，并提出可证伪假设；它不能为了转绿改断言、加 skip 或隐去 retry。归因结果必须引用 actual/expected、原始证据与责任人，UNKNOWN 必须可见地进入发布报告。

## Runnable action — 运行 TD-P07 不可归因运行负控制

从公开材料目录执行：

```bash
python3 pipeline.py page-cycle --page TD-P07 --report reports/TD-P07-cycle.json
```

预期 0/1/0。fault 报告应出现 `finding_id=UNATTRIBUTABLE_RUN` 与 `Run is missing pinned input, selection, retry, or raw evidence`。这不是普通字段缺失：缺少 pinned input 无法复现，缺少 selection/skipped 无法知道覆盖，缺少 retry 无法判断 flaky，缺少 raw evidence 无法独立确认归因。

学员应从 fault report 追到 page manifest 和原始 phase 报告，指出缺失字段会影响哪个下游决定。只补一张成功截图或一段模型总结不算 repair。

## Failure and repair — 先固定证据，再讨论根因

fault 未红时，检查 runner 是否用当前时间、默认 branch 或“全部测试”静默补字段，是否只保留最终成功尝试。正确 repair 是固定 input/build/environment hashes，显式记录 selected/skipped/retries，保留 stdout/stderr/actual，并在证据不足时输出 UNKNOWN，而不是伪造 PRODUCT_FAIL。

repair 退出 0 说明该合成运行现在可复现和归因；不说明企业 Trace 完整、保留策略合规或真实故障归因准确。模型没有运行，从业者、integration、live、publication、production 均未验证，证据仍限 fixture-tested。
## 反例与诊断

只看最后一次 PASS 会抹掉首败；没有 pinned code/data/Prompt hash 就把环境问题报成产品缺陷。归因必须依次核对版本与选择、独立 Oracle/actual、环境依赖和产品行为；缺少原始 stdout、Trace 或重试记录就保持 UNKNOWN。

