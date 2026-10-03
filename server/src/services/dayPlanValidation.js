const eventFields = ['eventId', 'setting', 'exertion', 'durationMin', 'startTime', 'exposure', 'level'];
const riskLevels = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
const severity = Object.fromEntries(riskLevels.map((level, index) => [level, index]));

function exactFields(value, fields) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function validEvent(event) {
  if (!exactFields(event, eventFields)) return false;
  return typeof event.eventId === 'string' && event.eventId.length > 0 &&
    ['indoor', 'outdoor', 'commute'].includes(event.setting) &&
    ['low', 'medium', 'high'].includes(event.exertion) &&
    Number.isInteger(event.durationMin) && event.durationMin >= 1 && event.durationMin <= 1440 &&
    typeof event.startTime === 'string' && !Number.isNaN(Date.parse(event.startTime)) &&
    Number.isFinite(event.exposure) && event.exposure >= 0 && event.exposure <= 100 &&
    riskLevels.includes(event.level) && riskLevelFor(event.exposure) === event.level;
}

function riskLevelFor(score) {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 30) return 'MODERATE';
  return 'LOW';
}

export function isValidPlanDayBody(body) {
  if (!exactFields(body, ['events', 'profile', 'language'])) return false;
  if (!Array.isArray(body.events) || body.events.length < 1 || body.events.length > 50 || !body.events.every(validEvent)) return false;
  const ids = body.events.map(({ eventId }) => eventId);
  if (new Set(ids).size !== ids.length) return false;
  return exactFields(body.profile, ['hasPurifier', 'windowsOpen', 'sensitiveGroup']) &&
    Object.values(body.profile).every((value) => typeof value === 'boolean') &&
    ['en', 'hi'].includes(body.language);
}

export function isValidPlanDayResult(result, events, candidatesByEvent, habits) {
  if (!exactFields(result, ['summary', 'dayPlan', 'caveat'])) return false;
  if (typeof result.summary !== 'string' || !result.summary.trim() ||
      typeof result.caveat !== 'string' || !result.caveat.trim()) return false;
  if (!Array.isArray(result.dayPlan) || result.dayPlan.length !== events.length) return false;
  const knownEventIds = new Set(events.map(({ eventId }) => eventId));
  const knownHabitIds = new Set(habits.map(({ id }) => id));
  const plannedIds = new Set();
  for (const item of result.dayPlan) {
    if (!exactFields(item, ['eventId', 'tipIds']) || !knownEventIds.has(item.eventId) || plannedIds.has(item.eventId)) return false;
    if (!Array.isArray(item.tipIds) || item.tipIds.length < 1 || item.tipIds.length > 3) return false;
    const candidates = new Set(candidatesByEvent[item.eventId].map(({ id }) => id));
    if (!item.tipIds.every((tipId) => typeof tipId === 'string' && knownHabitIds.has(tipId) && candidates.has(tipId))) return false;
    plannedIds.add(item.eventId);
  }
  return plannedIds.size === knownEventIds.size;
}

export const planDayValidationInternals = { eventFields, severity };
