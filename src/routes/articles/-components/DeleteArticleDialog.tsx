import { ConfirmDialog } from "@/components/shared";
import { articlesCollection } from "@/db/collections/articles.collection";
import type { SelectArticle } from "@/db/schemas-zod";

interface DeleteArticleDialogProps {
	article: SelectArticle;
	trigger: React.ReactNode;
}

export function DeleteArticleDialog({
	article,
	trigger,
}: DeleteArticleDialogProps) {
	const handleDelete = () => {
		// Delete with optimistic updates - UI updates immediately!
		articlesCollection.delete(article.id);
		// If mutation fails, TanStack DB will automatically rollback
	};

	return (
		<ConfirmDialog
			trigger={trigger}
			title="删除文章"
			description={
				<>
					确定要删除文章 <strong>《{article.title}》</strong>{" "}
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
