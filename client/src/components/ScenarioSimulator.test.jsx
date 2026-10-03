import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ScenarioSimulator from './ScenarioSimulator.jsx';

describe('scenario simulator controls', () => {
  it('renders bounded wind, level selectors, presets, and reset actions', () => {
    const markup = renderToStaticMarkup(<ScenarioSimulator scenario={{ windSpeed: null, traffic: 'normal', industry: 'normal' }} onScenarioChange={vi.fn()} zones={[{}, {}]} />);
    expect(markup).toContain('min="0.5" max="12" step="0.5"');
    expect(markup).toContain('aria-label="Wind speed"');
    expect(markup).toContain('aria-valuetext="Zone default"');
    expect(markup).toContain('Calm winter night');
    expect(markup).toContain('Typical day');
    expect(markup).toContain('Clear windy day');
    expect(markup).toContain('Zone default');
    expect(markup).toContain('Reset');
  });
});
