import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/context";

const BASE_URL = "https://segintco7003.onrender.com/api/auth";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0a0a0f;
    --paper: #f5f3ee;
    --cream: #ede9e0;
    --accent: #c8401a;
    --accent-light: #e8734a;
    --muted: #8a8278;
    --border: #d4cfc5;
    --surface: #ffffff;
    --error: #c8401a;
    --success: #1a6b3c;
    --shadow: 0 1px 3px rgba(10,10,15,0.08), 0 8px 32px rgba(10,10,15,0.06);
    --shadow-lg: 0 4px 6px rgba(10,10,15,0.05), 0 20px 60px rgba(10,10,15,0.12);
  }

  .auth-root {
    min-height: 100vh;
    background: var(--paper);
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    overflow: hidden;
  }

  /* ── Left panel ── */
  .auth-panel {
    position: relative;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    overflow: hidden;
  }
  .auth-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 80%, rgba(200,64,26,0.25) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 80% 20%, rgba(200,64,26,0.12) 0%, transparent 60%);
  }
  .panel-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: #fff;
    letter-spacing: -0.5px;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .panel-logo-dot {
    width: 8px; height: 8px;
    background: var(--accent-light);
    border-radius: 50%;
    display: inline-block;
  }
  .panel-hero {
    position: relative;
    z-index: 1;
  }
  .panel-tagline {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: clamp(32px, 3vw, 48px);
    line-height: 1.1;
    color: #fff;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
  }
  .panel-tagline em {
    font-style: normal;
    color: var(--accent-light);
  }
  .panel-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.5);
    line-height: 1.6;
    max-width: 300px;
    font-weight: 300;
  }
  .panel-footer {
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    position: relative;
    z-index: 1;
    letter-spacing: 0.5px;
  }

  /* Decorative geometric shapes */
  .panel-geo {
    position: absolute;
    z-index: 0;
  }
  .panel-geo-1 {
    width: 220px; height: 220px;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 50%;
    top: 30%; right: -60px;
  }
  .panel-geo-2 {
    width: 120px; height: 120px;
    border: 1px solid rgba(200,64,26,0.2);
    border-radius: 50%;
    top: 32%; right: -10px;
  }
  .panel-geo-3 {
    width: 60px; height: 60px;
    background: rgba(200,64,26,0.15);
    border-radius: 12px;
    transform: rotate(30deg);
    bottom: 120px; left: 40px;
  }

  /* ── Right panel / Form area ── */
  .auth-form-area {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    background: var(--paper);
    position: relative;
  }
  .auth-form-area::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 60%; height: 100%;
    background: radial-gradient(ellipse 80% 60% at 100% 50%, rgba(200,64,26,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-card {
    width: 100%;
    max-width: 400px;
    position: relative;
    z-index: 1;
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-heading {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 30px;
    letter-spacing: -1px;
    color: var(--ink);
    margin-bottom: 6px;
  }
  .auth-subheading {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 36px;
    font-weight: 300;
  }

  /* Tabs */
  .auth-tabs {
    display: flex;
    background: var(--cream);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 32px;
    gap: 2px;
  }
  .auth-tab {
    flex: 1;
    padding: 9px 0;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.2px;
  }
  .auth-tab.active {
    background: var(--surface);
    color: var(--ink);
    box-shadow: 0 1px 4px rgba(10,10,15,0.1);
  }

  /* Form */
  .form-group {
    margin-bottom: 18px;
  }
  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 7px;
  }
  .form-input-wrap {
    position: relative;
  }
  .form-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--ink);
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    -webkit-appearance: none;
  }
  .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(200,64,26,0.08);
  }
  .form-input.error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(200,64,26,0.08);
  }
  .form-input::placeholder { color: #c0bbb2; }

  .pw-toggle {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    cursor: pointer; color: var(--muted);
    display: flex; align-items: center;
    padding: 4px;
    transition: color 0.15s;
  }
  .pw-toggle:hover { color: var(--ink); }

  .field-error {
    margin-top: 5px;
    font-size: 12px;
    color: var(--error);
    font-weight: 400;
  }

  /* Row for two fields */
  .form-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 15px 10px;
  }

  /* Submit button */
  .btn-submit {
    width: 100%;
    padding: 14px;
    background: var(--ink);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }
  .btn-submit:hover:not(:disabled) {
    background: var(--accent);
    box-shadow: 0 4px 20px rgba(200,64,26,0.3);
    transform: translateY(-1px);
  }
  .btn-submit:active:not(:disabled) { transform: translateY(0); }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Spinner */
  .spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Toast */
  .toast {
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13.5px;
    margin-bottom: 20px;
    font-weight: 400;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    animation: toastIn 0.3s ease both;
    line-height: 1.5;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .toast-error {
    background: #fdf1ee;
    border: 1px solid rgba(200,64,26,0.2);
    color: var(--error);
  }
  .toast-success {
    background: #edf7f2;
    border: 1px solid rgba(26,107,60,0.2);
    color: var(--success);
  }
  .toast-icon { flex-shrink: 0; margin-top: 1px; }

  /* Divider */
  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 24px 0;
    color: var(--border);
    font-size: 12px;
    color: var(--muted);
  }
  .divider::before, .divider::after {
    content: ''; flex: 1;
    height: 1px; background: var(--border);
  }

  /* Switch link */
  .switch-link {
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    margin-top: 20px;
  }
  .switch-link button {
    background: none; border: none;
    color: var(--accent); cursor: pointer;
    font-family: inherit; font-size: inherit;
    font-weight: 500; padding: 0;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.2s;
  }
  .switch-link button:hover { text-decoration-color: var(--accent); }

  /* Success state */
  .success-card {
    text-align: center;
    padding: 32px 0;
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .success-icon {
    width: 64px; height: 64px;
    background: #edf7f2;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    font-size: 28px;
  }
  .success-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }
  .success-sub {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 28px;
    line-height: 1.6;
  }
  .btn-outline {
    padding: 12px 28px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-panel { display: none; }
    .auth-form-area { padding: 32px 24px; }
  }
`;

/* ── Icons ── */
const Eye = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOff = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const AlertIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Field component ── */
function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  children,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="form-input-wrap">
        <input
          className={`form-input${error ? " error" : ""}`}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={isPassword ? "current-password" : undefined}
        />
        {isPassword && (
          <button
            className="pw-toggle"
            type="button"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
          >
            {show ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
      {error && <p className="field-error">{error}</p>}
      {children}
    </div>
  );
}

/* ── Login Form ── */
function LoginForm({ onSwitch }) {
  const { refreshUser } = useUser();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: 'error'|'success', msg }
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStatus(null);
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        email: form.email,
        password: form.password,
      });
      //console.log(res);

      if (res.status === 200) {
        setDone(true);
        localStorage.setItem("token", res.data.data.token);
        refreshUser();
      }
      /* const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      }); */

      //console.log(res.data.data.token);
    } catch {
      setStatus({
        type: "error",
        msg: "Network error — please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2 className="success-title">Welcome back!</h2>
        <p className="success-sub">
          You've logged in successfully.
          <br />
          Redirecting you now…
        </p>
        <button
          className="btn-outline"
          onClick={() => {
            setDone(false);
            setForm({ email: "", password: "" });
          }}
        >
          Back to login
        </button>
      </div>
    );

  return (
    <>
      <h1 className="auth-heading">Sign in</h1>
      <p className="auth-subheading">Good to see you again.</p>

      {status && (
        <div className={`toast toast-${status.type}`}>
          <span className="toast-icon">
            {status.type === "error" ? <AlertIcon /> : <CheckIcon />}
          </span>
          {status.msg}
        </div>
      )}

      <Field
        label="Email address"
        type="email"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        type="password"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
        placeholder="••••••••"
      />

      <button className="btn-submit" onClick={submit} disabled={loading}>
        {loading ? (
          <>
            <span className="spinner" /> Signing in…
          </>
        ) : (
          "Sign in →"
        )}
      </button>

      <div className="switch-link" style={{ marginTop: 24 }}>
        No account? <button onClick={onSwitch}>Create one</button>
      </div>
    </>
  );
}

/* ── Register Form ── */
function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};

    if (!(form.name || "").trim()) e.name = "Required";
    // REMOVED lastName check since it's not in your form fields

    if (!(form.email || "").trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "At least 8 characters";
    }

    if (form.confirm !== form.password) {
      e.confirm = "Passwords don't match";
    }

    return e;
  };
  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});
    setStatus(null);
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setDone(true);

      // Handle success (e.g., redirect or show success message)
      setStatus({ type: "success", msg: "Registration successful!" });
    } catch (error) {
      console.error(error);

      // 1. Check if the server actually responded with an error (4xx, 5xx)
      if (error.response) {
        const serverMsg =
          error.response.data?.message || "Server error occurred.";
        setStatus({ type: "error", msg: serverMsg });

        // Optional: If your backend sends specific field errors
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
        }
      }
      // 2. Check if the request was made but no response was received
      else if (error.request) {
        setStatus({
          type: "error",
          msg: "No response from server. Check your connection.",
        });
      }
      // 3. Something else happened
      else {
        setStatus({ type: "error", msg: "An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2 className="success-title">You're in!</h2>
        <p className="success-sub">
          Account created successfully.
          <br />
          You can now sign in with your credentials.
        </p>
        <button className="btn-outline" onClick={onSwitch}>
          Sign in now
        </button>
      </div>
    );

  return (
    <>
      <h1 className="auth-heading">Create account</h1>
      <p className="auth-subheading">Join us — it only takes a moment.</p>

      {status && (
        <div className={`toast toast-${status.type}`}>
          <span className="toast-icon">
            {status.type === "error" ? <AlertIcon /> : <CheckIcon />}
          </span>
          {status.msg}
        </div>
      )}

      <Field
        label="Name"
        value={form.name}
        onChange={set("name")}
        error={errors.name}
        placeholder="Ralph"
      />

      <Field
        label="Email address"
        type="email"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        type="password"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
        placeholder="Min. 8 characters"
      />
      <Field
        label="Confirm password"
        type="password"
        value={form.confirm}
        onChange={set("confirm")}
        error={errors.confirm}
        placeholder="Repeat password"
      />

      <button className="btn-submit" onClick={submit} disabled={loading}>
        {loading ? (
          <>
            <span className="spinner" /> Creating account…
          </>
        ) : (
          "Create account →"
        )}
      </button>

      <div className="switch-link" style={{ marginTop: 24 }}>
        Already have an account? <button onClick={onSwitch}>Sign in</button>
      </div>
    </>
  );
}

/* ── Root ── */
export default function Auth() {
  const [tab, setTab] = useState("login");

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        {/* Left decorative panel */}
        <div className="auth-panel">
          <div className="panel-geo panel-geo-1" />
          <div className="panel-geo panel-geo-2" />
          <div className="panel-geo panel-geo-3" />
          <div className="panel-logo">
            <span className="panel-logo-dot" /> SEGURIDAD INTERNA
          </div>
          <div className="panel-hero">
            <h2 className="panel-tagline">
              Diseñado para
              <br />
              <em>aquellos que necesitan ir</em>
              <br />a moverse rápido..
            </h2>
            <p className="panel-sub">
              Acceso seguro a tu espacio de trabajo. Todo lo que necesitas, nada
              superfluo.
            </p>
          </div>
          <p className="panel-footer">
            © {new Date().getFullYear()} SEGINT CO. ALL RIGHTS RESERVED.
          </p>
        </div>

        {/* Right form area */}
        <div className="auth-form-area">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                className={`auth-tab${tab === "login" ? " active" : ""}`}
                onClick={() => setTab("login")}
              >
                Sign in
              </button>
              <button
                className={`auth-tab${tab === "register" ? " active" : ""}`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>

            {tab === "login" ? (
              <LoginForm onSwitch={() => setTab("register")} />
            ) : (
              <RegisterForm onSwitch={() => setTab("login")} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
