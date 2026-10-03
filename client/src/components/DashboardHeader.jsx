import SegmentedControl from './ui/SegmentedControl.jsx';
import Icon from './ui/Icon.jsx';

export default function DashboardHeader({ theme = 'system', onThemeChange = () => {}, scenario, onScenarioChange, presets = [], language = 'en', onLanguageChange = () => {}, audience = 'authority', onAudienceChange = () => {} }) {
  const systemIsDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return (
    <header className="map-toolbar glass-panel">
      <div className="toolbar-brand">
        <div><p className="eyebrow">Bhopal environmental intelligence</p><h1>VayuShield</h1></div>
        <span className="illustrative-pill"><span className="status-dot" />Illustrative data</span>
      </div>
      {scenario && <div className="toolbar-presets" aria-label="Scenario presets">
        {presets.map(({ name, scenario: preset }) => <button type="button" key={name} aria-pressed={JSON.stringify(scenario) === JSON.stringify(preset)} onClick={() => onScenarioChange(preset)}>{name}</button>)}
      </div>}
      <div className="toolbar-locale-controls">
        <SegmentedControl label="Language" value={language} onChange={onLanguageChange} options={[{ value: 'en', label: 'EN' }, { value: 'hi', label: 'हिंदी' }]} />
        <SegmentedControl label="Audience" value={audience} onChange={onAudienceChange} options={[{ value: 'authority', label: 'Authority' }, { value: 'resident', label: 'Resident' }]} />
      </div>
      <div className="toolbar-actions">
        <button type="button" className="theme-button" aria-label={`Theme: ${theme}. Activate to cycle appearance`} onClick={() => onThemeChange(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system')}>
          <Icon name={theme === 'dark' || (theme === 'system' && systemIsDark) ? 'moon' : 'sun'} size={17} />
          <span>{theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}</span>
        </button>
      </div>
    </header>
  );
}
