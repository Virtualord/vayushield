import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SourceBadge from './SourceBadge.jsx';

describe('copilot source badge', () => {
  it('labels Gemini and offline-template results', () => {
    expect(renderToStaticMarkup(<SourceBadge source="gemini" language="en" />)).toContain('Gemini');
    expect(renderToStaticMarkup(<SourceBadge source="offline-template" language="en" />)).toContain('Offline template');
    expect(renderToStaticMarkup(<SourceBadge source="offline-template" language="hi" />)).toContain('ऑफ़लाइन टेम्पलेट');
  });
});
