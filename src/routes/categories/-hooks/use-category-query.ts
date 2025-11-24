import { eq, useLiveQuery } from "@tanstack/react-db";
import { categoriesCollection } from "@/db/collections";

export function useCategoryQuery(categoryId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ category: categoriesCollection })
				.where(({ category }) => eq(category.id, categoryId))
				.select(({ category }) => ({
					id: category.id,
					name: category.name,
					slug: category.slug,
					description: category.description,
					createdAt: category.createdAt,
				}))
				.findOne(),
		[categoryId]
	);
}
