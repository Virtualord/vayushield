import { useRef, useState } from 'react';
import SegmentedControl from './SegmentedControl.jsx';
import Icon from './Icon.jsx';

const tabs = [
  { value: 'zones', label: 'Zones' },
  { value: 'simulate', label: 'Simulate' },
  { value: 'ai', label: 'AI' },
  { value: 'plan', label: 'Plan' },
];
const levels = ['peek', 'half', 'full'];

export default function Sheet({ children }) {
  const [activeTab, setActiveTab] = useState('zones');
  const [level, setLevel] = useState('half');
  const pointerStart = useRef(null);
  const dragged = useRef(false);

  function onPointerDown(event) {
    pointerStart.current = event.clientY;
    dragged.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerUp(event) {
    if (pointerStart.current == null) return;
    const delta = event.clientY - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(delta) < 25) return;
    dragged.current = true;
    const index = levels.indexOf(level);
    setLevel(levels[Math.max(0, Math.min(2, index + (delta < 0 ? 1 : -1)))]);
  }

  return (
    <div className={`dashboard-sheet glass-panel sheet-${level}`}>
      <div className="mobile-sheet-header">
        <button type="button" className="sheet-grabber" aria-label={`Bottom sheet ${level}. Tap to change height`} onClick={() => { if (!dragged.current) setLevel((current) => levels[(levels.indexOf(current) + 1) % levels.length]); }} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { pointerStart.current = null; }}>
          <Icon name="grabber" size={28} />
        </button>
        <SegmentedControl label="Dashboard section" value={activeTab} options={tabs} onChange={setActiveTab} className="sheet-tabs" />
      </div>
      <div className="sheet-content">{children(activeTab)}</div>
    </div>
  );
}
