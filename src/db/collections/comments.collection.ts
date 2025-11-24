import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { getComments } from "@/api/sync/comments.sync";
import { queryClient } from "@/lib/query-client";
import { selectCommentSchema } from "../schemas-zod";

export const commentsCollection = createCollection(
	queryCollectionOptions({
		schema: selectCommentSchema,
		queryKey: ["comments"],
		queryFn: async () => {
			return await getComments();
		},
		queryClient,
		getKey: (item) => item.id,
	}),
);
