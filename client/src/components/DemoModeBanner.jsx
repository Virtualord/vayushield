import Toast from './ui/Toast.jsx';

export default function DemoModeBanner({ visible }) {
  if (!visible) return null;
  return (
    <Toast label="Demo Mode" tone="notice">
      <span className="demo-banner-dot" aria-hidden="true" />Demo Mode · Using cached or offline guidance; all dashboard controls remain available.
    </Toast>
  );
}
