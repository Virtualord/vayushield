import { createHash } from 'node:crypto';

export function demoCacheKey(presetId, language, audience, mode) {
  return createHash('sha256')
    .update([presetId, language, audience, mode].join('|'))
    .digest('hex');
}
