const DEMO_MODE_EVENT = 'vayushield:demo-mode';

export function announceDemoMode(reason = 'fallback') {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(DEMO_MODE_EVENT, { detail: { reason } }));
}

export const demoModeEventName = DEMO_MODE_EVENT;
