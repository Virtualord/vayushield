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
    expect(markup).toContain('⚠');
    expect(markup).toContain('▲');
    expect(markup).toContain('◆');
    expect(markup).toContain('✓');
    expect(markup).toContain('#fb7185');
    expect(markup).toContain('#34d399');
  });
});
