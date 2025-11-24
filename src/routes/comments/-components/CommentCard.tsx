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
		<div className="border-2 border-foreground rounded-sm p-6 bg-white hover:bg-muted/30 transition-colors group">
			<div className="flex items-start gap-4">
				{comment.author?.avatar ? (
					<img
						src={comment.author.avatar}
						alt={comment.author.displayName}
						className="w-12 h-12 rounded-sm border-2 border-foreground object-cover"
					/>
				) : (
					<div className="w-12 h-12 rounded-sm border-2 border-foreground bg-secondary flex items-center justify-center">
						<span className="text-xl font-bold font-mono">
							{comment.author?.displayName[0].toUpperCase()}
						</span>
					</div>
				)}

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2">
							{comment.author && (
								<Link
									to="/users/$userId"
									params={{ userId: String(comment.author.id) }}
									className="font-bold font-mono uppercase hover:text-primary"
								>
									{comment.author.displayName}
								</Link>
							)}
							<span className="text-xs text-muted-foreground font-mono">
								{comment.createdAt.toLocaleDateString("zh-CN")}
							</span>
						</div>
						
						{isAuthor && (
							<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<EditCommentDialog
									commentId={comment.id}
									trigger={
										<Button size="sm" variant="outline" className="h-7 px-2">
											Edit
										</Button>
									}
								/>
								<DeleteCommentDialog
									commentId={comment.id}
									trigger={
										<Button size="sm" variant="destructive" className="h-7 px-2">
											Del
										</Button>
									}
								/>
							</div>
						)}
					</div>
					
					<div className="text-foreground leading-relaxed mb-4">
						{comment.content}
					</div>

					{comment.article && (
						<div className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-sm border border-foreground/10">
							<span className="font-mono text-xs uppercase text-muted-foreground">On Article:</span>
							<Link
								to="/articles/$articleId"
								params={{ articleId: String(comment.article.id) }}
								className="font-bold hover:text-primary truncate"
							>
								{comment.article.title}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
