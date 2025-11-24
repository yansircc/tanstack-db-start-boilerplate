import { eq, useLiveQuery } from "@tanstack/react-db";
import { commentsCollection, usersCollection } from "@/db/collections";
import type { SelectComment, SelectUser } from "@/db/schemas-zod";

type ArticleCommentRecord = Pick<
	SelectComment,
	"id" | "content" | "createdAt" | "parentId"
> & {
	author?: SelectUser;
};

export function useArticleCommentsQuery(articleId: number) {
	const query = useLiveQuery(
		(q) =>
			q
				.from({ comment: commentsCollection })
				.leftJoin({ user: usersCollection }, ({ comment, user }) =>
					eq(comment.authorId, user.id)
				)
				.where(({ comment }) => eq(comment.articleId, articleId))
				.orderBy(({ comment }) => comment.createdAt, "asc")
				.select(({ comment, user }) => ({
					id: comment.id,
					content: comment.content,
					createdAt: comment.createdAt,
					parentId: comment.parentId,
					author: user,
				})),
		[articleId]
	);

	return {
		...query,
		data: query.data as ArticleCommentRecord[] | undefined,
	};
}
