import { ConfirmDialog } from "@/components/shared";
import { tagsCollection } from "@/db/collections/tags.collection";
import { useErrorHandler } from "@/lib/error-handler";
import type { SelectTag } from "@/db/schemas-zod";

interface DeleteTagDialogProps {
	tag: SelectTag;
	trigger: React.ReactNode;
}

export function DeleteTagDialog({ tag, trigger }: DeleteTagDialogProps) {
	const { handleError } = useErrorHandler();

	const handleDelete = async () => {
		try {
			const tx = tagsCollection.delete(tag.id);
			await tx.isPersisted.promise;
		} catch (error) {
			if (error instanceof Error && error.message.includes("FOREIGN KEY")) {
				handleError(
					new Error("该标签被文章使用中,请先移除文章的标签关联后再删除"),
					"删除标签失败",
				);
			} else {
				handleError(error, "删除标签失败");
			}
		}
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
