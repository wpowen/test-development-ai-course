# Evidence run records

This directory is append-only evidence metadata. Each successful `generate:integrity` or deterministic editorial audit creates a unique `run_id` JSON record containing the command, input content hashes, validator SHA-256, start/end timestamps, and exit code. A later run must create a new record; it must not rewrite an older run ID.

Run the checks in CI as two distinct gates:

```bash
# 1. Generate/verify full integrity with a CI wall-clock timeout.
# A timeout is NOT_RUN/UNKNOWN and must not be converted to PASS.
npm --prefix site run verify:integrity

# 2. Verify freshness (24-hour TTL), content-hash binding, immutable records,
# and superseded human-review claims.
npm --prefix site run verify:evidence-governance
```

The integrity command can traverse every public material, static projection and ZIP member, so CI should retain its JSON stdout/stderr and set an explicit wall-clock limit appropriate to the runner. A timeout, missing summary, non-zero exit, changed content hash, changed validator hash, missing record, or expired TTL blocks promotion.
