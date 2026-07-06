---
bcp_version: "0.7"
file_type: voice
last_updated: 2026-07-05
parent: /.well-known/brand.md
---

# Voice

## Essence

```yaml
essence:
  mission: "Deliver impossible solutions that work until they don't."
  vision: "A world where every acme product comes with a smile and zero warranty."
  tagline: "Confident. Tested in the desert. Guaranteed to fail spectacularly."
  brand_promise: "We guarantee everything. Read the refund policy."
```

## Personality

Confident to the point of absurdity. Matter-of-fact about impossible things. We describe a rocket-powered pogo stick with the same straightforward tone a hardware store uses for a box of nails. Technical language is welcome but never exclusionary. We are enthusiastic about our products and genuinely unbothered by their failure rate.

## Voice Traits

```yaml
traits:
  - is: "Confident"
    not: "Cautious"
    description: "We stand behind our products. We do not hedge or disclaim."
  - is: "Casual"
    not: "Liability-aware"
    description: "We sound like engineers with a sense of humor, not lawyers."
  - is: "Technical"
    not: "Jargony"
    description: "Precise language for people who understand what 'desert-tested' means."
  - is: "Unbothered"
    not: "Apologetic"
    description: "We've been sued many times. Our copy never sounds like it."
  - is: "Enthusiastic"
    not: "Hype-focused"
    description: "We love what we build. We don't oversell what it does."
```

## Vocabulary

```yaml
vocabulary:
  prefer:
    - word: "solution"
      use: "For creative applications of our products. Acme solutions solve impossible problems."
    - word: "guaranteed"
      use: "We guarantee everything. Use freely."
    - word: "patent-pending"
      use: "Most of our products are patent-pending because no patent office will approve them."
    - word: "desert-tested"
      use: "Our primary testing environment. Implies durability and unreliability in equal measure."

  avoid:
    - word: "safe"
      why: "Legally inadvisable given our litigation history."
    - word: "safety-tested"
      why: "Same. We test for speed, not safety."
    - word: "reliable"
      why: "Our repeat business model depends on replacement purchases."
    - word: "user error"
      why: "We prefer 'creative misapplication.'"
    - word: "defective"
      why: "We prefer 'performed outside designed parameters.'"
    - word: "fail"
      why: "We prefer 'spectacular failure mode' or 'expected destruction pattern.'"

  substitutions:
    - prefer: "solution"
      avoid: "product"
      example: "The ACME Rocket Roller-Skates are the solution for anyone who wants to move faster than gravity."
    - prefer: "guaranteed"
      avoid: "warrantied"
      example: "Every ACME product is guaranteed for exactly the time you need it to work."
    - prefer: "desert-tested"
      avoid: "field-tested"
      example: "Our ACME Jet-Propelled Unicycle is desert-tested and ready for your commute."
    - prefer: "creative misapplication"
      avoid: "user error"
      example: "If you apply the ACME Anvil Launcher to purposes other than anvil-launching, that's creative misapplication."
    - prefer: "performed outside designed parameters"
      avoid: "defective"
      example: "When the ACME TNT Bundle detonates in your hands, it's simply performing outside designed parameters."
```

## Forbidden Topics

```yaml
forbidden_topics:
  - topic: "Actual safety recommendations"
    severity: "never"
  - topic: "Legal disclaimers masquerading as copy"
    severity: "never"
  - topic: "Apologies for product failure"
    severity: "never"
  - topic: "Comparisons to Wile E. Coyote"
    severity: "avoid"
    note: "We are the technology. Coyote is the application."
```

## Naming

```yaml
naming:
  canonical: "ACME"
  abbreviation: "ACME"
  capitalization: "All caps. Always. No exceptions."
  forbidden_variants:
    - "Acme"
    - "acme"
    - "A.C.M.E."
    - "The Acme Corporation"
  acronym_rules: "ACME is not an acronym. It is a name. Treat it as a proper noun."
  product_naming: "All ACME products include the product type. ACME Rocket-Propelled Roller-Skates, not just Roller-Skates."
```

## Messaging Tiers

```yaml
messaging_tiers:
  - topic: "brand"
    blunt: "ACME. Tested in the desert. Guaranteed."
    short: "ACME delivers impossible solutions. We guarantee everything. Read the fine print."
    long: "ACME has been manufacturing impossible solutions since 1938. Every product is desert-tested, patent-pending, and guaranteed to exceed your expectations—at least until it doesn't. We've been sued more times than we've had successful product launches. We're still here. Your order will be too."
  - topic: "product"
    blunt: "It works. Until it doesn't."
    short: "Designed to solve the impossible. Built to fail spectacularly."
    long: "This ACME product was engineered by some very smart people who tested it in the desert until something went catastrophically wrong. Then we engineered it again. We did this many times. What you're holding is the result."
  - topic: "failure"
    blunt: "That's not a bug. That's a feature."
    short: "Your product performed outside designed parameters. See the fine print for what that means."
    long: "The ACME engineering team designed this product to function within a very specific set of conditions. If you have managed to trigger a different set of conditions, congratulations. You have applied this product creatively."
  - topic: "warranty"
    blunt: "Guaranteed. Read the refund policy."
    short: "We guarantee every ACME product for the exact amount of time you need it to work."
    long: "ACME products come with a comprehensive guarantee. The length of that guarantee is proportional to how much you paid and inversely proportional to how badly you need it to work. See the refund policy for details."
```

## Topic Templates

```yaml
topic_templates:
  - topic: "product failure modes"
    guidance: "Describe what happens when the product fails. Be specific. Be enthusiastic. Never apologize."
    example_good: "When the ACME Rocket-Propelled Roller-Skates reach their maximum speed, they continue accelerating until they collide with a solid object."
    example_bad: "We regret to inform you that the ACME Rocket-Propelled Roller-Skates may exceed safe operating speeds."
  - topic: "customer misapplication"
    guidance: "Assume the customer is creative. Describe what they might have done. Make it sound inevitable."
    example_good: "The ACME Dynamite Bundle was designed for mining. If you're using it to open a pickle jar, that's a creative application."
    example_bad: "The ACME Dynamite Bundle is not intended for use as a pickle-jar opener."
  - topic: "refund requests"
    guidance: "Acknowledge the request. Reference the fine print. Sound unbothered."
    example_good: "We've reviewed your refund request. According to section 7.2b of the warranty terms, your product is no longer under guarantee. Thank you for choosing ACME."
    example_bad: "We regret that we cannot process your refund at this time."
```

## Audience Modulation

```yaml
audience_modulation:
  - audience: "customer"
    tone_shift: "Enthusiastic but straightforward. Assume they know what they're buying."
    vocabulary_additions:
      prefer:
        - word: "spectacular"
          use: "For describing product failures. Use liberally."
        - word: "creative"
          use: "For describing unintended uses. Always admiring."
  - audience: "legal"
    tone_shift: "Matter-of-fact. Reference the fine print constantly. No personality."
    trait_overrides:
      - is: "Precise"
        not: "Playful"
  - audience: "engineer"
    tone_shift: "Technical. Assume familiarity with explosives and desert conditions."
    vocabulary_additions:
      prefer:
        - word: "designed parameters"
          use: "The conditions under which we expect this product to work."
        - word: "edge case"
          use: "The situation where your product fails catastrophically."
  - audience: "regulator"
    tone_shift: "Formal. Compliant. Reference the warranty."
```

## Rules

```yaml
rules:
  - "Every product mention includes the full product name."
  - "No apologies. Ever."
  - "Failure modes are described with enthusiasm."
  - "The warranty is referenced, never explained."
  - "Confidence is never hedged."
  - "Casual language is welcome. Legal language is not."
  - "If it sounds like we've been sued, that's because we have."
```

## Channels

```yaml
channels:
  product_pages:
    surfaces: ["website product page", "product spec sheet"]
    good: "The ACME Rocket-Propelled Unicycle reaches speeds of 300mph. Helmet not included."
    bad: "Please exercise caution when operating the ACME Rocket-Propelled Unicycle, as it may exceed safe operating speeds."
  warranty:
    surfaces: ["warranty card", "refund policy"]
    good: "ACME guarantees this product for the amount of time you need it to work. Refund policy available upon request."
    bad: "This product is covered by a limited one-year warranty against manufacturing defects."
  support:
    surfaces: ["help docs", "FAQ", "support email"]
    good: "Your product performed outside designed parameters. Congratulations on the creative application. See the fine print."
    bad: "We're sorry you're experiencing issues with your ACME product. Please try these troubleshooting steps."
  marketing:
    surfaces: ["email", "social", "ads"]
    good: "ACME. Desert-tested. Guaranteed. Spectacular failure rates since 1938."
    bad: "ACME products are reliable solutions for your daily needs."
```
