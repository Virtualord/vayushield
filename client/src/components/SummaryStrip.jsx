const stats = [
  { key: 'weightedPM25', label: 'Population-weighted PM2.5', suffix: 'µg/m³' },
  { key: 'aqi', label: 'AQI', detail: 'category' },
  { key: 'criticalCount', label: 'CRITICAL zones' },
  { key: 'highCount', label: 'HIGH zones' },
  { key: 'highOrCriticalPopulation', label: 'Population in HIGH or CRITICAL' },
];

export default function SummaryStrip({ summary }) {
  return (
    <section aria-label="Bhopal summary indicators" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {stats.map(({ key, label, suffix, detail }) => (
        <article
          key={key}
          className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5"
        >
          <h3 className="min-h-9 text-xs font-medium leading-4 text-slate-400">{label}</h3>
          {detail === 'category' ? (
            <p className="mt-3 break-words text-xl font-semibold text-white sm:text-2xl">
              {summary.aqi}
              <span className="ml-2 text-xs font-medium text-cyan-300">{summary.category}</span>
            </p>
          ) : (
            <p className="mt-3 break-words text-2xl font-semibold tabular-nums text-white">
              {key === 'weightedPM25'
                ? summary[key].toFixed(1)
                : summary[key].toLocaleString('en-IN')}
              {suffix && (
                <span className="ml-1 text-xs font-medium text-slate-400">{suffix}</span>
              )}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}
