#!/usr/bin/env python3
"""Typed ownership and immutable-byte checks for prompt artifacts.

File names such as ``prompt-v1.md`` are intentionally not used as ownership
signals.  The registry is the single authority: a learner one-shot package and
an engineering generator-task package may have the same filename, but only its
declared owner can write it.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Iterable


REGISTRY_RELATIVE_PATH = Path("courses/prompt-artifact-ownership.json")


class OwnershipViolation(RuntimeError):
    """Raised when a generator attempts to cross an artifact ownership boundary."""


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_registry(root: Path) -> dict:
    """Load and minimally validate the declarative prompt-ownership registry."""
    path = root / REGISTRY_RELATIVE_PATH
    try:
        registry = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise OwnershipViolation(f"prompt ownership registry missing: {path}") from exc
    except json.JSONDecodeError as exc:
        raise OwnershipViolation(f"prompt ownership registry is invalid JSON: {path}") from exc

    if registry.get("schema_version") != "prompt-artifact-ownership.v1":
        raise OwnershipViolation("unsupported prompt ownership registry schema")
    if set(registry.get("artifact_types", {})) != {"learner-one-shot", "generator-task"}:
        raise OwnershipViolation("registry must define learner-one-shot and generator-task types")

    seen_topic_files: set[tuple[str, str]] = set()
    for artifact in registry.get("artifacts", []):
        required = {"id", "artifact_type", "owner_generator", "consumer", "canonical_directory",
                    "integrity_manifest", "topic_ids", "immutable_to_other_generators", "hash_field",
                    "ownership_key", "files"}
        missing = sorted(required - set(artifact))
        if missing:
            raise OwnershipViolation(f"ownership record {artifact.get('id', '<unknown>')} missing: {', '.join(missing)}")
        if artifact["artifact_type"] not in registry["artifact_types"]:
            raise OwnershipViolation(f"unknown artifact type: {artifact['artifact_type']}")
        for topic in artifact["topic_ids"]:
            for filename in artifact["files"]:
                key = (topic, filename)
                if key in seen_topic_files:
                    raise OwnershipViolation(f"prompt file has more than one explicit owner: {topic}/{filename}")
                seen_topic_files.add(key)
    return registry


def protected_artifact_for_topic(root: Path, generator: str, topic: str) -> dict | None:
    """Return a non-owned typed artifact for topic, if one is registered."""
    for artifact in load_registry(root).get("artifacts", []):
        if topic in artifact["topic_ids"] and artifact["owner_generator"] != generator:
            return artifact
    return None


def select_owned_topics(root: Path, generator: str, topics: Iterable[str]) -> tuple[list[str], list[str]]:
    """Split candidates by the registry rather than by a script-local exception list."""
    owned: list[str] = []
    protected: list[str] = []
    for topic in topics:
        if protected_artifact_for_topic(root, generator, topic):
            protected.append(topic)
        else:
            owned.append(topic)
    return owned, protected


def require_generator_owns_topics(root: Path, generator: str, topics: Iterable[str]) -> None:
    """Fail closed for explicit requests that include someone else's artifact."""
    _owned, protected = select_owned_topics(root, generator, topics)
    if protected:
        details = []
        for topic in protected:
            artifact = protected_artifact_for_topic(root, generator, topic)
            assert artifact is not None
            details.append(f"{topic} ({artifact['artifact_type']} owned by {artifact['owner_generator']})")
        raise OwnershipViolation(
            "requested prompt artifacts are not owned by " + generator + ": " + ", ".join(details)
        )


def _verify_artifact_hashes(root: Path, artifact: dict) -> list[str]:
    """Verify the canonical immutable manifest and all files it pins."""
    manifest_path = root / artifact["integrity_manifest"]
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return [f"immutable manifest missing: {artifact['integrity_manifest']}"]
    except json.JSONDecodeError:
        return [f"immutable manifest invalid JSON: {artifact['integrity_manifest']}"]

    expected_topics = artifact["topic_ids"]
    if manifest.get("page_ids") != expected_topics:
        return [f"immutable manifest page_ids drift: {artifact['integrity_manifest']}"]

    packages = {item.get("page_id"): item for item in manifest.get("packages", [])}
    issues: list[str] = []
    for topic in expected_topics:
        package = packages.get(topic)
        if package is None:
            issues.append(f"immutable manifest missing package: {topic}")
            continue
        hashes = package.get(artifact["hash_field"])
        if not isinstance(hashes, dict) or not hashes:
            issues.append(f"immutable manifest missing {artifact['hash_field']}: {topic}")
            continue
        directory = root / artifact["canonical_directory"] / topic
        for filename in artifact["files"]:
            expected = hashes.get(filename)
            if not isinstance(expected, str):
                issues.append(f"immutable manifest missing hash: {topic}/{filename}")
                continue
            path = directory / filename
            if not path.is_file():
                issues.append(f"immutable artifact missing: {topic}/{filename}")
            elif _sha256(path) != expected:
                issues.append(f"immutable artifact hash drift: {topic}/{filename}")

        package_manifest_path = directory / "manifest.json"
        if package_manifest_path.is_file():
            package_manifest = json.loads(package_manifest_path.read_text(encoding="utf-8"))
            ownership = package_manifest.get("artifact_ownership", {})
            typed = ownership.get(artifact["ownership_key"], {})
            if typed.get("artifact_type") != artifact["artifact_type"]:
                issues.append(f"immutable artifact type drift: {topic}")
            if typed.get("owner_generator") != artifact["owner_generator"]:
                issues.append(f"immutable artifact owner drift: {topic}")
            if typed.get("consumer") != artifact["consumer"]:
                issues.append(f"immutable artifact consumer drift: {topic}")
            if typed.get("files") != artifact["files"]:
                issues.append(f"immutable artifact file scope drift: {topic}/{artifact['ownership_key']}")
        else:
            issues.append(f"immutable package manifest missing: {topic}")
    return issues


def verify_non_owned_artifacts(root: Path, generator: str) -> None:
    """Fail when a foreign immutable artifact has changed or lost its typed owner."""
    issues: list[str] = []
    for artifact in load_registry(root).get("artifacts", []):
        if artifact["owner_generator"] == generator or not artifact["immutable_to_other_generators"]:
            continue
        issues.extend(_verify_artifact_hashes(root, artifact))
    if issues:
        raise OwnershipViolation("; ".join(issues))
