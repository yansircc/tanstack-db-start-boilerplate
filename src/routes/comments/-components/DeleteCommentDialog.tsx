import { useLiveQuery, eq } from "@tanstack/react-db";
import { ConfirmDialog } from "@/components/shared";
import { commentsCollection } from "@/db/collections/comments.collection";
import { useErrorHandler } from "@/lib/error-handler";

interface DeleteCommentDialogProps {
	commentId: number;
	trigger: React.ReactNode;
}

export function DeleteCommentDialog({
	commentId,
	trigger,
}: DeleteCommentDialogProps) {
	const { handleError } = useErrorHandler();

	// 查询评论内容用于显示
	const { data: comments } = useLiveQuery((q) =>
		q
			.from({ comment: commentsCollection })
			.where(({ comment }) => eq(comment.id, commentId))
			.select(({ comment }) => ({
				id: comment.id,
				content: comment.content,
			})),
	);

	const comment = comments?.[0];

	const handleDelete = async () => {
		try {
			const tx = commentsCollection.delete(commentId);
			await tx.isPersisted.promise;
		} catch (error) {
			handleError(error, "删除评论失败");
		}
	};

	return (
		<ConfirmDialog
			trigger={trigger}
			title="删除评论"
			description={
				<>
					确定要删除这条评论吗？此操作无法撤销。
					{comment && (
						<div className="mt-2 text-sm text-muted-foreground">
							"
							{comment.content.length > 50
								? `${comment.content.substring(0, 50)}...`
								: comment.content}
							"
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
