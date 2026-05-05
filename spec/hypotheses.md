# v0.1 Working Hypotheses

Working positions on six open spec-design questions. These are defaults for v0.1 and will be revised based on feedback from vendor platforms, brands, and the protocol community before v1.0 locks.

## Q1. File format

**Hypothesis:** Markdown primary. YAML frontmatter for metadata. Fenced YAML blocks for structured fields. Prose markdown for narrative. Companion JSON Schema validates structured fields.

**Why:** Markdown is the lingua franca for agent-readable text (AGENTS.md, MCP). Keeps author layer human-editable. YAML in frontmatter and fenced blocks gives machines structured access without sacrificing human read.

**Alternative considered:** Pure JSON-LD extending Schema.org. Rejected because it drops author friction to near-zero for consuming systems but raises it to near-infinite for the people writing brand documentation.

## Q2. File discovery

**Hypothesis:** Explicit registry in root `brand.md` (primary). Canonical default paths as fallback.

**Why:** Mirrors how `sitemap.xml` and DNS both work. Registry is explicit, fallback is forgiving.

## Q3. Versioning

**Hypothesis:** Three layers — `bcp_version` (spec compliance) + `tree_version` (semver on brand's own BCP) + per-file `last_updated` + `revision` hash.

**Why:** Gives cacheability to consuming platforms, diffability to monitoring systems, readability to humans. Separates spec-version semantics from brand-content-version semantics.

## Q4. Brand-safety taxonomy

**Hypothesis:** Align to IAB Content Taxonomy 3.0 + GARM Brand Safety Floor and Suitability Framework. Brand-specific extensions namespaced.

**Why:** Highest-leverage decision in v0.1 for platform integration. Vendor platforms (Zefr, DoubleVerify, IAS, DSPs) already map internal signals to these taxonomies. BCP mapping to the same vocabularies makes integration field-level work, not translation work.

**Open:** where existing taxonomies have gaps brand-safety systems actually work around.

## Q5. Representation file structure

**Hypothesis:** Hybrid. Structured fields (`describe_as`, `do_not_describe_as`, `competitive_frame`, `honest_trade_offs`, `never_say`) plus one prose `preferred_framing` paragraph (~120 words) for agents to paraphrase in open-ended consumer queries.

**Why:** Structured fields give agents deterministic hooks for categorical queries. Prose gives agents voice-matched language for anything more open-ended.

## Q6. Localization

**Hypothesis:** Parallel subtrees per locale with inheritance fallback.

**Why:** Editorial teams manage localized content in separate workflows. Parallel structure mirrors organizational reality. Inheritance prevents duplicate-update drift for fields that don't need localization.
