import { ChevronsUpDown } from "lucide-react";
import type { SortDirection } from "../../utils/sort";

interface SortByBackendProps {
  activeSort?: boolean;
  sortDirection?: SortDirection;
  sortAscLabel?: string;
  sortDescLabel?: string;
  onSort?: (direction: SortDirection) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function SortByBackend({
  activeSort = false,
  sortDirection = "asc",
  sortAscLabel = "A-Z",
  sortDescLabel = "Z-A",
  onSort,
  isOpen = false,
  onToggle,
}: SortByBackendProps) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1 rounded px-1 text-[#71717A] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-zinc-200 ${activeSort ? "bg-zinc-100 dark:bg-zinc-700" : ""
          }`}
        aria-label="Server-side sort"
      >
        <ChevronsUpDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg">
          <div className="border-b border-zinc-100 dark:border-zinc-700 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Server-side sort
          </div>
          <button
            type="button"
            onClick={() => onSort?.("asc")}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${activeSort && sortDirection === "asc" ? "text-sky-600 dark:text-sky-400" : "text-zinc-500 dark:text-zinc-400"
              } hover:bg-zinc-100 dark:hover:bg-zinc-700`}
          >
            <span>{sortAscLabel}</span>
            {activeSort && sortDirection === "asc" && <span>✓</span>}
          </button>
          <button
            type="button"
            onClick={() => onSort?.("desc")}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${activeSort && sortDirection === "desc" ? "text-sky-600 dark:text-sky-400" : "text-zinc-500 dark:text-zinc-400"
              } hover:bg-zinc-100 dark:hover:bg-zinc-700`}
          >
            <span>{sortDescLabel}</span>
            {activeSort && sortDirection === "desc" && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
