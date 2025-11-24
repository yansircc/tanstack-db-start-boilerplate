import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	commentsCollection,
	usersCollection,
} from "../../../db/collections";

export function useArticleCommentsQuery(articleId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ comment: commentsCollection })
				.join(
					{ user: usersCollection },
					({ comment, user }) => eq(comment.authorId, user.id),
					"left",
				)
				.where(({ comment }) => eq(comment.articleId, articleId))
				.orderBy(({ comment }) => comment.createdAt, "asc")
				.select(({ comment, user }) => ({
					id: comment.id,
					content: comment.content,
					createdAt: comment.createdAt,
					parentId: comment.parentId,
					author: user
						? {
								id: user.id,
								displayName: user.displayName,
								avatar: user.avatar,
							}
						: undefined,
				})),
		[articleId],
	);
}
