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
    <tbody className="table-body">
      {data.length > 0 ? (
        data.map((item) => (
          <tr key={item.id} className="table-row">
            {columns.map((column) => {
              const alignClass =
                column.align === "center"
                  ? "table-cell-center"
                  : column.align === "right"
                    ? "table-cell-right"
                    : "table-cell-left";

              return (
                <td
                  key={`${item.id}-${column.key}`}
                  style={{ width: column.defaultWidth }}
                  className={`table-cell ${alignClass}`}
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
          <td colSpan={columns.length} className="table-empty">
            No matching records found.
          </td>
        </tr>
      )}

      {renderSummary && (
        <tr>
          <td colSpan={columns.length} className="table-summary">
            {renderSummary(allData)}
          </td>
        </tr>
      )}
    </tbody>
  );
}
