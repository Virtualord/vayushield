import { describe, expect, it } from 'vitest';
import { validateZone, zones } from './zones.js';

describe('illustrative zone data', () => {
  it('contains 11 valid zones', () => {
    expect(zones).toHaveLength(11);
    expect(zones.every(validateZone)).toBe(true);
  });
});
