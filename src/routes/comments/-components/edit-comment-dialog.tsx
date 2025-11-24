import { eq, useLiveQuery } from "@tanstack/react-db";
import { MutationDialog } from "@/components/shared";
import { commentsCollection } from "@/db/collections/comments.collection";
import type { InsertComment } from "@/db/schemas-zod";
import { CommentForm } from "./comment-form";

type EditCommentDialogProps = {
	commentId: number;
	trigger: React.ReactNode;
};

export function EditCommentDialog({
	commentId,
	trigger,
}: EditCommentDialogProps) {
	// 查询评论数据
	const { data: comments } = useLiveQuery((q) =>
		q
			.from({ comment: commentsCollection })
			.where(({ comment: c }) => eq(c.id, commentId))
			.select(({ comment: c }) => ({
				id: c.id,
				content: c.content,
				articleId: c.articleId,
				authorId: c.authorId,
				parentId: c.parentId,
				createdAt: c.createdAt,
				updatedAt: c.updatedAt,
				deletedAt: c.deletedAt,
			}))
	);

	const comment = comments?.[0];

	const handleSubmit = (
		values: Partial<InsertComment>,
		onClose: () => void
	) => {
		// Update with optimistic updates - UI updates immediately!
		// Note: We only allow editing the content, not articleId, authorId, or parentId
		commentsCollection.update(commentId, (draft) => {
			if (values.content) {
				draft.content = values.content;
			}
			draft.updatedAt = new Date();
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	if (!comment) {
		return null;
	}

	return (
		<MutationDialog
			description="修改评论内容。"
			title="编辑评论"
			trigger={trigger}
		>
			{({ onClose }) => (
				<CommentForm
					comment={comment}
					onCancel={onClose}
					onSubmit={(values) => handleSubmit(values, onClose)}
					submitLabel="保存"
				/>
			)}
		</MutationDialog>
	);
}
