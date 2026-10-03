const riskStyles = {
  CRITICAL: {
    icon: '⚠',
    style: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
  },
  HIGH: {
    icon: '▲',
    style: 'border-orange-300/30 bg-orange-300/10 text-orange-200',
  },
  MODERATE: {
    icon: '◆',
    style: 'border-amber-300/30 bg-amber-300/10 text-amber-200',
  },
  LOW: {
    icon: '✓',
    style: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
  },
};

export default function RiskBadge({ level }) {
  const { icon, style } = riskStyles[level];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide sm:text-xs ${style}`}
    >
      <span aria-hidden="true">{icon}</span>
      {level}
    </span>
  );
}
