interface CodePreviewProps {
  title: string;
}

export default function CodePreview({ title }: CodePreviewProps) {
  const codeSnippet = [
    'import ReusableDataTable from "@/features/tables/components/organism/ReusableDataTable";',
    "",
    "<ReusableDataTable",
    `  title="${title}"`,
    '  mode="server"',
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
    <div className="overflow-x-auto bg-[#F4F4F580] dark:bg-zinc-900/50 rounded-b-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 dark:border-zinc-600">
        <span className="text-xs text-zinc-900 dark:text-zinc-200 font-mono">
          component usage
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">TSX</span>
      </div>
      <pre className="px-6 py-5 text-sm font-mono text-zinc-900 dark:text-zinc-200 leading-relaxed overflow-x-auto">
        <code>{codeSnippet}</code>
      </pre>
    </div>
  );
}
