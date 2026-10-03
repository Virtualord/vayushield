import Icon from './ui/Icon.jsx';

const riskStyles = {
  CRITICAL: { icon: 'critical', color: 'var(--risk-critical)' },
  HIGH: { icon: 'high', color: 'var(--risk-high)' },
  MODERATE: { icon: 'moderate', color: 'var(--risk-moderate)' },
  LOW: { icon: 'low', color: 'var(--risk-low)' },
};

export default function RiskBadge({ level }) {
  const { icon, color } = riskStyles[level];

  return (
    <span
      className="risk-badge inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide sm:text-xs"
    >
      <Icon name={icon} size={14} style={{ color }} />
      <span>{level}</span>
    </span>
  );
}
