import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
	createComment,
	deleteComment,
	getComments,
	updateComment,
} from "@/api/sync/comments.sync";
import { queryClient } from "@/lib/query-client";
import { type SelectComment, selectCommentSchema } from "../schemas-zod";

export const commentsCollection = createCollection(
	queryCollectionOptions({
		schema: selectCommentSchema,
		queryKey: ["comments"],
		queryFn: async () => await getComments(),
		queryClient,
		getKey: (item) => item.id,

		// Mutation handlers
		onInsert: async ({ transaction }) => {
			// Persist all insert mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) =>
					createComment({ data: mutation.modified })
				)
			);
			// QueryCollection automatically refetches after handler completes
		},

		onUpdate: async ({ transaction }) => {
			// Persist all update mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectComment;
					return updateComment({
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
					const original = mutation.original as SelectComment;
					return deleteComment({ data: { id: original.id } });
				})
			);
			// QueryCollection automatically refetches after handler completes
		},
	})
);
