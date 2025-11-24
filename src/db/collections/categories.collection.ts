import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { db } from "../index";
import { categories } from "../schema";
import { queryClient } from "./query-client";

export const categoriesCollection = createCollection(
	queryCollectionOptions({
		id: "categories",
		queryKey: ["categories"],
		queryClient,
		getKey: (item) => item.id,
		queryFn: async () => {
			const data = await db.select().from(categories);
			return data;
		},
	}),
);
