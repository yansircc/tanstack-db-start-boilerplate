import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
	usersCollection,
} from "../../../db/collections";

export function useArticlesQuery() {
	return useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.leftJoin(
				{ user: usersCollection },
				({ article, user }) => eq(article.authorId, user.id),
			)
			.leftJoin(
				{ category: categoriesCollection },
				({ article, category }) => eq(article.categoryId, category.id),
			)
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
	);
}
