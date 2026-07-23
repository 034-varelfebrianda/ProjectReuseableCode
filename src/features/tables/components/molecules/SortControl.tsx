import { useState } from "react";
import SortDropdown from "../atoms/SortDropdown";
import type { SortDirection } from "../../utils/sort";

interface SortControlProps {
  activeSort?: boolean;
  sortDirection?: SortDirection;
  onSort?: (direction: SortDirection) => void;
  sortAscLabel?: string;
  sortDescLabel?: string;
  mode?: "client" | "server";
}

export default function SortControl({
  activeSort = false,
  sortDirection = "asc",
  onSort,
  sortAscLabel = "A-Z",
  sortDescLabel = "Z-A",
  mode = "client",
}: SortControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (direction: SortDirection) => {
    onSort?.(direction);
    setIsOpen(false);
  };

  return (
    <SortDropdown
      mode={mode}
      activeSort={activeSort}
      sortDirection={sortDirection}
      sortAscLabel={sortAscLabel}
      sortDescLabel={sortDescLabel}
      onSort={handleSelect}
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
    />
  );
}
