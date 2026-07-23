import { useState, useCallback } from "react";
import type { FilterValue } from "../features/tables/utils/types";
import type { SortDirection } from "../features/tables/utils/sort";

export interface UseTableStateOptions {
  initialPageSize?: number;
}

export function useTableState<T>(options: UseTableStateOptions = {}) {
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  const [sortField, setSortField] = useState<(keyof T & string) | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.initialPageSize || 10);

  const handleFilterChange = useCallback(
    (key: keyof T & string, value: FilterValue) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
    },
    [],
  );

  const handleSortChange = useCallback(
    (field: (keyof T & string) | null, direction: SortDirection | null) => {
      setSortField(field);
      setSortDirection(direction || "asc");
      setCurrentPage(1); // Reset ke halaman 1 saat sorting berubah
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  return {
    filters,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleFilterChange,
    handleSortChange,
    resetFilters,
  };
}
