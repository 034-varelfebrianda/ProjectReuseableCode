interface CodePreviewProps {
  title: string;
}

export default function CodePreview({ title }: CodePreviewProps) {
  const codeSnippet = [
    'import ReusableDataTable from "@/features/tables/components/organism/ReusableDataTable";',
    "",
    "<ReusableDataTable",
    `  title="${title}"`,
    '  showGridTopBar={true}   // optional, default: true',
    "  data={rows}",
    "  columns={columns}",
    "  filters={filters}",
    "  onFilterChange={handleFilterChange}",
    "  sortField={sortField}",
    "  sortDirection={sortDirection}",
    "  onSortChange={handleSortChange}",
    "  currentPage={currentPage}",
    "  pageSize={pageSize}",
    "  totalItems={totalItems}",
    "  onPageChange={setCurrentPage}",
    "  onPageSizeChange={(size) => {",
    "    setPageSize(size);",
    "    setCurrentPage(1);",
    "  }}",
    "/>",
  ].join("\n");

  return (
    <div className="overflow-x-auto bg-theme-bg-summary rounded-b-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-theme-border">
        <span className="text-xs text-theme-text-primary font-mono">
          component usage
        </span>
        <span className="text-xs text-theme-text-secondary">TSX</span>
      </div>
      <pre className="px-6 py-5 text-sm font-mono text-theme-text-primary leading-relaxed overflow-x-auto">
        <code>{codeSnippet}</code>
      </pre>
    </div>
  );
}
