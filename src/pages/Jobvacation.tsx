import { useMemo, useState } from "react";
import ReusableDataTable, {
  type Column,
} from "../features/tables/components/organism/ReusableDataTable";
import { useJobVacancies } from "../hooks/useJobvacation";
import type { JobVacancy } from "../types/JobvacationTypes";

type JobVacancyRow = JobVacancy & { id: string };
type SortDirection = "asc" | "desc";

const toApiSortField = (field: keyof JobVacancyRow | null | undefined) => {
  if (field === "applicationDeadline") return "applicationDeadline";
  if (field === "jobTitle") return "jobTitle";
  if (field === "location") return "location";
  if (field === "jobType") return "jobType";
  return undefined;
};

const buildFilters = (filters: Record<string, string>) => {
  return Object.entries(filters).reduce<Record<string, string>>((acc, [key, value]) => {
    const cleanedValue = value.trim();
    if (cleanedValue) {
      acc[key] = cleanedValue;
    }
    return acc;
  }, {});
};

export default function JobVacancy() {
  const { data, loading, error, totalItems, fetchJobvacation } = useJobVacancies();

  const [filters, setFilters] = useState<Record<string, string>>({
    jobTitle: "",
    location: "",
    jobType: "",
    applicationDeadline: "",
  });

  const [sortField, setSortField] = useState<keyof JobVacancyRow | null>("applicationDeadline");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rows = useMemo(() => data.map((item) => ({ ...item, id: item.uniqueId })), [data]);

  const columns: Column<JobVacancyRow>[] = [
    {
      key: "jobTitle",
      label: "Job Title",
      defaultWidth: 260,
      minWidth: 180,
      sortable: true,
      filterType: "text",
    },
    {
      key: "location",
      label: "Location",
      defaultWidth: 220,
      minWidth: 140,
      sortable: true,
      filterType: "text",
    },
    {
      key: "jobType",
      label: "Job Type",
      defaultWidth: 180,
      minWidth: 120,
      sortable: true,
      filterType: "text",
    },
    {
      key: "applicationDeadline",
      label: "Deadline",
      defaultWidth: 180,
      minWidth: 140,
      sortable: true,
      filterType: "text",
    },
  ];

  const handleFilterChange = (key: keyof JobVacancyRow, value: string) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    setCurrentPage(1);
    void fetchJobvacation(0, pageSize, toApiSortField(sortField), sortDirection, buildFilters(nextFilters));
  };

  const handleSortChange = (field: keyof JobVacancyRow | null, direction: SortDirection | null) => {
    const nextField = field ?? "applicationDeadline";
    const nextDirection = direction ?? "asc";

    setSortField(field);
    setSortDirection(nextDirection);
    setCurrentPage(1);
    void fetchJobvacation(0, pageSize, toApiSortField(nextField), nextDirection, buildFilters(filters));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    void fetchJobvacation(page - 1, pageSize, toApiSortField(sortField), sortDirection, buildFilters(filters));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    void fetchJobvacation(0, size, toApiSortField(sortField), sortDirection, buildFilters(filters));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <ReusableDataTable
      title="Job Vacancies"
      breadcrumbItems={[
        { label: "Components" },
        { label: "Tables" },
        { label: "Job Vacancies" },
      ]}
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
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}