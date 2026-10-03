import { riskColors } from '../utils/riskMapPresentation.js';

const levels = [
  { level: 'CRITICAL', icon: '⚠' },
  { level: 'HIGH', icon: '▲' },
  { level: 'MODERATE', icon: '◆' },
  { level: 'LOW', icon: '✓' },
];

export default function RiskLegend() {
  return (
    <div aria-label="Risk level legend" className="flex flex-wrap gap-x-4 gap-y-2 rounded-b-2xl border border-t-0 border-slate-800 bg-slate-900/80 px-4 py-3">
      {levels.map(({ level, icon }) => (
        <span key={level} className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-slate-300 sm:text-xs">
          <span aria-hidden="true" style={{ color: riskColors[level] }}>{icon}</span>
          <span>{level}</span>
        </span>
      ))}
    </div>
  );
}
