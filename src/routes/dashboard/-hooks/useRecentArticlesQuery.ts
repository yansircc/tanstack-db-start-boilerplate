import { eq, useLiveQuery } from "@tanstack/react-db";
import { articlesCollection, usersCollection } from "../../../db/collections";

export function useRecentArticlesQuery() {
	return useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.leftJoin({ user: usersCollection }, ({ article, user }) =>
				eq(article.authorId, user.id),
			)
			.orderBy(({ article }) => article.createdAt, "desc")
			.limit(5)
			.select(({ article, user }) => ({
				id: article.id,
				title: article.title,
				createdAt: article.createdAt,
				viewCount: article.viewCount,
				authorName: user?.displayName,
			})),
	);
}
