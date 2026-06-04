import {
  buildHandoverSummary,
  filterBySeverity,
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

  it("sorts high severity incidents first", () => {
    expect(sortIncidentsForHandover(incidents)[0].severity).toBe("high");
  });

  it("builds a shift handover summary", () => {
    expect(buildHandoverSummary(incidents)).toBe("2 incidents logged. 1 high severity. 1 awaiting handover.");
  });
});
