import { ChevronsUpDown } from "lucide-react";
import type { SortDirection } from "../../utils/sort";

interface SortByClientProps {
  activeSort?: boolean;
  sortDirection?: SortDirection;
  sortAscLabel?: string;
  sortDescLabel?: string;
  onSort?: (direction: SortDirection) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function SortByClient({
  activeSort = false,
  sortDirection = "asc",
  sortAscLabel = "A-Z",
  sortDescLabel = "Z-A",
  onSort,
  isOpen = false,
  onToggle,
}: SortByClientProps) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1 rounded px-1 text-[#71717A] hover:text-[#09090B] ${
          activeSort ? "bg-zinc-100" : ""
        }`}
        aria-label="Client-side sort"
      >
        <ChevronsUpDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border border-zinc-200 bg-white shadow-lg">
          <div className="border-b border-zinc-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            Client-side sort
          </div>
          <button
            type="button"
            onClick={() => onSort?.("asc")}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
              activeSort && sortDirection === "asc" ? "text-sky-600" : "text-zinc-500"
            } hover:bg-zinc-100`}
          >
            <span>{sortAscLabel}</span>
            {activeSort && sortDirection === "asc" && <span>✓</span>}
          </button>
          <button
            type="button"
            onClick={() => onSort?.("desc")}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
              activeSort && sortDirection === "desc" ? "text-sky-600" : "text-zinc-500"
            } hover:bg-zinc-100`}
          >
            <span>{sortDescLabel}</span>
            {activeSort && sortDirection === "desc" && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
