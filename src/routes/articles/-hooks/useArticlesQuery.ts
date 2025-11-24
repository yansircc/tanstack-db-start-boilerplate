import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
	usersCollection,
} from "../../../db/collections";

interface UseArticlesQueryOptions {
	page?: number;
	limit?: number;
}

export function useArticlesQuery(options: UseArticlesQueryOptions = {}) {
	const { page = 1, limit = 10 } = options;
	const offset = (page - 1) * limit;

	return useLiveQuery(
		(q) =>
			q
				.from({ article: articlesCollection })
				.leftJoin({ user: usersCollection }, ({ article, user }) =>
					eq(article.authorId, user.id),
				)
				.leftJoin({ category: categoriesCollection }, ({ article, category }) =>
					eq(article.categoryId, category.id),
				)
				.where(({ article }) => eq(article.status, "published"))
				.orderBy(({ article }) => article.createdAt, "desc")
				.limit(limit)
				.offset(offset)
				.select(({ article, user, category }) => ({
					id: article.id,
					title: article.title,
					slug: article.slug,
					excerpt: article.excerpt,
					coverImage: article.coverImage,
					viewCount: article.viewCount,
					createdAt: article.createdAt,
					author: user,
					category: category,
				})),
		[page, limit],
	);
}

// 获取总文章数的 hook
export function useArticlesTotalQuery() {
	return useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.where(({ article }) => eq(article.status, "published"))
			.select(({ article }) => ({ id: article.id })),
	);
}
