# Changelog

All notable changes to the Brand Context Protocol specification are documented here. Entries are in reverse chronological order. Each entry covers changes to the spec and its reference schemas.

---

## v0.4 — 2026-05-30

Promotes `visual.md` to a first-class standard daughter file alongside `voice.md`, `values.md`, `boundaries.md`, `claims.md`, and `representation.md`.

- **Registered `visual` in the canonical daughter map.** Root files should declare `visual: /.well-known/brand/visual.md` when publishing visual identity guidance.

- **Expanded visual.md coverage.** The visual daughter now explicitly covers logo, color, type, layout, and imagery principles.

- **Added canonical schema entrypoint.** `schema/brand-context.schema.json` defines valid BCP frontmatter file types, including `visual`.

All changes are additive per §8.2.

---

## v0.2 — 2026-05-13

### voice.md schema update

This release adds a formal schema for voice.md. The v0.1 spec described voice.md in prose (§7.2) without defining structured fields. v0.2 defines eight new optional blocks grounded in structural analysis of three professional brand style guides: Afterpay, Brex, and ROKiT.

- **Added `essence` block.** One-liner positioning statements: mission, vision, purpose, tagline, brand_promise. All keys optional. Each value is a single sentence.

- **Added `traits` block.** Bipartite voice trait list. Each entry has an `is` column (what the voice is) and a `not` column (what the voice refuses to be), with an optional description. Replaces the informal v0.1 `attributes` list. The `attributes` key remains valid and is not deprecated.

- **Added `vocabulary.substitutions` sub-key.** Three-column SAY/NOT/EXAMPLE table for preferred term to avoided term mappings. The v0.1 `vocabulary.prefer` and `vocabulary.avoid` sub-keys are unchanged.

- **Added `forbidden_topics` block.** Topics the brand does not associate with. Each entry has a `topic` string and an optional `severity` of `never` or `avoid`.

- **Added `naming` block.** Canonical brand name, capitalization rules, forbidden variants, sub-brand relationships, and acronym rules.

- **Added `messaging_tiers` block.** The same message at blunt, short, and long lengths, keyed by topic. Designed for runtime copy selection by agents.

- **Added `topic_templates` block.** "How we talk about X" guidance per recurring topic, with optional good and bad examples.

- **Added `audience_modulation` block.** Lightweight per-audience voice overrides covering tone shifts, trait overrides, and vocabulary additions. Does not replace full `audiences/{segment}.md` files.

All new fields are optional. A v0.1 voice.md with no new fields is a valid v0.2 document. Producers upgrading from v0.1 should update `bcp_version` to `"0.2"` when adding any new field.

The new `schema/v0.2/voice.schema.json` validates the YAML frontmatter and structured body blocks for voice.md files.

---

## v0.3 — 2026-05-06

Introduces the voice/ subtree. Defines `voice/anti-ai.md` as a standard granddaughter file for AI-generated language avoidance patterns. Adds `anti_ai` to the `file_type` enum. All changes are additive per §8.2.

---

## v0.2 — 2026-05-06

Schematizes `visual.md` (logo, color tokens, typography, imagery principles). Adds `never_compare_to` and `framing_traps` to `representation.md`. Closes §17.7. All changes are additive per §8.2. No v0.1 fields removed or semantically reversed.

---

## v0.1 — 2026-04-18

Initial draft. Full specification across 16 sections plus appendices. Preserves hierarchical file architecture, CC BY 4.0 and MIT dual-license, IAB Content Taxonomy 3.0 and GARM Brand Safety Framework alignment, three-ring distribution model.
