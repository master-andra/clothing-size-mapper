# Architecture

## System Overview

```
sizes.json   ──┐
                ├──►  conversion.js  ──►  app.js  ──►  index.html
profile.json ──┘     (pure logic)        (DOM)         (UI)
(personal)               │
                       tests/
```

- `sizes.json` — brand size chart data. Objective, shared across all users.
- `profile.json` — template only; runtime profile lives in `localStorage`.
- `conversion.js` — pure JS module, no DOM, no side effects. Fully testable.
- `app.js` — browser glue: loads JSON, wires UI events, renders results.
- `index.html` — entry point. No build step.

---

## Core Design Principle

**Body measurements (cm) are the single universal translation layer.**

Every size in every brand maps to body measurements. The algorithm then finds the closest body-measurement match in the target brand. This means:

- No pairwise brand mappings. Adding brand #1000 requires no changes to existing data.
- No measurement-method hacks at query time. If a brand measures differently, convert once at data entry and store the body measurement. The algorithm never needs to know how it was derived.
- Cross-brand conversion is automatic for any two brands that share at least one comparable body dimension.

**Rule**: everything stored in `sizes.json` must be a body measurement in cm. If a brand publishes garment measurements or uses a non-standard method (e.g. sleeve from centre-back instead of shoulder seam), convert to the standard body measurement at data entry and document it in `notes`.

---

## Data Schema — Target Architecture

The current schema organises brands inside categories. This creates silos: brands locked into one category cannot be compared across categories. At scale (thousands of brands), this is unmaintainable — every reference brand would need to be duplicated into every relevant category.

**Target schema**: brands are top-level. They declare which dimensions they publish. Comparison is based on shared dimensions between any two brands — not on category membership.

```json
{
  "dimensions": {
    "waist":  { "description": "Body circumference at natural waist, cm" },
    "hip":    { "description": "Body circumference at fullest point of seat, cm" },
    "inseam": { "description": "Inner leg, crotch to floor, cm" },
    "collar": { "description": "Neck circumference, cm" },
    "chest":  { "description": "Body circumference at fullest point of chest, cm" },
    "sleeve": { "description": "Shoulder seam to wrist, cm — standard body measurement" }
  },
  "categories": {
    "bottoms":      { "label": "Trousers & Jeans",      "dimensions": ["waist", "hip", "inseam"] },
    "shirts":       { "label": "Dress Shirts",           "dimensions": ["collar", "chest", "sleeve"] },
    "moto-bottoms": { "label": "Motorcycle Trousers",    "dimensions": ["waist", "hip", "inseam"] }
  },
  "brands": {
    "levis": {
      "name": "Levi's",
      "categories": ["bottoms", "moto-bottoms"],
      "last_verified": "2026-05",
      "source": "https://www.levi.com/DE/en/info/sizechart",
      "notes": "Regular fit. Label format: waist(in)/inseam(in), converted to cm.",
      "sizes": {
        "32/32": { "waist": 81.3, "hip": 97.8, "inseam": 81.3 }
      }
    },
    "dainese": {
      "name": "Dainese",
      "categories": ["moto-bottoms"],
      "last_verified": "2026-05",
      "source": "https://hfxmotorsports.com/pages/dainese-sizing-charts",
      "notes": "Ranges published per size; midpoints stored. Size up if between sizes.",
      "sizes": {
        "48": { "waist": 84, "hip": 98, "inseam": 81.0 }
      }
    },
    "seidensticker": {
      "name": "Seidensticker",
      "categories": ["shirts"],
      "last_verified": "2026-05",
      "source": "https://www.seidensticker.com/eu/en/simple_content/size-tables",
      "notes": "Slim fit. Sleeve = shoulder seam to cuff (standard body measurement).",
      "sizes": {
        "39": { "collar": 39, "sleeve": 63 }
      }
    },
    "tmlewin": {
      "name": "TM Lewin",
      "categories": ["shirts"],
      "last_verified": "2026-05",
      "source": "https://tmlewin.co.uk/pages/size-guides",
      "notes": "Label: collar(in)/sleeve(in). Collar converted to cm. Sleeve published as centre-back to cuff — subtract ~19cm shoulder span to get standard shoulder-seam measurement before storing.",
      "sizes": {
        "15.5/33": { "collar": 39.4, "sleeve": 65 }
      }
    }
  }
}
```

Key differences from current schema:
1. `brands` is top-level. No brand duplication across categories.
2. A brand declares `"categories": [...]` — this controls which UI groups it appears in.
3. `dimensions` is a top-level glossary defining the canonical body measurement for each key.
4. Measurement normalization happens at data entry; the algorithm is dimension-agnostic.

---

## Current Schema (v1 — in use)

The current schema has brands nested inside categories. It works for the initial brand set but has two known limitations:

1. **Brand duplication**: a brand that belongs to multiple categories must have its data duplicated (e.g. Levi's currently exists in both `bottoms` and `moto-bottoms`).
2. **Measurement normalization debt**: some brands' sleeve measurements have not yet been normalized to the standard body measurement. These need converting at data entry before sleeve can be used as a comparison dimension.

Migration to the target schema is planned before significant brand expansion (see plan.md step 1.6).

---

## Conversion Algorithm

Implemented in `app/conversion.js`.

### Three conversion modes

`resolveConversion(data, profile, category, sourceBrand, sourceLabel, targetBrand)`

**Mode 1 — known → known** (most reliable):
Both brands have a confirmed size in the profile. Returns direct comparison with deltas. Labelled "based on your confirmed sizes."

**Mode 2 — known → unknown**:
Source brand confirmed in profile, target is not. Derives measurements from confirmed source, runs algorithm for target.

**Mode 3 — unknown → unknown**:
Pure algorithm from size charts. Labelled "based on size charts only — verify before buying."

### Step 1: Source size → body measurements

```
getSizeFromLabel(data, category, brandKey, sizeLabel)
  → { waist: 81, hip: 97, inseam: 81 }  |  null
```

### Step 2: Body measurements → closest target size

```
findClosestSize(data, category, measurements, targetBrandKey)
  → {
      size: "50",
      ties: ["50"],          // all size labels at the same score (e.g. same collar, multiple sleeves)
      measurements: { ... },
      deltas: { waist: +1, hip: +3, inseam: 0 },
      score: number,
      missingDimensions: []  // dimensions source has but target doesn't publish
    }
  | null
```

Distance: Euclidean over shared dimensions only.
`score = Σ (source[d] - target[d])²`

Ties (same score) are returned together — e.g. when a brand has identical measurements across sleeve-length variants. The UI surfaces all tied options so the user can choose.

### Step 3: UI renders result + deltas

Recommended size, mode badge, measurement table with delta colour coding, sleeve variant options if ties exist.

---

## File Structure

```
clothing_size_mapper/
├── CLAUDE.md               # Claude Code instructions
├── plan.md                 # Phased work plan + current status
├── package.json
├── .gitignore
├── manifest.json           # PWA manifest
├── index.html              # App entry point
├── icons/
│   └── icon.svg
├── docs/
│   ├── architecture.md     # This file
│   ├── decisions.md
│   ├── research.md
│   ├── monitoring.md       # Analytics setup + traction gate
│   └── idea-validations/
│       └── cross-brand-clothing-size-converter.md
├── data/
│   ├── sizes.json          # Brand size data
│   └── profile.json        # Schema template (runtime profile in localStorage)
├── app/
│   ├── conversion.js       # Pure conversion logic (ES module)
│   ├── app.js              # DOM + UI logic
│   └── style.css
└── tests/
    └── conversion.test.js
```
