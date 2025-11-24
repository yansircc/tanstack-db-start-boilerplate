import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { InsertCategory, SelectCategory } from "@/db/schemas-zod";

// Regex pattern defined at top level for performance
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type CategoryFormProps = {
	category?: SelectCategory;
	onSubmit: (values: Partial<InsertCategory>) => void;
	onCancel?: () => void;
	submitLabel?: string;
};

export function CategoryForm({
	category,
	onSubmit,
	onCancel,
	submitLabel = "提交",
}: CategoryFormProps) {
	const form = useForm({
		defaultValues: {
			name: category?.name ?? "",
			slug: category?.slug ?? "",
			description: category?.description ?? "",
		},
		onSubmit: ({ value }) => {
			onSubmit({
				name: value.name,
				slug: value.slug,
				description: value.description || null,
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
			{/* Name */}
			<form.Field
				name="name"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 1) {
							return "分类名称为必填项";
						}
						if (value.length > 50) {
							return "分类名称不能超过 50 个字符";
						}
						return;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						inputType="input"
						label="分类名称"
						placeholder="输入分类名称"
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
						if (value.length > 50) {
							return "Slug 不能超过 50 个字符";
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
						description="URL 友好的标识符，只能包含小写字母、数字和连字符"
						field={field}
						inputType="input"
						label="Slug"
						placeholder="category-slug"
						required
					/>
				)}
			</form.Field>

			{/* Description */}
			<form.Field
				name="description"
				validators={{
					onChange: ({ value }) => {
						if (value && value.length > 200) {
							return "描述不能超过 200 个字符";
						}
						return;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						inputType="textarea"
						label="描述"
						placeholder="分类描述（可选）"
						rows={3}
					/>
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
