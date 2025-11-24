import { useCategoriesQuery } from "../-hooks/use-categories-query";
import { CategoryCard } from "./category-card";

export function CategoryList() {
	const { data: categories } = useCategoriesQuery();

	if (!categories || categories.length === 0) {
		return (
			<div className="rounded-sm border-2 border-foreground border-dashed p-12 text-center">
				<p className="font-mono text-lg text-muted-foreground uppercase">
					No categories found.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{categories.map((category) => (
				<CategoryCard category={category} key={category.id} />
			))}
		</div>
	);
}
