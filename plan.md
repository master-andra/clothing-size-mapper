# Plan

## Status: Phase 1 — complete except 1.5 (iPhone test) and 1.6 (schema migration)

---

## Phase 1: Proof of Concept

Goal: a working personal tool that answers "I have Levi's 32/32 — what Dainese moto pants size?" with the underlying measurements shown.

### 1.1 Project setup (in progress)
- [x] Directory structure
- [x] CLAUDE.md
- [x] docs/ (research, decisions, architecture)
- [x] plan.md
- [x] Git init + .gitignore
- [x] package.json + Vitest
- [x] Stub files (conversion.js, index.html, app.js, style.css)
- [x] GitHub repo + Pages enabled

### 1.2 Data schema + seed data
- [x] Finalise sizes.json schema (see docs/architecture.md)
- [x] Enter Levi's bottoms data (28–40 waist, 30–34 inseam)
- [x] Enter Dainese moto pants data (sizes 42–58)
- [x] Enter Seidensticker shirts data (collar 37–44)
- [x] Enter TM Lewin shirts data (collar 14.5–17.5, all sleeve lengths)
- [ ] Chest measurement normalization (body vs garment ambiguity) — deferred to 1.6

### 1.3 Conversion logic (TDD)
- [x] Write tests for: exact match, closest match, between sizes, outside range, missing dimension
- [x] Write tests for personal profile: known→known, known→unknown, unknown→unknown modes
- [x] Implement `getSizeFromLabel(brand, category, label)` → measurements
- [x] Implement `findClosestSize(measurements, targetBrand, category)` → { size, deltas }
- [x] Implement `resolveConversion(data, profile, category, sourceBrand, sourceLabel, targetBrand)` → { mode, result }
- [x] All tests passing (19/19)

### 1.4 Web app UI
- [x] Category selector (bottoms / shirts / moto-bottoms)
- [x] Source brand + size picker
- [x] Target brand picker
- [x] Results: recommended size + measurement table with deltas
- [x] "My confirmed sizes" section — stored in localStorage, auto-saves on change
- [x] Visual mode badge (confirmed / partial / estimate)
- [x] Mobile-friendly layout

### 1.5 Deploy
- [x] Push to GitHub
- [x] Enable GitHub Pages + CI/CD (tests gate deployment)
- [ ] Test on iPhone (Safari + Add to Home Screen)

### 1.6 Schema migration — dimension-first architecture

**Why**: the current schema nests brands inside categories, creating silos. Brands
can't be compared across categories without data duplication. At thousands of brands
this breaks down. The fix must happen before significant brand expansion.

**Two structural problems to fix:**

1. **Category silos → brand duplication**
   Currently Levi's lives in `bottoms` and had to be duplicated into `moto-bottoms`.
   Target: brands are top-level and declare which categories they appear in.
   No duplication — the same size data is referenced from multiple category contexts.

2. **Measurement normalization debt → algorithm hacks**
   Some brands publish garment measurements or use non-standard methods (e.g. TM Lewin
   sleeve from centre-back). These need to be converted to the standard body measurement
   once at data entry, not handled algorithmically at query time. After normalization,
   sleeve becomes a usable comparison dimension for shirts automatically — no special
   casing needed.

**See `docs/architecture.md` for the full target schema.**

**Implementation tasks:**
- [ ] Migrate `data/sizes.json` to brand-first schema (brands top-level, categories as tags)
- [ ] Normalize TM Lewin sleeve data to shoulder-seam standard (verify offset, apply at entry)
- [ ] Remove duplicated Levi's entry from `moto-bottoms` (no longer needed)
- [ ] Update `conversion.js` to work with brand-first schema
- [ ] Update `app.js` UI to use brand-first schema (category filter → shows brands tagged with that category)
- [ ] Update all tests
- [ ] Re-enable `sleeve` as a comparison dimension for shirts

---

## Phase 2: Community Traction (blocked on Phase 1 daily use)

Goal: prove demand before investing in a native app. Primary vehicle remains the PWA.

Do not start until Phase 1 is in daily use and clearly valuable.

### 2.1 Anchor in one niche community (motorcycle gear)
- [ ] Expand brand data: add 3–5 more motorcycle gear brands (e.g. Rev'It, Alpinestars, RST, Held)
- [ ] Add cycling category if motorcycle traction is good
- [ ] Post to r/motorcycles, r/motogear, bikeforums.net with the tool link
- [ ] Gather feedback: what brands are missing? what categories?

### 2.2 Affiliate monetization (replaces paid-download model)
- [ ] Research affiliate programmes for niche brands (Dainese, Rev'It, etc.)
- [ ] Add "Shop [Brand]" CTA on result card, linked with affiliate tag
- [ ] Track click-through rate as proxy for monetization potential

### 2.3 Traction gate — before any App Store work
Criteria to proceed to Phase 3 (native app):
- [ ] 500+ monthly active users (PWA sessions) sustained over 2 months
- [ ] Measurable affiliate click-through (>5% of conversions)
- [ ] User feedback confirms niche-brand gap is the real value (not just standard brands)

---

## Phase 3: Native App (blocked on Phase 2 traction gate)

Only start if Phase 2 traction criteria are met.

**Why native app**: better discoverability via App Store search once demand is proven; offline use; home screen presence beyond PWA.

**Not** a paid-download app. Monetisation via affiliate links in-app, same model as Phase 2.

### 3.1 App Store prerequisites
- [ ] Apple Developer account ($99/year — only pay once traction gate is met)
- [ ] Decide: React Native (single codebase iOS + Android) vs native Swift/Kotlin
- [ ] Full business case: unit economics, retention model, data maintenance plan

### 3.2 Core app
- [ ] Port PWA logic to native
- [ ] Profile sync (iCloud / Google account) — replaces localStorage
- [ ] Push notifications for price drops / size availability at linked retailers (stretch)

---

## Deferred (not in scope until Phase 3)

- Scrapers for automated size chart ingestion
- User accounts / server-side saved profiles
- More than ~15–20 brands
- Data scale / database
- Brand partnership / B2B licensing
