import { describe, expect, it } from 'vitest';
import { lookupDemoCache, readDemoCache } from './demoCache.js';
import { demoCacheKey } from './demoCacheKey.js';

describe('demo response cache', () => {
  it('loads a valid cache file and returns an exact scenario/mode match', () => {
    const cache = readDemoCache();
    expect(cache.version).toBe(1);
    const result = { summary: 'Cached.' };
    const entry = { presetId: 'typical-day', language: 'hi', audience: 'resident', mode: 'explain', result };
    const keyedCache = { version: 1, entries: { [demoCacheKey(entry.presetId, entry.language, entry.audience, entry.mode)]: entry } };
    expect(lookupDemoCache(keyedCache, 'typical-day', 'hi', 'resident', 'explain')).toEqual(result);
    expect(lookupDemoCache(keyedCache, 'typical-day', 'hi', 'resident', 'plan')).toBeNull();
    expect(lookupDemoCache(keyedCache, 'custom', 'hi', 'resident', 'explain')).toBeNull();
  });

  it('ignores mismatched cache metadata', () => {
    const result = { summary: 'Wrong preset.' };
    const entry = { presetId: 'clear-windy-day', language: 'en', audience: 'authority', mode: 'explain', result };
    const cache = { entries: { [demoCacheKey('typical-day', 'en', 'authority', 'explain')]: entry } };
    expect(lookupDemoCache(cache, 'typical-day', 'en', 'authority', 'explain')).toBeNull();
  });
});
