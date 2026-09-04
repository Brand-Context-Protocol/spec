#!/usr/bin/env bash
set -euo pipefail

AJV=(npx --yes --package=ajv-cli@5.0.0 --package=ajv-formats@2.1.1 ajv)
FIXTURES="tests/fixtures/revisions"

validate() {
  local schema="$1"
  local document="$2"
  "${AJV[@]}" validate --spec=draft2020 -c ajv-formats -s "$schema" -d "$document"
}

reject() {
  local schema="$1"
  local document="$2"
  if validate "$schema" "$document"; then
    echo "$document unexpectedly passed $schema" >&2
    exit 1
  fi
}

validate schema/revision.schema.json "$FIXTURES/valid-revision.json"
validate schema/revision.schema.json "$FIXTURES/valid-unsigned-revision.json"
reject schema/revision.schema.json "$FIXTURES/invalid-revision-private-actor.json"

validate schema/patch.schema.json "$FIXTURES/valid-patch.json"
reject schema/patch.schema.json "$FIXTURES/invalid-patch-prototype.json"
reject schema/patch.schema.json "$FIXTURES/invalid-patch-empty-pointer.json"
reject schema/patch.schema.json "$FIXTURES/invalid-patch-add-prior-digest.json"
reject schema/patch.schema.json "$FIXTURES/invalid-patch-remove-value.json"

validate schema/canonical-claims.schema.json "$FIXTURES/valid-canonical-claims.json"
reject schema/canonical-claims.schema.json "$FIXTURES/invalid-canonical-claims-unapproved.json"

validate schema/canonical-visual-tokens.schema.json "$FIXTURES/valid-canonical-visual-tokens.json"
reject schema/canonical-visual-tokens.schema.json "$FIXTURES/invalid-canonical-visual-token-color.json"

validate schema/manifest.schema.json "$FIXTURES/valid-deterministic-manifest.json"
validate schema/manifest.schema.json "$FIXTURES/valid-deterministic-manifest-no-renderer.json"
validate schema/manifest.schema.json "$FIXTURES/valid-manual-canonical-manifest.json"
validate schema/manifest.schema.json "$FIXTURES/valid-legacy-manifest.json"
reject schema/manifest.schema.json "$FIXTURES/invalid-manual-manifest-renderer.json"
reject schema/manifest.schema.json "$FIXTURES/invalid-manifest-circular-revision-digest.json"

node scripts/test-revision-vectors.mjs
echo "deterministic revision extension contract passed"
