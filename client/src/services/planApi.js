export async function requestActionPlan(rankedZones, scenario, language, audience) {
  let response;
  try {
    response = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rankedZones, scenario, language, audience }),
    });
  } catch {
    throw new Error('Could not reach the planning service. Try again.');
  }

  if (!response.ok) throw new Error('The response plan could not be generated.');
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('The planning service returned an unreadable response.');
  }
  if (!payload?.result || !['gemini', 'offline-template'].includes(payload.source)) {
    throw new Error('The planning service returned an invalid response.');
  }
  return payload;
}
