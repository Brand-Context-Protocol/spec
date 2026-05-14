---
bcp_version: "0.2"
file_type: voice
last_updated: 2026-05-13
parent: /.well-known/brand.md
---

# voice.md: Brand Context Protocol v0.2

voice.md declares how a brand sounds. Agents generating copy or evaluating content for brand alignment load this file. All blocks are optional. A file containing only required frontmatter is a valid v0.2 voice.md.

v0.2 adds eight new optional blocks. No v0.1 fields have been removed or semantically changed. A v0.1 voice.md with no new fields added is a valid v0.2 document.

---

## Frontmatter

Required frontmatter fields for voice.md:

```yaml
bcp_version: "0.2"       # must be "0.2" for files conforming to this schema
file_type: voice          # must be "voice"
last_updated: YYYY-MM-DD  # ISO 8601 date of last meaningful change
parent: /.well-known/brand.md
```

---

## Essence

The essence block captures one-liner positioning statements. Each key is optional. Values must be single sentences. Agents generating top-of-funnel copy should prefer `tagline` and `brand_promise`. Agents generating internal documents should prefer `mission` and `vision`.

```yaml
essence:
  mission: "Standardize machine-readable brand context across the open web."
  vision: "A future where every agent reads brand intent from a shared, portable source."
  purpose: "Give brands a durable machine-readable layer that survives the AI transition."
  tagline: "Author once. Every agent reads the same source."
  brand_promise: "A portable schema any agent can consume from any conforming domain."
```

---

## Personality

The personality section is a prose paragraph of one to three sentences. It describes the brand voice at a high level. Agents should read this section before generating copy and use it to calibrate tone.

Write personality as markdown prose below the `## Personality` heading. Do not use a fenced YAML block.

Example:

> Authoritative in the way a technical specification is authoritative: precise, complete, and without salesmanship. Every claim in BCP copy is supported by the spec text. The tone is that of a standard, not a product.

---

## Voice Traits

The traits block defines voice by contrast. `is` states what the voice is. `not` states what the voice refuses to be. Agents generating copy should apply `is` traits as style targets. Agents evaluating copy should check for `not` traits as disqualifiers.

Each entry must have `is`. The `not` key is optional but recommended. `description` is optional and provides authoring guidance.

```yaml
traits:
  - is: "Precise"
    not: "Pedantic"
    description: "Technical accuracy is required. Over-specification for its own sake is a failure mode."
  - is: "Normative"
    not: "Prescriptive beyond the standard"
    description: "The spec sets requirements. It does not instruct implementors how to build their systems."
  - is: "Open"
    not: "Promotional"
    description: "BCP benefits from adoption, not from sounding like it benefits from adoption."
  - is: "Technical"
    not: "Jargony"
    description: "Precise language for readers who can handle it. Every term in §2 is defined there."
  - is: "Restrained"
    not: "Emphatic"
    description: "Normative weight comes from MUST and SHOULD, not from italics."
```

---

## Vocabulary

The vocabulary block has three sub-sections:

- `prefer`: terms and usage notes for programmatic lint and copy generation (v0.1 compatible).
- `avoid`: terms with rationale for why they are off-brand (v0.1 compatible).
- `substitutions`: a three-column table mapping preferred terms to terms to avoid, with optional example sentences (new in v0.2).

Consumers generating copy must use terms in `prefer[].word` and `substitutions[].prefer`. Consumers must not use terms in `avoid[].word` or `substitutions[].avoid`. Voice linters should flag violations.

```yaml
vocabulary:
  prefer:
    - word: "producer"
      use: "The brand or team publishing a BCP file tree. Use consistently with §2."
    - word: "consumer"
      use: "The agent or system reading BCP files. Use consistently with §2."
    - word: "conforming"
      use: "When a file meets spec requirements. Prefer over 'valid' for behavioral claims."
    - word: "daughter file"
      use: "Any BCP file other than the root. Use the two-word form."

  avoid:
    - word: "revolutionary"
      why: "Overclaim. State the specific improvement instead."
    - word: "seamless"
      why: "Overused. Describe the specific behavior instead."
    - word: "AI takeover"
      why: "Doom framing. Forbidden in all BCP-adjacent copy."
    - word: "magic"
      why: "Implies hidden non-determinism that BCP explicitly opposes."
    - word: "future-proof"
      why: "Implausible promise about LLM non-determinism."

  substitutions:
    - prefer: "daughter file"
      avoid: "child file"
      example: "An agent fetching voice context loads the voice.md daughter file."
    - prefer: "conforming"
      avoid: "valid"
      example: "A conforming v0.2 voice.md must include required frontmatter fields."
    - prefer: "producer"
      avoid: "publisher"
      example: "Producers should maintain BCP files in a version-controlled repository."
    - prefer: "resolution"
      avoid: "lookup"
      example: "Lazy resolution loads only the daughters required for the current task."
```

---

## Forbidden Topics

The forbidden_topics block lists subjects the brand does not associate with. Severity must be one of `never` or `avoid`.

- `never`: agents must not associate the brand with this topic in any context.
- `avoid`: agents should not associate the brand with this topic absent explicit instruction.

```yaml
forbidden_topics:
  - topic: "Vendor lock-in narratives"
    severity: "never"
  - topic: "AI sentience or consciousness claims"
    severity: "never"
  - topic: "Promises about LLM output determinism or reliability"
    severity: "never"
  - topic: "Naming specific competitors in marketing copy"
    severity: "avoid"
```

---

## Naming

The naming block declares the canonical form of the brand name and what variants are forbidden. Consumers must use `canonical` when generating text that names the brand. Consumers must not use any variant listed in `forbidden_variants`.

```yaml
naming:
  canonical: "Brand Context Protocol"
  abbreviation: "BCP"
  capitalization: "Title case for the full name. All-caps for the abbreviation."
  forbidden_variants:
    - "brand context protocol"
    - "Brand context protocol"
    - "BrandContextProtocol"
    - "bcp"
  sub_brands:
    - name: "BCP"
      notes: "Acceptable abbreviation after the first full-name use in a document."
  acronym_rules: "Expand to 'Brand Context Protocol' on first use. BCP is acceptable thereafter."
```

---

## Messaging Tiers

The messaging_tiers block provides the same message at multiple lengths. Agents should select the tier appropriate to the surface. Each entry must have `topic` and at least one of `blunt`, `short`, or `long`.

Agents generating copy for character-constrained surfaces should prefer `blunt`. Agents generating long-form content should prefer `long`.

```yaml
messaging_tiers:
  - topic: "brand"
    blunt: "Author once. Every agent reads the same source."
    short: "BCP gives every AI agent in your stack a shared source of brand truth."
    long: "The Brand Context Protocol publishes brand voice, rules, and identity as machine-readable files at a well-known location on a domain. Any agent that needs brand context reads the same source. When the brand evolves, the files update and every consuming agent sees the change on its next resolution cycle."
  - topic: "adoption"
    blunt: "Ring 1 is static files. No new infrastructure required."
    short: "Publishing a BCP requires no new infrastructure. Serve markdown files at a well-known path."
    long: "BCP uses the same well-known URI pattern as robots.txt. A producer publishes BCP files at /.well-known/brand.md on their domain. Any HTTP client can fetch them. No server-side rendering, no API keys, and no SDKs are required for Ring 1 conformance."
  - topic: "versioning"
    blunt: "v0.1 files are valid v0.2 documents."
    short: "All BCP version changes are additive. No existing field has been removed or reversed."
```

---

## Topic Templates

The topic_templates block provides authoring guidance for recurring subjects. Each entry must have `topic`. `guidance`, `example_good`, and `example_bad` are optional.

```yaml
topic_templates:
  - topic: "normative requirements"
    guidance: "State requirements with RFC 2119 keywords. Do not imply requirements with hedged prose."
    example_good: "Consumers MUST ignore unrecognized frontmatter fields."
    example_bad: "Consumers should generally try to ignore fields they don't recognize."
  - topic: "version history"
    guidance: "Lead with the version and date. State what changed in one sentence. Use active voice."
    example_good: "v0.2 adds eight new optional fields to voice.md."
    example_bad: "Some additional fields have been added in the latest version."
  - topic: "adoption rationale"
    guidance: "State the specific improvement. Do not claim transformation."
    example_good: "A conforming BCP means agents fetching voice context do not need to parse PDFs."
    example_bad: "BCP revolutionizes how companies manage their AI stack."
```

---

## Audience Modulation

The audience_modulation block specifies how voice shifts per audience. Each entry must have `audience` and at least one of `tone_shift`, `trait_overrides`, or `vocabulary_additions`.

Audience values should be drawn from: `prospect`, `customer`, `lapsed_customer`, `developer`, `employee`, `investor`, `regulator`, `press`. Custom values are permitted.

This block is a lightweight alternative to full audience-specific voice files at `audiences/{segment}.md` (§7.8). Both approaches are valid; they can coexist.

```yaml
audience_modulation:
  - audience: "developer"
    tone_shift: "Maximum technical precision. Skip benefit framing. Assume the reader knows what BCP is."
    vocabulary_additions:
      prefer:
        - word: "ETag"
          use: "HTTP caching header. Pair with the revision frontmatter field."
        - word: "frontmatter"
          use: "The YAML block between --- delimiters at the top of a BCP file."
  - audience: "press"
    tone_shift: "Use plain language. Define BCP on first reference. Avoid acronym-first sentences."
    trait_overrides:
      - is: "Accessible"
        not: "Jargony"
  - audience: "investor"
    tone_shift: "Emphasize durability, adoption economics, and infrastructure positioning."
```

---

## Rules

Sentence-level writing rules. Each rule is a single imperative sentence. Rules apply to all copy generated on behalf of this brand.

```yaml
rules:
  - "Cap sentences at 22 words. Rewrite if longer."
  - "No em dashes. Use commas, colons, or restructure."
  - "Periods end headlines."
  - "No exclamation points outside support replies."
  - "Open with the noun, not the qualifier."
  - "One idea per sentence. If you used 'and' twice, split."
  - "Cite the spec section when making a normative claim."
```

---

## Channels

The channels block provides do/don't examples per surface. Each channel entry should have `surfaces` and at least one of `good` or `bad` as illustrative example copy.

```yaml
channels:
  documentation:
    surfaces: ["spec", "README", "docs site"]
    shows_up_in: "Engineer evaluation, spec review, integration work."
    bad: "BCP makes brand stuff easy for your AI tools. Just drop in your colors and you're done!"
    good: "BCP daughter files are independently retrievable. An agent fetching voice context does not parse visual.md."

  community:
    surfaces: ["GitHub issues", "discussions", "pull requests"]
    shows_up_in: "Contributor review, issue triage, spec feedback."
    bad: "Great idea! We would love to add that."
    good: "This would be a minor addition under §8.2. File an issue with the proposed field name and at least one implementation example."

  press:
    surfaces: ["announcements", "blog posts", "press statements"]
    shows_up_in: "Coverage by tech journalists, developer newsletters."
    bad: "BCP is the future of brand AI, revolutionizing how companies manage their stack."
    good: "The Brand Context Protocol is an open specification for machine-readable brand context, published under CC BY 4.0."
```

---

## Extensions

Brand-specific fields not covered by this schema must be placed under a namespaced extensions block per §9.2 of the BCP specification. Consumers must ignore extension fields they do not recognize.

```yaml
extensions:
  x-example:
    internal_codename: "Project Anchor"
```

---

## Conformance

A conforming v0.2 voice.md must:

1. Include valid frontmatter: `bcp_version: "0.2"`, `file_type: voice`, `last_updated`.
2. Use fenced YAML blocks for all structured data fields.
3. Omit no required keys within any block it declares. A block that is present must be internally valid.
4. Include at least one of: a personality prose section, a traits block, or a vocabulary block.

A conforming v0.2 voice.md may omit any named block. Absence of a block is not a conformance failure.

Consumers must tolerate any combination of present and absent blocks. Consumers must ignore unrecognized top-level keys and extension fields.

---

## Migration from v0.1

v0.1 voice.md files are valid v0.2 documents. No field defined in v0.1 has been removed or semantically changed.

The following changes are additive only:

- `essence` block: one-liner mission, vision, purpose, tagline, brand_promise.
- `traits` block: bipartite is/not voice trait list. Replaces informal `attributes` block. The v0.1 `attributes` block remains valid and is not deprecated.
- `vocabulary.substitutions` sub-key: three-column SAY/NOT/EXAMPLE table. The v0.1 `prefer` and `avoid` sub-keys are unchanged.
- `forbidden_topics` block: topics the brand does not associate with, with severity.
- `naming` block: canonical brand name, capitalization rules, forbidden variants.
- `messaging_tiers` block: same message at blunt, short, and long lengths.
- `topic_templates` block: "how we talk about X" guidance per topic.
- `audience_modulation` block: lightweight per-audience voice overrides. Does not replace `audiences/{segment}.md`.

Producers upgrading from v0.1 should update `bcp_version` to `"0.2"` when adding any new field. Producers that add no new fields may keep `bcp_version` at `"0.1"`. Those files remain valid v0.1 documents.
