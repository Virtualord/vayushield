import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AICopilot from './AICopilot.jsx';

const assessment = { score: 42, level: 'MODERATE', zone: { id: 'zone-a' } };
const scenario = { windSpeed: null, traffic: 'normal', industry: 'normal' };

describe('AI copilot panel', () => {
  it('starts with an explain-risk action and no result', () => {
    const markup = renderToStaticMarkup(<AICopilot assessment={assessment} scenario={scenario} />);
    expect(markup).toContain('AI copilot');
    expect(markup).toContain('Explain risk');
    expect(markup).not.toContain('Risk factors');
  });
});
