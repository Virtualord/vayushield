import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestDayPlan } from './planDayApi.js';

afterEach(() => vi.unstubAllGlobals());

describe('plan-day client API', () => {
  it('sends classified values only and never includes event titles', async () => {
    const events = [{ eventId: 'local-id', title: 'Private meeting name', setting: 'indoor', exertion: 'low', durationMin: 30, startTime: '2026-10-03T09:00:00Z', exposure: 20, level: 'LOW' }];
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: {}, source: 'offline-template' }) });
    vi.stubGlobal('fetch', fetch);
    await requestDayPlan(events, { hasPurifier: true, windowsOpen: false, sensitiveGroup: false }, 'en');
    const body = fetch.mock.calls[0][1].body;
    expect(body).not.toContain('Private meeting name');
    expect(body).not.toContain('"title"');
    expect(body).toContain('"exposure":20');
  });

  it('throws a safe error when the local API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network detail')));
    await expect(requestDayPlan([], {}, 'en')).rejects.toThrow('Could not reach the planning service.');
  });
});
