import { describe, expect, it, vi } from 'vitest';
import { planRequest } from './planRequest.js';
import { buildPlanPrompt } from './planPrompt.js';
import { isValidPlanBody, isValidPlanResult } from './requestValidation.js';

const makeAssessment = (id, score) => ({
  zone: {
    id, name: `Zone ${id}`, type: 'residential', lat: 23.2, lng: 77.4,
    population: 1200, basePM25: 20, basePM10: 30, baseWind: 4, vulnerability: 0.4,
    emissionMix: { traffic: 0.5, industry: 0.5 }, facilities: { schools: 1, hospitals: 1 }, dataSource: 'illustrative',
  },
  effectivePM25: 20, aqi: 33, category: 'Satisfactory', score, level: 'LOW',
  hazard: 0.2, exposure: 0.02, vulnerability: 0.4,
});

const rankedZones = [makeAssessment('one', 60), makeAssessment('two', 50), makeAssessment('three', 40)];
const validBody = {
  rankedZones,
  scenario: { windSpeed: 8, traffic: 'high', industry: 'low' },
  language: 'en',
  audience: 'resident',
};
const validResult = {
  priorityActions: [{ group: 'Schools', zoneId: 'one', action: 'Share public updates.' }],
  monitoringPlan: ['Review the supplied scenario.'],
  advisoryMessage: 'Follow local guidance. This is not medical advice.',
  caveat: 'Illustrative inputs only.',
};

describe('plan request validation and response', () => {
  it('accepts exactly three ranked computed zones with active scenario preferences', () => {
    expect(isValidPlanBody(validBody)).toBe(true);
    expect(isValidPlanBody({ ...validBody, rankedZones: rankedZones.slice(0, 2) })).toBe(false);
    expect(isValidPlanBody({ ...validBody, rankedZones: [...rankedZones].reverse() })).toBe(false);
  });

  it('validates the structured response against supplied group and zone identifiers', () => {
    expect(isValidPlanResult(validResult, rankedZones)).toBe(true);
    expect(isValidPlanResult({ ...validResult, priorityActions: [{ ...validResult.priorityActions[0], zoneId: 'unknown' }] }, rankedZones)).toBe(false);
    expect(isValidPlanResult({ ...validResult, extra: 'value' }, rankedZones)).toBe(false);
  });

  it('uses a deterministic offline plan that includes the active scenario', async () => {
    const planWithGemini = vi.fn();
    const outcome = await planRequest(validBody, { apiKey: '', planWithGemini });
    expect(outcome.status).toBe(200);
    expect(outcome.payload.source).toBe('offline-template');
    expect(outcome.payload.result.priorityActions[0].zoneId).toBe('one');
    expect(outcome.payload.result.monitoringPlan[0]).toContain('wind 8 km/h, traffic high, industry low');
    expect(planWithGemini).not.toHaveBeenCalled();
  });

  it('sends scenario and ranked engine inputs to Gemini and falls back on invalid output', async () => {
    const planWithGemini = vi.fn().mockResolvedValue(validResult);
    await expect(planRequest(validBody, { apiKey: 'configured', planWithGemini })).resolves.toEqual({
      status: 200, payload: { result: validResult, source: 'gemini' },
    });
    expect(planWithGemini.mock.calls[0][0]).toContain('"windSpeed": 8');
    expect(planWithGemini.mock.calls[0][0]).toContain('"score": 60');

    planWithGemini.mockResolvedValue({ ...validResult, advisoryMessage: '' });
    const fallback = await planRequest(validBody, { apiKey: 'configured', planWithGemini });
    expect(fallback.payload.source).toBe('offline-template');
  });

  it('returns 400 on malformed input without calling Gemini', async () => {
    const planWithGemini = vi.fn();
    const outcome = await planRequest({ ...validBody, audience: 'other' }, { apiKey: 'configured', planWithGemini });
    expect(outcome).toEqual({ status: 400, payload: { error: 'Invalid request body' } });
    expect(planWithGemini).not.toHaveBeenCalled();
  });

  it('builds a guarded prompt with language and audience', () => {
    const prompt = buildPlanPrompt({ ...validBody, language: 'hi', audience: 'authority' });
    expect(prompt).toContain('Hindi (hi)');
    expect(prompt).toContain('Audience: authority');
    expect(prompt).toContain('Do not calculate, change, or invent scores');
  });
});
