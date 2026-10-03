import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import DemoModeBanner from './DemoModeBanner.jsx';

describe('Demo Mode banner', () => {
  it('is hidden until demo mode is detected and then has a visible label', () => {
    expect(renderToStaticMarkup(<DemoModeBanner visible={false} />)).toBe('');
    const markup = renderToStaticMarkup(<DemoModeBanner visible />);
    expect(markup).toContain('Demo Mode');
    expect(markup).toContain('all dashboard controls remain available');
  });
});
