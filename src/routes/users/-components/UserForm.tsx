import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InsertUser, SelectUser } from "@/db/schemas-zod";

interface UserFormProps {
	user?: SelectUser;
	onSubmit: (values: Partial<InsertUser>) => void;
	onCancel?: () => void;
	submitLabel?: string;
}

export function UserForm({
	user,
	onSubmit,
	onCancel,
	submitLabel = "提交",
}: UserFormProps) {
	const form = useForm({
		defaultValues: {
			username: user?.username ?? "",
			email: user?.email ?? "",
			displayName: user?.displayName ?? "",
			bio: user?.bio ?? "",
			avatar: user?.avatar ?? "",
		},
		onSubmit: ({ value }) => {
			onSubmit({
				username: value.username,
				email: value.email,
				displayName: value.displayName,
				bio: value.bio || null,
				avatar: value.avatar || null,
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
			{/* Username */}
			<form.Field
				name="username"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 3) {
							return "用户名至少需要 3 个字符";
						}
						if (value.length > 50) {
							return "用户名不能超过 50 个字符";
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>
							用户名 <span className="text-red-500">*</span>
						</Label>
						<Input
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="输入用户名"
							disabled={!!user} // 编辑时禁用用户名
						/>
						{field.state.meta.errors.length > 0 && (
							<p className="text-sm text-red-500">
								{field.state.meta.errors[0]}
							</p>
						)}
					</div>
				)}
			</form.Field>

			{/* Email */}
			<form.Field
				name="email"
				validators={{
					onChange: ({ value }) => {
						if (!value) {
							return "邮箱为必填项";
						}
						if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
							return "请输入有效的邮箱地址";
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>
							邮箱 <span className="text-red-500">*</span>
						</Label>
						<Input
							id={field.name}
							name={field.name}
							type="email"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="输入邮箱"
						/>
						{field.state.meta.errors.length > 0 && (
							<p className="text-sm text-red-500">
								{field.state.meta.errors[0]}
							</p>
						)}
					</div>
				)}
			</form.Field>

			{/* Display Name */}
			<form.Field
				name="displayName"
				validators={{
					onChange: ({ value }) => {
						if (!value || value.length < 1) {
							return "显示名称为必填项";
						}
						if (value.length > 100) {
							return "显示名称不能超过 100 个字符";
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>
							显示名称 <span className="text-red-500">*</span>
						</Label>
						<Input
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="输入显示名称"
						/>
						{field.state.meta.errors.length > 0 && (
							<p className="text-sm text-red-500">
								{field.state.meta.errors[0]}
							</p>
						)}
					</div>
				)}
			</form.Field>

			{/* Bio */}
			<form.Field
				name="bio"
				validators={{
					onChange: ({ value }) => {
						if (value && value.length > 500) {
							return "个人简介不能超过 500 个字符";
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>个人简介</Label>
						<Textarea
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="介绍一下自己..."
							rows={3}
						/>
						{field.state.meta.errors.length > 0 && (
							<p className="text-sm text-red-500">
								{field.state.meta.errors[0]}
							</p>
						)}
					</div>
				)}
			</form.Field>

			{/* Avatar */}
			<form.Field
				name="avatar"
				validators={{
					onChange: ({ value }) => {
						if (value && !/^https?:\/\/.+/.test(value)) {
							return "请输入有效的 URL";
						}
						return undefined;
					},
				}}
			>
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>头像 URL</Label>
						<Input
							id={field.name}
							name={field.name}
							type="url"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="https://example.com/avatar.jpg"
						/>
						{field.state.meta.errors.length > 0 && (
							<p className="text-sm text-red-500">
								{field.state.meta.errors[0]}
							</p>
						)}
					</div>
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
