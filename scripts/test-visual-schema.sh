#!/usr/bin/env bash
set -euo pipefail

SCHEMA="schema/v0.2/visual.json"
AJV=(npx --yes --package=ajv-cli@5.0.0 --package=ajv-formats@2.1.1 ajv)
REFS=(-r "schema/canonical-visual-tokens.schema.json")

"${AJV[@]}" validate --spec=draft2020 -c ajv-formats "${REFS[@]}" -s "$SCHEMA" \
  -d "examples/visual-semantics-v0.8.json" \
  -d "tests/fixtures/visual-minimal-v0.2.json" \
  -d "tests/fixtures/visual-canonical-tokens-v0.8.json"

if "${AJV[@]}" validate --spec=draft2020 -c ajv-formats "${REFS[@]}" -s "$SCHEMA" \
  -d "tests/fixtures/visual-invalid-evidence.json"; then
  echo "invalid evidence_status unexpectedly passed" >&2
  exit 1
fi

if "${AJV[@]}" validate --spec=draft2020 -c ajv-formats "${REFS[@]}" -s "$SCHEMA" \
  -d "tests/fixtures/visual-invalid-type.json"; then
  echo "invalid motion.character unexpectedly passed" >&2
  exit 1
fi

echo "visual schema contract passed"
