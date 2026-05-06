# Brand Context Protocol (BCP)

The open standard for encoding brand identity in a machine-readable format.

AI agents generate content about your brand every day. Without a machine-readable source of truth, they guess. BCP gives them the answer.

## Specification

**[SPEC.md](SPEC.md)** is the normative specification for BCP v0.1. It defines file format, discovery, resolution, versioning, taxonomy alignment, and consumption patterns.

## Repository layout

- [`SPEC.md`](SPEC.md) — The normative specification text (v0.1).
- [`schema/`](schema/) — JSON Schema definitions for validation.
- [`examples/`](examples/) — Example BCP implementations.
- [`spec/hypotheses.md`](spec/hypotheses.md) — Open hypotheses and design questions.
- [`GOVERNANCE.md`](GOVERNANCE.md) — BDFL governance model and RFC process.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — How to contribute.

## Quick start

Publish a `brand.md` file at `/.well-known/` on your domain. Agents, platforms, and tools read it automatically. See the [specification](SPEC.md) for the full file format and hosting requirements.

## Examples

The [`examples/acme-corp/`](examples/acme-corp/) directory contains a complete BCP implementation for a fictional brand (ACME Corporation) demonstrating all file types: root, voice, values, boundaries, claims, and representation.

## Website

The specification is also published at [brandcontextprotocol.dev](https://brandcontextprotocol.dev).

## License

- **Specification text:** [CC BY 4.0](LICENSE-SPEC)
- **Schema and code:** [MIT](LICENSE-CODE)

## Maintained by

[Encoded Brands](https://encodedbrands.com) and the community.
