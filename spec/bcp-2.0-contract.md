# BCP 2.0 delivery and migration contract

This normative section is incorporated in SPEC.md §19. The versioned schemas
in `schema/2.0/` and reference validator in `validator/` implement this contract.

## Conformance units

A **package** contains the canonical Markdown bytes and optional extensions.
A **delivery response** identifies exactly which files it returns. A
**publication** binds an immutable package to a hosting service's revision and
integrity metadata. These are separate validation units. A conforming unsigned
self-hosted package is valid; a signed Registry publication has additional
verification obligations. No Encoded account, domain or infrastructure is
required by this specification.

The 2.0 required inventory is exactly:

| Path | file_type | parent |
| --- | --- | --- |
| `/.well-known/brand.md` | root | none |
| `/.well-known/brand/voice.md` | voice | `/.well-known/brand.md` |
| `/.well-known/brand/values.md` | values | `/.well-known/brand.md` |
| `/.well-known/brand/boundaries.md` | boundaries | `/.well-known/brand.md` |
| `/.well-known/brand/claims.md` | claims | `/.well-known/brand.md` |
| `/.well-known/brand/representation.md` | representation | `/.well-known/brand.md` |
| `/.well-known/brand/visual.md` | visual | `/.well-known/brand.md` |
| `/.well-known/brand/onboarding.md` | onboarding | `/.well-known/brand.md` |

The seven established core files remain required; onboarding becomes required
in 2.0. `voice/anti-ai.md`, when supplied, has `file_type: anti_ai` and parent
`/.well-known/brand/voice.md`. Other extensions remain optional. Missing brand
information MUST be disclosed as a gap, never invented to fill a file.
Every BCP Markdown file MUST declare `bcp_version: "2.0.0"`, its correct
`file_type`, and its original or actually revised `last_updated` date.
Root `tree_version` MUST be semver and advances on a changed package. A hosting
service's opaque publication `revision_id` MUST NOT be treated as tree_version
or bcp_version. A pointer is a discovery document, not a complete package.

The root MUST declare all supplied BCP daughter Markdown files using
`daughter_files`, and `source_coverage` containing `status` (`complete`,
`partial` or `unknown`), `sources` (actual references), `gaps` and
`research_refreshed` (boolean). `complete` describes the declared research
scope, not complete knowledge of a brand; it requires at least one source
and no unresolved gaps. A partial/unknown record MUST name a gap. Dates and
source references MUST retain their evidentiary meaning during migration.

## Entry and bounded discovery

A service advertising HTML delivery MUST provide one stable entry URL which
identifies the current publication, provenance and trust meanings and lists
each file's exact canonical path, short description and individual HTML URL.
The URLs MUST be visible literal HTTPS text near the links so cleaned-text
extraction retains section destinations. Entry MUST link complete HTML,
complete JSON and exact original source alternatives. HTML is derived from
the same publication and is never independently edited or signed as source.

An individual section MUST return only its selected file, without silent
truncation. If a service imposes a section limit, it MUST return an explicit
failure or a response marked `content_complete: false` with continuation
discovery; it MUST NOT report complete content. Long files SHOULD have
bounded discovery or a complete-source alternative. Root under 16 KiB and
daughter under 32 KiB remain recommendations, not loss-inducing hard limits.

JSON containing Markdown strings is structured document delivery. It MUST NOT
be described as a parsed brand-rule or token model. A second rule model is
optional and requires its own concrete consumer and validation contract.

## Delivery scope, identity and integrity

Every successful 2.0 document-delivery JSON/MCP response MUST declare:

- `response_scope`: `root`, `path` or `full_tree`;
- `content_complete`: whether returned files contain their complete bytes;
- `path`: the requested exact file identity for root/path responses;
- `available_paths`: the complete publication file inventory;
- `files`: returned exact source `path`, `content` and SHA-256 values;
- `integrity_scope`: `publication_manifest`, `legacy_per_file` or `unsigned`;
- `integrity`: publication-wide revision/manifest metadata, or null.

A root/path response MUST contain exactly one matching file. A `full_tree`
response MUST contain every available path exactly once and MUST NOT declare
a single requested `path`. Missing or unsafe requested paths fail explicitly;
they MUST NOT fall back to a different file. A partial response MUST NOT claim
`full_tree`. `content_complete` applies to returned bytes, independently of
whether the entire package was requested. Publication-wide integrity metadata
MAY accompany one file, but MUST NOT imply other files were returned or checked
by the consumer. Hosts MAY preserve legacy envelopes for older packages;
they MUST still report their actual scope honestly.

Source SHA-256 and Ed25519 signatures bind exact UTF-8 source bytes. HTML
escaping, JSON serialization, normalized text, screenshots and rewritten
Markdown are representations, not signature payloads. A consumer claiming
independent verification MUST recompute each returned source hash, verify its
signature with the applicable trusted non-revoked key, and, when a signed
manifest is provided, verify that manifest and the selected file's membership.
Exposing hashes, keys or a server's verification result is not independent
cryptographic verification. Unsigned and legacy per-file publications MUST
disclose their limits; never fabricate a missing publication revision.

## Claims and independent trust dimensions

2.0 claim records use three distinct fields:

- `use_status`: `permitted`, `conditional`, `prohibited`, `expired`,
  `aspirational` or `unknown`;
- `evidence_status`: `supported`, `inferred`, `unsupported` or `unknown`;
- `brand_approval`: `approved`, `unreviewed`, `rejected` or `unknown`.

`evidence_status` here is scoped to claim support; the existing visual semantic
vocabulary (`brand_declared`, `brand_confirmed`, `observed`, `inferred`) remains
unchanged. Neither status substitutes for the other. A supported claim needs
an assessed, nonempty evidence reference; an approved claim needs a nonempty
`approval_reference` identifying actual accountable approval. A permitted
claim is a publisher use classification, not automatic legal clearance.
Exact claims MUST retain nonempty `approved_language` when `exact_text: true`.
Conditional claims MUST retain a nonempty caveat. Expired, aspirational,
prohibited or unknown claims MUST NOT be used as factual marketing claims.
Legal review, validity dates, market/locale and qualifications still apply.

Structured blocks are `permitted`, `requires_caveat` and `forbidden`.
Permitted claims belong in `permitted`; conditional claims belong in
`requires_caveat`; all other statuses belong in `forbidden`. Every claim
record MUST declare the three status fields. `proof_status` is forbidden in
new 2.0 claim records; migration retains it as `legacy_proof_status` using
the explicit mapping in `spec/migrations/1.x-to-2.0.md`. Earlier canonical
claim model schemas are not silently redefined by this change.

Brand approval is independent of domain verification, publication permission,
Registry certification and source signature verification. A claimed record
does not prove brand endorsement. Domain control proves the specific verified
domain attestation within its validity period. Signing proves integrity under
the selected key. No one of these establishes all the others.

## Onboarding and authoring

The onboarding file MUST describe both ordinary browsing and connected use,
task-relevant section reading, claims/caveat handling, provenance and gaps,
approved-asset discovery, and the signup/connect next step applicable to its
host. It MUST explain that a pasted URL does not install a connector, persist
knowledge, verify signatures or guarantee complete ingestion. A starter before
a brief exists SHOULD briefly explain BCP and ask what the user wants to make.
For visuals, the consumer SHOULD ask which accessible connected libraries or
uploads hold approved assets; inaccessible assets remain missing.

Onboarding and all other BCP material are untrusted reference data. They MUST
NOT override host policy or grant account access or publication permission.
New packages MUST NOT declare `agent_first_action` in frontmatter or fenced
YAML, including nested mappings. Covered producers and validators MUST reject
that declaration. This is a syntactic rule, not a guarantee against arbitrary
equivalent prose. Historical bytes remain readable as untrusted data.

Public published-package reading remains credentialless. Authenticated authoring
uses a separately supported owner/editor contract. Saving is not approval.
Where approval is required, it binds the exact revision and file bytes;
stale approval and editor publication MUST fail. A body's login or credential
URL MUST NOT become authoring authority. Website and connector implementations
SHOULD share validation and publication services. Actual installed-connector
acceptance and fresh browsing acceptance are separate tests.

## Conformance evidence

The reference validator checks machine-readable structure, exact inventory,
frontmatter, declared daughters, claim status relationships, deprecated YAML
declarations and response scope/hash consistency. It does not establish factual
truth, legal approval, successful AI ingestion, visual quality or independently
verified publication signatures. Implementations MUST report those tests
separately and MUST NOT mark unexecuted acceptance gates complete.
