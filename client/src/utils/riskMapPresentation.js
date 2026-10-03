export const riskColors = {
  CRITICAL: '#fb7185',
  HIGH: '#fb923c',
  MODERATE: '#fbbf24',
  LOW: '#34d399',
};

export function markerRadius(population, maxPopulation) {
  return 9 + (population / maxPopulation) * 9;
}
