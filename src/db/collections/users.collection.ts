import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
	createUser,
	deleteUser,
	getUsers,
	updateUser,
} from "@/api/sync/users.sync";
import { queryClient } from "@/lib/query-client";
import { selectUserSchema, type SelectUser } from "../schemas-zod";

export const usersCollection = createCollection(
	queryCollectionOptions({
		schema: selectUserSchema,
		queryKey: ["users"],
		queryFn: async () => {
			return await getUsers();
		},
		queryClient,
		getKey: (item) => item.id,

		// Mutation handlers
		onInsert: async ({ transaction }) => {
			// Persist all insert mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) =>
					createUser({ data: mutation.modified }),
				),
			);
			// QueryCollection automatically refetches after handler completes
		},

		onUpdate: async ({ transaction }) => {
			// Persist all update mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectUser;
					return updateUser({
						data: {
							id: original.id,
							changes: mutation.changes,
						},
					});
				}),
			);
			// QueryCollection automatically refetches after handler completes
		},

		onDelete: async ({ transaction }) => {
			// Persist all delete mutations to the backend
			await Promise.all(
				transaction.mutations.map((mutation) => {
					const original = mutation.original as SelectUser;
					return deleteUser({ data: { id: original.id } });
				}),
			);
			// QueryCollection automatically refetches after handler completes
		},
	}),
);
