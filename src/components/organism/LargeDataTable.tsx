import { useState } from "react";
import { LargeDataBase as initialMails, MailItem } from "../../data/LargeDataBase";
import ReusableDataTable, { Column } from "./ReusableDataTable";
import Checkbox from "../atoms/CheckBox";

interface TableMailItem extends MailItem {
  id: number;
}

type TableColumnKey = keyof TableMailItem & string;
type FilterValue = string;
type TableFilters = Record<string, FilterValue>;

export default function LargeDataTable() {
  const [mails] = useState<TableMailItem[]>(() =>
    initialMails.map((mail) => ({ ...mail }))
  );

  // Filters State
  const [filters, setFilters] = useState<TableFilters>({
    from: "",
    subject: "",
    sent: "",
    attachment: "all",
  });

  const handleFilterChange = (key: string, value: FilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Sorting State
  const [sortField, setSortField] = useState<TableColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSortChange = (
    field: TableColumnKey | null,
    direction: "asc" | "desc" | null
  ) => {
    if (field === null) {
      setSortField(null);
      setSortDirection("asc");
      return;
    }

    setSortField(field);
    setSortDirection(direction ?? "asc");
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Apply filters
  const filteredMails = mails.filter((mail) => {
    const fromMatch = String(mail.from ?? "")
      .toLowerCase()
      .includes((filters.from || "").toLowerCase());

    const subjectMatch = String(mail.subject ?? "")
      .toLowerCase()
      .includes((filters.subject || "").toLowerCase());

    const sentMatch = String(mail.sent ?? "")
      .toLowerCase()
      .includes((filters.sent || "").toLowerCase());

    const attachmentFilter = filters.attachment || "all";
    const attachmentMatch =
      attachmentFilter === "all" ||
      (attachmentFilter === "yes" && mail.attachment === true) ||
      (attachmentFilter === "no" && mail.attachment === false);

    return fromMatch && subjectMatch && sentMatch && attachmentMatch;
  });

  const getComparableValue = (item: TableMailItem, field: TableColumnKey) => {
    if (field === "sent") {
      const parsedDate = Date.parse(item.sent);
      return Number.isNaN(parsedDate) ? 0 : parsedDate;
    }

    if (field === "attachment") {
      return item.attachment ? 1 : 0;
    }

    const value = item[field];
    if (typeof value === "string") {
      return value.toLowerCase();
    }

    return value;
  };

  // Apply sorting
  const sortedMails = sortField
    ? [...filteredMails].sort((a, b) => {
      const aValue = getComparableValue(a, sortField);
      const bValue = getComparableValue(b, sortField);

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    })
    : filteredMails;

  const columns: Column<TableMailItem>[] = [
    {
      key: "from",
      label: "From",
      defaultWidth: 200,
      minWidth: 100,
      sortable: true,
      filterType: "text",
    },
    {
      key: "subject",
      label: "Subject",
      defaultWidth: 400,
      minWidth: 180,
      sortable: true,
      filterType: "text",
    },
    {
      key: "sent",
      label: "Sent",
      defaultWidth: 120,
      minWidth: 80,
      sortable: true,
      filterType: "text",
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
    {
      key: "size",
      label: "Size",
      defaultWidth: 100,
      minWidth: 60,
      align: "left",
    },
  ];

  // Dynamic summary calculating total size of filtered mails
  const renderSummary = (items: TableMailItem[]) => {
    let totalKb = 0;
    items.forEach((item) => {
      const match = item.size.match(/^(\d+)\s*(KB|MB|GB)$/i);
      if (match) {
        const val = parseInt(match[1], 10);
        const unit = match[2].toUpperCase();
        if (unit === "KB") totalKb += val;
        else if (unit === "MB") totalKb += val * 1024;
        else if (unit === "GB") totalKb += val * 1024 * 1024;
      }
    });

    let displaySize = `${totalKb} KB`;
    if (totalKb >= 1024 * 1024) {
      displaySize = `${(totalKb / (1024 * 1024)).toFixed(2)} GB`;
    } else if (totalKb >= 1024) {
      displaySize = `${(totalKb / 1024).toFixed(2)} MB`;
    }

    return `Filtered Sum = ${displaySize} (Total Sum = 16.16 MB)`;
  };

  return (
    <ReusableDataTable
      title="Large DataBase (Server Mode)"
      breadcrumbItems={[
        { label: "Components" },
        { label: "Grid" },
        { label: "Large Database (Server Mode)" },
      ]}
      data={sortedMails}
      columns={columns}
      filters={filters}
      onFilterChange={handleFilterChange}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortChange={handleSortChange}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      renderSummary={renderSummary}
    />
  );
}