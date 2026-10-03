import { describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './copyToClipboard.js';

describe('copy advisory helper', () => {
  it('writes the supplied advisory text to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    await copyToClipboard('General precautions only.', { writeText });
    expect(writeText).toHaveBeenCalledWith('General precautions only.');
  });
});
