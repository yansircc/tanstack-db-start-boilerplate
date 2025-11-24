import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { getUsers } from "../../api/sync/users.sync";
import { queryClient } from "../../lib/query-client";
import { selectUserSchema } from "../schemas-zod";

export const usersCollection = createCollection(
	queryCollectionOptions({
		schema: selectUserSchema,
		queryKey: ["users"],
		queryFn: async () => {
			return await getUsers();
		},
		queryClient,
		getKey: (item) => item.id,
	}),
);
