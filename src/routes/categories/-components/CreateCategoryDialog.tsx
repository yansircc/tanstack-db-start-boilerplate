import { MutationDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { categoriesCollection } from "@/db/collections/categories.collection";
import type { InsertCategory } from "@/db/schemas-zod";
import { CategoryForm } from "./CategoryForm";

interface CreateCategoryDialogProps {
	trigger?: React.ReactNode;
}

export function CreateCategoryDialog({ trigger }: CreateCategoryDialogProps) {
	const handleSubmit = (
		values: Partial<InsertCategory>,
		onClose: () => void,
	) => {
		// Validation: ensure required fields exist
		if (!values.name || !values.slug) {
			return;
		}

		// Use a temporary ID (negative number)
		const tempId = -Math.floor(Math.random() * 1000000);

		// Insert with optimistic updates - UI updates immediately!
		categoriesCollection.insert({
			id: tempId,
			name: values.name,
			slug: values.slug,
			description: values.description ?? null,
			createdAt: new Date(),
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	return (
		<MutationDialog
			trigger={trigger || <Button>创建分类</Button>}
			title="创建新分类"
			description="填写下面的表单来创建一个新分类。所有标记 * 的字段都是必填的。"
		>
			{({ onClose }) => (
				<CategoryForm
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="创建"
				/>
			)}
		</MutationDialog>
	);
}
