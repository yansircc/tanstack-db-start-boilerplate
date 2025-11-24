import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { InsertCategory, SelectCategory } from "@/db/schemas-zod";

interface CategoryFormProps {
	category?: SelectCategory;
	onSubmit: (values: Partial<InsertCategory>) => void;
	onCancel?: () => void;
	submitLabel?: string;
}

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
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
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
						return undefined;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						label="分类名称"
						required
						placeholder="输入分类名称"
						inputType="input"
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
						if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
							return "Slug 只能包含小写字母、数字和连字符";
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						label="Slug"
						required
						placeholder="category-slug"
						inputType="input"
						description="URL 友好的标识符，只能包含小写字母、数字和连字符"
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
						return undefined;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						label="描述"
						placeholder="分类描述（可选）"
						inputType="textarea"
						rows={3}
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
