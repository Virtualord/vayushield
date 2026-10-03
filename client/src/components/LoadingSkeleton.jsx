export default function LoadingSkeleton({ label }) {
  return (
    <div role="status" aria-label={label} className="loading-skeleton mt-4 space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="skeleton-line h-3 w-2/3 rounded bg-slate-700" />
      <div aria-hidden="true" className="skeleton-line h-3 w-full rounded bg-slate-800" />
      <div aria-hidden="true" className="skeleton-line h-3 w-5/6 rounded bg-slate-800" />
    </div>
  );
}
