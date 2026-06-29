import AttachmentBox from "../atoms/AttachmentBox";
import FilterBox from "../atoms/FIlterBox";

interface GridFilterRowProps {
  search: string;
  onSearchChange: (value: string) => void;
  subjectFilter: string;
  onSubjectChange: (value: string) => void;
  sentFilter: string;
  onSentChange: (value: string) => void;
  attachmentFilter: "all" | "yes" | "no";
  onAttachmentChange: (value: "all" | "yes" | "no") => void;
  onSortChange: (field: "from" | "subject" | "sent", direction: "asc" | "desc") => void;
  currentSortField: "from" | "subject" | "sent" | null;
  currentSortDirection: "asc" | "desc";
}

export default function GridFilterRow({
  search,
  onSearchChange,
  subjectFilter,
  onSubjectChange,
  sentFilter,
  onSentChange,
  attachmentFilter,
  onAttachmentChange,
  onSortChange,
  currentSortField,
  currentSortDirection,
}: GridFilterRowProps) {
  return (
    <tr className="bg-zinc-50/50">
      <td className="border-b border-r border-zinc-200 px-2 py-2">
        <FilterBox
          value={search}
          onChange={onSearchChange}
          placeholder="From..."
          showSort
          activeSort={currentSortField === "from"}
          sortDirection={currentSortDirection}
          onSort={(direction) => onSortChange("from", direction)}
        />
      </td>
      <td className="border-b border-r border-zinc-200 px-2 py-2">
        <FilterBox
          value={subjectFilter}
          onChange={onSubjectChange}
          placeholder="Subject..."
          showSort
          activeSort={currentSortField === "subject"}
          sortDirection={currentSortDirection}
          onSort={(direction) => onSortChange("subject", direction)}
        />
      </td>
      <td className="border-b border-r border-zinc-200 px-2 py-2">
        <FilterBox
          value={sentFilter}
          onChange={onSentChange}
          placeholder="Sent..."
          showSort
          activeSort={currentSortField === "sent"}
          sortDirection={currentSortDirection}
          sortAscLabel="Oldest"
          sortDescLabel="Newest"
          onSort={(direction) => onSortChange("sent", direction)}
        />
      </td>
      <td className="border-b border-r border-zinc-200 px-2 py-2">
        <AttachmentBox
          value={attachmentFilter}
          onChange={onAttachmentChange}
        />
      </td>
      <td className="border-b border-zinc-200 px-2 py-2"></td>
    </tr>
  );
}
