import { useMemo, useCallback } from "react";
import ReusableDataTable, {
  Column,
} from "../features/tables/components/organism/ReusableDataTable";
import type { FilterValue } from "../features/tables/utils/types";
import { useJobVacancy } from "../hooks/useJobVacancy";
import { useDebounce } from "../hooks/useDebounce";
import { useTableState } from "../hooks/useTableState";
import type { JobVacancyItem, FilterConfig } from "../types/jobVacancyTypes";
import {
  FilterOperation,
  FilterConjunction,
  JobStatus,
  TableMode,
} from "../types/enums";

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

    const timePart = date
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(".", ":");

    const tzName =
      date
        .toLocaleTimeString("id-ID", {
          timeZoneName: "short",
        })
        .split(" ")
        .pop() || "";

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
  const {
    filters,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleFilterChange,
    handleSortChange,
  } = useTableState<Row>({ initialPageSize: 10 });

  const debouncedFilters = useDebounce(filters, 500);

  const buildFilters = useCallback((filters: Record<string, FilterValue>) => {
    const filterArray: FilterConfig[] = [];

    const processFilter = (key: string, filterVal: FilterValue | undefined) => {
      if (!filterVal) return;

      if (typeof filterVal === "string") {
        const val = filterVal.trim();

        if (val) {
          filterArray.push({
            key,
            value: val,
            operation: FilterOperation.MATCH,
            conjunction: FilterConjunction.OR,
          });
        }
      } else if (
        typeof filterVal === "object" &&
        "type" in filterVal &&
        filterVal.type === "date_tree"
      ) {
        filterVal.selectedDates.forEach((d) => {
          filterArray.push({
            key,
            value: d,
            operation: FilterOperation.MATCH,
            conjunction: FilterConjunction.OR,
          });
        });
      } else if (typeof filterVal === "object" && "conditions" in filterVal) {
        const active = filterVal.conditions.filter(
          (c) => c.value && c.value.trim().length > 0,
        );

        active.forEach((cond) => {
          filterArray.push({
            key,
            value: cond.value.trim(),
            operation:
              cond.operator === "equals"
                ? FilterOperation.EQUAL
                : FilterOperation.MATCH,
            conjunction: filterVal.logic.toLowerCase(),
          });
        });
      }
    };

    processFilter("jobTitle", filters.jobTitle);
    processFilter("location", filters.location);
    processFilter("jobType", filters.jobType);
    processFilter("createDate", filters.createDate);

    filterArray.push({
      key: "jobStatus",
      value: JobStatus.ACTIVE,
      operation: FilterOperation.EQUAL,
      conjunction: FilterConjunction.AND,
    });

    return filterArray;
  }, []);

  const params = useMemo(
    () => ({
      pageNo: currentPage - 1,
      pageSize,
      sortByColumn: sortField ?? undefined,
      sortType: sortField ? sortDirection : undefined,
      filter: buildFilters(debouncedFilters),
    }),
    [
      currentPage,
      pageSize,
      debouncedFilters,
      sortField,
      sortDirection,
      buildFilters,
    ],
  );

  const {
    data: apiData = [],
    loading,
    error,
    totalItems,
  } = useJobVacancy(params);

  const rows: Row[] = useMemo(
    () =>
      apiData.map((item) => ({
        ...item,
        id: item.uniqueId,
      })),
    [apiData],
  );

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
      filterType: "date",
      sortLabels: {
        asc: "Oldest",
        desc: "Newest",
      },
      render: (row) => formatIsoDateToIndonesian(row.createDate),
    },
  ];

  if (loading) {
    return (
      <div className="jobvacation-page">
        <div className="jobvacation-message">Loading job vacancies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobvacation-page">
        <div className="jobvacation-error">{error}</div>
      </div>
    );
  }

  return (
    <main className="jobvacation">
      <ReusableDataTable
        mode={TableMode.SERVER}
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
