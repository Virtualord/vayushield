import { describe, expect, it } from 'vitest';
import presets from '../data/scenarioPresets.json';
import { getScenarioPresetId } from './scenarioPreset.js';

describe('scenario preset lookup', () => {
  it('maps all built-in preset scenarios to stable cache IDs', () => {
    expect(presets.map(({ scenario }) => getScenarioPresetId(scenario))).toEqual(presets.map(({ id }) => id));
    expect(getScenarioPresetId({ windSpeed: 7, traffic: 'normal', industry: 'normal' })).toBe('custom');
  });
});
