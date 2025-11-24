import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
	usersCollection,
} from "@/db/collections";

export function useArticleDetailQuery(articleId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ article: articlesCollection })
				.leftJoin({ user: usersCollection }, ({ article, user }) =>
					eq(article.authorId, user.id)
				)
				.leftJoin({ category: categoriesCollection }, ({ article, category }) =>
					eq(article.categoryId, category.id)
				)
				.where(({ article }) => eq(article.id, articleId))
				.select(({ article, user, category }) => ({
					id: article.id,
					title: article.title,
					slug: article.slug,
					content: article.content,
					excerpt: article.excerpt,
					coverImage: article.coverImage,
					viewCount: article.viewCount,
					createdAt: article.createdAt,
					updatedAt: article.updatedAt,
					author: user,
					category,
				}))
				.findOne(),
		[articleId]
	);
}
