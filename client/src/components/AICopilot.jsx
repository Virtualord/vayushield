import { useState } from 'react';
import { analyzeZone } from '../services/api.js';

export default function AICopilot({ assessment, scenario }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function explainRisk() {
    setIsLoading(true);
    setError('');
    try {
      const response = await analyzeZone(assessment, scenario, 'en', 'authority');
      setResult(response.result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-4 sm:p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
          AI copilot
        </p>
        <h3 className="mt-1 text-lg font-semibold text-white">Explain this risk</h3>
      </div>
      <button
        type="button"
        onClick={explainRisk}
        disabled={isLoading}
        className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoading ? 'Generating explanation…' : 'Explain risk'}
      </button>
      {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
      {result && (
        <div className="mt-4 space-y-4 border-t border-slate-800 pt-4">
          <p className="text-sm leading-6 text-slate-200">{result.summary}</p>
          <ResultList title="Risk factors" items={result.riskFactors} />
          <ResultList title="Community actions" items={result.communityActions} />
        </div>
      )}
    </section>
  );
}

function ResultList({ title, items }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-300">
        {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
      </ul>
    </div>
  );
}
