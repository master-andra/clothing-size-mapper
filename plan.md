# Plan

## Status: Phase 1 — PoC Setup

---

## Phase 1: Proof of Concept

Goal: a working personal tool that answers "I have Levi's 32/32 — what Dainese moto pants size?" with the underlying measurements shown.

### 1.1 Project setup (in progress)
- [x] Directory structure
- [x] CLAUDE.md
- [x] docs/ (research, decisions, architecture)
- [x] plan.md
- [ ] Git init + .gitignore
- [ ] package.json + Vitest
- [ ] Stub files (conversion.js, index.html, app.js, style.css)
- [ ] GitHub repo + Pages enabled

### 1.2 Data schema + seed data
- [ ] Finalise sizes.json schema (see docs/architecture.md)
- [ ] Enter Levi's bottoms data (32/30, 32/32, 32/34, 34/32, 34/34)
- [ ] Enter Dainese moto pants data
- [ ] Enter Seidensticker shirts data (collar 38–44)
- [ ] Enter TM Lewin shirts data

### 1.3 Conversion logic (TDD)
- [ ] Write tests for: exact match, closest match, between sizes, outside range, missing dimension
- [ ] Implement `getSizeFromLabel(brand, category, label)` → measurements
- [ ] Implement `findClosestSize(measurements, targetBrand, category)` → { size, deltas }
- [ ] All tests passing

### 1.4 Web app UI
- [ ] Category selector (bottoms / shirts / moto-bottoms)
- [ ] Source brand + size picker
- [ ] Target brand picker
- [ ] Results: recommended size + measurement table with deltas
- [ ] Mobile-friendly layout

### 1.5 Deploy
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Test on iPhone (Safari + Add to Home Screen)

---

## Phase 2: Product (blocked on PoC validation)

Do not start until Phase 1 is in daily use and clearly valuable.

**Required before any Phase 2 work**: complete business case. See `docs/decisions.md` for what that must cover.

Provisional direction: free app, brand partnership monetization.

---

## Deferred (not in scope for PoC)

- Scrapers for automated size chart ingestion
- User accounts / saved profiles
- More than ~6–10 brands
- Native iOS app
- Data scale / database
