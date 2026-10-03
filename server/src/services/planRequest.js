import { buildOfflinePlan } from './planFallback.js';
import { buildPlanPrompt } from './planPrompt.js';
import { isValidPlanBody, isValidPlanResult } from './requestValidation.js';

export async function planRequest(body, { apiKey, planWithGemini }) {
  if (!isValidPlanBody(body)) return { status: 400, payload: { error: 'Invalid request body' } };

  const { rankedZones, scenario, language, audience } = body;
  if (!apiKey) {
    return { status: 200, payload: { result: buildOfflinePlan({ rankedZones, scenario, language }), source: 'offline-template' } };
  }

  try {
    const result = await planWithGemini(buildPlanPrompt({ rankedZones, scenario, language, audience }), rankedZones);
    if (!isValidPlanResult(result, rankedZones)) throw new Error('Invalid structured plan output');
    return { status: 200, payload: { result, source: 'gemini' } };
  } catch {
    return { status: 200, payload: { result: buildOfflinePlan({ rankedZones, scenario, language }), source: 'offline-template' } };
  }
}
