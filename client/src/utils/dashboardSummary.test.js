import { describe, expect, it } from 'vitest';
import { buildDashboardSummary } from './dashboardSummary.js';

describe('buildDashboardSummary', () => {
  it('weights PM2.5 by population and totals high-risk zones', () => {
    const assessments = [
      { effectivePM25: 20, level: 'HIGH', zone: { population: 100 } },
      { effectivePM25: 70, level: 'CRITICAL', zone: { population: 300 } },
      { effectivePM25: 100, level: 'LOW', zone: { population: 100 } },
    ];

    expect(buildDashboardSummary(assessments)).toEqual({
      weightedPM25: 66,
      aqi: 120,
      category: 'Moderate',
      highCount: 1,
      criticalCount: 1,
      highOrCriticalPopulation: 400,
    });
  });
});
