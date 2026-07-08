import { useState, type ReactNode } from "react";
import TabButton from "../atoms/TabButton";
import BreadCrumbs from "../molecules/BreadCrumbs";
import GridTopBar from "../molecules/GridTopBar";
import Pagination from "../molecules/Pagination";
import FilterBox, { type FilterOperator } from "../atoms/FIlterBox";
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
  filterOperators?: Record<string, FilterOperator>;
  onFilterOperatorChange?: (key: keyof T & string, operator: FilterOperator) => void;
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
  title,
  breadcrumbItems,
  data,
  columns,
  filters,
  onFilterChange,
  filterOperators,
  onFilterOperatorChange,
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
  showThemeToggle = false,
}: ReusableDataTableProps<T>) {
  const [activeTab, setActiveTab] = useState<"Preview" | "Code">("Preview");
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  const startIndex = (currentPage - 1) * pageSize;
  const shouldLimitPageSize =
    mode === "client" || (mode === "server" && !serverPageSize);
  const paginatedData = shouldLimitPageSize
    ? data.slice(startIndex, startIndex + pageSize)
    : data;

  const codeSnippet = [
    'import ReusableDataTable from "@/features/tables/components/organism/ReusableDataTable";',
    "",
    "<ReusableDataTable",
    `  title="${title}"`,
    '  mode="server"',
    "  data={rows}",
    "  columns={columns}",
    "  filters={filters}",
    "  onFilterChange={handleFilterChange}",
    "  sortField={sortField}",
    "  sortDirection={sortDirection}",
    "  onSortChange={handleSortChange}",
    "  currentPage={currentPage}",
    "  pageSize={pageSize}",
    "  totalItems={totalItems}",
    "  onPageChange={setCurrentPage}",
    "  onPageSizeChange={(size) => {",
    "    setPageSize(size);",
    "    setCurrentPage(1);",
    "  }}",
    "/>",
  ].join("\n");

  return (
    <div>
      <div className="pb-5">
        <BreadCrumbs items={breadcrumbItems} />
      </div>

      <div className="pb-3">
        <GridTopBar title={title} showThemeToggle={showThemeToggle} />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm transition-colors">
        {/* Tab Bar */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700 px-4 py-3">
          <TabButton
            label="Preview"
            active={activeTab === "Preview"}
            onClick={() => setActiveTab("Preview")}
          />
          <TabButton
            label="Code"
            active={activeTab === "Code"}
            onClick={() => setActiveTab("Code")}
          />
        </div>

        {/* Code Tab */}
        {activeTab === "Code" && (
          <div className="overflow-x-auto bg-[#F4F4F580] dark:bg-zinc-900/50 rounded-b-xl">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 dark:border-zinc-600">
              <span className="text-xs text-zinc-900 dark:text-zinc-200 font-mono">
                component usage
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">TSX</span>
            </div>
            <pre className="px-6 py-5 text-sm font-mono text-zinc-900 dark:text-zinc-200 leading-relaxed overflow-x-auto">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === "Preview" && (
          <div>
            <div className="overflow-x-auto">
              <table
                className="w-full border-collapse"
                style={{ tableLayout: "fixed" }}
              >
                <thead>
                  {/* Header Row */}
                  <tr className="bg-zinc-50 dark:bg-zinc-800/80 text-left text-sm text-[#71717A] dark:text-zinc-400">
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
                          style={{
                            width:
                              colWidths[column.key as string] ||
                              column.defaultWidth,
                            minWidth: column.minWidth,
                          }}
                          className={`relative border-b border-r border-zinc-200 dark:border-zinc-700 px-4 py-4 ${alignClass}`}
                        >
                          <span>{column.label}</span>
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const startX = e.clientX;
                              const startWidth =
                                colWidths[column.key as string] ||
                                column.defaultWidth;

                              const onMouseMove = (moveEvent: MouseEvent) => {
                                const deltaX = moveEvent.clientX - startX;
                                setColWidths((prev) => {
                                  const newW = Math.max(
                                    column.minWidth,
                                    startWidth + deltaX
                                  );
                                  return {
                                    ...prev,
                                    [column.key as string]: newW,
                                  };
                                });
                              };

                              const onMouseUp = () => {
                                document.removeEventListener(
                                  "mousemove",
                                  onMouseMove
                                );
                                document.removeEventListener(
                                  "mouseup",
                                  onMouseUp
                                );
                              };

                              document.addEventListener(
                                "mousemove",
                                onMouseMove
                              );
                              document.addEventListener("mouseup", onMouseUp);
                            }}
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-zinc-300 dark:hover:bg-zinc-600 active:bg-zinc-400 dark:active:bg-zinc-500 z-10 transition-colors"
                          />
                        </th>
                      );
                    })}
                  </tr>

                  {/* Filter Row */}
                  <tr className="bg-zinc-50/50 dark:bg-zinc-800/50">
                    {columns.map((column) => {
                      const filterValue = filters[column.key] ?? "";
                      const sortLabels =
                        column.key === "sent"
                          ? { asc: "Oldest", desc: "Newest" }
                          : undefined;

                      return (
                        <td
                          key={`filter-${column.key}`}
                          className="border-b border-r border-zinc-200 dark:border-zinc-700 px-2 py-2"
                        >
                          {column.filterType === "text" && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <FilterBox
                                  value={filterValue}
                                  onChange={(val) =>
                                    onFilterChange(column.key, val)
                                  }
                                  operator={filterOperators?.[column.key]}
                                  onOperatorChange={(op) =>
                                    onFilterOperatorChange?.(column.key, op)
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
                              value={filterValue || "all"}
                              onChange={(val: AttachmentValue) =>
                                onFilterChange(column.key, val)
                              }
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
                        className="text-sm text-[#09090B] dark:text-zinc-200 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-700/50"
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
                              className={`border-b border-r border-zinc-200 dark:border-zinc-700 px-4 py-4 ${alignClass}`}
                            >
                              {column.render
                                ? column.render(item)
                                : item[column.key] !== undefined &&
                                  item[column.key] !== null
                                  ? String(item[column.key])
                                  : "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
                      >
                        No matching records found.
                      </td>
                    </tr>
                  )}

                  {renderSummary && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50/30 dark:bg-zinc-800/30 px-5 py-3 text-right text-sm font-medium text-zinc-500 dark:text-zinc-400"
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
              totalItems={totalItems}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
