import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { CommentWithRelations } from "./types";
import { EditCommentDialog } from "./EditCommentDialog";
import { DeleteCommentDialog } from "./DeleteCommentDialog";

interface CommentCardProps {
	comment: CommentWithRelations;
}

export function CommentCard({ comment }: CommentCardProps) {
	const { userId } = useCurrentUser();
	const isAuthor = userId === comment.author?.id;

	return (
		<div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
			<div className="flex items-start gap-3 mb-3">
				{comment.author?.avatar ? (
					<img
						src={comment.author.avatar}
						alt={comment.author.displayName}
						className="w-10 h-10 rounded-full"
					/>
				) : (
					<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
						<span className="text-lg text-gray-500">
							{comment.author?.displayName[0].toUpperCase()}
						</span>
					</div>
				)}

				<div className="flex-1">
					<div className="flex items-center gap-2 mb-1">
						{comment.author && (
							<Link
								to="/users/$userId"
								params={{ userId: String(comment.author.id) }}
								className="font-semibold hover:text-blue-600"
							>
								{comment.author.displayName}
							</Link>
						)}
						<span className="text-sm text-gray-400">
							{comment.createdAt.toLocaleDateString("zh-CN")}
						</span>
					</div>
					<p className="text-gray-700">{comment.content}</p>
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

			{comment.article && (
				<div className="text-sm text-gray-500 pl-13 border-l-2 border-gray-200 ml-13">
					评论文章:{" "}
					<Link
						to="/articles/$articleId"
						params={{ articleId: String(comment.article.id) }}
						className="font-medium hover:text-blue-600"
					>
						{comment.article.title}
					</Link>
				</div>
			)}
		</div>
	);
}
