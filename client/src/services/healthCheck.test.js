import { describe, expect, it, vi } from 'vitest';
import { checkApiHealth } from './healthCheck.js';

describe('API health detection', () => {
  it('returns false when the local service is unavailable or unhealthy', async () => {
    await expect(checkApiHealth(vi.fn().mockRejectedValue(new Error('offline')))).resolves.toBe(false);
    await expect(checkApiHealth(vi.fn().mockResolvedValue({ ok: false }))).resolves.toBe(false);
  });

  it('recognizes a healthy local service', async () => {
    await expect(checkApiHealth(vi.fn().mockResolvedValue({ ok: true }))).resolves.toBe(true);
  });
});
