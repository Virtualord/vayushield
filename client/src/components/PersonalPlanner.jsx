import { useMemo, useState } from 'react';
import sampleCalendar from '../data/sampleCalendar.json';
import { classifyEvent, exposureScore } from '../utils/activityEngine.js';
import { buildLocalDayPlan, getHabitText } from '../utils/plannerRecommendations.js';
import { riskColors } from '../utils/riskMapPresentation.js';
import { requestDayPlan } from '../services/planDayApi.js';
import SourceBadge from './SourceBadge.jsx';
import { parseIcsCalendar } from '../utils/icsParser.js';

const levelIcons = { CRITICAL: '⚠', HIGH: '▲', MODERATE: '◆', LOW: '✓' };

export default function PersonalPlanner({ zoneAssessment }) {
  const [events, setEvents] = useState([]);
  const [profile, setProfile] = useState({ hasPurifier: false, windowsOpen: false, sensitiveGroup: false });
  const [language, setLanguage] = useState('en');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [icsText, setIcsText] = useState('');
  const [icsError, setIcsError] = useState('');

  const classifiedEvents = useMemo(() => events.map((event) => {
    const classification = classifyEvent(event);
    const impact = exposureScore(zoneAssessment, classification, profile);
    return {
      eventId: event.id,
      title: event.title,
      startTime: event.startTime,
      ...classification,
      exposure: impact.score,
      level: impact.level,
    };
  }), [events, profile, zoneAssessment]);

  const fallbackPlan = useMemo(
    () => classifiedEvents.length ? buildLocalDayPlan(classifiedEvents, profile, language) : null,
    [classifiedEvents, profile, language],
  );
  const plan = generatedPlan?.result ?? fallbackPlan;
  const source = generatedPlan?.source ?? (fallbackPlan ? 'offline-template' : '');

  function updateProfile(key, value) {
    setProfile((current) => ({ ...current, [key]: value }));
    setGeneratedPlan(null);
    setMessage('');
  }

  async function generatePlan() {
    if (!classifiedEvents.length) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await requestDayPlan(classifiedEvents, profile, language);
      setGeneratedPlan(response);
    } catch {
      setGeneratedPlan({ result: fallbackPlan, source: 'offline-template' });
      setMessage(language === 'hi' ? 'ऑफ़लाइन टेम्पलेट से योजना बनाई गई।' : 'Using the local offline template.');
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setEvents(sampleCalendar);
    setGeneratedPlan(null);
    setMessage('');
  }

  function importCalendar(text) {
    try {
      setEvents(parseIcsCalendar(text));
      setGeneratedPlan(null);
      setMessage('');
      setIcsError('');
    } catch (error) {
      setIcsError(error.message);
    }
  }

  async function importCalendarFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      importCalendar(await file.text());
    } catch {
      setIcsError('Could not read that calendar file.');
    }
    event.target.value = '';
  }

  function changeLanguage(value) {
    setLanguage(value);
    setGeneratedPlan(null);
  }

  const tipsByEvent = new Map((plan?.dayPlan ?? []).map(({ eventId, tipIds }) => [eventId, tipIds]));
  return (
    <section aria-label="Personal day planner" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Personal planner</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Plan your day</h3>
          <p className="mt-1 text-xs text-slate-500">Activity exposure is a local heuristic based on the selected zone’s prototype score.</p>
        </div>
        {source && <SourceBadge source={source} language={language} />}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <ProfileToggle label="Air purifier available" checked={profile.hasPurifier} onChange={(value) => updateProfile('hasPurifier', value)} />
        <ProfileToggle label="Windows open" checked={profile.windowsOpen} onChange={(value) => updateProfile('windowsOpen', value)} />
        <ProfileToggle label="Sensitive group profile" checked={profile.sensitiveGroup} onChange={(value) => updateProfile('sensitiveGroup', value)} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={loadSample} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-300/40">Load sample day</button>
        <label className="ml-auto text-xs text-slate-400">Language
          <select aria-label="Planner language" value={language} onChange={(event) => changeLanguage(event.target.value)} className="ml-2 rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-slate-100">
            <option value="en">English</option><option value="hi">Hindi</option>
          </select>
        </label>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="text-xs text-slate-400">Paste calendar (.ics)
          <textarea aria-label="Paste calendar ICS" value={icsText} onChange={(event) => setIcsText(event.target.value)} rows={2} className="mt-1.5 block w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200" placeholder="BEGIN:VCALENDAR …" />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => importCalendar(icsText)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-300/40">Import pasted .ics</button>
          <label className="cursor-pointer rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-300/40">
            Upload .ics<input type="file" accept=".ics,text/calendar" onChange={importCalendarFile} className="sr-only" />
          </label>
        </div>
      </div>
      {icsError && <p role="alert" className="mt-2 text-xs text-rose-300">{icsError}</p>}
      {classifiedEvents.length > 0 ? (
        <>
          <ol className="mt-4 space-y-2">
            {classifiedEvents.map((event) => (
              <li key={event.eventId} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{event.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {event.setting} · {event.exertion} exertion · {event.durationMin} min</p>
                  {event.unknownTitle && <p className="mt-1 text-[10px] text-amber-200/80">Unclassified title; using indoor, low exertion defaults.</p>}
                  {(tipsByEvent.get(event.eventId) ?? []).length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-300">
                      {tipsByEvent.get(event.eventId).map((tipId) => <li key={tipId}>• {getHabitText(tipId, language)}</li>)}
                    </ul>
                  )}
                </div>
                <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-700 px-2.5 py-1 text-[11px] font-semibold tabular-nums" style={{ color: riskColors[event.level] }} aria-label={`Exposure ${event.level}, score ${event.exposure}`}>
                  <span aria-hidden="true">{levelIcons[event.level]}</span>{event.level} · {event.exposure}
                </span>
              </li>
            ))}
          </ol>
          <button type="button" onClick={generatePlan} disabled={loading} className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60">
            {loading ? 'Preparing day plan…' : 'Generate day plan'}
          </button>
          {message && <p role="status" className="mt-2 text-xs text-slate-400">{message}</p>}
        </>
      ) : <p className="mt-4 rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-500">Load a sample day or import calendar events.</p>}
      <p className="mt-4 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] px-3 py-2 text-[11px] leading-5 text-amber-100/80">General precautions only, not medical advice.</p>
    </section>
  );
}

function ProfileToggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-xs text-slate-300">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="accent-cyan-400" />
      {label}
    </label>
  );
}
