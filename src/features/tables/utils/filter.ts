import type { FilterCondition } from "../components/atoms/FilterPopup";
import { parseRowDate } from "./filteringUtils";
import type {
  DateFilterState,
  TreeFilterState,
  FilterValue,
} from "./types";

export type { FilterValue };

export function matchCondition(
  cellValue: string,
  condition: FilterCondition,
): boolean {
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

export function matchFilter(
  cellValue: unknown,
  filter: FilterValue | undefined,
): boolean {
  if (filter === undefined || filter === null || filter === "") return true;

  // If it's a simple string filter
  if (typeof filter === "string") {
    if (!filter.trim()) return true;
    return String(cellValue ?? "")
      .toLowerCase()
      .includes(filter.toLowerCase());
  }

  // If it's a generic TreeFilterState object
  if (
    typeof filter === "object" &&
    filter !== null &&
    "type" in filter &&
    filter.type === "tree"
  ) {
    const treeFilter = filter as TreeFilterState;
    if (!treeFilter.selectedValues || treeFilter.selectedValues.length === 0)
      return true;

    // Check if cellValue matches date string format first
    const parsedDate = parseRowDate(cellValue);
    if (parsedDate) {
      return treeFilter.selectedValues.includes(parsedDate.dateStr);
    }

    const strVal =
      cellValue === undefined || cellValue === null || String(cellValue).trim() === ""
        ? "(Blank)"
        : String(cellValue).trim();

    return treeFilter.selectedValues.includes(strVal);
  }

  // If it's legacy DateFilterState object
  if (
    typeof filter === "object" &&
    filter !== null &&
    "type" in filter &&
    filter.type === "date_tree"
  ) {
    const dateFilter = filter as DateFilterState;
    if (!dateFilter.selectedDates || dateFilter.selectedDates.length === 0)
      return true;

    const parsed = parseRowDate(cellValue);
    if (!parsed) return false;

    return dateFilter.selectedDates.includes(parsed.dateStr);
  }

  // If it's a FilterState object
  if (typeof filter === "object" && "conditions" in filter) {
    const { conditions, logic } = filter;

    const activeConditions = conditions.filter(
      (c) => c.value !== undefined && c.value.trim() !== "",
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
