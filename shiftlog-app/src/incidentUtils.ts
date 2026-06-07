import type { Incident, IncidentDraft, IncidentType, Severity } from "./types";

export const severityOrder: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function validateIncidentDraft(draft: IncidentDraft): string[] {
  const errors: string[] = [];
  if (!draft.location.trim()) errors.push("Location is required.");
  if (!draft.description.trim()) errors.push("Description is required.");
  if (draft.description.trim() && draft.description.trim().length < 12) {
    errors.push("Description must be at least 12 characters.");
  }
  return errors;
}

export function createIncident(
  draft: IncidentDraft,
  guardId = "guard-demo",
  siteId = "site-demo",
  guardName = "Max Cortez",
  now = new Date()
): Incident {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `incident-${now.getTime()}`,
    ...draft,
    location: draft.location.trim(),
    description: draft.description.trim(),
    guardId,
    guardName,
    siteId,
    createdAt: now.toISOString(),
    handedOver: false,
    reviewed: false,
  };
}

export function filterIncidents(
  incidents: Incident[],
  severity: Severity | "all",
  type: IncidentType | "all"
): Incident[] {
  return incidents.filter(
    (incident) =>
      (severity === "all" || incident.severity === severity) &&
      (type === "all" || incident.type === type)
  );
}

export function filterBySeverity(incidents: Incident[], severity: Severity | "all"): Incident[] {
  return filterIncidents(incidents, severity, "all");
}

export function incidentsWithinDays(incidents: Incident[], days: number, now = new Date()): Incident[] {
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return incidents.filter((incident) => Date.parse(incident.createdAt) >= cutoff);
}

export function sortIncidentsForHandover(incidents: Incident[]): Incident[] {
  return [...incidents].sort((a, b) => {
    const severityDelta = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDelta !== 0) return severityDelta;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

export function sortNewestFirst(incidents: Incident[]): Incident[] {
  return [...incidents].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function buildHandoverSummary(incidents: Incident[]): string {
  if (incidents.length === 0) return "No incidents logged during this shift.";
  const highCount = incidents.filter((incident) => incident.severity === "high").length;
  const openCount = incidents.filter((incident) => !incident.handedOver).length;
  return `${incidents.length} incident${incidents.length === 1 ? "" : "s"} logged. ${highCount} high severity. ${openCount} awaiting handover.`;
}

export function formatIncidentType(type: IncidentType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
