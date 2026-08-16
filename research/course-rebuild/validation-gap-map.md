# 课程重建验证缺口图

日期：2026-08-12  
对象：`outputs/test-development-ai-v2/` 当前 85 页课程  
用途：`course-source-assimilation-and-beginner-rebuild` 的输入；本文件只记录验证结果、失败映射和 RED 测试设计，不修改课程、Skill 或验证器。

## 1. 当前结论

### Evidence

执行：

```bash
python3 outputs/career-ai-course-factory/scripts/validate_career_package.py \
  outputs/test-development-ai-v2
```

结果：退出码 `1`，共 `177` 条新门禁失败：

| 类别 | 数量 | 直接证据 | 结论 |
|---|---:|---|---|
| capability/evidence 全局合同 | 7 | validator 输出首 7 项 | 当前包缺 capability profiles、professional evidence、source ledger、learner contract、visual manifest、status registry；已有 capability declaration 只有 `artifact-transformation` 且缺 owner/evidence |
| 连续学习编号 | 170 | 85 页 × 每页 `display_number` 缺失和连续性失败 | `tutorial/tutorial-site.json` 的 85 个 page 都没有 `display_number`，不能证明用户看到的是 `1..N` |
| 合计 | 177 | 原始 stdout `/tmp/course_validate.out` | fail-closed；不可沿用旧 85/85 editorial/executability 结论为内容完整或小白可用 |

课程现有页面字段中，`display_number` 出现次数为 `0/85`；稳定 `page_id`、前后链和 `architecture` 存在，但它们不能替代 learner-facing 编号、主题视觉清单或理解/复用收据。

### Inference

- 缺少全局清单意味着当前包没有可审计的来源逐项裁决、学习者可用性、视觉顺序和人类 verdict；不能推断这些内容“其实已写在页面里”。
- 85 页都有旧 `architecture` 字段（79 个不同节点签名），但没有 repository-owned SVG/Mermaid 的逐页 source path、节点/边/来源引用合同；因此不能把旧 architecture JSON 解释成新视觉门禁已通过。
- 当前 `research/capability-declarations.json` 只有 `artifact-transformation/TD-P02`，而用户材料触发的职业演进和 Agent 架构义务必须通过冻结来源 inventory 触发 `career-evolution-system` 和 `agent-architecture-testing`，不能用现有一条声明覆盖。

### Unknown

- 尚未在 course lane 完成两份用户源文件的冻结副本和 198 sections/413 atoms 的逐项裁决；这些是下一阶段必须执行的输入，不是当前课程已有证据。
- 未进行真实小白学习测试、真实模型、企业/飞书租户、Playwright/Cypress 双适配或从业者盲评；即便静态合同修复，也只能先保持 `fixture-tested`/`NOT_RUN`。

## 2. 失败到具体产物/代码路径的映射

| 阻断 | 当前产物证据 | 验证器路径 | 重建动作 |
|---|---|---|---|
| capability declaration 不完整 | `research/capability-declarations.json` 仅有 `artifact-transformation`，缺 `owner`/`evidence` | `validate_professional_capabilities()`，约 `validate_career_package.py:678-790` | 为每个页面建立 `capability-profiles.json` 与 `capability-declarations.json` 精确覆盖；为职业演进、Agent 架构分别声明能力并挂 adapter |
| 页面能力证据缺失 | `research/capability-profiles.json` 不存在 | `validate_professional_capabilities()`，约 `790-805` | 85 个 promised page 一页一条 capability profile；禁止 `none`、标题推断或空能力 |
| 专业 evidence 缺失 | `research/professional-evidence.json` 不存在 | 同上，约 `790-805` | 每页分开记录 model/integration/clean-room/practitioner/learner 五个 lane；缺证据保持 `NOT_RUN` |
| 用户源闭包缺失 | `research/user-input/` 尚无冻结副本；`research/source-assimilation-ledger.json` 不存在 | `validate_source_assimilation_contract()`，约 `418-508` | 先复制并 hash 两份用户源，再生成 ledger；每个 section/atom 必须有 disposition、target、rationale、owner、evidence；最终 `unaccounted_ids=[]` |
| 小白理解/直接复用缺失 | `research/learner-usability-reuse.json` 不存在 | `validate_learner_usability_and_reuse_contract()`，约 `521-603` | 每页补 prerequisites、assumed knowledge、terms introduced/used、plain mental model、worked/counterexample、action、故障修复、理解检查、可复用工件 |
| 视觉顺序/主题视觉缺失 | `research/visual-sequence-manifest.json` 不存在；旧 page architecture 不是该 manifest | `validate_visual_sequence_contract()`，约 `606-675` | 每页建立唯一 `.svg/.mmd/.mermaid` source path，至少 5 nodes/4 edges、alt/caption/source refs，且 prerequisites 先于 consumer |
| 人类 verdict 缺失 | `research/status-registry.json` 不存在 | `validate_status_registry()`，约 `900+` | 对每个审计范围写 current/superseded、scope hash、artifact hash、as_of、evidence refs；禁止旧 PASS 覆盖新阻断 |
| learner 编号缺失 | `tutorial/tutorial-site.json` 85/85 page 无 `display_number` | tutorial page validation，约 `2758-2780` | 保持 stable `page_id`，新增唯一 learner `display_number=1..85`；不得使用 `order`、模块序号或旧目录号 |
| source-detected career/Agent obligation 未接入 | 当前没有 source ledger，且声明只有 artifact transformation | `validate_software_testing_adapter_contract()`，约 `678-740` | ledger 生成后自动识别 `career-evolution-system` / `agent-architecture-testing`；补 `research/software-testing-career-agent-adapter.json` |

## 3. 必须加入课程重建的 RED 测试

这些测试不是让当前课程“先绿”，而是先证明每个缺口能被门禁捕获。测试应在课程重建任务中以最小 fixture 逐个变异，确认红灯后再补最小产物。

### A. 来源完整性

1. **遗漏一个 source atom 必须失败**
   - RED 变异：从完整 ledger 删除一个 atom。
   - 预期：`source assimilation atom inventory does not exactly match frozen sources`。
   - 依据：`validate_source_assimilation_contract()` 的 exact-set 比较。
2. **`UNMAPPED` 或空 disposition 必须失败**
   - RED 变异：将任一 atom disposition 改为 `UNMAPPED`/空值。
   - 预期：invalid/unmapped disposition 或 coverage 非 `PASS`。
3. **`adapted` 没有 learner target 必须失败**
   - RED 变异：清空 `target_refs`。
   - 预期：`adapted item needs learner-facing target_refs`。
4. **源文件 hash/locator 漂移必须失败**
   - RED 变异：冻结源内容或 section 行号改变但不重建 ledger。
   - 预期：frozen source hash drift 或 locator/content hash drift。

### B. 小白理解与直接复用

5. **术语先用后定义必须失败**
   - RED 变异：在第一页 `terms_used` 加入尚未 `terms_introduced` 的 `RAG`。
   - 预期：`uses terms before introduction`。
6. **可复用工件缺适配步骤/验证字段必须失败**
   - RED 变异：删除 artifact 的 `editable_fields`、`adaptation_steps` 或 `validation.expected_evidence`。
   - 预期：对应 non-empty/validation 错误。
7. **没有输入/期望观察的 worked example 或 counterexample 必须失败**
   - RED 变异：删除 `expected_observation`。
   - 预期：`worked_example/counterexample needs input and expected_observation`。
8. **无故障诊断闭环或理解检查必须失败**
   - RED 变异：删除 `repair`、`rerun_check` 或 comprehension check 的 `common_misconception`。
   - 预期：对应 failure diagnosis/comprehension 错误。

### C. 编号、依赖、视觉

9. **编号跳跃必须失败**
   - RED 变异：将第二页 `display_number` 改为 `76`。
   - 预期：`display_number must be contiguous 1..N`。
10. **视觉路径复用必须失败**
    - RED 变异：让两个不相关页面使用同一个 `source_path`。
    - 预期：`reuses a visual path across unrelated pages`。
11. **视觉文件不是仓库源或缺节点/边必须失败**
    - RED 变异：使用 `.png`、不存在的路径，或把 nodes/edges 降到门槛以下。
    - 预期：repository-owned SVG/Mermaid、missing file、5 nodes/4 edges 错误。
12. **前置页面晚于消费者必须失败**
    - RED 变异：把 prerequisite 指向同页或后续页。
    - 预期：`prerequisite must appear earlier in navigation`。

### D. 职业演进与 Agent 架构

13. **声明 Agent 架构能力但缺 adapter 必须失败**
    - RED 变异：加入 `agent-architecture-testing` capability，删除 adapter。
    - 预期：`declared career/agent architecture capability missing ... adapter.json`。
14. **源内容触发义务但 capability 声明缺失必须失败**
    - RED 变异：冻结源加入“职业发展/职级/Agent 架构”段落，删除相应 capability。
    - 预期：`source-detected professional obligations need explicit capability declarations`。
15. **Agent adapter 缺 D0-D7、四 evidence rings、统计语义或 Metric Card policy 必须失败**
    - RED 变异：删除任一 domain/ring，或删除 `pass@k`/`pass^k` 语义字段。
    - 预期：adapter contract 对应字段/集合错误。
16. **职业自评缺证据与组织级别边界必须失败**
    - RED 变异：self-assessment dimension 没 evidence refs/reviewer，或 organization adapter 不是 `INTERNAL-UNKNOWN`/配置化。
    - 预期：career adapter contract 错误；不得由年限/P5-P9 自动推断能力。

## 4. 按依赖顺序的修复门禁

```text
冻结源与 hash
  → 生成 198 sections / 413 atoms inventory
  → 裁决每项 disposition（零 UNMAPPED）
  → 声明 career/Agent capabilities + adapter
  → 建 capability/evidence/status projections
  → 为页面分配 display_number 和术语依赖
  → 逐页补 learner/reuse contract
  → 逐页补 SVG/Mermaid 与 visual manifest
  → 运行课程静态、材料、执行、构建验证
  → 独立 validation lane 做真实 learner/practitioner/model 验证
```

任一步失败都停止下游发布。特别是不能先批量“补字段”让 85 页变绿：字段必须链接到真实页面内容、可运行输入、可观察结果、故障修复和来源证据。

## 5. Course lane 完成条件

Course lane 只能在以下条件全部满足后交接 validation：

- 两份用户源已冻结，source/section/atom exact closure，`unaccounted_ids=[]`，coverage verdict `PASS`；
- 85 个 promised page 有精确 capability profile、professional evidence、status registry；
- `display_number` 连续 `1..85`，stable page IDs 和 prerequisite 顺序不漂移；
- 每页 learner contract 通过：定义先于使用、示例/反例、动作/预期、故障/修复/复跑、理解检查、可迁移工件齐全；
- 每页至少一个唯一 repository-owned SVG/Mermaid source，manifest hash 可追；
- career/Agent 适配器完整，职业等级为证据阶梯，组织映射默认 `INTERNAL-UNKNOWN`，Agent 阈值全部在 Metric Card 中配置；
- 课程原有 fixture/typed block/material/executability 门禁仍 PASS；
- 真实小白效果未执行时，状态仍为 `learner: NOT_RUN`，不得写成“已证明小白可懂”。

当前结论：**课程尚未修复完成；本文件是下一条 course lane 的 RED 规格与阻断地图。**
