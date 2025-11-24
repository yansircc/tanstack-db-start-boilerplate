import { MutationDialog } from "@/components/shared";
import { commentsCollection } from "@/db/collections/comments.collection";
import type { InsertComment, SelectComment } from "@/db/schemas-zod";
import { CommentForm } from "./CommentForm";

interface EditCommentDialogProps {
	comment: SelectComment;
	trigger: React.ReactNode;
}

export function EditCommentDialog({
	comment,
	trigger,
}: EditCommentDialogProps) {
	const handleSubmit = (
		values: Partial<InsertComment>,
		onClose: () => void,
	) => {
		// Update with optimistic updates - UI updates immediately!
		// Note: We only allow editing the content, not articleId, authorId, or parentId
		commentsCollection.update(comment.id, (draft) => {
			if (values.content) draft.content = values.content;
			draft.updatedAt = new Date();
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

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
