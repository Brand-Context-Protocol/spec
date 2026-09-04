# RFC 0018: Deterministic BCP revisions and semantic diffs

- Status: Draft
- Tracking issue: Pending GitHub authentication; Encoded Brands ticket #321
- Target: Additive post-v0.8 extension contract
- Compatibility: Existing v0.8 core packages remain valid and consumable

## Summary

BCP revisions should be surgical, reviewable, and reproducible. A producer should be able to change one approved claim, one market rule, or one color token without asking a model to rewrite an entire Markdown tree. Before publication, a reviewer should be able to see exactly what changed, who or what proposed it, what evidence changed, and what will be published.

This RFC proposes:

1. optional typed canonical records for facts that require deterministic editing;
2. deterministic Markdown projections so the portable, human-readable v0.8 core remains available to every consumer;
3. immutable publication revisions connected by parent identifiers and content digests;
4. stable-ID semantic patches and semantic diffs;
5. rollback by publishing a new restoring revision, never by rewriting history; and
6. a privacy boundary between the public current revision receipt and private governance history.

The proposal specifies Git semantics, not Git as a required storage engine. Producers may use an append-only database, immutable object storage, Git, or another auditable implementation.

## Problem

Markdown is an effective portable consumption format, but line-oriented editing is too imprecise for high-risk or exact brand data. A whole-file or whole-tree rewrite can unintentionally change unrelated content, reorder records, weaken a caveat, normalize a color, or lose source attribution.

The risk is highest for:

- approved, caveated, forbidden, or time-bounded claims;
- product availability and pricing;
- exact colors, typography, and asset identifiers;
- market- and locale-scoped boundaries;
- evidence, sources, approvals, and expiration dates.

The current specification recommends version control and permits structured companions, but it does not define which representation is authoritative, how deterministic projection is proven, how revisions relate to one another, or how a semantic change is addressed without replacing an entire document.

## Goals

- Make a one-record change addressable by stable identity.
- Make the resulting BCP tree reproducible from canonical state.
- Preserve the v0.8 Markdown core for universal consumption.
- Give humans and agents both file diffs and domain-aware semantic diffs.
- Record publication lineage without exposing deleted or confidential historical content by default.
- Separate baseline integrity from paid workflow or governance features.
- Permit optional Git export or synchronization without making a repository mandatory.

## Non-goals

- Requiring a particular Registry, Encoder, database, object store, or Git provider.
- Making previous package content public.
- Replacing Markdown as the universal BCP consumption layer.
- Standardizing a collaborative editor or approval user interface.
- Treating a publication signature, domain verification, or reviewer approval as the same trust signal.
- Making typed companions mandatory for core conformance.

## Design principles

### One canonical value, multiple deterministic representations

An exact value must have one declared canonical record. Markdown, JSON, CSS, and interoperability artifacts may repeat that value only as deterministic projections from that record.

Duplicated representation is permitted. Duplicated authority is not.

### Stable identities, not array positions

Records that may be revised independently must carry stable producer-scoped identifiers. Patches address those identifiers, not a line number or array index. Reordering a rendered list must not turn into a semantic change.

### Version every executable contract

Schema identifiers, canonicalization profiles, renderer names and versions, and patch formats are part of the interoperable contract. A producer must not change the behavior behind an existing identifier or version. A behavior change requires a new version, and a consumer that does not recognize that version must fail the typed operation explicitly while remaining able to consume the projected v0.8 Markdown core.

### Immutable publication

Every publication creates a new immutable revision of the complete published package. A revision has at most one parent. Published revisions are not edited in place.

### Restore forward

Restoring prior content creates a new revision whose content matches the selected earlier state and whose parent is the current revision. History is never rewritten.

### Current truth is public; governance history is private by default

Consumers need the current revision identifier, package digest, signature, and publication time. They do not automatically need old content, internal comments, personal identities, rejected patches, or deleted material.

## Proposed contract

### Canonical model declaration

A package that adopts this RFC declares its canonical model in `manifest.json`:

```json
{
  "bcp_version": "0.8",
  "tree_version": "2.1.0",
  "brand_name": "Example Brand",
  "canonical_model": {
    "schema": "bcp.canonical.v1",
    "records": [
      "/.well-known/brand/claims.json",
      "/.well-known/brand/boundaries.json",
      "/.well-known/brand/markets.json",
      "/.well-known/brand/commerce.json",
      "/.well-known/brand/tokens.json",
      "/.well-known/brand/sources.json"
    ],
    "projection": "deterministic"
  }
}
```

The listed files are optional package extensions. A producer emits only the record sets it can support. Their eventual schemas should reuse existing BCP vocabulary and should not invent facts that are absent from an admissible source or accountable confirmation.

When `canonical_model.projection` is `deterministic`:

- the listed typed records are authoritative for the exact fields they define;
- the corresponding Markdown is a deterministic human-readable projection;
- the manifest lists and hashes both forms;
- validation fails if the projection cannot be reproduced or the forms disagree; and
- fields not covered by a typed record remain authored in the Markdown core.

This is an explicit opt-in exception to v0.8's general core-precedence rule. An unrecognized companion never silently overrides Markdown: the producer must declare the canonical model and prove projection parity in the manifest.

### Typed record requirements

Every independently editable record must include:

```json
{
  "id": "claim.free-dns-verification",
  "value": "Domain verification is available at no charge.",
  "status": "approved",
  "scope": {
    "markets": ["US", "GB"],
    "locales": ["en-US", "en-GB"]
  },
  "source_ids": ["source.pricing-page"],
  "valid_from": "2026-08-31",
  "valid_until": null
}
```

At minimum:

- `id` is stable within the package and must not be reused for a different logical record;
- exact values preserve their native type rather than being embedded in prose;
- scope is explicit when a rule is not global;
- source and approval references use stable identifiers;
- absence, unknown state, and removal remain distinguishable; and
- arrays whose order has no meaning are canonicalized by stable identifier before hashing.

Schemas may add domain-specific required fields. For example, a claim needs proof status and approved language; a color token needs a normalized color value and role; a price needs currency, amount, cadence, market, and effective dates.

Every typed file must declare an immutable schema identifier or resolvable schema URI. Published schema bytes must be content-addressable, and a package manifest should record their digests. A producer must validate canonical records against the declared schema before rendering, diffing, patching, or publication.

### Canonical serialization and hashing

Interoperable digests and signatures must not depend on a runtime's ordinary JSON serializer. This extension uses the JSON Canonicalization Scheme (JCS, RFC 8785) for JSON objects unless a future version explicitly names another profile. Inputs must first pass their declared schema; values that JCS cannot represent are invalid rather than implementation-defined.

Unless a field says otherwise, a `sha256` value in this RFC is lowercase hexadecimal SHA-256 over the UTF-8 bytes of its canonical representation. Record sets whose order is semantically irrelevant must be sorted by stable record identifier before canonicalization. Arrays whose order is meaningful preserve their declared order.

The complete normalized patch request used for idempotency binding includes `schema`, `base_revision_id`, and the ordered `operations` array after schema validation and canonicalization. The external idempotency key is not included in the request digest. A producer stores or can reconstruct the mapping from `(authorized tenant, idempotency_key)` to that digest and must reject a different digest for the same key.

### Deterministic rendering

A conforming deterministic renderer must define:

- schema version;
- field ordering;
- record ordering;
- whitespace and newline rules;
- escaping and Unicode normalization;
- date, number, currency, and color normalization;
- treatment of unknown and omitted values; and
- renderer version.

The renderer must produce byte-identical output for identical canonical state, schema version, and renderer version.

For `bcp.canonical.claims.v1`, deterministic projection targets the structured
claim blocks inside `claims.md`; it does not make surrounding review notices or
explanatory prose canonical. The renderer maps proof status to the required
BCP v0.8 blocks using the safety-preserving table in SPEC.md §7.6: `approved`
to `approved_at_launch`, `requires_caveat` to `requires_caveat`, and every
other v1 proof status to `forbidden`. The original `proof_status` remains in
the rendered record. Renderers must sort records within each block by stable
record identifier using UTF-8 byte order and must not silently omit a canonical
field. A renderer version must fix its YAML field ordering, scalar escaping,
indentation, and newline behavior.

The manifest should record the renderer receipt:

```json
{
  "renderer": {
    "name": "bcp-reference-renderer",
    "version": "1.0.0",
    "canonical_state_sha256": "...",
    "projected_tree_sha256": "..."
  }
}
```

The renderer version identifies immutable executable behavior, not merely a package release label. A producer must retain the renderer or a reproducible artifact for every revision it claims can be reconstructed. Projection validation compares the exact projected bytes and fails before publication if any declared projection differs.

### Publication revision descriptor

The current package may publish `/.well-known/brand/revision.json` and declare it in the manifest. The descriptor contains only the receipt needed to identify and verify the current publication:

```json
{
  "schema": "bcp.revision.v1",
  "revision_id": "01J7A4P4X9V8F6GX7WQ2J9QK4M",
  "parent_revision_id": "01J78XQ7QBWJY2DVBH5Z75C0ZR",
  "tree_version": "2.1.0",
  "published_at": "2026-09-03T20:15:00Z",
  "content_sha256": "...",
  "manifest_sha256": "...",
  "change_method": "owner_edit",
  "signature": {
    "algorithm": "Ed25519",
    "key_id": "registry-key-2026-01",
    "value": "..."
  }
}
```

`revision_id` is an opaque stable identifier. It must not encode an email address, account identifier, or other personal information. `content_sha256` covers a specified canonical package manifest or tree serialization, not an implementation-dependent directory walk.

For `bcp.revision.v1`, `content_sha256` is the SHA-256 digest of the JCS serialization of an array containing one object per ordinary published content file with exactly these fields: `path`, `media_type`, `byte_length`, and `sha256`. The manifest and revision receipt are bookkeeping files and are excluded from this array to prevent self-referential digests. Paths are normalized absolute package paths and the array is sorted by each path's UTF-8 byte sequence. `sha256` is the exact-byte digest of that file. `manifest_sha256` is the exact-byte SHA-256 digest of the published manifest file. The manifest declares the revision receipt's path and role but MUST NOT include its `sha256`, because the receipt already binds the manifest digest and hashing the receipt back into that manifest would create an unsatisfiable cycle.

When present, the revision signature covers the JCS serialization of the revision descriptor with the `signature` field omitted. Verification must therefore bind `revision_id`, `parent_revision_id`, tree version, publication time, both digests, and change method. A signature over only `content_sha256`, an implementation-dependent object walk, or a descriptor that still contains its own signature is not conformant. An unsigned receipt remains structurally valid; it conveys lineage and digest information but no signature trust signal.

`change_method` is a bounded machine-readable value such as `owner_edit`, `collaborator_proposal`, `agent_patch`, `research_refresh`, `import`, `restore`, or `migration`. It describes how the change entered the system; it does not prove approval.

The public descriptor must not include reviewer identities, internal comments, rejected changes, or old file contents. A Registry may expose richer history only to authorized owners and collaborators.

### Immutable revision ledger

A producer that advertises revision history must retain, for every published revision:

- revision and parent identifiers;
- an immutable content-addressed manifest;
- exact published bytes or a lossless content-addressed reconstruction;
- package and file digests;
- authoring method;
- accountable actor in the private audit domain;
- proposal, approval, and publication timestamps;
- source and evidence changes; and
- signature receipt when the publication is signed.

The current public package remains available if private history storage is unavailable. A failure to write the immutable revision must fail publication rather than publish untracked bytes.

Publication is a compare-and-append operation against the current revision head. The proposed parent or base revision must still equal the current head when the new immutable revision is committed. Concurrent publication attempts from the same head may not silently create competing current histories: one succeeds and the others fail with an explicit stale-base conflict. A service may retain rejected or abandoned branches privately, but exactly one revision is the public current head.

### Semantic patch format

An authoring system may accept a typed `bcp.patch.v1` document:

```json
{
  "schema": "bcp.patch.v1",
  "base_revision_id": "01J78XQ7QBWJY2DVBH5Z75C0ZR",
  "idempotency_key": "external-agent-operation-id",
  "operations": [
    {
      "op": "replace",
      "record_type": "claim",
      "record_id": "claim.free-dns-verification",
      "path": "/scope/markets",
      "before_sha256": "...",
      "value": ["US", "GB", "DE"]
    }
  ]
}
```

Requirements:

- the patch is bound to one base revision;
- stale-base conflicts fail explicitly rather than being silently rebased;
- `op` is one of `add`, `replace`, or `remove`; unsupported operations fail explicitly;
- every operation addresses a stable record and a field using RFC 6901 JSON Pointer syntax;
- destructive changes require the expected prior-value digest;
- an idempotency key is bound to the complete normalized request;
- a reused key with different content fails;
- authorization, entitlement, and approval are evaluated separately from syntax; and
- applying the same accepted patch more than once cannot create additional revisions or charges.

Normal revisions should use typed operations. Whole-file replacement remains available for import, migration, unsupported extensions, or an explicit expert workflow, but must not masquerade as a surgical semantic patch.

Patch paths may address only schema-declared mutable fields within the selected record. Empty paths, prototype-related segments such as `__proto__`, `prototype`, or `constructor`, and pointers that escape the selected record are invalid. For `replace` and `remove`, `before_sha256` is required and covers the JCS serialization of the exact prior value at `path`. For `add`, `before_sha256` must be JSON `null`, and application fails if a value already exists at `path`. JSON `null` as an existing value is hashed normally and is therefore distinct from absence.

### Semantic diff

Before publication, a producer should provide both:

1. the byte or line diff of projected package files; and
2. a semantic diff over canonical records.

A semantic diff record should identify:

- record type and stable identifier;
- operation: added, changed, removed, restored, or reordered;
- changed fields and normalized before/after values;
- market and locale scope affected;
- evidence or source changes;
- approval-state changes;
- expiration changes; and
- risk class.

Examples include:

- Claim changed from `approved` to `requires_caveat`.
- Evidence removed from `claim.free-dns-verification`.
- Boundary narrowed to Germany.
- Product availability removed in the United Kingdom.
- Color `token.brand-red` changed from `#C93212` to `#C83212`.
- Source replaced for an approved claim.

The diff engine must not label prose similarity as semantic equivalence. If a file cannot be mapped to typed records, it remains an ordinary file diff.

`risk_class` is an implementation-policy result, not a portable statement of fact. When emitted, it must name the policy and version that produced it. Portable semantic diffs should also emit objective `risk_signals` such as `claim_language_changed`, `evidence_removed`, `approval_weakened`, `boundary_narrowed`, `market_availability_changed`, `price_changed`, or `visual_token_changed`, so another consumer can apply its own policy without trusting the producer's severity label.

### Approval and trust separation

The following remain distinct signals:

- content integrity signature;
- domain verification;
- certification or human review;
- change approval inside an authoring workflow; and
- authorship or proposal method.

Every Registry publication may have a signed immutable revision chain. That is baseline integrity infrastructure and must not depend on payment.

Paid governance products may add named reviewers, multi-party approval, longer owner-accessible history, audit export, team roles, controlled restoration, and policy enforcement. Payment must not change the meaning of domain verification or content signatures.

### Git interoperability

A producer may export the canonical records, projected Markdown tree, manifests, and revision receipts to Git. A producer may also import from or synchronize with a customer-controlled repository.

Git commit identifiers must not be used as the only BCP revision identifier or signature. Git availability, account access, repository privacy, force-push behavior, and provider-specific semantics are outside the portable protocol contract.

## Compatibility and migration

This proposal is additive:

- Existing v0.8 Markdown-only packages remain conformant.
- Existing consumers may ignore the new extension files and continue reading Markdown.
- Producers may adopt typed records one domain at a time.
- A package must not claim deterministic projection until parity validation passes.
- During migration, a producer may import existing Markdown into typed records, but must label machine-derived source and approval state truthfully.
- Migration creates a new revision; it does not retroactively rewrite old publications.

The reference implementation must prove that a v0.8 consumer receives equivalent Markdown before any typed model becomes authoritative in production.

## Privacy and deletion

- Public history is not required.
- Removing content from the current package does not require making the removed content publicly retrievable.
- Authorized revision history may retain deleted content for audit or restoration according to the producer's disclosed retention policy.
- Personal actor identities remain private unless the actor explicitly consents to publication.
- A public revision receipt should survive account deletion only where the Registry's integrity and legal-retention policy permits it.
- Private drafts, rejected patches, comments, and source documents are not BCP package content.

## Security considerations

- Hashes must cover an unambiguous canonical serialization.
- Patch paths must not permit prototype pollution, path traversal, or arbitrary file writes.
- A patch is untrusted input until schema, authorization, base revision, expected value, and policy checks pass.
- Source removal and approval weakening should be treated as high-risk changes.
- Renderers must not execute Markdown, templates, or embedded source instructions.
- Rollback must pass current authorization and policy checks; an old approval does not automatically authorize republication today.
- Signatures attest to published bytes, not the truth of a claim.

## Reference implementation rollout

The reference implementation should ship this work in staging slices:

1. **Architecture and fixtures.** Approve this RFC, schemas, canonicalization rules, and round-trip fixtures.
2. **Immutable ledger.** Record every publication with a parent, manifest, actor/method, timestamps, and exact content. Preserve the current public output.
3. **Typed records and renderers.** Begin with claims and visual tokens, then boundaries, markets, commerce, and sources. Prove byte-stable rendering and v0.8 parity.
4. **Patch and diff.** Add request-bound typed patches, stale-base conflict handling, semantic diff APIs, and the pre-publication review UI.
5. **Restore and governance.** Add restore-forward behavior, approvals, audit export, and optional Git synchronization.

Each slice must be independently reversible. Database migrations land before dependent application code. Production release requires staging evidence for:

- existing v0.8 package reads;
- deterministic round trips;
- stale-base and idempotency conflicts;
- unrelated-field preservation;
- signed manifest and revision verification;
- restore-forward lineage;
- privacy and authorization boundaries; and
- rollback to the previous application version without corrupting the revision chain.

## Decisions for the first extension release

The first extension release adopts these decisions so separate implementations can build compatible fixtures:

1. `/.well-known/brand/revision.json` is a standard optional package file. A producer that publishes it must declare its path, media type, and `revision_receipt` role in the manifest, but MUST NOT add its digest to that manifest. The signed receipt binds the manifest digest in the opposite direction. The manifest may repeat non-signing display metadata from its current receipt but may not define a conflicting second revision authority.
2. Typed sources use a combination of stable source ID, URI, retrieval or observation time, and—when exact bytes were captured—content digest and media type. A retrieval receipt is optional unless another schema requires it. A URL alone proves neither the observed content nor continued availability.
3. The first canonical schemas cover claims and visual tokens. Boundaries, markets, commerce, and general source records follow only after the first two schemas and round-trip fixtures are stable.
4. A projection that cannot be reproduced declares `projection: "manual"`; Markdown remains authoritative and the producer must not publish deterministic-renderer receipts or typed semantic-patch guarantees for that surface.
5. The protocol does not impose one private-history retention period. A service advertising history must disclose a machine-readable retention policy and must not claim a revision is restorable after its exact bytes or lossless reconstruction expire. The current public revision receipt remains subject to the Registry's disclosed integrity and legal-retention policy.
6. Semantic risk severity remains implementation policy. Portable diffs standardize objective risk signals and identify any policy/version used to derive a severity.

## First executable artifacts

The first extension release publishes these versioned JSON Schema contracts:

- `schema/revision.schema.json` for `bcp.revision.v1` public receipts;
- `schema/patch.schema.json` for `bcp.patch.v1` semantic patch requests;
- `schema/canonical-claims.schema.json` for `bcp.canonical.claims.v1`; and
- `schema/canonical-visual-tokens.schema.json` for `bcp.canonical.visual-tokens.v1`.

`schema/manifest.schema.json` additionally validates the `canonical_model` declaration and optional deterministic renderer receipt. A manual projection is forbidden from publishing a renderer receipt. Existing manifests and Markdown-first packages remain valid because both additions are optional.

The schemas deliberately leave stable record and revision identifiers opaque apart from requiring a non-empty string. Identifier syntax is producer-scoped and must not be mistaken for authorization. The patch schema rejects empty document pointers, malformed RFC 6901 escapes, prototype-related segments, missing prior-value digests, and values on remove operations. Current-head comparison, schema-declared field mutability, authorization, approval, and idempotency storage remain mandatory application checks because JSON Schema cannot evaluate them.

For the first canonical visual-token schema, a color value is normalized to uppercase six- or eight-digit hexadecimal form (for example `#C93212` or `#C93212FF`). Three-digit shorthand and lowercase forms are not canonical. Canonical record sets, stable-ID reference arrays, market arrays, and locale arrays use unique values sorted by their UTF-8 byte sequence before hashing.

Positive and negative fixtures live under `tests/fixtures/revisions/`. Cross-implementation digest and signing inputs live under `tests/vectors/`. The vector runner enforces stable-ID ordering for canonical record sets, UTF-8 path ordering for revision content manifests, omission of `signature` from the signing payload, omission of the external idempotency key from the normalized request digest, and conflict detection when one key is reused for different normalized content.

## Open questions

1. Should a later release define a portable approval receipt, or should approval remain service-private while only approval state is projected?
2. Which external evidence-retrieval receipt formats should typed source records recognize first?
3. Should a future multi-parent merge revision be standardized, or should portable BCP history remain strictly single-parent?

## Acceptance direction

1. Keep the v0.8 Markdown core universally consumable.
2. Permit typed canonical authority only through explicit manifest declaration and parity validation.
3. Require stable record identities for surgical patches.
4. Make publication revisions immutable and restore forward.
5. Publish only the current revision receipt by default.
6. Keep integrity, domain verification, certification, workflow approval, and payment separate.
7. Prove compatibility in staging before any production cutover.
