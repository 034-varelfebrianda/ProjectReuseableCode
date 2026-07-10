import { useMemo, useState } from "react";
import { LargeDataBase as initialMails, MailItem } from "../features/tables/data/LargeDataBase";
import ReusableDataTable, { Column } from "../features/tables/components/organism/ReusableDataTable";
import Checkbox from "../features/tables/components/atoms/CheckBox";
import { sortItems, type SortDirection } from "../features/tables/utils/sort";
import type { FilterState } from "../features/tables/components/atoms/FilterPopup";
import { matchFilter } from "../features/tables/utils/filter";

interface TableMailItem extends MailItem {
  id: number;
}

type TableColumnKey = keyof TableMailItem & string;
type FilterValue = string | FilterState;
type TableFilters = Partial<Record<TableColumnKey, FilterValue>>;

const defaultFilters: TableFilters = {
  from: "",
  subject: "",
  sent: "",
  attachment: "all",
};

export default function LargeDataTable() {
  const [mails] = useState<TableMailItem[]>(() => initialMails.map((mail) => ({ ...mail })));
  const [filters, setFilters] = useState<TableFilters>(defaultFilters);
  const [sortField, setSortField] = useState<TableColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleFilterChange = (key: TableColumnKey, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: TableColumnKey | null, direction: SortDirection | null) => {
    if (field === null) {
      setSortField(null);
      setSortDirection("asc");
      return;
    }

    setSortField(field);
    setSortDirection(direction ?? "asc");
    setCurrentPage(1);
  };

  const filteredMails = useMemo(() => {
    return mails.filter((mail) => {
      const fromMatch = matchFilter(mail.from, filters.from);
      const subjectMatch = matchFilter(mail.subject, filters.subject);
      const sentMatch = matchFilter(mail.sent, filters.sent);

      const attachmentFilter = typeof filters.attachment === "string" ? filters.attachment : "all";
      const attachmentMatch =
        attachmentFilter === "all" ||
        (attachmentFilter === "yes" && mail.attachment === true) ||
        (attachmentFilter === "no" && mail.attachment === false);

      return fromMatch && subjectMatch && sentMatch && attachmentMatch;
    });
  }, [mails, filters]);

  const sortedMails = useMemo(() => {
    if (!sortField) return filteredMails;

    return sortItems(filteredMails, sortField, sortDirection);
  }, [filteredMails, sortField, sortDirection]);

  const columns: Column<TableMailItem>[] = [
    { key: "from", label: "From", defaultWidth: 200, minWidth: 100, sortable: true, filterType: "text" },
    { key: "subject", label: "Subject", defaultWidth: 400, minWidth: 180, sortable: true, filterType: "text" },
    {
      key: "sent",
      label: "Sent",
      defaultWidth: 120,
      minWidth: 80,
      sortable: true,
      filterType: "text",
      sortLabels: { asc: "Oldest", desc: "Newest" },
    },
    {
      key: "attachment",
      label: "Attachment?",
      defaultWidth: 100,
      minWidth: 80,
      align: "center",
      filterType: "select",
      render: (mail) => <Checkbox checked={mail.attachment} />,
    },
    { key: "size", label: "Size", defaultWidth: 100, minWidth: 60, align: "left" },
  ];

  const renderSummary = (items: TableMailItem[]) => {
    let totalKb = 0;

    items.forEach((item) => {
      const match = item.size.match(/^(\d+)\s*(KB|MB|GB)$/i);
      if (!match) return;

      const value = Number(match[1]);
      const unit = match[2].toUpperCase();
      if (unit === "KB") totalKb += value;
      else if (unit === "MB") totalKb += value * 1024;
      else if (unit === "GB") totalKb += value * 1024 * 1024;
    });

    if (totalKb >= 1024 * 1024) return `Filtered Sum = ${(totalKb / (1024 * 1024)).toFixed(2)} GB`;
    if (totalKb >= 1024) return `Filtered Sum = ${(totalKb / 1024).toFixed(2)} MB`;

    return;
  };

  return (
    <ReusableDataTable
      title="Large DataBase (Server Mode)"
      breadcrumbItems={[{ label: "Components" }, { label: "Grid" }, { label: "Large Database (Server Mode)" }]}
      mode="server"
      showThemeToggle
      data={sortedMails}
      columns={columns}
      filters={filters}
      onFilterChange={handleFilterChange}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortChange={handleSortChange}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={sortedMails.length}
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      renderSummary={renderSummary}
    />
  );
}