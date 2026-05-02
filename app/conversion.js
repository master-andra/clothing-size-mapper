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
  // TODO: implement
  return null;
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
  // TODO: implement
  return null;
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
  // TODO: implement
  return null;
}
