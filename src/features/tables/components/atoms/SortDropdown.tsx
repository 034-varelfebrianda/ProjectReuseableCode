import { ChevronsUpDown } from "lucide-react";
import type { SortDirection } from "../../utils/sort";

interface SortDropdownProps {
  activeSort?: boolean;
  sortDirection?: SortDirection;
  onSort?: (direction: SortDirection) => void;
  sortAscLabel?: string;
  sortDescLabel?: string;
  isOpen: boolean;
  onToggle: () => void;
  mode?: "client" | "server";
}

export default function SortDropdown({
  activeSort = false,
  sortDirection = "asc",
  onSort,
  sortAscLabel = "A-Z",
  sortDescLabel = "Z-A",
  isOpen,
  onToggle,
  mode = "client",
}: SortDropdownProps) {
  const title = mode === "server" ? "Server-side sort" : "Client-side sort";

  return (
    <div className="sort-dropdown">
      <button
        type="button"
        onClick={onToggle}
        className={`sort-dropdown-button ${activeSort ? "active" : ""}`}
        aria-label={title}
      >
        <ChevronsUpDown size={16} />
      </button>

      {isOpen && (
        <div className="sort-dropdown-menu">
          <div className="sort-dropdown-header">{title}</div>

          <button
            type="button"
            onClick={() => onSort?.("asc")}
            className={`sort-dropdown-option ${
              activeSort && sortDirection === "asc" ? "active" : ""
            }`}
          >
            <span>{sortAscLabel}</span>
            {activeSort && sortDirection === "asc" && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => onSort?.("desc")}
            className={`sort-dropdown-option ${
              activeSort && sortDirection === "desc" ? "active" : ""
            }`}
          >
            <span>{sortDescLabel}</span>
            {activeSort && sortDirection === "desc" && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
