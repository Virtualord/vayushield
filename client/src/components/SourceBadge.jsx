export default function SourceBadge({ source, language }) {
  const isGemini = source === 'gemini';
  const labels = {
    gemini: 'Gemini',
    'demo-cache': language === 'hi' ? 'डेमो कैश' : 'Demo cache',
    'offline-template': language === 'hi' ? 'ऑफ़लाइन टेम्पलेट' : 'Offline template',
  };
  const label = labels[source] ?? labels['offline-template'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${
        isGemini
          ? 'border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--accent)_12%,var(--glass-strong))] text-[var(--label)]'
          : 'border-[var(--glass-border)] bg-[var(--glass-child)] text-[var(--secondary-label)]'
      }`}
    >
      <Icon name={isGemini ? 'sparkle' : 'person'} size={13} />
      {label}
    </span>
  );
}
import Icon from './ui/Icon.jsx';
