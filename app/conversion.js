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
