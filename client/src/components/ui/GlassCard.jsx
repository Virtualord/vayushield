import { createElement } from 'react';

export default function GlassCard({ as = 'article', className = '', children, ...props }) {
  return createElement(as, { className: `glass-card ${className}`, ...props }, children);
}
