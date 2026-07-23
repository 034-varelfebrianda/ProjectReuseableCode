import { type ReactNode } from "react";
import Pagination from "../molecules/Pagination";
import TableHeader from "../molecules/TableHeader";
import TableFilterRow from "../molecules/TableFilterRow";
import TableBody from "../molecules/TableBody";
import { useColumnResize } from "../../../../hooks/useColumnResize";
import type { SortDirection } from "../../utils/sort";
import type { Column, FilterValue } from "../../utils/types";
import { TableMode } from "../../../../types/enums";

export { TableMode };
export type { Column } from "../../utils/types";

interface ReusableDataTableProps<T> {
  mode?: TableMode | "client" | "server";

  data: T[];
  columns: Column<T>[];
  filters: Record<string, FilterValue>;
  onFilterChange: (key: keyof T & string, value: FilterValue) => void;
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
  mode = TableMode.CLIENT,
}: ReusableDataTableProps<T>) {
  const { colWidths, handleResize } = useColumnResize<T>();

  const startIndex = (currentPage - 1) * pageSize;
  const shouldLimitPageSize =
    mode === "client" || (mode === "server" && !serverPageSize);
  const paginatedData = shouldLimitPageSize
    ? data.slice(startIndex, startIndex + pageSize)
    : data;

  return (
    <div className="data-table-wrapper">
      <div className="data-table">
        <div className="data-table-content">
          <div className="data-table-scroll">
            <table
              className="data-table-element"
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
                  data={data}
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
    </div>);
}
