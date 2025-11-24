import { Link } from "@tanstack/react-router";
import { useArticleCommentsQuery } from "../../-hooks/useArticleCommentsQuery";

interface ArticleCommentsProps {
	postId: number;
}

export function ArticleComments({ postId }: ArticleCommentsProps) {
	const { data: comments } = useArticleCommentsQuery(postId);

	return (
		<div className="border-t border-gray-200 pt-6 space-y-4">
			<h2 className="text-2xl font-bold text-gray-900">
				评论 {comments?.length ? `(${comments.length})` : ""}
			</h2>

			{!comments || comments.length === 0 ? (
				<p className="text-gray-500">暂无评论</p>
			) : (
				<div className="space-y-4">
					{comments.map((comment) => {
						const author = comment.author as
							| { id: number; displayName: string; avatar: string | null }
							| undefined;
						return (
							<div
								key={comment.id}
								className="bg-gray-50 rounded-lg p-4 space-y-2"
							>
								<div className="flex items-start gap-3">
									{author?.avatar ? (
										<img
											src={author.avatar}
											alt={author.displayName}
											className="w-8 h-8 rounded-full"
										/>
									) : (
										<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
											<span className="text-sm text-gray-600">
												{author?.displayName?.[0]?.toUpperCase() || "?"}
											</span>
										</div>
									)}

									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											{author && (
												<Link
													to="/users/$userId"
													params={{ userId: String(author.id) }}
													className="font-semibold text-gray-900 hover:text-blue-600"
												>
													{author.displayName}
												</Link>
											)}
											<span className="text-xs text-gray-500">
												{comment.createdAt.toLocaleString("zh-CN")}
											</span>
										</div>
										<p className="text-gray-700">{comment.content}</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
