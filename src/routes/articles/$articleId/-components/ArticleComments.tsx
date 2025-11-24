import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useArticleCommentsQuery } from "../../-hooks/useArticleCommentsQuery";
import { ArticleCommentForm } from "./ArticleCommentForm";
import { EditCommentDialog } from "../../../comments/-components/EditCommentDialog";
import { DeleteCommentDialog } from "../../../comments/-components/DeleteCommentDialog";

interface ArticleCommentsProps {
	articleId: number;
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
	const { data: comments } = useArticleCommentsQuery(articleId);
	const { userId } = useCurrentUser();

	return (
		<div className="border-t border-gray-200 pt-6 space-y-6">
			<h2 className="text-2xl font-bold text-gray-900">
				评论 {comments?.length ? `(${comments.length})` : ""}
			</h2>

			{/* 评论表单 */}
			<ArticleCommentForm articleId={articleId} />

			{/* 评论列表 */}
			{!comments || comments.length === 0 ? (
				<p className="text-gray-500">暂无评论，来发表第一条评论吧！</p>
			) : (
				<div className="space-y-4">
					{comments.map((comment) => {
						const isAuthor = userId === comment.author?.id;

						return (
							<div
								key={`comment-${comment.id}`}
								className="bg-gray-50 rounded-lg p-4 space-y-2"
							>
								<div className="flex items-start gap-3">
									{comment.author?.avatar ? (
										<img
											src={comment.author.avatar}
											alt={comment.author.displayName}
											className="w-8 h-8 rounded-full"
										/>
									) : (
										<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
											<span className="text-sm text-gray-600">
												{comment.author?.displayName?.[0]?.toUpperCase() || "?"}
											</span>
										</div>
									)}

									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											{comment.author ? (
												<Link
													to="/users/$userId"
													params={{ userId: String(comment.author.id) }}
													className="font-semibold text-gray-900 hover:text-blue-600"
												>
													{comment.author.displayName}
												</Link>
											) : (
												<span className="font-semibold text-gray-500">
													匿名用户
												</span>
											)}
											<span className="text-xs text-gray-500">
												{/* @ts-expect-error - createdAt type inference issue */}
											{new Date(comment.createdAt).toLocaleString("zh-CN")}
											</span>
										</div>
										<p className="text-gray-700">{String(comment.content)}</p>
									</div>

									{isAuthor && (
										<div className="flex gap-2 shrink-0">
											<EditCommentDialog
												commentId={comment.id}
												trigger={
													<Button size="sm" variant="outline">
														编辑
													</Button>
												}
											/>
											<DeleteCommentDialog
												commentId={comment.id}
												trigger={
													<Button size="sm" variant="destructive">
														删除
													</Button>
												}
											/>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
