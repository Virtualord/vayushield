import { useEffect, useState } from 'react';
import { analyzeZone } from '../services/api.js';
import { copilotLabels } from './copilotLabels.js';
import SourceBadge from './SourceBadge.jsx';
import { copyToClipboard } from '../utils/copyToClipboard.js';

export default function AICopilot({ assessment, scenario }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [audience, setAudience] = useState('authority');
  const [source, setSource] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const labels = copilotLabels[language];

  useEffect(() => {
    setResult(null);
    setSource('');
    setCopyStatus('');
  }, [scenario.windSpeed, scenario.traffic, scenario.industry]);

  async function explainRisk() {
    setIsLoading(true);
    setError('');
    try {
      const response = await analyzeZone(assessment, scenario, language, audience);
      setResult(response.result);
      setSource(response.source);
      setCopyStatus('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function copyAdvisory() {
    try {
      await copyToClipboard(result.advisoryMessage);
      setCopyStatus(labels.copied);
    } catch {
      setCopyStatus(labels.copyFailed);
    }
  }

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-4 sm:p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
          {labels.heading}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-white">{labels.subheading}</h3>
      </div>
      <PreferenceToggle
        label={labels.language}
        value={language}
        options={[
          { value: 'en', label: labels.english },
          { value: 'hi', label: labels.hindi },
        ]}
        onChange={setLanguage}
        clearResult={() => { setResult(null); setSource(''); setError(''); setCopyStatus(''); }}
        disabled={isLoading}
      />
      <PreferenceToggle
        label={labels.audience}
        value={audience}
        options={[
          { value: 'authority', label: labels.authority },
          { value: 'resident', label: labels.resident },
        ]}
        onChange={setAudience}
        clearResult={() => { setResult(null); setSource(''); setError(''); setCopyStatus(''); }}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={explainRisk}
        disabled={isLoading}
        className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoading ? labels.loading : labels.explain}
      </button>
      {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
      {result && (
        <div className="mt-4 space-y-4 border-t border-slate-800 pt-4">
          <p className="text-[11px] text-slate-500">Explanation requested for: wind {scenario.windSpeed == null ? 'zone default' : `${scenario.windSpeed} km/h`}, traffic {scenario.traffic}, industry {scenario.industry}.</p>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="min-w-0 flex-1 text-sm leading-6 text-slate-200">{result.summary}</p>
            <SourceBadge source={source} language={language} />
          </div>
          <ResultList title={labels.riskFactors} items={result.riskFactors} />
          <ResultList title={labels.communityActions} items={result.communityActions} />
          <p className="rounded-lg border border-amber-300/15 bg-amber-300/[0.04] px-3 py-2 text-[11px] leading-5 text-amber-100/80">
            {labels.disclaimer}
          </p>
          <button
            type="button"
            onClick={copyAdvisory}
            className="w-full rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-300/40 hover:text-white"
          >
            {labels.copyAdvisory}
          </button>
          {copyStatus && <p role="status" className="text-xs text-slate-400">{copyStatus}</p>}
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

function PreferenceToggle({ label, value, options, onChange, clearResult, disabled }) {
  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-xs font-medium text-slate-400">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            aria-pressed={value === option.value}
            onClick={() => {
              if (value === option.value) return;
              onChange(option.value);
              clearResult();
            }}
            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
              value === option.value
                ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100'
                : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
