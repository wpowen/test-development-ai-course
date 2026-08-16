# TD-X101｜静态、架构、代码与依赖供应链门禁

## Professional problem：签名通过之前，依赖升级到底改变了什么

“扫描器没有报错”不是可发布结论。一次依赖升级可能同时改变传递依赖、许可证、构建脚本、网络访问和架构边界；代码评审若只看应用层 diff，就看不到供应链风险（risk）。测试开发要交付的不是一张绿色截图，而是能回答四个问题的证据链：构建输入能否由 commit 与 lockfile 唯一定位，SBOM 是否覆盖实际产物，依赖签名或 provenance 是否可验证，critical 发现是否有具名 owner 与到期例外。

本页采用的 method 是“代码差异 + SBOM + 来源证明 + 架构边界”联合检查。静态工具只负责发现候选；独立 Oracle 来自受保护的依赖策略、构建证明和 owner 注册表，不能让生成候选的同一模型把自己的解释批准为安全结论。

## Runnable action：跑一次可复现的供应链负控制

在课程材料目录依次执行三条命令，不要把 fault 的非零退出吞掉：

```bash
python3 advanced_quality_lab.py run --topic TD-X101 --phase baseline --report reports/td-x101-baseline.json
python3 advanced_quality_lab.py run --topic TD-X101 --phase fault --report reports/td-x101-fault.json
python3 advanced_quality_lab.py run --topic TD-X101 --phase repair --report reports/td-x101-repair.json
```

先核对报告中的 `prompt_manifest_hash` 与页面 Prompt 包一致，再读 `checks` 和 `failed_checks`。Prompt 只能把 commit、diff、SBOM、签名结果与 owner 信息整理成候选；Schema 强制保留来源引用和停止状态；Eval 检查版本、签名与责任闭环；Mutation 则注入“未签名依赖 + critical 发现无人负责”。

## Failure and repair：为什么 unsigned dependency 必须把门禁打红

Baseline 应退出 0，说明合成输入中的 `dependency_signed` 与 `critical_findings_owned` 可观察。Fault 应退出 1，并在 `failed_checks` 中明确列出这两项；如果仍是 0，优先诊断 runner 是否漏读 provenance、owner 表是否被默认补全、或断言是否只统计告警数量。Repair 恢复可验证签名并指定真实 owner 后再退出 0。这个 0→1→0 证明的是检测链能识别目标故障，不证明真实仓库没有恶意包、私有依赖或架构违规。

## 从报告形成工程决定

允许合并需要同时满足：产物可追到固定源码与锁文件，SBOM 与构建结果对应，签名/来源证明有效，critical 项有负责人和时限。任何一项缺失都应是 BLOCKED，而不是“低风险”。真实构建环境、私有制品库、语言扫描覆盖、误报率和组织例外政策仍为 UNKNOWN。

## 边界与练习

当前状态仅是 fixture-tested，`model_evidence=NOT_RUN`。它不是 live 集成结果、practitioner 评审、安全证明或 production 发布依据。练习时任选一个依赖升级，补写其 commit、lockfile、SBOM、provenance、critical owner 与 rollback ref；若其中任一字段无法取得，正确答案是停止并记录证据缺口。
