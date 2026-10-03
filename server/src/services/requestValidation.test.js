import { describe, expect, it } from 'vitest';
import { isValidAnalyzeBody } from './requestValidation.js';

const validBody = {
  assessment: {
    zone: {
      id: 'demo', name: 'Demo', type: 'residential', lat: 23.2, lng: 77.4,
      population: 1200, basePM25: 20, basePM10: 30, baseWind: 4,
      vulnerability: 0.4, emissionMix: { traffic: 0.5, industry: 0.5 },
      facilities: { schools: 1, hospitals: 1 }, dataSource: 'illustrative',
    },
    effectivePM25: 20, aqi: 33, category: 'Satisfactory', score: 20,
    level: 'LOW', hazard: 0.2, exposure: 0.02, vulnerability: 0.4,
  },
  scenario: { windSpeed: null, traffic: 'normal', industry: 'normal' },
  language: 'en',
  audience: 'resident',
};

describe('analyze request validation', () => {
  it('accepts a complete computed assessment and supported preferences', () => {
    expect(isValidAnalyzeBody(validBody)).toBe(true);
  });

  it('rejects missing fields, invalid enums, inconsistent zone data and extra keys', () => {
    expect(isValidAnalyzeBody({ ...validBody, audience: undefined })).toBe(false);
    expect(isValidAnalyzeBody({ ...validBody, language: 'fr' })).toBe(false);
    expect(isValidAnalyzeBody({ ...validBody, assessment: { ...validBody.assessment, score: NaN } })).toBe(false);
    expect(isValidAnalyzeBody({ ...validBody, extra: true })).toBe(false);
    expect(isValidAnalyzeBody({
      ...validBody,
      assessment: { ...validBody.assessment, zone: { ...validBody.assessment.zone, emissionMix: { traffic: 0.4, industry: 0.4 } } },
    })).toBe(false);
  });
});
