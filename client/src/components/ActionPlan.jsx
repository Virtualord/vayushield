import { useEffect, useState } from 'react';
import { requestActionPlan } from '../services/planApi.js';
import { copyToClipboard } from '../utils/copyToClipboard.js';
import SourceBadge from './SourceBadge.jsx';
import { announceDemoMode } from '../utils/demoMode.js';
import { getScenarioPresetId } from '../utils/scenarioPreset.js';
import LoadingSkeleton from './LoadingSkeleton.jsx';

export default function ActionPlan({ rankedZones, scenario, language: languageProp, onLanguageChange, audience: audienceProp, onAudienceChange }) {
  const [localLanguage, setLocalLanguage] = useState('en');
  const [localAudience, setLocalAudience] = useState('authority');
  const language = languageProp ?? localLanguage;
  const audience = audienceProp ?? localAudience;
  const setLanguage = onLanguageChange ?? setLocalLanguage;
  const setAudience = onAudienceChange ?? setLocalAudience;
  const [plan, setPlan] = useState(null);
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    setPlan(null);
    setSource('');
    setCopyStatus('');
  }, [rankedZones, scenario.windSpeed, scenario.traffic, scenario.industry, language, audience]);

  async function generatePlan() {
    setLoading(true);
    setError('');
    try {
      const response = await requestActionPlan(rankedZones, scenario, language, audience, getScenarioPresetId(scenario));
      setPlan(response.result);
      setSource(response.source);
      if (response.source !== 'gemini') announceDemoMode('ai-fallback');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyAdvisory() {
    try {
      await copyToClipboard(plan.advisoryMessage);
      setCopyStatus(language === 'hi' ? 'सलाह कॉपी हो गई' : 'Advisory copied');
    } catch {
      setCopyStatus(language === 'hi' ? 'सलाह कॉपी नहीं हो सकी।' : 'Could not copy the advisory.');
    }
  }

  const groups = plan ? [...new Set(plan.priorityActions.map(({ group }) => group))] : [];
  return (
    <section lang={language} className="component-panel rounded-2xl border border-cyan-400/20 bg-slate-900/80 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Community response</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Action plan</h3>
        </div>
        {source && <SourceBadge source={source} language={language} />}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-slate-400">Language
          <select aria-label="Plan language" value={language} onChange={(event) => { setLanguage(event.target.value); setPlan(null); setSource(''); }} className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
            <option value="en">English</option><option value="hi">Hindi</option>
          </select>
        </label>
        <label className="text-xs text-slate-400">Audience
          <select aria-label="Plan audience" value={audience} onChange={(event) => { setAudience(event.target.value); setPlan(null); setSource(''); }} className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
            <option value="authority">Authority</option><option value="resident">Resident</option>
          </select>
        </label>
      </div>
      <button type="button" onClick={generatePlan} disabled={loading || rankedZones.length !== 3} className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60">
        {loading ? 'Generating plan…' : 'Generate response plan'}
      </button>
      {loading && <LoadingSkeleton label="Generating response plan" />}
      {rankedZones.length !== 3 && <p role="status" className="mt-3 text-sm text-slate-300">A response plan needs three ranked zones.</p>}
      {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
      {plan && (
        <div className="mt-4 space-y-4 border-t border-slate-800 pt-4">
          <p className="text-[11px] text-slate-400">Based on the active scenario and the top three engine-ranked zones. Inputs are illustrative.</p>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Priority actions</h4>
            <div className="mt-2 space-y-3">
              {groups.map((group) => (
                <section key={group}>
                  <h5 className="text-xs font-semibold text-cyan-200">{group}</h5>
                  <ul className="mt-1 space-y-1 text-sm leading-5 text-slate-300">
                    {plan.priorityActions.filter((action) => action.group === group).map((action, index) => (
                      <li key={`${action.zoneId}-${index}`}><span className="text-slate-400">{rankedZones.find(({ zone }) => zone.id === action.zoneId)?.zone.name}: </span>{action.action}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monitoring plan</h4>
            <ul className="mt-2 space-y-1 text-sm leading-5 text-slate-300">{plan.monitoringPlan.map((item, index) => <li key={index}>{item}</li>)}</ul>
          </div>
          <p className="rounded-lg border border-amber-300/15 bg-amber-300/[0.04] px-3 py-2 text-[11px] leading-5 text-amber-100/80">{plan.advisoryMessage} {plan.caveat}</p>
          <button type="button" onClick={copyAdvisory} className="w-full rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-300/40">Copy advisory</button>
          {copyStatus && <p role="status" className="text-xs text-slate-400">{copyStatus}</p>}
        </div>
      )}
    </section>
  );
}
