import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { getArticles } from "@/api/sync/articles.sync";
import { selectArticleSchema } from "@/db/schemas-zod";
import { queryClient } from "@/lib/query-client";

/**
 * Articles Collection
 *
 * Syncs article data from the server via serverFn and validates
 * all client-side mutations (insert/update) against the schema.
 *
 * Schema validation ensures:
 * - Title and content are not empty
 * - Slug follows the correct format
 * - Status is one of: draft, published, archived
 * - All required fields are present
 */
export const articlesCollection = createCollection(
	queryCollectionOptions({
		schema: selectArticleSchema,
		queryKey: ["articles"],
		queryFn: async () => {
			return await getArticles();
		},
		queryClient,
		getKey: (item) => item.id,
	}),
);
