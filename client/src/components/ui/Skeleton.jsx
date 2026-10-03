export default function Skeleton({ label, lines = 3 }) {
  return (
    <div role="status" aria-label={label} className="loading-skeleton mt-4 space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, index) => <div key={index} aria-hidden="true" className={`skeleton-line h-3 rounded bg-slate-800 ${index === 0 ? 'w-2/3' : index === lines - 1 ? 'w-5/6' : 'w-full'}`} />)}
    </div>
  );
}
