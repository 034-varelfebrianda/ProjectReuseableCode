import type {
  Column,
  FilterValue,
  TreeFilterState,
  DateFilterState,
} from "../../utils/types";
import type { SortDirection, SortMode } from "../../utils/sort";
import GenericFilterBox from "./GenericFilterBox";
import SortControl from "./SortControl";

interface TableFilterRowProps<T> {
  columns: Column<T>[];
  data: T[];
  filters: Record<string, FilterValue>;
  onFilterChange: (key: keyof T & string, value: FilterValue) => void;
  sortField: (keyof T & string) | null;
  sortDirection: SortDirection;
  onSortChange: (
    field: (keyof T & string) | null,
    direction: SortDirection | null,
  ) => void;
  mode: SortMode;
}

export default function TableFilterRow<T>({
  columns,
  data,
  filters,
  onFilterChange,
  sortField,
  sortDirection,
  onSortChange,
  mode,
}: TableFilterRowProps<T>) {
  return (
    <tr className="filter-row">
      {columns.map((column) => {
        const sortLabels = column.sortLabels;
        const filterType = column.filterType ?? "none";

        if (filterType === "none") {
          return <td key={`filter-${column.key}`} className="filter-cell" />;
        }

        const rawFilter = filters[column.key];
        const filterState =
          typeof rawFilter === "object" &&
          rawFilter !== null &&
          ("type" in rawFilter || "selectedValues" in rawFilter || "selectedDates" in rawFilter)
            ? (rawFilter as TreeFilterState | DateFilterState)
            : undefined;

        const defaultAscLabel =
          filterType === "date"
            ? "Oldest"
            : filterType === "number"
              ? "1-9"
              : "A-Z";
        const defaultDescLabel =
          filterType === "date"
            ? "Newest"
            : filterType === "number"
              ? "9-1"
              : "Z-A";

        return (
          <td key={`filter-${column.key}`} className="filter-cell">
            <div className="filter-cell-content">
              <div className="filter-cell-input">
                <GenericFilterBox
                  columnLabel={column.label}
                  columnKey={column.key}
                  data={data}
                  filterType={filterType}
                  filterOptions={column.filterOptions}
                  filterState={filterState}
                  onFilterApply={(state) =>
                    onFilterChange(column.key, state ?? "")
                  }
                  placeholder={`${column.label}...`}
                />
              </div>

              {column.sortable && (
                <SortControl
                  mode={mode}
                  activeSort={sortField === column.key}
                  sortDirection={sortDirection}
                  sortAscLabel={sortLabels?.asc ?? defaultAscLabel}
                  sortDescLabel={sortLabels?.desc ?? defaultDescLabel}
                  onSort={(direction: SortDirection) => {
                    if (
                      sortField === column.key &&
                      sortDirection === direction
                    ) {
                      onSortChange(null, null);
                    } else {
                      onSortChange(column.key, direction);
                    }
                  }}
                />
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
}
