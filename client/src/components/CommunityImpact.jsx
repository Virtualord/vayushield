import { riskColors } from '../utils/riskMapPresentation.js';
import Icon from './ui/Icon.jsx';

const groupIcons = {
  Schools: 'school',
  Healthcare: 'hospital',
  Elderly: 'person',
  'Outdoor workers': 'sun',
  'Industrial workers': 'industry',
};
const levelIcons = { CRITICAL: 'critical', HIGH: 'high', MODERATE: 'moderate', LOW: 'low' };

export default function CommunityImpact({ impacts, zoneName }) {
  return (
    <section aria-label="Community impact" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Community impact</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{zoneName}</h3>
        <p className="mt-1 text-xs text-slate-400">Heuristic sensitivity applied to the prototype Environmental Risk Score.</p>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {impacts.map(({ group, score, level, multiplier }) => (
          <li key={group} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs font-medium text-slate-300"><Icon name={groupIcons[group]} className="mr-2 inline text-[var(--accent)]" />{group}</p>
            <p className="mt-3 text-xl font-semibold tabular-nums text-white">{score}<span className="ml-1 text-[10px] font-normal text-slate-400">/100</span></p>
            <p className="mt-1 text-[10px] text-slate-400">Heuristic ×{multiplier.toFixed(2)}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--label)]"><Icon name={levelIcons[level]} size={14} style={{ color: riskColors[level] }} />{level}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-amber-100/70">Illustrative data and heuristic sensitivity only; not a health assessment.</p>
    </section>
  );
}
