import type { IncidentDraft, IncidentType, Severity } from "../types";

export function IncidentFormFields({
  draft,
  onChange,
}: {
  draft: IncidentDraft;
  onChange: (draft: IncidentDraft) => void;
}) {
  return (
    <>
      <label>
        Incident type
        <select aria-label="Incident type" value={draft.type} onChange={(event) => onChange({ ...draft, type: event.target.value as IncidentType })}>
          <option value="disturbance">Disturbance</option>
          <option value="maintenance">Maintenance</option>
          <option value="access">Access</option>
          <option value="medical">Medical</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        Severity
        <select aria-label="Incident severity" value={draft.severity} onChange={(event) => onChange({ ...draft, severity: event.target.value as Severity })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label>
        Location
        <input aria-label="Location" value={draft.location} onChange={(event) => onChange({ ...draft, location: event.target.value })} placeholder="Example: North lobby, loading dock" />
      </label>
      <label>
        Description
        <textarea aria-label="Description" value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} placeholder="Describe what happened, actions taken, and who was notified." />
      </label>
    </>
  );
}
