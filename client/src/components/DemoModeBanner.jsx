export default function DemoModeBanner({ visible }) {
  if (!visible) return null;
  return (
    <div role="status" aria-label="Demo Mode" className="border-b border-amber-300/30 bg-amber-300/10 px-4 py-2 text-center text-xs font-semibold text-amber-100 sm:text-sm">
      <span aria-hidden="true">◌ </span>Demo Mode · Using cached or offline guidance; all dashboard controls remain available.
    </div>
  );
}
