#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
factory="$root/../career-ai-course-factory"

# Always assemble the current local candidates first. They remain explicitly
# blocked until the public-release validator sees practitioner/integration
# evidence in the solution projection.
node "$root/scripts/build-publication-candidates.mjs"

candidate="$root/dist/github-candidate"
python3 "$factory/scripts/validate_public_release.py" "$candidate"

# Reaching this line means the higher-maturity publication gates are no longer
# blocked. Only then is a directory named github-release allowed to exist.
target="${1:-$root/dist/github-release}"
rm -rf "$target"
cp -R "$candidate" "$target"
echo "$target"
