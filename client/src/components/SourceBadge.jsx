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
          ? 'border-violet-300/25 bg-violet-300/10 text-violet-200'
          : 'border-slate-600 bg-slate-800 text-slate-300'
      }`}
    >
      <span aria-hidden="true">{isGemini ? '✦' : '◌'}</span>
      {label}
    </span>
  );
}
