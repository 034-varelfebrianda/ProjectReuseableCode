import type { Column } from "../../utils/types";

interface TableHeaderProps<T> {
  columns: Column<T>[];
  colWidths: Record<string, number>;
  onResize: (column: Column<T>) => React.MouseEventHandler;
}

export default function TableHeader<T>({
  columns,
  colWidths,
  onResize,
}: TableHeaderProps<T>) {
  return (
    <tr className="bg-theme-bg-header text-left text-sm text-theme-text-secondary">
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
                colWidths[column.key as string] || column.defaultWidth,
              minWidth: column.minWidth,
            }}
            className={`relative border-b border-r border-theme-border px-4 py-4 ${alignClass}`}
          >
            <span>{column.label}</span>
            <div
              onMouseDown={onResize(column)}
              className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-theme-border/50 active:bg-theme-border z-10 transition-colors"
            />
          </th>
        );
      })}
    </tr>
  );
}
