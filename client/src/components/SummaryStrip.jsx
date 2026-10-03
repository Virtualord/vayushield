import GlassCard from './ui/GlassCard.jsx';
import ProgressRing from './ui/ProgressRing.jsx';

export default function SummaryStrip({ summary }) {
  return (
    <section aria-label="Bhopal summary indicators" className="summary-widgets">
      <GlassCard className="summary-aqi">
        <div><p className="widget-label">Air quality index</p><p className="summary-category">{summary.category}</p></div>
        <ProgressRing value={summary.aqi} max={500} label={`AQI ${summary.aqi}, ${summary.category}`} />
      </GlassCard>
      <SummaryWidget label="Population-weighted PM2.5" value={summary.weightedPM25.toFixed(1)} unit="µg/m³" />
      <SummaryWidget label="Critical zones" value={summary.criticalCount} />
      <SummaryWidget label="High zones" value={summary.highCount} />
      <SummaryWidget label="Population in high or critical zones" value={summary.highOrCriticalPopulation.toLocaleString('en-IN')} />
    </section>
  );
}

function SummaryWidget({ label, value, unit }) {
  return <GlassCard className="summary-widget"><p className="widget-label">{label}</p><p className="widget-value">{value}{unit && <span>{unit}</span>}</p></GlassCard>;
}
