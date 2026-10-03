export async function requestDayPlan(events, profile, language) {
  const titleFreeEvents = events.map(({ eventId, setting, exertion, durationMin, startTime, exposure, level }) => ({
    eventId, setting, exertion, durationMin, startTime, exposure, level,
  }));
  let response;
  try {
    response = await fetch('/api/plan-day', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: titleFreeEvents, profile, language }),
    });
  } catch {
    throw new Error('Could not reach the planning service.');
  }
  if (!response.ok) throw new Error('The day plan request could not be completed.');
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
