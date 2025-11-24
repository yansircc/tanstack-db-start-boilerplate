import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { getTags } from "@/api/sync/tags.sync";
import { queryClient } from "@/lib/query-client";
import { selectTagSchema } from "../schemas-zod";

export const tagsCollection = createCollection(
	queryCollectionOptions({
		schema: selectTagSchema,
		queryKey: ["tags"],
		queryFn: async () => {
			return await getTags();
		},
		queryClient,
		getKey: (item) => item.id,
	}),
);
