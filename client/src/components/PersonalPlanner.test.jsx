import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PersonalPlanner from './PersonalPlanner.jsx';

describe('personal day planner', () => {
  it('shows profile controls, sample-day loader, and the general precaution disclaimer', () => {
    const markup = renderToStaticMarkup(<PersonalPlanner zoneAssessment={{ score: 40 }} />);
    expect(markup).toContain('Air purifier available');
    expect(markup).toContain('Windows open');
    expect(markup).toContain('Sensitive group profile');
    expect(markup).toContain('aria-label="Air purifier available"');
    expect(markup).toContain('aria-label="Windows open"');
    expect(markup).toContain('Load sample day');
    expect(markup).toContain('Import pasted .ics');
    expect(markup).toContain('Upload .ics');
    expect(markup).toContain('General precautions only, not medical advice.');
  });
});
