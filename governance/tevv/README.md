# AI TEVV 治理包

从 [ai-tevv-coverage-matrix.yaml](ai-tevv-coverage-matrix.yaml) 开始：它以 NIST 风险管理的 `GOVERN / MAP / MEASURE / MANAGE`、五个生命周期阶段和模型/检索/工具/应用/人类决策五层交叉建模。每个单元都必须填 `risk → scenario → oracle → data → owner → evidence → monitor → rollback`；不适用写 `N/A` 和理由，未取证写 `BLOCKED` 或 `NOT_RUN`。模板本身绝不构成测试证据。

然后复制并针对目标系统填写：

1. `judge-card.template.yaml`：先定义构念、盲法、偏差探针、人工 sentinel 与暂停条件；Judge 只能分流人工复核，不能覆盖安全、权限、事实或发布 blocker。
2. `gold-set-card.template.yaml`：将开发集、校准集和封存集隔离；保留每位标注者、分歧和仲裁，而不是只留下总分。
3. `../threshold-policy.yaml`：填入实测基线、风险 owner、有效期与重标定触发器；教学数字不能直接转成生产阈值。
4. `../validation-receipts/`：取得授权后才复制为实际收据并写真实输入/输出 hash。模板中的 `NOT_RUN` 不能修改为预期的 `PASS`。

本地结构校验：

```bash
node outputs/test-development-ai-v2/scripts/validate-tevv-governance.mjs
node --test outputs/test-development-ai-v2/scripts/validate-tevv-governance.test.mjs
```

三条学习路径位于 [courses/learning-paths/learning-paths.json](../../courses/learning-paths/learning-paths.json)：7 天 AI 质量入门、30 天测试开发迁移、60 天 AI Quality 系统建设。最后一条路径产出真实验证协议，不跳过授权与独立评审。
