export type IncidentType = "disturbance" | "maintenance" | "access" | "medical" | "other";
export type Severity = "low" | "medium" | "high";
export type View = "dashboard" | "log" | "history" | "handover";

export interface Incident {
  id: string;
  type: IncidentType;
  location: string;
  severity: Severity;
  description: string;
  guardId: string;
  guardName: string;
  siteId: string;
  createdAt: string;
  handedOver: boolean;
  reviewed: boolean;
}

export interface IncidentDraft {
  type: IncidentType;
  location: string;
  severity: Severity;
  description: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  siteId: string;
  siteName: string;
}

export interface Shift {
  id: string;
  startedAt: string;
  endedAt: string | null;
  active: boolean;
}
