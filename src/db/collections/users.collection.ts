import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { db } from "../index";
import { users } from "../schema";
import { queryClient } from "./query-client";

export const usersCollection = createCollection(
	queryCollectionOptions({
		id: "users",
		queryKey: ["users"],
		queryClient,
		getKey: (item) => item.id,
		queryFn: async () => {
			const data = await db.select().from(users);
			return data;
		},
	}),
);
