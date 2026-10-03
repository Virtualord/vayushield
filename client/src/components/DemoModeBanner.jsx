export default function DemoModeBanner({ visible }) {
  if (!visible) return null;
  return (
    <div role="status" aria-label="Demo Mode" className="demo-banner px-4 py-2 text-center text-xs font-semibold sm:text-sm">
      <span className="demo-banner-dot" aria-hidden="true" />Demo Mode · Using cached or offline guidance; all dashboard controls remain available.
    </div>
  );
}
