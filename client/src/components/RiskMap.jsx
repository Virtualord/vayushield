import { Fragment } from 'react';
import { CircleMarker, MapContainer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { markerRadius, riskColors } from '../utils/riskMapPresentation.js';
import MapSelectionSync from './MapSelectionSync.jsx';
import MapControls from './MapControls.jsx';
import RiskLegend from './RiskLegend.jsx';
import TileFailureNotice from './TileFailureNotice.jsx';

const BHOPAL_CENTER = [23.2599, 77.4126];
export default function RiskMap({ assessments, baselineAssessments = assessments, selectedZoneId, onSelect }) {
  const maxPopulation = Math.max(...assessments.map(({ zone }) => zone.population), 1);
  const baselineById = new Map(baselineAssessments.map((assessment) => [assessment.zone.id, assessment]));
  const bounds = assessments.length
    ? assessments.map(({ zone }) => [zone.lat, zone.lng])
    : [BHOPAL_CENTER];

  return (
    <div>
      <section
        aria-label="Environmental risk map"
        className="risk-map relative overflow-hidden rounded-t-2xl border border-slate-800 border-b-0"
      >
        <MapContainer
        center={BHOPAL_CENTER}
        zoom={12}
        bounds={bounds}
        boundsOptions={{ padding: [28, 28] }}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-72 w-full sm:h-96"
      >
        <MapControls />
        <MapSelectionSync assessments={assessments} selectedZoneId={selectedZoneId} />
        <TileFailureNotice />
        {assessments.map(({ zone, level }) => {
          const baseline = baselineById.get(zone.id);
          const radius = markerRadius(zone.population, maxPopulation);
          return (
            <Fragment key={zone.id}>
              <CircleMarker center={[zone.lat, zone.lng]} radius={radius + 4} pathOptions={{ color: riskColors[baseline?.level ?? level], fillOpacity: 0, weight: 2 }} />
              <CircleMarker
                center={[zone.lat, zone.lng]}
                radius={radius}
                pathOptions={{ color: zone.id === selectedZoneId ? '#e2e8f0' : riskColors[level], fillColor: riskColors[level], fillOpacity: 0.82, weight: zone.id === selectedZoneId ? 3 : 1.5 }}
                eventHandlers={{ click: () => onSelect(zone.id) }}
              >
                <Tooltip permanent direction="center" className="risk-map-label">{level}</Tooltip>
              </CircleMarker>
            </Fragment>
          );
        })}
        </MapContainer>
      </section>
      <RiskLegend />
      <p className="rounded-b-2xl border border-t-0 border-slate-800 bg-slate-900/60 px-4 py-2 text-[11px] text-slate-400">Inner fill: scenario level · outer ring: baseline level</p>
    </div>
  );
}
