# 独立审查证明交付契约

此目录只存放用于课程晋级的正式独立审查证明。自动化角色名、模型名、不同脚本 ID 或本文件本身都**不是**独立性证明。

要将某份审查从 `UNVERIFIED` 升为 `ATTESTED`，具备授权的独立评审人或治理系统必须新增一份不可变证据文件，并在审查报告中写入其相对路径和 SHA-256。证据至少应包含：评审人或审批系统的可追溯身份、作者身份、利益冲突声明、受审范围和内容哈希、日期、批准/签名或审批记录 ID。

推荐记录结构：

```json
{
  "schema_version": "reviewer-independence-attestation.v1",
  "attestation_id": "reviewer-independence-YYYY-MM-DD",
  "reviewer_identity_ref": "governance/people-or-approval-system/…",
  "author_identity_ref": "governance/authors/…",
  "scope": {
    "editorial_review_ref": "research/editorial-review-2026-08-11-final.json",
    "editorial_review_sha256": "sha256:<digest>",
    "page_ids_sha256": "sha256:<digest>"
  },
  "conflict_of_interest_declared": true,
  "decision": "INDEPENDENT",
  "approved_at": "YYYY-MM-DDTHH:MM:SSZ",
  "approval_record_ref": "<immutable approval or signature record>"
}
```

收据生成器只接受相对路径，且会验证该文件存在并与 `evidence_sha256` 完全一致。证明缺失、路径逃逸、哈希不匹配、评审人与作者相同，或未声明利益冲突时，晋级收据必须保持 `FAIL`。
