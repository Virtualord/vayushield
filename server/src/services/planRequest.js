import { buildOfflinePlan } from './planFallback.js';
import { buildPlanPrompt } from './planPrompt.js';
import { isValidPlanBody, isValidPlanResult } from './requestValidation.js';
import { lookupDemoCache, readDemoCache } from './demoCache.js';

export async function planRequest(body, { apiKey, planWithGemini, demoCache = readDemoCache() }) {
  if (!isValidPlanBody(body)) return { status: 400, payload: { error: 'Invalid request body' } };

  const { rankedZones, scenario, language, audience, presetId } = body;
  const cached = lookupDemoCache(demoCache, presetId, language, audience, 'plan');
  if (!apiKey) {
    if (cached && isValidPlanResult(cached, rankedZones)) return { status: 200, payload: { result: cached, source: 'demo-cache' } };
    return { status: 200, payload: { result: buildOfflinePlan({ rankedZones, scenario, language }), source: 'offline-template' } };
  }

  try {
    const result = await planWithGemini(buildPlanPrompt({ rankedZones, scenario, language, audience }), rankedZones);
    if (!isValidPlanResult(result, rankedZones)) throw new Error('Invalid structured plan output');
    return { status: 200, payload: { result, source: 'gemini' } };
  } catch {
    if (cached && isValidPlanResult(cached, rankedZones)) return { status: 200, payload: { result: cached, source: 'demo-cache' } };
    return { status: 200, payload: { result: buildOfflinePlan({ rankedZones, scenario, language }), source: 'offline-template' } };
  }
}
