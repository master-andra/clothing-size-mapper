# Clothing Size Mapper

Personal cross-brand clothing size converter. Body measurements (cm) are the universal translation layer between brand sizes.

## Quick Reference

| What | Where |
|---|---|
| Project plan & status | `plan.md` |
| Architecture & data schema | `docs/architecture.md` |
| Decision log (why things are the way they are) | `docs/decisions.md` |
| Competitive research | `docs/research.md` |
| Brand size data | `data/sizes.json` |
| Core conversion logic (pure JS, testable) | `app/conversion.js` |
| Web app entry point | `app/index.html` |
| Tests | `tests/` |

## Commands

```bash
# Install dependencies
npm install

# Run tests (TDD — run this before and after every change to conversion logic)
npm test

# Run tests in watch mode during development
npm run test:watch

# Deploy: push to main branch → GitHub Pages auto-deploys
git push origin main
```

## Stack

- Vanilla HTML/CSS/JS — no framework, no build step
- `data/sizes.json` — single source of truth for all brand data
- Vitest — unit tests for conversion logic
- GitHub Pages — hosting (free, phone-accessible via browser)

## Key Conventions

- `app/conversion.js` exports pure functions only — no DOM, no side effects. This is what the tests cover.
- `app/app.js` handles DOM and calls functions from `conversion.js`.
- All measurements in **cm**.
- Sizes are organised by **category first** (bottoms, shirts, moto-bottoms), then brand, then size label. Never compare across categories.
- When adding a new brand: add to `data/sizes.json`, run tests, verify no existing test breaks.

## Development Workflow

1. Write a failing test in `tests/` that describes the behaviour you want
2. Implement in `app/conversion.js` until the test passes
3. Update `data/sizes.json` with real brand data
4. Manually verify in the browser
5. Push to deploy

## Further Reading

- Architecture and data schema details: `docs/architecture.md`
- Why these decisions were made: `docs/decisions.md`
- What alternatives exist: `docs/research.md`
