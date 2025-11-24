import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { db } from "../index";
import { comments } from "../schema";
import { queryClient } from "./query-client";

export const commentsCollection = createCollection(
	queryCollectionOptions({
		id: "comments",
		queryKey: ["comments"],
		queryClient,
		getKey: (item) => item.id,
		queryFn: async () => {
			const data = await db.select().from(comments);
			return data;
		},
	}),
);
