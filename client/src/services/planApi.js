import { announceDemoMode } from '../utils/demoMode.js';

export async function requestActionPlan(rankedZones, scenario, language, audience, presetId = 'custom') {
  let response;
  try {
    response = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rankedZones, scenario, language, audience, presetId }),
    });
  } catch {
    announceDemoMode('ai-request-failed');
    throw new Error('Could not reach the planning service. Try again.');
  }

  if (!response.ok) {
    announceDemoMode('ai-request-failed');
    throw new Error('The response plan could not be generated.');
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    announceDemoMode('ai-response-invalid');
    throw new Error('The planning service returned an unreadable response.');
  }
  if (!payload?.result || !['gemini', 'demo-cache', 'offline-template'].includes(payload.source)) {
    announceDemoMode('ai-response-invalid');
    throw new Error('The planning service returned an invalid response.');
  }
  return payload;
}
