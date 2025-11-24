import { eq, useLiveQuery } from "@tanstack/react-db";
import { tagsCollection } from "@/db/collections";

export function useTagQuery(tagId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ tag: tagsCollection })
				.where(({ tag }) => eq(tag.id, tagId))
				.select(({ tag }) => ({
					id: tag.id,
					name: tag.name,
					slug: tag.slug,
				}))
				.findOne(),
		[tagId]
	);
}
