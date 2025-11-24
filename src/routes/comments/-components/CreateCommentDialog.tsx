import { MutationDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { commentsCollection } from "@/db/collections/comments.collection";
import type { InsertComment } from "@/db/schemas-zod";
import { CommentForm } from "./CommentForm";

interface CreateCommentDialogProps {
	trigger?: React.ReactNode;
	articleId: number;
	authorId: number;
	parentId?: number | null;
}

export function CreateCommentDialog({
	trigger,
	articleId,
	authorId,
	parentId,
}: CreateCommentDialogProps) {
	const handleSubmit = (
		values: Partial<InsertComment>,
		onClose: () => void,
	) => {
		// Validation: ensure required fields exist
		if (!values.content || !values.articleId || !values.authorId) {
			return;
		}

		// Use a temporary ID (negative number)
		const tempId = -Math.floor(Math.random() * 1000000);

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
			trigger={trigger || <Button>发表评论</Button>}
			title={parentId ? "回复评论" : "发表评论"}
			description="输入你的评论内容。"
		>
			{({ onClose }) => (
				<CommentForm
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel={parentId ? "回复" : "发表"}
					articleId={articleId}
					authorId={authorId}
					parentId={parentId}
				/>
			)}
		</MutationDialog>
	);
}
