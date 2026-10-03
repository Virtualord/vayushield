import { buildOfflineResult } from './fallback.js';
import { buildExplanationPrompt } from './prompt.js';
import { isValidExplainResult } from './explainSchema.js';
import { isValidAnalyzeBody } from './requestValidation.js';
import { lookupDemoCache, readDemoCache } from './demoCache.js';

export async function analyzeRequest(body, { apiKey, analyzeWithGemini, demoCache = readDemoCache() }) {
  if (!isValidAnalyzeBody(body)) {
    return { status: 400, payload: { error: 'Invalid request body' } };
  }

  const { assessment, scenario, language, audience, presetId } = body;
  const cached = lookupDemoCache(demoCache, presetId, language, audience, 'explain');
  if (!apiKey) {
    if (cached && isValidExplainResult(cached)) return { status: 200, payload: { result: cached, source: 'demo-cache' } };
    return {
      status: 200,
      payload: { result: buildOfflineResult({ assessment, language }), source: 'offline-template' },
    };
  }

  const prompt = buildExplanationPrompt({ assessment, scenario, language, audience });
  try {
    const result = await analyzeWithGemini(prompt);
    if (!isValidExplainResult(result)) throw new Error('Invalid structured model output');
    return { status: 200, payload: { result, source: 'gemini' } };
  } catch {
    if (cached && isValidExplainResult(cached)) return { status: 200, payload: { result: cached, source: 'demo-cache' } };
    return {
      status: 200,
      payload: { result: buildOfflineResult({ assessment, language }), source: 'offline-template' },
    };
  }
}
