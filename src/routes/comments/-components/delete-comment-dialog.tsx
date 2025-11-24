import { eq, useLiveQuery } from "@tanstack/react-db";
import { ConfirmDialog } from "@/components/shared";
import { commentsCollection } from "@/db/collections/comments.collection";
import type { SelectComment } from "@/db/schemas-zod";
import { useErrorHandler } from "@/lib/error-handler";

type DeleteCommentDialogProps = {
	commentId: number;
	trigger: React.ReactNode;
};

type CommentPreview = Pick<SelectComment, "id" | "content">;

export function DeleteCommentDialog({
	commentId,
	trigger,
}: DeleteCommentDialogProps) {
	const { handleError } = useErrorHandler();

	// 查询评论内容用于显示
	const { data: comments } = useLiveQuery((q) =>
		q
			.from({ comment: commentsCollection })
			.where(({ comment: c }) => eq(c.id, commentId))
			.select(
				({ comment: c }) =>
					({
						id: c.id,
						content: c.content,
					}) as CommentPreview
			)
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
			cancelLabel="取消"
			confirmLabel="确认删除"
			description={
				<>
					确定要删除这条评论吗？此操作无法撤销。
					{comment && (
						<div className="mt-2 text-muted-foreground text-sm">
							"
							{comment.content.length > 50
								? `${comment.content.substring(0, 50)}...`
								: comment.content}
							"
						</div>
					)}
				</>
			}
			onConfirm={handleDelete}
			title="删除评论"
			trigger={trigger}
			variant="destructive"
		/>
	);
}
