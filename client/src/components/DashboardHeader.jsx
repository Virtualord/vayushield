export default function DashboardHeader({ theme = 'system', onThemeChange = () => {}, scenario, onScenarioChange, presets = [] }) {
  return (
    <header className="map-toolbar glass-panel">
      <div className="toolbar-brand">
        <div><p className="eyebrow">Bhopal environmental intelligence</p><h1>VayuShield</h1></div>
        <span className="illustrative-pill"><span className="status-dot" />Illustrative data</span>
      </div>
      {scenario && <div className="toolbar-presets" aria-label="Scenario presets">
        {presets.map(({ name, scenario: preset }) => <button type="button" key={name} aria-pressed={JSON.stringify(scenario) === JSON.stringify(preset)} onClick={() => onScenarioChange(preset)}>{name}</button>)}
      </div>}
      <div className="toolbar-actions">
        <button type="button" className="theme-button" aria-label={`Theme: ${theme}. Activate to cycle appearance`} onClick={() => onThemeChange(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system')}>
          <span aria-hidden="true">{theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}</span><span className="sr-only"> appearance</span>
        </button>
      </div>
    </header>
  );
}
