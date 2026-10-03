export default function MapControlButtons({ onZoomIn, onZoomOut }) {
  return (
    <div role="group" aria-label="Map controls" className="map-control-buttons absolute right-3 top-3 z-[1000] flex flex-col gap-1">
      <button type="button" aria-label="Zoom map in" onClick={(event) => { event.stopPropagation(); onZoomIn(); }} className="grid size-9 place-items-center rounded-lg border border-slate-600 bg-slate-950/95 text-lg font-semibold text-white shadow-lg hover:bg-slate-800">
        <span aria-hidden="true">+</span>
      </button>
      <button type="button" aria-label="Zoom map out" onClick={(event) => { event.stopPropagation(); onZoomOut(); }} className="grid size-9 place-items-center rounded-lg border border-slate-600 bg-slate-950/95 text-lg font-semibold text-white shadow-lg hover:bg-slate-800">
        <span aria-hidden="true">−</span>
      </button>
    </div>
  );
}
