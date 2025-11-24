import { ConfirmDialog } from "@/components/shared";
import { tagsCollection } from "@/db/collections/tags.collection";
import type { SelectTag } from "@/db/schemas-zod";

interface DeleteTagDialogProps {
	tag: SelectTag;
	trigger: React.ReactNode;
}

export function DeleteTagDialog({ tag, trigger }: DeleteTagDialogProps) {
	const handleDelete = () => {
		// Delete with optimistic updates - UI updates immediately!
		tagsCollection.delete(tag.id);
		// If mutation fails, TanStack DB will automatically rollback
	};

	return (
		<ConfirmDialog
			trigger={trigger}
			title="删除标签"
			description={
				<>
					确定要删除标签 <strong>{tag.name}</strong> ({tag.slug})
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
