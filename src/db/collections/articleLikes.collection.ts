import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
	createArticleLike,
	deleteArticleLike,
	getArticleLikes,
} from "@/api/sync/articleLikes.sync";
import { queryClient } from "@/lib/query-client";
import {
	type SelectArticleLike,
	selectArticleLikeSchema,
} from "../schemas-zod";

export const articleLikesCollection = createCollection(
	queryCollectionOptions({
		schema: selectArticleLikeSchema,
		queryKey: ["articleLikes"],
		queryFn: async () => {
			return await getArticleLikes();
		},
		queryClient,
		getKey: (item) => item.id,

		// Mutation handlers
		onInsert: async ({ transaction }) => {
			// Persist all insert mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) =>
					createArticleLike({ data: mutation.modified }),
				),
			);
			// QueryCollection automatically refetches after handler completes
		},

		onDelete: async ({ transaction }) => {
			// Persist all delete mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectArticleLike;
					return deleteArticleLike({
						data: {
							articleId: original.articleId,
							userId: original.userId,
						},
					});
				}),
			);
			// QueryCollection automatically refetches after handler completes
		},

		// No onUpdate - likes are create or delete only
		onUpdate: async () => {
			// No-op: likes cannot be updated
		},
	}),
);
