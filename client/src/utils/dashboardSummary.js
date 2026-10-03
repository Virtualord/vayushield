import { aqiFromPM25 } from './riskEngine.js';

export function buildDashboardSummary(assessments) {
  const totalPopulation = assessments.reduce(
    (total, { zone }) => total + zone.population,
    0,
  );
  const weightedPM25 = totalPopulation
    ? assessments.reduce(
        (total, { effectivePM25, zone }) =>
          total + effectivePM25 * zone.population,
        0,
      ) / totalPopulation
    : 0;
  const highZones = assessments.filter(({ level }) => level === 'HIGH');
  const criticalZones = assessments.filter(({ level }) => level === 'CRITICAL');
  const aqi = aqiFromPM25(weightedPM25);

  return {
    weightedPM25,
    aqi: aqi.aqi,
    category: aqi.category,
    highCount: highZones.length,
    criticalCount: criticalZones.length,
    highOrCriticalPopulation: [...highZones, ...criticalZones].reduce(
      (total, { zone }) => total + zone.population,
      0,
    ),
  };
}
