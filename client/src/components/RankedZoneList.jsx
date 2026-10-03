import RiskBadge from './RiskBadge.jsx';

export default function RankedZoneList({ assessments, selectedZoneId, onSelect }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Ranked zones</h3>
          <p className="mt-1 text-xs text-slate-500">Sorted by Environmental Risk Score</p>
        </div>
        <span className="text-xs tabular-nums text-slate-500">{assessments.length} areas</span>
      </div>
      <ol className="space-y-2">
        {assessments.map(({ zone, score, level }, index) => {
          const isSelected = zone.id === selectedZoneId;

          return (
            <li key={zone.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(zone.id)}
                className={`flex w-full min-w-0 items-center gap-2 rounded-xl border p-2.5 text-left transition-colors sm:gap-3 sm:p-3 ${
                  isSelected
                    ? 'border-cyan-400/50 bg-cyan-400/[0.07]'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-800 text-xs font-semibold tabular-nums text-slate-400">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-100">
                    {zone.name}
                  </span>
                  <span className="block truncate text-[11px] capitalize text-slate-500">
                    {zone.type}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold tabular-nums text-white">
                    {score}
                  </span>
                  <span className="text-[9px] uppercase tracking-wide text-slate-600">
                    score
                  </span>
                </span>
                <RiskBadge level={level} />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
