import { describe, expect, it } from 'vitest';
import { demoCacheKey } from './demoCacheKey.js';

describe('demo cache key', () => {
  it('hashes the preset, language, audience, and response mode deterministically', () => {
    const base = demoCacheKey('typical-day', 'en', 'authority', 'explain');
    expect(base).toHaveLength(64);
    expect(base).toMatch(/^[a-f0-9]+$/);
    expect(demoCacheKey('typical-day', 'en', 'authority', 'explain')).toBe(base);
    expect(new Set([
      demoCacheKey('calm-winter-night', 'en', 'authority', 'explain'),
      demoCacheKey('typical-day', 'hi', 'authority', 'explain'),
      demoCacheKey('typical-day', 'en', 'resident', 'explain'),
      demoCacheKey('typical-day', 'en', 'authority', 'plan'),
    ]).size).toBe(4);
  });
});
