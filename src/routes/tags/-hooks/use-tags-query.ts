import { useLiveQuery } from "@tanstack/react-db";
import { tagsCollection } from "@/db/collections";

export function useTagsQuery() {
	return useLiveQuery((q) =>
		q
			.from({ tag: tagsCollection })
			.orderBy(({ tag }) => tag.name, "asc")
			.select(({ tag }) => ({
				id: tag.id,
				name: tag.name,
				slug: tag.slug,
			}))
	);
}
