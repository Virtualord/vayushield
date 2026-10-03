import habits from '../../../client/src/data/habits.json' with { type: 'json' };

const severity = { LOW: 0, MODERATE: 1, HIGH: 2, CRITICAL: 3 };

export function selectHabitCandidates(event, profile, language) {
  const tag = event.setting === 'commute'
    ? 'commute'
    : event.setting === 'outdoor'
      ? event.exertion === 'high' ? 'outdoor_exercise' : 'outdoor_light'
      : profile.hasPurifier ? 'indoor_purifier' : 'indoor_no_purifier';
  const requiredTags = new Set([tag]);
  if (profile.sensitiveGroup) requiredTags.add('sensitive_group');
  let matches = habits.filter((habit) =>
    severity[habit.minLevel] <= severity[event.level] && habit.tags.some((habitTag) => requiredTags.has(habitTag)),
  );

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
  return matches.map(({ id, text_en, text_hi, minLevel }) => ({ id, text: language === 'hi' ? text_hi : text_en, minLevel }));
}

export function getHabitLibrary() {
  return habits;
}
