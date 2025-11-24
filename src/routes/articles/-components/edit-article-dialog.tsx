import { eq, useLiveQuery } from "@tanstack/react-db";
import { MutationDialog } from "@/components/shared";
import { articlesCollection } from "@/db/collections/articles.collection";
import type { InsertArticle } from "@/db/schemas-zod";
import { ArticleForm } from "./article-form";

type EditArticleDialogProps = {
	articleId: number;
	trigger: React.ReactNode;
	authorId: number;
	categories: Array<{ id: number; name: string }>;
};

function applyArticleUpdates(
	draft: InsertArticle,
	values: Partial<InsertArticle>
) {
	if (values.title) {
		draft.title = values.title;
	}
	if (values.slug) {
		draft.slug = values.slug;
	}
	if (values.content) {
		draft.content = values.content;
	}
	if (values.excerpt !== undefined) {
		draft.excerpt = values.excerpt;
	}
	if (values.coverImage !== undefined) {
		draft.coverImage = values.coverImage;
	}
	if (values.status) {
		draft.status = values.status;
	}
	if (values.categoryId) {
		draft.categoryId = values.categoryId;
	}
	draft.updatedAt = new Date();
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
			.where(({ article: a }) => eq(a.id, articleId))
			.select(({ article: a }) => a)
	);

	const article = articles?.[0];

	const handleSubmit = (
		values: Partial<InsertArticle>,
		onClose: () => void
	) => {
		// Update with optimistic updates - UI updates immediately!
		articlesCollection.update(articleId, (draft) => {
			applyArticleUpdates(draft, values);
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
			description="修改文章信息。"
			title="编辑文章"
			trigger={trigger}
		>
			{({ onClose }) => (
				<ArticleForm
					article={article}
					authorId={authorId}
					categories={categories}
					onCancel={onClose}
					onSubmit={(values) => handleSubmit(values, onClose)}
					submitLabel="保存"
				/>
			)}
		</MutationDialog>
	);
}
