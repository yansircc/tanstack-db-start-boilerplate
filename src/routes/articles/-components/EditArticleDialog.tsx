import { MutationDialog } from "@/components/shared";
import { articlesCollection } from "@/db/collections/articles.collection";
import type { InsertArticle, SelectArticle } from "@/db/schemas-zod";
import { ArticleForm } from "./ArticleForm";

interface EditArticleDialogProps {
	article: SelectArticle;
	trigger: React.ReactNode;
	authorId: number;
	categories: Array<{ id: number; name: string }>;
}

export function EditArticleDialog({
	article,
	trigger,
	authorId,
	categories,
}: EditArticleDialogProps) {
	const handleSubmit = (
		values: Partial<InsertArticle>,
		onClose: () => void,
	) => {
		// Update with optimistic updates - UI updates immediately!
		articlesCollection.update(article.id, (draft) => {
			if (values.title) draft.title = values.title;
			if (values.slug) draft.slug = values.slug;
			if (values.content) draft.content = values.content;
			if (values.excerpt !== undefined) draft.excerpt = values.excerpt;
			if (values.coverImage !== undefined) draft.coverImage = values.coverImage;
			if (values.status) draft.status = values.status;
			if (values.categoryId) draft.categoryId = values.categoryId;
			draft.updatedAt = new Date();
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	return (
		<MutationDialog
			trigger={trigger}
			title="编辑文章"
			description="修改文章信息。"
		>
			{({ onClose }) => (
				<ArticleForm
					article={article}
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="保存"
					authorId={authorId}
					categories={categories}
				/>
			)}
		</MutationDialog>
	);
}
