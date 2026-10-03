import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { demoCacheKey } from './demoCacheKey.js';

const cachePath = fileURLToPath(new URL('../../data/demoCache.json', import.meta.url));

export function readDemoCache() {
  try {
    const cache = JSON.parse(readFileSync(cachePath, 'utf8'));
    return cache?.version === 1 && cache.entries && typeof cache.entries === 'object' ? cache : { version: 1, entries: {} };
  } catch {
    return { version: 1, entries: {} };
  }
}

export function lookupDemoCache(cache, presetId, language, audience, mode) {
  if (presetId === 'custom' || !cache?.entries) return null;
  const key = demoCacheKey(presetId, language, audience, mode);
  const entry = cache.entries[key];
  if (!entry || entry.presetId !== presetId || entry.language !== language || entry.audience !== audience || entry.mode !== mode) return null;
  return entry.result ?? null;
}
