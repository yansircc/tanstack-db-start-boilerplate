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
			<div className="bg-secondary/30 border-2 border-foreground border-dashed rounded-sm p-6 text-center">
				<p className="font-mono text-foreground font-bold mb-2">Login Required</p>
				<p className="text-muted-foreground text-sm">Please select a user to post comments.</p>
			</div>
		);
	}

	return (
		<div className="border-2 border-foreground rounded-sm p-6 bg-muted/20">
			<div className="flex items-center gap-3 mb-4">
				{currentUser.avatar ? (
					<img
						src={currentUser.avatar}
						alt={currentUser.displayName || "用户"}
						className="w-10 h-10 rounded-sm border-2 border-foreground object-cover"
					/>
				) : (
					<div className="w-10 h-10 rounded-sm border-2 border-foreground bg-white flex items-center justify-center">
						<span className="text-sm font-bold font-mono">
							{currentUser.displayName?.[0]?.toUpperCase() || "?"}
						</span>
					</div>
				)}
				<div>
					<p className="font-bold font-mono uppercase">
						{currentUser.displayName}
					</p>
					<p className="text-xs text-muted-foreground font-mono">Posting a comment...</p>
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
								return "Content is required";
							}
							if (value.length > 2000) {
								return "Max 2000 characters";
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<FormField
							field={field}
							label="YOUR COMMENT"
							required
							placeholder="Write something..."
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
								{isSubmitting ? "POSTING..." : "POST COMMENT"}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
