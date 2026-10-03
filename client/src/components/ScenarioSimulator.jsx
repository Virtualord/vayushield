import presets from '../data/scenarioPresets.json';

const baselineScenario = { windSpeed: null, traffic: 'normal', industry: 'normal' };

export default function ScenarioSimulator({ scenario, onScenarioChange, zones }) {
  const update = (key, value) => onScenarioChange({ ...scenario, [key]: value });
  return (
    <section aria-label="What-if scenario simulator" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">What-if simulator</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Adjust illustrative inputs</h3>
        </div>
        <button type="button" onClick={() => onScenarioChange(baselineScenario)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-300/40">Reset</button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="text-xs text-slate-400">
          <span className="flex justify-between"><span>Wind speed</span><span>{scenario.windSpeed == null ? 'Zone default' : `${scenario.windSpeed} km/h`}</span></span>
          <input aria-label="Wind speed" aria-valuetext={scenario.windSpeed == null ? 'Zone default' : `${scenario.windSpeed} km/h`} className="mt-3 w-full accent-cyan-400" type="range" min="0.5" max="12" step="0.5" value={scenario.windSpeed ?? 0.5} onChange={(event) => update('windSpeed', Number(event.target.value))} />
          <button type="button" onClick={() => update('windSpeed', null)} className="mt-1 text-[11px] text-cyan-300 hover:text-cyan-200">Zone default</button>
        </label>
        <ScenarioSelect label="Traffic" value={scenario.traffic} onChange={(value) => update('traffic', value)} />
        <ScenarioSelect label="Industry" value={scenario.industry} onChange={(value) => update('industry', value)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Scenario presets">
        {presets.map(({ name, scenario: preset }) => (
          <button key={name} type="button" aria-pressed={JSON.stringify(scenario) === JSON.stringify(preset)} onClick={() => onScenarioChange(preset)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-cyan-300/40 hover:text-white">{name}</button>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">Wind range: 0.5–12 km/h. Zone default uses each zone’s illustrative baseline ({zones.length} zones).</p>
    </section>
  );
}

function ScenarioSelect({ label, value, onChange }) {
  return (
    <label className="text-xs text-slate-400">{label}
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm capitalize text-slate-100">
        {['low', 'normal', 'high'].map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
