import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";
import type { CategoryWithCount } from "./types";

interface CategoryCardProps {
	category: CategoryWithCount;
}

export function CategoryCard({ category }: CategoryCardProps) {
	return (
		<div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
			<div className="flex items-start justify-between gap-4 mb-2">
				<Link
					to="/categories/$categoryId"
					params={{ categoryId: String(category.id) }}
					className="flex-1"
				>
					<h3 className="text-lg font-semibold hover:text-blue-600">
						{category.name}
					</h3>
				</Link>

				<div className="flex gap-2 flex-shrink-0">
					<EditCategoryDialog
						categoryId={category.id}
						trigger={
							<Button size="sm" variant="outline">
								编辑
							</Button>
						}
					/>
					<DeleteCategoryDialog
						categoryId={category.id}
						trigger={
							<Button size="sm" variant="destructive">
								删除
							</Button>
						}
					/>
				</div>
			</div>

			{category.description && (
				<p className="text-sm text-gray-600 mb-3">{category.description}</p>
			)}

			<div className="flex items-center justify-between text-sm">
				<span className="text-gray-500">{category.articleCount} 篇文章</span>
				<span className="text-gray-400">#{category.slug}</span>
			</div>
		</div>
	);
}
