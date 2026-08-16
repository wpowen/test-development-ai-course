#!/usr/bin/env python3
"""标准/规范引用版本化契约的回归测试。

这些测试刻意不访问网络：运行时网络是否可达不能决定课程证据是否诚实。
"""
from __future__ import annotations

import importlib.util
import pathlib
import unittest


SCRIPT = pathlib.Path(__file__).with_name("build-reference-library.py")
SPEC = importlib.util.spec_from_file_location("build_reference_library", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


VALID_STANDARD = {
    "id": "R-TEST-STANDARD",
    "kind": "standard",
    "title": "Example Standard",
    "url": "https://standards.example.test/landing",
    "edition": "2",
    "version": "2.0",
    "publishedAt": "2025-01-26",
    "retrievedAt": "2026-08-16",
    "primaryArtifact": {
        "url": "https://standards.example.test/example-2.0.pdf",
        "mediaType": "application/pdf",
        "localPath": "research/reference-artifacts/R-TEST-STANDARD-2.0.pdf",
        "contentSha256": "a" * 64,
        "contentScope": "完整公开标准正文",
    },
    "lifecycle": {
        "status": "published",
        "statusEvidenceUrl": "https://standards.example.test/landing",
    },
    "supersedes": ["Example Standard 1.0"],
    "compatibility": {
        "classification": "breaking",
        "note": "条款编号改变，旧映射必须复核。",
    },
    "reviewPolicy": {
        "intervalDays": 90,
        "watchUrl": "https://standards.example.test/landing",
    },
    "changeImpact": {
        "risk": "high",
        "affectedClaimTypes": ["requirement-id", "security-gate"],
    },
}


class StandardReferenceContractTests(unittest.TestCase):
    def test_standard_requires_edition_version_dates_frozen_artifact_and_change_contract(self) -> None:
        broken = {key: value for key, value in VALID_STANDARD.items() if key not in {
            "edition", "version", "publishedAt", "retrievedAt", "primaryArtifact",
            "lifecycle", "supersedes", "compatibility", "reviewPolicy", "changeImpact",
        }}
        problems = MODULE.validate_standard_metadata(broken)
        self.assertTrue(any("edition" in problem for problem in problems))
        self.assertTrue(any("primaryArtifact" in problem for problem in problems))
        self.assertTrue(any("reviewPolicy" in problem for problem in problems))

    def test_standard_contract_accepts_a_hash_pinned_primary_artifact(self) -> None:
        self.assertEqual([], MODULE.validate_standard_metadata(VALID_STANDARD))

    def test_changed_standard_generates_actionable_review_queue_entry(self) -> None:
        previous = {**VALID_STANDARD, "version": "1.0"}
        item = MODULE.build_standard_review_queue_item(
            current=VALID_STANDARD,
            previous=previous,
            affected_pages=["TD-PS12", "TD-T23"],
        )
        self.assertIsNotNone(item)
        assert item is not None
        self.assertEqual("required", item["reviewStatus"])
        self.assertIn("version_changed", item["reasons"])
        self.assertEqual(["TD-PS12", "TD-T23"], item["affectedPages"])

    def test_expired_draft_is_queued_even_without_content_change(self) -> None:
        expired = {
            **VALID_STANDARD,
            "lifecycle": {
                "status": "expired-draft",
                "statusEvidenceUrl": "https://standards.example.test/status",
            },
        }
        item = MODULE.build_standard_review_queue_item(
            current=expired,
            previous=expired,
            affected_pages=["TD-PS01"],
        )
        self.assertIsNotNone(item)
        assert item is not None
        self.assertIn("lifecycle_expired-draft", item["reasons"])

    def test_overdue_snapshot_is_queued_without_claiming_a_monitor_has_run(self) -> None:
        overdue = {
            **VALID_STANDARD,
            "retrievedAt": "2025-01-01",
            "reviewPolicy": {"intervalDays": 30, "watchUrl": "https://standards.example.test/landing"},
        }
        item = MODULE.build_standard_review_queue_item(
            current=overdue,
            previous=overdue,
            affected_pages=["TD-PS01"],
        )
        self.assertIsNotNone(item)
        assert item is not None
        self.assertIn("retrieval_overdue", item["reasons"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
