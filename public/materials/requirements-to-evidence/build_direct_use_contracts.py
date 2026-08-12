#!/usr/bin/env python3
"""Build page-specific JSON Schemas and inspectable direct-use input fixtures."""

from __future__ import annotations

import json
import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parent
BASE_INPUT = {
    "baseline_id": "order-cancel-v2",
    "source_refs": [
        "PRD-v3#R17",
        "PRD-v3#R18",
        "PRD-v3#R19",
        "OPENAPI-v7#/cancel",
        "TECH-a13f#S04",
    ],
    "authority_policy": "synthetic fixture policy approved by product/technical owners; conflicts BLOCKED",
    "fixture_boundary": "synthetic offline teaching fixture; replace every direct_use_inputs value before business use",
}

CONTRACTS = {
    "TD-P01": {
        "title": "test-basis-pack.v1.1",
        "required": ["page_id", "status", "sources", "claims", "conflicts", "unknowns", "owner_questions", "downstream_artifacts"],
        "inputs": {"business_scope": "order cancellation", "source_authority": "approved fixture policy", "documents": ["prd-v3.md", "technical-design-a13f.md", "openapi-v7.yaml"], "owners": ["product-owner", "technical-owner", "test-owner"]},
    },
    "TD-P02": {
        "title": "requirement-contract.v1.1",
        "required": ["page_id", "status", "requirements", "acceptance_criteria", "review_questions", "unknowns"],
        "inputs": {"review_goal": "review cancellation requirements", "business_outcome": "eligible buyer schedules exactly one cancellation", "requirements_text": "inputs/prd-v3.md", "glossary": ["CANCEL_PENDING", "SHIPPED"]},
    },
    "TD-P03": {
        "title": "technical-contract.v1.1",
        "required": ["page_id", "status", "components", "interfaces", "states", "failure_modes", "observability", "security", "requirement_mapping", "review_questions", "unknowns"],
        "inputs": {"system_scope": "order service and refund worker", "requirement_contract": "seed/requirement-contract.json", "technical_documents": ["inputs/technical-design-a13f.md", "inputs/openapi-v7.yaml"], "operations_security": "not fully specified in fixture"},
    },
    "TD-P04": {
        "title": "risk-test-plan.v1.1",
        "required": ["page_id", "status", "risks", "method_decisions", "test_level_map", "blocked", "unknowns"],
        "inputs": {"change_scope": "cancellation and refund", "requirement_contract": "seed/requirement-contract.json", "technical_analysis": "TD-P03 output", "risk_policy": "critical money/permission/state failures need owner", "constraints": ["offline fixture"]},
    },
    "TD-P05": {
        "title": "test-package.v1.1",
        "required": ["page_id", "status", "oracles", "test_conditions", "test_cases", "blocked_tests", "unknowns"],
        "inputs": {"test_scope": "cancel API and refund side effect", "requirement_contract": "seed/requirement-contract.json", "risk_test_plan": "TD-P04 output", "oracle_sources": ["PRD-v3#R17", "OPENAPI-v7#/cancel/responses/409"], "data_environment": "synthetic in-memory implementation"},
    },
    "TD-P06": {
        "title": "automation-adapter.v1.1",
        "required": ["page_id", "status", "review_findings", "adapter_contracts", "commands", "trace_links", "blocked", "unknowns"],
        "inputs": {"adapter_type": "framework-neutral API adapter", "test_package": "artifacts/test-package.json", "system_contract": "inputs/openapi-v7.yaml", "tool_environment": "Python standard library", "forbidden_side_effects": ["real payment", "production write"]},
    },
    "TD-P07": {
        "title": "run-evidence.v1.1",
        "required": ["page_id", "status", "run", "results", "attributions", "defects", "blocked", "unknowns", "decision"],
        "inputs": {"run_goal": "attribute cancellation fixture result", "version_manifest": "page-manifests/TD-P07.json", "command_cwd": "materials/requirements-to-evidence", "selected_tests": ["T-CANCEL-SHIPPED-01"], "raw_evidence": ["reports/TD-P07-cycle.json"]},
    },
    "TD-P08": {
        "title": "impact-and-release-evidence.v1.1",
        "required": ["page_id", "status", "change_set", "impact_set", "regression_set", "evidence_pack", "residual_risks", "unknowns", "decision"],
        "inputs": {"change_goal": "change 409 response contract", "before_after": "synthetic version diff", "trace_graph": "traceability.json", "historical_receipts": ["receipts/fixture-baseline.json"], "release_owners": ["test-owner", "release-owner"]},
    },
}


def object_array(description: str) -> dict:
    return {"type": "array", "description": description, "items": {"type": "object"}}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


packages = []
for page_id, contract in CONTRACTS.items():
    directory = ROOT / "page-prompts" / page_id
    properties = {
        "page_id": {"const": page_id},
        "status": {"enum": ["ACCEPTED", "PASS", "PARTIAL", "BLOCKED", "UNKNOWN", "RELEASE_CANDIDATE"]},
    }
    for field in contract["required"]:
        if field in properties:
            continue
        if field in {"decision"}:
            properties[field] = {"type": "object"}
        else:
            properties[field] = object_array(f"Professional output records for {field}")
    schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "title": contract["title"],
        "type": "object",
        "required": contract["required"],
        "properties": properties,
        "additionalProperties": False,
    }
    input_fixture = dict(BASE_INPUT)
    input_fixture.update({"page_id": page_id, "direct_use_inputs": contract["inputs"]})
    (directory / "schema.json").write_text(json.dumps(schema, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (directory / "input.json").write_text(json.dumps(input_fixture, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    manifest_path = directory / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest.update({
        "template_sha256": sha256(directory / "prompt-v1.md"),
        "input_sha256": sha256(directory / "input.json"),
        "output_schema_sha256": sha256(directory / "schema.json"),
        "evaluation_sha256": sha256(directory / "eval.json"),
    })
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    packages.append({
        "page_id": page_id,
        "prompt": f"page-prompts/{page_id}/prompt-v1.md",
        "prompt_sha256": manifest["template_sha256"],
        "input": f"page-prompts/{page_id}/input.json",
        "input_sha256": manifest["input_sha256"],
        "schema": f"page-prompts/{page_id}/schema.json",
        "schema_sha256": manifest["output_schema_sha256"],
        "eval": f"page-prompts/{page_id}/eval.json",
        "eval_sha256": manifest["evaluation_sha256"],
    })

direct_use_manifest = {
    "schema_version": "direct-use-prompt-kit.v1",
    "package_id": "requirements-to-evidence-direct-use",
    "version": "1.1.0",
    "page_ids": list(CONTRACTS),
    "prompt_count": len(CONTRACTS),
    "copy_target": "generic-ai-agent",
    "guide": "DIRECT-USE-GUIDE.md",
    "guide_sha256": sha256(ROOT / "DIRECT-USE-GUIDE.md"),
    "adaptation_card": "ADAPTATION-CARD.md",
    "adaptation_card_sha256": sha256(ROOT / "ADAPTATION-CARD.md"),
    "packages": packages,
    "status": "PASS-STATIC-CONTRACT",
    "provider": "none",
    "model_status": "NOT_RUN",
    "limitations": "Prompt structure and deterministic fixture gates are validated; no real model, enterprise integration, practitioner, learner transfer, live, or production evidence.",
}
(ROOT / "DIRECT-USE-MANIFEST.json").write_text(json.dumps(direct_use_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"generated {len(CONTRACTS)} page-specific schemas and input fixtures")
