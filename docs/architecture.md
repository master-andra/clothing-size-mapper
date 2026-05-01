# Architecture

## System Overview

```
sizes.json  ──►  conversion.js  ──►  app.js  ──►  index.html
(data)           (pure logic)        (DOM)         (UI)
                      │
                   tests/
```

- `sizes.json` is the single source of truth. All brand + size + measurement data lives here.
- `conversion.js` is a pure JS module — no DOM, no side effects. Takes data in, returns results. Fully testable.
- `app.js` handles the browser: reads `sizes.json`, wires up UI events, calls `conversion.js`, renders results.
- `index.html` is the entry point. No build step — loads files directly.

---

## Data Schema (`data/sizes.json`)

Organised by category first. This prevents meaningless cross-category comparisons (shirt collar ≠ trouser waist).

```json
{
  "categories": {
    "bottoms": {
      "label": "Trousers & Jeans",
      "dimensions": ["waist", "hip", "inseam"],
      "brands": {
        "levis": {
          "name": "Levi's",
          "source": "https://www.levi.com/GB/en_GB/size-guide",
          "last_verified": "2026-05",
          "notes": "Waist and inseam in inches on label, converted to cm here. Regular fit.",
          "sizes": {
            "30/30": { "waist": 76, "hip": 93, "inseam": 76 },
            "32/30": { "waist": 81, "hip": 97, "inseam": 76 },
            "32/32": { "waist": 81, "hip": 97, "inseam": 81 }
          }
        }
      }
    },
    "shirts": {
      "label": "Dress Shirts",
      "dimensions": ["collar", "chest", "sleeve"],
      "brands": {
        "seidensticker": {
          "name": "Seidensticker",
          "source": "https://www.seidensticker.com/eu/en/simple_content/size-tables",
          "last_verified": "2026-05",
          "notes": "Collar is neck circumference in cm.",
          "sizes": {
            "38": { "collar": 38, "chest": 96, "sleeve": 62 },
            "39": { "collar": 39, "chest": 98, "sleeve": 63 }
          }
        }
      }
    },
    "moto-bottoms": {
      "label": "Motorcycle Trousers",
      "dimensions": ["waist", "hip", "inseam"],
      "brands": {
        "dainese": {
          "name": "Dainese",
          "source": "https://www.dainese.com/us/en/sports/motorbike/size-guide.html",
          "last_verified": "2026-05",
          "notes": "Dainese sizes map directly to body measurements. Size up if between measurements.",
          "sizes": {
            "44": { "waist": 74, "hip": 88, "inseam": 79 },
            "46": { "waist": 76, "hip": 90, "inseam": 80 },
            "48": { "waist": 80, "hip": 94, "inseam": 81 }
          }
        }
      }
    }
  }
}
```

**Schema rules:**
- All measurements in cm (integers).
- `dimensions` on the category defines which keys are expected in each size object.
- `source` is the URL of the official size guide used.
- `last_verified` is YYYY-MM. Flags when data may be stale.
- `notes` captures anything non-obvious about how a brand measures (e.g. "low-rise, waist measured at hip").
- Size labels are strings, exactly as printed on the garment.

---

## Conversion Algorithm

Implemented in `app/conversion.js`.

### Step 1: Source size → body measurements

```
getSizeFromLabel(data, category, brandKey, sizeLabel)
  → { waist: 81, hip: 97, inseam: 81 }  |  null if not found
```

### Step 2: Body measurements → closest target size

```
findClosestSize(data, category, measurements, targetBrandKey)
  → {
      size: "50",
      measurements: { waist: 80, hip: 94, inseam: 81 },
      deltas: { waist: +1, hip: +3, inseam: 0 },
      score: number   // sum of squared differences, lower = closer
    }
  | null if brand/category not found
```

Distance formula: Euclidean over shared dimensions only.
`score = Σ (sourceMeasurement[d] - targetMeasurement[d])²` for each dimension `d`.

Shared dimensions only: if source has `{ waist, hip, inseam }` and target only publishes `{ waist, hip }`, compute distance over `{ waist, hip }` and note the missing dimension in the result.

### Step 3: UI renders result + deltas

Show the recommended size and a table of each measurement: source value, target value, delta (±cm). User can judge from the delta whether to size up or down.

---

## File Structure

```
clothing_size_mapper/
├── CLAUDE.md               # Claude Code instructions (concise, links here)
├── plan.md                 # Phased work plan + current status
├── package.json            # Vitest test runner
├── .gitignore
├── docs/
│   ├── architecture.md     # This file
│   ├── decisions.md        # Why decisions were made
│   └── research.md         # Competitive landscape
├── data/
│   └── sizes.json          # All brand size data
├── app/
│   ├── index.html          # Entry point
│   ├── conversion.js       # Pure conversion logic (ES module)
│   ├── app.js              # DOM + UI logic
│   └── style.css           # Styles
├── tests/
│   └── conversion.test.js  # Vitest unit tests
└── scrapers/               # Deferred — future brand data ingestion
```
