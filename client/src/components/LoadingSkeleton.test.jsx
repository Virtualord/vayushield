import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LoadingSkeleton from './LoadingSkeleton.jsx';

describe('loading skeleton', () => {
  it('announces what is loading and marks decorative bars hidden', () => {
    const markup = renderToStaticMarkup(<LoadingSkeleton label="Generating explanation" />);
    expect(markup).toContain('role="status" aria-label="Generating explanation"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('animate-pulse');
  });
});
