# Brand Context Protocol (BCP) — Specification

**Version:** 0.3

**Status:** Draft

**Date:** 2026-05-06

**License:** CC BY 4.0

## Abstract

The Brand Context Protocol (BCP) is an open specification for publishing machine-readable brand identity as a hierarchical set of markdown files at a well-known location on a brand's domain. BCP allows any agent in the stack — internal brand agents, vendor platforms, and third-party consumer agents — to read, reason over, and act on a brand's strategy, voice, boundaries, claims, and representation preferences. The protocol is designed to be authored once, consumed everywhere, and to evolve as the brand evolves. This document specifies file format, discovery, resolution, versioning, taxonomy alignment, and consumption patterns for v0.1.

## Change log

- **2026-05-06 — v0.3 draft.** Introduces the voice/ subtree. Defines voice/anti-ai.md as a standard granddaughter file for AI-generated language avoidance patterns, with a community_reference field pointing to a live external list and a brand_additions layer on top. Adds anti_ai to the file_type enum. All changes are additive per §8.2.

- **2026-05-06 — v0.2 draft.** Schematizes visual.md (logo, color tokens, typography, imagery principles). Adds never_compare_to and framing_traps to representation.md. Closes §17.7. All changes are additive per §8.2; no v0.1 fields removed or semantically reversed.

- **2026-04-18 — v0.1 initial draft.** Full specification across 16 sections plus appendices. Preserves hierarchical file architecture, CC BY 4.0 + MIT dual-license, IAB Content Taxonomy 3.0 + GARM Brand Safety Framework alignment, three-ring distribution model.

---

## 1. Introduction

### 1.1 The problem BCP solves

In the 12 to 36 months following the publication of this specification, a significant share of marketing work will be performed by AI agents rather than humans. Internal brand agents will draft copy, generate creative, and make media-buying decisions. Vendor platforms — brand-safety systems, creative-generation tools, ad networks, content platforms — will operate increasingly through autonomous agents that make decisions on a brand's behalf. Third-party consumer agents — conversational shopping assistants, recommendation engines, retrieval systems embedded in general-purpose chat — will describe, compare, and contextualize brands in response to consumer queries.

Each of these agents needs access to the brand's intent: what the brand is, what it values, what it claims, what it will and will not say, how it wishes to be represented, and how it should behave at the edges of judgment. Today, this information is captured (when at all) in brand decks, PDFs, Notion pages, and the memories of senior brand team members. None of these are machine-readable. None persist across agent sessions. None are portable across the dozens of systems that need them.

Without a shared source of truth, every agent must reconstruct brand intent from partial signals: scraped web content, account-representative interviews, example creative, implicit patterns in past work. The result is drift — agents produce output that is technically competent but tonally generic, boundary-blind, and inconsistent across surfaces. Brands pay for this drift in lost distinctiveness, wasted media, and reputational risk.

BCP solves this problem by defining a standard file format, location, and resolution model for machine-readable brand context. A brand authors its BCP once. Every agent that needs brand context reads the same files. When the brand evolves, the files are updated and all consuming agents see the update on their next resolution cycle.

### 1.2 What BCP is and is not

BCP **is**:

- A specification for the structure, location, and format of machine-readable brand context

- A hierarchical file tree: a root brand.md and daughter files for specific dimensions of brand identity

- A well-known URI convention published at /.well-known/brand.md on the brand's domain

- A format designed for consumption by AI agents while remaining human-readable and human-authorable

- An open standard, published under CC BY 4.0 for the specification and MIT for associated reference code

BCP **is not**:

- A software product, platform, SaaS tool, or closed system

- A replacement for human brand strategy, brand guidelines, or creative judgment

- A guarantee that any given agent will consume or act on the published files; adoption is voluntary and grows with the standard's utility

- A specification of the agent systems that consume BCP; it describes what brands publish, not how consumers implement

- A content management system; brands maintain their BCP files in a Git repository of their own choosing

### 1.3 Relationship to prior art

BCP draws architectural inspiration from several existing standards:

- **AGENTS.md**: a convention for placing agent-readable instructions in a well-known location in a software repository. BCP is the brand-identity analog — agent-readable context in a well-known location on a domain.

- **Model Context Protocol (MCP)**: a protocol for exposing tools, resources, and context to agents through a standardized interface. BCP is complementary: the file format is the data layer, MCP is one of several consumption layers.

- **robots.txt (RFC 9309)** and **sitemap.xml**: well-known conventions for publishing crawler-readable instructions at predictable paths on a domain. BCP follows the same well-known URI pattern (RFC 8615).

- **schema.org** and **JSON-LD**: vocabularies for structured data on the web. BCP differs in being markdown-primary for authorability while allowing JSON-LD compatibility through structured frontmatter.

- **OpenAPI**: a specification for describing HTTP APIs in a machine-readable format. BCP follows the pattern of a human-authorable document that generates machine-parseable output through consistent structure.

- **IAB Content Taxonomy 3.0** and **GARM Brand Safety Floor + Suitability Framework**: industry-standard taxonomies for content categorization and brand safety.

### 1.4 How to read this document

This specification uses normative language per RFC 2119. The keywords **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** are to be interpreted as described in that RFC.

---

## 2. Terminology

**BCP**: Brand Context Protocol. The specification defined in this document, and by extension a file tree conforming to it.

**Brand**: The entity whose identity, voice, boundaries, and claims are being specified.

**Producer**: A brand or its agents publishing a BCP file tree at a well-known URI.

**Consumer**: An agent, platform, tool, or human reading BCP files to obtain brand context.

**Root file**: The file located at /.well-known/brand.md on the brand's domain.

**Daughter file**: A file referenced by the root that contains a specific dimension of brand context.

**File tree**: The complete hierarchical set of BCP files for a given brand.

**Registry**: The daughter_files section in the root file declaring which daughter files exist.

**Ring**: One of three distribution layers — file-based (Ring 1), CLI-based (Ring 2), or MCP-based (Ring 3).

**Lazy resolution**: Loading only the daughter files required for a specific task.

**Extension**: A namespaced field or section containing brand-specific or vendor-specific data not defined by the core spec.

**Locale**: An IETF BCP 47 language tag.

**tree_version**: The brand's own semver version number for its published BCP tree.

**bcp_version**: The version of this specification to which a BCP tree conforms.

---

## 3. Architecture overview

### 3.1 The three-ring distribution model

BCP content is made available through three rings, in order of decreasing ubiquity and increasing dynamism.

**Ring 1 — File-based.** The baseline. BCP files served as static markdown at canonical well-known URIs on the brand's domain. Any HTTP client can fetch them. Requires no infrastructure beyond standard web hosting.

**Ring 2 — CLI-based.** A reference command-line tool and compatible third-party tools provide programmatic access for authoring, validation, inspection, and one-shot agent consumption.

**Ring 3 — MCP-based.** An MCP server exposes BCP content as tools agents can invoke within a session, supporting session-persistent context, dynamic resolution, authenticated private BCPs, and tool-native agent integration.

All three rings consume the same underlying source of truth: the BCP file tree. Producers **MAY** publish through any combination of rings; Ring 1 is **REQUIRED** for conformance.

### 3.2 Consumption patterns

**One-shot fetch.** An agent retrieves a single file via HTTP or filesystem read.

**Selective fetch.** An agent retrieves the root, parses the registry, and fetches only the daughters needed for its task. Most common pattern.

**Full-tree load.** An agent retrieves the root and all declared daughters.

**Session subscription.** An agent connects to a Ring 3 MCP server and receives BCP content as tool responses throughout a session.

**Dynamic query.** An agent invokes a Ring 3 MCP tool that returns BCP content computed or filtered based on request context.

### 3.3 The hierarchical file model

A BCP is not a single file. It is a tree whose root contains core identity and whose daughters contain specific dimensions. The hierarchy exists because concerns are separable (different consumers need different subsets), ownership is separable (legal owns claims, marketing owns voice), and evolution is separable (campaign files turn over seasonally, voice evolves annually, values rarely change).

---

## 4. File format

### 4.1 Markdown with YAML frontmatter

A BCP file **MUST** be valid UTF-8 encoded text conforming to CommonMark. Each file **MUST** begin with a YAML frontmatter block delimited by ---.

### 4.2 Fenced YAML blocks for structured fields

Fields intended for programmatic consumption **SHOULD** be placed in fenced YAML code blocks within the markdown body.

### 4.3 Prose for narrative fields

Fields intended for human reading, voice-matched paraphrasing, or nuanced agent interpretation **SHOULD** be written as markdown prose.

### 4.4 Character encoding and size

Files **MUST** be UTF-8. No BOM. LF line endings preferred. Root file **SHOULD** be under 8 KB. Daughter files **SHOULD** be under 32 KB.

### 4.5 Required frontmatter fields

Every BCP file **MUST** include:

- bcp_version: string matching ^\d+\.\d+$

- file_type: one of root, voice, visual, values, boundaries, claims, representation, audience, product, campaign, anti_ai

- last_updated: ISO 8601 date

The root file **MUST** additionally include:

- brand_name: string

- tree_version: semver string

Daughter files **MUST** additionally include:

- parent: path of the root, typically /.well-known/brand.md

### 4.6 Optional frontmatter fields

revision (content hash for ETag), default_locale, supported_locales, category, subcategories, headquarters, markets, founded, website, reviewed_by, daughter_files, tagline. Consumers **MUST** ignore unrecognized frontmatter fields.

---

## 5. Publishing a BCP

### 5.1 Canonical location

A BCP's root file **MUST** be published at https://{domain}/.well-known/brand.md. Daughter files **MUST** be published at https://{domain}/.well-known/brand/{filename}.md or subdirectory equivalents.

### 5.2 Source of truth

Producers **SHOULD** maintain BCP files in a version-controlled repository. The repository's default branch is the canonical source of truth. The content served at /.well-known/brand.md is the consumed artifact derived from that source.

### 5.3 Three valid distribution models

**Direct serving.** The producer serves from their own domain through their own infrastructure.

**Fork-the-template.** The producer forks a template repository and serves from their own infrastructure.

**Hosted.** The producer publishes through a third-party hosting provider. All three models produce the same consumable artifact at the same URL pattern.

### 5.4 HTTP headers

Servers **SHOULD** set:

- Content-Type: text/markdown; charset=utf-8

- Cache-Control: max-age=86400 (default)

- ETag: use revision field value if present

- Access-Control-Allow-Origin: *

### 5.5 Discovery

Producers **MAY** improve discoverability via sitemap.xml, HTML <link rel="alternate">, developer documentation, or registry services.

---

## 6. Hierarchical resolution

### 6.1 Root declares daughters

The root file **SHOULD** include a daughter_files registry in its frontmatter or as a dedicated YAML block.

### 6.2 Canonical fallback paths

If the root omits the registry, consumers **MAY** attempt: /.well-known/brand/voice.md, /values.md, /boundaries.md, /claims.md, /representation.md, /visual.md, /voice/anti-ai.md, /audiences/{segment}.md, /products/{sku}.md, /campaigns/{name}.md.

### 6.3 Resolution order and precedence

Highest to lowest: campaign-specific, product-specific, audience-specific, locale-specific daughter, default daughter, root file.

### 6.4 Lazy resolution by task type

Consumers **SHOULD** load only files required for the task. Copy generation: voice + voice/anti-ai + audience. Media buying: boundaries + claims. Creative generation: voice + visual. Logo selection and rendering: visual (logo and logo_usage blocks). Consumer-agent representation: representation + root. Brand-safety classification: boundaries + root.

### 6.5 Root size target

Under 3 KB of body text plus frontmatter. Content exceeding this **SHOULD** move to daughter files.

---

## 7. The file tree

### 7.1 brand.md (root)

Declares brand identity, core positioning, tagline, and daughter registry. Always loaded. Required: brand name, positioning, daughter registry, all required frontmatter.

### 7.2 voice.md

How the brand sounds — tone, register, vocabulary preferences, sentence rules, voice shifts across contexts. Recommended sections: voice attributes, register, prefer/avoid vocabulary lists, do/don't examples. Structured prefer: and avoid: lists alongside prose guidance.

voice.md is the root of the voice/ subtree. Producers **MAY** declare granddaughter files under /.well-known/brand/voice/ for specific voice dimensions. Defined granddaughter types: anti_ai (§7.2.1). Audience-specific voice files **MAY** also live at /.well-known/brand/voice/audiences/{segment}.md as an alternative to the top-level /.well-known/brand/audiences/{segment}.md path; both paths are valid in v0.3.

### 7.2.1 voice/anti-ai.md

Patterns the brand prohibits in agent-generated content because they are markers of machine-generated language. This file has two layers: a community reference (external, live) and brand-specific additions on top.

**community_reference:** A URL pointing to a live, externally maintained list of AI writing patterns. Consumers **SHOULD** fetch this URL at generation time and treat its contents as the baseline avoid list. Producers **SHOULD** point to an authoritative community-maintained source. Consumers that cannot fetch the URL **MUST** fall back to brand_additions alone and **SHOULD** log the fallback.

**brand_additions:** Patterns specific to this brand that are not covered by the community reference, or community patterns the brand wants to restate with brand-specific rationale.

Each entry in brand_additions is an object with:
- pattern: the word, phrase, or structural description to avoid (string, required)
- type: one of word, phrase, structure, opener, closer (required)
- rationale: why this pattern is off-brand for this specific brand (string, optional but recommended)
- example: an illustrative instance of the pattern (string, optional)

Consumers generating copy on behalf of this brand **MUST** apply both the community_reference list and brand_additions. Neither layer overrides the other; both are binding.

Frontmatter for voice/anti-ai.md **MUST** include file_type: anti_ai and parent: /.well-known/brand/voice.md.

### 7.3 visual.md

Defines the brand's visual identity in machine-consumable form. v0.2 schematizes four areas: logo, color, typography, and imagery principles. Producers **MAY** include any subset; consumers **MUST** ignore unrecognized fields and **MUST** tolerate the absence of any optional block.

#### 7.3.1 Logo

The logo: block is a map of named logo entries. Each entry **MUST** have a stable string key (e.g., primary, icon, app_icon, favicon, social_avatar) and **MUST** contain a variants array with at least one entry.

Each variant **MUST** declare:

- format: one of svg, png, jpg, webp, avif, pdf, eps

- url: an HTTPS URL (HTTP is not permitted) where the asset is served

- sha256: lowercase 64-character SHA-256 hash of the asset bytes

Each variant **MAY** declare width, height, background, treatment, and purpose to help consumers select the correct variant for a given context.

Logo entries **MAY** declare active_through (ISO 8601 date) and fallback (the ID of another logo entry). Consumers **MUST NOT** use a logo entry past its active_through date and **SHOULD** fall back to the entry named in fallback when present.

The logo_usage: block declares rules that apply to any logo entry. It **MAY** include:

- clear_space: a rule (prose) and a machine_value unit + multiplier) so agents can compute the required padding

- minimum_size: digital_px, print_in, or print_mm

- approved_backgrounds and forbidden_backgrounds: arrays of background-rule objects with a type solid_color, gradient, photographic, transparent, patterned) and type-specific fields

- forbidden_modifications: a binding string array. Consumers **MUST NOT** apply any listed modification

Consumers selecting a logo for a given context **MUST** verify the sha256 of any fetched variant before use. Consumers that cannot verify integrity **MUST NOT** render the asset.

#### 7.3.2 Color

The color: block declares semantic color tokens and pairing rules.

color.tokens is a map of token names to objects with hex and role. The hex value **MUST** match ^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$. The role **MUST** be one of: primary, secondary, accent, surface, surface-inverse, text, text-inverse, critical, success, warning, info, neutral.

color.approved_pairs and color.forbidden_pairs are arrays of { foreground, background } objects whose values reference token names from color.tokens. Consumers generating new layouts **SHOULD** prefer approved_pairs and **MUST NOT** generate combinations listed in forbidden_pairs.

#### 7.3.3 Typography

The typography: block declares typeface families and their roles.

typography.families is a map of family IDs to entries declaring family (CSS family name), and optionally fallback_stack, weights, styles, source, and license_note.

typography.roles maps usage roles display, body, ui, mono, code) to family IDs. Consumers generating typeset content **SHOULD** select the family whose role matches the context.

#### 7.3.4 Imagery

The imagery: block carries prose principles for photographic_style, illustration_style, iconography_style, and a forbidden_treatments string array. v0.2 keeps imagery prose-primary; further schematization is deferred.

#### 7.3.5 Extensions

Brand-specific or vendor-specific fields not covered by this section **MUST** be placed under a namespaced extensions: block per §9.2.

### 7.4 values.md

Brand values with operational specificity for agent judgment calls. Recommended: numbered values with manifestations in practice plus agent resolution priority order.

### 7.5 boundaries.md

What the brand does and does not do. Primary file for brand-safety agents and vendor platforms. Required structured blocks: hard_no, soft_no, brand_safety, optional namespaced extensions.

### 7.6 claims.md

Approved marketing claims with supporting evidence. Required structured blocks: approved_at_launch, requires_caveat, forbidden. Agents generating copy **MUST NOT** introduce claims absent from this file.

### 7.7 representation.md

How third-party consumer agents should describe the brand. Required: preferred_framing prose paragraph (~120 words), structured fields for describe_as, do_not_describe_as, competitive_frame, honest_trade_offs, never_say. Consumers **MUST** treat never_say as binding.

### 7.8 audiences/{segment}.md

Audience-specific voice shifts, preferences, constraints. Frontmatter: audience_id matching filename.

### 7.9 products/{sku}.md

Product-specific positioning and claims. v0.1 does not fully standardize; v0.2 priority.

### 7.10 campaigns/{name}.md

Campaign-scoped overrides. Recommended frontmatter: campaign_id, starts_at, ends_at. Sunset semantics deferred to v0.2.

---

## 8. Versioning

### 8.1 Three-layer model

*bcp_version**: spec conformance level, incremented by maintainers.

*tree_version**: semver on the brand's own BCP, incremented by producer.

*last_updated**: per-file ISO 8601 date.

### 8.2 Semver rules

**Major**: breaking changes (renamed files, removed fields, reversed semantics).

**Minor**: additive changes (new daughter files, new fields, new enumerated entries).

**Patch**: corrections without semantic change.

### 8.3 Revision hash

Optional SHA-256 content hash suitable for HTTP ETag.

### 8.4 Change-log conventions

Root **SHOULD** include reverse-chronological change log with date, tree_version, description.

### 8.5 Breaking vs. non-breaking

Removing a daughter, removing a required field, or reversing semantics is breaking. Adding daughters, fields, or enumerated entries is not.

### 8.6 Deprecation policy

Deprecate in a minor release; remove in a subsequent major release.

---

## 9. Content taxonomies

BCP aligns its structured adjacency and boundary signals with established industry taxonomies where they exist, to maximize interoperability with consuming systems that already map to those vocabularies.

### 9.1 Current reference alignments (v0.1)

v0.1 names two reference alignments for the boundaries.md adjacency fields:

- **IAB Content Taxonomy 3.0** for content category structure. Producers **SHOULD** use IAB 3.0 category labels in adjacency_acceptable and adjacency_unsuitable where direct mappings exist.

- **GARM Brand Safety Floor + Suitability Framework** for suitability tiers (Floor, High, Medium, Low risk). adjacency_unsuitable aligns with GARM Floor; contextual fields **SHOULD** use GARM tiers where applicable.

Where the two diverge, follow GARM for suitability tier assignment and IAB for category structure.

### 9.2 Extensions block

Brand-specific or vendor-specific fields not covered by a named taxonomy **MUST** be placed under a namespaced extensions: block. Consumer implementations **MUST** ignore extension fields they do not recognize.

### 9.3 Taxonomies for other surfaces (v0.2 and beyond)

v0.1 names reference alignments only for vendor-platform brand-safety signals. Future versions will add reference alignments for other consumption surfaces: creative-generation constraints (typography, imagery, composition), consumer-agent representation fidelity, and agentic-commerce surfaces. Producers with requirements in those domains **MAY** use the extensions: block in v0.1 and track the namespace for promotion to named alignment in v0.2+.

### 9.4 Known gaps

Emerging content types that neither IAB 3.0 nor GARM fully address, edge cases in political content, and vendor-proprietary rule sets that route around taxonomy gaps are candidate additions to future versions. Producers encountering gaps **SHOULD** document them in the extensions: block and **SHOULD** file an issue against this specification.

---

## 10. Representation

### 10.1 Preferred framing paragraph

representation.md **MUST** contain a ## Preferred framing section whose body is a prose paragraph of approximately 120 words or less. Consumer agents **SHOULD** paraphrase this paragraph rather than quote verbatim.

### 10.2 Structured fields

describe_as, do_not_describe_as, competitive_frame, honest_trade_offs, never_say, never_compare_to, framing_traps.

Consumers **MUST** treat never_say and never_compare_to as binding. never_compare_to lists entities the brand refuses to be analogized to (distinct from competitors); consumers **MUST NOT** generate analogies of the form "like X" where X appears on this list.

framing_traps is an array of objects with trap (the rejected framing), optional preferred_reframe (the brand's substitution), and optional rationale. Consumers **SHOULD NOT** produce content using a listed trap framing and **SHOULD** substitute preferred_reframe when one is provided.

### 10.3 Consumer agent integration

Consumer agents describing a brand **SHOULD** load representation.md, paraphrase preferred_framing for open queries, respect describe_asdo_not_describe_as for categorical queries, honor never_say and never_compare_to absolutely, avoid framing_traps and substitute preferred_reframe when present, surface honest_trade_offs when relevant, and draw on competitive_frame for comparisons.

### 10.4 Conflict resolution

When preferred framing contradicts observable facts, consumer agents **MUST** prioritize observable truth and **SHOULD** surface conflicts to the user.

---

## 11. Localization

### 11.1 Parallel subtrees

Localized content at /.well-known/brand/{locale}/{filename}.md, where {locale} is IETF BCP 47.

### 11.2 Inheritance

Localized files **MAY** be partial. Fields absent fall back to default-locale file.

### 11.3 Locale declaration

Root **SHOULD** declare default_locale and supported_locales.

### 11.4 BCP 47 compliance

Locale codes **MUST** conform to IETF BCP 47. Consumers **MUST NOT** accept non-compliant strings.

---

## 12. Privacy, access control, and authentication

### 12.1 Public vs. private BCPs

BCPs at /.well-known/brand.md are public by default. Producers **MUST NOT** include commercially sensitive or privileged content in public files.

### 12.2 MCP-served private BCPs (v0.2 preview)

Future versions define authenticated access patterns. v0.1 producers **MAY** serve private content via Ring 3 MCP server with auth at the MCP layer.

### 12.3 Fields never to publish publicly

No credentials, commercial terms, unannounced plans, personal information, or content whose disclosure would be a material breach.

### 12.4 Signed BCPs (v0.2 preview)

v0.2 will introduce optional cryptographic signing. v0.1 operates under a trust model where domain ownership implies authorship.

---

## 13. Consumer ergonomics

### 13.1 File-based consumption

Direct HTTP fetch. Works for any consumer that can make HTTP requests.

### 13.2 CLI-based consumption

Reference CLI provides init, validate, show, diff, query commands. Agents **MAY** invoke as subprocess.

### 13.3 MCP-based consumption

Recommended tool names: get_brand_root(), get_voice(), get_boundaries(context?), check_claim(proposed_claim), validate_adjacency(content_sample), query(natural_language_question).

### 13.4 Ring selection

Ring 1 for one-off queries and stateless consumers. Ring 2 for developer authoring. Ring 3 for long sessions, private BCPs, dynamic resolution.

---

## 14. Producer ergonomics

### 14.1 Manual authoring

Producers **MAY** author manually in any text editor using this specification as reference.

### 14.2 Encoder-assisted authoring (v0.2 preview)

Future tooling will provide guided authoring with signal extraction and drift detection. Not required for conformance.

### 14.3 Living BCP monitoring

Commercial monitoring tools **MAY** subscribe to producer repositories and detect drift. Not required for conformance.

### 14.4 CI/CD integration

Producers **MAY** validate their BCP in CI via a reference CLI.

---

## 15. Security considerations

### 15.1 Trust model

BCP content is claims authored by or on behalf of a brand, not verified truth. Consumer agents **MUST NOT** treat BCP content as authoritative evidence for factual claims about the world.

### 15.2 Conflict with observable facts

Consumer agents **MUST** prioritize observable truth over preferred framing.

### 15.3 Denial of service and caching

Producers **SHOULD** set cache headers. Consumers **SHOULD** respect them.

### 15.4 Spoofing and domain verification

Consumers **SHOULD** confirm the domain serving the BCP matches the brand expected.

### 15.5 Prompt injection in prose fields

Consumer implementations **SHOULD** treat BCP prose as data, sandbox it, and reject content attempting to override agent-level safety policies. Producers **MUST NOT** author content designed to manipulate consumer-agent behavior outside documented semantics.

---

## 16. Conformance

### 16.1 Producer conformance

A BCP is producer-conformant if the root is accessible at the canonical URI, parses as valid markdown with valid YAML frontmatter, all required frontmatter fields are present on root and daughters, the root is served with correct Content-Type, declared daughters are accessible at their declared paths, and bcp_version matches this specification.

### 16.2 Consumer conformance

A consumer is conformant if it resolves the root at the canonical URI, respects the registry before canonical fallbacks, honors resolution precedence, treats never_say as binding, does not introduce claims absent from claims.md, and respects brand-safety signals.

### 16.3 Conformance levels

Future versions will define graduated levels. v0.1 defines a single level.

### 16.4 Reference implementation

The reference at github.com/Brand-Context-Protocol/spec/examples/acme-corp/.well-known/ is producer-conformant by definition.

---

## 17. Open questions and future work

### 17.1 Signed BCPs (v0.2)

Cryptographic signing for authenticity verification.

### 17.2 Private and authenticated BCPs (v0.2)

Authentication patterns for MCP-served private BCPs.

### 17.3 Standardized products and campaigns (v0.2)

Full schematization of product and campaign file types, sunset semantics.

### 17.4 Sunset and temporal semantics

Normative handling of expired campaigns and time-bounded content.

### 17.5 Measurement layer standardization

Companion specification for brand fidelity measurement across surfaces.

### 17.6 Governance transition

Transition from maintainer-led to published governance model before v1.0.

### 17.7 Visual.md schematization (resolved in v0.2)

Resolved in v0.2 §7.3 with structured fields for logo, color tokens, typography, and imagery principles. Further schematization of imagery (composition rules, subject framing) and motion remains open.

### 17.9 Canonical community reference for voice/anti-ai.md

§7.2.1 defines a community_reference field pointing to a live external list of AI writing patterns but does not name a canonical source. The Brand-Context-Protocol org **SHOULD** publish and maintain a reference list at a stable URL that producers can point to by default. Until that list exists, producers **SHOULD** reference the most current authoritative community-maintained source available and document their choice in a rationale field on the community_reference entry.

### 17.8 Multi-brand organizations

Handling parent companies with brand portfolios, candidate /brand/{brand-name}/ subtree pattern.

---

## 18. Appendices

### Appendix A. JSON Schema

Formal JSON Schemas at schema/v0.1/ and schema/v0.2/. v0.1 covers root frontmatter. v0.2 adds schemas for visual.md and the extended representation.md fields.

### Appendix B. Reference implementation

Conformant BCP published at github.com/Brand-Context-Protocol/spec/examples/acme-corp/.well-known/.

### Appendix C. Comparison to adjacent standards

| Standard | Relationship to BCP |
|---|---|
| AGENTS.md | Structural analog; brand-identity equivalent |
| MCP | Ring 3 is implemented via MCP |
| robots.txt | Pattern inspiration for well-known URI |
| sitemap.xml | Pattern inspiration for machine-readable publication |
| schema.org | Complementary; structured blocks can reference |
| JSON-LD | Complementary; structured blocks parseable as JSON-LD-adjacent |
| OpenAPI | Pattern inspiration for human-authorable, machine-parseable |
| IAB Content Taxonomy 3.0 | Referenced in Section 9 as one of v0.1's current reference alignments |
| GARM Brand Safety Framework | Referenced in Section 9 as one of v0.1's current reference alignments |

### Appendix D. Glossary

See Section 2.

### Appendix E. References

- RFC 8615: Well-Known Uniform Resource Identifiers

- RFC 2119: Key words for use in RFCs to Indicate Requirement Levels

- BCP 47: Tags for Identifying Languages

- RFC 9309: Robots Exclusion Protocol

- IAB Tech Lab Content Taxonomy 3.0

- GARM Brand Safety Floor and Suitability Framework

- CommonMark Specification

- YAML 1.2 Specification

- Model Context Protocol

- AGENTS.md Convention

---

*End of specification. Questions, issues, and pull requests: https://github.com/Brand-Context-Protocol/spec*