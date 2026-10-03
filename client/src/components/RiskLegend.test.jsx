import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import RiskLegend from './RiskLegend.jsx';

describe('risk map legend', () => {
  it('lists all four levels with icons and their risk colors', () => {
    const markup = renderToStaticMarkup(<RiskLegend />);
    expect(markup).toContain('CRITICAL');
    expect(markup).toContain('HIGH');
    expect(markup).toContain('MODERATE');
    expect(markup).toContain('LOW');
    expect(markup).toContain('data-icon="critical"');
    expect(markup).toContain('data-icon="high"');
    expect(markup).toContain('data-icon="moderate"');
    expect(markup).toContain('data-icon="low"');
    expect(markup).toContain('var(--risk-critical)');
    expect(markup).toContain('var(--risk-low)');
  });
});
