export {
  ACTIVITY_DURATION_FACTOR,
  ACTIVITY_EXERTION_FACTORS,
  ACTIVITY_PROFILE_FACTORS,
  ACTIVITY_SETTING_FACTORS,
  exposureScore,
} from './riskEngine.js';

const settingRules = [
  { setting: 'commute', pattern: /\b(commut|school run|drive|travel|bus|train|transit|ride)\b/i },
  { setting: 'outdoor', pattern: /\b(outside|outdoors|park|cricket|run|walk|cycling|cycle|jog|field)\b/i },
  { setting: 'indoor', pattern: /\b(office|meeting|class|gym|home|indoor|desk|study|lunch)\b/i },
];
const exertionRules = [
  { exertion: 'high', pattern: /\b(run|gym|cricket|practice|training|workout|exercise|sport|match)\b/i },
  { exertion: 'medium', pattern: /\b(walk|commut|school run|travel|ride|cycling|cycle)\b/i },
];

export function classifyEvent(event) {
  const title = typeof event?.title === 'string' ? event.title : '';
  const settingMatch = settingRules.find(({ pattern }) => pattern.test(title));
  const exertionMatch = exertionRules.find(({ pattern }) => pattern.test(title));
  const exertion = /\bschool run\b/i.test(title) ? 'medium' : exertionMatch?.exertion ?? 'low';
  const start = Date.parse(event?.startTime);
  const end = Date.parse(event?.endTime);
  const suppliedDuration = Number.isFinite(event?.durationMin) ? event.durationMin : null;
  const durationMin = suppliedDuration ?? (Number.isFinite(start) && Number.isFinite(end) && end > start
    ? Math.round((end - start) / 60_000)
    : 30);

  return {
    setting: settingMatch?.setting ?? 'indoor',
    exertion,
    durationMin: Math.max(1, Math.min(1440, durationMin)),
    unknownTitle: !settingMatch && !exertionMatch,
  };
}
