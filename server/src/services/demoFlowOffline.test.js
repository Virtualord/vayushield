import { afterEach, describe, expect, it, vi } from 'vitest';
import zones from '../../../client/src/data/zones.json' with { type: 'json' };
import presets from '../../../client/src/data/scenarioPresets.json' with { type: 'json' };
import { rankZones } from '../../../client/src/utils/riskEngine.js';
import { analyzeRequest } from './analyzeRequest.js';
import { planRequest } from './planRequest.js';

afterEach(() => vi.unstubAllGlobals());

describe('full demo response flow without credentials or network', () => {
  it('serves explanation and plan fallbacks for every preset, language, and audience', async () => {
    const liveExplain = vi.fn(() => Promise.reject(new Error('network must not be used')));
    const livePlan = vi.fn(() => Promise.reject(new Error('network must not be used')));
    const fetch = vi.fn(() => Promise.reject(new Error('network disabled')));
    vi.stubGlobal('fetch', fetch);

    for (const { id: presetId, scenario } of presets) {
      const ranked = rankZones(zones, scenario);
      for (const language of ['en', 'hi']) {
        for (const audience of ['authority', 'resident']) {
          const explanation = await analyzeRequest({
            assessment: ranked[0], scenario, language, audience, presetId,
          }, { apiKey: '', analyzeWithGemini: liveExplain });
          const plan = await planRequest({
            rankedZones: ranked.slice(0, 3), scenario, language, audience, presetId,
          }, { apiKey: '', planWithGemini: livePlan });

          expect(explanation.status).toBe(200);
          expect(['demo-cache', 'offline-template']).toContain(explanation.payload.source);
          expect(explanation.payload.result.summary.length).toBeGreaterThan(0);
          expect(plan.status).toBe(200);
          expect(['demo-cache', 'offline-template']).toContain(plan.payload.source);
          expect(plan.payload.result.priorityActions.length).toBeGreaterThan(0);
          expect(plan.payload.result.monitoringPlan.length).toBeGreaterThan(0);
        }
      }
    }

    expect(liveExplain).not.toHaveBeenCalled();
    expect(livePlan).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
