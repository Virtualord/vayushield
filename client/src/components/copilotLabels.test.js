import { describe, expect, it } from 'vitest';
import { copilotLabels } from './copilotLabels.js';

describe('copilot English and Hindi labels', () => {
  it('provides translated controls and result headings', () => {
    expect(copilotLabels.en.explain).toBe('Explain risk');
    expect(copilotLabels.en.audience).toBe('Audience');
    expect(copilotLabels.hi.explain).toBe('जोखिम समझाएँ');
    expect(copilotLabels.hi.language).toBe('भाषा');
    expect(copilotLabels.hi.communityActions).toBe('समुदाय के लिए कदम');
  });
});
