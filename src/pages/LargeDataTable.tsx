import { useMemo, useState } from "react";
import {
  LargeDataBase as initialMails,
  MailItem,
} from "../features/tables/data/LargeDataBase";
import ReusableDataTable, {
  Column,
} from "../features/tables/components/organism/ReusableDataTable";
import Checkbox from "../features/tables/components/atoms/CheckBox";
import { sortItems } from "../features/tables/utils/sort";
import { matchFilter } from "../features/tables/utils/filter";
import { TableMode } from "../types/enums";
import { useTableState } from "../hooks/useTableState";

interface TableMailItem extends MailItem {
  id: number;
}

export default function LargeDataTable() {
  const [mails] = useState<TableMailItem[]>(() =>
    initialMails.map((mail) => ({ ...mail })),
  );

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
  } = useTableState<TableMailItem>();

  const filteredMails = useMemo(() => {
    return mails.filter((mail) => {
      const fromMatch = matchFilter(mail.from, filters.from);
      const subjectMatch = matchFilter(mail.subject, filters.subject);
      const sentMatch = matchFilter(mail.sent, filters.sent);
      const attachmentMatch = matchFilter(mail.attachment, filters.attachment);

      return fromMatch && subjectMatch && sentMatch && attachmentMatch;
    });
  }, [mails, filters]);

  const sortedMails = useMemo(() => {
    if (!sortField) return filteredMails;

    return sortItems(filteredMails, sortField, sortDirection);
  }, [filteredMails, sortField, sortDirection]);

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
      filterType: "date",
      sortLabels: { asc: "Oldest", desc: "Newest" },
    },
    {
      key: "attachment",
      label: "Attachment?",
      defaultWidth: 100,
      minWidth: 80,
      align: "center",
      filterType: "select",
      filterOptions: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
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

    if (totalKb >= 1024 * 1024)
      return `Filtered Sum = ${(totalKb / (1024 * 1024)).toFixed(2)} GB`;
    if (totalKb >= 1024)
      return `Filtered Sum = ${(totalKb / 1024).toFixed(2)} MB`;

    return;
  };

  return (
    <>
      <ReusableDataTable
        mode={TableMode.CLIENT}
        data={sortedMails}
        allData={mails}
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
    </>
  );
}
