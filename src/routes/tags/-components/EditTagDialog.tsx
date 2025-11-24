import { MutationDialog } from "@/components/shared";
import { tagsCollection } from "@/db/collections/tags.collection";
import type { InsertTag, SelectTag } from "@/db/schemas-zod";
import { TagForm } from "./TagForm";

interface EditTagDialogProps {
	tag: SelectTag;
	trigger: React.ReactNode;
}

export function EditTagDialog({ tag, trigger }: EditTagDialogProps) {
	const handleSubmit = (values: Partial<InsertTag>, onClose: () => void) => {
		// Update with optimistic updates - UI updates immediately!
		tagsCollection.update(tag.id, (draft) => {
			if (values.name) draft.name = values.name;
			if (values.slug) draft.slug = values.slug;
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	return (
		<MutationDialog
			trigger={trigger}
			title="编辑标签"
			description="修改标签信息。"
		>
			{({ onClose }) => (
				<TagForm
					tag={tag}
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="保存"
				/>
			)}
		</MutationDialog>
	);
}
