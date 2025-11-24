import { useLiveQuery } from "@tanstack/react-db";
import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { commentsCollection, currentUserCollection } from "@/db/collections";
import { useErrorHandler } from "@/lib/error-handler";

type ArticleCommentFormProps = {
	articleId: number;
};

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
		}))
	);
	const currentUser = currentUserData?.[0];

	const form = useForm({
		defaultValues: {
			content: "",
		},
		onSubmit: ({ value }) => {
			if (!currentUser?.userId) {
				handleError(new Error("未登录"), "请先选择用户");
				return;
			}

			try {
				// 使用临时 ID (负数)
				const tempId = -Math.floor(Math.random() * 1_000_000);

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
			<div className="rounded-sm border-2 border-foreground border-dashed bg-secondary/30 p-6 text-center">
				<p className="mb-2 font-bold font-mono text-foreground">
					Login Required
				</p>
				<p className="text-muted-foreground text-sm">
					Please select a user to post comments.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-sm border-2 border-foreground bg-muted/20 p-6">
			<div className="mb-4 flex items-center gap-3">
				{currentUser.avatar ? (
					<img
						alt={currentUser.displayName || "用户"}
						className="h-10 w-10 rounded-sm border-2 border-foreground object-cover"
						height={40}
						src={currentUser.avatar}
						width={40}
					/>
				) : (
					<div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-foreground bg-white">
						<span className="font-bold font-mono text-sm">
							{currentUser.displayName?.[0]?.toUpperCase() || "?"}
						</span>
					</div>
				)}
				<div>
					<p className="font-bold font-mono uppercase">
						{currentUser.displayName}
					</p>
					<p className="font-mono text-muted-foreground text-xs">
						Posting a comment...
					</p>
				</div>
			</div>

			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
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
							return;
						},
					}}
				>
					{(field) => (
						<FormField
							field={field}
							inputType="textarea"
							label="YOUR COMMENT"
							placeholder="Write something..."
							required
							rows={4}
						/>
					)}
				</form.Field>

				<div className="flex justify-end">
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button disabled={!canSubmit || isSubmitting} type="submit">
								{isSubmitting ? "POSTING..." : "POST COMMENT"}
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
