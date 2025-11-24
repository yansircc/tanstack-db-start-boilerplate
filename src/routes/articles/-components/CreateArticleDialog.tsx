import { MutationDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { articlesCollection } from "@/db/collections/articles.collection";
import type { InsertArticle } from "@/db/schemas-zod";
import { useErrorHandler } from "@/lib/error-handler";
import { ArticleForm } from "./ArticleForm";

interface CreateArticleDialogProps {
	trigger?: React.ReactNode;
	authorId: number;
	categories: Array<{ id: number; name: string }>;
}

export function CreateArticleDialog({
	trigger,
	authorId,
	categories,
}: CreateArticleDialogProps) {
	const { handleError } = useErrorHandler();

	const handleSubmit = async (
		values: Partial<InsertArticle>,
		onClose: () => void,
	) => {
		// Validation: ensure required fields exist
		if (
			!values.title ||
			!values.slug ||
			!values.content ||
			!values.categoryId
		) {
			return;
		}

		try {
			// Use a temporary ID (negative number)
			const tempId = -Math.floor(Math.random() * 1000000);

			// Insert with optimistic updates - UI updates immediately!
			const tx = articlesCollection.insert({
				id: tempId,
				title: values.title,
				slug: values.slug,
				content: values.content,
				excerpt: values.excerpt ?? null,
				coverImage: values.coverImage ?? null,
				status: values.status ?? "draft",
				viewCount: 0,
				authorId: authorId,
				categoryId: values.categoryId,
				createdAt: new Date(),
				updatedAt: new Date(),
				publishedAt: values.status === "published" ? new Date() : null,
				deletedAt: null,
			});

			// Close dialog immediately - optimistic update is already shown
			onClose();

			// 等待持久化完成,如果失败会自动回滚
			await tx.isPersisted.promise;
		} catch (error) {
			// 错误会被全局错误处理器捕获并显示
			handleError(error, "创建文章失败");
		}
	};

	return (
		<MutationDialog
			trigger={trigger || <Button>创建文章</Button>}
			title="创建新文章"
			description="填写下面的表单来创建一个新文章。所有标记 * 的字段都是必填的。"
		>
			{({ onClose }) => (
				<ArticleForm
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="创建"
					authorId={authorId}
					categories={categories}
				/>
			)}
		</MutationDialog>
	);
}
