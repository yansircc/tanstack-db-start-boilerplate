import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
	createArticleBookmark,
	deleteArticleBookmark,
	getArticleBookmarks,
} from "@/api/sync/article-bookmarks.sync";
import { queryClient } from "@/lib/query-client";
import {
	type SelectArticleBookmark,
	selectArticleBookmarkSchema,
} from "../schemas-zod";

export const articleBookmarksCollection = createCollection(
	queryCollectionOptions({
		schema: selectArticleBookmarkSchema,
		queryKey: ["articleBookmarks"],
		queryFn: async () => await getArticleBookmarks(),
		queryClient,
		getKey: (item) => item.id,

		// Mutation handlers
		onInsert: async ({ transaction }) => {
			// Persist all insert mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) =>
					createArticleBookmark({ data: mutation.modified })
				)
			);
			// QueryCollection automatically refetches after handler completes
		},

		onDelete: async ({ transaction }) => {
			// Persist all delete mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectArticleBookmark;
					return deleteArticleBookmark({
						data: {
							articleId: original.articleId,
							userId: original.userId,
						},
					});
				})
			);
			// QueryCollection automatically refetches after handler completes
		},

		// No onUpdate - bookmarks are create or delete only
		onUpdate: async () => {
			// No-op: bookmarks cannot be updated
		},
	})
);
