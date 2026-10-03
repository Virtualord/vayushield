import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export default function MapSelectionSync({ assessments, selectedZoneId }) {
  const map = useMap();
  const previousSelectedZoneId = useRef(selectedZoneId);

  useEffect(() => {
    if (previousSelectedZoneId.current === selectedZoneId) return;

    const selectedZone = assessments.find(({ zone }) => zone.id === selectedZoneId)?.zone;
    previousSelectedZoneId.current = selectedZoneId;
    if (selectedZone) map.panTo([selectedZone.lat, selectedZone.lng]);
  }, [assessments, map, selectedZoneId]);

  return null;
}
