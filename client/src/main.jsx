import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
      <h1 className="text-4xl font-semibold tracking-tight">VayuShield</h1>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
