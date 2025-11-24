import { eq, useLiveQuery } from "@tanstack/react-db";
import { articlesCollection, usersCollection } from "@/db/collections";

export function useCategoryArticlesQuery(categoryId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ article: articlesCollection })
				.leftJoin({ user: usersCollection }, ({ article, user }) =>
					eq(article.authorId, user.id)
				)
				.where(({ article }) => eq(article.categoryId, categoryId))
				.where(({ article }) => eq(article.status, "published"))
				.orderBy(({ article }) => article.createdAt, "desc")
				.select(({ article, user }) => ({
					id: article.id,
					title: article.title,
					slug: article.slug,
					excerpt: article.excerpt,
					coverImage: article.coverImage,
					viewCount: article.viewCount,
					createdAt: article.createdAt,
					author: user,
				})),
		[categoryId]
	);
}
