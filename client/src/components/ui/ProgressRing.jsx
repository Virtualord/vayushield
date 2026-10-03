export default function ProgressRing({ value, max = 100, size = 72, color = 'var(--accent)', label }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, (Number(value) || 0) / max));
  return (
    <svg className="progress-ring" width={size} height={size} viewBox="0 0 72 72" role="img" aria-label={label}>
      <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--glass-border)" strokeWidth="5" />
      <circle cx="36" cy="36" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} transform="rotate(-90 36 36)" />
      <text x="36" y="40" textAnchor="middle" className="progress-ring-value">{value}</text>
    </svg>
  );
}
