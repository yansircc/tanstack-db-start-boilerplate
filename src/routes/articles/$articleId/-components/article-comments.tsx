import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DeleteCommentDialog } from "../../../comments/-components/delete-comment-dialog";
import { EditCommentDialog } from "../../../comments/-components/edit-comment-dialog";
import { useArticleCommentsQuery } from "../../-hooks/use-article-comments-query";
import { ArticleCommentForm } from "./article-comment-form";

type ArticleCommentsProps = {
	articleId: number;
};

export function ArticleComments({ articleId }: ArticleCommentsProps) {
	const { data: comments } = useArticleCommentsQuery(articleId);
	const { userId } = useCurrentUser();

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between border-foreground border-b-2 pb-4">
				<h2 className="font-bold font-mono text-2xl uppercase">
					Comments {comments?.length ? `(${comments.length})` : ""}
				</h2>
			</div>

			{/* 评论表单 */}
			<ArticleCommentForm articleId={articleId} />

			{/* 评论列表 */}
			{!comments || comments.length === 0 ? (
				<div className="rounded-sm border-2 border-foreground border-dashed p-8 text-center font-mono text-muted-foreground">
					No comments yet. Be the first to share your thoughts!
				</div>
			) : (
				<div className="space-y-6">
					{comments.map((comment) => {
						const isAuthor = userId === comment.author?.id;

						return (
							<div
								className="group relative rounded-sm border-2 border-foreground bg-white p-6"
								key={`comment-${comment.id}`}
							>
								<div className="flex items-start gap-4">
									{comment.author?.avatar ? (
										<img
											alt={comment.author.displayName}
											className="h-10 w-10 rounded-sm border-2 border-foreground object-cover"
											height={40}
											src={comment.author.avatar}
											width={40}
										/>
									) : (
										<div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-foreground bg-secondary">
											<span className="font-bold font-mono text-sm">
												{comment.author?.displayName?.[0]?.toUpperCase() || "?"}
											</span>
										</div>
									)}

									<div className="min-w-0 flex-1">
										<div className="mb-2 flex items-center gap-3">
											{comment.author ? (
												<Link
													className="font-bold font-mono uppercase hover:text-primary"
													params={{ userId: String(comment.author.id) }}
													to="/users/$userId"
												>
													{comment.author.displayName}
												</Link>
											) : (
												<span className="font-bold font-mono text-muted-foreground uppercase">
													Anonymous
												</span>
											)}
											<span className="font-mono text-muted-foreground text-xs">
												{new Date(comment.createdAt).toLocaleString("zh-CN")}
											</span>
										</div>
										<p className="whitespace-pre-wrap text-foreground leading-relaxed">
											{String(comment.content)}
										</p>
									</div>

									{isAuthor && (
										<div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
											<EditCommentDialog
												commentId={comment.id}
												trigger={
													<Button
														className="h-7 bg-white px-2"
														size="sm"
														variant="outline"
													>
														Edit
													</Button>
												}
											/>
											<DeleteCommentDialog
												commentId={comment.id}
												trigger={
													<Button
														className="h-7 px-2"
														size="sm"
														variant="destructive"
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
