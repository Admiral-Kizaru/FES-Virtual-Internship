import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import { IncidentFormFields } from "./components/IncidentFormFields";
import { SeverityFilter } from "./components/SeverityFilter";
import { demoIncidents, demoUser } from "./demoData";
import {
  addFirebaseIncident,
  completeFirebaseHandover,
  firebaseCreateAccount,
  firebaseEnabled,
  firebaseSignIn,
  firebaseSignOut,
  observeFirebaseUser,
  subscribeToIncidents,
} from "./firebase";
import {
  buildHandoverSummary,
  createIncident,
  filterIncidents,
  formatIncidentType,
  incidentsWithinDays,
  sortIncidentsForHandover,
  sortNewestFirst,
  validateIncidentDraft,
} from "./incidentUtils";
import { createRealtimeChannel, loadIncidents, loadShift, resetDemoStorage, saveIncidents, saveShift } from "./storage";
import type { DemoUser, Incident, IncidentDraft, IncidentType, Severity, Shift, View } from "./types";

const incidentTypes: IncidentType[] = ["disturbance", "maintenance", "access", "medical", "other"];

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></>,
    handover: <><path d="M7 7h11l-3-3" /><path d="m18 7-3 3" /><path d="M17 17H6l3 3" /><path d="m6 17 3-3" /></>,
    shield: <path d="M12 3 5 6v5c0 4.6 2.8 8.4 7 10 4.2-1.6 7-5.4 7-10V6l-7-3Z" />,
    logout: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M21 19V5a2 2 0 0 0-2-2h-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    alert: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.7 2.4 17.4A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.6L13.7 3.7a2 2 0 0 0-3.4 0Z" /></>,
    radio: <><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4" /><path d="M7.8 16.2a6 6 0 0 1 0-8.4" /></>,
  };
  return <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{paths[name]}</svg>;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const view = (location.pathname.slice(1) || "dashboard") as View;
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(() => loadIncidents(demoIncidents));
  const [shift, setShift] = useState<Shift | null>(() => loadShift());
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [type, setType] = useState<IncidentType | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!firebaseEnabled) return;
    return observeFirebaseUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (firebaseEnabled) {
      if (!currentUser) return;
      return subscribeToIncidents(currentUser.siteId, setIncidents);
    }
    channelRef.current = createRealtimeChannel();
    if (channelRef.current) {
      channelRef.current.onmessage = (event: MessageEvent<Incident[]>) => setIncidents(event.data);
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === "shiftlog-incidents" && event.newValue) setIncidents(JSON.parse(event.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => {
      channelRef.current?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, [currentUser]);

  function updateIncidents(next: Incident[]) {
    setIncidents(next);
    saveIncidents(next);
    channelRef.current?.postMessage(next);
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function startShift() {
    const next = { id: `shift-${Date.now()}`, startedAt: new Date().toISOString(), endedAt: null, active: true };
    setShift(next);
    saveShift(next);
    flash("Shift started. Stay safe.");
  }

  function endShift() {
    if (!shift) return;
    const next = { ...shift, endedAt: new Date().toISOString(), active: false };
    setShift(next);
    saveShift(next);
    navigate("/handover");
  }

  async function addIncident(incident: Incident) {
    if (firebaseEnabled) await addFirebaseIncident(incident);
    else updateIncidents([incident, ...incidents]);
    flash("Incident saved and synced.");
    navigate("/dashboard");
  }

  async function completeHandover() {
    if (firebaseEnabled) await completeFirebaseHandover(incidents.map((incident) => incident.id));
    else updateIncidents(incidents.map((incident) => ({ ...incident, handedOver: true })));
    setShift(null);
    saveShift(null);
    flash("Handover marked complete.");
    navigate("/dashboard");
  }

  function resetDemo() {
    resetDemoStorage();
    setIncidents(demoIncidents);
    setShift(null);
    flash("Demo data restored.");
  }

  async function authenticate(email: string, password: string, name: string, create: boolean) {
    const user = firebaseEnabled
      ? create
        ? await firebaseCreateAccount(email, password, name)
        : await firebaseSignIn(email, password)
      : demoUser;
    setCurrentUser(user);
    navigate("/dashboard");
  }

  async function logOut() {
    if (firebaseEnabled) await firebaseSignOut();
    setCurrentUser(null);
  }

  if (!currentUser) return <Login onAuthenticate={authenticate} />;

  const recent = sortNewestFirst(incidents).slice(0, 5);
  const sevenDayIncidents = incidentsWithinDays(incidents, 7);
  const filtered = sortNewestFirst(filterIncidents(sevenDayIncidents, severity, type));
  const openIncidents = incidents.filter((incident) => !incident.handedOver);
  const highOpen = openIncidents.filter((incident) => incident.severity === "high").length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Icon name="shield" /></span><span>ShiftLog<small>Security operations</small></span></div>
        <nav aria-label="Primary navigation">
          <NavButton active={view === "dashboard"} icon="grid" label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavButton active={view === "log"} icon="plus" label="Log incident" onClick={() => navigate("/log")} />
          <NavButton active={view === "history"} icon="history" label="Shift history" onClick={() => navigate("/history")} />
          <NavButton active={view === "handover"} icon="handover" label="Handover report" badge={openIncidents.length} onClick={() => navigate("/handover")} />
        </nav>
        <div className="sidebar-foot">
          <button className="user-chip" onClick={logOut}>
            <span className="avatar">{currentUser.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span><strong>{currentUser.name}</strong><small>{currentUser.siteName}</small></span><Icon name="logout" />
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span className="live-dot" />{firebaseEnabled ? "Firestore sync active" : "Demo sync active"}</div>
          <div className="top-actions">{!firebaseEnabled && <button className="text-button" onClick={resetDemo}>Reset demo</button>}<span>{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span></div>
        </header>
        {notice && <div className="toast"><Icon name="check" />{notice}</div>}

        {view === "dashboard" && (
          <Dashboard
            shift={shift}
            recent={recent}
            openCount={openIncidents.length}
            highOpen={highOpen}
            onStart={startShift}
            onEnd={endShift}
            onLog={() => navigate("/log")}
            onHistory={() => navigate("/history")}
          />
        )}
        {view === "log" && <IncidentForm shiftActive={Boolean(shift?.active)} user={currentUser} onSubmit={addIncident} />}
        {view === "history" && (
          <History
            incidents={filtered}
            severity={severity}
            type={type}
            expandedId={expandedId}
            onSeverity={setSeverity}
            onType={setType}
            onExpand={setExpandedId}
          />
        )}
        {view === "handover" && <Handover incidents={openIncidents} shift={shift} onComplete={completeHandover} />}
      </main>
    </div>
  );
}

function NavButton({ active, icon, label, badge, onClick }: { active: boolean; icon: string; label: string; badge?: number; onClick: () => void }) {
  return <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}><Icon name={icon} /><span>{label}</span>{badge ? <b>{badge}</b> : null}</button>;
}

function Login({ onAuthenticate }: { onAuthenticate: (email: string, password: string, name: string, create: boolean) => Promise<void> }) {
  const [email, setEmail] = useState(firebaseEnabled ? "" : "max.cortez@shiftlog.demo");
  const [password, setPassword] = useState(firebaseEnabled ? "" : "shiftlog");
  const [name, setName] = useState("Max Cortez");
  const [create, setCreate] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onAuthenticate(email, password, name, create);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to authenticate.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="brand light"><span className="brand-mark"><Icon name="shield" /></span><span>ShiftLog<small>Security operations</small></span></div>
        <div><p className="eyebrow light">Clear records. Better handovers.</p><h1>Every shift starts with context.</h1><p>Incident reporting and shift handovers designed for the people actually working the site.</p></div>
        <div className="login-stats"><span><strong>3 taps</strong>to log an incident</span><span><strong>Live</strong>cross-tab updates</span><span><strong>7 days</strong>of shift history</span></div>
      </section>
      <form className="login-panel" onSubmit={submit}>
        <div><p className="eyebrow">{firebaseEnabled ? "Secure account" : "Demo account"}</p><h2>{create ? "Create your site account" : "Sign in to your site"}</h2><p>{firebaseEnabled ? "Use your assigned site credentials." : "Use the prefilled credentials to explore ShiftLog."}</p></div>
        {firebaseEnabled && create && <label>Name<input value={name} onChange={(event) => setName(event.target.value)} required /></label>}
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="login-error">{error}</p>}
        <button className="primary wide" type="submit" disabled={busy}>{busy ? "Working..." : create ? "Create account" : "Sign in"}</button>
        {firebaseEnabled ? <button className="text-button" type="button" onClick={() => setCreate(!create)}>{create ? "Use an existing account" : "Create an account"}</button> : <p className="demo-note"><Icon name="radio" /> Portfolio demo mode. Firebase Auth activates when environment credentials are supplied.</p>}
      </form>
    </main>
  );
}

function Dashboard({ shift, recent, openCount, highOpen, onStart, onEnd, onLog, onHistory }: { shift: Shift | null; recent: Incident[]; openCount: number; highOpen: number; onStart: () => void; onEnd: () => void; onLog: () => void; onHistory: () => void }) {
  const elapsed = shift?.active ? Math.max(1, Math.floor((Date.now() - Date.parse(shift.startedAt)) / 60000)) : 0;
  return (
    <div className="page">
      <div className="page-heading"><div><p className="eyebrow">Harbor Point · Site 04</p><h1>Good evening, Max.</h1><p>Here is what is happening on your site.</p></div><button className={shift?.active ? "danger" : "primary"} onClick={shift?.active ? onEnd : onStart}>{shift?.active ? "End shift" : "Start shift"}</button></div>
      <section className="metrics">
        <article><span>Shift status</span><strong className={shift?.active ? "status-active" : ""}>{shift?.active ? "Active" : "Not started"}</strong><small>{shift?.active ? `${elapsed} minutes elapsed` : "Start when you arrive on site"}</small></article>
        <article><span>Open incidents</span><strong>{openCount}</strong><small>Awaiting handover</small></article>
        <article><span>High severity</span><strong className={highOpen ? "status-danger" : ""}>{highOpen}</strong><small>{highOpen ? "Requires attention" : "No critical incidents"}</small></article>
      </section>
      <section className="dashboard-grid">
        <div className="content-panel">
          <div className="panel-heading"><div><p className="eyebrow">Latest activity</p><h2>Recent incidents</h2></div><button className="text-button" onClick={onHistory}>View history</button></div>
          <div className="compact-list">{recent.map((incident) => <IncidentRow key={incident.id} incident={incident} compact />)}</div>
        </div>
        <aside className="quick-panel">
          <p className="eyebrow light">Quick action</p><h2>Something happened?</h2><p>Record the details while they are fresh. Timestamp and guard information are added automatically.</p><button className="light-button" onClick={onLog}><Icon name="plus" />Log incident</button>
          <div className="handover-preview"><span>Current handover</span><strong>{buildHandoverSummary(recent)}</strong></div>
        </aside>
      </section>
    </div>
  );
}

function IncidentForm({ shiftActive, user, onSubmit }: { shiftActive: boolean; user: DemoUser; onSubmit: (incident: Incident) => Promise<void> }) {
  const [draft, setDraft] = useState<IncidentDraft>({ type: "access", location: "", severity: "medium", description: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const timestamp = useMemo(() => new Date(), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateIncidentDraft(draft);
    setErrors(nextErrors);
    if (nextErrors.length) return;
    await onSubmit(createIncident(draft, user.id, user.siteId, user.name));
  }
  return (
    <div className="page narrow">
      <div className="page-heading"><div><p className="eyebrow">Incident entry</p><h1>Log an incident</h1><p>Capture the essentials now. Add only facts you observed or confirmed.</p></div><span className={`shift-pill ${shiftActive ? "on" : ""}`}>{shiftActive ? "Shift active" : "Shift not started"}</span></div>
      <form className="incident-form" onSubmit={submit}>
        <div className="form-section"><div className="form-section-head"><span>01</span><div><h2>Incident details</h2><p>Classify the event and record only confirmed facts.</p></div></div><IncidentFormFields draft={draft} onChange={setDraft} /></div>
        <div className="form-meta"><span><strong>Timestamp</strong>{timestamp.toLocaleString()}</span><span><strong>Guard</strong>{user.name}</span><span><strong>Site</strong>{user.siteName}</span></div>
        {errors.length > 0 && <div className="error-box"><Icon name="alert" /><div><strong>Check the incident details</strong>{errors.map((error) => <span key={error}>{error}</span>)}</div></div>}
        <button className="primary wide" type="submit">Save incident</button>
      </form>
    </div>
  );
}

function History({ incidents, severity, type, expandedId, onSeverity, onType, onExpand }: { incidents: Incident[]; severity: Severity | "all"; type: IncidentType | "all"; expandedId: string | null; onSeverity: (value: Severity | "all") => void; onType: (value: IncidentType | "all") => void; onExpand: (id: string | null) => void }) {
  return (
    <div className="page">
      <div className="page-heading"><div><p className="eyebrow">Last 7 days</p><h1>Shift history</h1><p>Review and filter every incident recorded at Harbor Point.</p></div><span className="record-count">{incidents.length} records</span></div>
      <div className="filters"><SeverityFilter value={severity} onChange={onSeverity} /><label>Type<select value={type} onChange={(e) => onType(e.target.value as IncidentType | "all")}><option value="all">All types</option>{incidentTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div>
      <section className="history-list">{incidents.length ? incidents.map((incident) => <IncidentRow key={incident.id} incident={incident} expanded={expandedId === incident.id} onClick={() => onExpand(expandedId === incident.id ? null : incident.id)} />) : <div className="empty-state"><Icon name="history" /><h2>No incidents match</h2><p>Try changing the severity or type filter.</p></div>}</section>
    </div>
  );
}

function IncidentRow({ incident, compact = false, expanded = false, onClick }: { incident: Incident; compact?: boolean; expanded?: boolean; onClick?: () => void }) {
  return (
    <article className={`incident-row ${compact ? "compact" : ""} ${onClick ? "clickable" : ""}`} onClick={onClick}>
      <span className={`severity-line ${incident.severity}`} />
      <div className="incident-main"><div className="incident-title"><span className={`badge ${incident.severity}`}>{incident.severity}</span><strong>{incident.location}</strong><span>{formatIncidentType(incident.type)}</span></div><p>{incident.description}</p>{expanded && <div className="incident-details"><span><strong>Reported by</strong>{incident.guardName}</span><span><strong>Site</strong>{incident.siteId}</span><span><strong>Status</strong>{incident.handedOver ? "Handed over" : "Open"}</span></div>}</div>
      <time>{new Date(incident.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</time>
    </article>
  );
}

function Handover({ incidents, shift, onComplete }: { incidents: Incident[]; shift: Shift | null; onComplete: () => void }) {
  const sorted = sortIncidentsForHandover(incidents);
  return (
    <div className="page">
      <div className="page-heading"><div><p className="eyebrow">Shift closeout</p><h1>Handover report</h1><p>Review open items before the incoming guard takes over.</p></div><button className="primary" disabled={!incidents.length} onClick={onComplete}><Icon name="check" />Mark handed over</button></div>
      <section className="handover-header"><div><span>Outgoing guard</span><strong>{demoUser.name}</strong></div><div><span>Site</span><strong>{demoUser.siteName}</strong></div><div><span>Shift started</span><strong>{shift ? new Date(shift.startedAt).toLocaleString() : "Demo shift"}</strong></div><div><span>Open items</span><strong>{incidents.length}</strong></div></section>
      <div className="summary-callout"><Icon name="handover" /><div><span>Generated summary</span><strong>{buildHandoverSummary(incidents)}</strong></div></div>
      <section className="content-panel handover-list"><div className="panel-heading"><div><p className="eyebrow">Priority order</p><h2>Items for the incoming shift</h2></div></div>{sorted.length ? sorted.map((incident) => <IncidentRow key={incident.id} incident={incident} />) : <div className="empty-state"><Icon name="check" /><h2>All clear</h2><p>There are no open incidents to hand over.</p></div>}</section>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><HashRouter><App /></HashRouter></StrictMode>);
