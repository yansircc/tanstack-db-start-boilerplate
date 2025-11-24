import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { InsertArticle, SelectArticle } from "@/db/schemas-zod";

// Regex patterns defined at top level for performance
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_REGEX = /^https?:\/\/.+/;

type ArticleFormProps = {
	article?: SelectArticle;
	onSubmit: (values: Partial<InsertArticle>) => void;
	onCancel?: () => void;
	submitLabel?: string;
	// 这些值应该从父组件传入
	authorId: number;
	categories: Array<{ id: number; name: string }>;
};

export function ArticleForm({
	article,
	onSubmit,
	onCancel,
	submitLabel = "提交",
	authorId,
	categories,
}: ArticleFormProps) {
	const form = useForm({
		defaultValues: {
			title: article?.title ?? "",
			slug: article?.slug ?? "",
			content: article?.content ?? "",
			excerpt: article?.excerpt ?? "",
			coverImage: article?.coverImage ?? "",
			status: article?.status ?? ("draft" as const),
			categoryId: article?.categoryId ?? categories[0]?.id ?? 1,
		},
		onSubmit: ({ value }) => {
			onSubmit({
				title: value.title,
				slug: value.slug,
				content: value.content,
				excerpt: value.excerpt || null,
				coverImage: value.coverImage || null,
				status: value.status,
				viewCount: article?.viewCount ?? 0,
				authorId,
				categoryId: value.categoryId,
			});
		},
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			{/* Title */}
			<form.Field
				name="title"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 1) {
							return "标题为必填项";
						}
						if (value.length > 200) {
							return "标题不能超过 200 个字符";
						}
						return;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						inputType="input"
						label="标题"
						placeholder="输入文章标题"
						required
					/>
				)}
			</form.Field>

			{/* Slug */}
			<form.Field
				name="slug"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 1) {
							return "Slug 为必填项";
						}
						if (value.length > 200) {
							return "Slug 不能超过 200 个字符";
						}
						if (!SLUG_REGEX.test(value)) {
							return "Slug 只能包含小写字母、数字和连字符";
						}
						return;
					},
				}}
			>
				{(field) => (
					<FormField
						description="URL 友好的标识符"
						field={field}
						inputType="input"
						label="Slug"
						placeholder="article-slug"
						required
					/>
				)}
			</form.Field>

			{/* Content */}
			<form.Field
				name="content"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 1) {
							return "内容为必填项";
						}
						return;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						inputType="textarea"
						label="内容"
						placeholder="输入文章内容..."
						required
						rows={10}
					/>
				)}
			</form.Field>

			{/* Excerpt */}
			<form.Field
				name="excerpt"
				validators={{
					onChange: ({ value }) => {
						if (value && value.length > 500) {
							return "摘要不能超过 500 个字符";
						}
						return;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						inputType="textarea"
						label="摘要"
						placeholder="文章摘要（可选）"
						rows={3}
					/>
				)}
			</form.Field>

			{/* Cover Image */}
			<form.Field
				name="coverImage"
				validators={{
					onChange: ({ value }) => {
						if (value && !URL_REGEX.test(value)) {
							return "请输入有效的 URL";
						}
						return;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						inputType="input"
						label="封面图 URL"
						placeholder="https://example.com/cover.jpg"
						type="url"
					/>
				)}
			</form.Field>

			{/* Category */}
			<form.Field name="categoryId">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={String(field.name)}>
							分类 <span className="text-red-500">*</span>
						</Label>
						<select
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							id={String(field.name)}
							onChange={(e) => field.handleChange(Number(e.target.value))}
							value={field.state.value}
						>
							{categories.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							))}
						</select>
					</div>
				)}
			</form.Field>

			{/* Status */}
			<form.Field name="status">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={String(field.name)}>
							状态 <span className="text-red-500">*</span>
						</Label>
						<select
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							id={String(field.name)}
							onChange={(e) =>
								field.handleChange(
									e.target.value as "draft" | "published" | "archived"
								)
							}
							value={field.state.value}
						>
							<option value="draft">草稿</option>
							<option value="published">已发布</option>
							<option value="archived">已归档</option>
						</select>
					</div>
				)}
			</form.Field>

			{/* Actions */}
			<div className="flex justify-end gap-2 pt-4">
				{onCancel && (
					<Button onClick={onCancel} type="button" variant="outline">
						取消
					</Button>
				)}
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<Button disabled={!canSubmit || isSubmitting} type="submit">
							{isSubmitting ? "提交中..." : submitLabel}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}
