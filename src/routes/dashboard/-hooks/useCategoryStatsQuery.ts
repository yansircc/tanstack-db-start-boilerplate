import { count, eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
} from "../../../db/collections";

export function useCategoryStatsQuery() {
	return useLiveQuery((q) =>
		q
			.from({ category: categoriesCollection })
			.leftJoin({ article: articlesCollection }, ({ category, article }) =>
				eq(category.id, article.categoryId),
			)
			.groupBy(({ category }) => [category.id, category.name])
			.select(({ category, article }) => ({
				categoryId: category.id,
				categoryName: category.name,
				articleCount: count(article?.id),
			}))
			.orderBy(({ article }) => count(article?.id), "desc"),
	);
}
