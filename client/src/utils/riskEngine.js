const AQI_BANDS = [
  { low: 0, high: 30, aqiLow: 0, aqiHigh: 50, category: 'Good' },
  { low: 30, high: 60, aqiLow: 50, aqiHigh: 100, category: 'Satisfactory' },
  { low: 60, high: 90, aqiLow: 100, aqiHigh: 200, category: 'Moderate' },
  { low: 90, high: 120, aqiLow: 200, aqiHigh: 300, category: 'Poor' },
  { low: 120, high: 250, aqiLow: 300, aqiHigh: 400, category: 'Very Poor' },
  { low: 250, high: 380, aqiLow: 400, aqiHigh: 500, category: 'Severe' },
];

const LEVEL_MULTIPLIERS = { low: 0.8, normal: 1, high: 1.3 };

export const WEIGHTS = Object.freeze({
  hazard: 0.6,
  exposure: 0.15,
  vulnerability: 0.25,
});

// Simplified PM2.5-only AQI; verify breakpoints against CPCB documentation.
export function aqiFromPM25(pm25) {
  const concentration = Math.max(pm25, 0);
  const band = AQI_BANDS.find(({ high }) => concentration < high);

  if (!band) return { aqi: 500, category: 'Severe' };

  const interpolated =
    ((band.aqiHigh - band.aqiLow) / (band.high - band.low)) *
      (concentration - band.low) +
    band.aqiLow;

  return { aqi: Math.round(interpolated), category: band.category };
}

export function effectivePM25(zone, scenario) {
  const emissionFactor =
    zone.emissionMix.traffic * LEVEL_MULTIPLIERS[scenario.traffic] +
    zone.emissionMix.industry * LEVEL_MULTIPLIERS[scenario.industry];
  const requestedWind = scenario.windSpeed ?? zone.baseWind;
  const effectiveWind = Math.min(15, Math.max(0.2, requestedWind));
  const dispersionFactor =
    (1 + zone.baseWind / 5) / (1 + effectiveWind / 5);

  return zone.basePM25 * emissionFactor * dispersionFactor;
}

export function riskScore(zone, scenario) {
  const hazard = Math.min(effectivePM25(zone, scenario) / 120, 1);
  const exposure = Math.min(zone.population / 50000, 1);
  const score =
    (WEIGHTS.hazard * hazard +
      WEIGHTS.exposure * exposure +
      WEIGHTS.vulnerability * zone.vulnerability) *
    100;

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function riskLevel(score) {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 30) return 'MODERATE';
  return 'LOW';
}

export function assessZone(zone, scenario) {
  const pm25 = effectivePM25(zone, scenario);
  const { aqi, category } = aqiFromPM25(pm25);
  const hazard = Math.min(pm25 / 120, 1);
  const exposure = Math.min(zone.population / 50000, 1);
  const score = riskScore(zone, scenario);

  return {
    zone,
    effectivePM25: pm25,
    aqi,
    category,
    score,
    level: riskLevel(score),
    hazard,
    exposure,
    vulnerability: zone.vulnerability,
  };
}
