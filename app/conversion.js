/**
 * Pure conversion logic — no DOM, no side effects.
 * All functions take the full data object as first argument.
 * All measurements in cm.
 */

/**
 * Look up a size label in a brand's size table and return its body measurements.
 *
 * @param {object} data     - Full sizes.json content
 * @param {string} category - e.g. "bottoms"
 * @param {string} brandKey - e.g. "levis"
 * @param {string} sizeLabel - e.g. "32/32"
 * @returns {{ [dimension: string]: number } | null}
 */
export function getSizeFromLabel(data, category, brandKey, sizeLabel) {
  const size = data.categories?.[category]?.brands?.[brandKey]?.sizes?.[sizeLabel];
  return size ?? null;
}

/**
 * Given a set of body measurements, find the closest matching size in a target brand.
 *
 * @param {object} data          - Full sizes.json content
 * @param {string} category      - e.g. "bottoms"
 * @param {{ [dimension: string]: number }} measurements - e.g. { waist: 81, hip: 97, inseam: 81 }
 * @param {string} targetBrandKey - e.g. "dainese"
 * @returns {{
 *   size: string,
 *   measurements: object,
 *   deltas: object,
 *   score: number,
 *   missingDimensions: string[]
 * } | null}
 */
export function findClosestSize(data, category, measurements, targetBrandKey) {
  const cat = data.categories?.[category];
  if (!cat) return null;
  const brand = cat.brands?.[targetBrandKey];
  if (!brand) return null;

  const categoryDimensions = cat.dimensions ?? [];

  let bestLabel = null;
  let bestScore = Infinity;
  let bestMeasurements = null;

  for (const [label, targetMeasurements] of Object.entries(brand.sizes)) {
    const sharedDims = categoryDimensions.filter(
      d => measurements[d] != null && targetMeasurements[d] != null
    );
    if (sharedDims.length === 0) continue;

    const score = sharedDims.reduce((sum, d) => {
      const diff = measurements[d] - targetMeasurements[d];
      return sum + diff * diff;
    }, 0);

    if (score < bestScore) {
      bestScore = score;
      bestLabel = label;
      bestMeasurements = targetMeasurements;
    }
  }

  if (!bestLabel) return null;

  const sharedDims = categoryDimensions.filter(
    d => measurements[d] != null && bestMeasurements[d] != null
  );
  const deltas = {};
  for (const d of sharedDims) {
    deltas[d] = bestMeasurements[d] - measurements[d];
  }

  const missingDimensions = categoryDimensions.filter(
    d => measurements[d] != null && bestMeasurements[d] == null
  );

  // Collect all size labels that share the same best score (ties).
  // Ties occur when a brand has variants (e.g. same collar, multiple sleeve lengths)
  // that are indistinguishable on the compared dimensions.
  const ties = Object.entries(brand.sizes)
    .filter(([, m]) => {
      const shared = categoryDimensions.filter(d => measurements[d] != null && m[d] != null);
      if (shared.length === 0) return false;
      const score = shared.reduce((sum, d) => {
        const diff = measurements[d] - m[d];
        return sum + diff * diff;
      }, 0);
      return score === bestScore;
    })
    .map(([label]) => label);

  return {
    size: bestLabel,
    ties,
    measurements: bestMeasurements,
    deltas,
    score: bestScore,
    missingDimensions,
  };
}

/**
 * Convenience: combine getSizeFromLabel + findClosestSize into one call.
 *
 * @returns {{ size, measurements, deltas, score, missingDimensions } | null}
 */
export function convertSize(data, category, sourceBrandKey, sizeLabel, targetBrandKey) {
  const measurements = getSizeFromLabel(data, category, sourceBrandKey, sizeLabel);
  if (!measurements) return null;
  return findClosestSize(data, category, measurements, targetBrandKey);
}

/**
 * Full conversion with personal profile awareness.
 *
 * Mode "known-known":    both brands have confirmed sizes in profile → direct comparison
 * Mode "known-unknown":  source brand confirmed in profile → algorithm for target
 * Mode "unknown-unknown": neither in profile → pure algorithm
 *
 * @param {object} data        - Full sizes.json content
 * @param {object} profile     - Full profile.json content
 * @param {string} category    - e.g. "bottoms"
 * @param {string} sourceBrand - e.g. "levis"
 * @param {string} sourceLabel - e.g. "32/32"
 * @param {string} targetBrand - e.g. "dainese"
 * @returns {{
 *   mode: "known-known" | "known-unknown" | "unknown-unknown",
 *   size: string,
 *   measurements: object,
 *   deltas: object,
 *   score: number | null,
 *   missingDimensions: string[]
 * } | null}
 */
export function resolveConversion(data, profile, category, sourceBrand, sourceLabel, targetBrand) {
  const sourceMeasurements = getSizeFromLabel(data, category, sourceBrand, sourceLabel);
  if (!sourceMeasurements) return null;

  const knownSource = profile[category]?.[sourceBrand] != null;
  const knownTarget = profile[category]?.[targetBrand] != null;

  if (knownSource && knownTarget) {
    const confirmedTargetLabel = profile[category][targetBrand];
    const targetMeasurements = getSizeFromLabel(data, category, targetBrand, confirmedTargetLabel);
    if (!targetMeasurements) return null;

    const categoryDimensions = data.categories[category]?.dimensions ?? [];
    const sharedDims = categoryDimensions.filter(
      d => sourceMeasurements[d] != null && targetMeasurements[d] != null
    );
    const deltas = {};
    for (const d of sharedDims) {
      deltas[d] = targetMeasurements[d] - sourceMeasurements[d];
    }
    const missingDimensions = categoryDimensions.filter(
      d => sourceMeasurements[d] != null && targetMeasurements[d] == null
    );

    return {
      mode: 'known-known',
      size: confirmedTargetLabel,
      measurements: targetMeasurements,
      deltas,
      score: null,
      missingDimensions,
    };
  }

  const algorithmResult = findClosestSize(data, category, sourceMeasurements, targetBrand);
  if (!algorithmResult) return null;

  return {
    mode: knownSource ? 'known-unknown' : 'unknown-unknown',
    ...algorithmResult,
  };
}
