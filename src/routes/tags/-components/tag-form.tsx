import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { InsertTag, SelectTag } from "@/db/schemas-zod";

// Regex pattern defined at top level for performance
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type TagFormProps = {
	tag?: SelectTag;
	onSubmit: (values: Partial<InsertTag>) => void;
	onCancel?: () => void;
	submitLabel?: string;
};

export function TagForm({
	tag,
	onSubmit,
	onCancel,
	submitLabel = "提交",
}: TagFormProps) {
	const form = useForm({
		defaultValues: {
			name: tag?.name ?? "",
			slug: tag?.slug ?? "",
		},
		onSubmit: ({ value }) => {
			onSubmit({
				name: value.name,
				slug: value.slug,
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
							return "标签名称为必填项";
						}
						if (value.length > 30) {
							return "标签名称不能超过 30 个字符";
						}
						return;
					},
				}}
			>
				{(field) => (
					<FormField
						field={field}
						inputType="input"
						label="标签名称"
						placeholder="输入标签名称"
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
						if (value.length > 30) {
							return "Slug 不能超过 30 个字符";
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
						placeholder="tag-slug"
						required
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
