import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	commentsCollection,
	usersCollection,
} from "@/db/collections";

type UseCommentsQueryOptions = {
	page?: number;
	limit?: number;
};

export function useCommentsQuery(options: UseCommentsQueryOptions = {}) {
	const { page = 1, limit = 20 } = options;
	const offset = (page - 1) * limit;

	return useLiveQuery(
		(q) =>
			q
				.from({ comment: commentsCollection })
				.leftJoin({ user: usersCollection }, ({ comment, user }) =>
					eq(comment.authorId, user.id)
				)
				.leftJoin({ article: articlesCollection }, ({ comment, article }) =>
					eq(comment.articleId, article.id)
				)
				.orderBy(({ comment }) => comment.createdAt, "desc")
				.limit(limit)
				.offset(offset)
				.select(({ comment, user, article }) => ({
					id: comment.id,
					content: comment.content,
					createdAt: comment.createdAt,
					author: user,
					article,
				})),
		[page, limit]
	);
}

// 获取总评论数的 hook
export function useCommentsTotalQuery() {
	return useLiveQuery((q) =>
		q
			.from({ comment: commentsCollection })
			.select(({ comment }) => ({ id: comment.id }))
	);
}
