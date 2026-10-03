import { riskColors } from '../utils/riskMapPresentation.js';
import Icon from './ui/Icon.jsx';

const levels = [
  { level: 'CRITICAL', icon: 'critical' },
  { level: 'HIGH', icon: 'high' },
  { level: 'MODERATE', icon: 'moderate' },
  { level: 'LOW', icon: 'low' },
];

export default function RiskLegend() {
  return (
    <div aria-label="Risk level legend" className="risk-legend flex flex-wrap gap-x-4 gap-y-2 px-4 py-3">
      {levels.map(({ level, icon }) => (
        <span key={level} className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-slate-300 sm:text-xs">
          <Icon name={icon} style={{ color: riskColors[level] }} />
          <span>{level}</span>
        </span>
      ))}
    </div>
  );
}
