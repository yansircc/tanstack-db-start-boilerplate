import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { getArticleTags } from "@/api/sync/article-tags.sync";
import { queryClient } from "@/lib/query-client";
import { selectArticleTagSchema } from "../schemas-zod";

export const articleTagsCollection = createCollection(
	queryCollectionOptions({
		schema: selectArticleTagSchema,
		queryKey: ["articleTags"],
		queryFn: async () => await getArticleTags(),
		queryClient,
		getKey: (item) => item.id,
	})
);
