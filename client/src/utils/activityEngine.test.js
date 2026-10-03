import { describe, expect, it } from 'vitest';
import { classifyEvent, exposureScore } from './activityEngine.js';

const baseAssessment = { score: 50 };
const profile = { hasPurifier: false, windowsOpen: false, sensitiveGroup: false };
const activity = { setting: 'outdoor', exertion: 'low', durationMin: 30 };

describe('activity engine', () => {
  it('classifies common event titles and derives duration from ISO times', () => {
    expect(classifyEvent({ title: 'School run', startTime: '2026-10-03T07:15:00+05:30', endTime: '2026-10-03T07:45:00+05:30' }))
      .toMatchObject({ setting: 'commute', exertion: 'medium', durationMin: 30, unknownTitle: false });
    expect(classifyEvent({ title: 'Office meeting', durationMin: 60 })).toMatchObject({ setting: 'indoor', exertion: 'low', durationMin: 60 });
  });

  it('increases exposure when exertion rises', () => {
    expect(exposureScore(baseAssessment, { ...activity, exertion: 'high' }, profile).score)
      .toBeGreaterThan(exposureScore(baseAssessment, activity, profile).score);
  });

  it('scores an indoor activity with a purifier below an outdoor activity', () => {
    const indoor = exposureScore(baseAssessment, { ...activity, setting: 'indoor' }, { ...profile, hasPurifier: true });
    expect(indoor.score).toBeLessThan(exposureScore(baseAssessment, activity, profile).score);
  });

  it('flags unknown titles and defaults them to indoor with low exertion', () => {
    expect(classifyEvent({ title: 'Unrecognized appointment' })).toEqual({
      setting: 'indoor', exertion: 'low', durationMin: 30, unknownTitle: true,
    });
  });

  it('clamps exposure to the 0–100 score range and returns a risk level', () => {
    expect(exposureScore({ score: 1000 }, { ...activity, exertion: 'high', durationMin: 240 }, profile))
      .toEqual({ score: 100, level: 'CRITICAL' });
    expect(exposureScore({ score: -10 }, activity, profile)).toEqual({ score: 0, level: 'LOW' });
  });
});
