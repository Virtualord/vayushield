import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RankedZoneList from './RankedZoneList.jsx';

describe('ranked zone scenario comparison', () => {
  it('shows baseline and scenario scores with level changes', () => {
    const before = { zone: { id: 'area', name: 'Example' }, score: 35, level: 'MODERATE' };
    const after = { ...before, score: 52, level: 'HIGH' };
    const markup = renderToStaticMarkup(<RankedZoneList assessments={[after]} baselineAssessments={[before]} comparisons={[{ before, after, levelChanged: true }]} selectedZoneId="area" onSelect={() => {}} />);
    expect(markup).toContain('35 → 52');
    expect(markup).toContain('MODERATE → HIGH');
    expect(markup).toContain('Changes');
    expect(markup).toContain('aria-label="Select Example, HIGH risk, score 52"');
  });
});
