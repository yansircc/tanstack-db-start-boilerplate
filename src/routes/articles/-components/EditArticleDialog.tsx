import { eq, useLiveQuery } from "@tanstack/react-db";
import { MutationDialog } from "@/components/shared";
import { articlesCollection } from "@/db/collections/articles.collection";
import type { InsertArticle } from "@/db/schemas-zod";
import { ArticleForm } from "./ArticleForm";

interface EditArticleDialogProps {
	articleId: number;
	trigger: React.ReactNode;
	authorId: number;
	categories: Array<{ id: number; name: string }>;
}

export function EditArticleDialog({
	articleId,
	trigger,
	authorId,
	categories,
}: EditArticleDialogProps) {
	// 从 collection 获取完整的文章数据
	const { data: articles } = useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.where(({ article }) => eq(article.id, articleId))
			.select(({ article }) => article)
	);

	const article = articles?.[0];

	const handleSubmit = (
		values: Partial<InsertArticle>,
		onClose: () => void,
	) => {
		// Update with optimistic updates - UI updates immediately!
		articlesCollection.update(articleId, (draft) => {
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

	// 如果文章还在加载,不显示对话框触发器
	if (!article) {
		return null;
	}

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
