import { useMemo, useState, useCallback } from "react";
import ReusableDataTable, { Column } from "../features/tables/components/organism/ReusableDataTable";
import { useJobVacancy } from "../hooks/useJobVacancy";
import { useDebounce } from "../hooks/useDebounce";
import type { JobVacancyItem } from "../types/jobVacancyTypes";
import type { SortDirection } from "../features/tables/utils/sort";
import type { FilterState } from "../features/tables/components/atoms/FilterPopup";

type Row = JobVacancyItem & { id: string };

const formatIsoDateToIndonesian = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const datePart = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const timePart = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(".", ":");

    const tzName = date.toLocaleTimeString("id-ID", { timeZoneName: "short" }).split(" ").pop() || "";
    const tzLabel =
      tzName === "GMT+7"
        ? "WIB"
        : tzName === "GMT+8"
          ? "WITA"
          : tzName === "GMT+9"
            ? "WIT"
            : tzName;

    return `${datePart}, ${timePart} ${tzLabel}`.trim();
  } catch {
    return dateString;
  }
};

export default function Jobvacation() {
  const [filters, setFilters] = useState<Record<string, string | FilterState>>({
    jobTitle: "",
  });

  const [sortField, setSortField] = useState<keyof Row | null>("jobTitle");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedFilters = useDebounce(filters, 500);

  const buildFilters = useCallback((filters: Record<string, string | FilterState>) => {
    const filterArray: { key: string; value: string; operation: string; conjunction: string }[] = [];

    const processFilter = (key: string, filterVal: string | FilterState | undefined) => {
      if (!filterVal) return;

      if (typeof filterVal === "string") {
        const val = filterVal.trim();
        if (val) {
          filterArray.push({
            key,
            value: val,
            operation: "MATCH",
            conjunction: "or",
          });
        }
      } else if (typeof filterVal === "object" && "conditions" in filterVal) {
        const active = filterVal.conditions.filter((c) => c.value && c.value.trim().length > 0);
        active.forEach((cond) => {
          const op = cond.operator === "equals" ? "EQUAL" : "MATCH";
          filterArray.push({
            key,
            value: cond.value.trim(),
            operation: op,
            conjunction: filterVal.logic.toLowerCase(),
          });
        });
      }
    };

    processFilter("jobTitle", filters.jobTitle);
    processFilter("location", filters.location);
    processFilter("jobType", filters.jobType);

    filterArray.push({
      key: "jobStatus",
      value: "ACTIVE",
      operation: "EQUAL",
      conjunction: "and",
    });

    return filterArray;
  }, []);

  const params = useMemo(
    () => ({
      pageNo: currentPage - 1,
      pageSize,
      sortByColumn: (sortField as string) ?? undefined,
      sortType: sortDirection,
      filter: buildFilters(debouncedFilters),
    }),
    [currentPage, pageSize, debouncedFilters, sortField, sortDirection, buildFilters]
  );

  const { data: apiData = [], loading, error, totalItems } = useJobVacancy(params);

  const rows: Row[] = useMemo(() => apiData.map((item) => ({ ...item, id: item.uniqueId })), [apiData]);

  const columns: Column<Row>[] = [
    {
      key: "jobTitle",
      label: "Job Title",
      defaultWidth: 250,
      minWidth: 180,
      filterType: "text",
      sortable: true,
    },
    {
      key: "location",
      label: "Location",
      defaultWidth: 180,
      minWidth: 150,
      filterType: "text",
      sortable: true,
    },
    {
      key: "jobType",
      label: "Job Type",
      defaultWidth: 150,
      minWidth: 120,
      filterType: "text",
      sortable: true,
    },
    {
      key: "createDate",
      label: "Created Date",
      defaultWidth: 220,
      minWidth: 180,
      sortable: true,
      filterType: "text",
      sortLabels: { asc: "Oldest", desc: "Newest" },
      render: (row) => formatIsoDateToIndonesian(row.createDate),
    },
  ];

  const handleFilterChange = (key: keyof Row & string, value: string | FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: keyof Row | null, direction: SortDirection | null) => {
    if (!field) return;
    setSortField(field);
    setSortDirection(direction ?? "asc");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg-page px-6 py-6">
        <div className="rounded-xl border border-theme-border bg-theme-bg-table p-6 text-center text-theme-text-secondary shadow-sm">
          Loading job vacancies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-theme-bg-page px-6 py-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-600 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="pt-5">
      <ReusableDataTable
        mode="server"
        data={rows}
        columns={columns}
        filters={filters}
        onFilterChange={handleFilterChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        serverPageSize
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </main>
  );
}
