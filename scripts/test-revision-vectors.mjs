#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash, createPublicKey, verify } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const sha256 = (value) => createHash("sha256").update(value, "utf8").digest("hex");

function assertUnicodeScalarString(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      assert.ok(next >= 0xdc00 && next <= 0xdfff, "JCS input contains an unpaired high surrogate");
      index += 1;
    } else {
      assert.ok(!(code >= 0xdc00 && code <= 0xdfff), "JCS input contains an unpaired low surrogate");
    }
  }
}

// RFC 8785 delegates primitive serialization to ECMAScript and sorts object
// property names by UTF-16 code units. Input schemas exclude non-finite values.
function canonicalize(value) {
  if (value === null || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    assert.ok(Number.isFinite(value), "JCS cannot represent a non-finite number");
    return JSON.stringify(value);
  }
  if (typeof value === "string") {
    assertUnicodeScalarString(value);
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  assert.equal(typeof value, "object");
  return `{${Object.keys(value)
    .sort()
    .map((key) => {
      assertUnicodeScalarString(key);
      return `${JSON.stringify(key)}:${canonicalize(value[key])}`;
    })
    .join(",")}}`;
}

function assertSortedUnique(values, label) {
  const expected = [...new Set(values)].sort((left, right) =>
    Buffer.from(left, "utf8").compare(Buffer.from(right, "utf8")),
  );
  assert.deepEqual(values, expected, `${label} must be unique and sorted`);
}

function assertCanonicalRecordSet(path) {
  const document = read(path);
  assertSortedUnique(document.records.map(({ id }) => id), `${path} record IDs`);
  for (const record of document.records) {
    for (const field of ["source_ids", "approval_ids"]) {
      if (record[field]) assertSortedUnique(record[field], `${record.id}.${field}`);
    }
    if (record.scope?.markets) assertSortedUnique(record.scope.markets, `${record.id}.scope.markets`);
    if (record.scope?.locales) assertSortedUnique(record.scope.locales, `${record.id}.scope.locales`);
  }
}

assertCanonicalRecordSet("tests/fixtures/revisions/valid-canonical-claims.json");
assertCanonicalRecordSet("tests/fixtures/revisions/valid-canonical-visual-tokens.json");
assert.throws(
  () => assertCanonicalRecordSet("tests/fixtures/revisions/invalid-canonical-record-order.json"),
  /must be unique and sorted/,
);

function assertRevisionLineage(revision) {
  assert.notEqual(revision.revision_id, revision.parent_revision_id, "a revision cannot parent itself");
}
assertRevisionLineage(read("tests/fixtures/revisions/valid-revision.json"));
assertRevisionLineage(read("tests/fixtures/revisions/valid-unsigned-revision.json"));
assert.throws(
  () => assertRevisionLineage(read("tests/vectors/invalid-self-parent-revision.json")),
  /cannot parent itself/,
);

const contentVector = read("tests/vectors/revision-content-digest.json");
const normalizedFiles = [...contentVector.files].sort((left, right) =>
  Buffer.from(left.path, "utf8").compare(Buffer.from(right.path, "utf8")),
);
assert.equal(sha256(canonicalize(normalizedFiles)), contentVector.expected_content_sha256);

const signingVector = read("tests/vectors/revision-signing-payload.json");
const { signature: _signature, ...unsignedRevision } = signingVector.revision;
assert.equal(sha256(canonicalize(unsignedRevision)), signingVector.expected_signing_payload_sha256);
assert.ok(!canonicalize(unsignedRevision).includes(signingVector.revision.signature.value));
const publicKey = createPublicKey({
  key: Buffer.from(`302a300506032b6570032100${signingVector.public_key_hex}`, "hex"),
  format: "der",
  type: "spki",
});
assert.equal(
  verify(
    null,
    Buffer.from(canonicalize(unsignedRevision), "utf8"),
    publicKey,
    Buffer.from(signingVector.revision.signature.value, "base64"),
  ),
  true,
);

const requestDigest = (patch) => sha256(canonicalize({
  schema: patch.schema,
  base_revision_id: patch.base_revision_id,
  operations: patch.operations,
}));
const binding = read("tests/vectors/patch-idempotency-binding.json");
assert.equal(requestDigest(binding.first), binding.expected_request_sha256);
assert.equal(requestDigest(binding.retry_with_different_external_key), binding.expected_request_sha256);

const conflict = read("tests/vectors/patch-idempotency-conflict.json");
assert.equal(conflict.accepted.idempotency_key, conflict.conflicting_retry.idempotency_key);
assert.notEqual(requestDigest(conflict.accepted), requestDigest(conflict.conflicting_retry));
assert.equal(conflict.expected, "idempotency_conflict");

const nullVsAbsent = read("tests/vectors/null-versus-absence.json");
assert.equal(nullVsAbsent.add_absent_before_sha256, null);
assert.equal(sha256(canonicalize(null)), nullVsAbsent.existing_null_sha256);

const stale = read("tests/vectors/patch-stale-base.json");
assert.notEqual(stale.patch.base_revision_id, stale.current_revision_id);
assert.equal(stale.expected, "stale_base");

function decodePointer(pointer) {
  assert.ok(pointer.startsWith("/") && pointer !== "", "patch pointer must be non-empty");
  return pointer.slice(1).split("/").map((segment) => {
    const decoded = segment.replaceAll("~1", "/").replaceAll("~0", "~");
    assert.ok(!["__proto__", "prototype", "constructor"].includes(decoded), "unsafe pointer segment");
    return decoded;
  });
}

function applyReplace(record, operation) {
  assert.equal(operation.op, "replace");
  assert.equal(operation.record_id, record.id);
  const segments = decodePointer(operation.path);
  assert.equal(segments.length, 1, "this canonical vector addresses one direct record field");
  const [field] = segments;
  assert.ok(Object.hasOwn(record, field), "replace target must exist");
  assert.equal(sha256(canonicalize(record[field])), operation.before_sha256);
  return { ...record, [field]: structuredClone(operation.value) };
}

const surgical = read("tests/vectors/semantic-patch-application.json");
assert.deepEqual(applyReplace(surgical.record_before, surgical.operation), surgical.record_after);

const restore = read("tests/vectors/restore-forward-lineage.json");
assert.equal(restore.restoring_revision.parent_revision_id, restore.current_revision.revision_id);
assert.notEqual(restore.restoring_revision.revision_id, restore.selected_prior_revision.revision_id);
assert.equal(restore.restoring_revision.content_sha256, restore.selected_prior_revision.content_sha256);
assert.equal(restore.restoring_revision.change_method, "restore");

const claimSectionMapping = read("tests/vectors/canonical-claims-section-mapping.json");
const projectedClaimBlocks = {
  approved_at_launch: [],
  requires_caveat: [],
  forbidden: [],
};
for (const record of claimSectionMapping.input_records) {
  const block = record.proof_status === "approved"
    ? "approved_at_launch"
    : record.proof_status === "requires_caveat"
      ? "requires_caveat"
      : "forbidden";
  projectedClaimBlocks[block].push({ ...record });
}
for (const records of Object.values(projectedClaimBlocks)) {
  records.sort((left, right) => Buffer.compare(Buffer.from(left.id, "utf8"), Buffer.from(right.id, "utf8")));
}
assert.deepEqual(projectedClaimBlocks, claimSectionMapping.expected_blocks);
assert.deepEqual(
  Object.values(projectedClaimBlocks).flat().map((record) => record.proof_status).sort(),
  claimSectionMapping.input_records.map((record) => record.proof_status).sort(),
);
assert.equal(claimSectionMapping.requirements.retain_original_proof_status, true);
assert.equal(claimSectionMapping.requirements.sort_records_by, "id_utf8");
assert.equal(claimSectionMapping.requirements.surrounding_markdown_is_canonical, false);

const visualTokenMapping = read("tests/vectors/canonical-visual-token-mapping.json");
const visualTokenFieldOrder = [
  "id",
  "kind",
  "value",
  "role",
  "description",
  "scope",
  "source_ids",
  "approval_ids",
  "evidence_status",
];
const projectedVisualTokens = visualTokenMapping.input_records
  .map((record) => Object.fromEntries(
    visualTokenFieldOrder
      .filter((field) => Object.hasOwn(record, field))
      .map((field) => [field, structuredClone(record[field])]),
  ))
  .sort((left, right) => Buffer.compare(Buffer.from(left.id, "utf8"), Buffer.from(right.id, "utf8")));
assert.deepEqual(projectedVisualTokens, visualTokenMapping.expected_canonical_tokens);
for (const record of projectedVisualTokens) {
  assert.deepEqual(Object.keys(record), visualTokenFieldOrder.filter((field) => Object.hasOwn(record, field)));
}
assert.deepEqual(
  projectedVisualTokens.map(({ kind }) => kind).sort(),
  ["color", "dimension", "font_family", "font_weight", "number", "string"],
);
assert.equal(visualTokenMapping.requirements.infer_semantic_blocks, false);
assert.equal(visualTokenMapping.requirements.surrounding_markdown_is_canonical, false);

console.log("revision extension canonicalization vectors passed");
