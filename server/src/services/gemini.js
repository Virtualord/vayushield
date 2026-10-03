import { GoogleGenAI } from '@google/genai';
import { explainResponseSchema, isValidExplainResult } from './explainSchema.js';

export const GEMINI_TIMEOUT_MS = 12_000;

export async function generateExplanation(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key is not configured');

  const client = new GoogleGenAI({ apiKey });
  const response = await client.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: explainResponseSchema,
      temperature: 0.2,
      httpOptions: { timeout: GEMINI_TIMEOUT_MS },
    },
  });

  let result;
  try {
    result = JSON.parse(response.text);
  } catch {
    throw new Error('Gemini returned invalid JSON');
  }
  if (!isValidExplainResult(result)) throw new Error('Gemini returned an invalid response shape');
  return result;
}
