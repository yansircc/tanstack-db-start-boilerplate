import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Regex patterns defined at top level for performance
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Common form field validation functions
 * Compatible with @tanstack/react-form validators
 */
export const validators = {
	required: (message = "此字段为必填项") => ({
		onChange: ({ value }: { value: unknown }) => {
			if (!value || (typeof value === "string" && value.trim() === "")) {
				return message;
			}
			return;
		},
	}),

	minLength: (min: number, message?: string) => ({
		onChange: ({ value }: { value: unknown }) => {
			if (typeof value === "string" && value.length < min) {
				return message || `至少需要 ${min} 个字符`;
			}
			return;
		},
	}),

	maxLength: (max: number, message?: string) => ({
		onChange: ({ value }: { value: unknown }) => {
			if (typeof value === "string" && value.length > max) {
				return message || `不能超过 ${max} 个字符`;
			}
			return;
		},
	}),

	email: (message = "请输入有效的邮箱地址") => ({
		onChange: ({ value }: { value: unknown }) => {
			if (typeof value === "string" && !EMAIL_REGEX.test(value)) {
				return message;
			}
			return;
		},
	}),

	url: (message = "请输入有效的 URL") => ({
		onChange: ({ value }: { value: unknown }) => {
			if (typeof value === "string" && !URL_REGEX.test(value)) {
				return message;
			}
			return;
		},
	}),

	slug: (message = "只能包含小写字母、数字和连字符") => ({
		onChange: ({ value }: { value: unknown }) => {
			if (typeof value === "string" && !SLUG_REGEX.test(value)) {
				return message;
			}
			return;
		},
	}),
};

type BaseFormFieldProps = {
	// biome-ignore lint: generic field api type
	field: any;
	label: string;
	required?: boolean;
	placeholder?: string;
	disabled?: boolean;
	description?: string;
};

interface InputFormFieldProps extends BaseFormFieldProps {
	type?: "text" | "email" | "url" | "number" | "password";
	inputType: "input";
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
	rows?: number;
	inputType: "textarea";
}

type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps;

/**
 * 通用表单字段组件
 * 封装 Label + Input/Textarea + Error 的重复结构
 *
 * @example
 * ```tsx
 * <form.Field name="email" validators={{ onChange: emailValidator }}>
 *   {(field) => (
 *     <FormField
 *       field={field}
 *       label="邮箱"
 *       required
 *       type="email"
 *       placeholder="输入邮箱"
 *       inputType="input"
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export function FormField(props: FormFieldProps) {
	const {
		field,
		label,
		required = false,
		placeholder,
		disabled = false,
		description,
	} = props;

	const fieldName = String(field.name);
	const value = field.state.value as string;
	const errors = field.state.meta.errors;

	return (
		<div className="space-y-2">
			<Label htmlFor={fieldName}>
				{label}
				{required && <span className="text-red-500"> *</span>}
			</Label>

			{props.inputType === "textarea" ? (
				<Textarea
					disabled={disabled}
					id={fieldName}
					name={fieldName}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					placeholder={placeholder}
					rows={props.rows}
					value={value}
				/>
			) : (
				<Input
					disabled={disabled}
					id={fieldName}
					name={fieldName}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					placeholder={placeholder}
					type={props.type || "text"}
					value={value}
				/>
			)}

			{description && (
				<p className="text-muted-foreground text-sm">{description}</p>
			)}

			{errors.length > 0 && <p className="text-red-500 text-sm">{errors[0]}</p>}
		</div>
	);
}
