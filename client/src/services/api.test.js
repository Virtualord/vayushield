import { afterEach, describe, expect, it, vi } from 'vitest';
import { analyzeZone } from './api.js';

afterEach(() => vi.unstubAllGlobals());

const assessment = { score: 44, level: 'MODERATE', zone: { id: 'zone-a' } };
const scenario = { windSpeed: 8, traffic: 'high', industry: 'low' };
const payload = {
  result: {
    summary: 'Summary',
    riskFactors: ['Factor'],
    communityActions: ['Action'],
    advisoryMessage: 'General precautions only.',
    caveat: 'Illustrative inputs.',
  },
  source: 'offline-template',
};

describe('analyzeZone API client', () => {
  it('posts only the assessment, scenario, language, and audience', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => payload });
    vi.stubGlobal('fetch', fetch);

    await expect(analyzeZone(assessment, scenario, 'hi', 'resident')).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessment, scenario, language: 'hi', audience: 'resident' }),
    });
    expect(fetch.mock.calls[0][1].body).not.toContain('GEMINI_API_KEY');
  });

  it('accepts the Gemini source response', async () => {
    const geminiPayload = { ...payload, source: 'gemini' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => geminiPayload }));
    await expect(analyzeZone(assessment, scenario, 'en', 'authority')).resolves.toEqual(geminiPayload);
  });

  it('returns a safe error for request and server failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network details')));
    await expect(analyzeZone(assessment, scenario, 'en', 'authority')).rejects.toThrow(
      'Could not reach the analysis service. Try again.',
    );

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(analyzeZone(assessment, scenario, 'en', 'authority')).rejects.toThrow(
      'The analysis request could not be completed.',
    );
  });
});
