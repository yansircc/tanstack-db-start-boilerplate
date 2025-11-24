import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DeleteCommentDialog } from "./delete-comment-dialog";
import { EditCommentDialog } from "./edit-comment-dialog";
import type { CommentWithRelations } from "./types";

type CommentCardProps = {
	comment: CommentWithRelations;
};

export function CommentCard({ comment }: CommentCardProps) {
	const { userId } = useCurrentUser();
	const isAuthor = userId === comment.author?.id;

	return (
		<div className="group rounded-sm border-2 border-foreground bg-white p-6 transition-colors hover:bg-muted/30">
			<div className="flex items-start gap-4">
				{comment.author?.avatar ? (
					<img
						alt={comment.author.displayName}
						className="h-12 w-12 rounded-sm border-2 border-foreground object-cover"
						height={48}
						src={comment.author.avatar}
						width={48}
					/>
				) : (
					<div className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-foreground bg-secondary">
						<span className="font-bold font-mono text-xl">
							{comment.author?.displayName[0].toUpperCase()}
						</span>
					</div>
				)}

				<div className="min-w-0 flex-1">
					<div className="mb-2 flex items-center justify-between">
						<div className="flex items-center gap-2">
							{comment.author && (
								<Link
									className="font-bold font-mono uppercase hover:text-primary"
									params={{ userId: String(comment.author.id) }}
									to="/users/$userId"
								>
									{comment.author.displayName}
								</Link>
							)}
							<span className="font-mono text-muted-foreground text-xs">
								{comment.createdAt.toLocaleDateString("zh-CN")}
							</span>
						</div>

						{isAuthor && (
							<div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
								<EditCommentDialog
									commentId={comment.id}
									trigger={
										<Button className="h-7 px-2" size="sm" variant="outline">
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

					<div className="mb-4 text-foreground leading-relaxed">
						{comment.content}
					</div>

					{comment.article && (
						<div className="flex items-center gap-2 rounded-sm border border-foreground/10 bg-muted/50 p-2 text-sm">
							<span className="font-mono text-muted-foreground text-xs uppercase">
								On Article:
							</span>
							<Link
								className="truncate font-bold hover:text-primary"
								params={{ articleId: String(comment.article.id) }}
								to="/articles/$articleId"
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
