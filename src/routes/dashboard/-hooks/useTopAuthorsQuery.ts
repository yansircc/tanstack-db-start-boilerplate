import { count, eq, useLiveQuery } from "@tanstack/react-db";
import { articlesCollection, usersCollection } from "../../../db/collections";

export function useTopAuthorsQuery() {
	return useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.innerJoin(
				{ user: usersCollection },
				({ article, user }) => eq(article.authorId, user.id),
			)
			.groupBy(({ user }) => [user.id, user.displayName, user.avatar])
			.select(({ user, article }) => ({
				authorId: user.id,
				authorName: user.displayName,
				avatar: user.avatar,
				articleCount: count(article.id),
			}))
			.orderBy(({ article }) => count(article.id), "desc")
			.limit(5),
	);
}
