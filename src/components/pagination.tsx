import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
	currentPage: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
};

export function Pagination({
	currentPage,
	totalItems,
	itemsPerPage,
	onPageChange,
}: PaginationProps) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) {
		return null;
	}

	const canGoPrevious = currentPage > 1;
	const canGoNext = currentPage < totalPages;

	const maxVisible = 7;

	// Helper function to generate all pages
	const getAllPages = () => {
		const pages: (number | string)[] = [];
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i);
		}
		return pages;
	};

	// Helper function to generate start pages
	const getStartPages = () => {
		const pages: (number | string)[] = [1];
		for (let i = 2; i <= 5; i++) {
			pages.push(i);
		}
		pages.push("...", totalPages);
		return pages;
	};

	// Helper function to generate end pages
	const getEndPages = () => {
		const pages: (number | string)[] = [1, "..."];
		for (let i = totalPages - 4; i <= totalPages; i++) {
			pages.push(i);
		}
		return pages;
	};

	// Helper function to generate middle pages
	const getMiddlePages = () => {
		const pages: (number | string)[] = [1, "..."];
		for (let i = currentPage - 1; i <= currentPage + 1; i++) {
			pages.push(i);
		}
		pages.push("...", totalPages);
		return pages;
	};

	// Generate page numbers array
	const getPageNumbers = () => {
		if (totalPages <= maxVisible) {
			return getAllPages();
		}

		if (currentPage <= 3) {
			return getStartPages();
		}

		if (currentPage >= totalPages - 2) {
			return getEndPages();
		}

		return getMiddlePages();
	};

	return (
		<div className="mt-6 flex items-center justify-center gap-2">
			<Button
				disabled={!canGoPrevious}
				onClick={() => onPageChange(currentPage - 1)}
				size="sm"
				variant="outline"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			{getPageNumbers().map((page) =>
				page === "..." ? (
					<span
						className="px-2 text-gray-500"
						key={`ellipsis-${Math.random()}`}
					>
						...
					</span>
				) : (
					<Button
						key={page}
						onClick={() => onPageChange(page as number)}
						size="sm"
						variant={currentPage === page ? "default" : "outline"}
					>
						{page}
					</Button>
				)
			)}

			<Button
				disabled={!canGoNext}
				onClick={() => onPageChange(currentPage + 1)}
				size="sm"
				variant="outline"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>

			<span className="ml-4 text-gray-600 text-sm">
				共 {totalItems} 项，第 {currentPage} / {totalPages} 页
			</span>
		</div>
	);
}
