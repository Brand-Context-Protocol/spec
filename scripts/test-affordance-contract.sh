#!/usr/bin/env bash
set -euo pipefail
fixture_dir=$(mktemp -d)
node scripts/test-affordance-contract.mjs "$fixture_dir"
npx --yes --package=ajv-cli@5.0.0 --package=ajv-formats@2.1.1 ajv validate \
  --spec=draft2020 --strict=false -c ajv-formats \
  -s schema/brand-context.schema.json -d "$fixture_dir/*.yaml"
