import { Link } from "@tanstack/react-router";
import type { CategoryWithCount } from "./types";

interface CategoryCardProps {
	category: CategoryWithCount;
}

export function CategoryCard({ category }: CategoryCardProps) {
	return (
		<Link
			to="/categories/$categoryId"
			params={{ categoryId: String(category.id) }}
			className="block"
		>
			<div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
				<h3 className="text-lg font-semibold mb-2">{category.name}</h3>
				{category.description && (
					<p className="text-sm text-gray-600 mb-3">{category.description}</p>
				)}
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-500">{category.articleCount} 篇文章</span>
					<span className="text-gray-400">#{category.slug}</span>
				</div>
			</div>
		</Link>
	);
}
