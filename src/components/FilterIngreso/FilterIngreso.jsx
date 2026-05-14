import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const BASE_URL = "https://segintco7003.onrender.com/api/patanas";

/* ─── CSS-in-JS via a <style> tag injected once ─────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;600;700;800&display=swap');

  .fi-root {
    --ink: #0e0f11;
    --ink2: #3a3d44;
    --ink3: #7a7f8a;
    --surface: #f7f6f2;
    --card: #ffffff;
    --accent: #c8f04e;
    --accent-dark: #93b32a;
    --accent-ink: #1a2200;
    --danger: #ff4d4d;
    --success: #00c48c;
    --border: rgba(14,15,17,0.10);
    --border-strong: rgba(14,15,17,0.22);
    --radius: 10px;
    --radius-lg: 16px;
    --mono: 'DM Mono', monospace;
    --display: 'Syne', sans-serif;
    font-family: var(--mono);
    background: var(--surface);
    color: var(--ink);
    min-height: 100vh;
    padding: 0;
    margin: 0;
  }

  /* ── Page shell ── */
  .fi-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 2rem 4rem;
    animation: fi-fadein .4s ease both;
  }

  @keyframes fi-fadein {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  .fi-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .fi-title-block {}
  .fi-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .18em;
    color: var(--ink3);
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .fi-title {
    font-family: var(--display);
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 800;
    line-height: 1;
    color: var(--ink);
    letter-spacing: -.02em;
    margin: 0;
  }
  .fi-title span {
    display: inline-block;
    background: var(--accent);
    color: var(--accent-ink);
    padding: 0 10px 2px;
    border-radius: 6px;
    margin-left: 8px;
  }

  /* ── Stat pills ── */
  .fi-stats {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .fi-stat {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 18px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 110px;
    transition: border-color .2s, transform .15s;
  }
  .fi-stat:hover { border-color: var(--border-strong); transform: translateY(-1px); }
  .fi-stat-label {
    font-size: 10px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--ink3);
  }
  .fi-stat-val {
    font-family: var(--display);
    font-weight: 700;
    font-size: 20px;
    color: var(--ink);
    line-height: 1;
  }
  .fi-stat-val.accent { color: var(--accent-dark); }

  /* ── Filter card ── */
  .fi-filter-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }
  .fi-filter-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
  }
  .fi-filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }
  .fi-filter-heading {
    font-family: var(--display);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--ink2);
  }
  .fi-filter-actions { display: flex; gap: 8px; }

  /* ── Form grid ── */
  .fi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
  }
  .fi-grid-wide { grid-column: span 2; }

  .fi-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .fi-label {
    font-size: 10px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--ink3);
    font-family: var(--mono);
  }
  .fi-input, .fi-select {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    padding: 8px 12px;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    width: 100%;
    box-sizing: border-box;
    -webkit-appearance: none;
    appearance: none;
  }
  .fi-input::placeholder { color: var(--ink3); }
  .fi-input:focus, .fi-select:focus {
    border-color: var(--accent-dark);
    box-shadow: 0 0 0 3px rgba(147,179,42,.18);
  }
  .fi-select {
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%237a7f8a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    cursor: pointer;
  }

  .fi-range-pair { display: flex; gap: 8px; }
  .fi-range-pair .fi-input { flex: 1; min-width: 0; }

  .fi-divider { height: 1px; background: var(--border); margin: 1.25rem 0; }

  /* ── Buttons ── */
  .fi-btn {
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .06em;
    border-radius: var(--radius);
    border: 1px solid var(--border-strong);
    background: transparent;
    color: var(--ink2);
    padding: 8px 16px;
    cursor: pointer;
    transition: background .15s, color .15s, border-color .15s, transform .1s;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .fi-btn:hover { background: var(--surface); border-color: var(--ink2); }
  .fi-btn:active { transform: scale(.97); }

  .fi-btn-primary {
    background: var(--accent);
    color: var(--accent-ink);
    border-color: var(--accent);
    font-weight: 600;
  }
  .fi-btn-primary:hover { background: #b8e038; border-color: #b8e038; }
  .fi-btn-primary:disabled { opacity: .45; cursor: not-allowed; transform: none; }

  .fi-btn-ghost {
    border-color: transparent;
    color: var(--ink3);
    padding: 8px 10px;
  }
  .fi-btn-ghost:hover { background: var(--surface); color: var(--ink2); border-color: var(--border); }

  .fi-btn-danger {
    color: var(--danger);
    border-color: rgba(255,77,77,.3);
  }
  .fi-btn-danger:hover { background: rgba(255,77,77,.06); }

  .fi-btn-sm { padding: 5px 12px; font-size: 11px; }

  /* ── Table card ── */
  .fi-table-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .fi-table-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 10px;
  }
  .fi-table-bar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .fi-table-title {
    font-family: var(--display);
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
  }
  .fi-count-badge {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 99px;
    padding: 2px 10px;
    font-size: 11px;
    color: var(--ink3);
    font-family: var(--mono);
  }
  .fi-table-bar-right { display: flex; gap: 8px; }

  .fi-table-scroll { overflow-x: auto; }
  table.fi-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
    font-family: var(--mono);
  }
  table.fi-table thead {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }
  table.fi-table th {
    padding: 10px 16px;
    text-align: left;
    font-size: 10px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--ink3);
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    border-right: 1px solid var(--border);
    transition: color .15s, background .15s;
  }
  table.fi-table th:last-child { border-right: none; cursor: default; }
  table.fi-table th:hover:not(:last-child) { color: var(--ink); background: rgba(200,240,78,.12); }
  table.fi-table th.fi-th-sorted { color: var(--accent-dark); }
  table.fi-table td {
    padding: 11px 16px;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
    color: var(--ink2);
    vertical-align: middle;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  table.fi-table td:last-child { border-right: none; }
  table.fi-table tr:last-child td { border-bottom: none; }
  table.fi-table tbody tr {
    transition: background .1s;
    cursor: pointer;
  }
  table.fi-table tbody tr:hover td { background: rgba(200,240,78,.07); }

  /* ── Badges ── */
  .fi-badge {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 99px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    font-family: var(--mono);
  }
  .fi-badge-green  { background: rgba(0,196,140,.12); color: #007a58; }
  .fi-badge-blue   { background: rgba(56,138,255,.12); color: #1853b4; }
  .fi-badge-amber  { background: rgba(255,180,0,.15);  color: #8a5400; }
  .fi-badge-gray   { background: var(--surface); color: var(--ink3); border: 1px solid var(--border); }
  .fi-null { color: var(--ink3); font-size: 11px; }

  /* ── Detail drawer ── */
  .fi-drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(14,15,17,.35);
    z-index: 100;
    animation: fi-bdin .2s ease both;
  }
  @keyframes fi-bdin { from { opacity: 0; } to { opacity: 1; } }

  .fi-drawer {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: min(460px, 96vw);
    background: var(--card);
    border-left: 1px solid var(--border-strong);
    z-index: 101;
    overflow-y: auto;
    animation: fi-slidein .22s cubic-bezier(.22,1,.36,1) both;
    display: flex;
    flex-direction: column;
  }
  @keyframes fi-slidein {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }
  .fi-drawer-head {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: sticky;
    top: 0;
    background: var(--card);
    z-index: 1;
  }
  .fi-drawer-head-title {
    font-family: var(--display);
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.2;
  }
  .fi-drawer-head-sub { font-size: 12px; color: var(--ink3); margin-top: 4px; }
  .fi-drawer-body { padding: 1.5rem; flex: 1; }
  .fi-drawer-section { margin-bottom: 1.5rem; }
  .fi-drawer-section-title {
    font-size: 9px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--ink3);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .fi-drawer-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .fi-drawer-field {}
  .fi-drawer-field-label { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink3); margin-bottom: 3px; }
  .fi-drawer-field-val { font-size: 14px; color: var(--ink); font-family: var(--mono); word-break: break-all; }
  .fi-drawer-field-val.mono-id { font-size: 11px; color: var(--ink3); }
  .fi-drawer-field-wide { grid-column: span 2; }

  /* ── Pagination ── */
  .fi-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
    gap: 10px;
  }
  .fi-page-info { font-size: 12px; color: var(--ink3); }
  .fi-page-btns { display: flex; gap: 4px; }
  .fi-page-btn {
    font-family: var(--mono);
    font-size: 12px;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--ink2);
    cursor: pointer;
    transition: background .12s, color .12s, border-color .12s;
  }
  .fi-page-btn:hover:not(:disabled):not(.active) { background: var(--surface); border-color: var(--border-strong); }
  .fi-page-btn.active { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); font-weight: 600; }
  .fi-page-btn:disabled { opacity: .3; cursor: default; }

  /* ── States ── */
  .fi-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 4rem 2rem; gap: 16px;
  }
  .fi-spinner {
    width: 32px; height: 32px;
    border: 2.5px solid var(--border);
    border-top-color: var(--accent-dark);
    border-radius: 50%;
    animation: fi-spin .7s linear infinite;
  }
  @keyframes fi-spin { to { transform: rotate(360deg); } }
  .fi-loading-text { font-size: 13px; color: var(--ink3); }

  .fi-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 4rem 2rem; gap: 10px;
    color: var(--ink3);
  }
  .fi-empty-icon { font-size: 36px; }
  .fi-empty-msg { font-size: 14px; }
  .fi-empty-sub { font-size: 12px; color: var(--ink3); }

  .fi-error-bar {
    background: rgba(255,77,77,.08);
    border: 1px solid rgba(255,77,77,.25);
    border-radius: var(--radius);
    padding: 10px 16px;
    font-size: 13px;
    color: #c0392b;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Sort arrow ── */
  .fi-sort-arrow { font-size: 9px; margin-left: 4px; opacity: .7; }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .fi-page { padding: 1.25rem 1rem 3rem; }
    .fi-grid { grid-template-columns: 1fr 1fr; }
    .fi-header { flex-direction: column; align-items: flex-start; }
    .fi-stats { width: 100%; }
    .fi-stat { flex: 1; min-width: 80px; }
    .fi-drawer-fields { grid-template-columns: 1fr; }
    .fi-drawer-field-wide { grid-column: span 1; }
  }
`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const TYPE_BADGE = {
  TERCERO: "fi-badge-amber",
  ISM: "fi-badge-green"
};

function Badge({ value }) {
  if (!value) return <span className="fi-null">—</span>;
  return <span className={`fi-badge ${TYPE_BADGE[value] || "fi-badge-gray"}`}>{value}</span>;
}

function NullableCell({ value }) {
  if (value == null || value === "") return <span className="fi-null">—</span>;
  return <>{value}</>;
}

function SortIcon({ col, sortBy, sortOrder }) {
  if (sortBy !== col) return <span className="fi-sort-arrow">↕</span>;
  return <span className="fi-sort-arrow">{sortOrder === "asc" ? "↑" : "↓"}</span>;
}

function Pagination({ page, totalPages, onPage }) {
  const pages = [];
  const add = (n) => pages.push(n);
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) add(i);
  } else if (page <= 4) {
    [1,2,3,4,5,"…",totalPages].forEach(add);
  } else if (page >= totalPages - 3) {
    [1,"…",totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages].forEach(add);
  } else {
    [1,"…",page-1,page,page+1,"…",totalPages].forEach(add);
  }

  return (
    <div className="fi-page-btns">
      <button className="fi-page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`ellipsis-${i}`} style={{ display:"flex",alignItems:"center",padding:"0 4px",fontSize:12,color:"var(--ink3)" }}>…</span>
          : <button key={`page-${i}-${p}`} className={`fi-page-btn${p === page ? " active" : ""}`} onClick={() => onPage(p)}>{p}</button>
      )}
      <button className="fi-page-btn" disabled={page === totalPages} onClick={() => onPage(page + 1)}>›</button>
    </div>
  );
}

/* ─── Detail Drawer ──────────────────────────────────────────────────────── */
function DetailDrawer({ record, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const f = (label, value, wide = false, mono = false) => (
    <div className={`fi-drawer-field${wide ? " fi-drawer-field-wide" : ""}`}>
      <div className="fi-drawer-field-label">{label}</div>
      <div className={`fi-drawer-field-val${mono ? " mono-id" : ""}`}>
        {value == null || value === "" ? <span className="fi-null">—</span> : String(value)}
      </div>
    </div>
  );

  return (
    <>
      <div className="fi-drawer-backdrop" onClick={onClose} />
      <div className="fi-drawer" role="dialog" aria-modal="true" aria-label="Record detail">
        <div className="fi-drawer-head">
          <div>
            <div className="fi-drawer-head-title">{record.driver}</div>
            <div className="fi-drawer-head-sub">{record.dia} · <Badge value={record.patanaType} /></div>
          </div>
          <button className="fi-btn fi-btn-ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="fi-drawer-body">
          <div className="fi-drawer-section">
            <div className="fi-drawer-section-title">Identification</div>
            <div className="fi-drawer-fields">
              {f("Record ID", record._id, true, true)}
              {f("Patana type", record.patanaType)}
              {f("Date", record.dia)}
            </div>
          </div>
          <div className="fi-drawer-section">
            <div className="fi-drawer-section-title">Vehicle & driver</div>
            <div className="fi-drawer-fields">
              {f("Driver", record.driver)}
              {f("Placa", record.placa)}
              {f("Ficha", record.ficha)}
              {f("Placa unidad", record.placaUnidad)}
            </div>
          </div>
          <div className="fi-drawer-section">
            <div className="fi-drawer-section-title">Cargo</div>
            <div className="fi-drawer-fields">
              {f("Productos", record.productos, true)}
              {f("Separadores", record.separadores)}
              {f("Paletas", record.paletas)}
            </div>
          </div>
          <div className="fi-drawer-section">
            <div className="fi-drawer-section-title">Metadata</div>
            <div className="fi-drawer-fields">
              {f("Created by", record.createdBy?.name || record.createdBy || "—")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
const COLS = [
  { key: "patanaType", label: "Type",        w: "110px" },
  { key: "dia",        label: "Date",        w: "120px" },
  { key: "driver",     label: "Driver",      w: "170px" },
  { key: "placa",      label: "Placa",       w: "90px"  },
  { key: "productos",  label: "Productos",   w: "200px" },
  { key: "separadores",label: "Sep.",        w: "70px"  },
  { key: "paletas",    label: "Pal.",        w: "70px"  },
  { key: "ficha",      label: "Ficha",       w: "90px"  },
  { key: "placaUnidad",label: "Unidad",      w: "90px"  },
];

const INIT_FILTERS = {
  patanaType: "", driver: "", productos: "", dia: "",
  placa: "", ficha: "",
  minSeparadores: "", maxSeparadores: "",
  minPaletas: "", maxPaletas: "",
  startDate: "", endDate: "",
};

export default function FilterIngreso() {
  const [filters, setFilters]     = useState(INIT_FILTERS);
  const [applied, setApplied]     = useState(INIT_FILTERS);
  const [rows, setRows]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(1);
  const [limit, setLimit]         = useState(20);
  const [sortBy, setSortBy]       = useState("dia");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [selected, setSelected]   = useState(null);
  const [stats, setStats]         = useState({ total: 0, sep: 0, pal: 0, drivers: 0 });
  const styleRef = useRef(false);

  /* Inject CSS once */
  useEffect(() => {
    if (styleRef.current) return;
    styleRef.current = true;
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);

  /* ── Fetch ── */
  const fetchData = useCallback(async (pg = page, a = applied, sb = sortBy, so = sortOrder, lim = limit) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: pg, limit: lim, sortBy: sb, sortOrder: so };
      if (a.patanaType)      params.patanaType = a.patanaType;
      if (a.driver)          params.driver = a.driver;
      if (a.productos)       params.productos = a.productos;
      if (a.dia)             params.dia = a.dia;
      if (a.placa)           params.placa = a.placa;
      if (a.ficha)           params.ficha = a.ficha;
      if (a.minSeparadores)  params.minSeparadores = a.minSeparadores;
      if (a.maxSeparadores)  params.maxSeparadores = a.maxSeparadores;
      if (a.minPaletas)      params.minPaletas = a.minPaletas;
      if (a.maxPaletas)      params.maxPaletas = a.maxPaletas;
      if (a.startDate)       params.startDate = a.startDate;
      if (a.endDate)         params.endDate = a.endDate;

      const { data } = await axios.get(BASE_URL, { params });
      setRows(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);

      /* quick stat pass over returned data */
      const allRows = data.data || [];
      setStats({
        total: data.total || 0,
        sep: allRows.reduce((s, r) => s + (r.separadores || 0), 0),
        pal: allRows.reduce((s, r) => s + (r.paletas || 0), 0),
        drivers: new Set(allRows.map((r) => r.driver)).size,
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Error connecting to server.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, applied, sortBy, sortOrder, limit]);

  useEffect(() => { fetchData(page, applied, sortBy, sortOrder, limit); }, []); // eslint-disable-line

  /* ── Actions ── */
  const handleSearch = () => {
    setApplied({ ...filters });
    setPage(1);
    fetchData(1, filters, sortBy, sortOrder, limit);
  };

  const handleClear = () => {
    setFilters(INIT_FILTERS);
    setApplied(INIT_FILTERS);
    setPage(1);
    fetchData(1, INIT_FILTERS, sortBy, sortOrder, limit);
  };

  const handleSort = (key) => {
    const newOrder = sortBy === key && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(key);
    setSortOrder(newOrder);
    fetchData(page, applied, key, newOrder, limit);
  };

  const handlePage = (p) => {
    setPage(p);
    fetchData(p, applied, sortBy, sortOrder, limit);
  };

  const handleLimit = (e) => {
    const l = +e.target.value;
    setLimit(l);
    setPage(1);
    fetchData(1, applied, sortBy, sortOrder, l);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSearch(); };

  const setF = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  /* ── CSV export ── */
  const exportCSV = () => {
    const headers = COLS.map((c) => c.label).join(",");
    const lines = rows.map((r) =>
      COLS.map((c) => JSON.stringify(r[c.key] ?? "")).join(",")
    );
    const blob = new Blob([[headers, ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `patanas_page${page}.csv`;
    a.click();
  };

  /* ── Render ── */
  return (
    <div className="fi-root">
      <div className="fi-page">

        {/* Header */}
        <div className="fi-header">
          <div className="fi-title-block">
            <div className="fi-eyebrow">Segintco · Logistics</div>
            <h1 className="fi-title">Patanas <span>Ingreso</span></h1>
          </div>
          <div className="fi-stats">
            <div className="fi-stat">
              <span className="fi-stat-label">Records</span>
              <span className="fi-stat-val accent">{stats.total.toLocaleString()}</span>
            </div>
            <div className="fi-stat">
              <span className="fi-stat-label">Separadores</span>
              <span className="fi-stat-val">{stats.sep.toLocaleString()}</span>
            </div>
            <div className="fi-stat">
              <span className="fi-stat-label">Paletas</span>
              <span className="fi-stat-val">{stats.pal.toLocaleString()}</span>
            </div>
            <div className="fi-stat">
              <span className="fi-stat-label">Drivers</span>
              <span className="fi-stat-val">{stats.drivers}</span>
            </div>
          </div>
        </div>

        {/* Filter card */}
        <div className="fi-filter-card">
          <div className="fi-filter-header">
            <span className="fi-filter-heading">Filtros</span>
            <div className="fi-filter-actions">
              <button className="fi-btn fi-btn-danger fi-btn-sm" onClick={handleClear}>Limpiar</button>
              <button className="fi-btn fi-btn-primary" onClick={handleSearch} disabled={loading}>
                {loading ? "Buscando…" : "Buscar →"}
              </button>
            </div>
          </div>

          <div className="fi-grid">
            <div className="fi-field">
              <label className="fi-label">Tipo (patanaType)</label>
              <select className="fi-select" value={filters.patanaType} onChange={setF("patanaType")}>
                <option value="">Todos los tipos</option>
                <option>TERCERO</option>
                <option>ISM</option>
              </select>
            </div>

            <div className="fi-field">
              <label className="fi-label">Driver</label>
              <input className="fi-input" placeholder="Buscar conductor…" value={filters.driver} onChange={setF("driver")} onKeyDown={handleKey} />
            </div>

            <div className="fi-field">
              <label className="fi-label">Productos</label>
              <input className="fi-input" placeholder="Nombre del producto…" value={filters.productos} onChange={setF("productos")} onKeyDown={handleKey} />
            </div>

            <div className="fi-field">
              <label className="fi-label">Fecha exacta (dia)</label>
              <input className="fi-input" placeholder="DD/MM/YYYY" value={filters.dia} onChange={setF("dia")} onKeyDown={handleKey} />
            </div>

            <div className="fi-field">
              <label className="fi-label">Placa</label>
              <input className="fi-input" type="number" placeholder="Número exacto…" value={filters.placa} onChange={setF("placa")} onKeyDown={handleKey} />
            </div>

            <div className="fi-field">
              <label className="fi-label">Ficha</label>
              <select className="fi-select" value={filters.ficha} onChange={setF("ficha")}>
                <option value="">Cualquiera</option>
                <option value="null">Sin ficha (null)</option>
              </select>
            </div>
          </div>

          <div className="fi-divider" />

          <div className="fi-grid">
            <div className="fi-field">
              <label className="fi-label">Separadores (rango)</label>
              <div className="fi-range-pair">
                <input className="fi-input" type="number" placeholder="Mín" value={filters.minSeparadores} onChange={setF("minSeparadores")} onKeyDown={handleKey} />
                <input className="fi-input" type="number" placeholder="Máx" value={filters.maxSeparadores} onChange={setF("maxSeparadores")} onKeyDown={handleKey} />
              </div>
            </div>

            <div className="fi-field">
              <label className="fi-label">Paletas (rango)</label>
              <div className="fi-range-pair">
                <input className="fi-input" type="number" placeholder="Mín" value={filters.minPaletas} onChange={setF("minPaletas")} onKeyDown={handleKey} />
                <input className="fi-input" type="number" placeholder="Máx" value={filters.maxPaletas} onChange={setF("maxPaletas")} onKeyDown={handleKey} />
              </div>
            </div>

            <div className="fi-field">
              <label className="fi-label">Rango de fechas</label>
              <div className="fi-range-pair">
                <input className="fi-input" placeholder="Desde DD/MM/YYYY" value={filters.startDate} onChange={setF("startDate")} onKeyDown={handleKey} />
                <input className="fi-input" placeholder="Hasta DD/MM/YYYY" value={filters.endDate} onChange={setF("endDate")} onKeyDown={handleKey} />
              </div>
            </div>

            <div className="fi-field">
              <label className="fi-label">Filas por página</label>
              <select className="fi-select" value={limit} onChange={handleLimit}>
                {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Error bar */}
        {error && (
          <div className="fi-error-bar">
            <span>⚠</span> {error}
            <button className="fi-btn fi-btn-sm" style={{ marginLeft:"auto" }} onClick={() => fetchData()}>Reintentar</button>
          </div>
        )}

        {/* Table */}
        <div className="fi-table-card">
          <div className="fi-table-bar">
            <div className="fi-table-bar-left">
              <span className="fi-table-title">Registros</span>
              {!loading && <span className="fi-count-badge">{total.toLocaleString()} total</span>}
            </div>
            <div className="fi-table-bar-right">
              <button className="fi-btn fi-btn-sm" onClick={exportCSV} disabled={!rows.length}>Exportar CSV</button>
              <button className="fi-btn fi-btn-sm" onClick={() => fetchData()} disabled={loading}>↻ Actualizar</button>
            </div>
          </div>

          {loading ? (
            <div className="fi-loading">
              <div className="fi-spinner" />
              <span className="fi-loading-text">Cargando registros…</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="fi-empty">
              <div className="fi-empty-icon">◎</div>
              <div className="fi-empty-msg">Sin resultados</div>
              <div className="fi-empty-sub">Intenta ajustar los filtros o limpiar la búsqueda.</div>
            </div>
          ) : (
            <div className="fi-table-scroll">
              <table className="fi-table">
                <thead>
                  <tr>
                    {COLS.map((c) => (
                      <th
                        key={c.key}
                        style={{ width: c.w }}
                        className={sortBy === c.key ? "fi-th-sorted" : ""}
                        onClick={() => handleSort(c.key)}
                        title={`Ordenar por ${c.label}`}
                      >
                        {c.label}
                        <SortIcon col={c.key} sortBy={sortBy} sortOrder={sortOrder} />
                      </th>
                    ))}
                    <th style={{ width: "60px" }} />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} onClick={() => setSelected(r)} title="Click para ver detalles">
                      <td><Badge value={r.patanaType} /></td>
                      <td>{r.dia}</td>
                      <td title={r.driver}>{r.driver}</td>
                      <td>{r.placa}</td>
                      <td title={r.productos}>{r.productos}</td>
                      <td>{r.separadores}</td>
                      <td>{r.paletas}</td>
                      <td><NullableCell value={r.ficha} /></td>
                      <td><NullableCell value={r.placaUnidad} /></td>
                      <td>
                        <button
                          className="fi-btn fi-btn-ghost fi-btn-sm"
                          onClick={(e) => { e.stopPropagation(); setSelected(r); }}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="fi-pagination">
              <span className="fi-page-info">
                Página {page} de {totalPages} · {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} de {total}
              </span>
              <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && <DetailDrawer record={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}