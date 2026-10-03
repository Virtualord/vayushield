import { useMap } from 'react-leaflet';
import MapControlButtons from './MapControlButtons.jsx';

export default function MapControls() {
  const map = useMap();
  return <MapControlButtons onZoomIn={() => map.zoomIn()} onZoomOut={() => map.zoomOut()} />;
}
