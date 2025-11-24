import { useLiveQuery, eq } from "@tanstack/react-db";
import { MutationDialog } from "@/components/shared";
import { commentsCollection } from "@/db/collections/comments.collection";
import type { InsertComment } from "@/db/schemas-zod";
import { CommentForm } from "./CommentForm";

interface EditCommentDialogProps {
	commentId: number;
	trigger: React.ReactNode;
}

export function EditCommentDialog({
	commentId,
	trigger,
}: EditCommentDialogProps) {
	// 查询评论数据
	const { data: comments } = useLiveQuery((q) =>
		q
			.from({ comment: commentsCollection })
			.where(({ comment }) => eq(comment.id, commentId))
			.select(({ comment }) => ({
				id: comment.id,
				content: comment.content,
				articleId: comment.articleId,
				authorId: comment.authorId,
				parentId: comment.parentId,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
				deletedAt: comment.deletedAt,
			})),
	);

	const comment = comments?.[0];

	const handleSubmit = (
		values: Partial<InsertComment>,
		onClose: () => void,
	) => {
		// Update with optimistic updates - UI updates immediately!
		// Note: We only allow editing the content, not articleId, authorId, or parentId
		commentsCollection.update(commentId, (draft) => {
			if (values.content) draft.content = values.content;
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
			trigger={trigger}
			title="编辑评论"
			description="修改评论内容。"
		>
			{({ onClose }) => (
				<CommentForm
					comment={comment}
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="保存"
				/>
			)}
		</MutationDialog>
	);
}
