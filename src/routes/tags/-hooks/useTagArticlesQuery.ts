import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	articleTagsCollection,
	categoriesCollection,
	usersCollection,
} from "../../../db/collections";

export function useTagArticlesQuery(tagId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ articleTag: articleTagsCollection })
				.innerJoin({ article: articlesCollection }, ({ articleTag, article }) =>
					eq(articleTag.articleId, article.id),
				)
				.leftJoin({ user: usersCollection }, ({ article, user }) =>
					eq(article.authorId, user.id),
				)
				.leftJoin({ category: categoriesCollection }, ({ article, category }) =>
					eq(article.categoryId, category.id),
				)
				.where(({ articleTag }) => eq(articleTag.tagId, tagId))
				.where(({ article }) => eq(article.status, "published"))
				.orderBy(({ article }) => article.createdAt, "desc")
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
		[tagId],
	);
}
