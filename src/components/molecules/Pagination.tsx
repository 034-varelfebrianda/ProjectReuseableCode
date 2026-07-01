import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import IconData from "../atoms/IconData";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: Array<number | string> = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-4 text-sm text-zinc-500">
      <p>
        Page {currentPage} of {totalPages} ({totalItems.toLocaleString()} items)
      </p>

      <div className="flex items-center gap-2">
        <IconData
          className={`cursor-pointer hover:text-[#09090B] ${
            currentPage === 1 ? "pointer-events-none opacity-40" : ""
          }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </IconData>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-1 text-zinc-400">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition ${
                isActive
                  ? "bg-sky-500 text-white font-medium"
                  : "text-zinc-500 cursor-pointer hover:bg-zinc-100 hover:text-[#09090B]"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <IconData
          className={`cursor-pointer hover:text-[#09090B] ${
            currentPage === totalPages ? "pointer-events-none opacity-40" : ""
          }`}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </IconData>
      </div>

      <div className="flex items-center gap-2 relative">
        <span>Page size:</span>
        <button
          type="button"
          onClick={() => setPageSizeOpen((prev) => !prev)}
          className="flex h-9 min-w-16 items-center justify-between gap-1 rounded-md border px-2.5 border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 transition cursor-pointer"
        >
          <span className="text-sm">{pageSize}</span>
          <ChevronDown size={14} className="text-zinc-400" />
        </button>

        {pageSizeOpen && (
          <div className="absolute bottom-full right-0 z-15 mb-1 w-20 rounded-md border border-zinc-200 bg-white shadow-lg py-1">
            {pageSizeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onPageSizeChange(option);
                  setPageSizeOpen(false);
                }}
                className={`flex w-full justify-center py-1.5 text-sm hover:bg-zinc-100 transition ${
                  option === pageSize ? "text-sky-500 font-medium" : "text-zinc-500"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}