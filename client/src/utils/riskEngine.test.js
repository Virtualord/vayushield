import { describe, expect, it } from 'vitest';
import {
  aqiFromPM25,
  assessZone,
  effectivePM25,
  riskLevel,
} from './riskEngine.js';
import { zones } from '../data/zones.js';

const baseline = { windSpeed: null, traffic: 'normal', industry: 'normal' };

describe('aqiFromPM25', () => {
  it('interpolates PM2.5 of 96 into the Poor band', () => {
    expect(aqiFromPM25(96)).toEqual({ aqi: 220, category: 'Poor' });
  });

  it('caps AQI at 500 above the highest breakpoint', () => {
    expect(aqiFromPM25(400)).toEqual({ aqi: 500, category: 'Severe' });
  });

  it('assigns exact breakpoints to the band that begins there', () => {
    expect(aqiFromPM25(120).category).toBe('Very Poor');
    expect(aqiFromPM25(250).category).toBe('Severe');
  });
});

describe('risk scoring', () => {
  it('raises score when wind is lower than the zone baseline', () => {
    const zone = zones.find(({ id }) => id === 'arera-colony');
    const lowerWind = { ...baseline, windSpeed: 0.2 };

    expect(effectivePM25(zone, lowerWind)).toBeGreaterThan(
      effectivePM25(zone, baseline),
    );
    expect(assessZone(zone, lowerWind).score).toBeGreaterThan(
      assessZone(zone, baseline).score,
    );
  });

  it('high industry changes an industrial zone more than a residential zone', () => {
    const highIndustry = { ...baseline, industry: 'high' };
    const industrialZone = zones.find(({ id }) => id === 'govindpura');
    const residentialZone = zones.find(({ id }) => id === 'arera-colony');
    const industrialChange =
      assessZone(industrialZone, highIndustry).score -
      assessZone(industrialZone, baseline).score;
    const residentialChange =
      assessZone(residentialZone, highIndustry).score -
      assessZone(residentialZone, baseline).score;

    expect(industrialChange).toBeGreaterThan(residentialChange);
  });

  it('maps score boundaries to the requested risk levels', () => {
    expect(riskLevel(29)).toBe('LOW');
    expect(riskLevel(30)).toBe('MODERATE');
    expect(riskLevel(50)).toBe('HIGH');
    expect(riskLevel(75)).toBe('CRITICAL');
  });
});
