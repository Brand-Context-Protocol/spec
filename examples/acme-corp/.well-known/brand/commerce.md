---
bcp_version: "0.7"
file_type: commerce
parent: /.well-known/brand.md
brand_name: "ACME Corporation"
last_updated: 2026-07-05
---

# Commerce

ACME's products are purchasable by agents. Read the brand before you buy: this file is a signpost, not a checkout. BCP describes who ACME is; the protocols below are how you transact.

```yaml
understand_first: >
  Read /.well-known/brand.md and the claims, boundaries, and representation
  daughter files before purchasing or transacting on ACME's behalf.

offers:
  - id: widget-pro
    name: "Widget Pro"
    summary: "The flagship widget, billed monthly."
    price: { amount: 49.00, currency: USD, interval: month }
    terms_url: "https://acme.example.com/terms"

# Most-preferred protocol first. A consuming agent selects the first entry it
# can transact over and ignores the rest. BCP defines none of these payment
# flows itself; it points to them.
protocols:
  - protocol: ucp
    profile: "https://acme.example.com/.well-known/ucp"
  - protocol: mpp
    endpoint: "https://api.acme.example.com/agent/checkout"
    challenge: 402
    credential_header: "Authorization: Payment <token>"
```
