import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ActionPlan from './ActionPlan.jsx';

describe('action plan panel', () => {
  it('offers language and audience controls and the generate action', () => {
    const markup = renderToStaticMarkup(<ActionPlan rankedZones={[{}, {}, {}]} scenario={{ windSpeed: 8, traffic: 'normal', industry: 'low' }} />);
    expect(markup).toContain('Generate response plan');
    expect(markup).toContain('Plan language');
    expect(markup).toContain('Plan audience');
    expect(markup).not.toContain('Priority actions');
  });

  it('explains why planning is unavailable when fewer than three zones are ranked', () => {
    const markup = renderToStaticMarkup(<ActionPlan rankedZones={[]} scenario={{ windSpeed: null, traffic: 'normal', industry: 'normal' }} />);
    expect(markup).toContain('A response plan needs three ranked zones.');
    expect(markup).toContain('disabled=""');
  });
});
