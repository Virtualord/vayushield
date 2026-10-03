import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HowWeCalculate from './HowWeCalculate.jsx';
import RiskBadge from './RiskBadge.jsx';
import RiskCard from './RiskCard.jsx';
import { zones } from '../data/zones.js';
import { assessZone } from '../utils/riskEngine.js';

const scenario = { windSpeed: null, traffic: 'normal', industry: 'normal' };

describe('dashboard detail components', () => {
  it('renders a selected zone assessment and all score components', () => {
    const assessment = assessZone(zones[0], scenario);
    const markup = renderToStaticMarkup(
      <RiskCard assessment={assessment} scenario={scenario} />,
    );

    expect(markup).toContain(zones[0].name);
    expect(markup).toContain('Environmental Risk Score');
    expect(markup).toContain('Population exposed');
    expect(markup).toContain('aria-label="Hazard"');
    expect(markup).toContain('aria-label="Exposure"');
    expect(markup).toContain('aria-label="Vulnerability"');
  });

  it('renders the risk badge with icon and text', () => {
    const markup = renderToStaticMarkup(<RiskBadge level="HIGH" />);

    expect(markup).toContain('▲');
    expect(markup).toContain('HIGH');
  });

  it('shows the engine weights and formula in the expandable panel', () => {
    const markup = renderToStaticMarkup(<HowWeCalculate />);

    expect(markup).toContain('hazard × 0.6');
    expect(markup).toContain('60%');
    expect(markup).toContain('15%');
    expect(markup).toContain('25%');
  });
});
