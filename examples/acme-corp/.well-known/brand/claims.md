---
parent: /.well-known/brand.md
file_type: claims
bcp_version: "2.0.0"
last_updated: "2026-10-12"
---

# Claims

This is a fictional conformance example. Its evidence references illustrate the shape of a brand record; no shipping log, product database, incorporation record, legal review, or accountable owner approval exists. `brand_approval: unreviewed` is deliberate. No claim in this file grants permission to make a factual statement about a real company.

## Permitted in the fictional scenario

```yaml
permitted:
  - claim: "Overnight delivery, anywhere on Earth."
    use_status: permitted
    evidence_status: unknown
    brand_approval: unreviewed
    evidence: "Illustrative internal shipping logs and a fictional 99.97% on-time rate for fiscal 2025; no independent source exists."
  - claim: "Over 10,000 products in our catalog."
    use_status: permitted
    evidence_status: unknown
    brand_approval: unreviewed
    evidence: "Illustrative product database count as of 2026-Q1; no real database exists."
  - claim: "Trusted by customers for over 75 years."
    use_status: permitted
    evidence_status: unknown
    brand_approval: unreviewed
    evidence: "Illustrative 1949 incorporation and repeat-purchase story; neither is independently evidenced."
    caveat: "In this scenario, 'trusted' describes repeat purchases, not product satisfaction."
```

## Requires caveat

```yaml
requires_caveat:
  - claim: "Our products always work as designed."
    use_status: conditional
    evidence_status: unknown
    brand_approval: unreviewed
    caveat: "In the fictional scenario, the designed function may diverge from the customer's intended use; do not imply safety or reliability."
  - claim: "Industry-leading innovation."
    use_status: conditional
    evidence_status: unknown
    brand_approval: unreviewed
    caveat: "No defined industry, comparison set, or third-party ranking supports 'leading'; this is illustrative wording only."
```

## Forbidden

```yaml
forbidden:
  - claim: "Safe for home use."
    use_status: prohibited
    evidence_status: unsupported
    brand_approval: unreviewed
    evidence: "No fictional ACME product has a home-use safety certification."
  - claim: "Satisfaction guaranteed."
    use_status: prohibited
    evidence_status: unsupported
    brand_approval: unreviewed
    evidence: "The fictional satisfaction metrics are not publishable."
  - claim: "Recommended by professionals."
    use_status: prohibited
    evidence_status: unsupported
    brand_approval: unreviewed
    evidence: "No professional endorsement is recorded in this example."
  - claim: "A specific customer succeeded with an ACME product."
    use_status: prohibited
    evidence_status: unsupported
    brand_approval: unreviewed
    evidence: "The fictional package contains no documented customer success."
```
