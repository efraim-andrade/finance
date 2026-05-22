import { ChevronLeft, ChevronRight } from "lucide-react";

import { IconButton } from "~/components/ui/icon-button";
import { PaginationButton } from "~/components/ui/pagination-button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
};

function getWindowedPages(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages === 0) {
    return (
      <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <span className="text-center text-sm text-muted-foreground sm:text-left">
          0 resultados
        </span>
      </div>
    );
  }

  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  const pages = getWindowedPages(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
      <span className="text-center text-sm text-muted-foreground sm:text-left">
        {`${startResult} a ${endResult} | ${totalResults} resultados`}
      </span>

      <div className="flex items-center justify-center gap-2">
        <IconButton
          variant="outline"
          aria-label="Página anterior"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" />
        </IconButton>

        {pages.map((page) =>
          page === "ellipsis" ? (
            <span key="ellipsis" className="px-1 text-sm text-muted-foreground">
              ...
            </span>
          ) : (
            <PaginationButton
              key={page}
              variant={page === currentPage ? "active" : "default"}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationButton>
          ),
        )}

        <IconButton
          variant="outline"
          aria-label="Próxima página"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}
