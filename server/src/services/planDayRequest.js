import { buildOfflineDayPlan } from './dayPlanFallback.js';
import { buildDayPlanPrompt } from './dayPlanPrompt.js';
import { selectHabitCandidates, getHabitLibrary } from './dayPlanHabits.js';
import { isValidPlanDayBody, isValidPlanDayResult } from './dayPlanValidation.js';

export async function planDayRequest(body, { apiKey, planWithGemini }) {
  if (!isValidPlanDayBody(body)) return { status: 400, payload: { error: 'Invalid request body' } };
  const { events, profile, language } = body;
  const candidatesByEvent = Object.fromEntries(events.map((event) => [
    event.eventId,
    selectHabitCandidates(event, profile, language),
  ]));
  if (Object.values(candidatesByEvent).some((candidates) => !candidates.length)) {
    return { status: 400, payload: { error: 'No matching habits for one or more events' } };
  }
  if (!apiKey) {
    return { status: 200, payload: { result: buildOfflineDayPlan(body), source: 'offline-template' } };
  }
  try {
    const result = await planWithGemini(buildDayPlanPrompt({ ...body, candidatesByEvent }));
    if (!isValidPlanDayResult(result, events, candidatesByEvent, getHabitLibrary())) throw new Error('Invalid plan-day output');
    return { status: 200, payload: { result, source: 'gemini' } };
  } catch {
    return { status: 200, payload: { result: buildOfflineDayPlan(body), source: 'offline-template' } };
  }
}
