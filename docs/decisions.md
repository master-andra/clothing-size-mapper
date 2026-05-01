# Decision Log

Decisions made before any code was written. Revisit these if the project evolves into a product.

---

## Core Concept

**Decision**: Use body measurements (cm) as the universal translation layer between brand sizes — not direct brand-to-brand mapping.

**Rationale**: Direct mapping requires O(n²) pairs as brands grow. Body measurements are the shared ground truth that all brand size guides already publish. This mirrors how True Fit works at scale. It also means adding a new brand only requires entering its size chart once, not pairing it with every existing brand.

---

## Phase 1: Proof of Concept

**Decision**: Build a simple personal web app (PWA) deployed to GitHub Pages. JSON file for data. Hand-curated brand data.

**Rationale**: Validate the concept before investing in native app development. GitHub Pages is free, works on iPhone via "Add to Home Screen," and updates automatically on git push. JSON is sufficient for a small curated brand set.

**Scope**: ~6–10 personally relevant brands. No scraping. Data entered manually from official brand size guides.

**Gate**: Only proceed to Phase 2 if the PoC proves genuinely useful in practice.

---

## Phase 2: Product (conditional on PoC validation)

**Gate**: Before any Phase 2 work begins, a thorough business case must be completed. This includes:
- Market sizing: how many people have this problem, in which segments (moto gear buyers, formal shirt buyers, general cross-brand shoppers)
- Competitive landscape re-evaluation at that point in time
- Monetization model validation: are brands actually willing to pay for partnerships? What does the sales cycle look like?
- Data operations: who maintains brand data, at what cost, at what update frequency
- Platform decision: PWA wrap vs. React Native vs. Swift, and the rationale
- Go-to-market: how does the app get discovered by the right users

**Provisional monetization decision**: Free app with brand partnership revenue (brands pay to be featured or verified). Rationale: keeps the product independent, aligns with quality over referral volume. Affiliate links and paid-download models ruled out (see below).

**Platform**: To be decided as part of the business case. PoC (web/PWA) does not need to be rebuilt — it can be wrapped for App Store using Capacitor or similar.

**Data scale**: Deferred to business case. JSON is not suitable at product scale.

---

## What Was Ruled Out

- **Scraping brand size guides**: Too fragile. Brands update guides, scraper breaks, data silently goes stale. Hand-curation is more reliable for a small set.
- **Direct brand-to-brand mapping**: Scales poorly. Every new brand requires N new mappings.
- **Native iOS app from the start**: Premature. Concept is unvalidated. A PWA proves the same thing at zero cost.
- **$2.99 one-time purchase model**: Weak economics. ~47 downloads to break even on Apple Developer fee alone.
- **Affiliate link model**: Creates third-party dependencies and misaligned incentives (recommending where to buy vs. recommending the right size).
