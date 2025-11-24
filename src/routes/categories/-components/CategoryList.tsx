import { CategoryCard } from "./CategoryCard";
import type { CategoryWithCount } from "./types";

interface CategoryListProps {
	categories: CategoryWithCount[] | undefined;
}

export function CategoryList({ categories }: CategoryListProps) {
	if (!categories || categories.length === 0) {
		return <p className="text-gray-500">暂无分类</p>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{categories.map((category) => (
				<CategoryCard key={category.id} category={category} />
			))}
		</div>
	);
}
