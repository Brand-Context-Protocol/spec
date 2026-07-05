# Changelog

All notable changes to the Brand Context Protocol specification are documented here. Entries are in reverse chronological order. Each entry covers changes to the spec and its reference schemas.

---

## v0.7 agent discovery guidance — 2026-07-05

Prompted by a live test: a general-purpose agent asked about a brand that publishes a BCP did not fetch `/.well-known/brand.md` on its own until told to. The file being reachable was never the gap — nothing prompted a consumer that didn't already know BCP existed to look. Three additive recommendations, none required for conformance:

- **New recommended "Agent Instructions" block** in `brand.md` (§7.1.2): a short, imperative, producer-authored block telling a consuming agent to fetch this file before answering brand-related questions and to load daughters lazily by task. Recommended shape included in the spec; producers write it in their own voice.
- **New optional `agent_first_action` frontmatter field** (schema updated) for consumers that parse frontmatter rather than prose, e.g. `agent_first_action: "fetch /.well-known/brand.md"`.
- **Recommended discovery path for consumers** (§5.5.1–5.5.2): registry lookup first when a handle is known, direct `/.well-known/` fetch as fallback, prefer `official_brand_source: true` records — and a recommendation that consumers attempt discovery on any brand-naming query calling for brand-accurate output, not only when a user explicitly names BCP.
- **New platform/tool-integration recommendations** (§13.5), addressed to AI platforms and assistants rather than individual producers: check for a BCP by default on brand queries, prefer verified registry records, cache with respect to `last_updated`, surface grounding to the end user.

All changes are additive per §8.2; a v0.6-conformant BCP without any of the above remains fully valid.

---

## v0.6 interoperability artifacts — 2026-07-03

Documents `brand.json` and `DESIGN.md` interop patterns, and registry trust attestation, that were already shipped in the reference implementation — the spec catching up to the code, not the reverse.

- **`brand.json`** (§5.8): an optional, deterministically-derived root-level file projecting a BCP's compiled colors, fonts, logos, and tone into the schema used by the Ad Context Protocol (AdCP)'s `brand_agent`/`get_brand_identity` contract, so AdCP-native agents can discover and read a brand without knowing BCP exists.
- **`get_bcp` AdCP fields/use_case support**: `get_bcp` MAY optionally accept AdCP-shaped `fields`/`use_case` arguments and answer from the same published `brand.json` — no second tool, no revived `get_brand_identity`.
- **Registry trust attestation** (§5.9, Ring 2/3): a `claimed`/`verified` trust ladder; authorized-only fields gate behind `official_brand_source`.
- **`DESIGN.md`** noted as a second interop candidate (Google Labs, alpha) for the same root-level pattern — not yet built at the time of this spec entry.

All changes are additive per §8.2.

---

## v0.5 commerce pointer — 2026-06-13

Adds the optional commerce layer so agents can move from understanding a brand to purchasing from it, without BCP reinventing checkout or payment.

- **New optional `commerce.md` daughter file** (`/.well-known/brand/commerce.md`, §7.11). Declares `offers` (what is for sale, with price) and `protocols` (the commerce or payment protocols the brand supports, most-preferred first). It points to an external protocol rather than defining payment itself: UCP (`/.well-known/ucp`), an Agentic Commerce Protocol surface, or a Stripe Machine Payments Protocol (402) endpoint.
- **New optional root `commerce` pointer** in `brand.md` frontmatter (§4.6) so the signpost is discoverable.
- **Understanding precedes transaction.** A consuming agent should read `brand.md` and the task-relevant daughter files before acting on the commerce pointer. BCP remains the understanding layer; commerce protocols remain the transaction layer.
- Both the file and the pointer are optional. A BCP without them is a valid v0.5 document. All changes are additive per §8.2.

---

## v0.4 package clarification — 2026-06-07

Clarifies BCP as a portable brand context package with a small required markdown core and optional enrichment layers.

- **Core completion stays simple.** A complete core BCP remains the canonical markdown tree: `brand.md`, `voice.md`, `values.md`, `boundaries.md`, `claims.md`, `representation.md`, `visual.md`, plus `voice/anti-ai.md` when emitted.

- **Optional package extensions blessed.** Producers may add `manifest.json`, file checksums, `tokens.json`, `tokens.css`, visual assets, motion guidance, examples, components, and other structured extension files.

- **Manifest entrypoint added.** Root frontmatter may declare `package_manifest: /.well-known/brand/manifest.json` and optional `extensions` pointers.

- **Conformance clarified.** Optional extension files are enrichment, not completion criteria. Consumers must ignore extensions they do not understand and must still accept a conformant markdown core.

These are additive clarifications. Existing v0.4 files remain valid.

---

## v0.4 clarification — 2026-06-06

Adds two canonical semantics without changing required fields:

- **Rule tiers.** Structured entries may declare `tier: core`, `tier: default`, or `tier: contextual`. Consumers treat absent tiers as `default`. `core` entries are binding brand law; `contextual` entries apply only when their declared context matches the task.

- **Exact claims.** `claims.md` entries may declare proof status, owner, validity windows, source hashes, `exact_text`, and `approved_language`. Consumers must not paraphrase entries marked `exact_text: true` and must not use `forbidden` or `expired` claims.

These are additive clarifications. Existing v0.4 files remain valid.

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
