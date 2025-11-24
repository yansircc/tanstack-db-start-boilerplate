import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
	createCategory,
	deleteCategory,
	getCategories,
	updateCategory,
} from "@/api/sync/categories.sync";
import { queryClient } from "@/lib/query-client";
import { type SelectCategory, selectCategorySchema } from "../schemas-zod";

export const categoriesCollection = createCollection(
	queryCollectionOptions({
		schema: selectCategorySchema,
		queryKey: ["categories"],
		queryFn: async () => await getCategories(),
		queryClient,
		getKey: (item) => item.id,

		// Mutation handlers
		onInsert: async ({ transaction }) => {
			// Persist all insert mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) =>
					createCategory({ data: mutation.modified })
				)
			);
			// QueryCollection automatically refetches after handler completes
		},

		onUpdate: async ({ transaction }) => {
			// Persist all update mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectCategory;
					return updateCategory({
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
					const original = mutation.original as SelectCategory;
					return deleteCategory({ data: { id: original.id } });
				})
			);
			// QueryCollection automatically refetches after handler completes
		},
	})
);
