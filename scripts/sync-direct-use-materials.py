#!/usr/bin/env python3
"""Project the canonical lifecycle direct-use package into public materials.

This is intentionally separate from ``build_direct_use_contracts.py``: the
latter remains runnable by a learner after unzipping the lab, while this script
is the repository-only projection step that preserves canonical -> public ->
ZIP closure.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "courses/td-ai-011-requirements-to-evidence/lab"
PUBLIC = ROOT / "site/public/materials/requirements-to-evidence"
SOURCE_ONLY = {
    "reports/baseline-new.json",
    "reports/baseline-new2.json",
    "reports/mutation-new.json",
    "reports/repair-new.json",
}


def copy_public_projection() -> None:
    staging = PUBLIC.with_name(f".{PUBLIC.name}.staging")
    if staging.exists():
        shutil.rmtree(staging)
    shutil.copytree(SOURCE, staging, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
    for relative in SOURCE_ONLY:
        path = staging / relative
        if path.exists():
            path.unlink()
    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    staging.rename(PUBLIC)


def main() -> int:
    if not SOURCE.is_dir():
        print(f"canonical direct-use source missing: {SOURCE}", file=sys.stderr)
        return 2
    copy_public_projection()
    result = subprocess.run(
        [sys.executable, str(ROOT / "scripts/rebuild-material-archives.py"), "requirements-to-evidence"],
        cwd=ROOT,
        check=False,
    )
    if result.returncode:
        return result.returncode
    print("synced canonical learner one-shot Prompt Packages to public materials and ZIP")
    return 0


if __name__ == "__main__":
    sys.exit(main())
