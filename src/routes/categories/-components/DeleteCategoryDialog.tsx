import { ConfirmDialog } from "@/components/shared";
import { categoriesCollection } from "@/db/collections/categories.collection";
import type { SelectCategory } from "@/db/schemas-zod";

interface DeleteCategoryDialogProps {
	category: SelectCategory;
	trigger: React.ReactNode;
}

export function DeleteCategoryDialog({
	category,
	trigger,
}: DeleteCategoryDialogProps) {
	const handleDelete = () => {
		// Delete with optimistic updates - UI updates immediately!
		categoriesCollection.delete(category.id);
		// If mutation fails, TanStack DB will automatically rollback
	};

	return (
		<ConfirmDialog
			trigger={trigger}
			title="删除分类"
			description={
				<>
					确定要删除分类 <strong>{category.name}</strong> ({category.slug})
					吗？此操作无法撤销。
				</>
			}
			confirmLabel="确认删除"
			cancelLabel="取消"
			variant="destructive"
			onConfirm={handleDelete}
		/>
	);
}
