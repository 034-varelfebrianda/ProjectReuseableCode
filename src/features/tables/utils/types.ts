import type { ReactNode } from "react";
import type { FilterState } from "../components/atoms/FilterPopup";

export interface DateFilterState {
  type: "date_tree";
  selectedKeys: string[];
  selectedDates: string[];
}

export interface TreeFilterState {
  type: "tree";
  selectedKeys: string[];
  selectedValues: string[];
}

export type FilterValue =
  | string
  | FilterState
  | DateFilterState
  | TreeFilterState;

export interface Column<T> {
  key: keyof T & string;
  label: string;
  defaultWidth: number;
  minWidth: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterType?: "text" | "select" | "date" | "number" | "none";
  filterOptions?: Array<{ value: string; label: string }>;
  sortLabels?: { asc: string; desc: string };
  render?: (item: T) => ReactNode;
}
