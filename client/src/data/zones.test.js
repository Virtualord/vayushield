import { describe, expect, it } from 'vitest';
import { getActiveZones, validateZone, zones } from './zones.js';

describe('illustrative zone data', () => {
  it('contains 11 valid zones', () => {
    expect(zones).toHaveLength(11);
    expect(zones.every(validateZone)).toBe(true);
  });
});

describe('demo mode dataset', () => {
  it('uses three placeholder-labelled records when Mode B is enabled', () => {
    const modeBZones = getActiveZones('B');
    expect(modeBZones).toHaveLength(3);
    expect(modeBZones.every(({ name }) => name === 'PLACEHOLDER')).toBe(true);
    expect(new Set(modeBZones.map(({ id }) => id)).size).toBe(3);
  });
});
