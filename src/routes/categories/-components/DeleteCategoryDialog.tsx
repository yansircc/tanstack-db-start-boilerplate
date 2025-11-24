import { ConfirmDialog } from "@/components/shared";
import { categoriesCollection } from "@/db/collections/categories.collection";
import { useErrorHandler } from "@/lib/error-handler";

interface DeleteCategoryDialogProps {
	categoryId: number;
	trigger: React.ReactNode;
}

export function DeleteCategoryDialog({
	categoryId,
	trigger,
}: DeleteCategoryDialogProps) {
	const { handleError } = useErrorHandler();

	const handleDelete = async () => {
		try {
			// Delete with optimistic updates - UI updates immediately!
			const tx = categoriesCollection.delete(categoryId);

			// 等待持久化完成,捕获错误
			await tx.isPersisted.promise;
		} catch (error) {
			// 外键约束错误会被捕获并显示友好消息
			if (error instanceof Error && error.message.includes("FOREIGN KEY")) {
				handleError(
					new Error("该分类下还有文章,请先删除或移动这些文章后再删除分类"),
					"删除分类失败",
				);
			} else {
				handleError(error, "删除分类失败");
			}
		}
	};

	return (
		<ConfirmDialog
			trigger={trigger}
			title="删除分类"
			description="确定要删除这个分类吗？此操作无法撤销。"
			confirmLabel="确认删除"
			cancelLabel="取消"
			variant="destructive"
			onConfirm={handleDelete}
		/>
	);
}
