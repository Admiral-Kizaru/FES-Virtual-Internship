export type IncidentType = "disturbance" | "maintenance" | "access" | "medical" | "other";

export type Severity = "low" | "medium" | "high";

export interface Incident {
  id: string;
  type: IncidentType;
  location: string;
  severity: Severity;
  description: string;
  guardId: string;
  siteId: string;
  createdAt: string;
  handedOver: boolean;
}

export interface IncidentDraft {
  type: IncidentType;
  location: string;
  severity: Severity;
  description: string;
}
