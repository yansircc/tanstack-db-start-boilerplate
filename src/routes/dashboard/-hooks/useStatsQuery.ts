import { count, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
	commentsCollection,
	tagsCollection,
	usersCollection,
} from "../../../db/collections";

export function useStatsQuery() {
	return useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.select(() => ({
				totalArticles: count(articlesCollection.id),
				totalUsers: count(usersCollection.id),
				totalCategories: count(categoriesCollection.id),
				totalTags: count(tagsCollection.id),
				totalComments: count(commentsCollection.id),
			})),
	);
}
