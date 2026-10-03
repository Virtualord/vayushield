import { describe, expect, it } from 'vitest';
import { buildOfflineResult } from './fallback.js';

const assessment = {
  zone: { name: 'Govindpura', population: 36500 },
  score: 64,
  level: 'HIGH',
  effectivePM25: 112,
  category: 'Poor',
};

describe('deterministic offline explanation template', () => {
  it('builds the required English result shape from computed values', () => {
    const result = buildOfflineResult({ assessment, language: 'en' });

    expect(Object.keys(result)).toEqual([
      'summary', 'riskFactors', 'communityActions', 'advisoryMessage', 'caveat',
    ]);
    expect(result.summary).toContain('64 (high)');
    expect(result.riskFactors.join(' ')).toContain('112 µg/m³');
    expect(result.riskFactors.join(' ')).toContain('36500');
    expect(result.advisoryMessage).toContain('not medical advice');
  });

  it('builds Hindi strings without calculating new scores', () => {
    const result = buildOfflineResult({ assessment, language: 'hi' });

    expect(result.summary).toContain('64 (उच्च)');
    expect(result.riskFactors[1]).toContain('112 µg/m³');
    expect(result.communityActions[0]).toContain('स्थानीय');
    expect(result.caveat).toContain('आधिकारिक');
  });
});
