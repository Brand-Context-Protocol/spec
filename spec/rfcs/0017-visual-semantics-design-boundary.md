# RFC 0017: Visual semantics vocabulary and DESIGN.md boundary

- Status: Implemented in BCP v0.8
- Tracking issue: https://github.com/Brand-Context-Protocol/spec/issues/17
- Target: Additive v0.8 clarification
- Compatibility: Backward compatible

## Resolution

Accepted and implemented as an additive v0.8 clarification on 2026-09-02. The normative contract is in `SPEC.md` §5.8 and §7.3; the optional vocabulary is represented by `schema/v0.2/visual.json` and `examples/visual-semantics-v0.8.json`. No producer is required to populate the complete vocabulary.

## Summary

BCP should give detailed visual semantics a standard home in `visual.md`, even when a particular compiler, encoder, or authoring tool cannot populate every field.

This RFC proposes an optional vocabulary for AI-executable visual identity and clarifies the boundary between authoritative brand identity in `visual.md` and interface implementation projected into `DESIGN.md`.

The proposal is informed by useful semantic distinctions in Sameness Design's `brand.md` proposal while preserving BCP's hierarchical package, evidence discipline, Registry publication model, and existing `DESIGN.md` interoperability.

## Problem

Exact values such as a hex code, font family, or logo URL are necessary but insufficient for generative systems. Agents also need to know:

- what a visual element means
- how it should be described to an image or video model
- what nearby alternatives it must not drift toward
- which relationships and usage constraints are approved
- when the source is incomplete and the agent must ask rather than invent

BCP v0.8 has homes for logos, colors, typography, layout, and imagery, but the optional semantic vocabulary is not yet defined deeply enough for consistent producer and consumer behavior.

## Design principle

`visual.md` is the authoritative home for brand-owned visual identity, meaning, assets, generative direction, and constraints.

`DESIGN.md` is an optional deterministic interoperability projection for interface implementation details used by coding and design tools.

Some exact values, such as approved colors and font families, may appear in both files because `DESIGN.md` projects them from the same underlying record. This is duplicated representation, not duplicated authority. `DESIGN.md` must not be authored independently and must not override `visual.md`.

## Producer capability

All fields proposed here are optional.

A conformant producer may emit only the fields it can support. A producer may be a human author, brand-management platform, compiler, encoder, importer, or Registry publication workflow.

No producer is required to infer or complete the full vocabulary. Missing information must be omitted or represented as an explicit gap. It must not be fabricated.

Consumers must tolerate absent optional fields and must not infer missing semantic guidance from exact values alone. For example, a consumer must not infer that a dark green is "premium," "natural," or "British racing green" solely from its hex value.

## Ownership boundary

### `visual.md`

`visual.md` should own:

- approved visual assets and integrity metadata
- exact brand colors and typography
- semantic and perceptual descriptions
- brand-level usage intent
- approved and forbidden relationships
- logo generation and authenticity policy
- imagery and media direction
- brand-level composition principles
- brand-level motion character and prohibitions
- provenance, evidence status, and confirmation state

### `DESIGN.md`

`DESIGN.md` should own or project:

- CSS variables and implementation tokens
- spacing and radius scales
- shadows and elevation tokens
- component styles
- buttons, cards, navigation, and UI states
- breakpoints and responsive implementation
- exact animation durations and easing
- code-level design-system mechanics

General task recipes and workflow instructions are outside `visual.md`.

## Optional vocabulary

### Color semantics

Existing `hex` and `role` fields remain unchanged. A color token may additionally declare:

```yaml
color:
  tokens:
    primary:
      hex: "#184F35"
      role: primary
      semantic_name: dark British racing green
      perceptual_descriptors:
        - deep
        - muted
        - cool
      generation_prompt: dark British racing green, deep forest tone, muted and natural
      avoid_confusion_with:
        - hunter green
        - olive
        - bright forest green
      usage_rule: Use for primary emphasis.
```

These semantic fields must come from an admissible source or brand confirmation. They must not be derived from the hex value alone.

Existing `approved_pairs` and `forbidden_pairs` remain the relationship layer for color use.

### Typography semantics

Existing family, weight, style, source, license, fallback, and role fields remain unchanged. A typography family may additionally declare:

```yaml
typography:
  families:
    display:
      family: Neue Haas Grotesk Display
      classification: neo-grotesque sans-serif
      character:
        - precise
        - neutral
        - modernist
      comparable_families:
        - Helvetica Neue
        - Aktiv Grotesk
      fallback_stack:
        - Helvetica Neue
        - Arial
        - sans-serif
      usage_rule: Use for display headlines and high-confidence editorial moments.
```

`comparable_families` describes visual similarity. It does not grant licensing rights or authorize substitution. `fallback_stack` remains the executable substitution order.

### Logo authenticity

The existing logo asset, hash, clear-space, size, background, and modification rules remain authoritative. `logo_usage` may additionally declare:

```yaml
logo_usage:
  generation_policy: official_assets_only
  generation_instructions:
    - Do not draw, approximate, or hallucinate the logo.
    - Generate surrounding imagery without a logo.
    - Composite a verified official asset afterward.
```

Unless a brand explicitly provides a different policy, consumers should prefer verified official assets over model-generated approximations.

### Imagery and media direction

The existing imagery fields remain valid. Producers may provide additional structured direction:

```yaml
imagery:
  photography:
    camera_language: documentary, eye-level, natural focal lengths
    lighting: available light with controlled contrast
    composition:
      - generous negative space
      - one clear subject
    color_grade: neutral whites with restrained saturation
    subject_behavior:
      - candid rather than posed
  prompt_fragments:
    - direct, observational photography
    - quiet confidence
  forbidden_treatments:
    - generic stock-business scenes
    - fake interface overlays
  negative_prompts:
    - synthetic corporate handshake
    - decorative AI circuitry
```

Equivalent optional blocks may be defined for illustration, video, audio, and other media when the brand has approved guidance.

### Motion semantics

Brand-level motion guidance belongs in `visual.md`:

```yaml
motion:
  character:
    - purposeful
    - restrained
  principles:
    - Motion clarifies state changes rather than decorating static content.
  forbidden_treatments:
    - ornamental looping motion
  reduced_motion_policy: Preserve meaning without requiring animation.
```

Exact duration tokens, easing curves, and component transitions belong in `DESIGN.md` or another implementation artifact.

### Composition boundary

`visual.md` may contain brand-level composition guidance such as hierarchy, density, cropping, whitespace character, and forbidden compositions.

Raw spacing scales, radius scales, shadows, button styling, and component implementation should be projected into `DESIGN.md`, not treated as brand meaning in `visual.md`.

## Evidence and authority

This RFC should be paired with a visual evidence contract. Producers should be able to distinguish:

- `brand_declared`: supplied by an authoritative brand source
- `brand_confirmed`: explicitly confirmed by the accountable brand owner
- `observed`: measured or extracted from a live surface but not confirmed as policy
- `inferred`: machine interpretation that must not be represented as binding brand truth

Normative semantic guidance should be `brand_declared` or `brand_confirmed`. Observed values may be published with their status when useful. Inferred values must not be published as authoritative guidance.

The final specification should reuse BCP's evidence and provenance model rather than create a competing visual-only trust system.

## Reference implementation impact

This RFC does not require the Encoded Brands Encoder or any other producer to populate every field.

The current Encoder can already provide some exact values, including observed colors, font families, logo URLs, asset hashes, and selected design-system data. It cannot reliably provide all semantic names, perceptual descriptors, media DNA, or relationship rules without source material or confirmation.

Before the reference implementation claims support for this RFC, it should:

1. emit only semantic fields supported by evidence or confirmation
2. represent unsupported fields as omitted or explicit gaps
3. keep interface implementation values in the `DESIGN.md` projection
4. stop generating brand-specific logo and imagery rules from generic defaults
5. add visual provenance and anti-fabrication tests

These are reference implementation changes, not prerequisites for the protocol vocabulary to exist.

## Compatibility

The proposal is additive:

- Existing v0.8 `visual.md` files remain valid.
- Existing consumers remain valid because they must ignore unrecognized fields.
- Producers may adopt any subset of the optional vocabulary.
- `DESIGN.md` remains optional and deterministically derived.
- No existing field is removed or reinterpreted.

## Acceptance direction

1. Give rich visual semantics a standard optional home in `visual.md`.
2. Keep UI implementation mechanics in `DESIGN.md`.
3. Permit partial producer support without weakening anti-fabrication rules.
4. Add a visual evidence contract before any semantic field is treated as binding.
