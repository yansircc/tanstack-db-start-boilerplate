import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { db } from "../index";
import { tags } from "../schema";
import { queryClient } from "./query-client";

export const tagsCollection = createCollection(
	queryCollectionOptions({
		id: "tags",
		queryKey: ["tags"],
		queryClient,
		getKey: (item) => item.id,
		queryFn: async () => {
			const data = await db.select().from(tags);
			return data;
		},
	}),
);
