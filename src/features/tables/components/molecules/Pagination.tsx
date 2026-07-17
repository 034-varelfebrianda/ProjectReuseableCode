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
    <div className="pagination">
      <p className="pagination-info">
        Page {currentPage} of {totalPages} ({totalItems.toLocaleString()} items)
      </p>

      <div className="pagination-pages">
        <IconData
          className={`pagination-icon ${currentPage === 1 ? "disabled" : ""
            }`}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </IconData>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="pagination-ellipsis"
              >
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
              className={`pagination-page ${isActive ? "active" : ""
                }`}
            >
              {pageNum}
            </button>
          );
        })}

        <IconData
          className={`pagination-icon ${currentPage === totalPages ? "disabled" : ""
            }`}
          onClick={() =>
            currentPage < totalPages &&
            onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </IconData>
      </div>

      <div className="pagination-size">
        <span>Page size:</span>

        <button
          type="button"
          onClick={() => setPageSizeOpen((prev) => !prev)}
          className="pagination-size-button"
        >
          <span>{pageSize}</span>
          <ChevronDown
            size={14}
            className="pagination-size-icon"
          />
        </button>

        {pageSizeOpen && (
          <div className="pagination-size-dropdown">
            {pageSizeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onPageSizeChange(option);
                  setPageSizeOpen(false);
                }}
                className={`pagination-size-option ${option === pageSize ? "active" : ""
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