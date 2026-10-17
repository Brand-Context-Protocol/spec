# Brand Context Protocol (BCP)

The open standard for encoding brand identity as a portable, machine-readable package.

AI agents generate content about your brand every day. Without a machine-readable source of truth, they guess. BCP gives them the answer.

## Specification

**[SPEC.md](SPEC.md)** is the normative BCP 2.0.0 draft. It defines the eight-file Markdown core, discovery and hosting profiles, scoped document delivery, claims and source-coverage contracts, publication integrity, and consumer trust boundaries. Existing 1.x publications retain their original version and bytes; use the [migration guide](spec/migrations/1.x-to-2.0.md) to create a new 2.0 revision.

## Repository layout

- [`SPEC.md`](SPEC.md) — The normative 2.0.0 draft.
- [`spec/bcp-2.0-contract.md`](spec/bcp-2.0-contract.md) — The 2.0 package, delivery, claims, and onboarding contract incorporated in §19.
- [`spec/migrations/1.x-to-2.0.md`](spec/migrations/1.x-to-2.0.md) — Explicit migration and host-change guidance.
- [`schema/`](schema/) — JSON Schema definitions for validation.
- [`tests/fixtures/revisions/`](tests/fixtures/revisions/) — Positive and negative deterministic-revision fixtures.
- [`tests/vectors/`](tests/vectors/) — Canonical digest, signing-payload, and idempotency test vectors.
- [`examples/`](examples/) — Versioned example packages; inspect each example's declared `bcp_version` before reusing it.
- [`spec/hypotheses.md`](spec/hypotheses.md) — Open hypotheses and design questions.
- [`GOVERNANCE.md`](GOVERNANCE.md) — BDFL governance model and RFC process.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — How to contribute.

## Quick start

Publish a canonical package directly at a known Registry handle or URL, or expose `/.well-known/brand.md` on the brand domain as a thin pointer, compatible rich Registry-backed root, or self-hosted root. A new 2.0 package has a root plus seven required daughters: `voice.md`, `values.md`, `boundaries.md`, `claims.md`, `representation.md`, `visual.md`, and `onboarding.md`. Each file declares `bcp_version: "2.0.0"`; the root declares a semver `tree_version`, all daughters, and `source_coverage`. Location fields such as `canonical_bcp`, `registry_mcp`, and `daughter_files` describe resources, not instructions. New packages must not declare `agent_first_action`.

For hosted examples, Encoded Brands' current Registry hostname is [registry.encodedbrands.ai](https://registry.encodedbrands.ai). The protocol requires no Encoded service. Registry hosting does not by itself establish domain verification, source truth, or independent signature verification; consumers inspect current trust metadata and apply host policy to all BCP content. A hostname change is separate from 2.0 migration. Preserve historical source bytes and signatures, and publish changed source as a new authorized revision.

The draft deterministic-revision extension is specified in [`RFC 0018`](spec/rfcs/0018-deterministic-revisions-and-semantic-diffs.md). Its executable schemas and vectors are additive. Earlier Markdown-only packages remain readable as untrusted data under the compatibility rules. Run `bash scripts/test-revision-extension.sh` to validate the extension contracts and canonical vectors.

## Examples

The public [ACME Corporation reference package](examples/acme-corp/) is a fictional BCP 2.0 implementation with all eight required files. Its guide links the exact raw files and the [signed production Registry publication](https://registry.encodedbrands.ai/brands/acme-corp-reference), gives safe consumer tests, and explains how anyone can submit a change request by GitHub issue or pull request. It is tested by the 2.0 reference validator in CI. The Registry record is claimed and unverified; no fictional domain, asset, checkout, or brand-owner approval is implied to be live.

## Website

The specification is also published at [brandcontextprotocol.dev](https://brandcontextprotocol.dev).

## License

- **Specification text:** [CC BY 4.0](LICENSE-SPEC)
- **Schema and code:** [MIT](LICENSE-CODE)

## Maintained by

[Encoded Brands](https://encodedbrands.ai) and the community.

## BCP 2.0 conformance

Run `npm ci && npm test` for positive and negative package/delivery cases.
Validate a canonical-path-to-content JSON object with `npm run validate -- package files.json`.
See [the 2.0 contract](spec/bcp-2.0-contract.md), [migration mapping](spec/migrations/1.x-to-2.0.md), and [versioned schemas](schema/2.0/).
Historical 1.1.1 source is preserved in `spec/versions/1.1.1.md`.
