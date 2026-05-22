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

	if (currentPage < totalPages - 2) {
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
	const startResult = (currentPage - 1) * resultsPerPage + 1;
	const endResult = Math.min(currentPage * resultsPerPage, totalResults);

	const pages = getWindowedPages(currentPage, totalPages);

	return (
		<div className="flex items-center justify-between border-t border-gray-200 px-6 py-5">
			<span className="text-sm text-gray-700">
				{totalResults === 0
					? "0 resultados"
					: `${startResult} a ${endResult} | ${totalResults} resultados`}
			</span>

			<div className="flex items-center gap-2">
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
						<span key="ellipsis" className="px-1 text-sm text-gray-400">
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
