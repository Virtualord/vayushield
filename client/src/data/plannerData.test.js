import { describe, expect, it } from 'vitest';
import habits from './habits.json';
import sampleCalendar from './sampleCalendar.json';

describe('planner starter data', () => {
  it('provides reviewed-state tagged habit text in English and Hindi', () => {
    expect(habits.length).toBeGreaterThanOrEqual(18);
    for (const habit of habits) {
      expect(habit).toMatchObject({ reviewed: false });
      expect(habit.id && habit.text_en && habit.text_hi && habit.tags.length).toBeTruthy();
    }
    expect(habits.some(({ text_en }) => /houseplant/i.test(text_en))).toBe(false);
  });

  it('includes the seven sample day activities with ISO times', () => {
    expect(sampleCalendar).toHaveLength(7);
    for (const event of sampleCalendar) {
      expect(Number.isNaN(Date.parse(event.startTime))).toBe(false);
      expect(Number.isNaN(Date.parse(event.endTime))).toBe(false);
    }
  });
});
