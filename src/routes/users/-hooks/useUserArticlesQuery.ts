import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
} from "../../../db/collections";

export function useUserArticlesQuery(userId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ article: articlesCollection })
				.innerJoin({ category: categoriesCollection }, ({ article, category }) =>
					eq(article.categoryId, category.id),
				)
				.where(({ article }) => eq(article.authorId, userId))
				.orderBy(({ article }) => article.createdAt, "desc")
				.select(({ article, category }) => ({
					id: article.id,
					title: article.title,
					slug: article.slug,
					excerpt: article.excerpt,
					coverImage: article.coverImage,
					status: article.status,
					viewCount: article.viewCount,
					createdAt: article.createdAt,
					category: category,
				})),
		[userId],
	);
}
