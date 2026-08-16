#!/usr/bin/env python3
"""Local fail-closed checks for the six-unit solution contract."""

from __future__ import annotations

import json
import unittest
from pathlib import Path


PACKAGE = Path(__file__).resolve().parents[3]
CONTRACT_PATH = PACKAGE / "research" / "solution-architecture.json"
TUTORIAL_PATH = PACKAGE / "tutorial" / "tutorial-site.json"
TRACEABILITY_PATH = PACKAGE / "research" / "traceability.json"

DIMENSIONS = {
    "purpose-and-success", "scope-and-non-goals", "stakeholders-and-decision-rights",
    "current-state-and-baseline", "use-cases-and-requirements",
    "constraints-assumptions-dependencies", "alternatives-and-architecture-decisions",
    "context-and-component-architecture", "runtime-workflow-and-state",
    "deployment-and-environments", "interfaces-and-integrations",
    "data-lifecycle-and-governance", "ai-system-lifecycle-and-human-authority",
    "security-privacy-compliance", "quality-test-evaluation-strategy",
    "performance-capacity-cost", "reliability-resilience-disaster-recovery",
    "observability-operations-and-support", "implementation-and-repository",
    "rollout-migration-rollback", "delivery-plan-resourcing-ownership",
    "risks-unknowns-technical-debt", "learner-experience-and-reusable-assets",
    "evidence-traceability-and-acceptance", "evolution-versioning-and-deprecation",
}

VIEWS = {
    "context", "building-block", "runtime", "deployment", "data-flow",
    "security-trust-boundary",
}

GATES = {
    "design", "functional", "security", "performance", "reliability",
    "operations", "rollback", "learner-transfer",
}


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


class SolutionContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.contract = load(CONTRACT_PATH)
        cls.tutorial = load(TUTORIAL_PATH)
        cls.traceability = load(TRACEABILITY_PATH)

    def test_six_units_cover_every_public_page(self) -> None:
        units = self.contract["solution_units"]
        self.assertEqual(6, len(units))
        mapped = {page for unit in units for page in unit["page_ids"]}
        public = {page["page_id"] for page in self.tutorial["pages"]}
        self.assertEqual(public, mapped)

    def test_every_unit_has_exact_dimensions_views_and_gates(self) -> None:
        for unit in self.contract["solution_units"]:
            with self.subTest(unit=unit["solution_id"]):
                self.assertEqual(DIMENSIONS, {item["dimension_id"] for item in unit["dimensions"]})
                self.assertEqual(VIEWS, {item["kind"] for item in unit["architecture_views"]})
                self.assertEqual(GATES, {item["gate_kind"] for item in unit["acceptance_gates"]})
                self.assertGreaterEqual(len(unit["decisions"]), 2)
                self.assertGreaterEqual(len(unit["residual_risks"]), 1)
                for view in unit["architecture_views"]:
                    artifact = PACKAGE / view["artifact_ref"]
                    self.assertTrue(artifact.is_file(), view["artifact_ref"])
                    self.assertIn("```mermaid", artifact.read_text(encoding="utf-8"))

    def test_maturity_remains_fail_closed(self) -> None:
        for unit in self.contract["solution_units"]:
            with self.subTest(unit=unit["solution_id"]):
                self.assertEqual("partial", unit["design_status"])
                self.assertEqual("desk-researched", unit["execution_status"])
                self.assertEqual("not-reviewed", unit["practitioner_review_status"])
                self.assertEqual("internal", unit["publication_status"])
                self.assertNotIn("pass", {gate["status"] for gate in unit["acceptance_gates"]})

    def test_trace_receipts_are_exact_and_not_borrowed(self) -> None:
        fixture_refs = []
        for unit in self.contract["solution_units"]:
            receipt_ids = {item["receipt_id"] for item in unit["execution_receipts"]}
            for trace in unit["traceability"]:
                ref = trace["execution_receipt_ref"]
                if ref == "NOT_RUN":
                    self.assertEqual("desk-researched", unit["execution_status"])
                else:
                    self.assertIn(ref, receipt_ids)
                    fixture_refs.append((unit["solution_id"], trace["page_id"], ref))
        self.assertEqual(
            [("SOL-REQ-RELEASE", "TD-P02", "REC-TD-P02-FIXTURE-20260811")],
            fixture_refs,
        )

    def test_fixture_pass_is_backed_by_red_green_receipt(self) -> None:
        unit = next(item for item in self.contract["solution_units"] if item["solution_id"] == "SOL-REQ-RELEASE")
        receipt_ref = unit["execution_receipts"][0]["artifact_ref"]
        receipt = load(PACKAGE / receipt_ref)
        self.assertEqual("PASS-FIXTURE", receipt["actual_verdict"])
        observations = {item["name"]: item["observed"] for item in receipt["assertions"]}
        self.assertIn("exit 0", observations["baseline"])
        self.assertIn("exit 1", observations["meaningful mutation"])
        self.assertIn("T-CANCEL-SHIPPED-01", observations["meaningful mutation"])
        self.assertIn("exit 0", observations["repair"])
        self.assertNotEqual("NOT_RUN", receipt["run_at"])

    def test_not_run_receipts_cannot_be_success(self) -> None:
        for unit in self.contract["solution_units"]:
            for item in unit["execution_receipts"]:
                payload = load(PACKAGE / item["artifact_ref"])
                if payload["actual_verdict"] == "NOT_RUN":
                    self.assertEqual("NOT_RUN", item["status"])
                    self.assertNotEqual("PASS", item["status"])
                    self.assertNotEqual("PASS-FIXTURE", item["status"])

    def test_td_p02_result_separates_fixture_from_model_execution(self) -> None:
        result = next(
            item for item in self.traceability["links"] if item["id"] == "RESULT-SHIPPED"
        )
        self.assertEqual("PASS-FIXTURE", result["status"])
        self.assertEqual("NOT_RUN", result["model_execution_status"])
        self.assertEqual(
            "research/solution-architecture/receipts/td-p02-fixture-20260811.json",
            result["run_receipt"],
        )
        receipt = load(PACKAGE / result["run_receipt"])
        self.assertEqual("PASS-FIXTURE", receipt["actual_verdict"])
        self.assertNotEqual("NOT_RUN", receipt["run_at"])


if __name__ == "__main__":
    unittest.main()
