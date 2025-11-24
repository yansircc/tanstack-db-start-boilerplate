import { MutationDialog } from "@/components/shared";
import { categoriesCollection } from "@/db/collections/categories.collection";
import type { InsertCategory, SelectCategory } from "@/db/schemas-zod";
import { CategoryForm } from "./CategoryForm";

interface EditCategoryDialogProps {
	category: SelectCategory;
	trigger: React.ReactNode;
}

export function EditCategoryDialog({
	category,
	trigger,
}: EditCategoryDialogProps) {
	const handleSubmit = (
		values: Partial<InsertCategory>,
		onClose: () => void,
	) => {
		// Update with optimistic updates - UI updates immediately!
		categoriesCollection.update(category.id, (draft) => {
			if (values.name) draft.name = values.name;
			if (values.slug) draft.slug = values.slug;
			if (values.description !== undefined)
				draft.description = values.description;
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

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
