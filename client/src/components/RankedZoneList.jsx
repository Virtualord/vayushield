import RiskBadge from './RiskBadge.jsx';

export default function RankedZoneList({ assessments, baselineAssessments = assessments, comparisons = [], selectedZoneId, onSelect }) {
  const baselineById = new Map(baselineAssessments.map(({ zone, score }) => [zone.id, score]));
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Ranked zones</h3>
          <p className="mt-1 text-xs text-slate-400">Sorted by Environmental Risk Score</p>
        </div>
        <span className="text-xs tabular-nums text-slate-400">{assessments.length} areas</span>
      </div>
      <ol className="space-y-2">
        {assessments.map(({ zone, score, level }, index) => {
          const isSelected = zone.id === selectedZoneId;

          return (
            <li key={zone.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                aria-label={`Select ${zone.name}, ${level} risk, score ${score}`}
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
                  <span className="block truncate text-[11px] capitalize text-slate-400">
                    {zone.type}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold tabular-nums text-white">
                    {baselineById.get(zone.id) !== score ? <><span className="text-slate-400">{baselineById.get(zone.id)} → </span>{score}</> : score}
                  </span>
                  <span className="text-[9px] uppercase tracking-wide text-slate-400">
                    score
                  </span>
                </span>
                <RiskBadge level={level} />
              </button>
            </li>
          );
        })}
      </ol>
      <section aria-label="Changes" className="mt-5 border-t border-slate-800 pt-4">
        <h4 className="text-sm font-semibold text-white">Changes</h4>
        <p className="mt-1 text-xs text-slate-400">Zones whose risk level changed · baseline → scenario score</p>
        {comparisons.filter(({ levelChanged }) => levelChanged).length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400"><tr><th className="py-2 pr-3 font-medium">Zone</th><th className="py-2 pr-3 font-medium">Level</th><th className="py-2 text-right font-medium">Score</th></tr></thead>
              <tbody>{comparisons.filter(({ levelChanged }) => levelChanged).map(({ before, after }) => (
                <tr key={after.zone.id} className="border-t border-slate-800/80">
                  <td className="py-2 pr-3 text-slate-200">{after.zone.name}</td>
                  <td className="py-2 pr-3 text-slate-300">{before.level} → {after.level}</td>
                  <td className="py-2 text-right font-semibold tabular-nums text-white">{before.score} → {after.score}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="mt-3 text-xs text-slate-400">No zone risk levels changed from baseline.</p>}
      </section>
    </section>
  );
}
