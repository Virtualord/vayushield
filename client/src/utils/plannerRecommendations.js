import habits from '../data/habits.json';

const severity = { LOW: 0, MODERATE: 1, HIGH: 2, CRITICAL: 3 };

export function selectLocalHabitCandidates(event, profile) {
  const tag = event.setting === 'commute'
    ? 'commute'
    : event.setting === 'outdoor'
      ? event.exertion === 'high' ? 'outdoor_exercise' : 'outdoor_light'
      : profile.hasPurifier ? 'indoor_purifier' : 'indoor_no_purifier';
  const tags = new Set([tag]);
  if (profile.sensitiveGroup) tags.add('sensitive_group');
  let matches = habits.filter((habit) => severity[habit.minLevel] <= severity[event.level] && habit.tags.some((candidateTag) => tags.has(candidateTag)));
  if (event.setting === 'indoor') {
    const preferredId = profile.windowsOpen ? 'window-open-guidance' : 'window-closed-guidance';
    matches = matches.filter(({ id }) => !id.startsWith('window-'));
    const preferred = habits.find(({ id }) => id === preferredId);
    const secondChoiceId = profile.hasPurifier ? 'purifier-follow-manual' : 'review-indoor-notices';
    const secondChoice = habits.find(({ id }) => id === secondChoiceId);
    for (const choice of [secondChoice, preferred]) {
      if (severity[choice.minLevel] <= severity[event.level]) {
        matches = matches.filter(({ id }) => id !== choice.id);
        matches.unshift(choice);
      }
    }
  }
  return matches;
}

export function buildLocalDayPlan(events, profile, language) {
  return {
    summary: language === 'hi'
      ? 'आपके दिन और प्रोफ़ाइल के लिए सामान्य सावधानियाँ।'
      : 'General precautions selected for your classified day and profile.',
    dayPlan: events.map((event) => ({
      eventId: event.eventId,
      tipIds: selectLocalHabitCandidates(event, profile).slice(0, 2).map(({ id }) => id),
    })),
    caveat: language === 'hi'
      ? 'स्तर और आदतें उदाहरणात्मक इनपुट पर आधारित हैं; केवल सामान्य सावधानियाँ, चिकित्सा सलाह नहीं।'
      : 'Levels and habits use illustrative inputs; general precautions only, not medical advice.',
  };
}

export function getHabitText(tipId, language) {
  const habit = habits.find(({ id }) => id === tipId);
  return language === 'hi' ? habit?.text_hi : habit?.text_en;
}
