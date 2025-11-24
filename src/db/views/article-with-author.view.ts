import { createLiveQueryCollection, eq } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
	usersCollection,
} from "../collections";

// 文章列表视图：文章 + 作者 + 分类
// UI 订阅这个视图，而不是直接操作 collection
export const articleWithAuthorView = createLiveQueryCollection((q) =>
	q
		.from({ article: articlesCollection })
		.join(
			{ user: usersCollection },
			({ article, user }) => eq(article.authorId, user.id),
			"left",
		)
		.join(
			{ category: categoriesCollection },
			({ article, category }) => eq(article.categoryId, category.id),
			"left",
		)
		.where(({ article }) => eq(article.status, "published"))
		.orderBy(({ article }) => article.createdAt, "desc")
		.select(({ article, user, category }) => {
			const authorData = user
				? {
						id: user.id,
						name: user.displayName,
						avatar: user.avatar,
					}
				: null;

			const categoryData = category
				? {
						id: category.id,
						name: category.name,
						slug: category.slug,
					}
				: null;

			return {
				id: article.id,
				title: article.title,
				slug: article.slug,
				excerpt: article.excerpt,
				coverImage: article.coverImage,
				viewCount: article.viewCount,
				createdAt: article.createdAt,
				author: authorData,
				category: categoryData,
			};
		}),
);
