# TD-P01：先冻结 Test Basis，再允许任何生成

## Professional problem — PRD 与技术设计冲突时谁说了算

订单取消案例同时给出 PRD-v3、technical-design-a13f 和 OpenAPI-v7。PRD 规定已支付未发货订单可以取消、已发货拒绝；旧技术设计却仍保留 SHIPPED 可取消路径。测试开发此时不是“综合三份文档”，而是先确定每份资料的 authority：PRD 决定已批准业务语义，技术设计说明当前实现机制，OpenAPI 描述接口表面。技术设计不能因为更接近代码就反向覆盖产品规则。

Test Basis Pack 为每份资料记录 owner、版本、hash、有效期、敏感等级与稳定 locator。每条 claim 带 source_refs；没有依据的性能时限写 UNKNOWN；有效来源冲突写 BLOCKED 并指定 product-owner-order。只有裁决写回新版本后，风险分析才可继续。这里控制的风险是“整个测试集保护了错误规则”，因此方法不是多生成 case，而是 authority matrix、双来源冲突检查和 traceability gate。

从文档到测试的链必须完整：PRD/技术设计/OpenAPI 先形成带 authority 的 basis；basis 决定资金、权限、状态风险；风险决定状态转换、决策表或契约测试；独立 Oracle 来自批准的业务规则与状态不变量，而非当前接口响应；case 记录 requirement/risk/oracle IDs；Prompt 只抽取和标冲突；Schema 检查结构，Eval 检查引用和 UNKNOWN/BLOCKED，Mutation 则把旧设计提升为权威，确认门禁能抓到 SOURCE_CONFLICT。

## Runnable action — 运行 TD-P01 来源冲突负控制

进入公开材料目录并执行本页 exact-manifest 命令：

```bash
python3 pipeline.py page-cycle --page TD-P01 --report reports/TD-P01-cycle.json
```

预期 cycle 总体退出 0，但内部三相必须是 baseline=0、fault=1、repair=0。baseline 证明批准后的 basis 可消费；fault 报告必须出现 `finding_id=SOURCE_CONFLICT` 与 `Test Basis contains contradictory authorities`；repair 只允许通过恢复 authority 和一致来源解决，不能删除冲突资料或让模型选“更合理”的版本。

学员应打开 `page-prompts/TD-P01/manifest.json`，核对 owner_page_ids 恰好为 TD-P01、Prompt 版本 1.0.0、provider none、model_status NOT_RUN；再检查 fault 报告同时保存 prompt/input hash。若报告只有 FAIL 而没有冲突来源，仍无法交给产品 owner 裁决。

## Failure and repair — 怎样区分来源故障与实现故障

若 fault 未变红，先检查 Mutation 是否真的制造了两个有效 authority 的相反规则，其次检查 pipeline 是否只验证 JSON 结构而漏掉语义优先级。若错误被归因为实现 409/200 不一致，说明检查位置太晚：TD-P01 应阻断的是测试依据，不是接口行为。

正确修复是形成一条带 owner 和 close evidence 的裁决，并产生新的 baseline；旧资料保留为 SUPERSEDED 证据。修复后 receipt 仍只写 `fixture-tested`，Prompt 仍是 `model_status=NOT_RUN`。该循环没有目标公司内部权威顺序、从业者盲审、真实模型、集成、live 或 production 证据，不能提升成熟度。
## 反例与诊断

把旧技术设计当成唯一依据会漏掉 PRD 的 SHIPPED 禁止取消规则；让模型“综合”冲突会让责任人和 source_ref 消失。诊断顺序是 source-manifest 唯一性、authority/有效期、conflict gate、下游旧 receipt；修复必须由具名 owner 写回新裁决版本。

