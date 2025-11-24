import { eq, useLiveQuery } from "@tanstack/react-db";
import { commentsCollection } from "@/db/collections";

export function useUserCommentsCountQuery(userId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ comment: commentsCollection })
				.where(({ comment }) => eq(comment.authorId, userId))
				.select(({ comment }) => ({
					id: comment.id,
				})),
		[userId]
	);
}
