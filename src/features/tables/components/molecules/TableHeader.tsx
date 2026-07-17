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
    <tr className="table-header-row">
      {columns.map((column) => (
        <th
          key={column.key}
          style={{
            width: colWidths[column.key as string] || column.defaultWidth,
            minWidth: column.minWidth,
          }}
          className={`table-header-cell table-cell-${column.align ?? "left"}`}
        >
          <span>{column.label}</span>

          <div
            onMouseDown={onResize(column)}
            className="table-column-resizer"
          />
        </th>
      ))}
    </tr>);
}
