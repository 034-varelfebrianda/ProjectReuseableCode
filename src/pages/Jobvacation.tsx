import { useMemo, useState } from "react";
import ReusableDataTable, { Column } from "../features/tables/components/organism/ReusableDataTable";
import { useJobVacancy } from "../hooks/useJobVacancy";
import { useDebounce } from "../hooks/useDebounce";
import type { JobVacancyItem } from "../types/jobVacancyTypes";
import type { SortDirection } from "../features/tables/utils/sort";

type Row = JobVacancyItem & { id: string };

export default function Jobvacation() {
  const [filters, setFilters] = useState<Record<string, string>>({
    jobTitle: "",
  });

  const [sortField, setSortField] = useState<keyof Row | null>("jobTitle");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedFilters = useDebounce(filters, 1000);

  const buildFilters = (filters: Record<string, string>) => {
    const filterArray: { key: string; value: string; operation: string; conjunction: string }[] = [];

    const jobTitleSearch = filters.jobTitle?.trim();
    if (jobTitleSearch) {
      filterArray.push(
        { key: "jobTitle", value: jobTitleSearch, operation: "MATCH", conjunction: "or" }
      );
    }

    const locationSearch = filters.location?.trim();
    if (locationSearch) {
      filterArray.push({
        key: "location",
        value: locationSearch,
        operation: "MATCH",
        conjunction: "or",

      });
    }

    const jobTypeSearch = filters.jobType?.trim();
    if (jobTypeSearch) {
      filterArray.push({
        key: "jobType",
        value: jobTypeSearch,
        operation: "MATCH",
        conjunction: "or",
      });
    }

    // Always include jobStatus ACTIVE at the end (or anywhere)
    filterArray.push({
      key: "jobStatus",
      value: "ACTIVE",
      operation: "EQUAL",
      conjunction: "and",


    });

    return filterArray;
  };

  const params = useMemo(
    () => ({
      pageNo: currentPage - 1,
      pageSize,
      sortByColumn: (sortField as string) ?? undefined,
      sortType: sortDirection,
      filter: buildFilters(debouncedFilters),
    }),
    [currentPage, pageSize, debouncedFilters, sortField, sortDirection]
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
      defaultWidth: 180,
      minWidth: 160,
    },
  ];

  const handleFilterChange = (key: keyof Row & string, value: string) => {
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
      <div className="min-h-screen bg-[#f7f7f8] px-6 py-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-zinc-600 shadow-sm">
          Loading job vacancies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] px-6 py-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-600 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-5">
      <ReusableDataTable
        title="Job Vacancy"
        breadcrumbItems={[{ label: "Components" }, { label: "Grid" }, { label: "Job Vacancy" }]}
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
