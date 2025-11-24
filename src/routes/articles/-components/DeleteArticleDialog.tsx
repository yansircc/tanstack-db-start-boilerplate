import { ConfirmDialog } from "@/components/shared";
import { articlesCollection } from "@/db/collections/articles.collection";
import { useErrorHandler } from "@/lib/error-handler";

interface DeleteArticleDialogProps {
	articleId: number;
	trigger: React.ReactNode;
}

export function DeleteArticleDialog({
	articleId,
	trigger,
}: DeleteArticleDialogProps) {
	const { handleError } = useErrorHandler();

	const handleDelete = async () => {
		try {
			// Delete with optimistic updates - UI updates immediately!
			const tx = articlesCollection.delete(articleId);

			// 等待持久化完成,捕获错误
			await tx.isPersisted.promise;
		} catch (error) {
			// 捕获错误并显示友好消息
			handleError(error, "删除文章失败");
		}
	};

	return (
		<ConfirmDialog
			trigger={trigger}
			title="删除文章"
			description="确定要删除这篇文章吗？此操作无法撤销。"
			confirmLabel="确认删除"
			cancelLabel="取消"
			variant="destructive"
			onConfirm={handleDelete}
		/>
	);
}
