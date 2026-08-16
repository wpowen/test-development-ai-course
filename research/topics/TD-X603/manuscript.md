# TD-X603｜长期 Memory、个性化与语义缓存隔离

## Professional problem：一次“贴心记忆”可能跨越用户和版本边界

### Wave-2 memory/cache state machine

把写入、读取、遗忘、租户隔离、TTL、命中和陈旧内容记录为状态转移；命中缓存不能绕过当前 ACL，遗忘必须留下可验证 tombstone。真实用户同意、隐私删除 SLA 和跨区域存储证据尚未运行，迁移时必须逐项补齐。

长期 Memory 与语义缓存把旧交互带进新请求，风险（risk）不只是答案过期。错误的 tenant key 会泄露别人的偏好，缺少同意或目的限制会让不该保存的数据进入记忆，模型/Prompt/知识版本变化后继续命中旧缓存则会绕过新规则。测试开发要证明身份隔离、写入授权、TTL、版本失效和删除传播，而不是只看 cache hit rate。

本页 method 将写入、读取、失效、删除四条路径分开建模，并为 user、tenant、purpose、policy version 和 knowledge version 建立复合键。独立 Oracle 来自身份/权限系统、同意记录和删除回执，不允许模型根据文本相似度自行推断授权。

## Runnable action：复现跨用户命中与陈旧缓存

```bash
python3 advanced_quality_lab.py run --topic TD-X603 --phase baseline --report reports/td-x603-baseline.json
python3 advanced_quality_lab.py run --topic TD-X603 --phase fault --report reports/td-x603-fault.json
python3 advanced_quality_lab.py run --topic TD-X603 --phase repair --report reports/td-x603-repair.json
```

Prompt 只能在已授权身份和目的内提出读取/写入候选；Schema 保存 tenant、user、版本、TTL、来源和 stop state；Eval 检查 user isolation、cache version、同意与删除状态；Mutation 构造跨用户命中并把缓存版本降为陈旧。

## Failure and repair：命中率下降不是这里的失败重点

Baseline 退出 0，说明合成键和版本规则闭合。Fault 应退出 1，`user_isolation` 与 `cache_version_current` 明确变红。若仍返回 0，检查 cache key 是否遗漏 tenant/user、相似度层是否在权限检查之前返回、或版本缺失是否被当成兼容。Repair 恢复用户隔离和当前版本，并重放同一断言后退出 0。

0→1→0 证明的是这两类反例被检测，不证明真实存储已完成所有副本删除，也不证明个性化体验有效。

## 报告里的停止条件

无同意、身份不匹配、目的越界、删除回执缺失或版本无法验证时，都应拒绝写入/读取并记录 BLOCKED。跨用户泄露必须单独计数，不能被总体命中率稀释。真实留存法律、用户预期、相似阈值、长期漂移、跨区域备份和 production 删除传播仍为 UNKNOWN。

## 边界与练习

本页为 fixture-tested，`model_evidence=NOT_RUN`；没有 live 数据库、practitioner 隐私评审或 production 删除验证。练习时为一次“记住用户饮食偏好”设计 consent、purpose、tenant/user key、TTL、模型版本失效和删除回执，并写出一次跨用户 mutation；不要用“系统通常不会这样”代替断言。
