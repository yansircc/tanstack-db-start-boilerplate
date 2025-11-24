import { useCategoriesQuery } from "../-hooks/useCategoriesQuery";
import { CategoryCard } from "./CategoryCard";

export function CategoryList() {
	const { data: categories } = useCategoriesQuery();

	if (!categories || categories.length === 0) {
		return (
			<div className="border-2 border-foreground border-dashed rounded-sm p-12 text-center">
				<p className="text-muted-foreground font-mono text-lg uppercase">No categories found.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{categories.map((category) => (
				<CategoryCard key={category.id} category={category} />
			))}
		</div>
	);
}
