import type { Incident, IncidentDraft, Severity } from "./types";

export const severityOrder: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function validateIncidentDraft(draft: IncidentDraft): string[] {
  const errors: string[] = [];

  if (!draft.location.trim()) errors.push("Location is required.");
  if (!draft.description.trim()) errors.push("Description is required.");
  if (draft.description.trim().length < 12) {
    errors.push("Description must be at least 12 characters.");
  }

  return errors;
}

export function createIncident(draft: IncidentDraft, guardId = "guard-demo", siteId = "site-demo"): Incident {
  return {
    id: crypto.randomUUID(),
    ...draft,
    guardId,
    siteId,
    createdAt: new Date().toISOString(),
    handedOver: false,
  };
}

export function filterBySeverity(incidents: Incident[], severity: Severity | "all"): Incident[] {
  if (severity === "all") return incidents;
  return incidents.filter((incident) => incident.severity === severity);
}

export function sortIncidentsForHandover(incidents: Incident[]): Incident[] {
  return [...incidents].sort((a, b) => {
    const severityDelta = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDelta !== 0) return severityDelta;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

export function buildHandoverSummary(incidents: Incident[]): string {
  if (incidents.length === 0) return "No incidents logged during this shift.";

  const highCount = incidents.filter((incident) => incident.severity === "high").length;
  const openCount = incidents.filter((incident) => !incident.handedOver).length;
  return `${incidents.length} incident${incidents.length === 1 ? "" : "s"} logged. ${highCount} high severity. ${openCount} awaiting handover.`;
}
