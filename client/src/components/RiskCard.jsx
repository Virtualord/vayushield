import RiskBadge from './RiskBadge.jsx';
import ProgressRing from './ui/ProgressRing.jsx';

const components = [
  { key: 'hazard', label: 'Hazard', color: 'bg-rose-400' },
  { key: 'exposure', label: 'Exposure', color: 'bg-amber-300' },
  { key: 'vulnerability', label: 'Vulnerability', color: 'bg-cyan-300' },
];

export default function RiskCard({ assessment, scenario }) {
  const { zone, score, level, effectivePM25 } = assessment;
  const windSpeed = scenario.windSpeed ?? zone.baseWind;

  return (
    <section className="component-panel zone-score-panel rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Selected zone
          </p>
          <h3 className="mt-1 truncate text-xl font-semibold text-white sm:text-2xl">
            {zone.name}
          </h3>
          <p className="mt-1 text-xs capitalize text-slate-400">{zone.type}</p>
        </div>
        <RiskBadge level={level} />
      </div>

      <div className="score-summary mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:flex sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-[var(--secondary-label)]">Environmental Risk Score</p>
          <p className="score-number mt-1 text-4xl font-semibold tabular-nums tracking-tight" style={{ color: `var(--risk-${level.toLowerCase()})` }}>{score}<span className="ml-1 text-sm font-medium text-[var(--secondary-label)]">/100</span></p>
        </div>
        <ProgressRing value={score} color={`var(--risk-${level.toLowerCase()})`} label={`Environmental Risk Score ${score} out of 100, ${level}`} />
        <p className="mt-3 max-w-xs text-xs leading-5 text-slate-400 sm:mt-0 sm:text-right">
          Prototype score computed from illustrative inputs using the displayed
          methodology.
        </p>
      </div>

      <div className="input-metrics mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        <Metric label="Effective PM2.5" value={effectivePM25.toFixed(1)} unit="µg/m³" />
        <Metric label="Wind speed" value={windSpeed.toFixed(1)} unit="km/h" />
        <Metric label="Population exposed" value={zone.population.toLocaleString('en-IN')} />
      </div>

      <div className="mt-6 border-t border-slate-800 pt-5">
        <h4 className="text-sm font-semibold text-slate-200">Score components</h4>
        <div className="mt-4 space-y-4">
          {components.map(({ key, label }) => {
            const value = assessment[key];
            const percentage = Math.round(value * 100);

            return (
              <div key={key}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-300">{label}</span>
                  <span className="tabular-nums text-slate-400">{percentage}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label={label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                  className="h-2 overflow-hidden rounded-full bg-slate-800"
                >
                  <div className="component-progress-fill h-full rounded-full" style={{ width: `${percentage}%`, '--component-color': key === 'hazard' ? 'var(--risk-critical)' : key === 'exposure' ? 'var(--risk-high)' : 'var(--accent)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-5 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] px-3 py-2 text-[11px] leading-5 text-amber-100/70">
        Illustrative input data. Population and environmental readings are not live
        measurements.
      </p>
    </section>
  );
}

function Metric({ label, value, unit }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <p className="min-h-8 text-[10px] leading-4 text-slate-400 sm:text-xs">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold tabular-nums text-white sm:text-base">
        {value}
        {unit && <span className="ml-1 text-[10px] font-medium text-slate-400">{unit}</span>}
      </p>
    </div>
  );
}
