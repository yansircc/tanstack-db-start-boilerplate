import { MutationDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { commentsCollection } from "@/db/collections/comments.collection";
import type { InsertComment } from "@/db/schemas-zod";
import { CommentForm } from "./comment-form";

type CreateCommentDialogProps = {
	trigger?: React.ReactNode;
	articleId: number;
	authorId: number;
	parentId?: number | null;
};

export function CreateCommentDialog({
	trigger,
	articleId,
	authorId,
	parentId,
}: CreateCommentDialogProps) {
	const handleSubmit = (
		values: Partial<InsertComment>,
		onClose: () => void
	) => {
		// Validation: ensure required fields exist
		if (!(values.content && values.articleId && values.authorId)) {
			return;
		}

		// Use a temporary ID (negative number)
		const tempId = -Math.floor(Math.random() * 1_000_000);

		// Insert with optimistic updates - UI updates immediately!
		commentsCollection.insert({
			id: tempId,
			content: values.content,
			articleId: values.articleId,
			authorId: values.authorId,
			parentId: values.parentId ?? null,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	return (
		<MutationDialog
			description="输入你的评论内容。"
			title={parentId ? "回复评论" : "发表评论"}
			trigger={trigger || <Button>发表评论</Button>}
		>
			{({ onClose }) => (
				<CommentForm
					articleId={articleId}
					authorId={authorId}
					onCancel={onClose}
					onSubmit={(values) => handleSubmit(values, onClose)}
					parentId={parentId}
					submitLabel={parentId ? "回复" : "发表"}
				/>
			)}
		</MutationDialog>
	);
}
