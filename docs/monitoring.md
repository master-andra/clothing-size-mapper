# Monitoring & Traction Gate

This document explains how to set up analytics, what to measure, and when the Phase 2 traction gate is met.

---

## Analytics Setup (one-time, ~5 minutes)

We use **Umami Cloud** — free up to 100k events/month, privacy-first (no cookies, no consent banner needed), GDPR compliant.

1. Create a free account at https://umami.is
2. Click **Add Website** → enter `master-andra.github.io`
3. Copy the tracking script provided — it looks like:
   ```
   <script defer src="https://cloud.umami.is/script.js" data-website-id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"></script>
   ```
4. Open `index.html`, find the `<!-- Analytics:` comment block, and:
   - Replace `YOUR_WEBSITE_ID` with your actual website ID
   - Uncomment the `<script>` line
5. Commit and push — analytics will be live within minutes

---

## CI/CD Setup (one-time, ~2 minutes)

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs tests on every push and deploys only if they pass. To activate the deploy step:

1. Go to **GitHub → clothing-size-mapper → Settings → Pages**
2. Under **Source**, select **GitHub Actions** (switch away from "Deploy from a branch")
3. Save — done. Future pushes will: run tests → deploy if green, block deploy if red.

---

## What Is Tracked

| Event | What it means |
|---|---|
| Page view | A user opened the app |
| `conversion` event | User clicked Convert and got a result |
| `conversion.mode` | `unknown-unknown` / `known-unknown` / `known-known` — measures profile adoption |
| `conversion.category` | Which clothing category is most used (bottoms, shirts, moto-bottoms) |

---

## Key Metrics to Watch

### Monthly Active Users (MAU)
In the Umami dashboard: **Visitors** tab → set range to last 30 days → **Unique visitors** = MAU.

| Range | Interpretation |
|---|---|
| 0–50/month | Friends and personal use only — expected early on |
| 50–200/month | Organic discovery or a single forum post worked |
| 200–500/month | Growing; double down on community channels |
| **500+/month** | **Traction gate met → evaluate Phase 3 (native app)** |

### Conversion Rate (engagement quality)
`conversion events / page views`. A healthy engaged tool should be >30%. If much lower, the UI flow is losing people before they complete a conversion.

### Top Brands / Categories
In the **Events** tab → filter by event name `conversion` → inspect properties. This shows which brand pairs and categories are actually used — informs which data to expand first.

---

## Traction Gate Criteria (from plan.md Phase 2.3)

All three must be true before starting Phase 3 (native app):

- [ ] **500+ MAU** sustained for 2 consecutive months
- [ ] **Affiliate click-through >5%** (add affiliate links first — see plan.md Phase 2.2)
- [ ] User feedback confirms niche-brand gap is the real value (collect via a simple feedback form or forum responses)

---

## Monthly Review Checklist

Run this once a month:

1. Open Umami dashboard → last 30 days
2. Note **Unique visitors** (MAU) — compare to previous month
3. Note **conversion event count** — is engagement growing proportionally?
4. Check **top referrers** — identify which community channels are driving traffic
5. Check **top conversion.category values** — expand data for whichever is highest
6. Update `plan.md` with current MAU and any community feedback received
