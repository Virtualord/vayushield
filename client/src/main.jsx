import { useEffect, useMemo, useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardHeader from './components/DashboardHeader.jsx';
import AICopilot from './components/AICopilot.jsx';
import HowWeCalculate from './components/HowWeCalculate.jsx';
import RankedZoneList from './components/RankedZoneList.jsx';
import RiskMap from './components/RiskMap.jsx';
import RiskCard from './components/RiskCard.jsx';
import SummaryStrip from './components/SummaryStrip.jsx';
import ScenarioSimulator from './components/ScenarioSimulator.jsx';
import CommunityImpact from './components/CommunityImpact.jsx';
import ActionPlan from './components/ActionPlan.jsx';
import PersonalPlanner from './components/PersonalPlanner.jsx';
import DemoModeBanner from './components/DemoModeBanner.jsx';
import { announceDemoMode, demoModeEventName } from './utils/demoMode.js';
import { checkApiHealth } from './services/healthCheck.js';
import { activeZones as zones } from './data/zones.js';
import { compareScenarios, groupImpact, rankZones } from './utils/riskEngine.js';
import { buildDashboardSummary } from './utils/dashboardSummary.js';
import './style.css';

function App() {
  const [demoMode, setDemoMode] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0].id);
  const [scenario, setScenario] = useState({
    windSpeed: null,
    traffic: 'normal',
    industry: 'normal',
  });
  const assessments = useMemo(() => rankZones(zones, scenario), [scenario]);
  const baselineScenario = { windSpeed: null, traffic: 'normal', industry: 'normal' };
  const baselineAssessments = useMemo(() => rankZones(zones, baselineScenario), []);
  const comparisons = useMemo(() => compareScenarios(zones, baselineScenario, scenario), [scenario]);
  const summary = useMemo(() => buildDashboardSummary(assessments), [assessments]);
  const topRankedZones = useMemo(() => assessments.slice(0, 3), [assessments]);
  const selectedAssessment = useMemo(
    () => assessments.find(({ zone }) => zone.id === selectedZoneId),
    [assessments, selectedZoneId],
  );
  const selectedGroupImpact = useMemo(
    () => selectedAssessment ? groupImpact(selectedAssessment) : [],
    [selectedAssessment],
  );

  useEffect(() => {
    const onDemoMode = () => setDemoMode(true);
    window.addEventListener(demoModeEventName, onDemoMode);
    checkApiHealth().then((healthy) => {
      if (!healthy) announceDemoMode('health-check');
    });
    return () => window.removeEventListener(demoModeEventName, onDemoMode);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <DemoModeBanner visible={demoMode} />
      <DashboardHeader />
      <main className="mx-auto max-w-7xl min-w-0 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
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
        <div className="mt-5">
          <ScenarioSimulator scenario={scenario} onScenarioChange={setScenario} zones={zones} />
        </div>
        <div className="mt-5">
          <RiskMap assessments={assessments} baselineAssessments={baselineAssessments} selectedZoneId={selectedZoneId} onSelect={setSelectedZoneId} />
        </div>
        <div className="mt-5 grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.4fr)]">
          <RankedZoneList
            assessments={assessments}
            baselineAssessments={baselineAssessments}
            comparisons={comparisons}
            selectedZoneId={selectedZoneId}
            onSelect={setSelectedZoneId}
          />
          {selectedAssessment && (
            <div className="min-w-0 space-y-4">
              <div className="grid min-w-0 items-start gap-4 xl:grid-cols-2">
                <RiskCard assessment={selectedAssessment} scenario={scenario} />
                <AICopilot
                  key={selectedAssessment.zone.id}
                  assessment={selectedAssessment}
                  scenario={scenario}
                />
              </div>
              <CommunityImpact impacts={selectedGroupImpact} zoneName={selectedAssessment.zone.name} />
              <ActionPlan rankedZones={topRankedZones} scenario={scenario} />
              <PersonalPlanner zoneAssessment={selectedAssessment} />
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
