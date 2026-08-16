#!/usr/bin/env python3
"""Register current and superseded human-facing course verdicts."""

from __future__ import annotations

import hashlib
import json
import argparse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORTS = [
    ("course-audit-04", "human-review/04-完整方案审计.md", "superseded"),
    ("course-audit-05", "human-review/05-逐命题深研与代码可执行性审计.md", "superseded"),
    ("course-audit-06", "human-review/06-最终课程验收.md", "superseded"),
    ("course-checkpoint-07", "human-review/07-102页课程重建检查点.md", "superseded"),
    ("course-audit-08", "human-review/08-AI测试开发专家全文档审计-2026-08-14.md", "superseded"),
    ("course-audit-09", "human-review/09-AI测试开发专家内容质量评估-2026-08-14.md", "superseded"),
    ("course-editorial-08", "research/editorial-review-2026-08-11-final.json", "current"),
]


def digest(data: bytes) -> str:
    return "sha256:" + hashlib.sha256(data).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail instead of rewriting a stale registry")
    args = parser.parse_args()
    tutorial = json.loads((ROOT / "tutorial/tutorial-site.json").read_text(encoding="utf-8"))
    page_ids = [page["page_id"] for page in tutorial["pages"]]
    scope_hash = digest(json.dumps(page_ids, ensure_ascii=False, separators=(",", ":")).encode())
    old_ids = [record_id for record_id, _, status in REPORTS if status == "superseded"]
    records = []
    for record_id, relative, status in REPORTS:
        artifact = ROOT / relative
        records.append(
            {
                "record_id": record_id,
                "artifact_type": "course-verdict",
                "scope_id": "test-development-ai-public-course",
                "path": relative,
                "as_of": "2026-08-13" if status == "current" else ("2026-08-12" if record_id == "course-checkpoint-07" else "2026-08-11"),
                "scope_hash": scope_hash,
                "page_ids": page_ids,
                "artifact_hash": digest(artifact.read_bytes()),
                "status": status,
                "supersedes": old_ids if status == "current" else [],
                "evidence_refs": [
                    "tutorial/tutorial-site.json",
                    "research/executability-audit.json",
                    "research/source-assimilation-ledger.json",
                ],
            }
        )
    output = {
        "schema_version": "status-registry.v1",
        "scope_page_ids": page_ids,
        "records": records,
    }
    target = ROOT / "research/status-registry.json"
    serialized = json.dumps(output, ensure_ascii=False, indent=2) + "\n"
    if args.check:
        if not target.is_file() or target.read_text(encoding="utf-8") != serialized:
            raise SystemExit("status registry drift")
    else:
        target.write_text(serialized, encoding="utf-8")
    print(f"status registry: {len(records)} records; current scope {len(page_ids)} pages")


if __name__ == "__main__":
    main()
