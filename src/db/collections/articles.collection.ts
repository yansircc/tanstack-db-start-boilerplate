import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
	createArticle,
	deleteArticle,
	getArticles,
	updateArticle,
} from "@/api/sync/articles.sync";
import { type SelectArticle, selectArticleSchema } from "@/db/schemas-zod";
import { queryClient } from "@/lib/query-client";

/**
 * Articles Collection
 *
 * Syncs article data from the server via serverFn and validates
 * all client-side mutations (insert/update) against the schema.
 *
 * Schema validation ensures:
 * - Title and content are not empty
 * - Slug follows the correct format
 * - Status is one of: draft, published, archived
 * - All required fields are present
 */
export const articlesCollection = createCollection(
	queryCollectionOptions({
		schema: selectArticleSchema,
		queryKey: ["articles"],
		queryFn: async () => await getArticles(),
		queryClient,
		getKey: (item) => item.id,

		// Mutation handlers
		onInsert: async ({ transaction }) => {
			// Persist all insert mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) =>
					createArticle({ data: mutation.modified })
				)
			);
			// QueryCollection automatically refetches after handler completes
		},

		onUpdate: async ({ transaction }) => {
			// Persist all update mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectArticle;
					return updateArticle({
						data: {
							id: original.id,
							changes: mutation.changes,
						},
					});
				})
			);
			// QueryCollection automatically refetches after handler completes
		},

		onDelete: async ({ transaction }) => {
			// Persist all delete mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectArticle;
					return deleteArticle({ data: { id: original.id } });
				})
			);
			// QueryCollection automatically refetches after handler completes
		},
	})
);
