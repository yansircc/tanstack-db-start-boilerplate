import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

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

	// 生成页码数组
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 7; // 最多显示7个页码

		if (totalPages <= maxVisible) {
			// 如果总页数小于等于7，显示所有页码
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// 总是显示第一页
			pages.push(1);

			if (currentPage <= 3) {
				// 当前页在前面
				for (let i = 2; i <= 5; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				// 当前页在后面
				pages.push("...");
				for (let i = totalPages - 4; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// 当前页在中间
				pages.push("...");
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push("...");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	return (
		<div className="flex items-center justify-center gap-2 mt-6">
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={!canGoPrevious}
			>
				<ChevronLeft className="w-4 h-4" />
			</Button>

			{getPageNumbers().map((page, index) =>
				page === "..." ? (
					<span key={`ellipsis-${index}`} className="px-2 text-gray-500">
						...
					</span>
				) : (
					<Button
						key={page}
						variant={currentPage === page ? "default" : "outline"}
						size="sm"
						onClick={() => onPageChange(page as number)}
					>
						{page}
					</Button>
				),
			)}

			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={!canGoNext}
			>
				<ChevronRight className="w-4 h-4" />
			</Button>

			<span className="text-sm text-gray-600 ml-4">
				共 {totalItems} 项，第 {currentPage} / {totalPages} 页
			</span>
		</div>
	);
}
