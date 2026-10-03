import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CommunityImpact from './CommunityImpact.jsx';

describe('community impact view', () => {
  it('shows each group with a text, icon, and colored risk level', () => {
    const groups = ['Schools', 'Healthcare', 'Elderly', 'Outdoor workers', 'Industrial workers'];
    const impacts = groups.map((group) => ({ group, score: 60, multiplier: 1.1, level: 'HIGH' }));
    const markup = renderToStaticMarkup(<CommunityImpact impacts={impacts} zoneName="Test zone" />);
    for (const group of groups) expect(markup).toContain(group);
    expect(markup).toContain('Heuristic sensitivity');
    expect(markup).toContain('style="color:#fb923c"');
    expect(markup).toContain('▲');
  });
});
