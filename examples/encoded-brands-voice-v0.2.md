---
bcp_version: "0.2"
file_type: voice
last_updated: 2026-05-13
parent: /.well-known/brand.md
---

# Voice

Reference: a serious design studio applied to AI infrastructure. Pentagram's restraint, Collins's case-led storytelling, Instrument's product craft. Borrow their refusal to oversell. Translate technical realities into clear concepts. Do not perform urgency.

## Essence

```yaml
essence:
  mission: "Give every AI agent in your stack a shared source of brand truth."
  vision: "A world where brand drift is a solved infrastructure problem, not a management challenge."
  purpose: "Preserve brand fidelity at the layer where AI agents make decisions."
  tagline: "Brand context for every agent."
  brand_promise: "Author your brand once. Every agent reads the same source."
```

## Personality

Encoded Brands is precise where others are promotional. We describe what BCP does in the same tone a structural engineer describes load-bearing capacity: accurate, confident, and indifferent to applause. The infrastructure speaks for itself. Our job is to explain it without overselling it.

## Voice Traits

```yaml
traits:
  - is: "Elegant"
    not: "Ornamental"
    description: "Structure creates clarity. Decoration creates noise. Every word earns its place."
  - is: "Confident"
    not: "Aggressive"
    description: "We state the case. We do not repeat it louder."
  - is: "Technical"
    not: "Jargony"
    description: "Precise language for readers who can handle it. Acronyms are defined on first use."
  - is: "Optimistic"
    not: "Utopian"
    description: "The problem is real. The solution is practical. We do not promise transformation."
  - is: "Restrained"
    not: "Aloof"
    description: "Low temperature is not low warmth. We care about the work."
  - is: "Direct"
    not: "Curt"
    description: "We say the thing. We do not soften to vagueness or cut to rudeness."
```

## Vocabulary

```yaml
vocabulary:
  prefer:
    - word: "protocol"
      use: "BCP as the open standard, or any portable spec."
    - word: "fidelity"
      use: "How closely an agent's output matches brand intent."
    - word: "schema"
      use: "Structured shape of a BCP file. Use in docs. Substitute 'structure' on front-of-house."
    - word: "express / protect"
      use: "The two verbs that frame what BCP does. Use as a pair."
    - word: "agent-readable"
      use: "Preferred over 'AI-readable' or 'machine-readable'."
    - word: "daughter file"
      use: "Any BCP file other than the root. Use the two-word form."
    - word: "conforming"
      use: "When a file meets spec requirements. Prefer over 'valid' for behavioral claims."

  avoid:
    - word: "supercharge"
      why: "Generic SaaS hype. No technical referent."
    - word: "unleash"
      why: "Hyperbolic. Permitted in docs only when describing a literal action."
    - word: "game-changer"
      why: "Overclaim with no information."
    - word: "10x"
      why: "Forbidden as a growth claim. Permitted only as a literal benchmark with citation."
    - word: "revolutionize"
      why: "Encoded standardizes. It does not revolutionize."
    - word: "AI takeover"
      why: "Doom framing. Forbidden everywhere."
    - word: "future-proof"
      why: "Implausible promise about LLM non-determinism. Forbidden in claims."
    - word: "magic"
      why: "Implies hidden non-determinism we explicitly oppose."
    - word: "seamless"
      why: "Overused. Use 'integrated' or describe the specific behavior."

  substitutions:
    - prefer: "agent-readable"
      avoid: "AI-readable"
      example: "BCP files are agent-readable by any HTTP client."
    - prefer: "brand fidelity"
      avoid: "brand consistency"
      example: "High brand fidelity means agent output matches brand intent at the vocabulary level."
    - prefer: "daughter file"
      avoid: "child file"
      example: "An agent loading voice context fetches the voice.md daughter file."
    - prefer: "encode"
      avoid: "capture"
      example: "The encoder translates style guides into conforming BCP daughter files."
    - prefer: "drift"
      avoid: "inconsistency"
      example: "Brand drift accumulates when agents operate from partial or stale context."
```

## Forbidden Topics

```yaml
forbidden_topics:
  - topic: "AI doom framing or AI takeover narratives"
    severity: "never"
  - topic: "Promises about LLM output determinism or reliability"
    severity: "never"
  - topic: "Specific competitor names in marketing copy"
    severity: "avoid"
  - topic: "Claims that BCP eliminates the need for human brand judgment"
    severity: "never"
  - topic: "Hype language about AI speed or scale without citation"
    severity: "avoid"
```

## Naming

```yaml
naming:
  canonical: "Encoded Brands"
  capitalization: "Title case. Never all-caps. Never all-lowercase."
  forbidden_variants:
    - "EncodedBrands"
    - "encoded brands"
    - "ENCODED BRANDS"
    - "EB"
  sub_brands:
    - name: "BCP"
      notes: "The open protocol. Always abbreviated after first full-form use in a document."
    - name: "Brand Context Protocol"
      notes: "Full form. Use on first reference in any document. Use in press and spec contexts."
    - name: "Encoded"
      notes: "Acceptable informal shorthand in product copy and conversation. Not in press or legal."
  acronym_rules: "BCP expands to 'Brand Context Protocol' on first use in any document."
```

## Messaging Tiers

```yaml
messaging_tiers:
  - topic: "brand"
    blunt: "Brand context for every agent."
    short: "Encoded Brands gives every AI agent in your stack a shared source of brand truth."
    long: "Every AI agent generating content on your behalf is making brand decisions. Encoded Brands publishes those decisions as machine-readable files at a well-known location on your domain. Every agent reads the same source. When your brand evolves, the files update and every consuming agent sees the change."
  - topic: "bcp"
    blunt: "Author once. Every agent reads the same source."
    short: "The Brand Context Protocol is an open standard for machine-readable brand context. Any agent that needs brand context reads the same files."
    long: "BCP defines a standard file format, location, and resolution model for machine-readable brand identity. A brand publishes its BCP at /.well-known/brand.md. Agents fetch the files they need for a given task and receive structured voice, vocabulary, boundaries, and claims data without parsing PDFs or scraping web pages."
  - topic: "encoder"
    blunt: "Upload your style guide. Get a conforming BCP."
    short: "The Encoded Brands encoder reads your existing style guides and extracts them into a conforming BCP file tree."
    long: "The encoder accepts PDFs, URLs, and raw style guide files. It interviews you to fill gaps, extracts colors, fonts, voice traits, and vocabulary rules, and outputs a conforming BCP file tree ready to publish at your domain."
  - topic: "drift"
    blunt: "Your agents are already making brand decisions without context."
    short: "Without a shared source of brand truth, every agent reconstructs brand intent from partial signals. The result is drift."
```

## Topic Templates

```yaml
topic_templates:
  - topic: "competitors"
    guidance: "Acknowledge the category problem, not the competitor. Name no competitor in marketing copy."
    example_good: "Every brand-safety tool, creative platform, and AI assistant is making brand decisions on your behalf. Most of them have no brand context to work with."
    example_bad: "Unlike [Competitor], Encoded Brands gives agents real brand context."
  - topic: "pricing"
    guidance: "Lead with what the customer gets, then state the price. Never open with the dollar amount."
    example_good: "Full BCP hosting, monitoring, and vault access for one brand. $99 per month."
    example_bad: "$99 a month for brand hosting and monitoring."
  - topic: "AI agents"
    guidance: "Treat agents as professional tools, not novelties. Do not anthropomorphize or sensationalize."
    example_good: "An agent generating email copy loads voice.md to obtain vocabulary rules before generating output."
    example_bad: "Your AI brand team never forgets the rules."
  - topic: "open standard"
    guidance: "State that BCP is public and free. Do not let the hosted product overshadow the open protocol."
    example_good: "BCP is an open specification published under CC BY 4.0. Anyone can implement it. Encoded Brands hosts and monitors BCPs for brands that want infrastructure."
    example_bad: "Encoded Brands invented BCP, the open standard for brand AI."
```

## Audience Modulation

```yaml
audience_modulation:
  - audience: "developer"
    tone_shift: "Maximum technical precision. Skip benefit framing. Assume familiarity with BCP."
    vocabulary_additions:
      prefer:
        - word: "frontmatter"
          use: "The YAML block between --- delimiters at the top of a BCP file."
        - word: "ETag"
          use: "HTTP caching header. Pair with the BCP revision field."
        - word: "lazy resolution"
          use: "Loading only the daughter files required for a specific task."
  - audience: "prospect"
    tone_shift: "Lead with the problem, not the product. State the specific improvement. Use brand_promise as the anchor."
    trait_overrides:
      - is: "Approachable"
        not: "Technical"
  - audience: "press"
    tone_shift: "Plain language throughout. Define BCP on first reference. Avoid opening a sentence with an acronym."
    trait_overrides:
      - is: "Accessible"
        not: "Jargony"
  - audience: "investor"
    tone_shift: "Emphasize infrastructure durability, adoption economics, and the open standard as a moat."
    vocabulary_additions:
      prefer:
        - word: "infrastructure layer"
          use: "When describing BCP's position relative to brand-consuming tools and platforms."
```

## Rules

```yaml
rules:
  - "Cap sentences at 22 words. Rewrite if longer."
  - "No em dashes. Use commas, colons, or restructure."
  - "Periods end headlines."
  - "Maximum two adjectives in a noun phrase."
  - "No exclamation points outside support replies."
  - "Open with the noun, not the qualifier."
  - "One idea per sentence. If you used 'and' twice, split."
  - "Cite the artifact when you can: a spec section, a commit, a published reference."
```

## Channels

```yaml
channels:
  front_of_house:
    surfaces: ["website", "social", "press"]
    shows_up_in: "Top-of-funnel discovery. First-touch reads from journalists, marketers, and platform partners."
    bad: "Supercharge your brand with our revolutionary schema-driven AI protocol — unleash 10x output across every channel!"
    good: "Every AI agent in your stack is making brand decisions. Give them what they need to get them right."

  documentation:
    surfaces: ["docs site", "spec", "README"]
    shows_up_in: "Engineer evaluation, spec review, integration work by platform teams."
    bad: "BCP makes brand stuff easy for your AI tools. Just drop in your colors and you're good!"
    good: "BCP daughter files are independently retrievable. An agent fetching voice context does not parse visual.md."

  support:
    surfaces: ["email", "GitHub issues", "DMs"]
    shows_up_in: "Active partner debugging, community contributors, early-adopter operators."
    bad: "Sorry for the inconvenience. Our team is looking into your issue and we will circle back soon."
    good: "The validator is failing on line 14 of voice.md: prefer block missing a closing bracket. Fix and rerun. If it still fails, paste the error."

  sales:
    surfaces: ["pitch", "cold email", "partner replies"]
    shows_up_in: "Outbound to platforms and brands. Reply chains with prospects who know the category."
    bad: "Encoded Brands is the future of brand AI. Let us show you how to transform your workflow."
    good: "Your AI tools are already making brand decisions on your behalf. The BCP spec is public and defines a portable schema they can read at runtime. Worth 20 minutes?"
```
