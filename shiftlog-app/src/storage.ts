import type { Incident, Shift } from "./types";

const INCIDENTS_KEY = "shiftlog-incidents";
const SHIFT_KEY = "shiftlog-current-shift";
const CHANNEL_NAME = "shiftlog-realtime";

export function loadIncidents(fallback: Incident[]): Incident[] {
  try {
    const stored = localStorage.getItem(INCIDENTS_KEY);
    return stored ? (JSON.parse(stored) as Incident[]) : fallback;
  } catch {
    return fallback;
  }
}

export function saveIncidents(incidents: Incident[]): void {
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
}

export function loadShift(): Shift | null {
  try {
    const stored = localStorage.getItem(SHIFT_KEY);
    return stored ? (JSON.parse(stored) as Shift) : null;
  } catch {
    return null;
  }
}

export function saveShift(shift: Shift | null): void {
  if (shift) localStorage.setItem(SHIFT_KEY, JSON.stringify(shift));
  else localStorage.removeItem(SHIFT_KEY);
}

export function createRealtimeChannel(): BroadcastChannel | null {
  return "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;
}

export function resetDemoStorage(): void {
  localStorage.removeItem(INCIDENTS_KEY);
  localStorage.removeItem(SHIFT_KEY);
}
