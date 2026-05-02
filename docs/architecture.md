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
- `profile.json` — the user's confirmed sizes per brand/category. Personal calibration layer.
- `conversion.js` — pure JS module, no DOM, no side effects. Fully testable.
- `app.js` — browser glue: loads both JSON files, wires UI events, renders results.
- `index.html` — entry point. No build step.

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

## Personal Profile (`data/profile.json`)

Stores the user's confirmed sizes — sizes they actually own and know fit well. This is more reliable than the algorithmic match because it's ground truth.

```json
{
  "bottoms": {
    "levis": "32/32",
    "dainese": "50"
  },
  "shirts": {
    "seidensticker": "39",
    "tmlewin": "15.5/33"
  },
  "moto-bottoms": {
    "dainese": "50"
  }
}
```

Profile is edited manually in v1 (or via a UI toggle). Not synced to any server — lives in the repo alongside `sizes.json`.

---

## Conversion Algorithm

Implemented in `app/conversion.js`.

### Three conversion modes

`resolveConversion(data, profile, category, sourceBrand, sourceLabel, targetBrand)`

**Mode 1 — known → known** (most reliable):
Both brands have a confirmed size in `profile.json`.
- Derive measurements from both confirmed sizes
- Return direct comparison with deltas
- Label result as "based on your confirmed sizes"

**Mode 2 — known → unknown**:
Source brand has a confirmed size in `profile.json`, target does not.
- Derive measurements from confirmed source size
- Run algorithm to find closest target size
- Label result as "based on your confirmed [brand] size, algorithm for [target]"

**Mode 3 — unknown → unknown**:
Neither brand in profile.
- Pure algorithm from size charts
- Label result as "based on size charts only — verify before buying"

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

Show the recommended size, the mode (confirmed / partial / algorithm), and a table of each measurement: source value, target value, delta (±cm). User can judge from the delta whether to size up or down.

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
