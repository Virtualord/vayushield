export const riskColors = {
  CRITICAL: 'var(--risk-critical)',
  HIGH: 'var(--risk-high)',
  MODERATE: 'var(--risk-moderate)',
  LOW: 'var(--risk-low)',
};

export function markerRadius(population, maxPopulation) {
  return 9 + (population / maxPopulation) * 9;
}
