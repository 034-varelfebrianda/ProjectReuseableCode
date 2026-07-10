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
            {renderSummary(allData)}
          </td>
        </tr>
      )}
    </tbody>
  );
}
