import { useState } from 'react';
import { TileLayer } from 'react-leaflet';

export default function TileFailureNotice() {
  const [tilesUnavailable, setTilesUnavailable] = useState(false);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        eventHandlers={{ tileerror: () => setTilesUnavailable(true) }}
      />
      {tilesUnavailable && (
        <div role="status" className="absolute left-2 top-2 z-[1000] rounded-lg border border-slate-700 bg-slate-950/90 px-2.5 py-1.5 text-[11px] text-slate-300">
          Map tiles unavailable
        </div>
      )}
    </>
  );
}
