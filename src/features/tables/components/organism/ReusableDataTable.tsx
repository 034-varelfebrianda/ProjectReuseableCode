import { type ReactNode } from "react";
import Pagination from "../molecules/Pagination";
import TableHeader from "../molecules/TableHeader";
import TableFilterRow from "../molecules/TableFilterRow";
import TableBody from "../molecules/TableBody";
import { useColumnResize } from "../../../../hooks/useColumnResize";
import type { SortDirection, SortMode } from "../../utils/sort";
import type { FilterState } from "../atoms/FilterPopup";
import type { Column, FilterValue } from "../../utils/types";

// Re-export Column so existing page imports don't break
export type { Column } from "../../utils/types";

interface ReusableDataTableProps<T> {
  mode?: SortMode;
  title?: string;
  showGridTopBar?: boolean;
  data: T[];
  columns: Column<T>[];
  filters: Record<string, FilterValue>;
  onFilterChange: (key: keyof T & string, value: string | FilterState) => void;
  sortField: (keyof T & string) | null;
  sortDirection: "asc" | "desc";
  onSortChange: (
    field: (keyof T & string) | null,
    direction: SortDirection | null
  ) => void;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
  serverPageSize?: boolean;
  renderSummary?: (filteredData: T[]) => ReactNode;
  showThemeToggle?: boolean;
}

export default function ReusableDataTable<T extends { id: string | number }>({
  data,
  columns,
  filters,
  onFilterChange,
  sortField,
  sortDirection,
  onSortChange,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems,
  serverPageSize = false,
  renderSummary,
  mode = "client",
}: ReusableDataTableProps<T>) {
  const { colWidths, handleResize } = useColumnResize<T>();

  const startIndex = (currentPage - 1) * pageSize;
  const shouldLimitPageSize =
    mode === "client" || (mode === "server" && !serverPageSize);
  const paginatedData = shouldLimitPageSize
    ? data.slice(startIndex, startIndex + pageSize)
    : data;

  return (
    <div className="overflow-visible rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm transition-colors h-fit">
      <div className="z-500">
        <div className="overflow-x-auto relative z-10 min-h-75 h-fit">
          <table
            className="w-full border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <TableHeader
                columns={columns}
                colWidths={colWidths}
                onResize={handleResize}
              />
              <TableFilterRow
                columns={columns}
                filters={filters}
                onFilterChange={onFilterChange}
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
                mode={mode}
              />
            </thead>
            <TableBody
              data={paginatedData}
              columns={columns}
              allData={data}
              renderSummary={renderSummary}
            />
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
