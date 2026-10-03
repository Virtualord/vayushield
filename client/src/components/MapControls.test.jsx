import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import MapControlButtons from './MapControlButtons.jsx';

describe('map controls', () => {
  it('exposes named, keyboard-operable zoom buttons', () => {
    const markup = renderToStaticMarkup(<MapControlButtons onZoomIn={vi.fn()} onZoomOut={vi.fn()} />);
    expect(markup).toContain('role="group" aria-label="Map controls"');
    expect(markup).toContain('aria-label="Zoom map in"');
    expect(markup).toContain('aria-label="Zoom map out"');
  });
});
