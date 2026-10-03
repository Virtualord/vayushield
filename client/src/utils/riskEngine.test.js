import { describe, expect, it } from 'vitest';
import { aqiFromPM25 } from './riskEngine.js';

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
