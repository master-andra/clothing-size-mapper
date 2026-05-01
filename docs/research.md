# Competitive Research — Clothing Size Conversion Tools

## Summary

Cross-brand clothing size conversion (i.e. "I wear size X in brand A — what size in brand B?") is a solved problem at the B2B/enterprise level but has no adequate standalone consumer tool, especially for niche or specialty brands.

## Tools Evaluated

### True Fit (truefit.com)
- **What it does**: Exactly the cross-brand conversion we want. Normalises product data from 20,000+ brands into a proprietary universal size, then maps shopper profiles across brands. "You wear M in Levi's → you need L in Patagonia."
- **Why it doesn't solve our problem**: B2B only. Embedded widget on retailer product pages. Not a standalone consumer app.
- **Verdict**: Proves the concept is valid and valuable at scale. The standalone consumer version does not exist. This is the gap we fill.

### LookSize (looksize.com)
- **What it does**: Hosts individual brand size charts for 3,500+ brands.
- **Key finding**: Has both Dainese and Seidensticker in their database — useful as a data reference when populating sizes.json.
- **Why it doesn't solve our problem**: Displays individual charts only. Does not do the conversion step (brand A size → body measurements → brand B size). User still has to read two charts and do the math manually.
- **Verdict**: Not a converter. Good data reference.

### SizeChartLab (sizechartlab.com)
- **What it does**: Free web tool. Does brand-to-brand conversion (pick brand A size → see brand B size).
- **Why it doesn't solve our problem**: Only ~20 mainstream brands (Zara, H&M, Gap, Nike, Adidas). No Dainese, Seidensticker, TM Lewin.
- **Verdict**: Closest consumer-facing equivalent but scoped entirely to fast fashion.

### WhatSize (whatsize.online)
- **What it does**: iOS app, $2.99 one-time. Converts between 8 brands using official size charts. Works offline.
- **Brands**: Nike, Zara, Adidas, H&M, Levi's, Gap, Uniqlo, ASOS.
- **Why it doesn't solve our problem**: 8 mainstream brands only. No specialty/niche coverage.
- **Business model note**: $2.99 at 30% Apple commission → ~$2.09 net. ~47 downloads to break even on year 1 developer fee. Weak economics.
- **Verdict**: Validates paid app demand. Not a competitor for our use case.

### SizeCharter (sizecharter.com)
- **What it does**: Input measurements → find size across brands. Free, no login.
- **Why it doesn't solve our problem**: Measurement-in → size-out only. Cannot do brand-to-brand (known size in brand A → size in brand B).
- **Verdict**: Wrong flow for our use case.

### SizeGo (App Store / Google Play)
- **What it does**: International standard conversion (US/UK/EU/JP/KR/CN).
- **Verdict**: Regional standards only, not brand-specific measurement-based conversion.

## The Gap

No standalone consumer tool exists that:
1. Accepts a known brand + size label as input (not raw measurements)
2. Translates via body measurements as the universal layer
3. Outputs the closest matching size in a target brand
4. Covers specialty/niche categories (motorcycle gear, formal dress shirts)

True Fit proves the concept works. The consumer-facing version of it, covering the brands real people actually wear, does not exist.

## Why the Gap Exists

True Fit went B2B because retailers pay to reduce returns — that's a clear, scalable revenue model. Consumer apps face two problems: (1) weak monetization for a free lookup utility, and (2) high data maintenance burden as brands update their size charts. Nobody has solved the consumer version sustainably yet.
