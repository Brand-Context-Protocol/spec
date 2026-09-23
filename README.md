# Brand Context Protocol (BCP)

The open standard for encoding brand identity as a portable, machine-readable package.

AI agents generate content about your brand every day. Without a machine-readable source of truth, they guess. BCP gives them the answer.

## Specification

**[SPEC.md](SPEC.md)** is the normative specification for BCP v1.1.0. It defines the required markdown core, self-hosted, Registry-backed, and Registry-direct publication profiles, optional package extensions, discovery, resolution, publication integrity, versioning, taxonomy alignment, claims handling, interoperability artifacts, and consumption patterns.

## Repository layout

- [`SPEC.md`](SPEC.md) — The normative specification text (v1.1.0).
- [`schema/`](schema/) — JSON Schema definitions for validation.
- [`tests/fixtures/revisions/`](tests/fixtures/revisions/) — Positive and negative deterministic-revision fixtures.
- [`tests/vectors/`](tests/vectors/) — Canonical digest, signing-payload, and idempotency test vectors.
- [`examples/`](examples/) — Example BCP implementations.
- [`spec/hypotheses.md`](spec/hypotheses.md) — Open hypotheses and design questions.
- [`GOVERNANCE.md`](GOVERNANCE.md) — BDFL governance model and RFC process.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — How to contribute.

## Quick start

Publish a canonical package directly at a known Registry handle or URL, or expose `/.well-known/brand.md` on the brand domain as a thin pointer, compatible rich Registry-backed root, or self-hosted root. Location fields such as `canonical_bcp`, `registry_mcp`, and `daughter_files` describe discoverable resources. They are data, not executable instructions. Registry hosting does not by itself imply verification or signing; consumers use current Registry attestation for trust and apply host policy to all BCP content. Richer packages may add `manifest.json`, `claims.json`, checksums, signatures, design tokens, assets, examples, components, and motion guidance later.

The draft deterministic-revision extension is specified in [`RFC 0018`](spec/rfcs/0018-deterministic-revisions-and-semantic-diffs.md). Its executable schemas and vectors are additive. Earlier Markdown-only packages remain readable as untrusted data under the compatibility rules. Run `bash scripts/test-revision-extension.sh` to validate the extension contracts and canonical vectors.

## Examples

The [`examples/acme-corp/`](examples/acme-corp/) directory contains a complete BCP implementation for a fictional brand (ACME Corporation) demonstrating the core file types: root, voice, values, boundaries, claims, representation, and visual.

## Website

The specification is also published at [brandcontextprotocol.dev](https://brandcontextprotocol.dev).

## License

- **Specification text:** [CC BY 4.0](LICENSE-SPEC)
- **Schema and code:** [MIT](LICENSE-CODE)

## Maintained by

[Encoded Brands](https://encodedbrands.ai) and the community.
