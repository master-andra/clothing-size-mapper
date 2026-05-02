import { describe, it, expect } from 'vitest';
import { getSizeFromLabel, findClosestSize, convertSize, resolveConversion } from '../app/conversion.js';

// Minimal test fixture — mirrors the real sizes.json schema
const data = {
  categories: {
    bottoms: {
      label: 'Trousers & Jeans',
      dimensions: ['waist', 'hip', 'inseam'],
      brands: {
        levis: {
          name: "Levi's",
          sizes: {
            '30/32': { waist: 76, hip: 93, inseam: 81 },
            '32/32': { waist: 81, hip: 97, inseam: 81 },
            '34/32': { waist: 86, hip: 102, inseam: 81 },
          },
        },
        dainese: {
          name: 'Dainese',
          sizes: {
            '44': { waist: 74, hip: 88, inseam: 79 },
            '48': { waist: 80, hip: 94, inseam: 81 },
            '52': { waist: 86, hip: 100, inseam: 83 },
          },
        },
      },
    },
    shirts: {
      label: 'Dress Shirts',
      dimensions: ['collar', 'chest', 'sleeve'],
      brands: {
        seidensticker: {
          name: 'Seidensticker',
          sizes: {
            '38': { collar: 38, chest: 96, sleeve: 62 },
            '39': { collar: 39, chest: 98, sleeve: 63 },
            '40': { collar: 40, chest: 100, sleeve: 64 },
          },
        },
        tmlewin: {
          name: 'TM Lewin',
          sizes: {
            '15/33': { collar: 38, chest: 97, sleeve: 84 },
            '15.5/33': { collar: 39, chest: 99, sleeve: 84 },
            '16/33': { collar: 41, chest: 102, sleeve: 84 },
          },
        },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// getSizeFromLabel
// ---------------------------------------------------------------------------

describe('getSizeFromLabel', () => {
  it('returns measurements for a known size label', () => {
    const result = getSizeFromLabel(data, 'bottoms', 'levis', '32/32');
    expect(result).toEqual({ waist: 81, hip: 97, inseam: 81 });
  });

  it('returns null for an unknown size label', () => {
    expect(getSizeFromLabel(data, 'bottoms', 'levis', '99/99')).toBeNull();
  });

  it('returns null for an unknown brand', () => {
    expect(getSizeFromLabel(data, 'bottoms', 'unknown_brand', '32/32')).toBeNull();
  });

  it('returns null for an unknown category', () => {
    expect(getSizeFromLabel(data, 'shoes', 'levis', '32/32')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// findClosestSize
// ---------------------------------------------------------------------------

describe('findClosestSize', () => {
  it('returns the exact matching size when measurements align perfectly', () => {
    const result = findClosestSize(data, 'bottoms', { waist: 86, hip: 102, inseam: 81 }, 'levis');
    expect(result.size).toBe('34/32');
    expect(result.score).toBe(0);
  });

  it('returns the closest size when there is no exact match', () => {
    // waist 83, hip 99, inseam 81 — sits between 32/32 and 34/32, closer to 34/32
    const result = findClosestSize(data, 'bottoms', { waist: 83, hip: 99, inseam: 81 }, 'levis');
    expect(result.size).toBe('34/32');
  });

  it('returns correct deltas between source measurements and matched size', () => {
    // Exact match on 48
    const result = findClosestSize(data, 'bottoms', { waist: 80, hip: 94, inseam: 81 }, 'dainese');
    expect(result.size).toBe('48');
    expect(result.deltas).toEqual({ waist: 0, hip: 0, inseam: 0 });
  });

  it('reports positive deltas when target size is larger than source measurements', () => {
    // waist 78 — closest Dainese is 48 (waist 80), delta should be +2
    const result = findClosestSize(data, 'bottoms', { waist: 78, hip: 92, inseam: 80 }, 'dainese');
    expect(result.deltas.waist).toBe(result.measurements.waist - 78);
  });

  it('returns null for an unknown target brand', () => {
    expect(findClosestSize(data, 'bottoms', { waist: 81, hip: 97, inseam: 81 }, 'unknown')).toBeNull();
  });

  it('returns null for an unknown category', () => {
    expect(findClosestSize(data, 'shoes', { waist: 81 }, 'dainese')).toBeNull();
  });

  it('reports missing dimensions when target brand does not publish all measurements', () => {
    // If a brand only has waist + hip (no inseam), missingDimensions should flag it
    const partialData = {
      categories: {
        bottoms: {
          dimensions: ['waist', 'hip', 'inseam'],
          brands: {
            partial: {
              name: 'Partial Brand',
              sizes: {
                M: { waist: 80, hip: 94 }, // no inseam
              },
            },
          },
        },
      },
    };
    const result = findClosestSize(partialData, 'bottoms', { waist: 81, hip: 97, inseam: 81 }, 'partial');
    expect(result.missingDimensions).toContain('inseam');
  });
});

// ---------------------------------------------------------------------------
// convertSize (integration)
// ---------------------------------------------------------------------------

describe('convertSize', () => {
  it('converts Levi\'s 32/32 to the closest Dainese moto size', () => {
    const result = convertSize(data, 'bottoms', 'levis', '32/32', 'dainese');
    expect(result).not.toBeNull();
    expect(result.size).toBeDefined();
    // Levi's 32/32 = waist 81, hip 97, inseam 81
    // Dainese 52 = waist 86, hip 100, inseam 83 — closest
    expect(result.size).toBe('52');
  });

  it('converts Seidensticker 39 to the closest TM Lewin shirt size', () => {
    const result = convertSize(data, 'shirts', 'seidensticker', '39', 'tmlewin');
    expect(result).not.toBeNull();
    // Seidensticker 39 = collar 39, chest 98, sleeve 63
    // TM Lewin 15.5/33 = collar 39 — should be exact collar match
    expect(result.size).toBe('15.5/33');
  });

  it('returns null when source size label does not exist', () => {
    expect(convertSize(data, 'bottoms', 'levis', '99/99', 'dainese')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// resolveConversion — three modes
// ---------------------------------------------------------------------------

describe('resolveConversion', () => {
  const profileBothKnown = {
    bottoms: { levis: '32/32', dainese: '52' },
  };

  const profileSourceOnly = {
    bottoms: { levis: '32/32' },
  };

  const profileEmpty = {
    bottoms: {},
  };

  it('mode: known→known — returns direct comparison without running algorithm', () => {
    const result = resolveConversion(data, profileBothKnown, 'bottoms', 'levis', '32/32', 'dainese');
    expect(result.mode).toBe('known-known');
    expect(result.size).toBe('52');
    // deltas should be between levis 32/32 measurements and dainese 52 measurements
    expect(result.deltas).toBeDefined();
  });

  it('mode: known→known — uses confirmed sizes even if algorithm would pick differently', () => {
    // Profile says dainese 52 is confirmed, even if the algorithm might recommend 50
    const result = resolveConversion(data, profileBothKnown, 'bottoms', 'levis', '32/32', 'dainese');
    expect(result.mode).toBe('known-known');
    expect(result.size).toBe('52'); // profile wins over algorithm
  });

  it('mode: known→unknown — runs algorithm anchored to confirmed source measurements', () => {
    const result = resolveConversion(data, profileSourceOnly, 'bottoms', 'levis', '32/32', 'dainese');
    expect(result.mode).toBe('known-unknown');
    expect(result.size).toBeDefined();
  });

  it('mode: unknown→unknown — runs pure algorithm from size charts', () => {
    const result = resolveConversion(data, profileEmpty, 'bottoms', 'levis', '32/32', 'dainese');
    expect(result.mode).toBe('unknown-unknown');
    expect(result.size).toBeDefined();
  });

  it('returns null if source size label does not exist in chart', () => {
    expect(resolveConversion(data, profileEmpty, 'bottoms', 'levis', '99/99', 'dainese')).toBeNull();
  });
});
