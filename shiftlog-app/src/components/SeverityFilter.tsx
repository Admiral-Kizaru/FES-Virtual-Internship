import type { Severity } from "../types";

export function SeverityFilter({
  value,
  onChange,
}: {
  value: Severity | "all";
  onChange: (value: Severity | "all") => void;
}) {
  return (
    <label>
      Severity
      <select aria-label="Severity filter" value={value} onChange={(event) => onChange(event.target.value as Severity | "all")}>
        <option value="all">All severity</option>
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </select>
    </label>
  );
}
