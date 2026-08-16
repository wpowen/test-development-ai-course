# TD-QP02 Independent Comparison

## Agreements

两条研究路线一致认为：事件不是当前事实；结论必须绑定身份、权限、对象版本和证据；缺证据 fail-closed；人工批准不能被 AI 或通知替代；重试有界并保存 receipt；旧事件不得覆盖新 revision/SHA/environment；exit 0 或 happy path 不证明真实集成。

## Disagreements

平台路线倾向原生对象和状态；失败路线指出跨系统部分成功需要 Inbox/Outbox/DLQ、trace 与 reconciliation。平台教程容易过早写 adapter；通用事件模型又可能掩盖 tier、权限、CNI 与 workflow 差异。Prompt 路线一重结构输出，路线二要求 mutation、独立 Oracle 与 human authority。

## Adjudication

裁决：上游事实由原生 API 回读，跨系统编排使用统一信封、精确版本与幂等副作用；先跑 fixture，再做隔离 live probe。GitLab webhook → Inbox → 回读 MR HEAD/head pipeline → Jobs/JUnit/artifact → 确定性聚合 → 再查当前 SHA → status check → protected branch。Prompt 必须有 system/task/critic/input/Schema/eval/manifest，provider/model 保持 NOT_RUN。

拒绝“webhook exactly-once”“局部绿色等于完整通过”“Job TTL 删除 namespace”“通知成功等于业务完成”“AI 结构化输出可自动批准”。未知项保留真实权限、版本、网络 enforcement、组织流程、生产阈值与 practitioner usability。结论为 fixture-tested，不是 live、practitioner 或 publication-ready。
