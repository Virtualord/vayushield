import { createElement } from 'react';

export default function GlassPanel({ as = 'section', className = '', children, ...props }) {
  return createElement(as, { className: `glass-panel ${className}`, ...props }, children);
}
