import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { createTag, deleteTag, getTags, updateTag } from "@/api/sync/tags.sync";
import { queryClient } from "@/lib/query-client";
import { type SelectTag, selectTagSchema } from "../schemas-zod";

export const tagsCollection = createCollection(
	queryCollectionOptions({
		schema: selectTagSchema,
		queryKey: ["tags"],
		queryFn: async () => await getTags(),
		queryClient,
		getKey: (item) => item.id,

		// Mutation handlers
		onInsert: async ({ transaction }) => {
			// Persist all insert mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) =>
					createTag({ data: mutation.modified })
				)
			);
			// QueryCollection automatically refetches after handler completes
		},

		onUpdate: async ({ transaction }) => {
			// Persist all update mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectTag;
					return updateTag({
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
					const original = mutation.original as SelectTag;
					return deleteTag({ data: { id: original.id } });
				})
			);
			// QueryCollection automatically refetches after handler completes
		},
	})
);
