import { announceDemoMode } from '../utils/demoMode.js';

export async function analyzeZone(assessment, scenario, language, audience, presetId = 'custom') {
  let response;
  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessment, scenario, language, audience, presetId }),
    });
  } catch {
    announceDemoMode('ai-request-failed');
    throw new Error('Could not reach the analysis service. Try again.');
  }

  if (!response.ok) {
    announceDemoMode('ai-request-failed');
    throw new Error('The analysis request could not be completed.');
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    announceDemoMode('ai-response-invalid');
    throw new Error('The analysis service returned an unreadable response.');
  }

  if (
    !payload ||
    !payload.result ||
    !['gemini', 'demo-cache', 'offline-template'].includes(payload.source)
  ) {
    announceDemoMode('ai-response-invalid');
    throw new Error('The analysis service returned an invalid response.');
  }

  return payload;
}
