---
parent: /.well-known/brand.md
file_type: visual
bcp_version: "0.3"
last_updated: 2026-05-07
---

# Visual

The ACME visual identity reflects the brand's core promise: products that look industrial, deliberate, and entirely unconcerned with their failure rate. Our visual system is high-contrast, mechanical, and unapologetically loud.

## Logo

```yaml
logo:
  primary:
    description: Full ACME wordmark, the default in nearly all contexts.
    variants:
      - format: svg
        url: https://cdn.acme.example.com/brand/logo-primary.svg
        sha256: a3f5b8c2d4e6f7081928374650a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f809
        purpose: Vector. All digital and print contexts.
      - format: png
        url: https://cdn.acme.example.com/brand/logo-primary@2x.png
        sha256: b7c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b
        width: 1200
        height: 320
        background: transparent
        purpose: Raster fallback for systems that cannot render SVG.
      - format: png
        url: https://cdn.acme.example.com/brand/logo-primary-white.png
        sha256: c2d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8
        background: transparent
        treatment: white-fill
        purpose: Use only on dark or photographic backgrounds.
  icon:
    description: ACME monogram. Square contexts only.
    variants:
      - format: svg
        url: https://cdn.acme.example.com/brand/logo-icon.svg
        sha256: d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809
        purpose: Vector. Square contexts where the wordmark cannot fit.
  app_icon:
    description: iOS and Android app tile. Pre-masked for both platforms.
    variants:
      - format: png
        url: https://cdn.acme.example.com/brand/app-icon-1024.png
        sha256: e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f80910
        width: 1024
        height: 1024
        background: brand-primary
        purpose: App store and home-screen tile.
  anniversary_2026:
    description: 80th anniversary mark. Use only in 2026 anniversary campaign assets.
    active_through: 2026-12-31
    fallback: primary
    variants:
      - format: svg
        url: https://cdn.acme.example.com/brand/logo-80yr.svg
        sha256: f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b
        purpose: 80th anniversary campaign only.
```

## Logo usage

```yaml
logo_usage:
  clear_space:
    rule: Minimum padding equal to the height of the "A" in the wordmark.
    machine_value:
      unit: x-height
      multiplier: 1.0
  minimum_size:
    digital_px: 24
    print_in: 0.5
  approved_backgrounds:
    - type: solid_color
      color_token: surface
      note: White surface, the default background.
    - type: solid_color
      color_token: surface-inverse
      note: Black surface, requires the white-fill variant.
    - type: solid_color
      color_token: primary
      note: ACME red, requires the white-fill variant.
    - type: photographic
      min_contrast_ratio: 4.5
      note: Photographic only when contrast ratio against logo is at least 4.5:1.
  forbidden_backgrounds:
    - type: gradient
      note: Gradients fight the wordmark's geometry. Never used.
    - type: patterned
      note: Patterns reduce legibility and dilute the mark.
  forbidden_modifications:
    - stretch
    - rotate
    - recolor
    - drop_shadow
    - glow
    - outline
    - crop
    - container_shape
    - animate
```

## Color

```yaml
color:
  tokens:
    primary:
      hex: "#E63312"
      role: primary
      description: ACME Red. The hero color. Used in the wordmark and primary CTAs.
    secondary:
      hex: "#1A1A1A"
      role: secondary
      description: Industrial Black. Used in headlines and structural elements.
    accent:
      hex: "#FFD600"
      role: accent
      description: Hazard Yellow. Used sparingly for urgency and warning.
    surface:
      hex: "#FFFFFF"
      role: surface
    surface-inverse:
      hex: "#000000"
      role: surface-inverse
    text:
      hex: "#1A1A1A"
      role: text
    text-inverse:
      hex: "#FFFFFF"
      role: text-inverse
    critical:
      hex: "#B00020"
      role: critical
    success:
      hex: "#2E7D32"
      role: success
  approved_pairs:
    - foreground: text
      background: surface
      context: Default body text.
    - foreground: text-inverse
      background: surface-inverse
      context: Dark mode and inverse layouts.
    - foreground: text-inverse
      background: primary
      context: Primary CTA buttons.
    - foreground: secondary
      background: accent
      context: Hazard callouts and warnings.
  forbidden_pairs:
    - foreground: primary
      background: accent
      reason: Red on yellow vibrates and reduces legibility below WCAG AA.
    - foreground: accent
      background: surface
      reason: Hazard yellow on white fails contrast and dilutes the urgency signal.
```

## Typography

```yaml
typography:
  families:
    display:
      family: ACME Display
      fallback_stack: ["Impact", "Helvetica Neue Condensed Bold", "sans-serif"]
      weights: [700, 900]
      styles: ["normal"]
      source: self-hosted
      license_note: Licensed for ACME use only. See https://acme.example.com/brand/fonts.
    body:
      family: Inter
      fallback_stack: ["Helvetica Neue", "Arial", "sans-serif"]
      weights: [400, 500, 700]
      styles: ["normal", "italic"]
      source: Google Fonts
    mono:
      family: JetBrains Mono
      fallback_stack: ["Menlo", "Consolas", "monospace"]
      weights: [400, 700]
      source: Google Fonts
  roles:
    display: display
    body: body
    ui: body
    mono: mono
    code: mono
```

## Imagery

```yaml
imagery:
  photographic_style: |
    High-contrast product photography against neutral or desert backdrops.
    Products are shown in use, mid-deployment, or moments before failure.
    Lighting is hard and directional, never soft or studio-diffuse.
  illustration_style: |
    Technical-manual line art. Geometric, precise, exploded-view diagrams
    with dimensional callouts. Black ink on cream paper or red on white.
  iconography_style: |
    Industrial pictograms. Solid fills, no strokes. Inspired by hazard
    placards and shipping-crate stencils.
  forbidden_treatments:
    - soft-focus or bokeh
    - lens flare
    - watercolor or hand-drawn aesthetics
    - pastel palettes
    - lifestyle photography featuring children
```
