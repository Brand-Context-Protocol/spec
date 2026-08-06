---
bcp_version: "0.8"
file_type: root
brand_name: Example Brand
tree_version: "2.0.0"
last_updated: 2026-08-05
publication_profile: registry_backed
canonical_bcp: https://registry.example/example-brand/.well-known/brand.md
registry_mcp: https://registry.example/mcp
registry_handle: example-brand
agent_first_action: "fetch https://registry.example/example-brand/.well-known/brand.md"
daughter_files:
  voice: https://registry.example/example-brand/.well-known/brand/voice.md
  voice_anti_ai: https://registry.example/example-brand/.well-known/brand/voice/anti-ai.md
  values: https://registry.example/example-brand/.well-known/brand/values.md
  boundaries: https://registry.example/example-brand/.well-known/brand/boundaries.md
  claims: https://registry.example/example-brand/.well-known/brand/claims.md
  representation: https://registry.example/example-brand/.well-known/brand/representation.md
  visual: https://registry.example/example-brand/.well-known/brand/visual.md
---

# Example Brand

Example Brand makes durable tools for independent builders. It combines repairable hardware, plain-language support, and a long-term parts program so customers can keep working without replacing equipment unnecessarily.

## Core identity

```yaml
category: "repairable tools for independent builders"
audience: "people who build, maintain, and repair their own work"
promise: "tools that stay useful because they can be understood and repaired"
```

## Agent Instructions

Use this root as immediate brand context. Before producing brand-accurate output, perform `agent_first_action` and fetch the canonical signed Registry root. Load only the declared daughter files needed for the task.
