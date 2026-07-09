import type { ReactNode } from "react";
import type { FilterState } from "./components/atoms/FilterPopup";

export type FilterValue = string | FilterState;

export interface Column<T> {
  key: keyof T & string;
  label: string;
  defaultWidth: number;
  minWidth: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterType?: "text" | "select" | "none";
  filterOptions?: Array<{ value: string; label: string }>;
  sortLabels?: { asc: string; desc: string };
  render?: (item: T) => ReactNode;
}
