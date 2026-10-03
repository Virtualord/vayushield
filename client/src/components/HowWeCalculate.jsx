import { WEIGHTS } from '../utils/riskEngine.js';

export default function HowWeCalculate() {
  return (
    <details className="component-panel group rounded-2xl border border-slate-800 bg-slate-900/70">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-slate-200 sm:p-5">
        <span>How we calculate this</span>
        <span
          aria-hidden="true"
          className="text-lg text-cyan-300 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-t border-slate-800 px-4 pb-5 pt-4 sm:px-5">
        <p className="text-xs leading-5 text-slate-400">
          Each component is normalized to 0–1. The score is the weighted sum multiplied
          by 100 and rounded to a whole number.
        </p>
        <code className="mt-3 block overflow-x-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-6 text-cyan-100 sm:text-xs">
          score = round(100 × (hazard × {WEIGHTS.hazard} + exposure × {WEIGHTS.exposure} +
          vulnerability × {WEIGHTS.vulnerability}))
        </code>
        <ul className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          {Object.entries(WEIGHTS).map(([component, weight]) => (
            <li
              key={component}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
            >
              <span className="capitalize text-slate-400">{component}</span>
              <span className="font-semibold tabular-nums text-white">
                {(weight * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] leading-5 text-slate-400">
          A transparent prototype heuristic, not a validated scientific model or official
          assessment. Inputs are illustrative.
        </p>
      </div>
    </details>
  );
}
