import { eq, useLiveQuery } from "@tanstack/react-db";
import { MutationDialog } from "@/components/shared";
import { categoriesCollection } from "@/db/collections/categories.collection";
import type { InsertCategory } from "@/db/schemas-zod";
import { CategoryForm } from "./CategoryForm";

interface EditCategoryDialogProps {
	categoryId: number;
	trigger: React.ReactNode;
}

export function EditCategoryDialog({
	categoryId,
	trigger,
}: EditCategoryDialogProps) {
	// 从 collection 获取完整的分类数据
	const { data: categories } = useLiveQuery((q) =>
		q
			.from({ category: categoriesCollection })
			.where(({ category }) => eq(category.id, categoryId))
			.select(({ category }) => category),
	);

	const category = categories?.[0];

	const handleSubmit = (
		values: Partial<InsertCategory>,
		onClose: () => void,
	) => {
		// Update with optimistic updates - UI updates immediately!
		categoriesCollection.update(categoryId, (draft) => {
			if (values.name) draft.name = values.name;
			if (values.slug) draft.slug = values.slug;
			if (values.description !== undefined)
				draft.description = values.description;
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	// 如果分类还在加载,不显示对话框触发器
	if (!category) {
		return null;
	}

	return (
		<MutationDialog
			trigger={trigger}
			title="编辑分类"
			description="修改分类信息。"
		>
			{({ onClose }) => (
				<CategoryForm
					category={category}
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="保存"
				/>
			)}
		</MutationDialog>
	);
}
