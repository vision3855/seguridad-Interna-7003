import { useState } from "react";

// ── Spinner Component ────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

  .spinner-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .spinner-ring {
    width: var(--spinner-size, 40px);
    height: var(--spinner-size, 40px);
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: var(--spinner-color, #0ea5e9);
    border-right-color: var(--spinner-color, #0ea5e9);
    animation: spin 0.65s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    box-shadow: 0 0 12px -2px var(--spinner-glow, rgba(14, 165, 233, 0.4));
  }

  .spinner-ring--sm { --spinner-size: 20px; border-width: 2px; }
  .spinner-ring--md { --spinner-size: 40px; border-width: 3px; }
  .spinner-ring--lg { --spinner-size: 64px; border-width: 4px; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Demo page ── */
  .demo-page {
    min-height: 100vh;
    background: #09090b;
    color: #fafafa;
    font-family: 'DM Mono', monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 48px;
    padding: 40px;
  }

  .demo-title {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #52525b;
    margin: 0;
  }

  .demo-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 48px;
    align-items: center;
    justify-content: center;
  }

  .demo-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .demo-label {
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #3f3f46;
  }

  .demo-divider {
    width: 1px;
    height: 48px;
    background: #27272a;
  }

  .toggle-btn {
    background: none;
    border: 1px solid #27272a;
    color: #a1a1aa;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: 10px 24px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .toggle-btn:hover {
    border-color: #0ea5e9;
    color: #0ea5e9;
  }

  .status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0ea5e9;
    margin-right: 8px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .status-dot--off {
    background: #3f3f46;
    animation: none;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

// ── Spinner ──────────────────────────────────────────────────────────────────
/**
 * Spinner component
 *
 * Props:
 *   loading  {boolean}  – show the spinner when true
 *   size     {'sm'|'md'|'lg'}  – default 'md'
 *   color    {string}   – CSS color for the arc, default sky-blue
 */
export function Spinner({ loading, size = "md", color }) {
  if (!loading) return null;

  const inlineVars = color
    ? { "--spinner-color": color, "--spinner-glow": `${color}66` }
    : {};

  return (
    <span className="spinner-wrapper" role="status" aria-label="Loading">
      <span
        className={`spinner-ring spinner-ring--${size}`}
        style={inlineVars}
      />
    </span>
  );
}

// ── Demo ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <style>{styles}</style>

      <div className="demo-page">

        <div className="demo-grid">
          {/* Sizes */}
          

          {/* Custom color */}
          <div className="demo-card">
            <Spinner loading={loading} size="md" color="#a78bfa" />
            <span className="demo-label">Estamos buscando tus datos...</span>
          </div>
        </div>

        {/* Toggle */}
        <button
          className="toggle-btn"
          onClick={() => setLoading((v) => !v)}
        >
          <span className={`status-dot${loading ? "" : " status-dot--off"}`} />
          loading
        </button>
      </div>
    </>
  );
}