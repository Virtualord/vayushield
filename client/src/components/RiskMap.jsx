import { CircleMarker, MapContainer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { markerRadius, riskColors } from '../utils/riskMapPresentation.js';
import MapSelectionSync from './MapSelectionSync.jsx';
import RiskLegend from './RiskLegend.jsx';
import TileFailureNotice from './TileFailureNotice.jsx';

const BHOPAL_CENTER = [23.2599, 77.4126];
export default function RiskMap({ assessments, selectedZoneId, onSelect }) {
  const maxPopulation = Math.max(...assessments.map(({ zone }) => zone.population), 1);
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
        className="h-72 w-full sm:h-96"
      >
        <MapSelectionSync assessments={assessments} selectedZoneId={selectedZoneId} />
        <TileFailureNotice />
        {assessments.map(({ zone, level }) => (
          <CircleMarker
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={markerRadius(zone.population, maxPopulation)}
            pathOptions={{
              color: zone.id === selectedZoneId ? '#e2e8f0' : riskColors[level],
              fillColor: riskColors[level],
              fillOpacity: 0.82,
              weight: zone.id === selectedZoneId ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect(zone.id) }}
          >
            <Tooltip permanent direction="center" className="risk-map-label">
              {level}
            </Tooltip>
          </CircleMarker>
        ))}
        </MapContainer>
      </section>
      <RiskLegend />
    </div>
  );
}
