const AQI_BANDS = [
  { low: 0, high: 30, aqiLow: 0, aqiHigh: 50, category: 'Good' },
  { low: 30, high: 60, aqiLow: 50, aqiHigh: 100, category: 'Satisfactory' },
  { low: 60, high: 90, aqiLow: 100, aqiHigh: 200, category: 'Moderate' },
  { low: 90, high: 120, aqiLow: 200, aqiHigh: 300, category: 'Poor' },
  { low: 120, high: 250, aqiLow: 300, aqiHigh: 400, category: 'Very Poor' },
  { low: 250, high: 380, aqiLow: 400, aqiHigh: 500, category: 'Severe' },
];

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
