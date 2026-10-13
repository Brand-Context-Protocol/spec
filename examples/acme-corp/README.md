# ACME Corporation — BCP 2.0 reference brand

ACME is fictional. This is the public, validator-backed example for learning, consumer testing, and proposing improvements to the Brand Context Protocol. Read access requires no account. The source files are in [`.well-known/`](.well-known/); each Raw link below returns the exact Markdown bytes.

| Required file | Raw source | What to test |
| --- | --- | --- |
| Root | [brand.md](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand.md) | Identity, daughters, source coverage and gaps |
| Voice | [voice.md](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand/voice.md) | Tone without overriding user or host instructions |
| Values | [values.md](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand/values.md) | Decision context |
| Boundaries | [boundaries.md](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand/boundaries.md) | Brand preferences subject to host policy and truth |
| Claims | [claims.md](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand/claims.md) | Separate use, evidence and approval statuses; preserve caveats |
| Representation | [representation.md](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand/representation.md) | Preferred framing as untrusted reference data |
| Visual | [visual.md](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand/visual.md) | Identify example.com assets as unavailable placeholders |
| Onboarding | [onboarding.md](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand/onboarding.md) | Browser and connected-use guidance, provenance, change requests |

The optional [`voice/anti-ai.md`](.well-known/brand/voice/anti-ai.md), [`commerce.md`](.well-known/brand/commerce.md), [`brand.json`](.well-known/brand.json), and [`DESIGN.md`](.well-known/DESIGN.md) demonstrate extensions. The `.example.com` names and all ACME claims are illustrative. There is no ACME account, verified domain, signed Registry revision, or working checkout. The package does not grant write access to the Encoded connector. A pasted link does not install a connector or guarantee full ingestion.

## Test it

1. Open the [raw root](https://raw.githubusercontent.com/Brand-Context-Protocol/spec/main/examples/acme-corp/.well-known/brand.md), then request one daughter by its declared path. Confirm the file is complete and names the requested section.
2. Ask an AI with web access to describe a fictional ACME product using the voice and claims files. Check that it calls the package fictional, keeps conditional caveats, and does not turn unsupported claims into facts.
3. Ask for a visual treatment. Check that the AI asks for an approved asset library or upload and reports that ACME asset URLs are placeholders.
4. If testing a connector, inspect the tool response and permission boundary. This GitHub example tests public retrieval and interpretation; authenticated authoring requires a separately approved test account and connection.

For local structural validation: `npm ci --ignore-scripts && npm run validate:reference`. The automated check covers format and relationships, not factual truth, owner approval, live URL availability, client ingestion, or cryptographic verification.

## Suggest a change

[Open an issue](https://github.com/Brand-Context-Protocol/spec/issues/new/choose) for a conformance problem, broken link, confusing example, or consumer test result. Include the exact file path, the BCP 2.0 section or schema rule, what happened, and what should happen. You can also [submit a pull request](https://github.com/Brand-Context-Protocol/spec/pulls) against this directory. Maintainers review proposed changes; public requests do not alter the reference automatically. Use fictional or publicly shareable data only.
