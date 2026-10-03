import presets from '../data/scenarioPresets.json';

export function getScenarioPresetId(scenario) {
  return presets.find(({ scenario: preset }) =>
    preset.windSpeed === scenario.windSpeed &&
    preset.traffic === scenario.traffic &&
    preset.industry === scenario.industry,
  )?.id ?? 'custom';
}
