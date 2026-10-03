import { useMemo, useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardHeader from './components/DashboardHeader.jsx';
import HowWeCalculate from './components/HowWeCalculate.jsx';
import RankedZoneList from './components/RankedZoneList.jsx';
import RiskCard from './components/RiskCard.jsx';
import SummaryStrip from './components/SummaryStrip.jsx';
import { zones } from './data/zones.js';
import { rankZones } from './utils/riskEngine.js';
import { buildDashboardSummary } from './utils/dashboardSummary.js';
import './style.css';

function App() {
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0].id);
  const [scenario] = useState({
    windSpeed: null,
    traffic: 'normal',
    industry: 'normal',
  });
  const assessments = useMemo(() => rankZones(zones, scenario), [scenario]);
  const summary = useMemo(() => buildDashboardSummary(assessments), [assessments]);
  const selectedAssessment = useMemo(
    () => assessments.find(({ zone }) => zone.id === selectedZoneId),
    [assessments, selectedZoneId],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Prototype dashboard
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Neighborhood overview
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {zones.length} illustrative Bhopal zones
          </p>
        </div>
        <SummaryStrip summary={summary} />
        <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(17rem,0.85fr)_minmax(0,1.4fr)]">
          <RankedZoneList
            assessments={assessments}
            selectedZoneId={selectedZoneId}
            onSelect={setSelectedZoneId}
          />
          {selectedAssessment && (
            <div className="space-y-4">
              <RiskCard assessment={selectedAssessment} scenario={scenario} />
              <HowWeCalculate />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
