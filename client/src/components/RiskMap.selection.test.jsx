import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RankedZoneList from './RankedZoneList.jsx';
import RiskCard from './RiskCard.jsx';
import { zones } from '../data/zones.js';
import { assessZone } from '../utils/riskEngine.js';

const scenario = { windSpeed: null, traffic: 'normal', industry: 'normal' };

describe('shared zone selection', () => {
  it('uses the same selected zone id in the list and selected assessment card', () => {
    const selectedZone = zones[1];
    const assessment = assessZone(selectedZone, scenario);
    const list = renderToStaticMarkup(
      <RankedZoneList
        assessments={[assessment]}
        selectedZoneId={selectedZone.id}
        onSelect={() => {}}
      />,
    );
    const card = renderToStaticMarkup(<RiskCard assessment={assessment} scenario={scenario} />);

    expect(list).toContain('aria-pressed="true"');
    expect(list).toContain(selectedZone.name);
    expect(card).toContain(selectedZone.name);
  });
});
