import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { IncidentFormFields } from "../src/components/IncidentFormFields";
import { SeverityFilter } from "../src/components/SeverityFilter";
import type { IncidentDraft, Severity } from "../src/types";

function IncidentHarness() {
  const [draft, setDraft] = useState<IncidentDraft>({
    type: "access",
    severity: "medium",
    location: "",
    description: "",
  });
  return <IncidentFormFields draft={draft} onChange={setDraft} />;
}

test("incident form updates the selected severity", async () => {
  render(<IncidentHarness />);
  await userEvent.selectOptions(screen.getByLabelText("Incident severity"), "high");
  expect(screen.getByLabelText("Incident severity")).toHaveValue("high");
});

test("incident form accepts a location and description", async () => {
  render(<IncidentHarness />);
  await userEvent.type(screen.getByLabelText("Location"), "North lobby");
  await userEvent.type(screen.getByLabelText("Description"), "Visitor badge was returned.");
  expect(screen.getByLabelText("Location")).toHaveValue("North lobby");
  expect(screen.getByLabelText("Description")).toHaveValue("Visitor badge was returned.");
});

test("severity filter reports the selected value", async () => {
  let selected: Severity | "all" = "all";
  render(<SeverityFilter value={selected} onChange={(value) => { selected = value; }} />);
  await userEvent.selectOptions(screen.getByLabelText("Severity filter"), "high");
  expect(selected).toBe("high");
});
