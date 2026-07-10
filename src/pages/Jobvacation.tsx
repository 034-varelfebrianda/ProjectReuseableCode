import { useMemo, useState, useCallback } from "react";
import ReusableDataTable, { Column } from "../features/tables/components/organism/ReusableDataTable";
import { useJobVacancy } from "../hooks/useJobVacancy";
import { useDebounce } from "../hooks/useDebounce";
import type { JobVacancyItem } from "../types/jobVacancyTypes";
import type { SortDirection } from "../features/tables/utils/sort";
import type { FilterState } from "../features/tables/components/atoms/FilterPopup";

// Tipe data Row memperluas JobVacancyItem dengan menambahkan properti 'id' yang unik
type Row = JobVacancyItem & { id: string };

/**
 * Fungsi pembantu untuk memformat string tanggal ISO ke format Indonesia.
 * Contoh output: "10 Juli 2026, 13:21 WIB"
 */
const formatIsoDateToIndonesian = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // Memformat bagian tanggal (Hari Bulan Tahun)
    const datePart = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Memformat bagian waktu (Jam:Menit)
    const timePart = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(".", ":");

    // Menentukan label zona waktu (WIB, WITA, WIT) berdasarkan GMT offset
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
  // State untuk menyimpan filter pencarian yang dimasukkan pengguna
  const [filters, setFilters] = useState<Record<string, string | FilterState>>({
    jobTitle: "",
  });

  // State untuk kolom yang diurutkan (sorting) dan arah pengurutannya (asc/desc)
  const [sortField, setSortField] = useState<keyof Row | null>("jobTitle");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // State untuk manajemen halaman (pagination) pada tabel
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Menggunakan debounce filter sebesar 500ms agar query API tidak dipanggil terlalu sering saat mengetik
  const debouncedFilters = useDebounce(filters, 500);

  /**
   * Mengubah struktur data filter frontend menjadi format parameter filter
   * yang dikenali oleh server API (key, value, operation, conjunction).
   */
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

    // Memproses field filter yang aktif
    processFilter("jobTitle", filters.jobTitle);
    processFilter("location", filters.location);
    processFilter("jobType", filters.jobType);

    // Menambahkan filter default agar hanya menampilkan lowongan pekerjaan yang ACTIVE
    filterArray.push({
      key: "jobStatus",
      value: "ACTIVE",
      operation: "EQUAL",
      conjunction: "and",
    });

    return filterArray;
  }, []);

  // Menyusun object query parameter secara memoized untuk memicu fetch data saat state berubah
  const params = useMemo(
    () => ({
      pageNo: currentPage - 1, // API menggunakan indeks halaman 0-based
      pageSize,
      sortByColumn: (sortField as string) ?? undefined,
      sortType: sortDirection,
      filter: buildFilters(debouncedFilters),
    }),
    [currentPage, pageSize, debouncedFilters, sortField, sortDirection, buildFilters]
  );

  // Mengambil data dari server API menggunakan custom hook useJobVacancy
  const { data: apiData = [], loading, error, totalItems } = useJobVacancy(params);

  // Memetakan uniqueId dari API ke properti id agar kompatibel dengan baris tabel
  const rows: Row[] = useMemo(() => apiData.map((item) => ({ ...item, id: item.uniqueId })), [apiData]);

  // Definisi kolom tabel, lengkap dengan label, lebar default/minimal, tipe filter, dan fungsi render kustom
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
      render: (row) => formatIsoDateToIndonesian(row.createDate), // Menggunakan helper format tanggal Indonesia
    },
  ];

  // Callback handler saat ada perubahan nilai filter
  const handleFilterChange = (key: keyof Row & string, value: string | FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Mereset ke halaman pertama saat filter berubah
  };

  // Callback handler saat pengurutan kolom diubah
  const handleSortChange = (field: keyof Row | null, direction: SortDirection | null) => {
    if (!field) return;
    setSortField(field);
    setSortDirection(direction ?? "asc");
    setCurrentPage(1); // Mereset ke halaman pertama saat pengurutan berubah
  };

  // Tampilan loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] dark:bg-zinc-900 px-6 py-6">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 text-center text-zinc-600 dark:text-zinc-400 shadow-sm">
          Loading job vacancies...
        </div>
      </div>
    );
  }

  // Tampilan pesan error jika terjadi kegagalan fetch data
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] dark:bg-zinc-900 px-6 py-6">
        <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/30 p-6 text-center text-rose-600 dark:text-rose-400 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  // Render komponen ReusableDataTable dalam mode "server" (server-side pagination, sorting, & filtering)
  return (
    <main className=" p-5 ">
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
