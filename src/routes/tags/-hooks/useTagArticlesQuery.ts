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
				.join(
					{ article: articlesCollection },
					({ articleTag, article }) => eq(articleTag.articleId, article.id),
					// Inner join - article 保证存在,但 TanStack DB 类型系统无法推断
				)
				.join(
					{ user: usersCollection },
					({ article, user }) => eq(article?.authorId, user.id),
					"left",
				)
				.join(
					{ category: categoriesCollection },
					({ article, category }) => eq(article?.categoryId, category.id),
					"left",
				)
				.where(({ articleTag }) => eq(articleTag.tagId, tagId))
				.where(({ article }) => eq(article?.status, "published"))
				.orderBy(({ article }) => article?.createdAt, "desc")
				.select(({ article, user, category }) => {
					const a = article;
					return {
						id: a?.id,
						title: a?.title,
						slug: a?.slug,
						excerpt: a?.excerpt,
						coverImage: a?.coverImage,
						viewCount: a?.viewCount,
						createdAt: a?.createdAt,
						author: user,
						category: category,
					};
				}),
		[tagId],
	);
}
