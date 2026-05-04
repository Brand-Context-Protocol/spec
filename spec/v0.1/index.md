# The docs.

Everything a developer, platform engineer, or curious CMO needs to understand Brand Context Protocol. File-by-file reference. Hosting options. Consumer integration examples. All the detail left out of /start.

> **Honest about status:** BCP is v0.1.The spec will evolve. Breaking changes will bump thebcp_versionfield. We maintain backward compatibility for at least one minor version. Anyone adopting v0.1 today will have a clear upgrade path.

## What BCP is. What it isn't.

BCP is a file format. Seven markdown files at a well-known path on your domain ,  /.well-known/brand.md as the root, plus daughter files under /.well-known/brand/. That's it. The files are the product.

BCP is not an MCP server. Not a SaaS. Not a runtime. Not a proprietary format. Not a platform you sign up for. You adopt BCP by writing the files and publishing them. No SDK, no library, no integration.

Why markdown at a well-known path? Because every AI already knows how to read markdown, and every agent already knows how to fetch. A convention, not a technology. Same pattern AGENTS.md uses for coding agents, robots.txt uses for crawlers, and security.txt uses for vulnerability disclosure.


Start authoring →


## TL;DR

- A BCP is a folder of markdown files at yourdomain.com/.well-known/.
- Root is brand.md, always loaded first. Daughter files sit in brand/.
- Structure mirrors AGENTS.md and MCP ,  hierarchical markdown with YAML frontmatter at a well-known path (per RFC 8615).
- Any static host works. GitHub Pages, Cloudflare Pages, Vercel, Netlify, S3, your existing CDN.
- Serve as text/plain; charset=utf-8 with CORS * so cross-origin agents can fetch.
- Spec is CC BY 4.0. Reference code is MIT. Fork, implement, extend, compete.

## File structure

BCP v0.1 defines seven files. All are markdown with YAML frontmatter. All are optional except brand.md at the root ,  but a BCP with just a root is a weak BCP. Most brands should publish at least voice, values, boundaries, claims, and representation.

```yourdomain.com/.well-known/
├── brand.md                   # root · always loaded first · under 3KB
└── brand/
    ├── voice.md               # tone, register, prefer/avoid word lists
    ├── values.md              # priority-ordered, each with observable behavior
    ├── boundaries.md          # hard/soft no's · IAB 3.0 + GARM aligned
    ├── claims.md              # approved claims + evidence · legally reviewed
    ├── representation.md      # how consumer agents should describe you
    └── README.md              # human overview of the tree```

Daughter files are fetched lazily. A media-buying agent loads boundaries.md and claims.md; a copy agent loads voice.md; a consumer agent describing your brand loads representation.md. Agents don't need the whole tree for most tasks.

## Root ,  brand.md

The root is always-loaded. Keep it under 3KB. It declares identity, registers daughter files, and lets agents decide what else to fetch.

```---
bcp_version: 0.1
brand_name: Stripe
file_type: root
domain: stripe.com
category: Financial infrastructure
tagline: "Payments infrastructure for the internet."
default_locale: en-US
last_updated: 2026-04-20
daughter_files:
  voice:          /.well-known/brand/voice.md
  values:         /.well-known/brand/values.md
  boundaries:     /.well-known/brand/boundaries.md
  claims:         /.well-known/brand/claims.md
  representation: /.well-known/brand/representation.md
---

# Stripe
Payments infrastructure for the internet.

## What we do
[One paragraph. Concrete, not corporate.]

## Primary audience
[Describe the person. Seniority, job function, what they care about.]

## Position vs competitors
[One sentence per top competitor on what makes you different.]```

### Required frontmatter fields

These four are required by spec/brand-context.schema.json. A strict validator will reject a root file missing any of them.

| Field | Type | Notes |
| --- | --- | --- |
| bcp_version | string | "0.1" currently. Agents use this to handle version-specific behavior. |
| brand_name | string | The name humans call your brand. Not your legal entity. |
| file_type | string | root for the root file. Daughter files use their kind, e.g. voice, values. Lets consumers identify a file without URL context. |
| last_updated | date | ISO 8601 (YYYY-MM-DD). Agents use this to decide when to refetch. |

### Optional fields

Defined in the schema but not required. Strongly recommended in practice.

| Field | Type | Notes |
| --- | --- | --- |
| tree_version | string | Semantic version of this brand's own BCP tree, e.g. "0.1.0". Bump on meaningful updates. |
| revision | string | Git commit hash or custom revision identifier. Useful for caching. |
| default_locale | string | Default locale of this BCP (e.g. en-US). Multi-locale brands can publish locale-specific daughter files. |
| supported_locales | list | Locales the brand publishes content in, e.g. [en-US, fr-CA]. |
| daughter_files | map | Registry of available daughter files. Agents resolve paths relative to the domain. Optional in the schema, but a root without daughters is rarely useful. |

### Common extensions

The schema allows additional properties. These aren't defined in the spec but are common in practice. Pick what fits your brand.

| Field | Type | Notes |
| --- | --- | --- |
| domain | string | Canonical domain. Used for disambiguation when brand names collide. |
| category | string | What you do in plain English. IAB Content Taxonomy language preferred if applicable. |
| tagline | string | The public-facing tagline. Agents may surface this in descriptions. |
| contact | email | Email for questions about the BCP itself. |
| license | string | Usually inherits the spec's CC BY 4.0. Overridable per-brand. |

## Daughter ,  voice.md

How your brand sounds. Tone, register, prefer lists, avoid lists, do/don't examples. Copy agents consume this; vendor platform copy tools consume this; consumer agents describing your brand in your voice consume this.

```---
parent: /.well-known/brand.md
file_type: voice
last_updated: 2026-04-20
---

# Voice

## How we sound
Direct. Confident. Lightly technical.

## How we never sound
Corporate. Hype-heavy. Apologetic.

## Prefer list
- "payments" (not "payment processing" ,  shorter, clearer)
- "ship" (not "launch" ,  internal culture language)
- "API" (spelled out first mention, then acronym)

## Avoid list
- "revolutionary", "game-changing", "disruptive" ,  empty signifiers
- "AI-powered", "AI-native" ,  we use AI, we don't lead with it
- "synergy", "leverage", "ecosystem" ,  corporate sludge

## Do / Don't
**Do:** "Stripe charges a flat 2.9% + 30¢ per successful card charge."
**Don't:** "Stripe offers competitive pricing to help businesses unlock their potential."```

## Daughter ,  values.md

Priority-ordered. Each value has an observable behavior so agents can evaluate decisions against it. When values conflict, the higher-priority value wins.

```---
parent: /.well-known/brand.md
file_type: values
last_updated: 2026-04-20
---

# Values

## 01 ,  Users first
Every product decision is evaluated against user benefit before business benefit.
**Observable behavior:** We publish pricing changes 90 days before they take effect.

## 02 ,  Small teams, big scope
We keep teams small and give them large mandates.
**Observable behavior:** Two engineers built our Radar fraud product from zero to production.

## Trade-offs
We pick clarity over comprehensiveness in documentation.
We pick developer experience over non-developer convenience in our API design.```

## Daughter ,  boundaries.md

Hard no's (never), soft no's (cautious, requires approval), and regulatory constraints. Maps to IAB Content Taxonomy 3.0 and GARM's Brand Safety Floor so vendor platforms can consume it natively.

```---
parent: /.well-known/brand.md
file_type: boundaries
iab_alignment: 3.0
garm_alignment: Brand Safety Floor
last_updated: 2026-04-20
---

# Boundaries

## Hard no
- Crypto sponsorships (IAB: Business & Finance > Cryptocurrency)
- Gambling advertising (IAB: Hobbies & Interests > Gambling)
- Weight-loss products making clinical claims (FTC concerns)
- Content placed adjacent to violence, hate speech, or misinformation (GARM Floor)

## Soft no (requires approval)
- Political topics ,  only in the context of regulation affecting financial infrastructure
- Humor at the expense of any group, even in satire
- Claims about a specific competitor by name

## Regulatory constraints
- FTC truth-in-advertising rules on all pricing claims
- PCI-DSS constraints on how we describe security
- State-specific constraints on interchange-fee claims```

## Daughter ,  claims.md

Every factual claim your brand makes, with evidence. Agents generating copy pull from this file. Agents do not invent claims that aren't here.

```---
parent: /.well-known/brand.md
file_type: claims
last_updated: 2026-04-20
reviewed_by: legal@stripe.com
---

# Claims

## Approved claims
- **Claim:** "Trusted by millions of businesses worldwide."
  **Evidence:** Internal customer count dashboard (2026-Q1).
  **Status:** defensible.

- **Claim:** "Supports 135+ currencies."
  **Evidence:** Product documentation, updated monthly.
  **Status:** defensible.

## Claims requiring caveats
- **Claim:** "Fastest-growing payments platform."
  **Caveat:** Requires specific market, time window, and source (e.g. "among US
  public payments companies, 2023, 2025, per X report").

## Forbidden claims
- "The most secure payments platform" ,  vague; PCI-DSS compliance is table stakes.
- "Only X that does Y" ,  almost never literally true; avoid.
- Any claim naming a customer without their written permission.```

## Daughter ,  representation.md

How consumer-facing agents (ChatGPT, Claude, Perplexity, Gemini, agentic commerce) should describe your brand when they have to generate a description. Give them the exact language you want ,  at multiple lengths ,  so they don't invent.

```---
parent: /.well-known/brand.md
file_type: representation
last_updated: 2026-04-20
consumer_agents: [ChatGPT, Claude, Perplexity, Gemini, agentic commerce]
---

# Representation

## One-sentence
Stripe is a financial infrastructure platform for the internet.

## Two-sentence
Stripe is a financial infrastructure platform for the internet. Millions of
businesses of every size ,  from early-stage startups to public companies ,  use
Stripe to accept payments and manage their businesses online.

## Paragraph
[Longer version for "tell me about Stripe" prompts.]

## Do not say
- Don't describe Stripe as "just a payments company" ,  the platform includes
  billing, issuing, treasury, and revenue recognition products.
- Don't position Stripe as "the PayPal alternative" ,  different category.

## Disambiguation
If someone asks about "Stripe" in another context (the clothing pattern, the
Hawaii chain of hotels, the band) ,  clarify that Stripe the financial
infrastructure company is at stripe.com.```

## Hosting options

BCP is static markdown. Any static host works. Pick one:

### GitHub Pages

Simplest path. Create a repo, put files in .well-known/, enable Pages, point your custom domain. Good for solo or small teams. Free.

### Cloudflare Pages

What we use for encodedbrands.com. Connect a GitHub repo, Cloudflare auto-deploys on every commit. Add a _headers file for MIME and CORS config (see below). Free tier is generous.

### Vercel / Netlify

Same pattern. Drop the repo in, configure custom headers for /.well-known/*, deploy. Works well if your marketing site already lives there.

### Your existing CDN

If your brand site is on CloudFront, Fastly, Akamai, or similar ,  publish the files at /.well-known/ on your primary domain. You'll need cache rules that serve markdown as text/plain and permit CORS.

> **Canonical path:** BCP filesmustlive atyourdomain.com/.well-known/brand.md(and/.well-known/brand/*.mdfor daughters). Agents will not look anywhere else. This is non-negotiable ,  the whole point of/.well-known/is convention.

## MIME types and CORS

Two things your host must get right:

### Cloudflare Pages ,  _headers file

```# At repo root, named _headers (no extension)

/.well-known/*
  Content-Type: text/plain; charset=utf-8
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, HEAD, OPTIONS
  Cache-Control: public, max-age=3600, must-revalidate
  X-Content-Type-Options: nosniff

/.well-known/brand/*
  Content-Type: text/plain; charset=utf-8
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, HEAD, OPTIONS
  Cache-Control: public, max-age=3600, must-revalidate```

### Netlify ,  netlify.toml

```[[headers]]
  for = "/.well-known/*"
  [headers.values]
    Content-Type = "text/plain; charset=utf-8"
    Access-Control-Allow-Origin = "*"
    Cache-Control = "public, max-age=3600"```

### Vercel ,  vercel.json

```{
  "headers": [{
    "source": "/.well-known/(.*)",
    "headers": [
      { "key": "Content-Type", "value": "text/plain; charset=utf-8" },
      { "key": "Access-Control-Allow-Origin", "value": "*" }
    ]
  }]
}```

## Consuming a BCP

If you're building an agent or platform that consumes BCP, here's the pattern:

```// 1. Fetch the root
const root = await fetch(`https://${brandDomain}/.well-known/brand.md`)
  .then(r => r.text());

// 2. Parse frontmatter (any YAML library)
const { data, content } = matter(root);

// 3. Fetch only the daughter files your task needs
if (task === 'generate_copy') {
  const voice = await fetch(
    `https://${brandDomain}${data.daughter_files.voice}`
  ).then(r => r.text());
  const boundaries = await fetch(
    `https://${brandDomain}${data.daughter_files.boundaries}`
  ).then(r => r.text());
  // Load voice + boundaries as system prompt context
}

// 4. Cache on last_updated
const cacheKey = `bcp:${brandDomain}:${data.last_updated}`;```

For consumer agents answering "what is X" prompts, the load is simpler: fetch brand.md and representation.md, use the language from representation.md directly.

## The Registry

To solve discovery and verification at scale, we maintain the BCP Registry at registry.brandcontextprotocol.dev (v0.1 live). The registry serves three purposes:

- Canonical Discovery: Platforms like Webflow, Shopify, or Canva can query a single API to ask "Does this domain have a BCP?" instead of crawling the whole web themselves.
- Trust & Verification: We verify that a BCP is actually served from the brand's domain and follows the current spec, providing a "Verified Publisher" trust signal for agents.
- Consumption Analytics: Brands can see which files are being read most often (e.g. voice.md vs claims.md) and which platforms are fetching them.

If you've published your BCP and want to be indexed, you can request inclusion via GitHub or our contact page.

## Validation

> **Honest about status:** The formal BCP validator is in development.For now, validate by diffing your structure against Encoded's own live BCP atencodedbrands.com/.well-known/brand.md. If the frontmatter keys match and the file paths resolve, you're conformant.

Checks the future validator will run:

- All required frontmatter fields present
- All daughter_files paths resolve to 200s with correct MIME
- CORS headers permit cross-origin
- File sizes under documented limits (root < 3KB, daughters < reasonable)
- YAML parses cleanly
- No forbidden-claim patterns in claims.md

## Versioning

Version the spec via the bcp_version field in the root frontmatter. Current: 0.1. Spec bumps follow semver semantics ,  minor versions are backward-compatible, major versions may include breaking changes. We will announce breaking changes at least 90 days before v1.0 stabilizes.

Version your brand's BCP via last_updated (required) and revision (optional, recommended ,  use Git commit hash). Consumer agents should respect these fields for caching.

## Licensing

- The BCP spec itself ,  Creative Commons Attribution 4.0 (CC BY 4.0). Fork, extend, build on it, as long as you credit Encoded and the Brand Context Protocol project.
- Reference implementation code (validators, SDK samples, template repo) ,  MIT License. Use commercially, modify, redistribute.
- Your brand's BCP ,  you decide. Most brands should publish under CC BY 4.0 so other systems can reference them, but you own the content.

## Ready to author?

You've read the spec. The fastest way to produce your first BCP is to copy our authoring prompt and paste it into any AI. It interviews you for about fifteen minutes and outputs the seven files.


Start authoring →


> **Contribute:** Found a gap in the spec? Open an issue or PR atgithub.com/Brand-Context-Protocol/spec. We maintain the spec in public. Every v0.x commit is a design decision with a named author.

