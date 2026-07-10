import type { Column, FilterValue } from "../../types";
import type { FilterState } from "../atoms/FilterPopup";
import type { SortDirection, SortMode } from "../../utils/sort";
import FilterBox from "./FIlterBox";
import AttachmentBox, { type AttachmentValue } from "../atoms/AttachmentBox";
import SortControl from "./SortControl";

interface TableFilterRowProps<T> {
  columns: Column<T>[];
  filters: Record<string, FilterValue>;
  onFilterChange: (key: keyof T & string, value: string | FilterState) => void;
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
  filters,
  onFilterChange,
  sortField,
  sortDirection,
  onSortChange,
  mode,
}: TableFilterRowProps<T>) {
  return (
    <tr className="bg-zinc-50/50  dark:bg-zinc-800/50">
      {columns.map((column) => {
        const sortLabels = column.sortLabels;

        return (
          <td
            key={`filter-${column.key}`}
            className="border-b border-r border-zinc-200 dark:border-zinc-700 px-2 py-2"
          >
            {column.filterType === "text" && (
              <div className="flex items-center gap-2">
                <div className="flex-1">
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
                      typeof filters[column.key] === "object"
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
