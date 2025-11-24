import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articleLikesCollection,
	articlesCollection,
	categoriesCollection,
	usersCollection,
} from "@/db/collections";

export function useUserLikedArticlesQuery(userId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ like: articleLikesCollection })
				.where(({ like }) => eq(like.userId, userId))
				.innerJoin({ article: articlesCollection }, ({ like, article }) =>
					eq(like.articleId, article.id),
				)
				.leftJoin({ author: usersCollection }, ({ article, author }) =>
					eq(article.authorId, author.id),
				)
				.leftJoin({ category: categoriesCollection }, ({ article, category }) =>
					eq(article.categoryId, category.id),
				)
				.orderBy(({ like }) => like.createdAt, "desc")
				.select(({ article, author, category, like }) => ({
					id: article.id,
					title: article.title,
					slug: article.slug,
					excerpt: article.excerpt,
					coverImage: article.coverImage,
					viewCount: article.viewCount,
					createdAt: article.createdAt,
					author: author,
					category: category,
					likedAt: like.createdAt,
				})),
		[userId],
	);
}
