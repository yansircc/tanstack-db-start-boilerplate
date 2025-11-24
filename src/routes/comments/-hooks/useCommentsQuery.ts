import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	commentsCollection,
	usersCollection,
} from "../../../db/collections";

export function useCommentsQuery() {
	return useLiveQuery((q) =>
		q
			.from({ comment: commentsCollection })
			.join(
				{ user: usersCollection },
				({ comment, user }) => eq(comment.authorId, user.id),
				"left",
			)
			.join(
				{ article: articlesCollection },
				({ comment, article }) => eq(comment.articleId, article.id),
				"left",
			)
			.orderBy(({ comment }) => comment.createdAt, "desc")
			.select(({ comment, user, article }) => ({
				id: comment.id,
				content: comment.content,
				createdAt: comment.createdAt,
				author: user,
				article: article,
			})),
	);
}
