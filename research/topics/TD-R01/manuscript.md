# TD-R01 Manuscript: 建立不会误导学习者的资源索引

## 你要解决的专业问题
链接列表不是知识系统。旧版本、搜索摘要和重复转载会让学习者照着失效规则练习。你要记录来源、版本、限制和适用场景，并在变更时保留 superseded 证据。

## 跟做：从候选到发布
运行 `python3 scripts/career_evolution_lab.py --manifest manifests/TD-R01.json --mode baseline`。打开每个 URL，核对标题和正文，填写 publisher group、source family、accessed_at、version_date、supports 和 does_not_support。用 canonical URL 去重，再给条目 owner 和失效检查日期。只有 reviewer 通过，资源才可被课程引用。

## 失败与修复
fault 模式会制造断链、过期版本或重复 family，命令应以 1 退出，状态写为 `BLOCKED`/`SUPERSEDED`。修复不是删除记录，而是重新打开来源、补日期与限制、链接替代版本，并记录 diff。不能访问的内容保持未知，不得用模型记忆补全。

## 可复用工件
资源 schema、来源包、变更日志、失效检查清单和 reviewer 记录可直接用于团队知识库。索引只证明来源管理流程可运行；不证明课程效果、就业结果或未来链接永久有效。
## 检查清单
确认链接已打开且标题一致；记录 publisher、family、访问和版本日期；写 supports、does_not_support、limitations；指定 owner 和复查日期；标记 superseded；给学习者一个可执行出口工件。若只能看到搜索摘要，状态不是 KEEP。资源维护证明的是信息治理流程，不是学习效果或就业结果。

## 小练习
为零基础、测试背景和开发背景各选一条入口资源，写清先修、用途和出口 artifact；再故意让一条链接过期，切换到 fallback 并记录变更。

把候选资源交给另一位学习者，让他不依赖你的口头解释找到入口、完成一个动作并生成出口工件。Prompt 可以生成候选标签，但 Eval 必须检查 URL、版本和限制；mutation 把一个链接换成同域营销页，独立 Oracle 应拒绝 KEEP。复查日期到期后状态自动转为待审，而不是继续展示旧结论。

每次维护都输出变更摘要：新增了什么、哪些被 superseded、哪些暂时 BLOCKED、哪些学习页受影响。学习者看到的不只是链接，还应看到“为什么用、先做什么、得到什么、失败如何修”。即使链接可打开，若内容不支持目标 claim，Oracle 仍应阻断引用；可达性从来不等于证据充分。
