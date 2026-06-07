# Brand Context Protocol (BCP)

The open standard for encoding brand identity as a portable, machine-readable package.

AI agents generate content about your brand every day. Without a machine-readable source of truth, they guess. BCP gives them the answer.

## Specification

**[SPEC.md](SPEC.md)** is the normative specification for BCP v0.4. It defines the required markdown core, optional package extensions, discovery, resolution, versioning, taxonomy alignment, and consumption patterns.

## Repository layout

- [`SPEC.md`](SPEC.md) — The normative specification text (v0.4).
- [`schema/`](schema/) — JSON Schema definitions for validation.
- [`examples/`](examples/) — Example BCP implementations.
- [`spec/hypotheses.md`](spec/hypotheses.md) — Open hypotheses and design questions.
- [`GOVERNANCE.md`](GOVERNANCE.md) — BDFL governance model and RFC process.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — How to contribute.

## Quick start

Publish a `brand.md` file at `/.well-known/` on your domain, plus the canonical daughter files under `/.well-known/brand/`. Agents, platforms, and tools can read the markdown core immediately. Richer packages may add `manifest.json`, checksums, design tokens, assets, examples, components, and motion guidance later.

## Examples

The [`examples/acme-corp/`](examples/acme-corp/) directory contains a complete BCP implementation for a fictional brand (ACME Corporation) demonstrating the core file types: root, voice, values, boundaries, claims, representation, and visual.

## Website

The specification is also published at [brandcontextprotocol.dev](https://brandcontextprotocol.dev).

## License

- **Specification text:** [CC BY 4.0](LICENSE-SPEC)
- **Schema and code:** [MIT](LICENSE-CODE)

## Maintained by

[Encoded Brands](https://encodedbrands.com) and the community.
