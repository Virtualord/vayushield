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
    <div className="map-region">
      <section
        aria-label="Environmental risk map"
        className="risk-map absolute inset-0 overflow-hidden"
      >
        <MapContainer
        center={BHOPAL_CENTER}
        zoom={12}
        bounds={bounds}
        boundsOptions={{ padding: [28, 28] }}
        scrollWheelZoom={false}
        zoomControl={false}
        className="h-full w-full"
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
      <div className="map-legend glass-panel"><RiskLegend /><p>Inner fill: scenario level · outer ring: baseline level</p></div>
    </div>
  );
}
