import { describe, expect, it, vi } from 'vitest';
import { planDayRequest } from './planDayRequest.js';
import { buildDayPlanPrompt } from './dayPlanPrompt.js';
import { selectHabitCandidates, getHabitLibrary } from './dayPlanHabits.js';
import { isValidPlanDayBody, isValidPlanDayResult } from './dayPlanValidation.js';

const events = [
  { eventId: 'meeting-id', setting: 'indoor', exertion: 'low', durationMin: 60, startTime: '2026-10-03T09:00:00+05:30', exposure: 12, level: 'LOW' },
  { eventId: 'run-id', setting: 'outdoor', exertion: 'high', durationMin: 30, startTime: '2026-10-03T17:00:00+05:30', exposure: 72, level: 'HIGH' },
];
const profile = { hasPurifier: false, windowsOpen: false, sensitiveGroup: false };
const validBody = { events, profile, language: 'en' };
const candidates = Object.fromEntries(events.map((event) => [event.eventId, selectHabitCandidates(event, profile, 'en')]));
const validResult = {
  summary: 'General precautions for the day.',
  dayPlan: events.map((event) => ({ eventId: event.eventId, tipIds: [candidates[event.eventId][0].id] })),
  caveat: 'Illustrative heuristics, not medical advice.',
};

describe('plan-day validation and service', () => {
  it('accepts classified title-free events and rejects titles or inconsistent levels', () => {
    expect(isValidPlanDayBody(validBody)).toBe(true);
    expect(isValidPlanDayBody({ ...validBody, events: [{ ...events[0], title: 'Private title' }, events[1]] })).toBe(false);
    expect(isValidPlanDayBody({ ...validBody, events: [{ ...events[0], level: 'HIGH' }, events[1]] })).toBe(false);
  });

  it('uses profile and event level to select allowed habits', () => {
    const openWindow = selectHabitCandidates(events[0], { ...profile, windowsOpen: true }, 'en');
    const closedWindow = candidates[events[0].eventId];
    const purifier = selectHabitCandidates(events[0], { ...profile, hasPurifier: true }, 'en');
    expect(openWindow[0].id).toBe('window-open-guidance');
    expect(closedWindow[0].id).toBe('window-closed-guidance');
    expect(purifier.some(({ id }) => id === 'purifier-follow-manual')).toBe(true);
    expect(closedWindow.some(({ id }) => id === 'purifier-follow-manual')).toBe(false);
  });

  it('validates plan tip IDs against candidate and library IDs', () => {
    expect(isValidPlanDayResult(validResult, events, candidates, getHabitLibrary())).toBe(true);
    const invented = { ...validResult, dayPlan: [{ ...validResult.dayPlan[0], tipIds: ['invented-tip'] }, validResult.dayPlan[1]] };
    expect(isValidPlanDayResult(invented, events, candidates, getHabitLibrary())).toBe(false);
  });

  it('returns a deterministic offline plan with top matching habits', async () => {
    const planWithGemini = vi.fn();
    const outcome = await planDayRequest(validBody, { apiKey: '', planWithGemini });
    expect(outcome.status).toBe(200);
    expect(outcome.payload.source).toBe('offline-template');
    expect(outcome.payload.result.dayPlan[0].tipIds[0]).toBe('window-closed-guidance');
    expect(planWithGemini).not.toHaveBeenCalled();
  });

  it('passes title-free classified data and candidates to the model and falls back on invalid IDs', async () => {
    const planWithGemini = vi.fn().mockResolvedValue(validResult);
    const outcome = await planDayRequest(validBody, { apiKey: 'configured', planWithGemini });
    expect(outcome.payload.source).toBe('gemini');
    const prompt = planWithGemini.mock.calls[0][0];
    expect(prompt).toContain('"exposure": 72');
    expect(prompt).not.toContain('"title"');
    planWithGemini.mockResolvedValue({ ...validResult, dayPlan: [{ ...validResult.dayPlan[0], tipIds: ['unknown'] }, validResult.dayPlan[1]] });
    expect((await planDayRequest(validBody, { apiKey: 'configured', planWithGemini })).payload.source).toBe('offline-template');
  });

  it('returns 400 for invalid requests and prompt contains safety rules', async () => {
    const planWithGemini = vi.fn();
    expect(await planDayRequest({ ...validBody, language: 'fr' }, { apiKey: 'configured', planWithGemini }))
      .toEqual({ status: 400, payload: { error: 'Invalid request body' } });
    const prompt = buildDayPlanPrompt({ ...validBody, candidatesByEvent: candidates });
    expect(prompt).toContain('general precautions only');
    expect(prompt).toContain('Events are title-free');
  });
});
