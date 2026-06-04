import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {
  buildHandoverSummary,
  createIncident,
  filterBySeverity,
  sortIncidentsForHandover,
  validateIncidentDraft,
} from "./incidentUtils";
import type { Incident, IncidentDraft, IncidentType, Severity } from "./types";

const initialIncidents: Incident[] = [
  {
    id: "inc-001",
    type: "access",
    location: "North lobby",
    severity: "medium",
    description: "Visitor attempted entry without an active badge. Supervisor notified.",
    guardId: "guard-demo",
    siteId: "site-demo",
    createdAt: new Date(Date.now() - 1000 * 60 * 36).toISOString(),
    handedOver: false,
  },
  {
    id: "inc-002",
    type: "maintenance",
    location: "Garage B",
    severity: "low",
    description: "Broken light fixture reported near the west stairwell.",
    guardId: "guard-demo",
    siteId: "site-demo",
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    handedOver: true,
  },
];

const incidentTypes: IncidentType[] = ["disturbance", "maintenance", "access", "medical", "other"];
const severityLevels: Severity[] = ["low", "medium", "high"];

function App() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [draft, setDraft] = useState<IncidentDraft>({
    type: "access",
    location: "",
    severity: "medium",
    description: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const visibleIncidents = useMemo(
    () => sortIncidentsForHandover(filterBySeverity(incidents, severity)),
    [incidents, severity]
  );
  const openIncidents = incidents.filter((incident) => !incident.handedOver);

  function submitIncident(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateIncidentDraft(draft);
    setErrors(nextErrors);

    if (nextErrors.length > 0) return;

    setIncidents((current) => [createIncident(draft), ...current]);
    setDraft({ type: "access", location: "", severity: "medium", description: "" });
  }

  function markHandoverComplete() {
    setIncidents((current) => current.map((incident) => ({ ...incident, handedOver: true })));
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Security Operations Tool</p>
        <h1>ShiftLog</h1>
        <p>
          A mobile-first incident reporting and handover dashboard for guards,
          supervisors, and incoming shifts.
        </p>
      </section>

      <section className="dashboard" aria-label="Shift dashboard">
        <article className="metric">
          <span>Current Shift</span>
          <strong>Active</strong>
        </article>
        <article className="metric">
          <span>Open Incidents</span>
          <strong>{openIncidents.length}</strong>
        </article>
        <article className="metric">
          <span>Handover</span>
          <strong>{buildHandoverSummary(incidents)}</strong>
        </article>
      </section>

      <section className="workspace">
        <form className="panel" onSubmit={submitIncident}>
          <div>
            <p className="eyebrow">Log Incident</p>
            <h2>Fast entry for the current shift</h2>
          </div>

          <label>
            Type
            <select
              value={draft.type}
              onChange={(event) => setDraft({ ...draft, type: event.target.value as IncidentType })}
            >
              {incidentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Severity
            <select
              value={draft.severity}
              onChange={(event) => setDraft({ ...draft, severity: event.target.value as Severity })}
            >
              {severityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label>
            Location
            <input
              value={draft.location}
              onChange={(event) => setDraft({ ...draft, location: event.target.value })}
              placeholder="Example: North lobby"
            />
          </label>

          <label>
            Description
            <textarea
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              placeholder="What happened, who was notified, and what needs follow-up?"
            />
          </label>

          {errors.length > 0 && (
            <ul className="errors">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}

          <button type="submit">Save incident</button>
        </form>

        <section className="panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">Shift History</p>
              <h2>Last 7 days</h2>
            </div>
            <select value={severity} onChange={(event) => setSeverity(event.target.value as Severity | "all")}>
              <option value="all">All severity</option>
              {severityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="incident-list">
            {visibleIncidents.map((incident) => (
              <article className="incident" key={incident.id}>
                <div>
                  <span className={`badge ${incident.severity}`}>{incident.severity}</span>
                  <h3>{incident.location}</h3>
                  <p>{incident.description}</p>
                </div>
                <small>{new Date(incident.createdAt).toLocaleString()}</small>
              </article>
            ))}
          </div>

          <button className="secondary" type="button" onClick={markHandoverComplete}>
            Mark handover complete
          </button>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
