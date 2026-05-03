---
date: 2026-05-03
last_updated: 2026-05-03
verdict: Pivot
confidence: Medium
---

# Idea Validation: Cross-Brand Clothing Size Converter (Consumer App)

## Context & Assumptions

- **Stage**: Working PWA proof-of-concept deployed to GitHub Pages
- **Target user**: Online shoppers (gender-neutral, global) who buy across multiple brands and struggle with inconsistent sizing
- **Differentiation emphasis**: Niche/specialty brands (motorcycle gear, formal shirts) + inter-measurement-system (cm/inches, EU/UK/US) + personal confirmed-size profile layer
- **Team**: Solo founder
- **Monetization hypothesis**: Small one-time fee on App Store / Google Play
- **Geography**: International from day one

Assumptions made: mainstream brands (Nike, Zara, H&M) are not the primary target — specialty/niche brands are; the user is not planning to raise funding or hire.

---

## 1. Idea Summary

A consumer-facing mobile app that converts clothing sizes across brands by using body measurements (cm) as a universal translation layer rather than mapping labels directly. Users enter a known size (e.g. Levi's 32/32) and get the closest equivalent in any other brand (e.g. Dainese moto trousers size 48). A personal profile layer lets users store confirmed real-world sizes to override the algorithm when they know the answer. The app is international from day one, handling measurement systems (EU/UK/US/JP) and niche categories (motorcycle gear, formal shirts) that mainstream tools ignore.

---

## 2. Problem Validation

**The problem is real and well-quantified.**

- 77% of online fashion returns are caused by incorrect sizing — it is the #1 return reason in the industry
- Online clothing return rates averaged 24.5% in 2025 (~26% for apparel specifically)
- The root cause is structural: no international sizing standard exists; every brand defines its own measurements for labels like "M" or "32"
- The problem is most acute for: (a) shopping across brands in the same category (e.g. Levi's vs motorcycle gear), (b) shopping internationally, (c) specialty/technical categories where size guides are inconsistent or in different measurement systems

**Pain level**: High for target users. Buying a €300 motorcycle jacket in the wrong size is genuinely painful. This is not a "nice to have" — it is a decision-support tool with real money at stake.

**Current coping mechanisms**: Users manually cross-reference size charts on brand websites, guess, or buy multiple sizes and return. Both are friction-heavy.

---

## 3. Market Opportunity

**TAM**: Global online apparel market is ~$1.86T in 2026, growing at ~5.7% CAGR. Even a fraction of a percent as addressable app revenue is large. However, the real TAM for a utility app is constrained by willingness-to-pay and discoverability.

**Realistic SAM/SOM for a solo founder**:
- Wardrobe/size app market: ~$224M in 2024, projected $399M by 2032 (CAGR 8.8%)
- At a $2.99 one-time fee with 70% App Store margin: you net ~$2.09/download
- To generate $10K/year you need ~4,800 downloads/year (~400/month) — achievable but not trivial for an unknown app
- To generate $50K/year you need ~24,000 downloads/year — requires sustained marketing or viral growth

**Tailwinds**:
- Online shopping continues growing post-pandemic
- Return costs are rising (~$218B problem for retailers) — consumer tools that reduce mis-sizing create real value
- Niche sports/outdoor/motorcycle communities have passionate, brand-loyal buyers who cross-shop globally
- PWA/web-first approach already removes the App Store friction from the PoC

**Headwinds**:
- Multiple consumer competitors already exist (see Section 4)
- Discoverability in a crowded App Store is expensive to achieve organically
- Data maintenance (size charts change; new brands needed) is ongoing unpaid work

---

## 4. Competitive Landscape

| Tool | Coverage | Approach | Gap |
|---|---|---|---|
| **True Fit** | 20,000+ brands | B2B SaaS to retailers, AI-powered | Not consumer-facing; retailer decides whether to integrate |
| **WhatSize** ($0.99–$2.99) | 9 mainstream brands (Nike, Zara, H&M, Adidas, Levi's, ASOS, Gap, Uniqlo) | Label-to-label mapping, offline | Mainstream only; no niche brands; no body-measurement layer |
| **SizeChartLab** | Mainstream brands (Zara, H&M, Nike, Adidas, GAP) | Web-based instant conversion | Same gap as WhatSize |
| **LookSize** | 3500+ brands | Display-only size charts, no conversion | No conversion; no cross-brand recommendation |
| **SizeGo** (Android) | International size standards | Standard-to-standard (US→EU→UK) | Not brand-specific; no niche categories |
| **MySizeID** | Moderate | Measurement-based, uses phone camera | Requires camera body scan; friction-heavy |
| **SizeCharter** | Moderate | "Find brands that fit you" | Wrong direction for cross-brand conversion |

**Actual gap this idea fills**: No consumer tool exists that (1) handles niche/specialty brands (motorcycle gear, cycling, formal shirts) AND (2) uses a body-measurement translation layer AND (3) supports a personal confirmed-size profile. WhatSize is the closest competitor and it stops at 9 mainstream brands.

**Moat**: Thin initially. The data (size charts per brand) is publicly available — any competitor can build the same. The moat would come from:
1. Data breadth and accuracy in niche categories (labor-intensive to build)
2. User trust and word-of-mouth within niche communities (motorcycle riders, cyclists, formal-wear buyers)
3. The personal profile layer (somewhat sticky — users won't want to re-enter confirmed sizes elsewhere)

**Why hasn't this been built**: Mainstream brands are more commercially attractive (larger audience). Niche categories are long-tail and harder to monetize at scale. The B2B route (True Fit) is more lucrative, so that's where investment has gone.

---

## 5. Business Upside

**Success scenario (3–5 years, solo)**:
- 50,000 downloads/year at $2.99 → ~$105K gross, ~$73K net of App Store fees
- Realistic only with strong community presence in 2–3 niche verticals (e.g. motorcycle gear subreddits, cycling forums, menswear communities)

**Alternative monetization paths** (likely stronger than paid download):
- **Affiliate/referral**: When a user finds their size in Brand X, show a "Buy at [retailer]" link with an affiliate tag. Commission is typically 5–10%. Zero friction to acquire users if the app is free.
- **Freemium**: Free with 3–5 brands, paid tier ($1.99/mo or one-time $4.99) for unlimited brands + profile sync
- **B2B pivot**: License the measurement-matching algorithm to niche retailers (e.g. motorcycle gear shops) — mirrors the True Fit model at smaller scale

**Key assumptions that must be true**:
1. Niche shoppers actively search for a size tool, not just Google the brand's size chart
2. Users will download a dedicated app (vs. bookmarking a web tool) for a low-frequency task
3. Enough niche brands can be entered and maintained by one person to be useful
4. Word-of-mouth spreads in specialty communities

---

## 6. Key Risks & Challenges

**1. Data maintenance burden (execution risk)**
Size charts change. Brands add/remove sizes. New brands need entry. With a solo founder, keeping data current for even 50 brands across 5 categories is ongoing, unpaid work. This is the highest operational risk.

**2. Discoverability (market risk)**
A paid App Store app with no marketing budget is hard to surface. App Store search for "size converter" already returns multiple results. Without a community anchor (subreddit, YouTube channel, forum presence), organic discovery is slow. The PWA approach sidesteps this partially but web SEO competition is also fierce.

**3. Low task frequency = low retention (business model risk)**
Users open a size converter app once before a purchase, not daily. This makes subscription monetization hard to justify and reduces the value of acquisition cost. Affiliate is better aligned with this usage pattern.

**4. Incumbent expansion (competitive risk)**
WhatSize or SizeChartLab could add niche brands. They have existing distribution. Differentiation erodes if they expand coverage.

**5. Scope creep / maintenance drag (execution risk)**
Each new category (cycling, outdoor, kids) is a new data problem with different dimensions. Without strict scope control, the project grows faster than one person can maintain.

---

## 7. Business Challenge

**"Why would anyone switch from what they use today?"**
Most users don't use a size converter — they use the brand's own size chart. The switch cost is zero, but so is the habit. You need to be discovered at the moment of purchase decision, which is hard unless you're in the search results for "Dainese size chart" or in the right forum.

**"Why you specifically?"**
No strong answer here. The idea is not technically defensible. The advantage is being first in a neglected niche (specialty brands) and caring enough to do the data work that mainstream tools skipped.

**"What happens when WhatSize adds 50 more brands?"**
The moat collapses unless you have community trust and brand recognition in those niches. Staying ahead requires constant data work.

**"Do the unit economics work?"**
At $2.99 one-time, marginal economics are fine — no per-user cost after download. But customer acquisition cost (even in time, not money) is real. Affiliate or freemium likely produces better LTV per user than one-time paid.

**"What are you assuming about user behavior that might be wrong?"**
That users will (a) find the app before a purchase, (b) trust an app's conversion over the brand's own size chart, and (c) bother to set up a profile. All three are uncertain for infrequent, low-stakes purchases. For high-value purchases (motorcycle jacket) users may be more motivated — this is the right niche to test.

**"Is the App Store worth it?"**
$99/year developer fee, 30% commission, review delays for updates, two separate SDKs (iOS + Android). For a PoC with unproven traction, this is premature. The existing PWA is the right vehicle until you have proof of demand.

---

## 8. Verdict

**Verdict: Pivot**

The core insight — body measurements as a universal translation layer, with a personal profile to capture confirmed real-world sizes — is genuinely differentiated and fills a real gap in the market. The problem is well-validated (True Fit's $18M+ revenue and 20,000 brands proves the concept at B2B scale).

However, **the App Store paid-download model is the wrong first step for a solo founder**:
- Low task frequency makes paid download hard to justify for users
- Discoverability without marketing budget is a real barrier
- Maintenance burden grows faster than revenue at small scale
- The PWA is already deployed and removes App Store friction entirely

**Recommended pivot**:
1. **Keep the PWA as the primary product** — lower friction, no review delays, already live
2. **Pick one niche community to anchor in** (motorcycle gear is the strongest candidate — passionate, global, cross-brand, high price point justifies research effort). Post in r/motorcycles, bikeforums.net, etc.
3. **Switch monetization to affiliate links** — when the tool surfaces "your size in Brand X is 48", add a "Shop Brand X" link with an affiliate tag. Zero friction, aligned with usage pattern, no paywall to deter users
4. **Prove demand before App Store** — if the PWA gets 1,000 regular users via community traction, then the App Store investment is justified. Without that signal, it's premature

**What would change the verdict to Pursue**:
- Evidence of high search volume for niche brand size conversion (e.g. "Dainese size chart" gets 10K+ monthly searches)
- Traction in the PWA: 500+ monthly active users within 3 months of community launch
- A niche retailer willing to embed the tool (shifts to B2B and justifies App Store)

**What would change the verdict to Kill**:
- Zero community traction after 3 months of active promotion
- Discovery that WhatSize or LookSize is already expanding to niche brands

**Confidence**: Medium — the problem is real, the gap is real, but solo founder execution and distribution are hard to predict. The PoC investment is already sunk and worthwhile. The question is how far to take it.

---

## Sources

- [True Fit - Revenue and Business Model (Tracxn)](https://tracxn.com/d/companies/truefit/__0eyBsZdQeLOlAV4nUDYSfqSmzn1jhVPgqorqGfLKv6s)
- [True Fit raises $30M on 85% revenue growth (PR Newswire)](https://www.prnewswire.com/news-releases/global-leader-true-fit-raises-30m-on-85-revenue-growth-301437605.html)
- [WhatSize App Store listing](https://apps.apple.com/ua/app/whatsize-brand-size-converter/id6757195133)
- [SizeChartLab - Brand Size Converter](https://www.sizechartlab.com/)
- [LookSize - Brand size charts](https://www.looksize.com/by-brands-a-z)
- [Online clothing return rates 2025 (Synctrack)](https://synctrack.io/blog/ecommerce-return-rates/)
- [77% of returns due to sizing (fitezapp)](https://www.fitezapp.com/blog/reduce-fashion-returns.html)
- [Wardrobe App Market 2025–2032 (IntelMarketResearch)](https://www.intelmarketresearch.com/wardrobe-app-2025-2032-667-1709)
- [Apparel Market Forecast (GM Insights)](https://www.gminsights.com/industry-analysis/apparel-market)
