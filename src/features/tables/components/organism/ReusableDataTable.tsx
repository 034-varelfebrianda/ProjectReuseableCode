import type { ReactNode } from "react";
import TabButton from "../atoms/TabButton";
import BreadCrumbs from "../molecules/BreadCrumbs";
import GridTopBar from "../molecules/GridTopBar";
import Pagination from "../molecules/Pagination";
import FilterBox from "../atoms/FIlterBox";
import AttachmentBox, { AttachmentValue } from "../atoms/AttachmentBox";
import SortControl from "../molecules/SortControl";
import type { SortDirection, SortMode } from "../../utils/sort";

type FilterValue = string;

export interface Column<T> {
  key: keyof T & string;
  label: string;
  defaultWidth: number;
  minWidth: number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterType?: "text" | "select" | "none";
  filterOptions?: Array<{ value: string; label: string }>;
  render?: (item: T) => ReactNode;
}

interface ReusableDataTableProps<T> {
  mode?: SortMode;
  title: string;
  breadcrumbItems: Array<{ label: string }>;
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
  renderSummary?: (filteredData: T[]) => ReactNode;
}

export default function ReusableDataTable<T extends { id: string | number }>({
  title,
  breadcrumbItems,
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
  renderSummary,
  mode = "client",
}: ReusableDataTableProps<T>) {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <div className="pb-5">
        <BreadCrumbs items={breadcrumbItems} />
      </div>

      <div className="pb-3">
        <GridTopBar title={title} />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex border-b border-zinc-200 px-4 py-3">
          <TabButton label="Preview" active />
          <TabButton label="Code" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="bg-zinc-50 text-left text-sm text-[#71717A]">
                {columns.map((column) => {
                  const alignClass =
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                        ? "text-right"
                        : "";

                  return (
                    <th
                      key={column.key}
                      style={{ width: column.defaultWidth, minWidth: column.minWidth }}
                      className={`border-b border-r border-zinc-200 px-4 py-4 ${alignClass}`}
                    >
                      <span>{column.label}</span>
                    </th>
                  );
                })}
              </tr>

              <tr className="bg-zinc-50/50">
                {columns.map((column) => {
                  const filterValue = filters[column.key] ?? "";
                  const sortLabels =
                    column.key === "sent"
                      ? { asc: "Oldest", desc: "Newest" }
                      : undefined;

                  return (
                    <td
                      key={`filter-${column.key}`}
                      className="border-b border-r border-zinc-200 px-2 py-2"
                    >
                      {column.filterType === "text" && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <FilterBox
                              value={filterValue}
                              onChange={(val) => onFilterChange(column.key, val)}
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
                                if (sortField === column.key && sortDirection === direction) {
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
                          value={filterValue || "all"}
                          onChange={(val: AttachmentValue) => onFilterChange(column.key, val)}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="text-sm text-[#09090B] transition-colors hover:bg-zinc-50/50"
                  >
                    {columns.map((column) => {
                      const alignClass =
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                            ? "text-right"
                            : "";

                      return (
                        <td
                          key={`${item.id}-${column.key}`}
                          style={{ width: column.defaultWidth }}
                          className={`border-b border-r border-zinc-200 px-4 py-4 ${alignClass}`}
                        >
                          {column.render
                            ? column.render(item)
                            : item[column.key] !== undefined && item[column.key] !== null
                              ? String(item[column.key])
                              : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-zinc-400">
                    No matching records found.
                  </td>
                </tr>
              )}

              {renderSummary && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="border-b border-zinc-200 bg-zinc-50/30 px-5 py-3 text-right text-sm font-medium text-zinc-500"
                  >
                    {renderSummary(data)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={data.length}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
