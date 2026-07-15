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
        className={`flex items-center gap-1 rounded px-1 text-theme-text-secondary hover:text-theme-text-primary ${activeSort ? "bg-theme-bg-header" : ""
          }`}
        aria-label="Server-side sort"
      >
        <ChevronsUpDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border border-theme-border bg-theme-bg-dropdown shadow-lg">
          <div className="border-b border-theme-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-theme-text-muted">
            Server-side sort
          </div>
          <button
            type="button"
            onClick={() => onSort?.("asc")}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${activeSort && sortDirection === "asc" ? "text-theme-accent" : "text-theme-text-secondary"
              } hover:bg-theme-bg-row-hover`}
          >
            <span>{sortAscLabel}</span>
            {activeSort && sortDirection === "asc" && <span>✓</span>}
          </button>
          <button
            type="button"
            onClick={() => onSort?.("desc")}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${activeSort && sortDirection === "desc" ? "text-theme-accent" : "text-theme-text-secondary"
              } hover:bg-theme-bg-row-hover`}
          >
            <span>{sortDescLabel}</span>
            {activeSort && sortDirection === "desc" && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
