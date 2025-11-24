import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articleBookmarksCollection,
	articlesCollection,
	categoriesCollection,
	usersCollection,
} from "@/db/collections";

export function useUserBookmarkedArticlesQuery(userId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ bookmark: articleBookmarksCollection })
				.where(({ bookmark }) => eq(bookmark.userId, userId))
				.innerJoin({ article: articlesCollection }, ({ bookmark, article }) =>
					eq(bookmark.articleId, article.id)
				)
				.leftJoin({ author: usersCollection }, ({ article, author }) =>
					eq(article.authorId, author.id)
				)
				.leftJoin({ category: categoriesCollection }, ({ article, category }) =>
					eq(article.categoryId, category.id)
				)
				.orderBy(({ bookmark }) => bookmark.createdAt, "desc")
				.select(({ article, author, category, bookmark }) => ({
					id: article.id,
					title: article.title,
					slug: article.slug,
					excerpt: article.excerpt,
					coverImage: article.coverImage,
					viewCount: article.viewCount,
					createdAt: article.createdAt,
					author,
					category,
					bookmarkedAt: bookmark.createdAt,
				})),
		[userId]
	);
}
