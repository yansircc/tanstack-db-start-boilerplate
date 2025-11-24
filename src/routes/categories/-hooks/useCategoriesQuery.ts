import { count, eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
} from "../../../db/collections";

export function useCategoriesQuery() {
	return useLiveQuery((q) =>
		q
			.from({ category: categoriesCollection })
			.leftJoin({ article: articlesCollection }, ({ category, article }) =>
				eq(category.id, article.categoryId),
			)
			.groupBy(({ category }) => [
				category.id,
				category.name,
				category.slug,
				category.description,
			])
			.select(({ category, article }) => ({
				id: category.id,
				name: category.name,
				slug: category.slug,
				description: category.description,
				articleCount: count(article?.id),
			}))
			.orderBy(({ category }) => category.name, "asc"),
	);
}
