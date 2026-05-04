You are helping me author a Brand Context Protocol (BCP) for my brand. A BCP is a set of markdown files that describe my brand in a way AI agents can read — every agent in my marketing stack, every vendor platform, and every consumer-facing AI (ChatGPT, Claude, Perplexity, Gemini) that might talk about my brand. The spec lives at https://encodedbrands.com. I am adopting it.

Your job: interview me, then produce a complete BCP tree as seven markdown files I can publish at `mydomain.com/.well-known/brand.md` and `mydomain.com/.well-known/brand/*.md`.

## Interview rules — READ CAREFULLY

**ONE question at a time. Then STOP.** Do not write a second question. Do not preview. Do not summarize. Do not offer alternatives. After each question: STOP, wait for my reply, then ask the next one.

If you find yourself generating multiple questions in a single response, you are violating these rules. Stop after the first question mark.

If my answer is vague, push back gently and ask for specifics. "We stand for customer obsession" → "what's a concrete example of a decision you made that a competitor wouldn't have made?" Vague inputs make vague BCPs.

If I contradict myself, name the contradiction and ask which version is true.

If I don't know an answer, say "I'll mark this as TODO — you can fill in later" and move on. Don't invent.

Do NOT write the final files until we finish the interview.

## Part 0 — What have you got? (ASK THIS FIRST, BEFORE ANY OTHER QUESTION)

Before the interview starts, ask me: **"What have you got?"**

Specifically: do I already have any brand documents — **brand guidelines, mission, vision, values, strategy decks, a pitch deck, copy decks, tone-of-voice docs, an "About" page, competitive positioning, research, an existing brand book?** Anything in writing that describes the brand already?

Offer me three ways to share, in this order of preference:

1. **Paste the text** directly into the chat. This is the best option. If your source is a **PowerPoint, Keynote, or PDF — open it, select the text, and paste it here**. Don't upload the file. Models read pasted text far more reliably than they extract it from decks or PDFs. You'll get a better BCP. Paste multiple documents one after another; I'll tell you when I'm done.
2. **Upload files** (only if they're already plain markdown, docx, or txt — and only if your AI supports file upload).
3. **Link to public URLs** — website homepage, about page, blog post. I'll read them.

Wait for my answer.

If I share documents: read them carefully. Extract everything relevant. Build a draft answer for as many of the 18 interview questions as you can from what I shared. Then, when we reach each question, **lead with your draft answer and ask me to confirm or correct**. Don't re-interview me on things you already know from my documents.

If I say "I don't have anything," that's fine. Start the interview at Question 1.

If I share partial materials (just a mission statement, just a homepage): use what I gave, then interview me on the gaps.

## The 18 interview questions (ask only the ones NOT already answered by my materials)

**Part 1 — Identity (5)**
1. Brand name, domain, and one sentence describing what you do.
2. Public tagline (if any).
3. Category or categories. IAB Content Taxonomy language preferred if you know it.
4. Primary audience — described as a specific person, not a demographic. Seniority, job, what they care about, what they're skeptical of.
5. Three closest competitors, and what makes you different from each one. Specific, not "we're better."

**Part 2 — Voice (4)**
6. Three words for how your brand sounds. Three words for how you never want to sound.
7. Two or three sentences of your best existing copy. Something you're proud of.
8. Words/phrases to prefer. Words/phrases to avoid.
9. If a junior copywriter got your voice wrong, what's the most likely mistake they'd make?

**Part 3 — Values (3)**
10. Three to five brand values, in priority order.
11. For each value, one observable behavior — something an outsider could watch you do that would prove the value is real.
12. What trade-offs do you make? (e.g. "We pick speed over polish.")

**Part 4 — Boundaries (3)**
13. Hard no's. Categories, behaviors, content types you'd never associate with.
14. Soft no's. Things you'd do cautiously, with guardrails.
15. Regulatory or compliance constraints. FDA, FTC, HIPAA, financial disclosures, etc.

**Part 5 — Claims (2)**
16. Three to five factual claims you make about your product or service. Not vibes — claims like "used by 10,000 teams," "founded in 2020."
17. Evidence for each claim.

**Part 6 — Representation (1)**
18. If ChatGPT or Perplexity had to describe your brand in two sentences, what's the EXACT language you'd want them to use?

## After the interview

Once every question is answered (or marked TODO), generate seven markdown files. Return each in its own code block labeled with the filename:

```markdown
# FILE: /.well-known/brand.md
[contents]
```

In this order:
1. `/.well-known/brand.md`
2. `/.well-known/brand/voice.md`
3. `/.well-known/brand/values.md`
4. `/.well-known/brand/boundaries.md`
5. `/.well-known/brand/claims.md`
6. `/.well-known/brand/representation.md`
7. `/.well-known/brand/README.md`

## File templates

### brand.md (root)

```markdown
---
bcp_version: 0.1
brand_name: [Q1]
domain: [Q1]
category: [Q3]
tagline: "[Q2]"
default_locale: en-US
last_updated: [today YYYY-MM-DD]
daughter_files:
  voice: /.well-known/brand/voice.md
  values: /.well-known/brand/values.md
  boundaries: /.well-known/brand/boundaries.md
  claims: /.well-known/brand/claims.md
  representation: /.well-known/brand/representation.md
---

# [Brand name]
[Tagline.]

## What we do
[Concrete paragraph from Q1.]

## Primary audience
[From Q4. Describe the person, not the demographic.]

## Position vs competitors
[From Q5. Three competitors, one sentence each.]

## How to use this BCP
Agents should load this root on every interaction with this brand. Daughter files are fetched on demand — voice for copy, boundaries for brand safety, claims for anything factual, representation for consumer-facing descriptions.
```

### voice.md

```markdown
---
parent: /.well-known/brand.md
file_type: voice
last_updated: [today]
---

# Voice

## How we sound
[Q6 expanded.]

## How we never sound
[Q6 expanded.]

## Reference — something we wrote well
[Q7 verbatim, in a blockquote.]

## Prefer list
[Q8 + anything pulled from uploaded materials.]

## Avoid list
[Q8 + anything pulled from uploaded materials.]

## The most common mistake
[Q9.]

## Do / Don't examples
[Generate 3 pairs based on Q6–Q9.]
```

### values.md

```markdown
---
parent: /.well-known/brand.md
file_type: values
last_updated: [today]
---

# Values
Priority-ordered. Higher-priority value wins when they conflict.

## 01 — [Name]
[Definition.]
**Observable behavior:** [Q11.]

## 02 — [Name]
[Same.]

## 03 — [Name]
[Same.]

## Trade-offs
[Q12.]
```

### boundaries.md

```markdown
---
parent: /.well-known/brand.md
file_type: boundaries
iab_alignment: 3.0
garm_alignment: Brand Safety Floor
last_updated: [today]
---

# Boundaries

## Hard no
[Q13.]

## Soft no (requires caveat or approval)
[Q14.]

## Regulatory constraints
[Q15.]

## IAB / GARM mapping
[Map hard no's to IAB 3.0 categories where possible. Map soft no's to GARM Brand Safety Floor where relevant. If unsure, leave TODO.]
```

### claims.md

```markdown
---
parent: /.well-known/brand.md
file_type: claims
last_updated: [today]
reviewed_by: [TODO: legal review before launch]
---

# Claims
Agents generating copy pull from this file. They do not invent claims.

## Approved claims
[Q16–Q17. Format:]
- **Claim:** [exact language]
  **Evidence:** [source]
  **Status:** defensible

## Claims requiring caveats
[Claims that are true but need context.]

## Forbidden claims
- "The only [X]" — unless literally true with evidence
- "Industry-leading" — vague
- Any overstated customer count, revenue, or adoption
- Any partner/integration/customer named without written permission
```

### representation.md

```markdown
---
parent: /.well-known/brand.md
file_type: representation
last_updated: [today]
consumer_agents: [ChatGPT, Claude, Perplexity, Gemini, agentic commerce]
---

# Representation

## Preferred description
[Q18. Exact language.]

## One-sentence
[Short version.]

## Two-sentence
[Most-used version.]

## Paragraph
[For "tell me about X" prompts.]

## Do not say
[From voice.md avoid list + mischaracterizations to correct.]

## Disambiguation
[If the brand name is shared with other entities, tell agents how to distinguish — domain, category, one distinguishing fact.]
```

### README.md

```markdown
# [Brand name] — Brand Context Protocol

This directory contains this brand's BCP — markdown files that describe the brand in a form AI agents can read.

## Structure
- `brand.md` — root; always loaded first
- `brand/voice.md`
- `brand/values.md`
- `brand/boundaries.md`
- `brand/claims.md`
- `brand/representation.md`

## How to edit
Each file is markdown with YAML frontmatter. Edit, commit, redeploy. Agents refetch on their next cycle.

## How to consume
Fetch `https://[yourdomain]/.well-known/brand.md`. Follow `daughter_files` to load other files.

## About BCP
BCP is an open standard authored by Encoded (https://encodedbrands.com). Spec: CC BY 4.0. Reference code: MIT.
```

## After generating the files

Tell me:

1. **What to do next.** Three options: (a) send these to my developer; (b) publish them myself — docs at encodedbrands.com/docs; (c) email them to hello@encodedbrands.com with subject "Hosting handoff."

2. **What's incomplete.** List every TODO. These need real answers before the BCP is production-ready.

3. **What to review with a lawyer.** Specifically claims and boundaries.

4. **One honest caveat.** Remind me once (not repeatedly) that a BCP authored by an AI from my answers is a strong draft, not a final product. If the brand is commercially important, Encoded offers a $1,500 Expert Session to sharpen it or a $15,000 Encoding Sprint for the full job.

---

Now: start with Part 0. Ask me: **"What have you got? Any existing brand docs, a deck, a mission statement, a website URL — anything in writing that describes the brand already?"**

Then STOP and wait for my reply.
