# RFC 0019: Optional adjacency taxonomy records

- Status: Draft. Not part of BCP 2.0 conformance.
- Date: 2026-11-09
- Target: A separately reviewed future extension.
- Compatibility: Plain strings stay valid. Existing packages need no migration.

## Problem

BCP 2.0 references IAB Content Taxonomy 3.0 category labels and an optional
GARM-derived suitability vocabulary. Its versioned schemas cover frontmatter,
claims and delivery. They do not define a boundaries schema or constrain
`brand_safety.adjacency_*` item types. A producer can therefore label an entry
as IAB-aligned without recording an exact taxonomy identifier or its evidence.

## Proposal

Consider an optional object form alongside existing plain strings in
`adjacency_unsuitable`, `adjacency_acceptable` and `adjacency_contextual`:

```yaml
brand_safety:
  adjacency_unsuitable:
    - label: "<exact IAB 3.0 tier name>"
      taxonomy: iab_content_3.0
      iab_id: "<IAB 3.0 unique ID>"
      garm_derived_tier: floor
      evidence: "<source reference or [gap]>"
```

The proposed object records an exact category label and unique ID from the
pinned taxonomy version. `garm_derived_tier` is optional, with candidate values
`floor`, `high`, `medium` and `low`. It records a suitability level, not a
category or a current GARM endorsement. Vendor interpretation remains relevant.

Evidence identifies the attributable source for the brand's adjacency choice.
`[gap]` discloses missing evidence; it does not establish approval or support.
When no exact IAB category matches, retain a plain descriptive string. Do not
invent an IAB identifier or attach an approximate taxonomy label.

## Compatibility and implementation boundary

This RFC changes no normative schema, validator or required package field.
Plain strings remain valid. Consumers would need an explicitly reviewed
extension contract before relying on these object semantics. Existing packages
and signatures remain untouched. Compiler warnings about misleading taxonomy
prefixes can ship independently as producer policy.

## Official source and license

- [Official Content Taxonomy 3.0 TSV](https://github.com/InteractiveAdvertisingBureau/Taxonomies/blob/main/Content%20Taxonomies/Content%20Taxonomy%203.0.tsv)
- [Repository license notice](https://github.com/InteractiveAdvertisingBureau/Taxonomies#license)
- [IAB Tech Lab implementation guide](https://iabtechlab.com/wp-content/uploads/2021/09/Implementation-Guide-Content-Taxonomy-3-0-pc-Sept2021.pdf)
- [CC BY 3.0 terms](https://creativecommons.org/licenses/by/3.0/)

The repository notice and implementation guide identify Creative Commons
Attribution 3.0. Redistribution is permitted subject to that license, including
appropriate attribution, a license link, retention of applicable notices and
identification of adaptations. Any future vendored copy should record its
upstream commit, source URL and SHA-256 digest, retain the license notice and
identify any transformations separately. It must not imply IAB endorsement.

No taxonomy data is vendored by this RFC. Vendoring awaits Nick's confirmation.

## Open decisions

- Review the object form and any future versioned boundaries schema separately.
- Define treatment of deprecated IDs, conflicting label/ID pairs and extensions.
- Decide whether evidence is a scalar or a reusable structured source reference.
- Confirm vendoring before adding taxonomy data or an ID lookup dependency.
