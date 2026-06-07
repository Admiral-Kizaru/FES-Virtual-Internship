import {
  buildHandoverSummary,
  createIncident,
  filterIncidents,
  filterBySeverity,
  incidentsWithinDays,
  sortIncidentsForHandover,
  validateIncidentDraft,
} from "../src/incidentUtils";
import type { Incident } from "../src/types";

const incidents: Incident[] = [
  {
    id: "1",
    type: "access",
    location: "Lobby",
    severity: "low",
    description: "Badge issue resolved with supervisor.",
    guardId: "guard-demo",
    siteId: "site-demo",
    createdAt: "2026-06-04T08:00:00.000Z",
    handedOver: false,
    reviewed: false,
    guardName: "Max Cortez",
  },
  {
    id: "2",
    type: "medical",
    location: "Garage",
    severity: "high",
    description: "Medical event escalated to emergency services.",
    guardId: "guard-demo",
    siteId: "site-demo",
    createdAt: "2026-06-04T09:00:00.000Z",
    handedOver: true,
    reviewed: true,
    guardName: "Max Cortez",
  },
];

describe("incident utilities", () => {
  it("validates required fields and minimum description length", () => {
    expect(
      validateIncidentDraft({
        type: "access",
        location: "",
        severity: "medium",
        description: "short",
      })
    ).toEqual([
      "Location is required.",
      "Description must be at least 12 characters.",
    ]);
  });

  it("filters incidents by severity", () => {
    expect(filterBySeverity(incidents, "high")).toHaveLength(1);
    expect(filterBySeverity(incidents, "high")[0].id).toBe("2");
  });

  it("filters incidents by severity and type together", () => {
    expect(filterIncidents(incidents, "high", "medical")).toHaveLength(1);
    expect(filterIncidents(incidents, "low", "medical")).toHaveLength(0);
  });

  it("sorts high severity incidents first", () => {
    expect(sortIncidentsForHandover(incidents)[0].severity).toBe("high");
  });

  it("builds a shift handover summary", () => {
    expect(buildHandoverSummary(incidents)).toBe("2 incidents logged. 1 high severity. 1 awaiting handover.");
  });

  it("creates a normalized incident with guard and site context", () => {
    const created = createIncident(
      { type: "access", location: " Lobby ", severity: "medium", description: " Valid incident details. " },
      "guard-1",
      "site-1",
      "Max Cortez",
      new Date("2026-06-06T12:00:00.000Z")
    );
    expect(created.location).toBe("Lobby");
    expect(created.description).toBe("Valid incident details.");
    expect(created.guardName).toBe("Max Cortez");
    expect(created.createdAt).toBe("2026-06-06T12:00:00.000Z");
  });

  it("keeps only incidents inside the requested date window", () => {
    expect(incidentsWithinDays(incidents, 3, new Date("2026-06-06T10:00:00.000Z"))).toHaveLength(2);
    expect(incidentsWithinDays(incidents, 1, new Date("2026-06-06T10:00:00.000Z"))).toHaveLength(0);
  });
});
