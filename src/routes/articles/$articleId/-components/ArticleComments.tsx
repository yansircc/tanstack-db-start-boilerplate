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
		<div className="space-y-8">
			<div className="flex items-center justify-between border-b-2 border-foreground pb-4">
				<h2 className="text-2xl font-bold font-mono uppercase">
					Comments {comments?.length ? `(${comments.length})` : ""}
				</h2>
			</div>

			{/* 评论表单 */}
			<ArticleCommentForm articleId={articleId} />

			{/* 评论列表 */}
			{!comments || comments.length === 0 ? (
				<div className="border-2 border-dashed border-foreground rounded-sm p-8 text-center text-muted-foreground font-mono">
					No comments yet. Be the first to share your thoughts!
				</div>
			) : (
				<div className="space-y-6">
					{comments.map((comment) => {
						const isAuthor = userId === comment.author?.id;

						return (
							<div
								key={`comment-${comment.id}`}
								className="bg-white border-2 border-foreground rounded-sm p-6 relative group"
							>
								<div className="flex items-start gap-4">
									{comment.author?.avatar ? (
										<img
											src={comment.author.avatar}
											alt={comment.author.displayName}
											className="w-10 h-10 rounded-sm border-2 border-foreground object-cover"
										/>
									) : (
										<div className="w-10 h-10 rounded-sm border-2 border-foreground bg-secondary flex items-center justify-center">
											<span className="text-sm font-bold font-mono">
												{comment.author?.displayName?.[0]?.toUpperCase() || "?"}
											</span>
										</div>
									)}

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-3 mb-2">
											{comment.author ? (
												<Link
													to="/users/$userId"
													params={{ userId: String(comment.author.id) }}
													className="font-bold font-mono uppercase hover:text-primary"
												>
													{comment.author.displayName}
												</Link>
											) : (
												<span className="font-bold font-mono uppercase text-muted-foreground">
													Anonymous
												</span>
											)}
											<span className="text-xs font-mono text-muted-foreground">
												{/* @ts-expect-error - createdAt type inference issue */}
												{new Date(comment.createdAt).toLocaleString("zh-CN")}
											</span>
										</div>
										<p className="text-foreground leading-relaxed whitespace-pre-wrap">
											{String(comment.content)}
										</p>
									</div>

									{isAuthor && (
										<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
											<EditCommentDialog
												commentId={comment.id}
												trigger={
													<Button
														size="sm"
														variant="outline"
														className="h-7 px-2 bg-white"
													>
														Edit
													</Button>
												}
											/>
											<DeleteCommentDialog
												commentId={comment.id}
												trigger={
													<Button
														size="sm"
														variant="destructive"
														className="h-7 px-2"
													>
														Del
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
