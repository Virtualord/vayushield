export default function DashboardHeader({ theme = 'system', onThemeChange = () => {} }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
            Bhopal environmental intelligence
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            VayuShield
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Understand neighborhood environmental risks with clear, illustrative inputs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
          <span aria-hidden="true" className="size-2 rounded-full bg-amber-300" />
          Illustrative data
        </span>
        <button type="button" aria-label={`Theme: ${theme}. Activate to cycle appearance`} onClick={() => onThemeChange(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system')} className="rounded-full border border-slate-500/30 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[var(--label)]">
          {theme === 'system' ? 'System appearance' : theme === 'light' ? 'Light appearance' : 'Dark appearance'}
        </button>
        </div>
      </div>
    </header>
  );
}
