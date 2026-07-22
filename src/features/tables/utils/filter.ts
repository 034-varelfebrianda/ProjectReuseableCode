import type { FilterState, FilterCondition } from "../components/atoms/FilterPopup";

export type FilterValue = string | FilterState;

export function matchCondition(cellValue: string, condition: FilterCondition): boolean {
  const cellStr = cellValue.toLowerCase();
  const condVal = (condition.value ?? "").toLowerCase();

  switch (condition.operator) {
    case "equals":
      return cellStr === condVal;
    case "startsWith":
      return cellStr.startsWith(condVal);
    case "endsWith":
      return cellStr.endsWith(condVal);
    case "contains":
    default:
      return cellStr.includes(condVal);
  }
}

export function matchFilter(cellValue: unknown, filter: FilterValue | undefined): boolean {
  if (filter === undefined || filter === null) return true;

  // If it's a simple string filter
  if (typeof filter === "string") {
    if (!filter.trim()) return true;
    return String(cellValue ?? "").toLowerCase().includes(filter.toLowerCase());
  }

  // If it's a FilterState object
  if (typeof filter === "object" && "conditions" in filter) {
    const { conditions, logic } = filter;

    // Filter out empty conditions
    const activeConditions = conditions.filter(
      (c) => c.value !== undefined && c.value.trim() !== ""
    );
    if (activeConditions.length === 0) return true;

    const cellStr = String(cellValue ?? "");

    if (logic === "OR") {
      return activeConditions.some((cond) => matchCondition(cellStr, cond));
    } else {
      return activeConditions.every((cond) => matchCondition(cellStr, cond));
    }
  }

  return true;
}
