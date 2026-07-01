import SortIcon from "../atoms/SortIcon";

interface Props<T> {
    label: string;
    column: keyof T;

    sortKey: keyof T | null;
    direction: "asc" | "desc";

    onSort: (key: keyof T) => void;
}

export default function SortableHeader<T>({
    label,
    column,
    sortKey,
    direction,
    onSort,
}: Props<T>) {

    return (
        <th
            className="cursor-pointer"
            onClick={() => onSort(column)}
        >
            <div className="flex items-center gap-1">

                {label}

                <SortIcon
                    active={sortKey === column}
                    direction={direction}
                />

            </div>
        </th>
    )
}