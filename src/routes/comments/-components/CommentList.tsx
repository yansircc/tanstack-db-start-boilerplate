import { CommentCard } from "./CommentCard";
import type { CommentWithRelations } from "./types";

interface CommentListProps {
	comments: CommentWithRelations[] | undefined;
}

export function CommentList({ comments }: CommentListProps) {
	if (!comments || comments.length === 0) {
		return <p className="text-gray-500">暂无评论</p>;
	}

	return (
		<div className="space-y-4">
			{comments.map((comment) => (
				<CommentCard key={comment.id} comment={comment} />
			))}
		</div>
	);
}
