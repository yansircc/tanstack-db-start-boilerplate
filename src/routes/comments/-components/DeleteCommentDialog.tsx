import { ConfirmDialog } from "@/components/shared";
import { commentsCollection } from "@/db/collections/comments.collection";
import type { SelectComment } from "@/db/schemas-zod";

interface DeleteCommentDialogProps {
	comment: SelectComment;
	trigger: React.ReactNode;
}

export function DeleteCommentDialog({
	comment,
	trigger,
}: DeleteCommentDialogProps) {
	const handleDelete = () => {
		// Delete with optimistic updates - UI updates immediately!
		commentsCollection.delete(comment.id);
		// If mutation fails, TanStack DB will automatically rollback
	};

	return (
		<ConfirmDialog
			trigger={trigger}
			title="删除评论"
			description={
				<>
					确定要删除这条评论吗？此操作无法撤销。
					{comment.content.length > 50 ? (
						<div className="mt-2 text-sm text-muted-foreground">
							"{comment.content.substring(0, 50)}..."
						</div>
					) : (
						<div className="mt-2 text-sm text-muted-foreground">
							"{comment.content}"
						</div>
					)}
				</>
			}
			confirmLabel="确认删除"
			cancelLabel="取消"
			variant="destructive"
			onConfirm={handleDelete}
		/>
	);
}
