import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardHeader from './components/DashboardHeader.jsx';
import { zones } from './data/zones.js';
import './style.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Prototype dashboard
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Neighborhood overview
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            {zones.length} illustrative Bhopal zones
          </p>
        </div>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <p className="text-sm leading-6 text-slate-300">
            VayuShield combines illustrative environmental inputs with a deterministic
            Environmental Risk Score for each zone.
          </p>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Prototype scores are separate from the input data and are not official
            measurements.
          </p>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
