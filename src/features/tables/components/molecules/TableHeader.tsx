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
                colWidths[column.key as string] || column.defaultWidth,
              minWidth: column.minWidth,
            }}
            className={`relative border-b border-r border-zinc-200 dark:border-zinc-700 px-4 py-4 ${alignClass}`}
          >
            <span>{column.label}</span>
            <div
              onMouseDown={onResize(column)}
              className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-zinc-300 dark:hover:bg-zinc-600 active:bg-zinc-400 dark:active:bg-zinc-500 z-10 transition-colors"
            />
          </th>
        );
      })}
    </tr>
  );
}
