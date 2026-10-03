import { describe, expect, it } from 'vitest';
import { buildLocalDayPlan } from './plannerRecommendations.js';

const event = { eventId: 'e1', setting: 'indoor', exertion: 'low', level: 'LOW' };

describe('local day recommendations', () => {
  it('changes indoor tips with purifier and window profile settings', () => {
    const base = buildLocalDayPlan([event], { hasPurifier: false, windowsOpen: false, sensitiveGroup: false }, 'en');
    const purifier = buildLocalDayPlan([event], { hasPurifier: true, windowsOpen: false, sensitiveGroup: false }, 'en');
    const open = buildLocalDayPlan([event], { hasPurifier: false, windowsOpen: true, sensitiveGroup: false }, 'en');
    expect(base.dayPlan[0].tipIds).not.toEqual(purifier.dayPlan[0].tipIds);
    expect(base.dayPlan[0].tipIds).not.toEqual(open.dayPlan[0].tipIds);
  });
});
