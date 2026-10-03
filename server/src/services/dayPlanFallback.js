import { selectHabitCandidates } from './dayPlanHabits.js';

export function buildOfflineDayPlan({ events, profile, language }) {
  const hi = language === 'hi';
  const dayPlan = events.map((event) => ({
    eventId: event.eventId,
    tipIds: selectHabitCandidates(event, profile, language).slice(0, 2).map(({ id }) => id),
  }));
  return {
    summary: hi
      ? 'आपके वर्गीकृत दिन के कार्यक्रम और प्रोफ़ाइल के लिए सामान्य सावधानियाँ।'
      : 'General precautions selected for your classified day and profile.',
    dayPlan,
    caveat: hi
      ? 'यह अनुमान नहीं है। स्तर और आदतें उदाहरणात्मक इनपुट पर आधारित हैं; केवल सामान्य सावधानियाँ, चिकित्सा सलाह नहीं।'
      : 'This is not a forecast. Levels and habits use illustrative inputs; general precautions only, not medical advice.',
  };
}
