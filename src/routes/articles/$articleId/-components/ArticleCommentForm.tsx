import { useForm } from "@tanstack/react-form";
import { useLiveQuery } from "@tanstack/react-db";
import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { commentsCollection, currentUserCollection } from "@/db/collections";
import { useErrorHandler } from "@/lib/error-handler";

interface ArticleCommentFormProps {
	articleId: number;
}

export function ArticleCommentForm({ articleId }: ArticleCommentFormProps) {
	const { handleError, addError } = useErrorHandler();

	// 获取当前用户信息
	const { data: currentUserData } = useLiveQuery((q) =>
		q.from({ current: currentUserCollection }).select(({ current }) => ({
			id: current.id,
			userId: current.userId,
			username: current.username,
			displayName: current.displayName,
			avatar: current.avatar,
		})),
	);
	const currentUser = currentUserData?.[0];

	const form = useForm({
		defaultValues: {
			content: "",
		},
		onSubmit: async ({ value }) => {
			if (!currentUser?.userId) {
				handleError(new Error("未登录"), "请先选择用户");
				return;
			}

			try {
				// 使用临时 ID (负数)
				const tempId = -Math.floor(Math.random() * 1000000);

				// 插入评论 - 使用乐观更新
				commentsCollection.insert({
					id: tempId,
					content: value.content,
					articleId,
					authorId: currentUser.userId,
					parentId: null,
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
				});

				// 显示成功提示
				addError({
					id: crypto.randomUUID(),
					title: "评论发表成功",
					message: "你的评论已成功发表",
					type: "info",
					timestamp: new Date(),
				});

				// 重置表单
				form.reset();
			} catch (error) {
				handleError(error, "评论发表失败");
			}
		},
	});

	// 如果没有选择用户，显示提示
	if (!currentUser?.userId) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<p className="text-yellow-800">
					请先在右上角选择一个用户，才能发表评论
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				{currentUser.avatar ? (
					<img
						src={currentUser.avatar}
						alt={currentUser.displayName || "用户"}
						className="w-10 h-10 rounded-full"
					/>
				) : (
					<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
						<span className="text-sm text-gray-600">
							{currentUser.displayName?.[0]?.toUpperCase() || "?"}
						</span>
					</div>
				)}
				<div>
					<p className="font-semibold text-gray-900">
						{currentUser.displayName}
					</p>
					<p className="text-sm text-gray-500">发表评论</p>
				</div>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field
					name="content"
					validators={{
						onChange: ({ value }) => {
							if (!value || value.trim().length < 1) {
								return "评论内容不能为空";
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
							placeholder="写下你的评论..."
							inputType="textarea"
							rows={4}
						/>
					)}
				</form.Field>

				<div className="flex justify-end">
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button type="submit" disabled={!canSubmit || isSubmitting}>
								{isSubmitting ? "发表中..." : "发表评论"}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
