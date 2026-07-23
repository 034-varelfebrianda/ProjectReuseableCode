import type { Column, FilterValue, DateFilterState } from "../../utils/types";
import type { FilterState } from "../atoms/FilterPopup";
import type { SortDirection, SortMode } from "../../utils/sort";
import FilterBox from "./FilterBox";
import DateFilterBox from "./DateFilterBox";
import AttachmentBox, { type AttachmentValue } from "../atoms/AttachmentBox";
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
    direction: SortDirection | null
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

        return (
          <td
            key={`filter-${column.key}`}
            className="filter-cell"
          >
            {column.filterType === "text" && (
              <div className="filter-cell-content">
                <div className="filter-cell-input">
                  <FilterBox
                    value={
                      typeof filters[column.key] === "string"
                        ? (filters[column.key] as string)
                        : ""
                    }
                    onChange={(val) =>
                      onFilterChange(column.key, val)
                    }
                    columnLabel={column.label}
                    onFilterApply={(state) =>
                      onFilterChange(column.key, state)
                    }
                    initialFilterState={
                      typeof filters[column.key] === "object" &&
                      filters[column.key] !== null &&
                      "conditions" in (filters[column.key] as object)
                        ? (filters[column.key] as FilterState)
                        : undefined
                    }
                    placeholder={`${column.label}...`}
                  />
                </div>

                {column.sortable && (
                  <SortControl
                    mode={mode}
                    activeSort={sortField === column.key}
                    sortDirection={sortDirection}
                    sortAscLabel={sortLabels?.asc ?? "A-Z"}
                    sortDescLabel={sortLabels?.desc ?? "Z-A"}
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
            )}

            {column.filterType === "date" && (
              <div className="filter-cell-content">
                <div className="filter-cell-input">
                  <DateFilterBox
                    columnLabel={column.label}
                    columnKey={column.key}
                    data={data}
                    filterState={
                      typeof filters[column.key] === "object" &&
                      filters[column.key] !== null &&
                      "type" in (filters[column.key] as object)
                        ? (filters[column.key] as DateFilterState)
                        : undefined
                    }
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
                    sortAscLabel={sortLabels?.asc ?? "Oldest"}
                    sortDescLabel={sortLabels?.desc ?? "Newest"}
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
            )}

            {column.filterType === "select" && (
              <AttachmentBox
                value={(filters[column.key] as string) || "all"}
                onChange={(val: AttachmentValue) =>
                  onFilterChange(column.key, val)
                }
              />
            )}
          </td>
        );
      })}
    </tr>
  );
}
