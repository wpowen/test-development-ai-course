#!/usr/bin/env python3
"""Regression tests for prompt artifact ownership boundaries.

The tests are deliberately independent from the normal content validators: a
generator must not be able to turn a learner-facing one-shot artifact into a
generator-task artifact merely because both happen to be named prompt-v1.md.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from prompt_artifact_ownership import (  # type: ignore[import-not-found]
    OwnershipViolation,
    load_registry,
    select_owned_topics,
    verify_non_owned_artifacts,
)


ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"
GENERATOR = "scripts/build-prompt-packages.py"
DIRECT_USE_OWNER = "courses/td-ai-011-requirements-to-evidence/lab/build_direct_use_contracts.py"
PAGE_IDS = [f"TD-P0{index}" for index in range(1, 9)]


class PromptArtifactOwnershipTests(unittest.TestCase):
    def test_registry_declares_two_artifact_types_and_exact_owners(self) -> None:
        registry = load_registry(ROOT)
        self.assertEqual(set(registry["artifact_types"]), {"learner-one-shot", "generator-task"})

        direct_use = next(item for item in registry["artifacts"] if item["id"] == "requirements-to-evidence-learner-one-shot")
        generator_task = next(item for item in registry["artifacts"] if item["id"] == "requirements-to-evidence-generator-task")
        self.assertEqual(direct_use["artifact_type"], "learner-one-shot")
        self.assertEqual(direct_use["owner_generator"], DIRECT_USE_OWNER)
        self.assertEqual(direct_use["consumer"], "learner")
        self.assertEqual(direct_use["topic_ids"], PAGE_IDS)
        self.assertTrue(direct_use["immutable_to_other_generators"])
        self.assertEqual(generator_task["artifact_type"], "generator-task")
        self.assertEqual(generator_task["owner_generator"], DIRECT_USE_OWNER)
        self.assertEqual(generator_task["consumer"], "prompt-package-assembler")
        self.assertEqual(generator_task["files"], ["system-v1.md", "task-v1.md", "critic-v1.md"])

    def test_generator_selection_is_declarative_not_a_topic_exception_list(self) -> None:
        owned, protected = select_owned_topics(ROOT, GENERATOR, ["TD-X101", "TD-P01", "TD-P08"])
        self.assertEqual(owned, ["TD-X101"])
        self.assertEqual(protected, ["TD-P01", "TD-P08"])

    def test_non_owner_cannot_generate_a_learner_one_shot_package(self) -> None:
        prompt = ROOT / "courses/td-ai-011-requirements-to-evidence/lab/page-prompts/TD-P01/prompt-v1.md"
        before = prompt.read_bytes()
        result = subprocess.run(
            [sys.executable, str(SCRIPTS / "build-prompt-packages.py"), "TD-P01"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("not owned", result.stderr)
        self.assertEqual(prompt.read_bytes(), before)

    def test_every_general_prompt_generator_refuses_a_foreign_one_shot(self) -> None:
        for script in ("build-prompt-packages.py", "build-page-prompt-packages.py"):
            with self.subTest(script=script):
                result = subprocess.run(
                    [sys.executable, str(SCRIPTS / script), "TD-P01"],
                    cwd=ROOT,
                    text=True,
                    capture_output=True,
                    check=False,
                )
                self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
                self.assertIn("not owned", result.stderr)

    def test_immutable_hash_verification_detects_non_owned_mutation(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            copy_root = Path(tmp) / "course"
            shutil.copytree(ROOT / "courses", copy_root / "courses")
            shutil.copy2(ROOT / "courses/prompt-artifact-ownership.json", copy_root / "courses/prompt-artifact-ownership.json")

            verify_non_owned_artifacts(copy_root, GENERATOR)
            for filename in ("prompt-v1.md", "task-v1.md"):
                protected = copy_root / "courses/td-ai-011-requirements-to-evidence/lab/page-prompts/TD-P01" / filename
                original = protected.read_bytes()
                protected.write_bytes(original + b"\nmutated by a foreign generator\n")
                with self.assertRaisesRegex(OwnershipViolation, "hash drift"):
                    verify_non_owned_artifacts(copy_root, GENERATOR)
                protected.write_bytes(original)


if __name__ == "__main__":
    unittest.main()
