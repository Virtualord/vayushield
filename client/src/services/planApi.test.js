import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestActionPlan } from './planApi.js';

afterEach(() => vi.unstubAllGlobals());

describe('action plan API client', () => {
  it('posts the active top zones, scenario, language, and audience', async () => {
    const rankedZones = [{ score: 70, zone: { id: 'top' } }];
    const scenario = { windSpeed: 8, traffic: 'high', industry: 'low' };
    const payload = { result: { priorityActions: [], monitoringPlan: [], advisoryMessage: '', caveat: '' }, source: 'offline-template' };
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => payload });
    vi.stubGlobal('fetch', fetch);
    await expect(requestActionPlan(rankedZones, scenario, 'hi', 'resident')).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith('/api/plan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rankedZones, scenario, language: 'hi', audience: 'resident' }),
    });
  });

  it('reports transport and malformed response errors safely', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('details')));
    await expect(requestActionPlan([], {}, 'en', 'authority')).rejects.toThrow('Could not reach the planning service. Try again.');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ source: 'wrong' }) }));
    await expect(requestActionPlan([], {}, 'en', 'authority')).rejects.toThrow('The planning service returned an invalid response.');
  });
});
