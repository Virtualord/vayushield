import { describe, expect, it, vi } from 'vitest';
import { buildCacheEntries } from '../../../scripts/generate-demo-cache.js';

describe('manual demo cache generation matrix', () => {
  it('builds explain and plan entries for each preset, language, and audience without network calls', async () => {
    const generateExplain = vi.fn().mockResolvedValue({ summary: 'cached explanation' });
    const generatePlan = vi.fn().mockResolvedValue({ priorityActions: [] });
    const entries = await buildCacheEntries({ generateExplain, generatePlan });
    expect(Object.keys(entries)).toHaveLength(24);
    expect(generateExplain).toHaveBeenCalledTimes(12);
    expect(generatePlan).toHaveBeenCalledTimes(12);
    expect(Object.values(entries).filter(({ mode }) => mode === 'explain')).toHaveLength(12);
    expect(Object.values(entries).filter(({ mode }) => mode === 'plan')).toHaveLength(12);
  });
});
