import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { getCategories } from "../../api/sync/categories.sync";
import { queryClient } from "../../lib/query-client";
import { selectCategorySchema } from "../schemas-zod";

export const categoriesCollection = createCollection(
	queryCollectionOptions({
		schema: selectCategorySchema,
		queryKey: ["categories"],
		queryFn: async () => {
			return await getCategories();
		},
		queryClient,
		getKey: (item) => item.id,
	}),
);
