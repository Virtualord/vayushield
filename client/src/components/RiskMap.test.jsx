import { describe, expect, it } from 'vitest';
import { markerRadius, riskColors } from '../utils/riskMapPresentation.js';

describe('risk map marker presentation', () => {
  it('maps every risk level to a distinct visible color', () => {
    expect(Object.keys(riskColors)).toEqual(['CRITICAL', 'HIGH', 'MODERATE', 'LOW']);
    expect(new Set(Object.values(riskColors)).size).toBe(4);
  });

  it('scales marker radius with population while keeping markers tappable', () => {
    expect(markerRadius(25000, 50000)).toBe(13.5);
    expect(markerRadius(50000, 50000)).toBe(18);
    expect(markerRadius(0, 50000)).toBe(9);
  });
});
