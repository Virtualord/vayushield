import { describe, expect, it, vi } from 'vitest';
import { analyzeRequest } from './services/analyzeRequest.js';

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

const validResult = {
  summary: 'Short explanation.',
  riskFactors: ['Supplied input factor.'],
  communityActions: ['Follow public guidance.'],
  advisoryMessage: 'General precautions only.',
  caveat: 'Illustrative inputs.',
};

describe('analyze request handler', () => {
  it('returns a deterministic fallback without a key', async () => {
    const analyzeWithGemini = vi.fn();
    const outcome = await analyzeRequest(validBody, { apiKey: '', analyzeWithGemini });
    expect(outcome.status).toBe(200);
    expect(outcome.payload.source).toBe('offline-template');
    expect(outcome.payload.result.summary).toContain('20 (low)');
    expect(analyzeWithGemini).not.toHaveBeenCalled();
  });

  it('returns a validated Gemini result when configured', async () => {
    const analyzeWithGemini = vi.fn().mockResolvedValue(validResult);
    const outcome = await analyzeRequest(validBody, { apiKey: 'test-key', analyzeWithGemini });
    expect(outcome).toEqual({ status: 200, payload: { result: validResult, source: 'gemini' } });
  });

  it('returns 400 for malformed bodies without calling Gemini', async () => {
    const analyzeWithGemini = vi.fn();
    const outcome = await analyzeRequest({ ...validBody, language: 'fr' }, {
      apiKey: 'test-key', analyzeWithGemini,
    });
    expect(outcome).toEqual({ status: 400, payload: { error: 'Invalid request body' } });
    expect(analyzeWithGemini).not.toHaveBeenCalled();
  });
});
