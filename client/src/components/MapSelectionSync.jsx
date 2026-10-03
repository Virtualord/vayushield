import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapSelectionSync({ assessments, selectedZoneId }) {
  const map = useMap();

  useEffect(() => {
    const selectedZone = assessments.find(({ zone }) => zone.id === selectedZoneId)?.zone;
    if (selectedZone) map.panTo([selectedZone.lat, selectedZone.lng]);
  }, [assessments, map, selectedZoneId]);

  return null;
}
