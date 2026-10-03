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
import Sheet from './components/ui/Sheet.jsx';
import RiskLegend from './components/RiskLegend.jsx';
import presets from './data/scenarioPresets.json';
import { announceDemoMode, demoModeEventName } from './utils/demoMode.js';
import { checkApiHealth } from './services/healthCheck.js';
import { activeZones as zones } from './data/zones.js';
import { compareScenarios, groupImpact, rankZones } from './utils/riskEngine.js';
import { buildDashboardSummary } from './utils/dashboardSummary.js';
import './style.css';

function App() {
  const [demoMode, setDemoMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [audience, setAudience] = useState('authority');
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem('vayushield-theme');
      return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'system';
    } catch {
      return 'system';
    }
  });
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

  useEffect(() => {
    if (theme === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    try {
      if (theme === 'system') window.localStorage.removeItem('vayushield-theme');
      else window.localStorage.setItem('vayushield-theme', theme);
    } catch {
      // Theme remains usable when storage is unavailable.
    }
  }, [theme]);

  return (
    <div className="app-shell motion-ready min-h-screen">
      <DemoModeBanner visible={demoMode} />
      <RiskMap assessments={assessments} baselineAssessments={baselineAssessments} selectedZoneId={selectedZoneId} onSelect={setSelectedZoneId} />
      <DashboardHeader theme={theme} onThemeChange={setTheme} scenario={scenario} onScenarioChange={setScenario} presets={presets} language={language} onLanguageChange={setLanguage} audience={audience} onAudienceChange={setAudience} />
      <main className="map-dashboard">
        <Sheet>{(activeTab) => <>
        <aside className="dashboard-sidebar sheet-pane" data-sheet-tab="zones" data-sheet-hidden={activeTab !== 'zones'}>
          <div className="mobile-sheet-legend"><RiskLegend /></div>
          <div className="sidebar-heading">
            <div><p className="eyebrow">Prototype dashboard</p><h2>Neighborhood overview</h2></div>
            <span>{zones.length} zones</span>
          </div>
          <SummaryStrip summary={summary} />
          <RankedZoneList
            assessments={assessments}
            baselineAssessments={baselineAssessments}
            comparisons={comparisons}
            selectedZoneId={selectedZoneId}
            onSelect={setSelectedZoneId}
          />
          {selectedAssessment && <RiskCard assessment={selectedAssessment} scenario={scenario} />}
        </aside>
        <div className="dashboard-inspector glass-panel">
          <section className="sheet-pane" data-sheet-tab="simulate" data-sheet-hidden={activeTab !== 'simulate'}><ScenarioSimulator scenario={scenario} onScenarioChange={setScenario} zones={zones} /></section>
          {selectedAssessment && <section className="sheet-pane" data-sheet-tab="ai" data-sheet-hidden={activeTab !== 'ai'}><AICopilot key={selectedAssessment.zone.id} assessment={selectedAssessment} scenario={scenario} language={language} onLanguageChange={setLanguage} audience={audience} onAudienceChange={setAudience} /></section>}
          {selectedAssessment && <section className="sheet-pane" data-sheet-tab="plan" data-sheet-hidden={activeTab !== 'plan'}>
          <CommunityImpact impacts={selectedGroupImpact} zoneName={selectedAssessment.zone.name} />
          <ActionPlan rankedZones={topRankedZones} scenario={scenario} language={language} onLanguageChange={setLanguage} audience={audience} onAudienceChange={setAudience} />
          <PersonalPlanner zoneAssessment={selectedAssessment} language={language} onLanguageChange={setLanguage} />
          <HowWeCalculate />
          </section>}
        </div>
        </>}</Sheet>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
