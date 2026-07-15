import type { ReactNode } from "react";
import type { Column } from "../../utils/types";

interface TableBodyProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  allData: T[];
  renderSummary?: (filteredData: T[]) => ReactNode;
}

export default function TableBody<T extends { id: string | number }>({
  data,
  columns,
  allData,
  renderSummary,
}: TableBodyProps<T>) {
  return (
    <tbody className="">
      {data.length > 0 ? (
        data.map((item) => (
          <tr
            key={item.id}
            className="text-sm text-theme-text-primary transition-colors hover:bg-theme-bg-row-hover"
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
                  className={`border-b border-r border-theme-border px-4 py-4 ${alignClass}`}
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
            className="px-4 py-8 text-center text-sm text-theme-text-muted"
          >
            No matching records found.
          </td>
        </tr>
      )}

      {renderSummary && (
        <tr>
          <td
            colSpan={columns.length}
            className="border-b border-theme-border bg-theme-bg-summary px-5 py-3 text-right text-sm font-medium text-theme-text-secondary"
          >
            {renderSummary(allData)}
          </td>
        </tr>
      )}
    </tbody>
  );
}
