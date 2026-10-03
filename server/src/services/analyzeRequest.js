import { buildOfflineResult } from './fallback.js';
import { buildExplanationPrompt } from './prompt.js';
import { isValidExplainResult } from './explainSchema.js';
import { isValidAnalyzeBody } from './requestValidation.js';

export async function analyzeRequest(body, { apiKey, analyzeWithGemini }) {
  if (!isValidAnalyzeBody(body)) {
    return { status: 400, payload: { error: 'Invalid request body' } };
  }

  const { assessment, scenario, language, audience } = body;
  if (!apiKey) {
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
    return {
      status: 200,
      payload: { result: buildOfflineResult({ assessment, language }), source: 'offline-template' },
    };
  }
}
