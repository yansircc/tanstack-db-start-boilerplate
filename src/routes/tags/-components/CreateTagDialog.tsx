import { MutationDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { tagsCollection } from "@/db/collections/tags.collection";
import type { InsertTag } from "@/db/schemas-zod";
import { TagForm } from "./TagForm";

interface CreateTagDialogProps {
	trigger?: React.ReactNode;
}

export function CreateTagDialog({ trigger }: CreateTagDialogProps) {
	const handleSubmit = (values: Partial<InsertTag>, onClose: () => void) => {
		// Validation: ensure required fields exist
		if (!values.name || !values.slug) {
			return;
		}

		// Use a temporary ID (negative number)
		const tempId = -Math.floor(Math.random() * 1000000);

		// Insert with optimistic updates - UI updates immediately!
		tagsCollection.insert({
			id: tempId,
			name: values.name,
			slug: values.slug,
			createdAt: new Date(),
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	return (
		<MutationDialog
			trigger={trigger || <Button>创建标签</Button>}
			title="创建新标签"
			description="填写下面的表单来创建一个新标签。所有标记 * 的字段都是必填的。"
		>
			{({ onClose }) => (
				<TagForm
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="创建"
				/>
			)}
		</MutationDialog>
	);
}
