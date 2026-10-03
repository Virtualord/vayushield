import { beforeEach, describe, expect, it, vi } from 'vitest';

const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));

vi.mock('@google/genai', () => ({
  Type: { OBJECT: 'OBJECT', STRING: 'STRING', ARRAY: 'ARRAY' },
  GoogleGenAI: vi.fn(function GoogleGenAI() {
    this.models = { generateContent };
  }),
}));

import { GEMINI_TIMEOUT_MS, generateActionPlan, generateDayPlan, generateExplanation } from './gemini.js';
import { explainResponseSchema, isValidExplainResult } from './explainSchema.js';
import { planResponseSchema } from './planSchema.js';
import { planDayResponseSchema } from './dayPlanSchema.js';

const validResult = {
  summary: 'Summary',
  riskFactors: ['Factor'],
  communityActions: ['Action'],
  advisoryMessage: 'General precautions only.',
  caveat: 'Illustrative data.',
};

describe('Gemini structured explanation client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    vi.stubEnv('GEMINI_MODEL', 'test-model');
    generateContent.mockResolvedValue({ text: JSON.stringify(validResult) });
  });

  it('requests JSON with the response schema and configured timeout', async () => {
    await expect(generateExplanation('Prompt')).resolves.toEqual(validResult);
    expect(generateContent).toHaveBeenCalledWith({
      model: 'test-model',
      contents: 'Prompt',
      config: {
        responseMimeType: 'application/json',
        responseSchema: explainResponseSchema,
        temperature: 0.2,
        httpOptions: { timeout: GEMINI_TIMEOUT_MS },
      },
    });
    expect(GEMINI_TIMEOUT_MS).toBe(12_000);
  });

  it('validates all response fields and list item types', () => {
    expect(isValidExplainResult(validResult)).toBe(true);
    expect(isValidExplainResult({ ...validResult, riskFactors: [12] })).toBe(false);
    expect(isValidExplainResult({ ...validResult, extra: 'value' })).toBe(false);
  });

  it('rejects malformed JSON output', async () => {
    generateContent.mockResolvedValue({ text: 'not json' });
    await expect(generateExplanation('Prompt')).rejects.toThrow('invalid JSON');
  });

  it('generates a schema-validated plan-day response using approved habit IDs', async () => {
    const events = [{ eventId: 'e1', setting: 'indoor', exertion: 'low', durationMin: 30, startTime: '2026-10-03T09:00:00Z', exposure: 12, level: 'LOW' }];
    const candidates = { e1: [{ id: 'window-closed-guidance' }] };
    const result = { summary: 'Plan.', dayPlan: [{ eventId: 'e1', tipIds: ['window-closed-guidance'] }], caveat: 'Heuristic.' };
    generateContent.mockResolvedValue({ text: JSON.stringify(result) });

    await expect(generateDayPlan('Prompt', events, candidates)).resolves.toEqual(result);
    expect(generateContent.mock.calls[0][0].config.responseSchema).toBe(planDayResponseSchema);
  });

  it('generates the existing action plan with its response schema', async () => {
    const actionPlan = { priorityActions: [{ group: 'Schools', zoneId: 'z1', action: 'Share notices.' }], monitoringPlan: ['Review notices.'], advisoryMessage: 'General only.', caveat: 'Illustrative.' };
    generateContent.mockResolvedValue({ text: JSON.stringify(actionPlan) });
    const rankedZones = [{ zone: { id: 'z1' } }];
    await expect(generateActionPlan('Prompt', rankedZones)).resolves.toEqual(actionPlan);
    expect(generateContent.mock.calls[0][0].config.responseSchema).toBe(planResponseSchema);
  });
});
