import { useState, type MouseEvent as ReactMouseEvent, ReactNode } from "react";
import TabButton from "../atoms/TabButton";
import BreadCrumbs from "../molecules/BreadCrumbs";
import GridTopBar from "../molecules/GridTopBar";
import Pagination from "../molecules/Pagination";
import FilterBox from "../atoms/FIlterBox";
import AttachmentBox, { AttachmentValue } from "../atoms/AttachmentBox";

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
  title: string;
  breadcrumbItems: Array<{ label: string }>;
  data: T[];
  columns: Column<T>[];
  // Filters state mapping: column key -> filter value
  filters: Record<string, FilterValue>;
  onFilterChange: (key: keyof T & string, value: FilterValue) => void;
  // Sort state
  sortField: (keyof T & string) | null;
  sortDirection: "asc" | "desc";
  // allow clearing sort: pass null for field and direction
  onSortChange: (
    field: (keyof T & string) | null,
    direction: "asc" | "desc" | null
  ) => void;
  // Pagination state
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  // Custom summary rendering
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
}: ReusableDataTableProps<T>) {
  const [columnWidths, setColumnWidths] = useState<number[]>(() =>
    columns.map((col) => col.defaultWidth)
  );
  const [openSortColumn, setOpenSortColumn] = useState<string | null>(null);

  const handleResizeStart = (
    columnIndex: number,
    event: ReactMouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidths = [...columnWidths];
    const startWidth = startWidths[columnIndex];

    const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.max(
        columns[columnIndex].minWidth,
        startWidth + delta
      );
      setColumnWidths((prevWidths) => {
        const next = [...prevWidths];
        next[columnIndex] = nextWidth;
        return next;
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Pagination slicing
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
        <div className="flex border-b border-zinc-200">
          <TabButton label="Preview" active />
          <TabButton label="Code" />
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-zinc-50 text-left text-sm text-[#71717A]">
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    style={{
                      width: columnWidths[index],
                      minWidth: column.minWidth,
                    }}
                    className={`relative border-b border-r border-zinc-200 px-4 py-4 select-none ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : ""
                      }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 ${column.align === "center" ? "justify-center" : column.align === "right" ? "justify-end" : ""}`}>
                      <span>{column.label}</span>
                    </div>
                    {index < columns.length - 1 && (
                      <div
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-zinc-200/50"
                        onMouseDown={(event) => handleResizeStart(index, event)}
                      />
                    )}
                  </th>
                ))}
              </tr>

              {/* Dynamic Filter Row */}
              <tr className="bg-zinc-50/50">
                {columns.map((column) => {
                  const filterValue = filters[column.key] ?? "";
                  const isOpen = openSortColumn === column.key;
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
                        <FilterBox
                          value={filterValue}
                          onChange={(val) => onFilterChange(column.key, val)}
                          placeholder={`${column.label}...`}
                          showSort={column.sortable}
                          activeSort={sortField === column.key}
                          sortDirection={sortDirection}
                          isSortOpen={isOpen}
                          onToggleSortOpen={() =>
                            setOpenSortColumn((prev) => (prev === column.key ? null : column.key))
                          }
                          onSort={(direction) => {
                            // choose same active option -> clear
                            if (sortField === column.key && sortDirection === direction) {
                              onSortChange(null, null);
                            } else {
                              onSortChange(column.key, direction);
                            }
                            setOpenSortColumn(null);
                          }}
                          sortAscLabel={sortLabels?.asc ?? "A-Z"}
                          sortDescLabel={sortLabels?.desc ?? "Z-A"}
                        />
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
                    className="text-sm text-[#09090B] hover:bg-zinc-50/50 transition-colors"
                  >
                    {columns.map((column, index) => {
                      const alignmentClass =
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                            ? "text-right"
                            : "";

                      return (
                        <td
                          key={`${item.id}-${column.key}`}
                          style={{ width: columnWidths[index] }}
                          className={`border-b border-r border-zinc-200 px-4 py-4 ${alignmentClass}`}
                        >
                          {column.render
                            ? column.render(item)
                            : (item[column.key] !== undefined && item[column.key] !== null
                              ? String(item[column.key])
                              : "-")}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-zinc-400 text-sm"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}

              {/* Dynamic Summary Row */}
              {renderSummary && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="border-b border-zinc-200 px-5 py-3 text-right text-sm font-medium text-zinc-500 bg-zinc-50/30"
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
