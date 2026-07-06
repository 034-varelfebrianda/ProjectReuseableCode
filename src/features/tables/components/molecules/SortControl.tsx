import { useState } from "react";
import SortByClient from "../atoms/SortByClient";
import SortByBackend from "../atoms/SortByBackend";
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

  const commonProps = {
    activeSort,
    sortDirection,
    sortAscLabel,
    sortDescLabel,
    onSort: handleSelect,
    isOpen,
    onToggle: () => setIsOpen((prev) => !prev),
  };

  return mode === "server" ? <SortByBackend {...commonProps} /> : <SortByClient {...commonProps} />;
}
