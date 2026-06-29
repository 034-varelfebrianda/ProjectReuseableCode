import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { LargeDataBase as mails } from "../../data/LargeDataBase";
import Checkbox from "../atoms/CheckBox";
import TabButton from "../atoms/TabButton";

import GridFilterRow from "../molecules/GridFilterRow";
import GridTopBar from "../molecules/GridTopBar";
import Pagination from "../molecules/Pagination";
import BreadCrumbs from "../molecules/BreadCrumbs";

type SortField = "from" | "subject" | "sent" | null;

const columns = [
  { key: "from", label: "From", defaultWidth: 200, minWidth: 100 },
  { key: "subject", label: "Subject", defaultWidth: 400, minWidth: 180 },
  { key: "sent", label: "Sent", defaultWidth: 110, minWidth: 80 },
  { key: "attachment", label: "Attachment?", defaultWidth: 80, minWidth: 60, align: "center" },
  { key: "size", label: "Size", defaultWidth: 60, minWidth: 40 },
];

export default function LargeDataTable() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [sentFilter, setSentFilter] = useState("");
  const [attachmentFilter, setAttachmentFilter] = useState<"all" | "yes" | "no">("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnWidths, setColumnWidths] = useState<number[]>(() =>
    columns.map((column) => column.defaultWidth)
  );

  const handleResizeStart = (
    columnIndex: number,
    event: ReactMouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidths = [...columnWidths];
    const startWidth = startWidths[columnIndex];

    const onMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.max(
        columns[columnIndex].minWidth,
        startWidth + delta
      );
      setColumnWidths((prevWidths) => {
        const next = [...prevWidths];
        next[columnIndex] = nextWidth;
        return next;
      });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const filteredMails = mails.filter((mail) => {
    const hasFrom = String(mail.from ?? "").toLowerCase().includes(search.toLowerCase());
    const hasSubject = String(mail.subject ?? "").toLowerCase().includes(subjectFilter.toLowerCase());
    const hasSent = String(mail.sent ?? "").toLowerCase().includes(sentFilter.toLowerCase());
    const hasAttachment =
      attachmentFilter === "all" ||
      (attachmentFilter === "yes" && mail.attachment === true) ||
      (attachmentFilter === "no" && mail.attachment === false);
    return hasFrom && hasSubject && hasSent && hasAttachment;
  });

  const handleSortChange = (
    field: SortField,
    direction: "asc" | "desc"
  ) => {

    if (sortField === field && sortDirection === direction) {
      setSortField(null);
      setSortDirection("asc");
      return;
    }

    setSortField(field);
    setSortDirection(direction);
  };

  const sortedMails = sortField
    ? [...filteredMails].sort((a, b) => {
        const aValue =
          sortField === "sent"
            ? new Date(a.sent).getTime()
            : String(a[sortField] ?? "").toLowerCase();
        const bValue =
          sortField === "sent"
            ? new Date(b.sent).getTime()
            : String(b[sortField] ?? "").toLowerCase();

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filteredMails;

  return (
    <div>
      <div className="pb-5">
        <BreadCrumbs
          items={[
            { label: "Components" },
            { label: "Grid" },
            { label: "Large Database (Server Mode)" },
          ]}
        />
      </div>

      <div className="pb-3">
        <GridTopBar />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex border-b border-zinc-200">
          <TabButton label="Preview" active />
          <TabButton label="Code" />
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full min-w-275 border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-zinc-50 text-left size-3.5 text-[#71717A]">
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    style={{
                      width: columnWidths[index],
                      minWidth: column.minWidth,
                    }}
                    className={`relative border-b border-r border-zinc-200 px-4 py-4 ${
                      column.align === "center" ? "text-center" : ""
                    }`}
                  >
                    <span>{column.label}</span>
                    {index < columns.length - 1 && (
                      <div
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        onMouseDown={(event) => handleResizeStart(index, event)}
                      />
                    )}
                  </th>
                ))}
              </tr>

              <GridFilterRow
                search={search}
                onSearchChange={setSearch}
                subjectFilter={subjectFilter}
                onSubjectChange={setSubjectFilter}
                sentFilter={sentFilter}
                onSentChange={setSentFilter}
                attachmentFilter={attachmentFilter}
                onAttachmentChange={setAttachmentFilter}
                onSortChange={handleSortChange}
                currentSortField={sortField}
                currentSortDirection={sortDirection}
              />
            </thead>

            <tbody>
              {sortedMails.map((mail) => (
                <tr
                  key={mail.id}
                  className="size-3.5 text-[#09090B] hover:bg-zinc-50"
                >
                  <td
                    style={{ width: columnWidths[0] }}
                    className="border-b border-r border-zinc-200 px-4 py-4"
                  >
                    {mail.from || "-"}
                  </td>

                  <td
                    style={{ width: columnWidths[1] }}
                    className="border-b border-r border-zinc-200 px-4 py-4"
                  >
                    {mail.subject || "-"}
                  </td>
                  <td
                    style={{ width: columnWidths[2] }}
                    className="border-b border-r border-zinc-200 px-4 py-4"
                  >
                    {mail.sent || "-"}
                  </td>

                  <td
                    style={{ width: columnWidths[3] }}
                    className="border-b border-r border-zinc-200 px-4 py-4 text-center"
                  >
                    <Checkbox checked={mail.attachment} />
                  </td>

                  <td
                    style={{ width: columnWidths[4] }}
                    className="border-b border-zinc-200 px-4 py-4 text-right"
                  >
                    {mail.size || "-"}
                  </td>
                </tr>
              ))}

              <tr>
                <td
                  colSpan={5}
                  className="border-b border-zinc-200 px-5 py-3 text-right text-sm font-medium text-zinc-500"
                >
                  Sum = 42 GB
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Pagination />
      </div>
    </div>
  );
}