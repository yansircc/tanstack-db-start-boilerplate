import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { InsertComment, SelectComment } from "@/db/schemas-zod";

interface CommentFormProps {
	comment?: SelectComment;
	onSubmit: (values: Partial<InsertComment>) => void;
	onCancel?: () => void;
	submitLabel?: string;
	// 如果是新建评论，需要传入 articleId 和 authorId
	articleId?: number;
	authorId?: number;
	// 如果是回复评论，可以传入 parentId
	parentId?: number | null;
}

export function CommentForm({
	comment,
	onSubmit,
	onCancel,
	submitLabel = "提交",
	articleId,
	authorId,
	parentId,
}: CommentFormProps) {
	const form = useForm({
		defaultValues: {
			content: comment?.content ?? "",
		},
		onSubmit: ({ value }) => {
			onSubmit({
				content: value.content,
				articleId: comment?.articleId ?? articleId,
				authorId: comment?.authorId ?? authorId,
				parentId: comment?.parentId ?? parentId,
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			{/* Content */}
			<form.Field
				name="content"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 1) {
							return "评论内容为必填项";
						}
						if (value.length > 2000) {
							return "评论内容不能超过 2000 个字符";
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						label="评论内容"
						required
						placeholder="输入评论内容..."
						inputType="textarea"
						rows={5}
					/>
				)}
			</form.Field>

			{/* Actions */}
			<div className="flex justify-end gap-2 pt-4">
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel}>
						取消
					</Button>
				)}
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<Button type="submit" disabled={!canSubmit || isSubmitting}>
							{isSubmitting ? "提交中..." : submitLabel}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}
